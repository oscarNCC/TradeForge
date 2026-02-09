import { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';
import * as TradeModel from '../models/Trade';
import { findAccountById, findAccountsByUserId, refreshAccountBalance } from '../models/Account';
import { calculatePnL, calculatePnLPercent } from '../utils/tradeCalculations';

interface CSVRow {
    Account: string;
    'T/D': string;
    Side: string;
    Symbol: string;
    Qty: string;
    Price: string;
    'Exec Time': string;
    Comm: string;
    [key: string]: string;
}

export async function importCSV(req: Request, res: Response): Promise<void> {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    try {
        const fileContent = req.file.buffer.toString();
        const records: CSVRow[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        if (records.length === 0) {
            res.status(400).json({ error: 'Empty CSV file' });
            return;
        }

        const { target_account_id } = req.body;
        if (!target_account_id) {
            res.status(400).json({ error: 'Target account ID is required' });
            return;
        }

        // Verify target account ownership
        const account = await findAccountById(parseInt(target_account_id), req.user.id);
        if (!account) {
            res.status(403).json({ message: 'Forbidden: Target account does not belong to user' });
            return;
        }

        const accountId = account.id;

        // Group executions by Symbol and potentially Account (if multiple accounts in CSV)
        // For simplicity, we process them in sequence for each symbol.
        // A trade is formed when position goes from 0 to non-zero and back to 0.

        const symbolGroups: { [symbol: string]: CSVRow[] } = {};
        for (const row of records) {
            if (!symbolGroups[row.Symbol]) symbolGroups[row.Symbol] = [];
            symbolGroups[row.Symbol].push(row);
        }

        const tradesToCreate: any[] = [];
        const errors: string[] = [];

        for (const symbol in symbolGroups) {
            const rows = symbolGroups[symbol];
            let currentPos = 0;
            let tempFills: CSVRow[] = [];
            let currentDirection: 'long' | 'short' | null = null;

            for (const row of rows) {
                const qty = parseInt(row.Qty);
                const side = row.Side; // B or S
                const price = parseFloat(row.Price);

                if (currentPos === 0) {
                    // New trade starting
                    currentDirection = side === 'B' ? 'long' : 'short';
                }

                tempFills.push(row);

                if (side === 'B') {
                    currentPos += qty;
                } else {
                    currentPos -= qty;
                }

                if (currentPos === 0 && tempFills.length > 0) {
                    // Trade completed
                    // Use the user-selected accountId

                    // Separate entry fills and exit fills
                    const firstSide = tempFills[0].Side;
                    const entryFills = tempFills.filter(f => f.Side === firstSide);
                    const exitFills = tempFills.filter(f => f.Side !== firstSide);

                    const totalEntryQty = entryFills.reduce((sum, f) => sum + parseInt(f.Qty), 0);
                    const avgEntryPrice = entryFills.reduce((sum, f) => sum + (parseFloat(f.Price) * parseInt(f.Qty)), 0) / totalEntryQty;

                    const totalExitQty = exitFills.reduce((sum, f) => sum + parseInt(f.Qty), 0);
                    const avgExitPrice = exitFills.reduce((sum, f) => sum + (parseFloat(f.Price) * parseInt(f.Qty)), 0) / totalExitQty;

                    const totalComm = tempFills.reduce((sum, f) => sum + parseFloat(f.Comm || '0'), 0);

                    // Construct Trade Data
                    // Date format in CSV: 01/02/2020 (MDY or DMY? Assuming MDY based on context)
                    // We'll try to parse it safely.
                    const parseTime = (dateStr: string, timeStr: string) => {
                        const parts = dateStr.split('/');
                        // Assuming MM/DD/YYYY
                        return new Date(`${parts[2]}-${parts[0]}-${parts[1]}T${timeStr}`).toISOString();
                    };

                    const pnl = calculatePnL(avgEntryPrice, avgExitPrice, totalEntryQty, currentDirection as any, totalComm);
                    const pnl_percent = calculatePnLPercent(avgEntryPrice, avgExitPrice, currentDirection as any);

                    tradesToCreate.push({
                        account_id: accountId,
                        symbol: symbol,
                        entry_price: avgEntryPrice,
                        entry_time: parseTime(tempFills[0]['T/D'] || tempFills[0]['S/D'], tempFills[0]['Exec Time']),
                        exit_price: avgExitPrice,
                        exit_time: parseTime(exitFills[0]['T/D'] || exitFills[0]['S/D'], exitFills[0]['Exec Time']),
                        quantity: totalEntryQty,
                        direction: currentDirection,
                        pnl,
                        pnl_percent,
                        commission: totalComm,
                        status: 'closed'
                    });

                    tempFills = [];
                    currentDirection = null;
                }
            }

            if (currentPos !== 0) {
                // Open trade left over
                if (accountId) {
                    const totalEntryQty = Math.abs(currentPos); // Simplified
                    const avgEntryPrice = tempFills.reduce((sum, f) => sum + (parseFloat(f.Price) * parseInt(f.Qty)), 0) / tempFills.reduce((sum, f) => sum + parseInt(f.Qty), 0);

                    const parseTime = (dateStr: string, timeStr: string) => {
                        const parts = dateStr.split('/');
                        return new Date(`${parts[2]}-${parts[0]}-${parts[1]}T${timeStr}`).toISOString();
                    };

                    tradesToCreate.push({
                        account_id: accountId,
                        symbol: symbol,
                        entry_price: avgEntryPrice,
                        entry_time: parseTime(tempFills[0]['T/D'] || tempFills[0]['S/D'], tempFills[0]['Exec Time']),
                        quantity: totalEntryQty,
                        direction: currentDirection,
                        status: 'open'
                    });
                }
            }
        }

        // Insert trades
        const createdTrades = [];
        for (const tradeData of tradesToCreate) {
            const trade = await TradeModel.createTrade(tradeData);
            createdTrades.push(trade);
        }

        // Recalculate balance for the target account
        await refreshAccountBalance(accountId);

        res.status(201).json({
            message: `Successfully imported ${createdTrades.length} trades`,
            count: createdTrades.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Error importing CSV:', error);
        res.status(500).json({ error: 'Internal server error during CSV processing' });
    }
}

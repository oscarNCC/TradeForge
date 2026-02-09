import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as TradeModel from '../models/Trade';
import * as TradeLegModel from '../models/TradeLeg';
import { findAccountById, refreshAccountBalance } from '../models/Account';
import { calculatePnL, calculatePnLPercent, calculateMultiLegPnL } from '../utils/tradeCalculations';

export async function createTrade(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const tradeData = req.body;

        // Verify account ownership
        const account = await findAccountById(tradeData.account_id, req.user.id);
        if (!account) {
            res.status(403).json({ message: 'Forbidden: Account does not belong to user' });
            return;
        }

        let pnl = tradeData.pnl;
        let pnl_percent = tradeData.pnl_percent;

        // Auto-calculate P&L if exit price and time are provided
        if (tradeData.exit_price !== undefined && tradeData.exit_price !== null) {
            pnl = calculatePnL(
                tradeData.entry_price,
                tradeData.exit_price,
                tradeData.quantity,
                tradeData.direction,
                tradeData.commission ?? 0
            );
            pnl_percent = calculatePnLPercent(
                tradeData.entry_price,
                tradeData.exit_price,
                tradeData.direction
            );
        }

        const trade = await TradeModel.createTrade({
            ...tradeData,
            pnl,
            pnl_percent,
            status: tradeData.status || (tradeData.exit_price ? 'closed' : 'open')
        });

        let legs: TradeLegModel.TradeLeg[] = [];
        if (tradeData.legs && Array.isArray(tradeData.legs)) {
            legs = await TradeLegModel.createLegs(trade.id, tradeData.legs);
        }

        await refreshAccountBalance(trade.account_id);

        res.status(201).json({ ...trade, legs });
    } catch (error) {
        console.error('Error creating trade:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getTrades(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const accountId = parseInt(String(req.query.account_id));

        // Verify account ownership
        const account = await findAccountById(accountId, req.user.id);
        if (!account) {
            res.status(403).json({ message: 'Forbidden: Account does not belong to user' });
            return;
        }

        const status = req.query.status as TradeModel.TradeStatus;
        const limit = parseInt(String(req.query.limit || '50'));
        const page = parseInt(String(req.query.page || '1'));
        const offset = (page - 1) * limit;

        const trades = await TradeModel.findTradesByAccountId(accountId, { status, limit, offset });
        const total = await TradeModel.countTradesByAccountId(accountId, status);

        res.json({
            data: trades,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching trades:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getTradeById(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const id = parseInt(String(req.params.id));
        const trade = await TradeModel.findTradeById(id, req.user.id);

        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        const legs = await TradeLegModel.findLegsByTradeId(id);
        res.json({ ...trade, legs });
    } catch (error) {
        console.error('Error fetching trade details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function updateTrade(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const id = parseInt(String(req.params.id));
        const tradeData = req.body;

        // Re-calculate P&L if relevant fields change
        const existingTrade = await TradeModel.findTradeById(id, req.user.id);
        if (!existingTrade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        // Determine new values
        const entry_price = tradeData.entry_price ?? parseFloat(existingTrade.entry_price);
        const exit_price = tradeData.exit_price !== undefined ? tradeData.exit_price : (existingTrade.exit_price ? parseFloat(existingTrade.exit_price) : null);
        const quantity = tradeData.quantity ?? existingTrade.quantity;
        const direction = tradeData.direction ?? existingTrade.direction;
        const commission = tradeData.commission ?? (existingTrade.commission ? parseFloat(existingTrade.commission) : 0);

        if (exit_price !== null && exit_price !== undefined) {
            tradeData.pnl = calculatePnL(entry_price, exit_price, quantity, direction as any, commission);
            tradeData.pnl_percent = calculatePnLPercent(entry_price, exit_price, direction as any);
            if (!tradeData.status) tradeData.status = 'closed';
        }

        const updatedTrade = await TradeModel.updateTrade(id, req.user.id, tradeData);

        if (tradeData.legs && Array.isArray(tradeData.legs)) {
            await TradeLegModel.updateLegsForTrade(id, tradeData.legs);
        }

        const finalTrade = await TradeModel.findTradeById(id, req.user.id);
        const legs = await TradeLegModel.findLegsByTradeId(id);

        if (finalTrade) {
            await refreshAccountBalance(finalTrade.account_id);
        }

        res.json({ ...finalTrade, legs });
    } catch (error) {
        console.error('Error updating trade:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function closeTrade(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const id = parseInt(String(req.params.id));
        const { exit_price, exit_time } = req.body;

        const existingTrade = await TradeModel.findTradeById(id, req.user.id);
        if (!existingTrade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        const entry_price = parseFloat(existingTrade.entry_price);
        const quantity = existingTrade.quantity;
        const direction = existingTrade.direction;
        const commission = existingTrade.commission ? parseFloat(existingTrade.commission) : 0;

        const pnl = calculatePnL(entry_price, exit_price, quantity, direction as any, commission);
        const pnl_percent = calculatePnLPercent(entry_price, exit_price, direction as any);

        const updatedTrade = await TradeModel.updateTrade(id, req.user.id, {
            exit_price,
            exit_time,
            pnl,
            pnl_percent,
            status: 'closed'
        });

        if (updatedTrade) {
            await refreshAccountBalance(updatedTrade.account_id);
        }

        res.json(updatedTrade);
    } catch (error) {
        console.error('Error closing trade:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function deleteTrade(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }

        const id = parseInt(String(req.params.id));

        // Fetch trade first to get accountId for balance refresh
        const trade = await TradeModel.findTradeById(id, req.user.id);
        if (!trade) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        // Cleanup legs first
        await TradeLegModel.deleteLegsByTradeId(id);

        const success = await TradeModel.deleteTrade(id, req.user.id);

        if (!success) {
            res.status(404).json({ message: 'Trade not found' });
            return;
        }

        // Recalculate balance
        await refreshAccountBalance(trade.account_id);

        res.json({ message: 'Trade deleted successfully' });
    } catch (error) {
        console.error('Error deleting trade:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

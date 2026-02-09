import { Request, Response } from 'express';
import * as TradeModel from '../models/Trade';
import { findAccountById } from '../models/Account';
import * as Calc from '../utils/analyticsCalculator';

export async function getSummary(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const initialCapital = parseFloat(account.initial_capital || '0');

        const summary = Calc.getSummaryMetrics(trades, initialCapital);
        res.json(summary);
    } catch (error) {
        console.error(`Error in getSummary for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
    }
}

export async function getDailyStats(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const closed = trades.filter(t => t.status === 'closed');

        const stats = Calc.calculateDailyPnL(closed);
        res.json(stats);
    } catch (error) {
        console.error(`Error in getDailyStats for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getMonthlyStats(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const closed = trades.filter(t => t.status === 'closed');

        const stats = Calc.calculateMonthlyPnL(closed);
        res.json(stats);
    } catch (error) {
        console.error(`Error in getMonthlyStats for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getBySetup(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const closed = trades.filter(t => t.status === 'closed');

        const stats = Calc.calculatePnLBySetup(closed);
        res.json(stats);
    } catch (error) {
        console.error(`Error in getBySetup for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getByTimeSession(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const closed = trades.filter(t => t.status === 'closed');

        const stats = Calc.calculatePnLByTimeSession(closed);
        res.json(stats);
    } catch (error) {
        console.error(`Error in getByTimeSession for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getEquityCurve(req: Request, res: Response): Promise<void> {
    try {
        const accountId = parseInt(req.query.account_id as string);
        if (isNaN(accountId)) {
            res.status(400).json({ error: 'Invalid account ID' });
            return;
        }

        const account = await findAccountById(accountId, req.user!.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const options: any = { limit: 10000 };
        if (req.query.startDate) options.startDate = req.query.startDate as string;
        if (req.query.endDate) options.endDate = req.query.endDate as string;

        const trades = await TradeModel.findTradesByAccountId(accountId, options);
        const closed = trades.filter(t => t.status === 'closed');
        const initialCapital = parseFloat(account.initial_capital || '0');

        const curve = Calc.calculateEquityCurve(closed, initialCapital);
        res.json(curve);
    } catch (error) {
        console.error(`Error in getEquityCurve for account ${req.query.account_id}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

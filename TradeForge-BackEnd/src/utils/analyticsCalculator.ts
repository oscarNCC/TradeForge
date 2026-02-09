import { Trade } from '../models/Trade';

export interface PerformanceMetrics {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    totalPnL: number;
    avgWin: number;
    avgLoss: number;
    maxDrawdown: number;
    sharpeRatio: number;
    consecutiveWins: number;
    consecutiveLosses: number;
}

export interface ChartPoint {
    label: string;
    value: number;
    count?: number;
}

/**
 * Basic Metrics Calculations
 */
export function calculateWinRate(trades: Trade[]): number {
    const closed = trades.filter(t => t.status === 'closed');
    if (closed.length === 0) return 0;
    const wins = closed.filter(t => parseFloat(t.pnl || '0') > 0).length;
    return (wins / closed.length) * 100;
}

export function calculateProfitFactor(trades: Trade[]): number {
    let grossProfit = 0;
    let grossLoss = 0;

    trades.forEach(t => {
        if (t.status !== 'closed') return;
        const pnl = parseFloat(t.pnl || '0');
        if (pnl > 0) grossProfit += pnl;
        else grossLoss += Math.abs(pnl);
    });

    if (grossLoss === 0) return grossProfit > 0 ? 99.99 : 0;
    return grossProfit / grossLoss;
}

export function calculateMaxDrawdown(trades: Trade[], initialCapital: number): number {
    let peak = initialCapital;
    let currentEquity = initialCapital;
    let maxDD = 0;

    // Filter and sort trades by entry time to simulate equity curve
    const sortedTrades = trades
        .filter(t => t.status === 'closed' && t.entry_time && !isNaN(new Date(t.entry_time).getTime()))
        .sort((a, b) =>
            new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
        );

    sortedTrades.forEach(t => {
        currentEquity += parseFloat(t.pnl || '0');
        if (currentEquity > peak) {
            peak = currentEquity;
        }
        const dd = peak - currentEquity;
        if (dd > maxDD) {
            maxDD = dd;
        }
    });

    return maxDD;
}

export function calculateConsecutiveWins(trades: Trade[]): number {
    let maxConsec = 0;
    let currentConsec = 0;

    const sortedTrades = trades
        .filter(t => t.status === 'closed' && t.entry_time && !isNaN(new Date(t.entry_time).getTime()))
        .sort((a, b) =>
            new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
        );

    sortedTrades.forEach(t => {
        if (parseFloat(t.pnl || '0') > 0) {
            currentConsec++;
            if (currentConsec > maxConsec) maxConsec = currentConsec;
        } else {
            currentConsec = 0;
        }
    });

    return maxConsec;
}

export function calculateConsecutiveLosses(trades: Trade[]): number {
    let maxConsec = 0;
    let currentConsec = 0;

    const sortedTrades = trades
        .filter(t => t.status === 'closed' && t.entry_time && !isNaN(new Date(t.entry_time).getTime()))
        .sort((a, b) =>
            new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
        );

    sortedTrades.forEach(t => {
        if (parseFloat(t.pnl || '0') < 0) {
            currentConsec++;
            if (currentConsec > maxConsec) maxConsec = currentConsec;
        } else {
            currentConsec = 0;
        }
    });

    return maxConsec;
}

/**
 * Grouped Statistics
 */

export function calculateMonthlyPnL(trades: Trade[]): ChartPoint[] {
    const groups: Record<string, number> = {};

    trades.forEach(t => {
        if (!t.entry_time) return;
        const date = new Date(t.entry_time);
        if (isNaN(date.getTime())) return;

        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        groups[key] = (groups[key] || 0) + parseFloat(t.pnl || '0');
    });

    return Object.entries(groups)
        .sort()
        .map(([label, value]) => ({ label, value }));
}

export function calculateDailyPnL(trades: Trade[]): ChartPoint[] {
    const groups: Record<string, number> = {};

    trades.forEach(t => {
        if (!t.entry_time) return;
        const date = new Date(t.entry_time);
        if (isNaN(date.getTime())) return;

        const key = date.toISOString().split('T')[0];
        groups[key] = (groups[key] || 0) + parseFloat(t.pnl || '0');
    });

    return Object.entries(groups)
        .sort()
        .map(([label, value]) => ({ label, value }));
}

export function calculatePnLBySetup(trades: Trade[]): ChartPoint[] {
    const groups: Record<string, { pnl: number, count: number }> = {};

    trades.forEach(t => {
        const key = t.setup_type || 'Unknown';
        if (!groups[key]) groups[key] = { pnl: 0, count: 0 };
        groups[key].pnl += parseFloat(t.pnl || '0');
        groups[key].count += 1;
    });

    return Object.entries(groups).map(([label, data]) => ({
        label,
        value: data.pnl,
        count: data.count
    }));
}

export function calculatePnLByTimeSession(trades: Trade[]): ChartPoint[] {
    const groups: Record<string, { pnl: number, count: number }> = {};

    trades.forEach(t => {
        if (!t.entry_time) return;
        const date = new Date(t.entry_time);
        if (isNaN(date.getTime())) return;

        const hour = String(date.getHours()).padStart(2, '0') + ':00';

        if (!groups[hour]) groups[hour] = { pnl: 0, count: 0 };
        groups[hour].pnl += parseFloat(t.pnl || '0');
        groups[hour].count += 1;
    });

    return Object.entries(groups)
        .sort()
        .map(([label, data]) => ({
            label,
            value: data.pnl,
            count: data.count
        }));
}

export function calculateEquityCurve(trades: Trade[], initialCapital: number): ChartPoint[] {
    const sortedTrades = trades
        .filter(t => t.status === 'closed' && t.entry_time && !isNaN(new Date(t.entry_time).getTime()))
        .sort((a, b) =>
            new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
        );

    let currentEquity = initialCapital;
    const curve: ChartPoint[] = [{ label: 'Start', value: currentEquity }];

    sortedTrades.forEach(t => {
        currentEquity += parseFloat(t.pnl || '0');
        const date = new Date(t.entry_time);
        curve.push({
            label: date.toLocaleDateString(),
            value: currentEquity
        });
    });

    return curve;
}

export function calculateSharpeRatio(trades: Trade[]): number {
    const closed = trades.filter(t => t.status === 'closed');
    if (closed.length < 2) return 0;

    const pnls = closed.map(t => parseFloat(t.pnl || '0'));
    const mean = pnls.reduce((a, b) => a + b, 0) / pnls.length;

    const variance = pnls.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / pnls.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;
    return mean / stdDev;
}

export function getSummaryMetrics(trades: Trade[], initialCapital: number): PerformanceMetrics {
    const closedTrades = trades.filter(t => t.status === 'closed');

    // Win Rate and Profit Factor already filter for 'closed' in their respective functions
    const totalPnL = closedTrades.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0);
    const wins = closedTrades.filter(t => parseFloat(t.pnl || '0') > 0);
    const losses = closedTrades.filter(t => parseFloat(t.pnl || '0') < 0);

    return {
        totalTrades: closedTrades.length,
        winRate: calculateWinRate(closedTrades),
        profitFactor: calculateProfitFactor(closedTrades),
        totalPnL,
        avgWin: wins.length > 0 ? wins.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0) / wins.length : 0,
        avgLoss: losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0) / losses.length) : 0,
        maxDrawdown: calculateMaxDrawdown(closedTrades, initialCapital),
        sharpeRatio: calculateSharpeRatio(closedTrades),
        consecutiveWins: calculateConsecutiveWins(closedTrades),
        consecutiveLosses: calculateConsecutiveLosses(closedTrades)
    };
}

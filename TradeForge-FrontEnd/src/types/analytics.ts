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

export interface AnalyticsSummary extends PerformanceMetrics { }

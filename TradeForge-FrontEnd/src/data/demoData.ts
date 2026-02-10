import type { PerformanceMetrics, ChartPoint } from '../types/analytics';
import type { Trade } from '../types/trade';

/** Demo accounts for landing page Accounts section preview */
export interface DemoAccount {
  id: number;
  account_name: string;
  account_type: string | null;
  broker: string | null;
  current_balance: string | number | null;
}

export const demoAccounts: DemoAccount[] = [
  { id: 1, account_name: 'test', account_type: 'demo_funded', broker: 'Simulation', current_balance: 112450.75 },
  { id: 2, account_name: 'Main Live', account_type: 'live', broker: 'Interactive Brokers', current_balance: 87520.32 },
  { id: 3, account_name: 'Eval Challenge', account_type: 'eval', broker: 'Topstep', current_balance: 100000 },
];

export const demoSummary: PerformanceMetrics = {
  totalTrades: 847,
  winRate: 53.7,
  profitFactor: 1.93,
  totalPnL: 207556.6,
  avgWin: 667.16,
  avgLoss: 399.94,
  maxDrawdown: 8151.4,
  sharpeRatio: 0.21,
  consecutiveWins: 10,
  consecutiveLosses: 10,
};

export const demoPeriodToday: PerformanceMetrics = {
  totalTrades: 124,
  winRate: 54.3,
  profitFactor: 1.58,
  totalPnL: 27008.44,
  avgWin: 760.28,
  avgLoss: 480.82,
  maxDrawdown: 1200,
  sharpeRatio: 0.35,
  consecutiveWins: 6,
  consecutiveLosses: 3,
};

export const demoPeriodMonth: PerformanceMetrics = {
  totalTrades: 847,
  winRate: 55.2,
  profitFactor: 1.93,
  totalPnL: 38364.24,
  avgWin: 776.05,
  avgLoss: 459.23,
  maxDrawdown: 8151.4,
  sharpeRatio: 0.21,
  consecutiveWins: 10,
  consecutiveLosses: 10,
};

export const demoEquityCurve: ChartPoint[] = [
  { label: '2025-09', value: 100000 },
  { label: '2025-10', value: 102400 },
  { label: '2025-11', value: 105100 },
  { label: '2025-12', value: 103200 },
  { label: '2026-01', value: 107800 },
  { label: '2026-02', value: 111250 },
  { label: '2026-03', value: 112450 },
  { label: '2026-04', value: 207556 },
];

export const demoSetupStats: ChartPoint[] = [
  { label: 'Pullback', value: 3200 },
  { label: 'Breakout', value: 4100 },
  { label: 'Reversal', value: 1800 },
  { label: 'Trend Following', value: 2550 },
  { label: 'Scalp', value: 900 },
  { label: 'Mean Reversion', value: 1200 },
  { label: 'Dip Buy', value: 700 },
];

export const demoSetupStatsWithCount: (ChartPoint & { count?: number })[] = [
  { label: 'Breakout', value: 32066.49, count: 166 },
  { label: 'Trend Following', value: 23550.4, count: 159 },
  { label: 'Reversal', value: 26217.4, count: 168 },
  { label: 'Dip Buy', value: 24138.83, count: 177 },
  { label: 'Pullback', value: 14097.7, count: 170 },
  { label: 'Mean Reversion', value: 43282.44, count: 184 },
  { label: 'Scalp', value: 44203.34, count: 178 },
];

export const demoMonthlyPnL: ChartPoint[] = [
  { label: '2025-09', value: 2400 },
  { label: '2025-10', value: 2700 },
  { label: '2025-11', value: -1900 },
  { label: '2025-12', value: 4600 },
  { label: '2026-01', value: 5800 },
  { label: '2026-02', value: 3450 },
  { label: '2026-03', value: 12100 },
];

export const demoSessionStats: ChartPoint[] = [
  { label: '09:00', value: 5200 },
  { label: '10:00', value: 3100 },
  { label: '11:00', value: -800 },
  { label: '12:00', value: 2400 },
  { label: '13:00', value: 4500 },
  { label: '14:00', value: 6800 },
  { label: '15:00', value: 2100 },
  { label: '16:00', value: -1200 },
];

const feb2026Daily: Record<number, number> = {
  1: 2895.94, 2: -155.07, 3: 131.28, 4: 212.51, 5: -1240.27, 6: 3355.62, 7: 2409.98,
  8: 3728.68, 9: -1050.71, 10: -2003.16, 11: 13.67, 12: -954.74, 13: 52.41, 14: 2023.41,
  15: 276.84, 16: 2316.71, 17: 586.3, 20: 3240.87, 21: 2399.11, 22: -0.36, 23: 1860.18,
  24: 345.6, 25: 114.26, 26: 3214.53, 27: -2322.74, 28: -2.3,
};

export const demoDailyPnL: ChartPoint[] = Object.entries(feb2026Daily).map(([day, value]) => ({
  label: `2026-02-${String(day).padStart(2, '0')}`,
  value,
}));

const journalTrades: Omit<Trade, 'id' | 'created_at' | 'updated_at'>[] = [
  { account_id: 1, symbol: 'MSFT', direction: 'short', entry_price: 530.96, entry_time: '2026-03-31T09:29:00.000Z', exit_price: 533.29, exit_time: '2026-03-31T10:00:00.000Z', quantity: 76, pnl: -177.63, pnl_percent: -44, status: 'closed' },
  { account_id: 1, symbol: 'MSFT', direction: 'long', entry_price: 824.98, entry_time: '2026-03-31T06:23:00.000Z', exit_price: 816.87, exit_time: '2026-03-31T07:00:00.000Z', quantity: 34, pnl: -275.76, pnl_percent: -98, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'short', entry_price: 811.95, entry_time: '2026-03-30T22:39:00.000Z', exit_price: 807.97, exit_time: '2026-03-30T23:00:00.000Z', quantity: 63, pnl: 250.88, pnl_percent: 49, status: 'closed' },
  { account_id: 1, symbol: 'AAPL', direction: 'long', entry_price: 108.54, entry_time: '2026-03-30T00:01:00.000Z', exit_price: 106.3, exit_time: '2026-03-30T01:00:00.000Z', quantity: 21, pnl: -46.96, pnl_percent: -206, status: 'closed' },
  { account_id: 1, symbol: 'TSLA', direction: 'short', entry_price: 958.99, entry_time: '2026-03-29T23:00:00.000Z', exit_price: 978.96, exit_time: '2026-03-30T00:00:00.000Z', quantity: 88, pnl: -1757.19, pnl_percent: -208, status: 'closed' },
  { account_id: 1, symbol: 'MSFT', direction: 'short', entry_price: 756.4, entry_time: '2026-03-29T19:36:00.000Z', exit_price: 761.59, exit_time: '2026-03-29T20:00:00.000Z', quantity: 97, pnl: -503.38, pnl_percent: -69, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'short', entry_price: 989.82, entry_time: '2026-03-29T09:51:00.000Z', exit_price: 1014.21, exit_time: '2026-03-29T10:30:00.000Z', quantity: 84, pnl: -2048.53, pnl_percent: -246, status: 'closed' },
  { account_id: 1, symbol: 'META', direction: 'short', entry_price: 409.61, entry_time: '2026-03-28T18:10:00.000Z', exit_price: 418.08, exit_time: '2026-03-28T19:00:00.000Z', quantity: 71, pnl: -600.99, pnl_percent: -207, status: 'closed' },
  { account_id: 1, symbol: 'AMD', direction: 'short', entry_price: 799.82, entry_time: '2026-03-28T09:31:00.000Z', exit_price: 820.69, exit_time: '2026-03-28T10:00:00.000Z', quantity: 5, pnl: -104.36, pnl_percent: -261, status: 'closed' },
  { account_id: 1, symbol: 'TSLA', direction: 'short', entry_price: 209.67, entry_time: '2026-03-28T00:58:00.000Z', exit_price: 205.63, exit_time: '2026-03-28T01:30:00.000Z', quantity: 59, pnl: 238.24, pnl_percent: 193, status: 'closed' },
  { account_id: 1, symbol: 'QQQ', direction: 'long', entry_price: 383.08, entry_time: '2026-03-27T16:00:00.000Z', exit_price: 371.83, exit_time: '2026-03-27T17:00:00.000Z', quantity: 31, pnl: -348.56, pnl_percent: -294, status: 'closed' },
  { account_id: 1, symbol: 'MSFT', direction: 'long', entry_price: 523.95, entry_time: '2026-03-27T14:40:00.000Z', exit_price: 509.17, exit_time: '2026-03-27T15:00:00.000Z', quantity: 99, pnl: -1463.74, pnl_percent: -282, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'long', entry_price: 903.47, entry_time: '2026-03-27T13:30:00.000Z', exit_price: 938.8, exit_time: '2026-03-27T14:00:00.000Z', quantity: 51, pnl: 1801.58, pnl_percent: 391, status: 'closed' },
  { account_id: 1, symbol: 'SPY', direction: 'short', entry_price: 938.41, entry_time: '2026-03-27T08:34:00.000Z', exit_price: 963.25, exit_time: '2026-03-27T09:00:00.000Z', quantity: 57, pnl: -1416.42, pnl_percent: -265, status: 'closed' },
  { account_id: 1, symbol: 'TSLA', direction: 'long', entry_price: 970.86, entry_time: '2026-03-27T05:53:00.000Z', exit_price: 992.94, exit_time: '2026-03-27T06:30:00.000Z', quantity: 16, pnl: 353.29, pnl_percent: 227, status: 'closed' },
  { account_id: 1, symbol: 'SPY', direction: 'short', entry_price: 541.15, entry_time: '2026-03-27T04:42:00.000Z', exit_price: 537.49, exit_time: '2026-03-27T05:00:00.000Z', quantity: 40, pnl: 146.25, pnl_percent: 68, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'short', entry_price: 766.47, entry_time: '2026-03-26T17:55:00.000Z', exit_price: 780.46, exit_time: '2026-03-26T18:30:00.000Z', quantity: 57, pnl: -797.18, pnl_percent: -182, status: 'closed' },
  { account_id: 1, symbol: 'GOOGL', direction: 'long', entry_price: 674.28, entry_time: '2026-03-26T03:14:00.000Z', exit_price: 670.34, exit_time: '2026-03-26T04:00:00.000Z', quantity: 58, pnl: -228.78, pnl_percent: -58, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'short', entry_price: 702.59, entry_time: '2026-03-25T23:27:00.000Z', exit_price: 691.28, exit_time: '2026-03-26T00:00:00.000Z', quantity: 52, pnl: 588.51, pnl_percent: 161, status: 'closed' },
  { account_id: 1, symbol: 'AMZN', direction: 'short', entry_price: 858.89, entry_time: '2026-03-25T16:33:00.000Z', exit_price: 871.43, exit_time: '2026-03-25T17:00:00.000Z', quantity: 66, pnl: -827.93, pnl_percent: -146, status: 'closed' },
  { account_id: 1, symbol: 'AMD', direction: 'long', entry_price: 848.11, entry_time: '2026-03-25T09:33:00.000Z', exit_price: 838.78, exit_time: '2026-03-25T10:00:00.000Z', quantity: 100, pnl: -932.74, pnl_percent: -110, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'short', entry_price: 598.43, entry_time: '2026-03-25T08:28:00.000Z', exit_price: 569.3, exit_time: '2026-03-25T09:00:00.000Z', quantity: 8, pnl: 233.08, pnl_percent: 487, status: 'closed' },
  { account_id: 1, symbol: 'QQQ', direction: 'long', entry_price: 118.12, entry_time: '2026-03-25T01:35:00.000Z', exit_price: 116.9, exit_time: '2026-03-25T02:00:00.000Z', quantity: 33, pnl: -40.23, pnl_percent: -103, status: 'closed' },
  { account_id: 1, symbol: 'TSLA', direction: 'short', entry_price: 616.23, entry_time: '2026-03-24T15:36:00.000Z', exit_price: 593.54, exit_time: '2026-03-24T16:00:00.000Z', quantity: 98, pnl: 2222.81, pnl_percent: 368, status: 'closed' },
  { account_id: 1, symbol: 'AMD', direction: 'short', entry_price: 304.02, entry_time: '2026-03-24T14:36:00.000Z', exit_price: 304.51, exit_time: '2026-03-24T15:00:00.000Z', quantity: 81, pnl: -39.25, pnl_percent: -16, status: 'closed' },
  { account_id: 1, symbol: 'AAPL', direction: 'long', entry_price: 134.53, entry_time: '2026-03-24T12:24:00.000Z', exit_price: 133.7, exit_time: '2026-03-24T13:00:00.000Z', quantity: 94, pnl: -78.49, pnl_percent: -62, status: 'closed' },
  { account_id: 1, symbol: 'GOOGL', direction: 'long', entry_price: 488.74, entry_time: '2026-03-24T04:10:00.000Z', exit_price: 480.35, exit_time: '2026-03-24T05:00:00.000Z', quantity: 98, pnl: -821.95, pnl_percent: -172, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'short', entry_price: 138.58, entry_time: '2026-03-24T03:20:00.000Z', exit_price: 135.14, exit_time: '2026-03-24T04:00:00.000Z', quantity: 84, pnl: 288.54, pnl_percent: 248, status: 'closed' },
  { account_id: 1, symbol: 'MSFT', direction: 'long', entry_price: 214.11, entry_time: '2026-03-23T18:32:00.000Z', exit_price: 209.41, exit_time: '2026-03-23T19:00:00.000Z', quantity: 72, pnl: -338.86, pnl_percent: -220, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'long', entry_price: 605.19, entry_time: '2026-03-23T11:35:00.000Z', exit_price: 594.17, exit_time: '2026-03-23T12:00:00.000Z', quantity: 20, pnl: -220.45, pnl_percent: -182, status: 'closed' },
  { account_id: 1, symbol: 'QQQ', direction: 'short', entry_price: 719.18, entry_time: '2026-03-23T10:27:00.000Z', exit_price: 710.73, exit_time: '2026-03-23T11:00:00.000Z', quantity: 97, pnl: 820.1, pnl_percent: 118, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'long', entry_price: 531.21, entry_time: '2026-03-23T07:36:00.000Z', exit_price: 548.66, exit_time: '2026-03-23T08:00:00.000Z', quantity: 57, pnl: 994.98, pnl_percent: 329, status: 'closed' },
  { account_id: 1, symbol: 'QQQ', direction: 'short', entry_price: 855.38, entry_time: '2026-03-22T23:55:00.000Z', exit_price: 817.7, exit_time: '2026-03-23T00:00:00.000Z', quantity: 45, pnl: 1695.59, pnl_percent: 441, status: 'closed' },
  { account_id: 1, symbol: 'AMZN', direction: 'long', entry_price: 946.61, entry_time: '2026-03-21T19:17:00.000Z', exit_price: 970.63, exit_time: '2026-03-21T20:00:00.000Z', quantity: 66, pnl: 1585.45, pnl_percent: 254, status: 'closed' },
  { account_id: 1, symbol: 'AMD', direction: 'long', entry_price: 656.32, entry_time: '2026-03-21T11:51:00.000Z', exit_price: 647.25, exit_time: '2026-03-21T12:00:00.000Z', quantity: 29, pnl: -262.8, pnl_percent: -138, status: 'closed' },
  { account_id: 1, symbol: 'GOOGL', direction: 'long', entry_price: 510.88, entry_time: '2026-03-21T11:18:00.000Z', exit_price: 535.27, exit_time: '2026-03-21T12:00:00.000Z', quantity: 50, pnl: 1219.75, pnl_percent: 478, status: 'closed' },
  { account_id: 1, symbol: 'META', direction: 'long', entry_price: 155.25, entry_time: '2026-03-21T00:00:00.000Z', exit_price: 156.46, exit_time: '2026-03-21T01:00:00.000Z', quantity: 56, pnl: 67.74, pnl_percent: 78, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'long', entry_price: 193.97, entry_time: '2026-03-19T09:16:00.000Z', exit_price: 191.18, exit_time: '2026-03-19T10:00:00.000Z', quantity: 21, pnl: -58.48, pnl_percent: -144, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'short', entry_price: 672.6, entry_time: '2026-03-19T02:24:00.000Z', exit_price: 669.91, exit_time: '2026-03-19T03:00:00.000Z', quantity: 2, pnl: 5.38, pnl_percent: 40, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'short', entry_price: 776.93, entry_time: '2026-03-18T01:26:00.000Z', exit_price: 798.96, exit_time: '2026-03-18T02:00:00.000Z', quantity: 20, pnl: -440.78, pnl_percent: -284, status: 'closed' },
  { account_id: 1, symbol: 'AMZN', direction: 'short', entry_price: 568.11, entry_time: '2026-03-17T10:58:00.000Z', exit_price: 579.7, exit_time: '2026-03-17T11:30:00.000Z', quantity: 91, pnl: -1054.82, pnl_percent: -204, status: 'closed' },
  { account_id: 1, symbol: 'AMZN', direction: 'long', entry_price: 573.28, entry_time: '2026-03-16T15:40:00.000Z', exit_price: 562.91, exit_time: '2026-03-16T16:00:00.000Z', quantity: 61, pnl: -632.81, pnl_percent: -181, status: 'closed' },
  { account_id: 1, symbol: 'AMD', direction: 'long', entry_price: 247.63, entry_time: '2026-03-16T12:58:00.000Z', exit_price: 252.03, exit_time: '2026-03-16T13:30:00.000Z', quantity: 28, pnl: 123.34, pnl_percent: 178, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'short', entry_price: 498.46, entry_time: '2026-03-16T02:41:00.000Z', exit_price: 497.51, exit_time: '2026-03-16T03:00:00.000Z', quantity: 59, pnl: 55.97, pnl_percent: 19, status: 'closed' },
  { account_id: 1, symbol: 'AAPL', direction: 'long', entry_price: 799.33, entry_time: '2026-03-16T02:02:00.000Z', exit_price: 832.56, exit_time: '2026-03-16T03:00:00.000Z', quantity: 62, pnl: 2060.71, pnl_percent: 416, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'long', entry_price: 182.96, entry_time: '2026-03-15T14:23:00.000Z', exit_price: 185.77, exit_time: '2026-03-15T15:00:00.000Z', quantity: 98, pnl: 274.99, pnl_percent: 153, status: 'closed' },
  { account_id: 1, symbol: 'NVDA', direction: 'short', entry_price: 718.63, entry_time: '2026-03-15T06:16:00.000Z', exit_price: 695.02, exit_time: '2026-03-15T07:00:00.000Z', quantity: 1, pnl: 23.61, pnl_percent: 329, status: 'closed' },
  { account_id: 1, symbol: 'NQ', direction: 'long', entry_price: 790.56, entry_time: '2026-03-14T10:38:00.000Z', exit_price: 790.59, exit_time: '2026-03-14T11:00:00.000Z', quantity: 21, pnl: 0.53, pnl_percent: 0, status: 'closed' },
  { account_id: 1, symbol: 'AAPL', direction: 'long', entry_price: 390.31, entry_time: '2026-03-14T09:02:00.000Z', exit_price: 405.02, exit_time: '2026-03-14T10:00:00.000Z', quantity: 35, pnl: 514.74, pnl_percent: 377, status: 'closed' },
  { account_id: 1, symbol: 'AMZN', direction: 'short', entry_price: 939.7, entry_time: '2026-03-13T20:03:00.000Z', exit_price: 942.52, exit_time: '2026-03-13T21:00:00.000Z', quantity: 70, pnl: -197.7, pnl_percent: -30, status: 'closed' },
];

export const demoTrades: Trade[] = journalTrades.map((t, i) => ({
  ...t,
  id: i + 1,
  created_at: t.entry_time,
  updated_at: t.exit_time || t.entry_time,
}));

export const demoRecentTrades: Trade[] = demoTrades.slice(0, 5);

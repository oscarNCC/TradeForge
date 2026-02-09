import { create } from 'zustand';
import * as AnalyticsService from '../services/analyticsService';
import type { AnalyticsSummary, ChartPoint } from '../types/analytics';

interface AnalyticsState {
    summary: AnalyticsSummary | null;
    dailyPnL: ChartPoint[];
    monthlyPnL: ChartPoint[];
    setupStats: ChartPoint[];
    sessionStats: ChartPoint[];
    equityCurve: ChartPoint[];
    isLoading: boolean;
    error: string | null;
    filters: AnalyticsService.AnalyticsFilters;

    fetchAnalytics: (accountId: number, filters?: AnalyticsService.AnalyticsFilters) => Promise<void>;
    setFilters: (filters: AnalyticsService.AnalyticsFilters) => void;
    clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
    summary: null,
    dailyPnL: [],
    monthlyPnL: [],
    setupStats: [],
    sessionStats: [],
    equityCurve: [],
    isLoading: false,
    error: null,
    filters: {},

    setFilters: (filters) => set({ filters }),

    fetchAnalytics: async (accountId: number, filters?: AnalyticsService.AnalyticsFilters) => {
        set({ isLoading: true, error: null });
        const activeFilters = filters || get().filters;
        try {
            const [summary, daily, monthly, setup, session, equity] = await Promise.all([
                AnalyticsService.getSummary(accountId, activeFilters),
                AnalyticsService.getDailyPnL(accountId, activeFilters),
                AnalyticsService.getMonthlyPnL(accountId, activeFilters),
                AnalyticsService.getBySetup(accountId, activeFilters),
                AnalyticsService.getBySession(accountId, activeFilters),
                AnalyticsService.getEquityCurve(accountId, activeFilters),
            ]);
            set({
                summary,
                dailyPnL: daily,
                monthlyPnL: monthly,
                setupStats: setup,
                sessionStats: session,
                equityCurve: equity,
                isLoading: false,
            });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    clearAnalytics: () => set({
        summary: null,
        dailyPnL: [],
        monthlyPnL: [],
        setupStats: [],
        sessionStats: [],
        equityCurve: [],
        filters: {},
        error: null,
    }),
}));

import { api } from './authService';
import type { AnalyticsSummary, ChartPoint } from '../types/analytics';

export interface AnalyticsFilters {
    startDate?: string;
    endDate?: string;
}

export async function getSummary(accountId: number, filters?: AnalyticsFilters): Promise<AnalyticsSummary> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<AnalyticsSummary>(`/api/analytics/summary?${params.toString()}`);
    return data;
}

export async function getDailyPnL(accountId: number, filters?: AnalyticsFilters): Promise<ChartPoint[]> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<ChartPoint[]>(`/api/analytics/daily?${params.toString()}`);
    return data;
}

export async function getMonthlyPnL(accountId: number, filters?: AnalyticsFilters): Promise<ChartPoint[]> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<ChartPoint[]>(`/api/analytics/monthly?${params.toString()}`);
    return data;
}

export async function getBySetup(accountId: number, filters?: AnalyticsFilters): Promise<ChartPoint[]> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<ChartPoint[]>(`/api/analytics/by-setup?${params.toString()}`);
    return data;
}

export async function getBySession(accountId: number, filters?: AnalyticsFilters): Promise<ChartPoint[]> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<ChartPoint[]>(`/api/analytics/by-session?${params.toString()}`);
    return data;
}

export async function getEquityCurve(accountId: number, filters?: AnalyticsFilters): Promise<ChartPoint[]> {
    const params = new URLSearchParams({ account_id: accountId.toString(), ...filters });
    const { data } = await api.get<ChartPoint[]>(`/api/analytics/equity-curve?${params.toString()}`);
    return data;
}

import axios from 'axios';
import { api } from './authService';
import type { Trade, CreateTradeRequest, MultiLegTrade, TradeStatus } from '../types/trade';

function getApiErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data as { error?: string; errors?: Array<{ msg?: string }> };
        if (typeof d.error === 'string') return d.error;
        if (Array.isArray(d.errors) && d.errors[0]?.msg) return d.errors[0].msg;
        if ((d as any).message) return (d as any).message;
    }
    return err instanceof Error ? err.message : 'Network error, please try again later';
}

export interface GetTradesResponse {
    data: Trade[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export async function createTrade(data: CreateTradeRequest): Promise<MultiLegTrade> {
    try {
        const res = await api.post<MultiLegTrade>('/api/trades', data);
        return res.data;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function getTrades(
    accountId: number,
    filters: { status?: TradeStatus; symbol?: string; page?: number; limit?: number } = {}
): Promise<GetTradesResponse> {
    try {
        const params = { account_id: accountId, ...filters };
        const { data } = await api.get<GetTradesResponse>('/api/trades', { params });
        return data;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function getTradeById(id: number): Promise<MultiLegTrade> {
    try {
        const { data } = await api.get<MultiLegTrade>(`/api/trades/${id}`);
        return data;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function updateTrade(id: number, data: Partial<CreateTradeRequest>): Promise<MultiLegTrade> {
    try {
        const { data: trade } = await api.put<MultiLegTrade>(`/api/trades/${id}`, data);
        return trade;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function closeTrade(id: number, exitPrice: number, exitTime: string): Promise<Trade> {
    try {
        const { data: trade } = await api.patch<Trade>(`/api/trades/${id}/close`, {
            exit_price: exitPrice,
            exit_time: exitTime,
        });
        return trade;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function deleteTrade(id: number): Promise<void> {
    try {
        await api.delete(`/api/trades/${id}`);
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

export async function importTrades(file: File, accountId: number): Promise<{ message: string; count: number }> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_account_id', accountId.toString());
        const { data } = await api.post<{ message: string; count: number }>('/api/trades/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (err) {
        throw new Error(getApiErrorMessage(err));
    }
}

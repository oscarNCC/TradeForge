import { create } from 'zustand';
import type { Trade, CreateTradeRequest, TradeStatus, MultiLegTrade } from '../types/trade';
import * as tradeService from '../services/tradeService';

interface TradeFilters {
    status?: TradeStatus;
    symbol?: string;
    page: number;
    limit: number;
}

interface TradeState {
    trades: Trade[];
    selectedTrade: MultiLegTrade | null;
    total: number;
    pages: number;
    isLoading: boolean;
    error: string | null;
    filters: TradeFilters;

    fetchTrades: (accountId: number) => Promise<void>;
    fetchTradeById: (id: number) => Promise<void>;
    createTrade: (data: CreateTradeRequest) => Promise<MultiLegTrade>;
    updateTrade: (id: number, data: Partial<CreateTradeRequest>) => Promise<void>;
    deleteTrade: (id: number) => Promise<void>;
    closeTrade: (id: number, exitPrice: number, exitTime: string) => Promise<void>;
    setFilters: (filters: Partial<TradeFilters>) => void;
    clearTrades: () => void;
    clearError: () => void;
}

export const useTradeStore = create<TradeState>((set, get) => ({
    trades: [],
    selectedTrade: null,
    total: 0,
    pages: 0,
    isLoading: false,
    error: null,
    filters: {
        page: 1,
        limit: 50,
    },

    fetchTrades: async (accountId: number) => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const response = await tradeService.getTrades(accountId, filters);
            set({
                trades: response.data,
                total: response.pagination.total,
                pages: response.pagination.pages,
                isLoading: false
            });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to fetch trades',
                isLoading: false,
            });
        }
    },

    fetchTradeById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const trade = await tradeService.getTradeById(id);
            set({ selectedTrade: trade, isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to fetch trade details',
                isLoading: false,
            });
        }
    },

    createTrade: async (data: CreateTradeRequest) => {
        set({ isLoading: true, error: null });
        try {
            const trade = await tradeService.createTrade(data);
            set((state) => ({
                trades: [trade, ...state.trades],
                isLoading: false,
            }));
            return trade;
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create trade';
            set({ error, isLoading: false });
            throw new Error(error);
        }
    },

    updateTrade: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const trade = await tradeService.updateTrade(id, data);
            set((state) => ({
                trades: state.trades.map((t) => (t.id === id ? trade : t)),
                selectedTrade: state.selectedTrade?.id === id ? trade : state.selectedTrade,
                isLoading: false,
            }));
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to update trade';
            set({ error, isLoading: false });
            throw new Error(error);
        }
    },

    deleteTrade: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await tradeService.deleteTrade(id);
            set((state) => ({
                trades: state.trades.filter((t) => t.id !== id),
                selectedTrade: state.selectedTrade?.id === id ? null : state.selectedTrade,
                isLoading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to delete trade',
                isLoading: false,
            });
        }
    },

    closeTrade: async (id, exitPrice, exitTime) => {
        set({ isLoading: true, error: null });
        try {
            const updatedTrade = await tradeService.closeTrade(id, exitPrice, exitTime);
            set((state) => ({
                trades: state.trades.map((t) => (t.id === id ? { ...t, ...updatedTrade } : t)),
                selectedTrade: state.selectedTrade?.id === id ? { ...state.selectedTrade, ...updatedTrade } : state.selectedTrade,
                isLoading: false,
            }));
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to close trade',
                isLoading: false,
            });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
    },

    clearTrades: () => set({ trades: [], total: 0, pages: 0, selectedTrade: null }),

    clearError: () => set({ error: null }),
}));

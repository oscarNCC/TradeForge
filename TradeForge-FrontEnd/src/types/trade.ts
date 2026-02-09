export type TradeDirection = 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

export interface Trade {
    id: number;
    account_id: number;
    symbol: string;
    entry_price: number | string;
    entry_time: string;
    exit_price?: number | string | null;
    exit_time?: string | null;
    quantity: number;
    direction: TradeDirection;
    pnl?: number | string | null;
    pnl_percent?: number | string | null;
    commission?: number | string | null;
    setup_type?: string | null;
    tags?: string[] | string | null;
    emotion_before?: string | null;
    emotion_after?: string | null;
    notes?: string | null;
    status: TradeStatus;
    created_at: string;
    updated_at: string;
}

export type LegType = 'buy_call' | 'sell_call' | 'buy_put' | 'sell_put';

export interface TradeLeg {
    id?: number;
    trade_id?: number;
    leg_type: LegType;
    strike_price: number | string;
    premium: number | string;
    quantity: number;
    expiration?: string | null;
    created_at?: string;
}

export interface MultiLegTrade extends Trade {
    legs: TradeLeg[];
}

export interface CreateTradeRequest {
    account_id: number;
    symbol: string;
    entry_price: number;
    entry_time: string;
    exit_price?: number;
    exit_time?: string;
    quantity: number;
    direction: TradeDirection;
    commission?: number;
    setup_type?: string;
    tags?: string[];
    emotion_before?: string;
    emotion_after?: string;
    notes?: string;
    status?: TradeStatus;
    legs?: Omit<TradeLeg, 'id' | 'trade_id' | 'created_at'>[];
}

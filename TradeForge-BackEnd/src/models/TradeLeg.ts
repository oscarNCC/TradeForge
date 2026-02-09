import { query } from '../config/database';

export type LegType = 'buy_call' | 'sell_call' | 'buy_put' | 'sell_put';

export interface TradeLeg {
  id: number;
  trade_id: number;
  leg_type: LegType | null;
  strike_price: string | null;
  premium: string | null;
  quantity: number | null;
  expiration: string | null;
  created_at: string;
}

export interface TradeLegInsert {
  leg_type: LegType;
  strike_price: number;
  premium: number;
  quantity: number;
  expiration?: string | null;
}

export async function createLegs(tradeId: number, legs: TradeLegInsert[]): Promise<TradeLeg[]> {
  if (legs.length === 0) return [];
  const results: TradeLeg[] = [];
  for (const leg of legs) {
    const { rows } = await query<TradeLeg>(
      `INSERT INTO trade_legs (trade_id, leg_type, strike_price, premium, quantity, expiration)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        tradeId,
        leg.leg_type,
        leg.strike_price,
        leg.premium,
        leg.quantity,
        leg.expiration ?? null,
      ]
    );
    if (rows[0]) results.push(rows[0]);
  }
  return results;
}

export async function findLegsByTradeId(tradeId: number): Promise<TradeLeg[]> {
  const { rows } = await query<TradeLeg>(
    'SELECT * FROM trade_legs WHERE trade_id = $1 ORDER BY id',
    [tradeId]
  );
  return rows;
}

export async function deleteLegsByTradeId(tradeId: number): Promise<void> {
  await query('DELETE FROM trade_legs WHERE trade_id = $1', [tradeId]);
}

export async function updateLegsForTrade(tradeId: number, legs: TradeLegInsert[]): Promise<TradeLeg[]> {
  await deleteLegsByTradeId(tradeId);
  return createLegs(tradeId, legs);
}

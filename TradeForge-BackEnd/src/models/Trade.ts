import { query } from '../config/database';

export type TradeDirection = 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

export interface Trade {
  id: number;
  account_id: number;
  symbol: string;
  entry_price: string;
  entry_time: string;
  exit_price: string | null;
  exit_time: string | null;
  quantity: number;
  direction: TradeDirection | null;
  pnl: string | null;
  pnl_percent: string | null;
  commission: string | null;
  setup_type: string | null;
  tags: string | null;
  emotion_before: string | null;
  emotion_after: string | null;
  notes: string | null;
  screenshot_urls: string | null;
  status: TradeStatus | null;
  created_at: string;
  updated_at: string;
}

export interface TradeInsert {
  account_id: number;
  symbol: string;
  entry_price: number;
  entry_time: string;
  exit_price?: number | null;
  exit_time?: string | null;
  quantity: number;
  direction?: TradeDirection | null;
  pnl?: number | null;
  pnl_percent?: number | null;
  commission?: number | null;
  setup_type?: string | null;
  tags?: string[] | null;
  emotion_before?: string | null;
  emotion_after?: string | null;
  notes?: string | null;
  screenshot_urls?: string[] | null;
  status?: TradeStatus | null;
}

export interface TradeUpdate {
  symbol?: string;
  entry_price?: number;
  entry_time?: string;
  exit_price?: number | null;
  exit_time?: string | null;
  quantity?: number;
  direction?: TradeDirection | null;
  pnl?: number | null;
  pnl_percent?: number | null;
  commission?: number | null;
  setup_type?: string | null;
  tags?: string[] | null;
  emotion_before?: string | null;
  emotion_after?: string | null;
  notes?: string | null;
  screenshot_urls?: string[] | null;
  status?: TradeStatus | null;
}

export interface FindTradesOptions {
  status?: TradeStatus | null;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

function tagsToDb(tags: string[] | null | undefined): string | null {
  if (tags == null || tags.length === 0) return null;
  return JSON.stringify(tags);
}

function urlsToDb(urls: string[] | null | undefined): string | null {
  if (urls == null || urls.length === 0) return null;
  return JSON.stringify(urls);
}

export async function createTrade(data: TradeInsert): Promise<Trade> {
  const { rows } = await query<Trade>(
    `INSERT INTO trades (
      account_id, symbol, entry_price, entry_time, exit_price, exit_time,
      quantity, direction, pnl, pnl_percent, commission, setup_type, tags,
      emotion_before, emotion_after, notes, screenshot_urls, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING *`,
    [
      data.account_id,
      data.symbol,
      data.entry_price,
      data.entry_time,
      data.exit_price ?? null,
      data.exit_time ?? null,
      data.quantity,
      data.direction ?? null,
      data.pnl ?? null,
      data.pnl_percent ?? null,
      data.commission ?? null,
      data.setup_type ?? null,
      tagsToDb(data.tags),
      data.emotion_before ?? null,
      data.emotion_after ?? null,
      data.notes ?? null,
      urlsToDb(data.screenshot_urls),
      data.status ?? 'open',
    ]
  );
  if (!rows[0]) throw new Error('Trade insert failed: no row returned');
  return rows[0];
}

export async function findTradesByAccountId(
  accountId: number,
  options: FindTradesOptions = {}
): Promise<Trade[]> {
  const { status, limit = 50, offset = 0, startDate, endDate } = options;
  let sql = 'SELECT * FROM trades WHERE account_id = $1';
  const params: unknown[] = [accountId];

  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }

  if (startDate) {
    params.push(startDate);
    sql += ` AND entry_time >= $${params.length}`;
  }

  if (endDate) {
    params.push(endDate);
    sql += ` AND entry_time <= $${params.length}`;
  }

  sql += ' ORDER BY entry_time DESC';
  params.push(limit, offset);
  sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const { rows } = await query<Trade>(sql, params);
  return rows;
}

export async function countTradesByAccountId(
  accountId: number,
  status?: TradeStatus | null
): Promise<number> {
  let sql = 'SELECT COUNT(*)::int AS c FROM trades WHERE account_id = $1';
  const params: unknown[] = [accountId];
  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }
  const { rows } = await query<{ c: number }>(sql, params);
  return rows[0]?.c ?? 0;
}

export async function findTradeById(id: number, userId?: number): Promise<Trade | undefined> {
  let sql = 'SELECT t.* FROM trades t';
  const params: unknown[] = [id];

  if (userId) {
    sql += ' JOIN accounts a ON t.account_id = a.id WHERE t.id = $1 AND a.user_id = $2';
    params.push(userId);
  } else {
    sql += ' WHERE t.id = $1';
  }

  const { rows } = await query<Trade>(sql, params);
  return rows[0];
}

export async function updateTrade(id: number, userId: number, data: TradeUpdate): Promise<Trade | undefined> {
  const { rows } = await query<Trade>(
    `UPDATE trades SET
       symbol = COALESCE($3, symbol),
       entry_price = COALESCE($4, entry_price),
       entry_time = COALESCE($5, entry_time),
       exit_price = COALESCE($6, exit_price),
       exit_time = COALESCE($7, exit_time),
       quantity = COALESCE($8, quantity),
       direction = COALESCE($9, direction),
       pnl = COALESCE($10, pnl),
       pnl_percent = COALESCE($11, pnl_percent),
       commission = COALESCE($12, commission),
       setup_type = COALESCE($13, setup_type),
       tags = COALESCE($14, tags),
       emotion_before = COALESCE($15, emotion_before),
       emotion_after = COALESCE($16, emotion_after),
       notes = COALESCE($17, notes),
       screenshot_urls = COALESCE($18, screenshot_urls),
       status = COALESCE($19, status),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND account_id IN (SELECT id FROM accounts WHERE user_id = $2)
     RETURNING *`,
    [
      id,
      userId,
      data.symbol ?? undefined,
      data.entry_price ?? undefined,
      data.entry_time ?? undefined,
      data.exit_price !== undefined ? data.exit_price : undefined,
      data.exit_time ?? undefined,
      data.quantity ?? undefined,
      data.direction ?? undefined,
      data.pnl !== undefined ? data.pnl : undefined,
      data.pnl_percent !== undefined ? data.pnl_percent : undefined,
      data.commission !== undefined ? data.commission : undefined,
      data.setup_type ?? undefined,
      data.tags !== undefined ? tagsToDb(data.tags) : undefined,
      data.emotion_before ?? undefined,
      data.emotion_after ?? undefined,
      data.notes ?? undefined,
      data.screenshot_urls !== undefined ? urlsToDb(data.screenshot_urls) : undefined,
      data.status ?? undefined,
    ]
  );
  return rows[0];
}

export async function deleteTrade(id: number, userId: number): Promise<boolean> {
  const { rowCount } = await query(
    'DELETE FROM trades WHERE id = $1 AND account_id IN (SELECT id FROM accounts WHERE user_id = $2)',
    [id, userId]
  );
  return (rowCount ?? 0) > 0;
}

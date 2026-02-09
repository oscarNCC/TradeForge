import { query } from '../config/database';

export type AccountType = 'eval' | 'demo_funded' | 'live';

export interface Account {
  id: number;
  user_id: number;
  account_name: string;
  account_type: string | null;
  broker: string | null;
  initial_capital: string | null;
  current_balance: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountInsert {
  account_name: string;
  account_type?: AccountType | null;
  broker?: string | null;
  initial_capital?: number | null;
}

export interface AccountUpdate {
  account_name?: string;
  account_type?: AccountType | null;
  broker?: string | null;
  initial_capital?: number | null;
  current_balance?: number | null;
  is_active?: boolean;
}

export async function createAccount(userId: number, data: AccountInsert): Promise<Account> {
  const initialCapital = data.initial_capital ?? null;
  const { rows } = await query<Account>(
    `INSERT INTO accounts (user_id, account_name, account_type, broker, initial_capital, current_balance)
     VALUES ($1, $2, $3, $4, $5, $5)
     RETURNING *`,
    [
      userId,
      data.account_name,
      data.account_type ?? null,
      data.broker ?? null,
      initialCapital,
    ]
  );
  if (!rows[0]) {
    throw new Error('Account insert failed: no row returned');
  }
  return rows[0];
}

export async function findAccountsByUserId(userId: number): Promise<Account[]> {
  const { rows } = await query<Account>(
    'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

export async function findAccountById(id: number, userId: number): Promise<Account | undefined> {
  const { rows } = await query<Account>(
    'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rows[0];
}

export async function updateAccount(id: number, userId: number, data: AccountUpdate): Promise<Account | undefined> {
  const { rows } = await query<Account>(
    `UPDATE accounts SET
       account_name = COALESCE($3, account_name),
       account_type = COALESCE($4, account_type),
       broker = COALESCE($5, broker),
       initial_capital = COALESCE($6, initial_capital),
       current_balance = COALESCE($7, current_balance),
       is_active = COALESCE($8, is_active),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [
      id,
      userId,
      data.account_name ?? undefined,
      data.account_type ?? undefined,
      data.broker ?? undefined,
      data.initial_capital ?? undefined,
      data.current_balance ?? undefined,
      data.is_active ?? undefined,
    ]
  );
  return rows[0];
}

export async function deleteAccount(id: number, userId: number): Promise<boolean> {
  // 1. Delete trade legs
  await query(
    'DELETE FROM trade_legs WHERE trade_id IN (SELECT id FROM trades WHERE account_id = $1)',
    [id]
  );

  // 2. Delete trades
  await query(
    'DELETE FROM trades WHERE account_id = $1',
    [id]
  );

  // 3. Delete account
  const { rowCount } = await query(
    'DELETE FROM accounts WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  return (rowCount ?? 0) > 0;
}

export async function refreshAccountBalance(accountId: number): Promise<void> {
  // Calculate new balance: initial_capital + sum(pnl) for all closed trades
  const sql = `
    UPDATE accounts a
    SET current_balance = initial_capital + COALESCE((
      SELECT SUM(pnl)
      FROM trades
      WHERE account_id = a.id AND status = 'closed'
    ), 0)
    WHERE id = $1
  `;
  await query(sql, [accountId]);
}

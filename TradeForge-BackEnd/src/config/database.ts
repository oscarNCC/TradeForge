import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Create the database first: psql -U postgres -h localhost -c "CREATE DATABASE tradeforge;"');
}

const pool = new Pool({ connectionString: DATABASE_URL });

const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const createAccountsTableSQL = `
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  account_name VARCHAR(100) NOT NULL,
  account_type VARCHAR(50),
  broker VARCHAR(100),
  initial_capital DECIMAL(12, 2),
  current_balance DECIMAL(12, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const createTradesTableSQL = `
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id),
  symbol VARCHAR(20) NOT NULL,
  entry_price DECIMAL(12, 4) NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_price DECIMAL(12, 4),
  exit_time TIMESTAMPTZ,
  quantity INTEGER NOT NULL,
  direction VARCHAR(10),
  pnl DECIMAL(12, 2),
  pnl_percent DECIMAL(10, 4),
  commission DECIMAL(10, 2),
  setup_type VARCHAR(100),
  tags TEXT,
  emotion_before VARCHAR(100),
  emotion_after VARCHAR(100),
  notes TEXT,
  screenshot_urls TEXT,
  status VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

const createTradeLegsTableSQL = `
CREATE TABLE IF NOT EXISTS trade_legs (
  id SERIAL PRIMARY KEY,
  trade_id INTEGER NOT NULL REFERENCES trades(id),
  leg_type VARCHAR(50),
  strike_price DECIMAL(12, 4),
  premium DECIMAL(12, 4),
  quantity INTEGER,
  expiration DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export async function initDatabase(): Promise<void> {
  await pool.query(createUsersTableSQL);
  await pool.query(createAccountsTableSQL);
  await pool.query(createTradesTableSQL);
  await pool.query(createTradeLegsTableSQL);
}

export interface QueryResult<T> {
  rows: T[];
  rowCount: number | null;
}

export async function query<T = unknown>(sql: string, params: unknown[] = []): Promise<QueryResult<T>> {
  const result = await pool.query(sql, params);
  return { rows: result.rows as T[], rowCount: result.rowCount };
}

export { pool };

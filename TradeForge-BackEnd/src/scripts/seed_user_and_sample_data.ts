/**
 * Seed script: ensures user id 1 (oscar / test@example.com) and his test account exist,
 * then adds more sample trades for that account.
 * Run: npm run seed:user
 */

import 'dotenv/config';
import { pool } from '../config/database';
import { createTrade, TradeInsert } from '../models/Trade';
import { createAccount, findAccountsByUserId } from '../models/Account';
import { hashPassword } from '../utils/passwordUtils';

const TARGET_EMAIL = 'test@example.com';
const TARGET_USERNAME = 'oscar';
const DEFAULT_PASSWORD = 'password123'; // dev only

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'AMD', 'SPY', 'QQQ', 'ES', 'NQ', 'MSFT', 'AMZN', 'GOOGL', 'META'];
const SETUPS = ['Pullback', 'Breakout', 'Reversal', 'Trend Following', 'Scalp', 'Mean Reversion', 'Dip Buy'];
const EMOTIONS = ['Calm', 'Anxious', 'Confident', 'Hesitant', 'Excited', 'Frustrated', 'Focused', 'Bored'];

async function ensureUser(): Promise<number> {
  const byEmail = await pool.query('SELECT id, username FROM users WHERE email = $1', [TARGET_EMAIL]);
  if (byEmail.rows.length > 0) {
    const user = byEmail.rows[0] as { id: number; username: string | null };
    if (user.username !== TARGET_USERNAME) {
      await pool.query('UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
        TARGET_USERNAME,
        user.id,
      ]);
      console.log(`Updated username to '${TARGET_USERNAME}' for user id ${user.id}`);
    }
    console.log(`Found user: ${TARGET_EMAIL} (id: ${user.id})`);
    return user.id;
  }

  const countResult = await pool.query('SELECT COUNT(*)::int AS c FROM users');
  const isEmpty = (countResult.rows[0] as { c: number }).c === 0;
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  if (isEmpty) {
    await pool.query(
      `INSERT INTO users (id, email, password_hash, username) VALUES (1, $1, $2, $3)`,
      [TARGET_EMAIL, passwordHash, TARGET_USERNAME]
    );
    await pool.query("SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 1) FROM users))");
    console.log(`Created user id 1: ${TARGET_USERNAME} / ${TARGET_EMAIL} (password: ${DEFAULT_PASSWORD})`);
    return 1;
  }

  const insertResult = await pool.query(
    `INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id`,
    [TARGET_EMAIL, passwordHash, TARGET_USERNAME]
  );
  const id = (insertResult.rows[0] as { id: number }).id;
  console.log(`Created user id ${id}: ${TARGET_USERNAME} / ${TARGET_EMAIL} (password: ${DEFAULT_PASSWORD})`);
  return id;
}

async function ensureTestAccount(userId: number): Promise<number> {
  const accounts = await findAccountsByUserId(userId);
  const testAccount = accounts.find((a) => a.account_name === 'test');
  if (testAccount) {
    console.log(`Found 'test' account (id: ${testAccount.id})`);
    return testAccount.id;
  }
  const newAccount = await createAccount(userId, {
    account_name: 'test',
    account_type: 'demo_funded',
    broker: 'Simulation',
    initial_capital: 100000,
  });
  console.log(`Created 'test' account (id: ${newAccount.id})`);
  return newAccount.id;
}

async function addSampleTrades(accountId: number, count: number): Promise<void> {
  const months = [
    { start: new Date('2025-09-01T09:30:00Z'), end: new Date('2025-09-30T16:00:00Z') },
    { start: new Date('2025-10-01T09:30:00Z'), end: new Date('2025-10-31T16:00:00Z') },
    { start: new Date('2025-11-01T09:30:00Z'), end: new Date('2025-11-30T16:00:00Z') },
    { start: new Date('2025-12-01T09:30:00Z'), end: new Date('2025-12-31T16:00:00Z') },
    { start: new Date('2026-01-01T09:30:00Z'), end: new Date('2026-01-31T16:00:00Z') },
    { start: new Date('2026-02-01T09:30:00Z'), end: new Date('2026-02-28T16:00:00Z') },
    { start: new Date('2026-03-01T09:30:00Z'), end: new Date('2026-03-31T16:00:00Z') },
  ];

  const tradesToCreate: TradeInsert[] = [];
  let added = 0;
  for (const month of months) {
    for (let i = 0; i < Math.ceil(count / months.length); i++) {
      const symbol = getRandomElement(SYMBOLS);
      const isLong = Math.random() > 0.5;
      const entryPrice = getRandomInt(100, 1000) + Math.random();
      const quantity = getRandomInt(1, 100);
      const isWin = Math.random() > 0.45;
      const pnlMultiplier = isWin ? 1 + Math.random() * 0.05 : 1 - Math.random() * 0.03;
      const exitPrice = isLong ? entryPrice * pnlMultiplier : entryPrice * (2 - pnlMultiplier);
      const entryTime = getRandomDate(month.start, month.end);
      const exitTime = new Date(entryTime.getTime() + getRandomInt(60000, 3600000));
      const pnl = (exitPrice - entryPrice) * quantity * (isLong ? 1 : -1);
      const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100 * (isLong ? 1 : -1);

      tradesToCreate.push({
        account_id: accountId,
        symbol,
        entry_price: parseFloat(entryPrice.toFixed(2)),
        entry_time: entryTime.toISOString(),
        exit_price: parseFloat(exitPrice.toFixed(2)),
        exit_time: exitTime.toISOString(),
        quantity,
        direction: isLong ? 'long' : 'short',
        pnl: parseFloat(pnl.toFixed(2)),
        pnl_percent: parseFloat(pnlPercent.toFixed(2)),
        commission: 0,
        setup_type: getRandomElement(SETUPS),
        tags: [getRandomElement(SETUPS)],
        emotion_before: getRandomElement(EMOTIONS),
        emotion_after: getRandomElement(EMOTIONS),
        notes: `Sample trade Sep 2025–Mar 2026 #${++added}`,
        status: 'closed',
      });
    }
  }

  let successCount = 0;
  for (const trade of tradesToCreate) {
    try {
      await createTrade(trade);
      successCount++;
      if (successCount % 100 === 0) console.log(`Inserted ${successCount} trades...`);
    } catch (err) {
      console.error('Failed to insert trade:', err);
    }
  }
  console.log(`Added ${successCount} sample trades.`);
}

async function seedUserAndSampleData() {
  console.log('Seeding user (oscar / test@example.com) and sample data...\n');

  try {
    const userId = await ensureUser();
    const accountId = await ensureTestAccount(userId);
    await addSampleTrades(accountId, 600);

    console.log('\nDone. You can log in with:');
    console.log('  Email:    test@example.com');
    console.log('  Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seedUserAndSampleData();

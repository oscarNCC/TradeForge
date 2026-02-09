
import 'dotenv/config';
import { pool } from '../config/database';
import { createTrade, TradeInsert } from '../models/Trade';
import { createAccount, findAccountsByUserId } from '../models/Account';

// Helper to get random number between min and max
const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to get random element from array
const getRandomElement = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
};

// Helper to get random date in August 2025
const getRandomDateInAugust2025 = () => {
    const start = new Date('2025-08-01T09:30:00Z').getTime();
    const end = new Date('2025-08-31T16:00:00Z').getTime();
    return new Date(start + Math.random() * (end - start));
};

const SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'AMD', 'SPY', 'QQQ', 'ES', 'NQ', 'MSFT', 'AMZN', 'GOOGL', 'META'];
const SETUPS = ['Pullback', 'Breakout', 'Reversal', 'Trend Following', 'Scalp', 'Mean Reversion', 'Dip Buy'];
const EMOTIONS = ['Calm', 'Anxious', 'Confident', 'Hesitant', 'Excited', 'Frustrated', 'Focused', 'Bored'];

async function seedTrades() {
    console.log('Starting seed process...');

    try {
        // 1. Get the first user
        const userRes = await pool.query('SELECT id, email FROM users LIMIT 1');
        if (userRes.rows.length === 0) {
            console.error('No users found. Please create a user first.');
            process.exit(1);
        }
        const user = userRes.rows[0];
        console.log(`Found user: ${user.email} (ID: ${user.id})`);

        // 2. Find or create 'test' account
        let accountId: number;
        const accounts = await findAccountsByUserId(user.id);
        const testAccount = accounts.find(acc => acc.account_name === 'test');

        if (testAccount) {
            console.log(`Found existing 'test' account (ID: ${testAccount.id})`);
            accountId = testAccount.id;
        } else {
            console.log("Creating 'test' account...");
            const newAccount = await createAccount(user.id, {
                account_name: 'test',
                account_type: 'demo_funded',
                broker: 'Simulation',
                initial_capital: 100000
            });
            accountId = newAccount.id;
            console.log(`Created 'test' account (ID: ${accountId})`);
        }

        // 3. Generate 1000 trades
        console.log('Generating 1000 trades...');
        const tradesToCreate: TradeInsert[] = [];

        for (let i = 0; i < 1000; i++) {
            const symbol = getRandomElement(SYMBOLS);
            const isLong = Math.random() > 0.5;
            const entryPrice = getRandomInt(100, 1000) + Math.random();
            const quantity = getRandomInt(1, 100);

            // Random PnL logic
            const isWin = Math.random() > 0.45; // slightly more losers than winners or balanced
            const pnlMultiplier = isWin ? (1 + Math.random() * 0.05) : (1 - Math.random() * 0.03);
            const exitPrice = isLong ? entryPrice * pnlMultiplier : entryPrice * (2 - pnlMultiplier);

            const entryTime = getRandomDateInAugust2025();
            const exitTime = new Date(entryTime.getTime() + getRandomInt(60000, 3600000)); // 1 min to 1 hour duration

            const pnl = (exitPrice - entryPrice) * quantity * (isLong ? 1 : -1);
            const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100 * (isLong ? 1 : -1);

            tradesToCreate.push({
                account_id: accountId,
                symbol: symbol,
                entry_price: parseFloat(entryPrice.toFixed(2)),
                entry_time: entryTime.toISOString(),
                exit_price: parseFloat(exitPrice.toFixed(2)),
                exit_time: exitTime.toISOString(),
                quantity: quantity,
                direction: isLong ? 'long' : 'short',
                pnl: parseFloat(pnl.toFixed(2)),
                pnl_percent: parseFloat(pnlPercent.toFixed(2)),
                commission: 0, // Simplified
                setup_type: getRandomElement(SETUPS),
                tags: [getRandomElement(SETUPS)], // Just use setup as tag for now
                emotion_before: getRandomElement(EMOTIONS),
                emotion_after: getRandomElement(EMOTIONS),
                notes: `Auto-generated seed trade #${i + 1}`,
                status: 'closed'
            });
        }

        // 4. Insert trades in batches to avoid overwhelming the connection (though 1000 is small enough for one go, let's correspond to best practices)
        console.log('Inserting trades into database...');

        let successCount = 0;
        for (const trade of tradesToCreate) {
            try {
                await createTrade(trade);
                successCount++;
                if (successCount % 100 === 0) {
                    console.log(`Inserted ${successCount} trades...`);
                }
            } catch (err) {
                console.error('Failed to insert trade:', err);
            }
        }

        console.log(`Successfully inserted ${successCount} trades.`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding trades:', error);
        process.exit(1);
    }
}

seedTrades();

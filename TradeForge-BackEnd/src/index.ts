import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import accountRoutes from './routes/accounts';
import tradeRoutes from './routes/trades';
import analyticsRoutes from './routes/analytics';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/analytics', analyticsRoutes);

async function start(): Promise<void> {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

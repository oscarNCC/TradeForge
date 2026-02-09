/**
 * Calculate Profit and Loss (PnL) for a single trade leg or single trade.
 */
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  direction: 'long' | 'short',
  commission: number = 0
): number {
  let pnl = 0;
  if (direction === 'long') {
    pnl = (exitPrice - entryPrice) * quantity;
  } else {
    pnl = (entryPrice - exitPrice) * quantity;
  }
  return pnl - commission;
}

/**
 * Calculate PnL percentage.
 */
export function calculatePnLPercent(
  entryPrice: number,
  exitPrice: number,
  direction: 'long' | 'short'
): number {
  if (entryPrice === 0) return 0;
  if (direction === 'long') {
    return (exitPrice - entryPrice) / entryPrice;
  } else {
    return (entryPrice - exitPrice) / entryPrice;
  }
}

/**
 * Interface representing a trade leg for PnL calculation.
 */
export interface TradeLegPnLInput {
  leg_type: 'buy_call' | 'sell_call' | 'buy_put' | 'sell_put';
  premium: number;
  quantity: number;
  exit_premium?: number;
}

/**
 * Calculate total PnL for a multi-leg option trade.
 * In options, premium is usually per share, so multiply by 100 if needed (caller handles this or we decide here).
 * For simplicity, we assume 'premium' is the total premium per share.
 * Standard quantity multiplier (100) should be applied by the caller or included in quantity.
 */
export function calculateMultiLegPnL(legs: TradeLegPnLInput[]): number {
  let totalPnL = 0;
  for (const leg of legs) {
    if (leg.exit_premium === undefined) continue;

    const { leg_type, premium, quantity, exit_premium } = leg;

    // buy_call/buy_put: PnL = (exit - entry) * quantity
    // sell_call/sell_put: PnL = (entry - exit) * quantity
    if (leg_type === 'buy_call' || leg_type === 'buy_put') {
      totalPnL += (exit_premium - premium) * quantity;
    } else {
      totalPnL += (premium - exit_premium) * quantity;
    }
  }
  return totalPnL;
}

/**
 * Calculate Risk/Reward ratio.
 */
export function calculateRiskReward(
  entryPrice: number,
  exitProfit: number,
  exitLoss: number,
  direction: 'long' | 'short'
): number {
  const reward = Math.abs(exitProfit - entryPrice);
  const risk = Math.abs(entryPrice - exitLoss);

  if (risk === 0) return 0;
  return reward / risk;
}

import type { PerformanceMetrics } from '../types/analytics';

interface Props {
  metrics: PerformanceMetrics;
}

export default function MetricsGrid({ metrics }: Props) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const cards = [
    { label: 'Total P&L', value: formatCurrency(metrics.totalPnL), color: metrics.totalPnL >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' },
    { label: 'Win Rate', value: `${metrics.winRate.toFixed(1)}%`, color: 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]' },
    { label: 'Profit Factor', value: metrics.profitFactor.toFixed(2), color: metrics.profitFactor >= 1.5 ? 'text-[#00FF88]' : 'text-gray-300' },
    { label: 'Max Drawdown', value: formatCurrency(metrics.maxDrawdown), color: 'text-red-500' },
    { label: 'Sharpe Ratio', value: metrics.sharpeRatio.toFixed(2), color: metrics.sharpeRatio >= 1 ? 'text-[#00FF88]' : 'text-gray-300' },
    { label: 'Avg Win', value: formatCurrency(metrics.avgWin), color: 'text-[#00FF88]' },
    { label: 'Avg Loss', value: formatCurrency(metrics.avgLoss), color: 'text-red-500' },
    { label: 'Max Win Streak', value: metrics.consecutiveWins, color: 'text-[#00FF88]' },
    { label: 'Max Loss Streak', value: metrics.consecutiveLosses, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#0A0F1E]/60 p-4 rounded-lg border border-[#00FF88]/20 hover:border-[#00FF88]/50 transition-all group relative overflow-hidden backdrop-blur-md">
           <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
               <div className="w-2 h-2 bg-[#00FF88] rounded-full shadow-[0_0_5px_#00FF88]"></div>
           </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#00FF88] transition-colors">{card.label}</p>
          <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

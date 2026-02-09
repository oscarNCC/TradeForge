import { useEffect, useState } from 'react';
import type { AnalyticsSummary } from '../types/analytics';
import * as AnalyticsService from '../services/analyticsService';

interface Props {
  accountId: number;
}

export default function PeriodStatsTable({ accountId }: Props) {
  const [todayStats, setTodayStats] = useState<AnalyticsSummary | null>(null);
  const [monthStats, setMonthStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const startToday = new Date(today);
        startToday.setHours(0, 0, 0, 0);

        const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Fetch Today's stats
        const todaySummary = await AnalyticsService.getSummary(accountId, { 
            startDate: startToday.toISOString() 
        });

        // Fetch Month's stats
        const monthSummary = await AnalyticsService.getSummary(accountId, { 
            startDate: startMonth.toISOString() 
        });

        setTodayStats(todaySummary);
        setMonthStats(monthSummary);
      } catch (error) {
        console.error("Failed to fetch period stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchData();
    }
  }, [accountId]);

  if (loading && !todayStats) return <div className="h-24 animate-pulse bg-[#0A0F1E] rounded-lg border border-[#00FF88]/10"></div>;

  const rows = [
    { 
      label: 'Today', 
      data: todayStats 
    },
    { 
      label: 'This Month', 
      data: monthStats 
    }
  ];

  return (
    <div className="bg-[#0A0F1E]/50 p-6 rounded-2xl border border-[#00FF88]/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <h3 className="text-sm font-bold text-[#00FF88] mb-4 font-orbitron tracking-wider uppercase">Period Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#00FF88]/20 bg-[#00FF88]/5">
              <th className="py-3 px-4 font-bold text-[#00FF88] font-orbitron tracking-wider">PERIOD</th>
              <th className="py-3 px-4 font-bold text-[#00FF88] font-orbitron tracking-wider">AVG WIN</th>
              <th className="py-3 px-4 font-bold text-[#00FF88] font-orbitron tracking-wider">AVG LOSS</th>
              <th className="py-3 px-4 font-bold text-[#00FF88] font-orbitron tracking-wider">TOTAL P&L</th>
              <th className="py-3 px-4 font-bold text-[#00FF88] font-orbitron tracking-wider">WIN RATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((row, i) => {
                const s = row.data;
                if (!s) return null;
                return (
                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="py-3 px-4 font-bold text-gray-200 font-orbitron group-hover:text-[#00FF88] transition-colors">{row.label}</td>
                        <td className="py-3 px-4 text-green-400 font-mono font-bold tracking-wide">
                            {s.avgWin > 0 ? `$${s.avgWin.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-red-400 font-mono font-bold tracking-wide">
                            {s.avgLoss > 0 ? `$${s.avgLoss.toFixed(2)}` : '-'}
                        </td>
                        <td className={`py-3 px-4 font-bold font-mono tracking-wide ${s.totalPnL >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]'}`}>
                            ${s.totalPnL.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-blue-400 font-bold font-mono tracking-wide">
                            {s.totalTrades > 0 ? `${s.winRate.toFixed(1)}%` : '-'}
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[10px] text-gray-500 text-right font-mono uppercase tracking-widest border-t border-gray-800 pt-2">
        * Data based on verified closed trades
      </p>
    </div>
  );
}

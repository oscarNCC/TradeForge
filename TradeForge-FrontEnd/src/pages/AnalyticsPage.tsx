import { useEffect } from 'react';
import { useAccountStore } from '../store/accountStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import StatsBarChart from '../components/charts/StatsBarChart';
import SetupPieChart from '../components/charts/SetupPieChart';
import DailyHeatmap from '../components/charts/DailyHeatmap';
import PeriodStatsTable from '../components/PeriodStatsTable';

export default function AnalyticsPage() {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { 
    dailyPnL, 
    monthlyPnL, 
    setupStats, 
    sessionStats, 
    isLoading, 
    error, 
    fetchAnalytics,
    filters 
  } = useAnalyticsStore();

  useEffect(() => {
    if (selectedAccountId) {
      fetchAnalytics(selectedAccountId, filters);
    }
  }, [selectedAccountId, fetchAnalytics, filters]);

  if ((isLoading && setupStats.length === 0) || !selectedAccountId) {
    return (
      <div className="p-8 flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF88] shadow-[0_0_15px_#00FF88]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF88] to-white drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
            PERFORMANCE ANALYTICS
        </h1>
        <div className="px-3 py-1 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded text-[#00FF88] text-xs font-mono">
            LIVE ANALYTICS FEED
        </div>
      </div>

      <div className="bg-[#050810]/50 p-6 rounded-2xl border border-[#00FF88]/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <PeriodStatsTable accountId={selectedAccountId} />
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 text-red-500 rounded-xl border border-red-500/30 backdrop-blur-sm">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 card-cyber p-1">
            <SetupPieChart data={setupStats} />
        </div>
        <div className="md:col-span-1 card-cyber p-6 flex flex-col">
            <StatsBarChart 
              data={setupStats} 
              title="PnL by Setup" 
            />
        </div>
        <div className="md:col-span-1 card-cyber p-6 flex flex-col">
            <StatsBarChart 
              data={sessionStats} 
              title="PnL by Session Hour" 
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-cyber p-6">
            <StatsBarChart 
            data={monthlyPnL} 
            title="Monthly P&L" 
            />
        </div>
        <div className="card-cyber p-6">
            <StatsBarChart 
            data={dailyPnL} 
            title="Daily P&L" 
            />
        </div>
      </div>

      <DailyHeatmap data={dailyPnL} />
      
      <div className="bg-[#050810]/50 p-6 rounded-2xl shadow-sm border border-[#00FF88]/20 backdrop-blur-md">
        <h3 className="text-sm font-bold text-[#00FF88] mb-6 uppercase tracking-wider font-orbitron">Statistics Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#00FF88]/20">
                <th className="py-3 font-bold text-gray-400 font-mono tracking-wider">Category</th>
                <th className="py-3 font-bold text-gray-400 font-mono tracking-wider">Count</th>
                <th className="py-3 font-bold text-gray-400 font-mono tracking-wider">Total P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {setupStats.map((s, i) => (
                <tr key={i} className="hover:bg-[#00FF88]/5 transition-colors">
                  <td className="py-3 text-gray-200 font-medium font-orbitron">{s.label}</td>
                  <td className="py-3 text-gray-400 font-mono">{s.count}</td>
                  <td className={`py-3 font-bold font-mono ${s.value >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]' : 'text-red-500'}`}>
                    ${s.value.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

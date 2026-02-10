import { useEffect, useState } from 'react';
import { useAccountStore } from '../store/accountStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useTradeStore } from '../store/tradeStore';
import MetricsGrid from '../components/MetricsGrid';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import SetupPieChart from '../components/charts/SetupPieChart';

const RANGES = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

export default function DashboardPage() {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const { summary, equityCurve, setupStats, isLoading, error, fetchAnalytics } = useAnalyticsStore();
  const { trades, fetchTrades } = useTradeStore();
  const [range, setRange] = useState('ALL');

  useEffect(() => {
    if (selectedAccountId) {
      // Calculate date filters based on range
      const filters: any = {};
      const now = new Date();
      if (range === '1D') {
          const d = new Date(now); d.setHours(0,0,0,0);
          filters.startDate = d.toISOString();
      } else if (range === '1W') {
          const d = new Date(now); d.setDate(d.getDate() - 7);
          filters.startDate = d.toISOString();
      } else if (range === '1M') {
          const d = new Date(now); d.setMonth(d.getMonth() - 1);
          filters.startDate = d.toISOString();
      } else if (range === '1Y') {
          const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
          filters.startDate = d.toISOString();
      }

      fetchAnalytics(selectedAccountId, filters);
      fetchTrades(selectedAccountId); 
    }
  }, [selectedAccountId, fetchAnalytics, fetchTrades, range]);

  if ((isLoading && !summary) || !selectedAccountId) {
    return (
      <div className="p-8 flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FF88] shadow-[0_0_15px_#00FF88]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF88] to-white drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                DASHBOARD
            </h1>
            <p className="text-xs text-green-500/70 font-mono tracking-widest mt-1">SYSTEM STATUS:ONLINE</p>
        </div>
        
        <div className="flex bg-[#0A0F1E]/50 p-1 rounded-lg border border-[#00FF88]/20 backdrop-blur-md">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all font-mono ${
                range === r.value 
                  ? 'bg-[#00FF88] text-black shadow-[0_0_10px_rgba(0,255,136,0.5)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30 backdrop-blur-sm">
          Error: {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
          
          {/* Left Digital Panel */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="bg-[#050810]/80 p-5 rounded-2xl border border-[#00FF88]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-50"></div>
                  <h2 className="text-sm font-bold text-[#00FF88] mb-4 font-orbitron tracking-wider flex items-center gap-2">
                       <span className="w-2 h-2 bg-[#00FF88] rounded-sm animate-pulse"></span>
                       LIVE METRICS
                  </h2>
                  {summary && <MetricsGrid metrics={summary} />}
                  
                  {/* Circuit Decoration */}
                  <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100">
                      <path d="M10 90 L30 90 L40 80 L60 80 L70 90 L90 90" stroke="#00FF88" strokeWidth="1" fill="none" />
                      <circle cx="40" cy="80" r="2" fill="#00FF88" />
                      <circle cx="60" cy="80" r="2" fill="#00FF88" />
                  </svg>
              </div>
          </div>

          {/* Center/Right Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card-cyber p-1">
                    <EquityCurveChart data={equityCurve} />
                </div>
                <div className="card-cyber p-1">
                    <SetupPieChart data={setupStats} />
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="card-cyber p-6">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 font-orbitron tracking-wider border-b border-gray-700/50 pb-2 flex justify-between">
                      <span>RECENT TRADES LOG</span>
                      <span className="text-[#00FF88] text-[10px]">LIVE UPDATES</span>
                  </h3>
                  <div className="space-y-2">
                    {trades.slice(0, 5).map((t) => {
                       const pnlValue = parseFloat(String(t.pnl || 0));
                       return (
                          <div key={t.id} className="flex items-center justify-between p-3 bg-[#0A0F1E]/50 rounded-lg hover:bg-[#00FF88]/5 transition-colors border border-transparent hover:border-[#00FF88]/20 group">
                             <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-orbitron text-xs border ${
                                 t.direction === 'long' 
                                    ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                               }`}>
                                 {t.symbol.substring(0, 3)}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-gray-200 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all">{t.symbol}</p>
                                 <p className="text-[10px] text-gray-500 font-mono">{new Date(String(t.entry_time)).toLocaleString()}</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className={`text-sm font-bold font-mono ${pnlValue >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]' : 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}>
                                 {pnlValue >= 0 ? '+' : ''}${pnlValue.toFixed(2)}
                               </p>
                               <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                   t.status === 'closed' ? 'border-gray-600 text-gray-500' : 'border-[#00FF88] text-[#00FF88] animate-pulse'
                               }`}>
                                   {t.status === 'closed' ? 'CLOSED' : 'OPEN'}
                               </span>
                             </div>
                          </div>
                       );
                    })}
                    {trades.length === 0 && (
                        <p className="text-center text-gray-600 py-8 font-mono text-sm">Waiting for signal data...</p>
                    )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import MetricsGrid from '../components/MetricsGrid';
import ChartInView from '../components/ChartInView';
import EquityCurveChart from '../components/charts/EquityCurveChart';
import SetupPieChart from '../components/charts/SetupPieChart';
import StatsBarChart from '../components/charts/StatsBarChart';
import DailyHeatmap from '../components/charts/DailyHeatmap';
import {
  demoSummary,
  demoPeriodToday,
  demoPeriodMonth,
  demoEquityCurve,
  demoSetupStats,
  demoSetupStatsWithCount,
  demoDailyPnL,
  demoMonthlyPnL,
  demoSessionStats,
  demoTrades,
  demoRecentTrades,
  demoAccounts,
} from '../data/demoData';

const LANDING_ONLY = import.meta.env.VITE_LANDING_ONLY === 'true';

const NAV_ITEMS = [
  { label: 'Dashboard', hash: '#dashboard-preview' },
  { label: 'Accounts', hash: '#accounts' },
  { label: 'Trades', hash: '#trades-preview' },
  { label: 'Analytics', hash: '#analytics-preview' },
];

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  eval: 'Evaluation',
  demo_funded: 'Demo',
  live: 'Live',
};

function formatCurrency(val: unknown): string {
  const num = typeof val === 'string' ? parseFloat(val) : Number(val);
  if (isNaN(num)) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function formatPercent(val: unknown): string {
  const num = typeof val === 'string' ? parseFloat(val) : Number(val);
  if (isNaN(num)) return '-';
  return (Math.abs(num) <= 1 ? num * 100 : num).toFixed(2) + '%';
}

/** Reusable floating orbs for hero and all landing sections */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute top-[15%] left-[10%] w-36 h-36 rounded-full bg-[#00FF88] blur-3xl opacity-35 animate-hero-orb-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[55%] right-[12%] w-44 h-44 rounded-full bg-[#00FF88] blur-3xl opacity-35 animate-hero-orb-float" style={{ animationDelay: '-1s' }} />
      <div className="absolute bottom-[20%] left-[25%] w-28 h-28 rounded-full bg-[#00FF88] blur-2xl opacity-35 animate-hero-orb-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute top-[40%] right-[30%] w-24 h-24 rounded-full bg-[#00CCFF] blur-2xl opacity-30 animate-hero-orb-float" style={{ animationDelay: '-0.5s' }} />
      <div className="absolute top-[25%] right-[8%] w-32 h-32 rounded-full bg-[#00FF88] blur-3xl opacity-30 animate-hero-orb-float" style={{ animationDelay: '-2.5s' }} />
      <div className="absolute bottom-[35%] left-[8%] w-28 h-28 rounded-full bg-[#00FF88] blur-2xl opacity-30 animate-hero-orb-float" style={{ animationDelay: '-1.5s' }} />
      <div className="absolute top-[70%] left-[45%] w-20 h-20 rounded-full bg-[#00CCFF] blur-2xl opacity-25 animate-hero-orb-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[10%] left-[50%] w-24 h-24 rounded-full bg-[#00FF88] blur-2xl opacity-28 animate-hero-orb-float" style={{ animationDelay: '-3.5s' }} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[url('/bg-grid.svg')] bg-cover bg-fixed text-gray-200 font-sans selection:bg-green-500/30">
      {/* Landing-style header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050810]/95 backdrop-blur-md border-b border-[#00FF88]/20">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <a href="#dashboard-preview" className="text-xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            TRADEFORGE
          </a>
          <nav className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a key={item.hash} href={item.hash} className="text-sm font-medium text-gray-400 hover:text-[#00FF88] transition-colors">
                {item.label}
              </a>
            ))}
            {!LANDING_ONLY && (
              <Link to="/login" className="text-sm font-bold bg-[#00FF88] text-black px-4 py-2 rounded-md hover:bg-[#00FF88]/90 transition-all">
                Sign-in
              </Link>
            )}
          </nav>
        </div>
     
      </header>

      {/* Main content - landing style, full width with max-width container */}
      <main className="pt-24 min-h-screen relative">
        {/* Product hero - full viewport until scroll */}
        <section className="min-h-[calc(100vh-6rem)] w-full flex flex-col justify-center items-center text-center px-6 bg-[#050810]/20 border-b border-[#00FF88]/10 overflow-hidden relative">
            <FloatingOrbs />
            <h1
              className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF88] to-white mb-4 animate-hero-fade-in-up animate-hero-glow-pulse animate-hero-gradient-shift bg-[length:200%_200%]"
              style={{ animationDelay: '0s' }}
            >
              Trade Journal & Performance Analytics
            </h1>
            <p
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-hero-fade-in-up relative z-10"
              style={{ animationDelay: '0.15s' }}
            >
              Log every trade, manage multiple accounts, and see your performance at a glance. Dashboard, journal, and analytics in one place.
            </p>
            {!LANDING_ONLY && (
              <div
                className="flex flex-wrap justify-center gap-4 mb-10 animate-hero-fade-in-up relative z-10"
                style={{ animationDelay: '0.3s' }}
              >
                <Link
                  to="/login"
                  className="px-6 py-3 bg-[#00FF88] text-black font-bold rounded-lg hover:bg-[#00FF88]/90 shadow-[0_0_20px_rgba(0,255,136,0.4)] font-mono uppercase tracking-wider transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
                >
                  Sign-in
                </Link>
              </div>
            )}
            <div
              className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-mono animate-hero-fade-in-up relative z-10"
              style={{ animationDelay: '0.45s' }}
            >
              {['Dashboard', 'Trade journal', 'Analytics', 'Multi-account'].map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-hero-dot-pulse inline-block"
                    style={{ animationDelay: `${i * 0.25}s` }}
                  />{' '}
                  {label}
                </span>
              ))}
            </div>
            <a
              href="#dashboard-preview"
              className="inline-flex flex-col items-center gap-1 mt-10 text-gray-500 hover:text-[#00FF88] transition-colors text-xs font-mono uppercase tracking-wider animate-hero-fade-in-up animate-hero-float relative z-10"
              style={{ animationDelay: '0.6s' }}
            >
              See how it works
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <div className="mt-8 w-32 mx-auto relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent animate-hero-line-grow origin-center" />
            </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
          {/* Page: Dashboard */}
          <section id="dashboard-preview" className="scroll-mt-8 py-16 px-6 -mx-6 rounded-2xl bg-[#050810]/20 border border-[#00FF88]/10 space-y-8 animate-section-in overflow-hidden relative">
            <FloatingOrbs />
            <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-mono uppercase tracking-wider">Page</span>
              <span className="text-gray-500 font-mono text-sm">Dashboard — overview and key metrics at a glance</span>
            </div>
            <p className="text-gray-500 text-sm max-w-3xl">
              The Dashboard shows live metrics (Total P&L, Win Rate, Profit Factor, etc.), an equity curve, setup distribution, and your most recent trades. You can switch time ranges (1D, 1W, 1M, 1Y, ALL) to focus on different periods.
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Live P&L & win rate</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Equity curve</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Setup distribution</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Time range filters (1D–ALL)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Recent trades log</li>
            </ul>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF88] to-white drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                  DASHBOARD
                </h1>
                <p className="text-xs text-green-500/70 font-mono tracking-widest mt-1">SYSTEM STATUS:ONLINE</p>
              </div>
              <div className="flex bg-[#0A0F1E]/50 p-1 rounded-lg border border-[#00FF88]/20 backdrop-blur-md">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((r) => (
                  <button key={r} type="button" className="px-4 py-1.5 text-xs font-bold rounded-md font-mono text-gray-400 hover:text-white hover:bg-white/5">
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="bg-[#050810]/80 p-5 rounded-2xl border border-[#00FF88]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-50" />
                  <h2 className="text-sm font-bold text-[#00FF88] mb-4 font-orbitron tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00FF88] rounded-sm animate-pulse" />
                    LIVE METRICS
                  </h2>
                  <MetricsGrid metrics={demoSummary} />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-9 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 card-cyber p-1">
                    <ChartInView>
                      <EquityCurveChart data={demoEquityCurve} />
                    </ChartInView>
                  </div>
                  <div className="card-cyber p-1">
                    <ChartInView>
                      <SetupPieChart data={demoSetupStats} />
                    </ChartInView>
                  </div>
                </div>
                <div className="card-cyber p-6">
                  <h3 className="text-sm font-bold text-gray-400 mb-4 font-orbitron tracking-wider border-b border-gray-700/50 pb-2 flex justify-between">
                    <span>RECENT TRADES LOG</span>
                    <span className="text-[#00FF88] text-[10px]">LIVE UPDATES</span>
                  </h3>
                  <div className="space-y-2">
                    {demoRecentTrades.map((t) => {
                      const pnlValue = parseFloat(String(t.pnl || 0));
                      return (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-[#0A0F1E]/50 rounded-lg border border-transparent hover:border-[#00FF88]/20 group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold font-orbitron text-xs border ${t.direction === 'long' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                              {t.symbol.substring(0, 3)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-200">{t.symbol}</p>
                              <p className="text-[10px] text-gray-500 font-mono">{new Date(String(t.entry_time)).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold font-mono ${pnlValue >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                              {pnlValue >= 0 ? '+' : ''}${pnlValue.toFixed(2)}
                            </p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-600 text-gray-500">CLOSED</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 font-mono border-t border-[#00FF88]/10 pt-6 mt-4">
              All metrics update from your logged trades. Switch the active account in the sidebar to see per-account performance.
            </p>
            </div>
          </section>

          {/* Page: Analytics */}
          <section id="analytics-preview" className="scroll-mt-8 py-16 px-6 -mx-6 rounded-2xl bg-[#050810]/20 border border-[#00FF88]/10 space-y-8 animate-section-in overflow-hidden relative">
            <FloatingOrbs />
            <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-mono uppercase tracking-wider">Page</span>
              <span className="text-gray-500 font-mono text-sm">Analytics — performance breakdown and charts</span>
            </div>
            <p className="text-gray-500 text-sm max-w-3xl">
              The Analytics page gives you period performance (Today / This Month), P&L by setup and session hour, monthly and daily P&L charts, a daily P&L calendar heatmap, and a statistics table by category. Use it to review how you trade over time.
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Period performance (Today / Month)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> P&L by setup & session hour</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Monthly & daily P&L charts</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Daily heatmap calendar</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Statistics table by category</li>
            </ul>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00FF88] to-white drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                PERFORMANCE ANALYTICS
              </h1>
              <div className="px-3 py-1 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded text-[#00FF88] text-xs font-mono">
                LIVE ANALYTICS FEED
              </div>
            </div>
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
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-4 font-bold text-gray-200 font-orbitron">Today</td>
                      <td className="py-3 px-4 text-green-400 font-mono font-bold">${demoPeriodToday.avgWin.toFixed(2)}</td>
                      <td className="py-3 px-4 text-red-400 font-mono font-bold">${demoPeriodToday.avgLoss.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#00FF88]">${demoPeriodToday.totalPnL.toFixed(2)}</td>
                      <td className="py-3 px-4 text-blue-400 font-mono font-bold">{demoPeriodToday.winRate.toFixed(1)}%</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-4 font-bold text-gray-200 font-orbitron">This Month</td>
                      <td className="py-3 px-4 text-green-400 font-mono font-bold">${demoPeriodMonth.avgWin.toFixed(2)}</td>
                      <td className="py-3 px-4 text-red-400 font-mono font-bold">${demoPeriodMonth.avgLoss.toFixed(2)}</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#00FF88]">${demoPeriodMonth.totalPnL.toFixed(2)}</td>
                      <td className="py-3 px-4 text-blue-400 font-mono font-bold">{demoPeriodMonth.winRate.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[10px] text-gray-500 text-right font-mono uppercase tracking-widest border-t border-gray-800 pt-2">
                * Data based on verified closed trades
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 card-cyber p-1">
                <ChartInView>
                  <SetupPieChart data={demoSetupStats} />
                </ChartInView>
              </div>
              <div className="md:col-span-1 card-cyber p-6 flex flex-col">
                <ChartInView>
                  <StatsBarChart data={demoSetupStats} title="PnL by Setup" />
                </ChartInView>
              </div>
              <div className="md:col-span-1 card-cyber p-6 flex flex-col">
                <ChartInView>
                  <StatsBarChart data={demoSessionStats} title="PnL by Session Hour" />
                </ChartInView>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-cyber p-6">
                <ChartInView>
                  <StatsBarChart data={demoMonthlyPnL} title="Monthly P&L" />
                </ChartInView>
              </div>
              <div className="card-cyber p-6">
                <ChartInView>
                  <StatsBarChart data={demoDailyPnL} title="Daily P&L" />
                </ChartInView>
              </div>
            </div>
            <ChartInView>
              <DailyHeatmap data={demoDailyPnL} />
            </ChartInView>
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
                    {demoSetupStatsWithCount.map((s, i) => (
                      <tr key={i} className="hover:bg-[#00FF88]/5 transition-colors">
                        <td className="py-3 text-gray-200 font-medium font-orbitron">{s.label}</td>
                        <td className="py-3 text-gray-400 font-mono">{s.count ?? '-'}</td>
                        <td className={`py-3 font-bold font-mono ${s.value >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                          ${s.value.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 font-mono border-t border-[#00FF88]/10 pt-6 mt-4">
              Slice performance by setup and time of day to find your edge and weak spots.
            </p>
            </div>
          </section>

          {/* Page: Trades (Trade Journal) */}
          <section id="trades-preview" className="scroll-mt-8 py-16 px-6 -mx-6 rounded-2xl bg-[#050810]/20 border border-[#00FF88]/10 space-y-8 animate-section-in overflow-hidden relative">
            <FloatingOrbs />
            <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-mono uppercase tracking-wider">Page</span>
              <span className="text-gray-500 font-mono text-sm">Trades — trade journal and log</span>
            </div>
            <p className="text-gray-500 text-sm max-w-3xl">
              The Trades page (Trade Journal) lists all your entries with date, symbol, direction, entry/exit prices, quantity, P&L, and status. You can filter by All / Open / Closed and search by symbol. Each row can be opened for details or editing (when the app is connected to a backend).
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Full trade log with entry/exit & P&L</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Filter: All / Open / Closed</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Search by symbol</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Details & edit per trade (with backend)</li>
            </ul>
            <div className="mb-6 bg-[#050810]/50 p-4 rounded-xl border border-[#00FF88]/20 backdrop-blur-md">
              <h1 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FF88]">TRADE JOURNAL</h1>
              <p className="text-xs text-gray-500 font-mono mt-1">LOGGED ENTRIES: {demoTrades.length}</p>
            </div>
            <div className="bg-[#050810]/60 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#00FF88]/20 overflow-hidden backdrop-blur-md">
              <div className="p-4 border-b border-[#00FF88]/10 flex flex-wrap gap-4 items-center bg-[#0A0F1E]/50">
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-1.5 text-xs font-bold rounded font-mono uppercase bg-[#00FF88] text-black">All</button>
                  <button type="button" className="px-4 py-1.5 text-xs font-bold rounded font-mono uppercase bg-transparent border border-gray-600 text-gray-400">Open</button>
                  <button type="button" className="px-4 py-1.5 text-xs font-bold rounded font-mono uppercase bg-transparent border border-gray-600 text-gray-400">Closed</button>
                </div>
                <div className="flex-1 max-w-xs relative">
                  <input type="text" placeholder="SEARCH SYMBOL..." className="w-full px-4 py-1.5 bg-[#0A0F1E] border border-gray-700 rounded text-gray-300 text-xs font-mono uppercase tracking-wider placeholder-gray-600" readOnly />
                  <span className="absolute right-3 top-1.5 text-[#00FF88]/50">🔍</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0A0F1E] text-gray-500 text-xs font-bold uppercase tracking-wider font-orbitron border-b border-[#00FF88]/20">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Symbol</th>
                      <th className="px-6 py-4">Direction</th>
                      <th className="px-6 py-4 text-right">Entry</th>
                      <th className="px-6 py-4 text-right">Exit</th>
                      <th className="px-6 py-4 text-right">Qty</th>
                      <th className="px-6 py-4 text-right">P&L</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00FF88]/5">
                    {demoTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-[#00FF88]/5 transition-colors">
                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                          {new Date(trade.entry_time).toLocaleDateString()} <span className="text-gray-600">{new Date(trade.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-200 font-orbitron tracking-wide">{trade.symbol}</td>
                        <td className="px-6 py-4 text-xs font-mono">
                          <span className={`px-1.5 py-0.5 rounded border ${trade.direction === 'long' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{formatCurrency(trade.entry_price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{formatCurrency(trade.exit_price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{trade.quantity}</td>
                        <td className={`px-6 py-4 text-sm font-bold font-mono text-right ${parseFloat(String(trade.pnl || 0)) >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                          {formatCurrency(trade.pnl)} <span className="text-[10px] opacity-70">({formatPercent(trade.pnl_percent)})</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-green-500/10 text-[#00FF88] border-green-500/30">Closed</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className="text-[#00FF88] font-mono text-xs uppercase tracking-wider border border-[#00FF88]/30 px-2 py-1 rounded">Details</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 font-mono border-t border-[#00FF88]/10 pt-6 mt-4">
              Keep a full history of every trade for review and tax reporting.
            </p>
            </div>
          </section>

          {/* Page: Accounts */}
          <section id="accounts" className="scroll-mt-8 py-16 px-6 -mx-6 rounded-2xl bg-[#050810]/20 border border-[#00FF88]/10 space-y-8 animate-section-in overflow-hidden relative">
            <FloatingOrbs />
            <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40 font-mono uppercase tracking-wider">Page</span>
              <span className="text-gray-500 font-mono text-sm">Accounts — manage your trading accounts</span>
            </div>
            <p className="text-gray-500 text-sm max-w-3xl">
              The Accounts page lets you create, edit, and delete trading accounts. Each account has a name, type (e.g. Demo / Live), broker, initial capital, and a balance that updates from your closed trades. You select the active account in the sidebar to filter Dashboard, Trades, and Analytics by that account. Below is how the Accounts page looks after sign-in.
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-400 font-mono">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Create, edit & delete accounts</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Types: Demo / Eval / Live</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Balance from closed trades</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" /> Switch active account in sidebar</li>
            </ul>
            {/* Preview: Accounts page layout with sample accounts */}
            <div className="bg-[#050810]/30 p-6 rounded-2xl border border-[#00FF88]/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FF88]">
                  ACCOUNTS MANAGEMENT
                </h2>
                <span className="px-4 py-2 text-xs bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] rounded font-mono uppercase tracking-wider opacity-80">
                  + Create New Account
                </span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {demoAccounts.map((account) => (
                  <li
                    key={account.id}
                    className="bg-[#0A0F1E]/60 p-6 rounded-xl border border-[#00FF88]/20 hover:border-[#00FF88]/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group backdrop-blur-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xl font-bold text-gray-200 group-hover:text-white font-orbitron tracking-wide">{account.account_name}</p>
                        <p className="text-sm text-[#00FF88] font-mono mt-1 opacity-80">
                          {ACCOUNT_TYPE_LABELS[account.account_type ?? ''] ?? account.account_type ?? '-'}
                        </p>
                      </div>
                      <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono border border-gray-700">
                        {account.broker ?? '—'}
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Balance</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        ${Number(account.current_balance ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-gray-800">
                      <span className="px-3 py-1.5 text-xs bg-transparent border border-gray-600 text-gray-500 rounded font-mono uppercase cursor-default">
                        Edit
                      </span>
                      <span className="px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/20 text-red-500/70 rounded font-mono uppercase cursor-default">
                        Delete
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 text-xs text-center mt-6">
                {LANDING_ONLY ? 'Landing preview — full app requires sign-in.' : 'Sign-in to access the full app and manage accounts.'}
              </p>
            </div>
            <p className="text-center text-xs text-gray-500 font-mono border-t border-[#00FF88]/10 pt-6 mt-6">
              One place for all your accounts — evaluation, demo, and live.
            </p>
            </div>
          </section>
        </div>
        <footer className="border-t border-[#00FF88]/10 py-6 text-center text-xs text-gray-500">
          <p className="font-orbitron tracking-widest opacity-50">TRADEFORGE SYSTEM v2.0 // CYBER-LINK ESTABLISHED</p>
          <p className="mt-2 text-amber-500/70 font-mono text-[10px]">Frontend-only demo — no backend</p>
        </footer>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTradeStore } from '../store/tradeStore';
import { useAccountStore } from '../store/accountStore';
import type { Trade, TradeStatus, MultiLegTrade } from '../types/trade';
import TradeForm from '../components/TradeForm';
import TradeDetail from '../components/TradeDetail';
import ImportModal from '../components/ImportModal';

export default function TradesPage() {
  const { selectedAccountId, fetchAccounts } = useAccountStore();
  const { trades, isLoading, fetchTrades, fetchTradeById, deleteTrade, closeTrade, setFilters, filters, selectedTrade, clearTrades } = useTradeStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingTrade, setEditingTrade] = useState<any>(null);
  const [viewingTrade, setViewingTrade] = useState<MultiLegTrade | null>(null);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTrades(selectedAccountId);
    } else {
      clearTrades();
    }
  }, [selectedAccountId, fetchTrades, filters.page, filters.status, filters.symbol, clearTrades]);

  // Sync viewingTrade with store's selectedTrade when it updates
  useEffect(() => {
    if (selectedTrade) {
      setViewingTrade(selectedTrade);
    }
  }, [selectedTrade]);

  const handleStatusFilter = (status?: TradeStatus) => {
    setFilters({ status, page: 1 });
  };

  const handleSymbolSearch = (symbol: string) => {
    setFilters({ symbol: symbol || undefined, page: 1 });
  };

  const handleViewTrade = async (id: number) => {
    await fetchTradeById(id);
  };

  const handleCloseDetail = () => {
    setViewingTrade(null);
  };

  const handleEditTrade = (trade: any) => {
    setEditingTrade(trade);
    setViewingTrade(null);
    setShowForm(true);
  };

  const handleDeleteTrade = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      await deleteTrade(id);
      setViewingTrade(null);
    }
  };

  const handleCloseOpenTrade = async (trade: Trade) => {
    const exitPrice = prompt('Enter exit price:');
    if (exitPrice) {
      const exitTime = new Date().toISOString().slice(0, 16);
      await closeTrade(trade.id, parseFloat(exitPrice), exitTime);
    }
  };

  const formatCurrency = (val: any) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatPercent = (val: any) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '-';
    return (num * 100).toFixed(2) + '%';
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border";
    switch (status) {
      case 'open': return `${baseClasses} bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse`;
      case 'closed': return `${baseClasses} bg-green-500/10 text-[#00FF88] border-green-500/30`;
      case 'cancelled': return `${baseClasses} bg-gray-500/10 text-gray-400 border-gray-500/30`;
      default: return `${baseClasses} bg-gray-500/10 text-gray-400 border-gray-500/30`;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 bg-[#050810]/50 p-4 rounded-xl border border-[#00FF88]/20 backdrop-blur-md">
        <div>
            <h1 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FF88]">TRADE JOURNAL</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">LOGGED ENTRIES: {trades.length}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowImport(true)}
            className="bg-[#0A0F1E] border border-[#00FF88]/30 text-[#00FF88] px-4 py-2 rounded hover:bg-[#00FF88]/10 transition-all shadow-[0_0_5px_rgba(0,255,136,0.1)] font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_10px_rgba(0,255,136,0.2)]"
          >
            Import CSV
          </button>
          <button
            onClick={() => { setEditingTrade(null); setShowForm(true); }}
            className="bg-[#00FF88] text-black px-4 py-2 rounded border border-[#00FF88] hover:bg-[#00FF88]/90 transition-all shadow-[0_0_10px_rgba(0,255,136,0.3)] font-mono text-sm uppercase tracking-wider font-bold hover:shadow-[0_0_15px_rgba(0,255,136,0.5)]"
          >
            Add Trade
          </button>
        </div>
      </div>

      <div className="bg-[#050810]/60 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#00FF88]/20 overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-[#00FF88]/10 flex flex-wrap gap-4 items-center bg-[#0A0F1E]/50">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusFilter(undefined)}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-all font-mono uppercase ${!filters.status ? 'bg-[#00FF88] text-black shadow-[0_0_5px_rgba(0,255,136,0.4)]' : 'bg-transparent border border-gray-600 text-gray-400 hover:border-[#00FF88] hover:text-[#00FF88]'}`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter('open')}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-all font-mono uppercase ${filters.status === 'open' ? 'bg-[#00FF88] text-black shadow-[0_0_5px_rgba(0,255,136,0.4)]' : 'bg-transparent border border-gray-600 text-gray-400 hover:border-[#00FF88] hover:text-[#00FF88]'}`}
            >
              Open
            </button>
            <button
              onClick={() => handleStatusFilter('closed')}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-all font-mono uppercase ${filters.status === 'closed' ? 'bg-[#00FF88] text-black shadow-[0_0_5px_rgba(0,255,136,0.4)]' : 'bg-transparent border border-gray-600 text-gray-400 hover:border-[#00FF88] hover:text-[#00FF88]'}`}
            >
              Closed
            </button>
          </div>
          <div className="flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="SEARCH SYMBOL..."
              className="w-full px-4 py-1.5 bg-[#0A0F1E] border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all text-xs font-mono uppercase tracking-wider placeholder-gray-600"
              onChange={(e) => handleSymbolSearch(e.target.value)}
            />
            <div className="absolute right-3 top-1.5 text-[#00FF88]/50">🔍</div>
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
              {isLoading && trades.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-[#00FF88] animate-pulse font-mono">LOADING DATA STREAM...</td></tr>
              ) : trades.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-gray-500 font-mono">NO SIGNAL DATA. INITIATE NEW TRADE.</td></tr>
              ) : trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#00FF88]/5 transition-colors cursor-pointer group" onClick={() => handleViewTrade(trade.id)}>
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                    {new Date(trade.entry_time).toLocaleDateString()} <span className="text-gray-600">{new Date(trade.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-200 group-hover:text-white font-orbitron tracking-wide">{trade.symbol}</td>
                  <td className="px-6 py-4 text-xs font-mono">
                    <span className={`px-1.5 py-0.5 rounded border ${trade.direction === 'long' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                      {trade.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{formatCurrency(trade.entry_price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{formatCurrency(trade.exit_price)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono text-right">{trade.quantity}</td>
                  <td className={`px-6 py-4 text-sm font-bold font-mono text-right ${parseFloat(trade.pnl as any) >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_2px_rgba(0,255,136,0.5)]' : 'text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]'}`}>
                    {formatCurrency(trade.pnl)} <span className="text-[10px] opacity-70">({formatPercent(trade.pnl_percent)})</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={getStatusBadge(trade.status)}>
                      {trade.status === 'open' ? 'Open' : trade.status === 'closed' ? 'Closed' : 'Cancelled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleViewTrade(trade.id); }}
                      className="text-[#00FF88] hover:text-white transition-colors font-mono text-xs uppercase tracking-wider border border-[#00FF88]/30 px-2 py-1 rounded hover:bg-[#00FF88]/20"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showImport && (
        <ImportModal 
          onClose={() => setShowImport(false)} 
          onSuccess={() => {
            if (selectedAccountId) {
              fetchTrades(selectedAccountId);
              fetchAccounts();
            }
          }} 
        />
      )}

      {showForm && (
        <TradeForm 
          onClose={() => { setShowForm(false); setEditingTrade(null); }} 
          initialData={editingTrade} 
          onSuccess={() => {
            if (selectedAccountId) {
              fetchTrades(selectedAccountId);
              fetchAccounts();
            }
          }}
        />
      )}

      {viewingTrade && (
        <TradeDetail
          trade={viewingTrade}
          onClose={handleCloseDetail}
          onEdit={() => handleEditTrade(viewingTrade)}
          onDelete={async () => {
            await handleDeleteTrade(viewingTrade.id);
            fetchAccounts();
          }}
          onCloseTrade={async () => {
            await handleCloseOpenTrade(viewingTrade);
            fetchAccounts();
          }}
        />
      )}
    </div>
  );
}

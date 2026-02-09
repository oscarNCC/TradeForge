import type { MultiLegTrade } from '../types/trade';

interface TradeDetailProps {
  trade: MultiLegTrade;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseTrade: () => void;
}

export default function TradeDetail({ trade, onClose, onEdit, onDelete, onCloseTrade }: TradeDetailProps) {
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#050810]/95 border border-[#00FF88]/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
        
        <div className="p-6 border-b border-[#00FF88]/10 flex justify-between items-center bg-[#0A0F1E]">
          <div>
            <h2 className="text-xl font-bold font-orbitron text-white flex items-center gap-2 tracking-wide">
              {trade.symbol} 
              <span className={`text-[10px] px-2 py-0.5 rounded border ${trade.direction === 'long' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'} font-mono uppercase`}>
                {trade.direction.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-1">ID: {trade.id} <span className="text-gray-700">|</span> {new Date(trade.entry_time).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-[#00FF88] transition-colors text-2xl">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0A0F1E] p-3 rounded-lg border border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">Entry Price</p>
              <p className="text-lg font-bold text-gray-200 font-mono">{formatCurrency(trade.entry_price)}</p>
            </div>
            <div className="bg-[#0A0F1E] p-3 rounded-lg border border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">Exit Price</p>
              <p className="text-lg font-bold text-gray-200 font-mono">{trade.exit_price ? formatCurrency(trade.exit_price) : '-'}</p>
            </div>
            <div className="bg-[#0A0F1E] p-3 rounded-lg border border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">Quantity</p>
              <p className="text-lg font-bold text-gray-200 font-mono">{trade.quantity}</p>
            </div>
            <div className="bg-[#0A0F1E] p-3 rounded-lg border border-gray-800">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-mono">P&L</p>
              <p className={`text-lg font-bold font-mono ${parseFloat(trade.pnl as any) >= 0 ? 'text-[#00FF88] drop-shadow-[0_0_2px_rgba(0,255,136,0.5)]' : 'text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]'}`}>
                {formatCurrency(trade.pnl)} <span className="text-sm opacity-70">({formatPercent(trade.pnl_percent)})</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#00FF88] mb-2 uppercase tracking-tight font-orbitron">Trade Notes</h3>
            <div className="bg-[#0A0F1E] p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap min-h-[80px] border border-gray-800 font-mono">
              {trade.notes || 'No notes available.'}
            </div>
          </div>

          {trade.legs && trade.legs.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-[#00FF88] mb-2 uppercase tracking-tight font-orbitron">Legs Details</h3>
              <div className="overflow-x-auto border border-gray-800 rounded-lg">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#0A0F1E] text-gray-500 font-bold uppercase font-mono">
                    <tr>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Strike</th>
                      <th className="px-3 py-2">Premium</th>
                      <th className="px-3 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 bg-[#050810]/50">
                    {trade.legs.map((leg) => (
                      <tr key={leg.id} className="hover:bg-[#00FF88]/5">
                        <td className="px-3 py-2 uppercase font-mono">{leg.leg_type.replace('_', ' ')}</td>
                        <td className="px-3 py-2 font-mono">{formatCurrency(leg.strike_price)}</td>
                        <td className="px-3 py-2 font-mono">{formatCurrency(leg.premium)}</td>
                        <td className="px-3 py-2 font-mono">{leg.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-[#00FF88]/10">
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="px-4 py-2 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 hover:border-red-500/50 transition-all font-mono uppercase tracking-wider"
              >
                Delete Trade
              </button>
            </div>
            <div className="flex gap-2">
              {trade.status === 'open' && (
                <button
                  onClick={onCloseTrade}
                  className="px-4 py-2 text-xs font-bold text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 rounded hover:bg-[#00FF88]/20 transition-all font-mono uppercase tracking-wider"
                >
                  Close Trade
                </button>
              )}
              <button
                onClick={onEdit}
                className="px-4 py-2 text-xs font-bold text-gray-200 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 hover:border-gray-500 transition-all font-mono uppercase tracking-wider"
              >
                Edit Trade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

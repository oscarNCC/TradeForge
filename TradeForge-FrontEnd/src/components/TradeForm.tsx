import React, { useState } from 'react';
import { useTradeStore } from '../store/tradeStore';
import { useAccountStore } from '../store/accountStore';
import type { CreateTradeRequest, TradeDirection, LegType } from '../types/trade';

interface TradeFormProps {
  onClose: () => void;
  initialData?: any;
  onSuccess?: () => void;
}

export default function TradeForm({ onClose, initialData, onSuccess }: TradeFormProps) {
  const selectedAccountId = useAccountStore((s) => s.selectedAccountId);
  const createTrade = useTradeStore((s) => s.createTrade);
  const updateTrade = useTradeStore((s) => s.updateTrade);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || '',
    direction: (initialData?.direction || 'long') as TradeDirection,
    entry_price: initialData?.entry_price || '',
    quantity: initialData?.quantity || '',
    entry_time: initialData?.entry_time || new Date().toISOString().slice(0, 16),
    exit_price: initialData?.exit_price || '',
    exit_time: initialData?.exit_time || '',
    commission: initialData?.commission || '0',
    setup_type: initialData?.setup_type || '',
    notes: initialData?.notes || '',
    isMultiLeg: !!initialData?.legs && initialData.legs.length > 0,
    legs: (initialData?.legs || []) as any[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLeg = () => {
    setFormData((prev) => ({
      ...prev,
      legs: [...prev.legs, { leg_type: 'buy_call', strike_price: '', premium: '', quantity: '', expiration: '' }]
    }));
  };

  const handleRemoveLeg = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      legs: prev.legs.filter((_, i) => i !== index)
    }));
  };

  const handleLegChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newLegs = [...prev.legs];
      newLegs[index] = { ...newLegs[index], [field]: value };
      return { ...prev, legs: newLegs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateTradeRequest = {
        account_id: selectedAccountId,
        symbol: formData.symbol,
        direction: formData.direction,
        entry_price: parseFloat(formData.entry_price),
        quantity: parseInt(formData.quantity),
        entry_time: formData.entry_time,
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : undefined,
        exit_time: formData.exit_time || undefined,
        commission: parseFloat(formData.commission),
        setup_type: formData.setup_type,
        notes: formData.notes,
        legs: formData.isMultiLeg ? formData.legs.map(leg => ({
          leg_type: leg.leg_type as LegType,
          strike_price: parseFloat(leg.strike_price),
          premium: parseFloat(leg.premium),
          quantity: parseInt(leg.quantity),
          expiration: leg.expiration || undefined
        })) : undefined
      };

      if (initialData?.id) {
        await updateTrade(initialData.id, payload);
      } else {
        await createTrade(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#050810]/95 border border-[#00FF88]/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
        
        <div className="p-6 border-b border-[#00FF88]/10 flex justify-between items-center bg-[#0A0F1E]">
          <h2 className="text-xl font-bold font-orbitron text-[#00FF88] uppercase tracking-wider shadow-[0_0_5px_rgba(0,255,136,0.3)]">
              {initialData ? 'Edit Trade' : 'Add New Trade'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#00FF88] transition-colors text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-500 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Symbol</label>
              <input
                required
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g., SPY"
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Direction</label>
              <select
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono uppercase"
              >
                <option value="long">LONG</option>
                <option value="short">SHORT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Entry Price</label>
              <input
                required
                type="number"
                step="0.0001"
                name="entry_price"
                value={formData.entry_price}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Quantity</label>
              <input
                required
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Entry Time</label>
              <input
                required
                type="datetime-local"
                name="entry_time"
                value={formData.entry_time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono text-xs"
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Setup Type</label>
              <input
                type="text"
                name="setup_type"
                value={formData.setup_type}
                onChange={handleChange}
                placeholder="e.g., Breakout"
                className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 border-t border-[#00FF88]/10 mt-4">
            <input
              type="checkbox"
              id="isMultiLeg"
              checked={formData.isMultiLeg}
              onChange={(e) => setFormData(prev => ({ ...prev, isMultiLeg: e.target.checked }))}
              className="rounded bg-[#0A0F1E] border-gray-700 text-[#00FF88] focus:ring-[#00FF88]"
            />
            <label htmlFor="isMultiLeg" className="text-sm font-bold text-gray-400 font-mono uppercase tracking-wider">Multi-Leg / Options Mode</label>
          </div>

          {formData.isMultiLeg && (
            <div className="space-y-4 border-t border-[#00FF88]/10 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[#00FF88] font-orbitron">OPTIONS LEG DETAILS</h3>
                <button
                  type="button"
                  onClick={handleAddLeg}
                  className="text-xs text-[#00FF88] hover:text-white font-mono uppercase border border-[#00FF88]/30 px-2 py-1 rounded bg-[#00FF88]/10 hover:bg-[#00FF88]/20 transition-all"
                >
                  + Add Leg
                </button>
              </div>
              {formData.legs.map((leg, index) => (
                <div key={index} className="p-3 bg-[#0A0F1E] rounded-lg border border-gray-800 grid grid-cols-2 md:grid-cols-5 gap-2 relative group hover:border-[#00FF88]/30 transition-colors">
                   <select
                    value={leg.leg_type}
                    onChange={(e) => handleLegChange(index, 'leg_type', e.target.value)}
                    className="text-xs p-1.5 bg-[#050810] border border-gray-700 rounded text-gray-300 focus:border-[#00FF88]"
                  >
                    <option value="buy_call">Buy Call</option>
                    <option value="sell_call">Sell Call</option>
                    <option value="buy_put">Buy Put</option>
                    <option value="sell_put">Sell Put</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Strike"
                    value={leg.strike_price}
                    onChange={(e) => handleLegChange(index, 'strike_price', e.target.value)}
                    className="text-xs p-1.5 bg-[#050810] border border-gray-700 rounded text-gray-300 focus:border-[#00FF88]"
                  />
                  <input
                    type="number"
                    placeholder="Premium"
                    value={leg.premium}
                    onChange={(e) => handleLegChange(index, 'premium', e.target.value)}
                    className="text-xs p-1.5 bg-[#050810] border border-gray-700 rounded text-gray-300 focus:border-[#00FF88]"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={leg.quantity}
                    onChange={(e) => handleLegChange(index, 'quantity', e.target.value)}
                    className="text-xs p-1.5 bg-[#050810] border border-gray-700 rounded text-gray-300 focus:border-[#00FF88]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLeg(index)}
                    className="text-red-500 hover:text-red-400 text-lg absolute -right-2 -top-2 bg-[#050810] rounded-full w-5 h-5 flex items-center justify-center border border-gray-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-[#00FF88]/10">
            <label className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Trade strategy notes..."
              className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#00FF88]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-400 bg-transparent border border-gray-700 rounded hover:border-gray-500 hover:text-gray-200 transition-all font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-bold text-black bg-[#00FF88] rounded border border-[#00FF88] hover:bg-[#00FF88]/90 disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 transition-all shadow-[0_0_10px_rgba(0,255,136,0.3)] font-mono uppercase tracking-wider"
            >
              {isSubmitting ? 'PROCESSING...' : 'SAVE DATA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import type { Account } from '../types/account';
import type { AccountType } from '../types/account';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'eval', label: 'Evaluation' },
  { value: 'demo_funded', label: 'Demo' },
  { value: 'live', label: 'Live' },
];

const BROKERS = ['IB', 'TradeZero', 'NinjaTrader'];

interface AccountFormProps {
  account?: Account | null;
  onSubmit: (data: {
    account_name: string;
    account_type: AccountType | null;
    broker: string | null;
    initial_capital: number | null;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function AccountForm({ account, onSubmit, onCancel, isLoading = false }: AccountFormProps) {
  const [account_name, setAccountName] = useState('');
  const [account_type, setAccountType] = useState<AccountType | ''>('');
  const [broker, setBroker] = useState('');
  const [initial_capital, setInitialCapital] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (account) {
      setAccountName(account.account_name);
      setAccountType((account.account_type as AccountType) || '');
      setBroker(account.broker ?? '');
      setInitialCapital(account.initial_capital ?? '');
    } else {
      setAccountName('');
      setAccountType('');
      setBroker('');
      setInitialCapital('');
    }
  }, [account]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const name = account_name.trim();
    if (!name) {
      setError('Please enter account name');
      return;
    }
    const capital = initial_capital.trim() ? parseFloat(initial_capital) : null;
    if (initial_capital.trim() && (isNaN(capital!) || capital! < 0)) {
      setError('Please enter a valid number for initial capital');
      return;
    }
    try {
      await onSubmit({
        account_name: name,
        account_type: account_type || null,
        broker: broker.trim() || null,
        initial_capital: capital,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  return (
    <div className="bg-[#0A0F1E] border border-[#00FF88]/20 p-6 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <h3 className="text-lg font-bold text-[#00FF88] mb-4 font-orbitron uppercase tracking-wider border-b border-[#00FF88]/20 pb-2">
          {account ? 'Edit Account Credentials' : 'New Account Initialization'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/30 p-2 rounded font-mono" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="account_name" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
            Account Name *
          </label>
          <input
            id="account_name"
            type="text"
            value={account_name}
            onChange={(e) => setAccountName(e.target.value)}
            maxLength={100}
            required
            className="w-full bg-[#050810] border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
            placeholder="e.g., EVAL-01"
          />
        </div>
        <div>
          <label htmlFor="account_type" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
            Account Type
          </label>
          <select
            id="account_type"
            value={account_type}
            onChange={(e) => setAccountType(e.target.value as AccountType | '')}
            className="w-full bg-[#050810] border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono uppercase"
          >
            <option value="">-- SELECT TYPE --</option>
            {ACCOUNT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="broker" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
            Broker
          </label>
          <select
            id="broker"
            value={broker}
            onChange={(e) => setBroker(e.target.value)}
            className="w-full bg-[#050810] border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono uppercase"
          >
            <option value="">-- SELECT BROKER --</option>
            {BROKERS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="initial_capital" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
            Initial Capital
          </label>
          <input
            id="initial_capital"
            type="number"
            min="0"
            step="0.01"
            value={initial_capital}
            onChange={(e) => setInitialCapital(e.target.value)}
            className="w-full bg-[#050810] border border-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-mono"
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-2 pt-4 border-t border-[#00FF88]/20">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#00FF88] text-black rounded font-bold hover:bg-[#00FF88]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(0,255,136,0.3)] font-mono uppercase tracking-wider"
          >
            {isLoading ? 'PROCESSING...' : account ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
          </button>
          {onCancel && (
            <button 
                type="button" 
                onClick={onCancel} 
                className="px-4 py-2 bg-transparent border border-gray-600 text-gray-400 rounded font-bold hover:border-gray-400 hover:text-gray-200 transition-all font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

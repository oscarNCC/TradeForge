import { useEffect, useState } from 'react';
import { useAccountStore } from '../store/accountStore';
import type { Account } from '../types/account';
import AccountForm from '../components/AccountForm';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  eval: 'Evaluation',
  demo_funded: 'Demo',
  live: 'Live',
};

export default function AccountsPage() {
  const {
    accounts,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    isLoading,
    error,
    clearError,
  } = useAccountStore();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  async function handleCreate(data: {
    account_name: string;
    account_type: 'eval' | 'demo_funded' | 'live' | null;
    broker: string | null;
    initial_capital: number | null;
  }) {
    setFormLoading(true);
    clearError();
    try {
      await createAccount(data);
      setShowCreateForm(false);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(data: {
    account_name: string;
    account_type: 'eval' | 'demo_funded' | 'live' | null;
    broker: string | null;
    initial_capital: number | null;
  }) {
    if (!editingAccount) return;
    setFormLoading(true);
    try {
      await updateAccount(editingAccount.id, data);
      setEditingAccount(null);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(account: Account) {
    const confirmed = window.confirm(`Are you sure you want to delete account "${account.account_name}"?`);
    if (confirmed) {
      await deleteAccount(account.id);
    }
  }

  const activeAccounts = accounts.filter((a) => a.is_active !== false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00FF88] font-orbitron drop-shadow-[0_0_5px_rgba(0,255,136,0.3)]">
              ACCOUNTS MANAGEMENT
          </h1>
          {!showCreateForm && !editingAccount && (
            <button
            type="button"
            onClick={() => {
                clearError();
                setShowCreateForm(true);
            }}
            className="px-6 py-2 bg-[#00FF88] text-black rounded font-medium hover:bg-[#00FF88]/90 shadow-[0_0_10px_rgba(0,255,136,0.5)] font-mono text-sm uppercase tracking-wider transition-all"
            >
            + Create New Account
            </button>
        )}
      </div>

      {error && (
        <p className="p-4 bg-red-900/20 border border-red-500/50 text-red-500 rounded-lg mb-6 shadow-[0_0_10px_rgba(239,68,68,0.2)]" role="alert">
          {error}
        </p>
      )}

      {showCreateForm && !editingAccount && (
        <div className="mb-6 bg-[#050810]/50 p-6 rounded-xl border border-[#00FF88]/20 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-6 text-[#00FF88] font-orbitron">Create New Account</h2>
          <AccountForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isLoading={formLoading}
          />
        </div>
      )}

      {editingAccount && (
        <div className="mb-6 bg-[#050810]/50 p-6 rounded-xl border border-[#00FF88]/20 backdrop-blur-md">
          <h2 className="text-xl font-bold mb-6 text-[#00FF88] font-orbitron">Edit Account</h2>
          <AccountForm
            account={editingAccount}
            onSubmit={handleUpdate}
            onCancel={() => setEditingAccount(null)}
            isLoading={formLoading}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00FF88]"></div>
        </div>
      ) : activeAccounts.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-500 font-mono">No accounts found. Initialize system with a new account.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeAccounts.map((account) => (
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
                    {account.broker ?? 'Unknown Broker'}
                </div>
              </div>
              
              <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Balance</p>
                  <p className="text-2xl font-bold text-white font-mono">${(account.current_balance ?? 0).toLocaleString()}</p>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAccount(account);
                    setShowCreateForm(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-transparent border border-gray-600 text-gray-400 rounded hover:border-[#00FF88] hover:text-[#00FF88] transition-colors font-mono uppercase"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(account)}
                  className="px-3 py-1.5 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded hover:bg-red-500/20 hover:border-red-500/60 transition-colors font-mono uppercase"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

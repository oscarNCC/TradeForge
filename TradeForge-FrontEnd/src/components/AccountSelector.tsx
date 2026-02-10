import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccountStore } from '../store/accountStore';

export default function AccountSelector() {
  const { accounts, selectedAccountId, selectAccount, getSelectedAccount } = useAccountStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedAccount = getSelectedAccount();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAccounts = accounts.filter((a) => a.is_active !== false);

  if (activeAccounts.length === 0) {
    return (
      <Link
        to="/accounts"
        className="px-3 py-1.5 text-sm bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/50 rounded hover:bg-[#00FF88]/30 transition-all shadow-[0_0_10px_rgba(0,255,136,0.2)]"
      >
        Create Account
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#00FF88] bg-[#0A0F1E]/80 border border-[#00FF88]/30 rounded-md hover:bg-[#00FF88]/10 hover:border-[#00FF88]/60 transition-all shadow-[0_0_5px_rgba(0,255,136,0.1)] backdrop-blur-sm group"
      >
        <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_5px_#00FF88] group-hover:animate-pulse"></div>
        <span className="font-orbitron tracking-wide">{selectedAccount?.account_name ?? 'SELECT ACCOUNT'}</span>
        <svg 
            className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 bottom-full mb-2 w-56 max-h-64 overflow-y-auto bg-[#050810]/95 border border-[#00FF88]/30 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 backdrop-blur-xl">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#00FF88]/50 to-transparent shrink-0"></div>
          {activeAccounts.map((acc) => (
            <li key={acc.id}>
              <button
                type="button"
                onClick={() => {
                  selectAccount(acc.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-l-2 ${
                  acc.id === selectedAccountId 
                    ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88] font-bold' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                    <span>{acc.account_name}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-50 px-1 border border-gray-600 rounded">{acc.broker}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

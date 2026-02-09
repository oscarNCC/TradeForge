import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAccountStore } from '../store/accountStore';
import AccountSelector from './AccountSelector';

// Main Layout Component
export default function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const fetchAccounts = useAccountStore((s) => s.fetchAccounts);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Accounts', path: '/accounts' },
    { label: 'Trades', path: '/trades' },
    { label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="flex min-h-screen bg-[url('/bg-grid.svg')] bg-cover bg-fixed text-gray-200 font-sans selection:bg-green-500/30">
        {/* Sidebar */}
        <aside className="w-64 fixed inset-y-0 left-0 z-50 flex flex-col bg-[#050810]/95 backdrop-blur-md border-r border-[#00FF88]/20 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <div className="p-6 flex items-center justify-center border-b border-[#00FF88]/10 bg-gradient-to-b from-[#0A0F1E] to-transparent">
                <span className="text-xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                    TRADEFORGE
                </span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 relative overflow-hidden ${
                                isActive 
                                    ? 'text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 shadow-[0_0_10px_rgba(0,255,136,0.1)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/10'
                            }`}
                        >
                            <span className="relative z-10">{item.label}</span>
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00FF88] shadow-[0_0_8px_#00FF88]"></div>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#00FF88]/10 bg-[#0A0F1E]/50">
                <div className="mb-4">
                  <AccountSelector />
                </div>
                {user && (
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Operator</span>
                            <span className="text-sm font-bold text-[#00FF88] truncate max-w-[120px]">{user.username || user.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen relative">
            {/* Top decorative bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#00FF88] via-transparent to-[#00FF88] opacity-50 fixed top-0 z-40 ml-64"></div>
            
            <div className="p-8">
                <Outlet />
            </div>
            
            {/* Footer / Copyright */}
            <footer className="absolute bottom-0 w-full py-4 text-center text-xs text-gray-600">
                <span className="font-orbitron tracking-widest opacity-30">TRADEFORGE SYSTEM v2.0 // CYBER-LINK ESTABLISHED</span>
            </footer>
        </main>
    </div>
  );
}

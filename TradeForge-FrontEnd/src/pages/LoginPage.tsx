import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Login failed. Please check your email or password.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden">
        {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF88]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[2px] h-[100px] bg-gradient-to-b from-transparent via-[#00FF88] to-transparent opacity-20 rotate-45"></div>
      </div>

      <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm border border-[#00FF88]/20 relative z-10">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#00FF88] font-orbitron tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">TRADEFORGE</h1>
            <p className="text-gray-400 text-xs font-mono mt-2 tracking-wide uppercase">System Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-500 text-sm p-3 rounded font-mono text-center">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#050810] border border-gray-700 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              placeholder="ENTER EMAIL"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#050810] border border-gray-700 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              placeholder="ENTER PASSWORD"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00FF88] text-black py-3 rounded font-bold hover:bg-[#00FF88]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] font-mono uppercase tracking-widest text-sm"
          >
            {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
          </button>
        </form>
      </div>
    </div>
  );
}

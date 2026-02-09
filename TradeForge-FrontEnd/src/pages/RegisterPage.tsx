import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await register(email, password, username || undefined);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Email might be already in use.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden">
        {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF88]/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[2px] h-[100px] bg-gradient-to-t from-transparent via-[#00FF88] to-transparent opacity-20 -rotate-45"></div>
      </div>

      <div className="bg-[#0A0F1E]/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm border border-[#00FF88]/20 relative z-10">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#00FF88] font-orbitron tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">TRADEFORGE</h1>
            <p className="text-gray-400 text-xs font-mono mt-2 tracking-wide uppercase">New User Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="username" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
              Username (Optional)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#050810] border border-gray-700 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              placeholder="ENTER USERNAME"
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
              minLength={6}
              className="w-full bg-[#050810] border border-gray-700 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              placeholder="CREATE PASSWORD"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#00FF88] mb-1 font-mono uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#050810] border border-gray-700 rounded px-4 py-3 text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] transition-all font-orbitron tracking-wide"
              placeholder="CONFIRM PASSWORD"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00FF88] text-black py-3 rounded font-bold hover:bg-[#00FF88]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] font-mono uppercase tracking-widest text-sm mt-4"
          >
            {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6 font-mono">
          Already registered?{' '}
          <Link to="/login" className="text-[#00FF88] font-bold hover:text-white transition-colors hover:underline">
            ACCESS TERMINAL
          </Link>
        </p>
      </div>
    </div>
  );
}

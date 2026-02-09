import { useState } from 'react';
import { importTrades } from '../services/tradeService';
import { useAccountStore } from '../store/accountStore';

interface ImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ onClose, onSuccess }: ImportModalProps) {
  const { accounts, selectedAccountId } = useAccountStore();
  const [targetAccountId, setTargetAccountId] = useState<number | ''>(selectedAccountId || '');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; count: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (!targetAccountId) {
      setError('Please select a target account first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const resp = await importTrades(file, targetAccountId as number);
      setResult(resp);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#050810]/95 border border-[#00FF88]/30 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent"></div>
        
        <div className="p-6 border-b border-[#00FF88]/10 flex justify-between items-center bg-[#0A0F1E]">
          <h2 className="text-xl font-bold font-orbitron text-[#00FF88] uppercase tracking-wider">Import CSV Records</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#00FF88] text-2xl transition-colors">&times;</button>
        </div>

        <div className="p-6">
          {result ? (
            <div className="text-center py-8">
              <div className="text-[#00FF88] text-5xl mb-4 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">✓</div>
              <h3 className="text-lg font-bold text-white font-orbitron">{result.message}</h3>
              <p className="text-gray-500 mt-2 font-mono">Syncing database...</p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#00FF88] font-mono uppercase tracking-wider">Select Target Account</label>
                <select
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0A0F1E] border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88] text-sm font-orbitron"
                  required
                >
                  <option value="">-- SELECT ACCOUNT --</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.account_name} ({acc.broker})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FF88]/50 hover:bg-[#00FF88]/5 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📁</div>
                  <p className="text-sm text-gray-400 group-hover:text-[#00FF88] font-mono">
                    {file ? file.name : 'CLICK OR DRAG CSV FILE HERE'}
                  </p>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-500 rounded-lg text-sm font-mono">
                  {error}
                </div>
              )}

              <div className="bg-[#0A0F1E] border border-blue-500/20 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-1 font-orbitron">Protocol Info</h4>
                <ul className="text-xs text-blue-300/80 list-disc list-inside space-y-1 font-mono">
                  <li>Supports TradeSim standard CSV format</li>
                  <li>System automatically groups trades by Symbol</li>
                  <li>Account name must match the Account field in CSV</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#00FF88]/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-bold text-gray-500 bg-transparent border border-gray-700 rounded hover:border-gray-500 hover:text-gray-300 transition-all font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className="px-6 py-2 text-sm font-bold text-black bg-[#00FF88] rounded border border-[#00FF88] hover:bg-[#00FF88]/90 disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 transition-all shadow-[0_0_10px_rgba(0,255,136,0.3)] font-mono uppercase tracking-wider"
                >
                  {isUploading ? 'UPLOADING...' : 'INITIATE UPLOAD'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

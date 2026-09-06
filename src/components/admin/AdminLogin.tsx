import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, User, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToPortfolio: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onReturnToPortfolio }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login({ username, password });
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication service error. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setUsername('admin');
    setPassword('password123');
    setError(null);
  };

  return (
    <div id="admin-login-screen" className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#050505]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F27D26]/10 blur-3xl pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Back link */}
        <button
          id="admin-login-back-btn"
          onClick={onReturnToPortfolio}
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#F27D26]" />
          <span>Return to Public Portfolio</span>
        </button>

        <div className="p-8 rounded bg-[#080808] border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded bg-white/5 border border-white/10 text-[#F27D26] flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-[#F27D26]" />
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-1">
            RESTRICTED ENTRY
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Administrator Authentication
          </h2>
          <p className="text-xs text-white/50 mb-6 font-mono">
            Protected area to manage showcase portfolio projects, database records, and contact inquiries.
          </p>

          {error && (
            <div className="p-3.5 mb-5 rounded bg-rose-950/40 border border-rose-500/40 flex items-center gap-2.5 text-rose-300 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded font-mono text-xs uppercase tracking-widest font-bold text-black bg-[#F27D26] hover:bg-[#d86815] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg"
            >
              <KeyRound className={`w-3.5 h-3.5 text-black ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <button
              id="admin-fill-demo-creds-btn"
              type="button"
              onClick={handleFillDemoCreds}
              className="w-full py-2.5 px-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Fill Default Credentials (admin / password123)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

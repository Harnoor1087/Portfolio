import React from 'react';
import { ArrowUp, Terminal, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin, isAdminLoggedIn = false }) => {
  const [clickCount, setClickCount] = React.useState(0);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secret owner gesture: Clicking the terminal icon 3 times opens Admin Portal
  const handleSecretTrigger = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      setClickCount(0);
      onNavigateToAdmin();
    } else {
      setClickCount(nextCount);
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
    }
  };

  return (
    <footer id="main-footer" className="py-12 bg-[#050505] border-t border-white/5 text-white/50 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info with secret trigger */}
          <div className="flex items-center gap-3">
            <button
              id="footer-terminal-secret-trigger"
              onClick={handleSecretTrigger}
              className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[#F27D26] hover:bg-white/10 transition-colors cursor-pointer select-none"
              title="Alex Rivera Systems"
              aria-label="Terminal Monogram"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <div>
              <div className="font-mono font-bold tracking-wider text-white text-xs uppercase">
                Alex Rivera <span className="text-[#F27D26]">//</span> 2026
              </div>
              <div className="text-[11px] font-mono text-white/40">Staff Full-Stack Engineer & Distributed Systems</div>
            </div>
          </div>

          {/* Center Info */}
          <div className="text-center text-xs font-mono text-white/40">
            <span>Engineered with React 19, TypeScript, Tailwind CSS & Motion.</span>
            <span className="block mt-0.5 text-white/30">Backend API routes & database persistence active.</span>
          </div>

          {/* Right Action Links */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                id="footer-owner-indicator"
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-[11px] font-mono uppercase tracking-wider cursor-pointer"
                title="Active Owner Session - Click to access Dashboard"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Owner Dashboard</span>
              </button>
            )}

            <button
              id="footer-back-to-top"
              onClick={scrollToTop}
              className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] font-mono uppercase tracking-widest text-white/30 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Alex Rivera. All rights reserved. Artisan minimalist engineering system.</span>
          {isAdminLoggedIn && (
            <span className="text-emerald-400/60 font-mono text-[9px] uppercase tracking-widest">
              [Authorized Admin Node Attached]
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};

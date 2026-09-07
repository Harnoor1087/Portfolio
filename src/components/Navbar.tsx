import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, ArrowUpRight, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'portfolio' | 'admin';
  onNavigate: (view: 'portfolio' | 'admin') => void;
  isAdminLoggedIn: boolean;
  profile?: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdminLoggedIn, profile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'AR';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(profile?.name);
  const badgeRole = profile?.badgeRole || 'Staff SWE';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView === 'admin') {
      onNavigate('portfolio');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/50'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => {
            onNavigate('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="text-xl sm:text-2xl font-bold tracking-tighter text-white">
            {initials}<span className="text-[#F27D26]">.</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] font-mono px-2 py-0.5 rounded border border-white/10 text-white/40 bg-white/5">
            {badgeRole}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-[0.2em] font-medium text-white/50">
          {currentView === 'portfolio' ? (
            <>
              <button
                id="nav-link-about"
                onClick={() => scrollToSection('about')}
                className="hover:text-white hover:border-b hover:border-[#F27D26] pb-1 transition-all cursor-pointer"
              >
                About & Bio
              </button>
              <button
                id="nav-link-skills"
                onClick={() => scrollToSection('skills')}
                className="hover:text-white hover:border-b hover:border-[#F27D26] pb-1 transition-all cursor-pointer"
              >
                Skills
              </button>
              <button
                id="nav-link-timeline"
                onClick={() => scrollToSection('timeline')}
                className="hover:text-white hover:border-b hover:border-[#F27D26] pb-1 transition-all cursor-pointer"
              >
                Timeline
              </button>
              <button
                id="nav-link-projects"
                onClick={() => scrollToSection('projects')}
                className="hover:text-white hover:border-b hover:border-[#F27D26] pb-1 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Projects</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse" />
              </button>
              <button
                id="nav-link-contact"
                onClick={() => scrollToSection('contact')}
                className="hover:text-white hover:border-b hover:border-[#F27D26] pb-1 transition-all cursor-pointer"
              >
                Contact
              </button>
            </>
          ) : (
            <button
              id="nav-link-back-portfolio"
              onClick={() => onNavigate('portfolio')}
              className="text-white border-b border-[#F27D26] pb-1 flex items-center gap-2 cursor-pointer"
            >
              ← Return to Portfolio
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Admin Dashboard Trigger - Only visible to authenticated owner or when inside admin view */}
          {currentView === 'admin' ? (
            <button
              id="nav-admin-toggle-btn"
              onClick={() => onNavigate('portfolio')}
              className="px-3.5 py-1.5 rounded border border-[#F27D26]/40 bg-[#F27D26]/10 text-[#F27D26] text-xs uppercase tracking-[0.15em] font-medium flex items-center gap-2 transition-colors cursor-pointer"
              title="Return to Public Portfolio"
            >
              <span>← Public Portfolio</span>
            </button>
          ) : isAdminLoggedIn ? (
            <button
              id="nav-admin-toggle-btn"
              onClick={() => onNavigate('admin')}
              className="px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono uppercase tracking-[0.15em] flex items-center gap-2 transition-colors cursor-pointer"
              title="You are logged in as owner. Press Ctrl+Shift+A or click to open Admin Dashboard."
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owner Panel</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          ) : null}

          {currentView === 'portfolio' && (
            <button
              id="nav-get-in-touch-btn"
              onClick={() => scrollToSection('contact')}
              className="bg-[#F27D26] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Menu Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAdminLoggedIn && currentView === 'portfolio' && (
            <button
              id="nav-mobile-admin-btn"
              onClick={() => onNavigate('admin')}
              className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              aria-label="Open Admin Dashboard"
              title="Owner Session Active"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </button>
          )}
          {currentView === 'admin' && (
            <button
              id="nav-mobile-return-btn"
              onClick={() => onNavigate('portfolio')}
              className="px-2.5 py-1.5 rounded bg-white/5 border border-white/10 text-white text-xs font-mono"
            >
              ← Site
            </button>
          )}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded bg-white/5 border border-white/10 text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505]/98 border-b border-white/10 backdrop-blur-xl px-6 pt-4 pb-6 space-y-2 overflow-hidden shadow-2xl"
          >
            {currentView === 'portfolio' ? (
              <>
                <button
                  id="mobile-link-about"
                  onClick={() => scrollToSection('about')}
                  className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  About & Bio
                </button>
                <button
                  id="mobile-link-skills"
                  onClick={() => scrollToSection('skills')}
                  className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Skills
                </button>
                <button
                  id="mobile-link-timeline"
                  onClick={() => scrollToSection('timeline')}
                  className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Timeline & Experience
                </button>
                <button
                  id="mobile-link-projects"
                  onClick={() => scrollToSection('projects')}
                  className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                >
                  <span>Projects</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30 rounded">
                    Database
                  </span>
                </button>
                <button
                  id="mobile-link-contact"
                  onClick={() => scrollToSection('contact')}
                  className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Contact & Inquiries
                </button>
              </>
            ) : (
              <button
                id="mobile-link-back-portfolio"
                onClick={() => {
                  onNavigate('portfolio');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded text-xs uppercase tracking-[0.2em] font-medium text-[#F27D26] hover:bg-white/5 transition-colors"
              >
                ← Return to Public Portfolio
              </button>
            )}

            {(isAdminLoggedIn || currentView === 'admin') && (
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  id="mobile-admin-switch"
                  onClick={() => {
                    onNavigate(currentView === 'admin' ? 'portfolio' : 'admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-[#F27D26]"
                >
                  <Shield className="w-4 h-4 text-[#F27D26]" />
                  <span>{currentView === 'admin' ? 'View Public Site' : 'Admin Management Dashboard'}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

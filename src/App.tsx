import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { api, getStoredToken } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Synchronize route with window.location.pathname and browser history
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin') || window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Verify stored admin token on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      if (token) {
        const isValid = await api.verifyAuth();
        setIsAdminLoggedIn(isValid);
      } else {
        setIsAdminLoggedIn(false);
      }
      setAuthChecking(false);
    };

    checkAuth();
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + A to open admin portal secretly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (view: 'portfolio' | 'admin') => {
    setCurrentView(view);
    const newPath = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAdminLoggedIn(false);
  };

  const scrollToSection = (id: string) => {
    if (currentView === 'admin') {
      navigateTo('portfolio');
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
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#F27D26] selection:text-black">
      {/* Global Sticky Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main id="main-content">
        {currentView === 'portfolio' ? (
          <div>
            <Hero
              onExploreProjects={() => scrollToSection('projects')}
              onContactClick={() => scrollToSection('contact')}
            />
            <About />
            <Projects
              onNavigateToAdmin={() => navigateTo('admin')}
              isAdminLoggedIn={isAdminLoggedIn}
            />
            <Contact />
            <Footer onNavigateToAdmin={() => navigateTo('admin')} />
          </div>
        ) : (
          <div>
            {authChecking ? (
              <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white/50 text-sm">
                <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mb-2" />
              </div>
            ) : isAdminLoggedIn ? (
              <AdminDashboard
                onLogout={handleLogout}
                onReturnToPortfolio={() => navigateTo('portfolio')}
              />
            ) : (
              <AdminLogin
                onLoginSuccess={handleLoginSuccess}
                onReturnToPortfolio={() => navigateTo('portfolio')}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

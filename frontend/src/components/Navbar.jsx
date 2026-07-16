import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, ChevronDown, LogOut, User, Sun, Moon, Sparkles } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Your career command center' },
  '/skill-gap': { title: 'Skill Gap Analysis', subtitle: 'Compare your skills vs. requirements' },
  '/roadmap': { title: 'AI Learning Roadmap', subtitle: 'Your personalized 12-week plan' },
  '/interview': { title: 'AI Interview Simulator', subtitle: 'Practice with voice dictation' },
  '/mock-test': { title: 'Mock Test Portal', subtitle: 'Assess your coding & aptitude' },
  '/github-analyzer': { title: 'GitHub Scorer', subtitle: 'Audit public repos & languages' },
  '/linkedin-analyzer': { title: 'LinkedIn Analyzer', subtitle: 'Optimize profile keywords' },
  '/internships': { title: 'Internship Finder', subtitle: 'AI-matched opportunities for you' },
  '/profile': { title: 'My Profile', subtitle: 'Manage your career profile' },
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const Navbar = ({ user }) => {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title: 'CareerPilot AI', subtitle: 'Your AI career co-pilot' };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [streak, setStreak] = useState(3); // default hackathon mock streak

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  // Dark/Light Mode Theme Initialization & Effect
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Streak Tracker Sync
  useEffect(() => {
    const savedStreak = localStorage.getItem('streak_count');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    } else {
      localStorage.setItem('streak_count', '3');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Mock notifications
  const notifications = [
    { text: "Welcome to CareerPilot AI! 👋", time: "Just now" },
    { text: "Flame streak active! Maintain 3 days streak 🔥", time: "1 hour ago" },
    { text: "Completed Week 1 Roadmap? Click to verify! 🗺️", time: "1 day ago" }
  ];

  return (
    <header className="glass-panel border-b border-white/60 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40 no-print">
      {/* Left: Page Title */}
      <div className="pl-12 lg:pl-0">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-brand-slate tracking-tight">{page.title}</h2>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {getGreeting()}, <span className="text-slate-600 font-semibold">{user?.name || 'Student'}</span>! {page.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs font-black text-amber-600 dark:text-amber-500 shadow-sm" title="Daily Active Streak">
          <span>🔥</span>
          <span>{streak} Days</span>
        </div>

        {/* AI Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
          <motion.div className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500">AI Active</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-2xl bg-white/60 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-indigo hover:bg-brand-lightBlue transition-all duration-200"
          title="Switch Dark/Light Theme">
          {darkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} />}
        </button>

        {/* Date */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/60 border border-slate-100 text-xs font-semibold text-slate-500">
          <Calendar size={13} className="text-brand-indigo" />
          <span className="hidden md:inline">{formattedDate}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-9 w-9 rounded-2xl bg-white/60 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-indigo hover:bg-brand-lightBlue transition-all duration-200">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-purple" />
          </button>

          {/* Notif Popover */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-64 glass-card rounded-2xl overflow-hidden shadow-card-hover border border-white/80 z-50">
                <div className="p-3 border-b border-slate-100/50 flex justify-between items-center bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbox Notifications</span>
                  <span className="badge badge-indigo text-[9px] py-0.5">{notifications.length}</span>
                </div>
                <div className="p-1 space-y-0.5">
                  {notifications.map((n, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl hover:bg-slate-50/50 transition-colors text-left space-y-1">
                      <p className="text-xs font-bold text-slate-700 leading-tight">{n.text}</p>
                      <p className="text-[9px] text-slate-400">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200/80 bg-white/70 hover:bg-white hover:shadow-card-premium transition-all duration-300 group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-700 leading-tight">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 leading-tight max-w-[100px] truncate">{user?.email || ''}</p>
            </div>
            <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 glass-card rounded-2xl overflow-hidden shadow-card-hover border border-white/80 z-50">
              <div className="p-2 space-y-0.5">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-brand-lightBlue hover:text-brand-indigo transition-colors">
                  <User size={15} />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {(dropdownOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setDropdownOpen(false); setNotifOpen(false); }} />
      )}
    </header>
  );
};

export default Navbar;


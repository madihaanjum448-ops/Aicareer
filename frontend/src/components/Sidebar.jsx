import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Award, Route, User, Briefcase,
  ChevronLeft, ChevronRight, LogOut, Menu, X,
  Brain, ClipboardList, Globe
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Overview & Analysis' },
  { name: 'Skill Gap', path: '/skill-gap', icon: Award, desc: 'Gap Analysis' },
  { name: 'AI Roadmap', path: '/roadmap', icon: Route, desc: '12-Week Plan' },
  { name: 'Mock Interview', path: '/interview', icon: Brain, desc: 'Voice Simulator' },
  { name: 'Mock Tests', path: '/mock-test', icon: ClipboardList, desc: 'MCQ Practice' },
  { name: 'GitHub Scorer', path: '/github-analyzer', icon: Globe, desc: 'Portfolio Audit' },
  { name: 'LinkedIn Scorer', path: '/linkedin-analyzer', icon: Globe, desc: 'Profile Optimizer' },
  { name: 'Internships', path: '/internships', icon: Briefcase, desc: 'Opportunities' },
  { name: 'My Profile', path: '/profile', icon: User, desc: 'Your Account' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const SidebarContent = ({ isMobile = false }) => {
    const isCollapsed = collapsed && !isMobile;

    return (
      <div className={`flex flex-col h-full ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 relative`}>
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* ─── Brand Header ─── */}
        <div className={`relative p-5 border-b border-white/[0.06] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <h1 className="text-base font-bold text-white truncate">CareerPilot</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-md border border-purple-500/20">
                  AI Agent
                </span>
              </motion.div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="h-7 w-7 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-purple-400 hover:bg-white/[0.1] flex items-center justify-center transition-all duration-200 shrink-0"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        {/* ─── Nav Label ─── */}
        {!isCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="px-5 pt-4 pb-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest"
          >
            Navigation
          </motion.p>
        )}

        {/* ─── Navigation ─── */}
        <nav
          className={`flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${isCollapsed ? 'px-2' : ''}`}
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                title={isCollapsed ? item.name : ''}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-400 border-l-2 border-purple-500 shadow-[inset_0_0_20px_rgba(147,51,234,0.05)]'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border-l-2 border-transparent'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
              >
                <div
                  className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCollapsed ? '' : 'group-[.active]:bg-purple-500/10'
                  }`}
                >
                  <Icon size={19} />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{item.name}</p>
                    <p className="text-[10px] text-slate-600 group-[.active]:text-purple-400/60 leading-tight transition-colors">
                      {item.desc}
                    </p>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ─── User Section + Logout ─── */}
        <div className={`relative p-3 border-t border-white/[0.06] space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
          {/* User card */}
          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_0_12px_rgba(147,51,234,0.25)]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
              </div>
            </motion.div>
          )}

          {/* Collapsed avatar */}
          {isCollapsed && user && (
            <div className="flex justify-center py-1">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(147,51,234,0.25)]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut size={18} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            {!isCollapsed && <span className="text-sm font-semibold">Sign Out</span>}
          </button>

          {/* Copyright */}
          {!isCollapsed && (
            <p className="text-center text-[10px] text-slate-700 pb-1">© 2026 CareerPilot AI</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-[#0d1117]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl flex items-center justify-center text-slate-400 shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay + sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 bg-[#0d1117]/95 backdrop-blur-2xl border-r border-white/[0.06] overflow-y-auto"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0d1117]/90 backdrop-blur-2xl border-r border-white/[0.06] h-screen shrink-0 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

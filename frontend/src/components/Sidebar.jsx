import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Award, Route, User, Briefcase,
  ChevronLeft, ChevronRight, LogOut, Menu, X,
  Brain, ClipboardList, Github, Linkedin
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Overview & Analysis' },
  { name: 'Skill Gap', path: '/skill-gap', icon: Award, desc: 'Gap Analysis' },
  { name: 'AI Roadmap', path: '/roadmap', icon: Route, desc: '12-Week Plan' },
  { name: 'Mock Interview', path: '/interview', icon: Brain, desc: 'Voice Simulator' },
  { name: 'Mock Tests', path: '/mock-test', icon: ClipboardList, desc: 'MCQ Practice' },
  { name: 'GitHub Scorer', path: '/github-analyzer', icon: Github, desc: 'Portfolio Audit' },
  { name: 'LinkedIn Scorer', path: '/linkedin-analyzer', icon: Linkedin, desc: 'Profile Optimizer' },
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

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${collapsed && !isMobile ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Brand Header */}
      <div className={`p-5 border-b border-slate-100/60 flex items-center ${collapsed && !isMobile ? 'justify-center' : 'justify-between'} gap-3`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center shadow-glow-sm shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-brand-slate truncate">CareerPilot</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-purple bg-brand-lavender px-1.5 py-0.5 rounded-md">
                AI Agent
              </span>
            </div>
          )}
        </div>

        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-xl bg-slate-100 hover:bg-brand-lightBlue text-slate-400 hover:text-brand-indigo flex items-center justify-center transition-all duration-200 shrink-0">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Nav label */}
      {(!collapsed || isMobile) && (
        <p className="px-5 pt-4 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</p>
      )}

      {/* Navigation */}
      <nav className={`flex-1 px-3 py-2 space-y-1 overflow-y-auto ${collapsed && !isMobile ? 'px-2' : ''}`} style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? item.name : ''}
              className={({ isActive }) =>
                `sidebar-link group ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'justify-center px-2' : ''}`
              }>
              <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                collapsed && !isMobile ? '' : 'group-[.active]:bg-brand-indigo/10'
              }`}>
                <Icon size={19} />
              </div>
              {(!collapsed || isMobile) && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{item.name}</p>
                  <p className="text-[10px] text-slate-400 group-[.active]:text-brand-indigo/60 leading-tight">{item.desc}</p>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section + Logout */}
      <div className={`p-3 border-t border-slate-100/60 space-y-2 ${collapsed && !isMobile ? 'px-2' : ''}`}>
        {/* User card */}
        {(!collapsed || isMobile) && user && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        )}

        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group ${
            collapsed && !isMobile ? 'justify-center' : ''
          }`}
          title="Sign Out">
          <LogOut size={18} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {(!collapsed || isMobile) && <span className="text-sm font-semibold">Sign Out</span>}
        </button>

        {(!collapsed || isMobile) && (
          <p className="text-center text-[10px] text-slate-300 pb-1">© 2026 CareerPilot AI</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 glass-panel rounded-2xl flex items-center justify-center text-slate-600 shadow-card-premium">
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 glass-panel border-r border-white/60 overflow-y-auto">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <X size={16} />
              </button>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col glass-panel border-r border-white/60 h-screen shrink-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

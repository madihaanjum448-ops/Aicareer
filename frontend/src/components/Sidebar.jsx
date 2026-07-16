import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Award, Route, User } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Gap', path: '/skill-gap', icon: Award },
    { name: 'AI Roadmap', path: '/roadmap', icon: Route },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-brand-lightBlue/30 h-screen flex flex-col justify-between shrink-0">
      {/* Brand Section */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center shadow-lg shadow-brand-indigo/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-brand-slate tracking-tight">CareerPilot</h1>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-purple/80 bg-brand-lavender px-1.5 py-0.5 rounded-md">AI Agent</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 text-brand-indigo border-l-4 border-brand-indigo shadow-sm shadow-brand-indigo/5 font-semibold'
                    : 'text-slate-500 hover:text-brand-indigo hover:bg-slate-50/50'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-6 border-t border-slate-100/50 text-center">
        <p className="text-xs text-slate-400">© 2026 CareerPilot AI</p>
      </div>
    </aside>
  );
};

export default Sidebar;

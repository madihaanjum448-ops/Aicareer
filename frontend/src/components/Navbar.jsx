import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Calendar } from 'lucide-react';

const Navbar = ({ user }) => {
  const location = useLocation();
  
  // Map routes to friendly page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/skill-gap':
        return 'Skill Gap Analysis';
      case '/roadmap':
        return 'AI Learning Roadmap';
      case '/profile':
        return 'My Profile';
      default:
        return 'CareerPilot AI';
    }
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="glass-panel border-b border-brand-lightBlue/30 px-8 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-brand-slate tracking-tight">{getPageTitle()}</h2>
        <p className="text-xs text-slate-400 font-medium">
          {getGreeting()}, {user?.name || 'Student'}!
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-2xl">
          <Calendar className="w-4 h-4 text-brand-indigo" />
          <span>{formattedDate}</span>
        </div>

        {/* User Card */}
        <Link 
          to="/profile" 
          className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-100 bg-white/50 hover:bg-white hover:shadow-sm transition-all duration-300 group"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-700 leading-tight">{user?.name || 'Student'}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{user?.email || 'student@careerpilot.ai'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

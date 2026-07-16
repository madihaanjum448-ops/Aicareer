import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Protected Route wrapper component
const ProtectedRoute = ({ user }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar user={user} />
        <main className="p-6 max-w-7xl mx-auto w-full flex-grow pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user info is in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* Premium background */}
      <div className="ai-bg">
        <div className="orbit-ring-1"></div>
        <div className="orbit-ring-2"></div>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Auth onLogin={handleLogin} mode="login" />} />
        <Route path="/signup" element={<Auth onLogin={handleLogin} mode="signup" />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

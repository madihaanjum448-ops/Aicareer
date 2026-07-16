import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';

const Auth = ({ onLogin, mode: initialMode }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await API.post(endpoint, payload);
      
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-white/60 shadow-glass flex flex-col p-8 sm:p-10 relative">
        
        {/* Glow behind logo */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-indigo/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-purple/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple items-center justify-center shadow-lg shadow-brand-indigo/20 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">CareerPilot AI</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {isLogin ? 'Welcome back! Accelerate your learning journey.' : 'Get a personalized AI roadmap to your dream career.'}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-pulse">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-600 leading-tight">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide uppercase px-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-indigo transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 transition-all duration-300 placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase px-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-indigo transition-colors duration-300" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 transition-all duration-300 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide uppercase px-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-indigo transition-colors duration-300" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 transition-all duration-300 placeholder:text-slate-300"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide uppercase px-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-indigo transition-colors duration-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 transition-all duration-300 placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo/95 hover:to-brand-purple/95 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-brand-indigo/25 hover:shadow-xl hover:shadow-brand-indigo/30 transition-all duration-300 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="text-brand-indigo hover:text-brand-indigo/80 font-bold underline transition-colors duration-300 focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;

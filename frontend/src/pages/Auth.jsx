import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldAlert, CheckCircle, Brain, Map, Target, Award } from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI Resume Analysis', desc: 'Extract skills & score your resume' },
  { icon: Target, title: 'Skill Gap Detection', desc: 'Identify exactly what you\'re missing' },
  { icon: Map, title: '12-Week Roadmap', desc: 'Personalized learning plans via AI' },
  { icon: Award, title: 'Career Matching', desc: '95% accuracy in career recommendations' },
];

const InputField = ({ label, type, placeholder, value, onChange, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 tracking-wide uppercase px-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-brand-indigo transition-colors duration-300" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/60 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 transition-all duration-300 placeholder:text-slate-300 font-medium"
      />
    </div>
  </div>
);

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
      if (!name) { setError('Please enter your name.'); setLoading(false); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
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
    <div className="min-h-screen flex">
      {/* Left Panel — Feature Highlights */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 60%, #A78BFA 100%)' }}>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white/8 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full border border-white/10 animate-spin-slow" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full border border-white/8 animate-spin-reverse" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">CareerPilot AI</span>
        </div>

        {/* Main content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-3">
              Accelerate your<br />career with AI
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Join 10,000+ students who've landed their dream roles using AI-powered guidance.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/15">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{f.title}</p>
                    <p className="text-xs text-white/60">{f.desc}</p>
                  </div>
                  <CheckCircle size={16} className="text-white/40 ml-auto shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">© 2026 CareerPilot AI. All rights reserved.</p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-lg font-bold text-brand-slate">CareerPilot AI</span>
          </div>

          {/* Form card */}
          <div className="glass-card rounded-4xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-indigo/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-purple/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple items-center justify-center shadow-glow-indigo mb-4">
                  <Sparkles size={22} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isLogin ? 'Welcome back!' : 'Create account'}
                </h1>
                <p className="text-sm text-slate-400 mt-1.5">
                  {isLogin
                    ? 'Sign in to continue your career journey.'
                    : 'Get your personalized AI career roadmap today.'}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
                  <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-600 leading-tight">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <InputField label="Full Name" type="text" placeholder="John Doe"
                    value={name} onChange={e => setName(e.target.value)} icon={User} />
                )}
                <InputField label="Email Address" type="email" placeholder="name@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} icon={Mail} />
                <InputField label="Password" type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} icon={Lock} />
                {!isLogin && (
                  <InputField label="Confirm Password" type="password" placeholder="••••••••"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={Lock} />
                )}

                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2.5 group">
                    {loading ? (
                      <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Toggle */}
              <div className="text-center mt-6">
                <p className="text-sm text-slate-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={toggleMode}
                    className="text-brand-indigo hover:text-brand-indigo/80 font-bold transition-colors duration-200">
                    {isLogin ? 'Sign Up Free' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

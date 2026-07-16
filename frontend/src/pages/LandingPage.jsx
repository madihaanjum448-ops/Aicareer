import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Sparkles, ArrowRight, Play, Brain, FileSearch, Target,
  Map, BookOpen, Briefcase, Award, BarChart3, Bot,
  ChevronRight, Star, Zap, Shield, TrendingUp, Users,
  CheckCircle, Github, Linkedin, Twitter, Menu, X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const LandingNav = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-panel shadow-nav' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center shadow-glow-indigo">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="text-lg font-bold text-brand-slate">CareerPilot <span className="gradient-text">AI</span></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium text-slate-500 hover:text-brand-indigo transition-colors duration-200">
              {item}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="text-sm font-semibold text-slate-600 hover:text-brand-indigo transition-colors px-4 py-2">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')}
            className="btn-primary px-5 py-2.5 text-sm">
            Get Started Free
          </button>
        </div>

        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-600">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-white/60 px-6 py-4 space-y-3">
          {['Features', 'How it Works', 'Testimonials'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-600 py-2">
              {item}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/login')} className="flex-1 btn-secondary py-2.5 text-sm text-center">Sign In</button>
            <button onClick={() => navigate('/signup')} className="flex-1 btn-primary py-2.5 text-sm text-center">Sign Up</button>
          </div>
        </div>
      )}
    </header>
  );
};

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="hero-glow" style={{ top: '10%', right: '5%' }} />
      <div className="hero-glow" style={{ bottom: '10%', left: '5%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.10) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text Content */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge badge-indigo mb-4 inline-flex">
              <Sparkles size={11} />
              Powered by Gemini AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            <span className="text-brand-slate">Find Your</span>
            <br />
            <span className="hero-gradient-text">Perfect Career</span>
            <br />
            <span className="text-brand-slate">Path with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed max-w-xl">
            AI-powered career guidance that analyzes resumes, detects skill gaps, recommends
            internships, and creates <span className="font-semibold text-slate-700">personalized learning roadmaps</span> — tailored just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary px-8 py-4 text-base flex items-center gap-2.5 group">
              <Sparkles size={18} />
              <span>Start Free</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary px-8 py-4 text-base flex items-center gap-2.5 group">
              <Play size={16} className="text-brand-indigo" />
              <span>Explore Features</span>
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 pt-2">
            {[
              { icon: Shield, text: 'Secure & Private' },
              { icon: Zap, text: 'Instant Analysis' },
              { icon: CheckCircle, text: 'No Credit Card' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon size={14} className="text-brand-indigo" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: AI Robot Illustration + floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center">

          {/* Main illustration card */}
          <div className="relative z-10">
            <div className="glass-card rounded-4xl p-8 w-80 h-80 flex flex-col items-center justify-center text-center animate-float">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-brand-indigo via-brand-purple to-violet-400 flex items-center justify-center mb-4 shadow-glow-indigo">
                <Bot size={56} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">CareerPilot AI</h3>
              <p className="text-sm text-slate-500 mt-1">Your intelligent career co-pilot</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-600 font-semibold">AI Engine Active</span>
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-4 -left-8 glass-card rounded-2xl p-4 shadow-card-premium z-20 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <TrendingUp size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Resume Score</p>
                <p className="text-lg font-black text-slate-800">87/100</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 -right-8 glass-card rounded-2xl p-4 shadow-card-premium z-20 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-brand-lightBlue border border-brand-indigo/10 flex items-center justify-center">
                <Target size={18} className="text-brand-indigo" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Career Match</p>
                <p className="text-lg font-black text-brand-indigo">92%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
            className="absolute top-1/2 -right-4 glass-card rounded-2xl p-3 shadow-card-premium z-20 hidden lg:block">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-lavender flex items-center justify-center">
                <Sparkles size={14} className="text-brand-purple" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Roadmap</p>
                <p className="text-sm font-bold text-slate-700">Week 5/12</p>
              </div>
            </div>
          </motion.div>

          {/* Orbit rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full border border-brand-indigo/8 animate-spin-slow" />
            <div className="absolute w-72 h-72 rounded-full border border-brand-purple/6 animate-spin-reverse" style={{ animationDuration: '15s' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   STATS SECTION
───────────────────────────────────────────── */
const StatsSection = () => {
  const stats = [
    { value: 10000, suffix: '+', label: 'Students Guided', icon: Users, color: 'from-brand-indigo/10 to-brand-indigo/5', iconColor: 'text-brand-indigo', borderColor: 'border-brand-indigo/10' },
    { value: 95, suffix: '%', label: 'Resume Accuracy', icon: Target, color: 'from-brand-purple/10 to-brand-purple/5', iconColor: 'text-brand-purple', borderColor: 'border-brand-purple/10' },
    { value: 500, suffix: '+', label: 'Career Paths', icon: Map, color: 'from-emerald-500/10 to-emerald-500/5', iconColor: 'text-emerald-500', borderColor: 'border-emerald-500/10' },
    { value: 1000, suffix: '+', label: 'Learning Resources', icon: BookOpen, color: 'from-amber-500/10 to-amber-500/5', iconColor: 'text-amber-500', borderColor: 'border-amber-500/10' },
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="stat-card text-center">
                <div className={`inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} items-center justify-center mb-4`}>
                  <Icon size={22} className={stat.iconColor} />
                </div>
                <div className="text-4xl font-black text-slate-800 leading-none">
                  <CountUp end={stat.value} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                  <span className="text-brand-indigo">{stat.suffix}</span>
                </div>
                <p className="text-sm font-medium text-slate-400 mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FEATURES SECTION
───────────────────────────────────────────── */
const FeaturesSection = () => {
  const features = [
    { icon: FileSearch, title: 'Resume Analyzer', desc: 'AI extracts skills, projects, experience and scores your resume against industry benchmarks instantly.', color: 'from-blue-500 to-brand-indigo', bg: 'from-blue-50 to-brand-lightBlue' },
    { icon: Target, title: 'Skill Gap Analysis', desc: 'Compare your current skills vs. industry requirements and get a precise gap score for your dream role.', color: 'from-brand-indigo to-brand-purple', bg: 'from-brand-lightBlue to-brand-lavender' },
    { icon: TrendingUp, title: 'Career Recommendation', desc: 'AI recommends the best-fit career paths based on your skills, experience, and career aspirations.', color: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50' },
    { icon: Bot, title: 'AI Mentor', desc: 'Chat with your personal AI career mentor for advice, resume feedback, and interview prep anytime.', color: 'from-brand-purple to-rose-500', bg: 'from-purple-50 to-rose-50' },
    { icon: Map, title: 'Learning Roadmap', desc: 'Get a custom 12-week learning plan with curated resources, projects, and milestones for your goal.', color: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50' },
    { icon: Briefcase, title: 'Internship Finder', desc: 'Discover AI-matched internships based on your resume, skills, and career goal with match percentages.', color: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50' },
    { icon: Award, title: 'Resume Score', desc: 'Get a detailed 0-100 resume score with AI recommendations on how to improve every section.', color: 'from-rose-500 to-pink-500', bg: 'from-rose-50 to-pink-50' },
    { icon: BarChart3, title: 'Dashboard Analytics', desc: 'Track your progress, roadmap completion, skill growth, and career readiness all in one beautiful dashboard.', color: 'from-sky-500 to-blue-600', bg: 'from-sky-50 to-blue-50' },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="badge badge-indigo">
            <Sparkles size={11} /> Everything You Need
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-black text-brand-slate">
            All your career tools,<br /><span className="gradient-text">powered by AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto">
            From resume analysis to job placement, CareerPilot AI provides a complete ecosystem for career growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="feature-card p-6 group">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.bg} border border-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <div className={`bg-gradient-to-br ${f.color} rounded-xl p-2`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-indigo opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ChevronRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   HOW IT WORKS SECTION
───────────────────────────────────────────── */
const HowItWorksSection = () => {
  const steps = [
    { step: '01', title: 'Upload Your Resume', desc: 'Drag & drop your PDF resume. AI instantly extracts your skills, experience, and projects.', icon: FileSearch },
    { step: '02', title: 'Select Career Goal', desc: 'Choose your target career path from 8+ curated options including AI, DevOps, Full Stack, and more.', icon: Target },
    { step: '03', title: 'Get AI Analysis', desc: 'Receive your skill gap score, resume rating, and career match percentage powered by Gemini AI.', icon: Brain },
    { step: '04', title: 'Follow Your Roadmap', desc: 'Study your custom 12-week learning plan, track progress weekly, and land your dream role.', icon: Map },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="badge badge-purple"><Zap size={11} /> Simple & Powerful</span>
          <h2 className="text-4xl lg:text-5xl font-black text-brand-slate">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Get started in minutes. Our AI does the heavy lifting so you can focus on learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-brand-indigo/20 to-transparent hidden lg:block" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center">
                <div className="inline-flex h-20 w-20 rounded-3xl bg-gradient-to-tr from-brand-indigo to-brand-purple items-center justify-center mb-5 shadow-glow-indigo mx-auto animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <Icon size={32} className="text-white" />
                </div>
                <span className="absolute top-1 right-[calc(50%-40px-24px)] text-xs font-black text-brand-indigo/30">{s.step}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
const TestimonialsSection = () => {
  const testimonials = [
    { name: 'Priya Sharma', role: 'Got hired at Google', avatar: 'P', text: 'CareerPilot AI identified exactly what skills I was missing for a Google SWE role and gave me a 12-week plan. I followed it and got the offer 3 months later!', stars: 5, color: 'from-brand-indigo to-brand-purple' },
    { name: 'Arjun Mehta', role: 'ML Engineer Intern @ Meta', avatar: 'A', text: 'The skill gap analysis was eye-opening. I had no idea how many ML skills I was missing. The roadmap filled those gaps perfectly.', stars: 5, color: 'from-emerald-500 to-teal-500' },
    { name: 'Sneha Reddy', role: 'Won SIH 2024', avatar: 'S', text: 'Used CareerPilot AI for our Smart India Hackathon project demo. The judges loved the AI-powered career guidance concept!', stars: 5, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="badge badge-indigo"><Star size={11} /> Success Stories</span>
          <h2 className="text-4xl lg:text-5xl font-black text-brand-slate">
            Loved by <span className="gradient-text">thousands</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex gap-1">
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────────── */
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-4xl p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)' }}>
          {/* Glow effects */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          </div>
          {/* Orbit ring decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full border border-white/10 animate-spin-slow" />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-black text-white">
              Ready to launch your <br />dream career?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Join 10,000+ students already using CareerPilot AI to accelerate their career journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-brand-indigo font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                <Sparkles size={18} />
                Start For Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/15 backdrop-blur border border-white/25 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                Sign In
                <ArrowRight size={18} />
              </button>
            </div>
            <p className="text-white/60 text-sm">No credit card required · Free forever</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
const Footer = () => (
  <footer className="border-t border-slate-100/50 py-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span className="font-bold text-brand-slate">CareerPilot <span className="gradient-text">AI</span></span>
        </div>
        <p className="text-sm text-slate-400 text-center">
          © 2026 CareerPilot AI. Built with ❤️ for students & developers.
        </p>
        <div className="flex items-center gap-4">
          {[Github, Twitter, Linkedin].map((Icon, i) => (
            <button key={i} className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-brand-lightBlue hover:text-brand-indigo flex items-center justify-center text-slate-400 transition-all duration-200">
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;

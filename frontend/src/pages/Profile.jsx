import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import {
  Mail, Award, Route, CheckCircle2,
  LogOut, ClipboardList, Sparkles, BookOpen,
  Globe, Trophy, Target, TrendingUp, Edit3
} from 'lucide-react';

const ACHIEVEMENT_BADGES = [
  { id: 'resume', icon: '📄', title: 'Resume Uploaded', desc: 'Analyzed your first resume', color: 'from-blue-50 to-brand-lightBlue', border: 'border-blue-200/60' },
  { id: 'career', icon: '🎯', title: 'Goal Setter', desc: 'Selected a career target', color: 'from-purple-50 to-brand-lavender', border: 'border-purple-200/60' },
  { id: 'roadmap', icon: '🗺️', title: 'Road Warrior', desc: 'Started your AI roadmap', color: 'from-emerald-50 to-teal-50', border: 'border-emerald-200/60' },
  { id: 'week', icon: '🏆', title: 'Week Crusher', desc: 'Completed your first week', color: 'from-amber-50 to-orange-50', border: 'border-amber-200/60' },
];

const SKILL_CATEGORIES = {
  'Language': 'bg-blue-100 text-blue-700 border-blue-200',
  'Framework': 'bg-purple-100 text-purple-700 border-purple-200',
  'Database': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Tool': 'bg-amber-100 text-amber-700 border-amber-200',
  'Cloud': 'bg-sky-100 text-sky-700 border-sky-200',
  'Other': 'bg-slate-100 text-slate-600 border-slate-200',
};

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [careerGoal, setCareerGoal] = useState(null);
  const [resume, setResume] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState({ globe: '', linkedin: '', portfolio: '' });
  const [editLinks, setEditLinks] = useState(false);

  const fetchProfileData = async () => {
    try {
      const profileRes = await API.get('/auth/profile');
      setProfile(profileRes.data);
      const goalRes = await API.get('/career/goal');
      setCareerGoal(goalRes.data);
      const roadmapRes = await API.get('/career/roadmap');
      setRoadmap(roadmapRes.data);
      const historyRes = await API.get('/resume/history');
      if (historyRes.data.length > 0) setResume(historyRes.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfileData(); }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-3 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
          <Sparkles size={18} className="absolute inset-0 m-auto text-brand-indigo" />
        </div>
      </div>
    );
  }

  const completedWeeks = roadmap?.weeks?.filter(w => w.completed).length || 0;
  const totalWeeks = roadmap?.weeks?.length || 12;
  const progressPercent = Math.round((completedWeeks / totalWeeks) * 100);

  const unlockedBadges = [
    resume && 'resume',
    careerGoal && 'career',
    roadmap && 'roadmap',
    completedWeeks > 0 && 'week',
  ].filter(Boolean);

  const skillColors = Object.values(SKILL_CATEGORIES);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8 page-wrapper">

      {/* ── Profile Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card rounded-4xl overflow-hidden">
        {/* Cover gradient */}
        <div className="h-32 w-full relative" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)' }}>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full border border-white/15 animate-spin-slow" />
          </div>
          {/* Floating sparkles */}
          <Sparkles size={14} className="absolute top-4 right-8 text-white/40 animate-float" />
          <Sparkles size={10} className="absolute top-8 right-20 text-white/30 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="px-8 pb-8 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-black text-4xl shadow-glow-indigo border-4 border-white">
              {profile?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-emerald-400 border-2 border-white flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-1 pt-2 sm:pt-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                {profile?.name}
                <Sparkles size={18} className="text-brand-purple" />
              </h1>
              <span className="badge badge-indigo text-[10px]">Student Profile</span>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <Mail size={13} className="text-slate-300" /> {profile?.email}
            </p>
            {careerGoal && (
              <p className="text-xs font-semibold text-brand-indigo flex items-center gap-1.5">
                <Target size={12} /> Targeting: {careerGoal.career}
              </p>
            )}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2">
            {[
  { key: 'globe', icon: Globe, label: 'GitHub', href: links.globe },
  { key: 'linkedin', icon: Globe, label: 'LinkedIn', href: links.linkedin },
  { key: 'portfolio', icon: Globe, label: 'Portfolio', href: links.portfolio },
].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href || '#'} target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-brand-lightBlue hover:text-brand-indigo flex items-center justify-center text-slate-400 transition-all duration-200"
                title={label}>
                <Icon size={16} />
              </a>
            ))}
            <button onClick={() => setEditLinks(!editLinks)}
              className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-brand-indigo/10 hover:text-brand-indigo flex items-center justify-center text-slate-400 transition-all duration-200" title="Edit links">
              <Edit3 size={15} />
            </button>
          </div>
        </div>

        {/* Edit links form */}
        {editLinks && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }}
            className="px-8 pb-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            {[
  { key: 'globe', icon: Globe, placeholder: 'globe.com/username' },
  { key: 'linkedin', icon: Globe, placeholder: 'linkedin.com/in/username' },
  { key: 'portfolio', icon: Globe, placeholder: 'yourportfolio.com' },
].map(({ key, icon: Icon, placeholder }) => (
              <div key={key} className="relative">
                <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={links[key]} onChange={e => setLinks(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white/60 text-xs outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all" />
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Resume Score', value: resume?.score || '—', suffix: resume ? '/100' : '', icon: Award, gradient: 'from-blue-50 to-brand-lightBlue', iconColor: 'text-brand-indigo', border: 'border-blue-100' },
          { label: 'Career Match', value: careerGoal?.matchPercentage || '—', suffix: careerGoal ? '%' : '', icon: Target, gradient: 'from-purple-50 to-brand-lavender', iconColor: 'text-brand-purple', border: 'border-purple-100' },
          { label: 'Weeks Done', value: completedWeeks, suffix: `/${totalWeeks}`, icon: Route, gradient: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-500', border: 'border-emerald-100' },
          { label: 'Skills Found', value: resume?.extractedSkills?.length || 0, icon: TrendingUp, gradient: 'from-amber-50 to-orange-50', iconColor: 'text-amber-500', border: 'border-amber-100' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
              className="stat-card">
              <div className={`inline-flex h-10 w-10 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.border} items-center justify-center mb-3`}>
                <Icon size={18} className={stat.iconColor} />
              </div>
              <p className="text-2xl font-black text-slate-800">
                {stat.value}<span className="text-sm font-semibold text-slate-400">{stat.suffix}</span>
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Career Goal Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={12} /> Career Target
            </h3>
            {careerGoal ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">{careerGoal.career}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Match score</span>
                  <span className="font-black text-brand-indigo">{careerGoal.matchPercentage}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${careerGoal.matchPercentage}%` }} /></div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No career goal selected.</p>
            )}
          </motion.div>

          {/* Roadmap Progress */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Route size={12} /> Roadmap Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-slate-800">{completedWeeks} <span className="text-xs text-slate-400 font-semibold">/ {totalWeeks} weeks</span></span>
                <span className="text-xs font-black text-brand-indigo">{progressPercent}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Trophy size={12} /> Achievements
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ACHIEVEMENT_BADGES.map(badge => {
                const unlocked = unlockedBadges.includes(badge.id);
                return (
                  <div key={badge.id}
                    className={`p-3 rounded-2xl border text-center transition-all duration-300 ${
                      unlocked
                        ? `bg-gradient-to-br ${badge.color} ${badge.border}`
                        : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                    }`}>
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{badge.title}</p>
                    {unlocked && <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{badge.desc}</p>}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Logout */}
          <button onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-100/60 text-red-500 text-sm font-semibold transition-all duration-200 group">
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>

        {/* Right: Full Skills Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={12} /> Skills Inventory
              </h3>
              <p className="text-[10px] text-slate-300 mt-0.5">All skills extracted from your resume</p>
            </div>
            <span className="badge badge-indigo text-[10px] py-0.5 px-2">
              {resume?.extractedSkills?.length || 0} total
            </span>
          </div>

          <div className="flex flex-wrap gap-2 flex-grow">
            {resume?.extractedSkills?.length > 0 ? (
              resume.extractedSkills.map((skill, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`skill-tag border ${skillColors[index % skillColors.length]}`}>
                  <CheckCircle2 size={11} />
                  {skill}
                </motion.div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                <BookOpen size={36} className="text-slate-200" />
                <p className="text-sm font-medium">No skills extracted yet</p>
                <p className="text-xs text-center max-w-xs">Upload your resume PDF in the Dashboard to populate your skills inventory.</p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary px-5 py-2.5 text-xs mt-2">
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import {
  Award, CheckCircle2, AlertCircle, ArrowLeft,
  ArrowRight, Compass, Target, Sparkles, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip
} from 'recharts';

const SkillGap = () => {
  const navigate = useNavigate();
  const [careerGoal, setCareerGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSkillGap = async () => {
    try {
      const res = await API.get('/career/goal');
      setCareerGoal(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkillGap(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-3 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
          <Sparkles size={18} className="absolute inset-0 m-auto text-brand-indigo animate-pulse" />
        </div>
      </div>
    );
  }

  if (!careerGoal) {
    return (
      <div className="glass-card p-12 rounded-4xl text-center max-w-md mx-auto my-12 space-y-5">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-lightBlue to-brand-lavender border border-brand-indigo/10 flex items-center justify-center mx-auto">
          <Compass size={36} className="text-brand-indigo" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-700">No Career Goal Selected</h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Please select a career goal in the dashboard first to analyze your skill gaps.
          </p>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
          <ArrowLeft size={16} /> Go to Dashboard
        </button>
      </div>
    );
  }

  const required = careerGoal.requiredSkills || [];
  const missing = careerGoal.missingSkills || [];
  const current = required.filter(s => !missing.includes(s));
  const matchPct = careerGoal.matchPercentage || 0;

  // Radar chart data — sample the top skills
  const radarData = required.slice(0, 8).map(skill => ({
    skill: skill.length > 12 ? skill.substring(0, 11) + '…' : skill,
    you: current.includes(skill) ? 80 + Math.random() * 20 : 10 + Math.random() * 30,
    required: 75 + Math.random() * 25,
  }));

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Back */}
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-indigo transition-colors uppercase tracking-widest group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* ── Hero Analysis Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          <div className="md:col-span-2 space-y-4">
            <span className="badge badge-purple inline-flex">
              <Award size={10} /> Skill Gap Analysis
            </span>
            <h1 className="text-3xl lg:text-4xl font-black text-brand-slate leading-tight">
              Target Role: <span className="gradient-text">{careerGoal.career}</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              Here's how your resume skills compare against industry standards for a{' '}
              <strong className="text-slate-700">{careerGoal.career}</strong>.
              Use the AI roadmap to close the gap.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">{current.length} acquired</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-100">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-sm font-bold text-amber-700">{missing.length} missing</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-lightBlue border border-brand-indigo/10">
                <Target size={14} className="text-brand-indigo" />
                <span className="text-sm font-bold text-brand-indigo">{required.length} required</span>
              </div>
            </div>
          </div>

          {/* Match Score Ring */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-36 w-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                <circle cx="72" cy="72" r="58" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <motion.circle
                  cx="72" cy="72" r="58" fill="none"
                  stroke="url(#matchGrad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - matchPct / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - matchPct / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }} />
                <defs>
                  <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{matchPct}<span className="text-xl text-slate-400">%</span></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Match</span>
              </div>
            </div>
            <p className="text-xs text-center text-slate-400 max-w-[120px]">
              {matchPct >= 70 ? '🎉 Excellent match!' : matchPct >= 40 ? '📈 Good progress!' : '🚀 Great growth potential!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Radar Chart + Skill Lists ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card rounded-3xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp size={13} /> Skill Radar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 600 }} />
              <Radar name="You" dataKey="you" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Required" dataKey="required" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(226,232,240,0.6)', background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 11 }}
                formatter={(value) => [`${Math.round(value)}%`]} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2"><div className="h-2 w-6 rounded-full bg-brand-indigo" /><span className="text-[10px] font-semibold text-slate-500">You</span></div>
            <div className="flex items-center gap-2"><div className="h-2 w-6 rounded-full border-2 border-dashed border-brand-purple" /><span className="text-[10px] font-semibold text-slate-500">Required</span></div>
          </div>
        </motion.div>

        {/* Acquired Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Acquired Skills</h3>
              <p className="text-[10px] text-slate-300 mt-0.5">Matched from your resume</p>
            </div>
            <span className="badge badge-green text-[10px] py-0.5 px-2">
              <CheckCircle2 size={10} /> {current.length}/{required.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {current.length > 0 ? current.map((skill, idx) => {
              const pct = 70 + Math.floor(Math.random() * 30);
              return (
                <motion.div key={idx}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                  className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{skill}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">{pct}%</span>
                  </div>
                  <div className="progress-bar h-1">
                    <motion.div className="progress-fill-green h-full rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: idx * 0.04 }} />
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No matching skills found. Upload a detailed resume.
              </div>
            )}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Missing Skills</h3>
              <p className="text-[10px] text-slate-300 mt-0.5">Learn these to close the gap</p>
            </div>
            <span className="badge badge-amber text-[10px] py-0.5 px-2">
              <AlertCircle size={10} /> {missing.length} missing
            </span>
          </div>

          {missing.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {missing.map((skill, idx) => {
                const priority = idx < Math.ceil(missing.length / 3) ? 'high' : idx < Math.ceil(missing.length * 2 / 3) ? 'medium' : 'low';
                const PRIORITY_STYLES = {
                  high: { badge: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-400', label: 'High' },
                  medium: { badge: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-400', label: 'Med' },
                  low: { badge: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-300', label: 'Low' },
                };
                const style = PRIORITY_STYLES[priority];
                return (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-slate-100 hover:border-brand-indigo/20 hover:bg-brand-lightBlue/30 transition-all duration-200 group">
                    <div className={`h-6 w-6 rounded-lg border flex items-center justify-center shrink-0 ${style.badge}`}>
                      <AlertCircle size={12} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 flex-1">{skill}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg border ${style.badge}`}>{style.label}</span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 rounded-2xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-700">100% Skill Match! 🚀</p>
              <p className="text-xs text-emerald-500 mt-1">You've got all required skills</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Action Footer ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
        className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 border border-brand-indigo/10 flex items-center justify-center text-brand-purple shrink-0">
            <Compass size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">Ready to bridge the gap?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Generate your personalized 12-week AI learning roadmap.</p>
          </div>
        </div>

        <button onClick={() => navigate('/roadmap')}
          className="btn-primary px-6 py-3 text-sm flex items-center gap-2 group shrink-0">
          <span>Open AI Roadmap</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};

export default SkillGap;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import {
  CheckCircle2, Circle, Clock, ExternalLink,
  Code, BookOpen, ArrowLeft, ChevronDown, ChevronUp,
  Sparkles, Map, Trophy
} from 'lucide-react';

const Roadmap = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [error, setError] = useState('');

  const fetchRoadmap = async () => {
    try {
      const res = await API.get('/career/roadmap');
      setRoadmap(res.data);
      if (res.data?.weeks) {
        const uncompleted = res.data.weeks.find(w => !w.completed);
        if (uncompleted) setExpandedWeek(uncompleted.week);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve your roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoadmap(); }, []);

  const toggleWeekCompletion = async (weekNum) => {
    try {
      const res = await API.put(`/career/roadmap/week/${weekNum}/toggle`);
      setRoadmap(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to update week completion progress.');
    }
  };

  const toggleExpand = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-3 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
          <Sparkles size={22} className="absolute inset-0 m-auto text-brand-indigo" />
        </div>
        <p className="text-sm font-semibold text-slate-400">Loading your personalized roadmap...</p>
      </div>
    );
  }

  if (!roadmap || !roadmap.weeks || roadmap.weeks.length === 0) {
    return (
      <div className="glass-card p-12 rounded-4xl text-center max-w-md mx-auto my-12 space-y-5">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-lightBlue to-brand-lavender flex items-center justify-center mx-auto">
          <Map size={36} className="text-brand-indigo" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-700">No Roadmap Found</h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Select a career goal and upload your resume. AI will generate your personalized 12-week roadmap.
          </p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
          <ArrowLeft size={16} /> Go to Dashboard
        </button>
      </div>
    );
  }

  const completedWeeks = roadmap.weeks.filter(w => w.completed).length;
  const totalWeeks = roadmap.weeks.length;
  const progressPercent = Math.round((completedWeeks / totalWeeks) * 100);

  const WEEK_COLORS = [
    'from-blue-500 to-brand-indigo',
    'from-brand-indigo to-brand-purple',
    'from-brand-purple to-violet-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-500',
    'from-teal-500 to-cyan-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Back */}
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-indigo transition-colors uppercase tracking-widest group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* ── Progress Overview ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-indigo/8 to-brand-purple/8 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-3">
            <span className="badge badge-purple inline-flex">
              <Sparkles size={10} /> Active Study Plan
            </span>
            <h1 className="text-2xl lg:text-3xl font-black text-brand-slate">
              12-Week Roadmap: <span className="gradient-text">{roadmap.careerGoal}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Follow this AI-curated timeline to master your missing skills. Check off each week as you complete it.
            </p>
          </div>

          {/* Progress stats */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Ring */}
            <div className="relative h-24 w-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="38" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <motion.circle
                  cx="48" cy="48" r="38" fill="none"
                  stroke="url(#roadmapGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - progressPercent / 100)}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - progressPercent / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }} />
                <defs>
                  <linearGradient id="roadmapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800">{progressPercent}%</span>
              </div>
            </div>

            <div className="text-left">
              <p className="text-3xl font-black text-slate-800">{completedWeeks}</p>
              <p className="text-sm font-semibold text-slate-400">of {totalWeeks} weeks done</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <Trophy size={13} className="text-amber-500" />
                <span>{totalWeeks - completedWeeks} weeks left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 progress-bar">
          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </div>
      </motion.div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      {/* ── Week Cards ── */}
      <div className="space-y-3">
        {roadmap.weeks.map((weekItem, i) => {
          const isExpanded = expandedWeek === weekItem.week;
          const colorClass = WEEK_COLORS[(weekItem.week - 1) % WEEK_COLORS.length];

          return (
            <motion.div
              key={weekItem.week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`glass-card rounded-3xl overflow-hidden border transition-all duration-300 ${
                weekItem.completed
                  ? 'border-emerald-200/60 bg-emerald-50/20'
                  : isExpanded
                    ? 'border-brand-indigo/25 shadow-card-hover'
                    : 'border-white/70'
              }`}>

              {/* Header */}
              <div
                onClick={() => toggleExpand(weekItem.week)}
                className="p-5 flex items-center justify-between cursor-pointer select-none group">
                <div className="flex items-center gap-4">
                  {/* Completion toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleWeekCompletion(weekItem.week); }}
                    className={`shrink-0 transition-all duration-200 hover:scale-110 ${weekItem.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-brand-indigo'}`}>
                    {weekItem.completed
                      ? <CheckCircle2 size={26} className="fill-emerald-50" />
                      : <Circle size={26} />}
                  </button>

                  {/* Week number badge + title */}
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-black text-white">{weekItem.week}</span>
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold transition-colors ${weekItem.completed ? 'text-emerald-700/80 line-through decoration-emerald-300' : 'text-slate-800 group-hover:text-brand-indigo'}`}>
                        {weekItem.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        <span className={weekItem.completed ? 'text-emerald-500' : 'text-brand-indigo'}>Week {weekItem.week}</span>
                        {weekItem.estimatedHours && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {weekItem.estimatedHours}h
                          </span>
                        )}
                        {weekItem.completed && <span className="text-emerald-500">✓ Completed</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-brand-indigo transition-colors">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <div className="px-5 pb-6 border-t border-slate-100/50 grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">

                      {/* Left: Topics + Resources */}
                      <div className="space-y-5">
                        {/* Topics */}
                        <div>
                          <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                            <BookOpen size={12} className="text-brand-indigo" /> Topics to Master
                          </h4>
                          <ul className="space-y-2">
                            {weekItem.topics?.map((topic, tIdx) => (
                              <motion.li key={tIdx}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: tIdx * 0.05 }}
                                className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple shrink-0 mt-1.5" />
                                {topic}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        {weekItem.resources?.length > 0 && (
                          <div>
                            <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                              <ExternalLink size={12} className="text-brand-purple" /> Curated Resources
                            </h4>
                            <div className="space-y-2">
                              {weekItem.resources.map((res, rIdx) => (
                                <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white/60 hover:bg-brand-lightBlue hover:border-brand-indigo/20 text-xs font-semibold text-slate-600 hover:text-brand-indigo transition-all duration-200 group">
                                  <span>{res.name}</span>
                                  <ExternalLink size={12} className="text-slate-300 group-hover:text-brand-indigo transition-colors" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Mini Project */}
                      <div>
                        <div className={`h-full p-5 rounded-3xl bg-gradient-to-br from-brand-lightBlue/60 to-brand-lavender/40 border border-brand-indigo/10`}>
                          <h4 className="text-[11px] font-black text-brand-indigo uppercase tracking-widest flex items-center gap-1.5 mb-3">
                            <Code size={12} /> Weekly Mini Project
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {weekItem.project}
                          </p>
                          <div className="mt-4 pt-3 border-t border-brand-indigo/10 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hands-on Practice</span>
                            <span className="badge badge-indigo text-[9px] py-0.5">Build & Verify</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {completedWeeks === totalWeeks && totalWeeks > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-4xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)' }}>
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-black gradient-text">Roadmap Complete!</h3>
          <p className="text-slate-500 text-sm mt-2">You've mastered all 12 weeks. You're ready for your dream role!</p>
          <Trophy size={48} className="text-amber-400 mx-auto mt-4 animate-float" />
        </motion.div>
      )}
    </div>
  );
};

export default Roadmap;

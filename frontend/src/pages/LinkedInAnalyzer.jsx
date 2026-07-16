import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, AlertCircle, Sparkles,
  Linkedin, Trophy, FileText, Send, Sparkle
} from 'lucide-react';

const LinkedInAnalyzer = () => {
  const navigate = useNavigate();
  const [profileText, setProfileText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('linkedin_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const analyzeLinkedIn = (e) => {
    e.preventDefault();
    if (!profileText.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const text = profileText.toLowerCase();

      // Simple scoring model based on content analysis
      let keywordsCount = 0;
      let actionVerbsCount = 0;
      const targetKeywords = ['engineered', 'scaled', 'developed', 'architected', 'led', 'designed', 'optimized', 'cloud', 'database', 'testing', 'full-stack', 'system'];
      const actionVerbs = ['built', 'managed', 'created', 'solved', 'improved', 'increased', 'reduced', 'implemented'];

      targetKeywords.forEach(kw => {
        if (text.includes(kw)) keywordsCount++;
      });

      actionVerbs.forEach(v => {
        if (text.includes(v)) actionVerbsCount++;
      });

      // Calculate score components
      const length = profileText.length;
      const lengthScore = Math.min(Math.round(length / 20), 30); // Max 30 points for length
      const keywordScore = Math.min(keywordsCount * 8, 40);      // Max 40 points for keywords
      const verbScore = Math.min(actionVerbsCount * 8, 30);       // Max 30 points for action verbs
      const overallScore = Math.min(35 + lengthScore + keywordScore + verbScore, 98);

      const suggestions = [
        length < 300 ? "Your profile summary is quite brief. Aim for at least 300-500 characters to tell your professional story." : "Your profile summary length is excellent and allows recruiters to get context.",
        keywordsCount < 3 ? "Try inserting more industry-standard keywords related to your target career (e.g. system design, scalable, cloud deployment)." : "Your summary contains a healthy density of industry-specific technical keywords.",
        actionVerbsCount < 2 ? "Incorporate active phrasing. Replace passive descriptions with verbs like 'Led development...', 'Optimized querying...', or 'Architected...'" : "You have used strong action verbs to describe your achievements."
      ];

      const newResult = {
        date: new Date().toLocaleDateString(),
        score: overallScore,
        summaryLen: length,
        keywords: keywordsCount,
        verbs: actionVerbsCount,
        suggestions
      };

      setResult(newResult);
      const updatedHistory = [newResult, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('linkedin_history', JSON.stringify(updatedHistory));

      // Trigger achievement checklist check
      const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      if (!currentAchievements.includes('linkedin')) {
        currentAchievements.push('linkedin');
        localStorage.setItem('achievements', JSON.stringify(currentAchievements));
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Navigation */}
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-indigo transition-colors uppercase tracking-widest group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Hero */}
      <div className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-indigo/8 to-brand-purple/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <span className="badge badge-indigo inline-flex"><Linkedin size={10} /> LinkedIn Optimizer</span>
            <h1 className="text-3xl font-black text-brand-slate">LinkedIn <span className="gradient-text">Analyzer</span></h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Audit your LinkedIn profile. Paste your Headline, About, or Experience section to check keyword optimization and reach recruiters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paste Area & Scoreboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Paste Profile Summary</h3>
              <p className="text-xs text-slate-400 mt-1">Copy and paste your 'About' bio or experience descriptions below.</p>
            </div>

            <form onSubmit={analyzeLinkedIn} className="space-y-4">
              <textarea
                value={profileText}
                onChange={e => setProfileText(e.target.value)}
                placeholder="E.g. Full Stack Developer with 2 years of experience building scalable microservices in React and Node.js. Passionate about system design and performance optimization..."
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm font-medium leading-relaxed min-h-[180px] focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 outline-none transition-all resize-none"
              />

              <button type="submit" disabled={loading || !profileText.trim()}
                className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2.5">
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Sparkles size={15} />
                    <span>Analyze Profile Bio</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Linkedin size={16} className="text-[#0A66C2]" /> LinkedIn Optimization Scorecard
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Audit finalized on {result.date}</p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-brand-lightBlue/40 border border-brand-indigo/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Headline Score</p>
                    <p className="text-2xl font-black text-brand-indigo">{result.score}/100</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Character Count</p>
                    <p className="text-2xl font-black text-slate-700">{result.summaryLen}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Focus Keywords</p>
                    <p className="text-2xl font-black text-amber-600">{result.keywords}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Action Verbs</p>
                    <p className="text-2xl font-black text-emerald-600">{result.verbs}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={13} /> Suggestions for LinkedIn profile
                  </p>
                  <ul className="space-y-2">
                    {result.suggestions.map((s, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed items-start">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar History Panel */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={13} /> Saved Audits
            </h3>

            {history.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-indigo/10 transition-colors flex justify-between items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">Bio Check</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{h.date} · {h.summaryLen} chars</p>
                    </div>
                    <span className="text-xs font-black text-brand-indigo bg-brand-lightBlue px-2.5 py-1 rounded-xl">
                      {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No past summaries analyzed.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInAnalyzer;

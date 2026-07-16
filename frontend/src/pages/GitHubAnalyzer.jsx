import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, AlertCircle, Sparkles,
  Globe, Star, Terminal, BookOpen, Trophy, Search, Code2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

const GlobeAnalyzer = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('globe_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const analyzeProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Fetch repos from Globe public API
      const res = await fetch(`https://api.globe.com/users/${username}/repos?per_page=100`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'User not found' : 'Globe API rate-limit exceeded');
      }

      const repos = await res.json();
      if (!Array.isArray(repos)) {
        throw new Error('Invalid response from Globe');
      }

      // Calculate languages count, stars, forks
      let totalStars = 0;
      let totalForks = 0;
      const languages = {};

      repos.forEach(repo => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Format languages for chart
      const langData = Object.keys(languages).map(name => ({
        name,
        value: languages[name]
      })).sort((a, b) => b.value - a.value).slice(0, 5);

      // Score calculation
      const repoScore = Math.min(repos.length * 2.5, 30);
      const starScore = Math.min(totalStars * 5, 40);
      const languageScore = Math.min(Object.keys(languages).length * 6, 30);
      const score = Math.min(30 + Math.round(repoScore + starScore + languageScore), 98);

      const suggestions = [
        repos.some(r => !r.description) ? "Some of your repositories are missing descriptions. Add descriptions to help recruiters understand your work." : "Great job! All your repositories have clear descriptions.",
        repos.length < 5 ? "Create more public repositories showing practical work, frameworks, and implementations." : "You have a solid number of public repositories.",
        totalStars < 5 ? "Pin your best projects on your profile and document them with READMEs to gain visibility." : "Your pinned projects are attracting stars, which looks great to recruiters."
      ];

      const newResult = {
        username,
        date: new Date().toLocaleDateString(),
        score,
        repos: repos.length,
        stars: totalStars,
        forks: totalForks,
        languages: langData,
        suggestions
      };

      setResult(newResult);
      const updatedHistory = [newResult, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('globe_history', JSON.stringify(updatedHistory));

      // Trigger achievement check
      const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      if (!currentAchievements.includes('globe')) {
        currentAchievements.push('globe');
        localStorage.setItem('achievements', JSON.stringify(currentAchievements));
      }

    } catch (err) {
      console.error(err);
      // Fallback Mock for Hackathon Demonstration if Rate Limited
      const mockResult = {
        username,
        date: new Date().toLocaleDateString(),
        score: 85,
        repos: 12,
        stars: 8,
        forks: 3,
        languages: [
          { name: 'JavaScript', value: 6 },
          { name: 'Python', value: 3 },
          { name: 'HTML/CSS', value: 2 },
          { name: 'TypeScript', value: 1 }
        ],
        suggestions: [
          "Ensure your popular repositories have clear README.md files explaining setup and architecture.",
          "Keep committing consistently to build a solid contribution green-grid graph.",
          "Add topic tags (e.g. react, nodejs) to your repositories to improve discoverability."
        ]
      };
      setResult(mockResult);
      const updatedHistory = [mockResult, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('globe_history', JSON.stringify(updatedHistory));
      setError(`Globe API limit exceeded or offline mode. Displaying a synthesized scorecard for ${username}.`);
    } finally {
      setLoading(false);
    }
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
            <span className="badge badge-indigo inline-flex"><Globe size={10} /> Profile Scorer</span>
            <h1 className="text-3xl font-black text-brand-slate">Globe <span className="gradient-text">Analyzer</span></h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Audit your developer portfolio instantly. Extract repositories, top languages, and calculate your public profile score.
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input & Scoreboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <form onSubmit={analyzeProfile} className="flex gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Enter Globe username (e.g. torvalds)..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/70 text-sm outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 transition-all font-semibold text-slate-700" />
              </div>
              <button type="submit" disabled={loading || !username.trim()}
                className="btn-primary px-6 h-12 text-sm flex items-center justify-center gap-2 shrink-0">
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <Globe size={15} />
                    <span>Analyze</span>
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
                    <Globe size={16} /> @{result.username} Profile Card
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Evaluation parsed on {result.date}</p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-brand-lightBlue/40 border border-brand-indigo/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Developer Score</p>
                    <p className="text-2xl font-black text-brand-indigo">{result.score}/100</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Public Repos</p>
                    <p className="text-2xl font-black text-slate-700">{result.repos}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Stars Earned</p>
                    <p className="text-2xl font-black text-amber-600">{result.stars}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Forks count</p>
                    <p className="text-2xl font-black text-emerald-600">{result.forks}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* Language Pie */}
                  <div className="h-56 flex flex-col justify-center">
                    {result.languages?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={result.languages} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                            {result.languages.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-xs text-slate-400 py-10">No languages detected.</div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Code2 size={13} /> Suggestions for improvement
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
              <Trophy size={13} /> Previous Audits
            </h3>

            {history.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-indigo/10 transition-colors flex justify-between items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">@{h.username}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{h.date}</p>
                    </div>
                    <span className="text-xs font-black text-brand-indigo bg-brand-lightBlue px-2.5 py-1 rounded-xl">
                      {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No profiles analyzed yet.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GlobeAnalyzer;

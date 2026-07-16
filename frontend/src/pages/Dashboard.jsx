import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import {
  Upload, FileText, ArrowRight, CheckCircle2, Award,
  Map, Sparkles, BookOpen, AlertCircle,
  TrendingUp, Target, Brain, ChevronRight, X, Flame, Trophy
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CAREERS = [
  'Software Engineer', 'Full Stack Developer', 'AI Engineer',
  'Machine Learning Engineer', 'Data Scientist', 'Cyber Security Engineer',
  'Cloud Engineer', 'DevOps Engineer'
];

/* ─── Metric Card ─── */
const MetricCard = ({ label, value, suffix = '', icon: Icon, color, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card rounded-3xl p-5 flex items-center gap-4">
    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${gradient}`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800 leading-none">
        {value}<span className="text-sm font-semibold text-slate-400 ml-1">{suffix}</span>
      </p>
      <p className="text-xs font-semibold text-slate-400 mt-1">{label}</p>
    </div>
  </motion.div>
);

/* ─── Drag & Drop Upload Zone ─── */
const UploadZone = ({ file, onFileChange, onUpload, uploading, uploadProgress }) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') {
      onFileChange({ target: { files: [dropped] } });
    }
  }, [onFileChange]);

  return (
    <form onSubmit={onUpload} className="space-y-4">
      <div
        className={`drop-zone p-8 flex flex-col items-center justify-center text-center relative ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}>
        <input
          type="file" accept=".pdf"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

        <motion.div
          animate={dragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}>
          {file ? (
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-3">
              <FileText size={28} className="text-emerald-500" />
            </div>
          ) : (
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${dragging ? 'bg-brand-indigo text-white' : 'bg-slate-50 border-2 border-dashed border-slate-200'}`}>
              <Upload size={24} className={dragging ? 'text-white' : 'text-slate-400'} />
            </div>
          )}
        </motion.div>

        <p className="text-sm font-bold text-slate-600">
          {file ? file.name : dragging ? 'Drop it here!' : 'Drag & drop your resume'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {file ? `${(file.size / 1024).toFixed(0)} KB · PDF` : 'PDF up to 5MB — or click to browse'}
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-brand-indigo flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo animate-pulse inline-block" />
              AI Analyzing Resume...
            </span>
            <span className="text-slate-500">{uploadProgress}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }} />
          </div>
        </div>
      )}

      <button type="submit" disabled={!file || uploading}
        className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
        {uploading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span>Analyzing with AI...</span>
          </>
        ) : (
          <>
            <Brain size={16} />
            <span>Analyze Resume</span>
          </>
        )}
      </button>
    </form>
  );
};

/* ─── Dashboard ─── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [careerGoal, setCareerGoal] = useState(null);
  const [resume, setResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [streak, setStreak] = useState(3);

  const fetchDashboardData = async () => {
    try {
      const goalRes = await API.get('/career/goal');
      setCareerGoal(goalRes.data);
      const roadmapRes = await API.get('/career/roadmap');
      setRoadmap(roadmapRes.data);
      const historyRes = await API.get('/resume/history');
      setHistory(historyRes.data);
      if (historyRes.data.length > 0) setResume(historyRes.data[0]);

      // Load streak from local storage
      const savedStreak = localStorage.getItem('streak_count');
      if (savedStreak) setStreak(parseInt(savedStreak));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleCareerChange = async (e) => {
    const selected = e.target.value;
    if (!selected) return;
    setError(''); setSuccess('');
    try {
      const res = await API.post('/career/select', { career: selected });
      setCareerGoal(res.data.careerGoal);
      setRoadmap(res.data.roadmap);
      setSuccess(`Career goal updated to ${selected}! AI is generating your roadmap.`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError('Failed to update career goal.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') { setFile(selectedFile); setError(''); }
    else setError('Please select a valid PDF file.');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setUploadProgress(10); setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => { if (prev >= 90) { clearInterval(progressInterval); return 90; } return prev + 15; });
      }, 300);
      const res = await API.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      clearInterval(progressInterval);
      setUploadProgress(100);
      setResume(res.data.resume);
      setSuccess('Resume analyzed successfully! Skills extracted.');
      setFile(null);
      fetchDashboardData();

      // Trigger Rookie achievement check
      const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      if (!currentAchievements.includes('resume')) {
        currentAchievements.push('resume');
        localStorage.setItem('achievements', JSON.stringify(currentAchievements));
      }
    } catch (err) {
      console.error(err);
      setError('Error uploading/parsing resume. Ensure PDF contains readable text.');
    } finally {
      setTimeout(() => { setUploading(false); setUploadProgress(0); }, 1000);
    }
  };

  // Stats
  const resumeScore = resume?.score || 0;
  const matchPercentage = careerGoal?.matchPercentage || 0;
  const currentSkillsCount = (careerGoal?.requiredSkills?.length || 0) - (careerGoal?.missingSkills?.length || 0);
  const missingSkillsCount = careerGoal?.missingSkills?.length || 0;
  const completedWeeks = roadmap?.weeks?.filter(w => w.completed).length || 0;
  const totalWeeks = roadmap?.weeks?.length || 12;
  const roadmapProgressPercent = Math.round((completedWeeks / totalWeeks) * 100);

  const gaugeData = [{ name: 'Match', value: matchPercentage, fill: '#6366F1' }];

  const SKILL_COLORS = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-rose-100 text-rose-700 border-rose-200',
    'bg-cyan-100 text-cyan-700 border-cyan-200',
  ];

  // Dynamic career predictions based on extracted skills
  const getCareerPredictions = () => {
    const userSkills = resume?.extractedSkills || [];
    if (userSkills.length === 0) return [];
    
    const careers = [
      { name: 'Software Engineer', matches: ['git', 'java', 'c++', 'python', 'oop', 'data structures'] },
      { name: 'Full Stack Developer', matches: ['react', 'node', 'express', 'mongodb', 'javascript', 'html', 'css', 'git'] },
      { name: 'AI Engineer', matches: ['python', 'deep learning', 'tensorflow', 'pytorch', 'gemini api', 'nlp'] },
      { name: 'DevOps Engineer', matches: ['docker', 'kubernetes', 'terraform', 'jenkins', 'aws', 'git', 'ci/cd'] }
    ];

    return careers.map(c => {
      let matchesCount = 0;
      c.matches.forEach(m => {
        if (userSkills.some(us => us.toLowerCase().includes(m.toLowerCase()))) matchesCount++;
      });
      const pct = Math.round((matchesCount / c.matches.length) * 100);
      return {
        name: c.name,
        pct: Math.min(35 + pct, 98), // offset base score
        description: `Matching: ${matchesCount}/${c.matches.length} tech tags`
      };
    }).sort((a, b) => b.pct - a.pct).slice(0, 3);
  };

  // Skill Demand Forecast Data
  const trendData = [
    { year: '2024', demand: 60 },
    { year: '2025', demand: 75 },
    { year: '2026', demand: 88 },
    { year: '2027', demand: 98 }
  ];

  const predictions = getCareerPredictions();

  // Resume Suggestions
  const suggestions = resumeScore > 0 ? [
    resumeScore < 70 ? "ATS score matches weakly. Refine formatting to avoid double columns." : "Good ATS formatting score! Focus on metric results.",
    "Add at least 3 bullet points per project demonstrating quantitative impacts.",
    "Inject more active keywords (e.g. Engineered, Optimised, Solved) into experience logs."
  ] : [];

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Alert Messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
          <button onClick={() => setSuccess('')}><X size={14} className="text-emerald-400" /></button>
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={() => setError('')}><X size={14} className="text-red-400" /></button>
        </motion.div>
      )}

      {/* ── Row 1: Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Resume Score" value={resumeScore} suffix="/100" icon={Award}
          gradient="bg-gradient-to-br from-blue-50 to-brand-lightBlue border border-blue-100"
          color="text-brand-indigo" delay={0} />
        <MetricCard label="Career Match" value={matchPercentage} suffix="%" icon={Target}
          gradient="bg-gradient-to-br from-brand-lavender to-purple-50 border border-purple-100"
          color="text-brand-purple" delay={0.05} />
        <MetricCard label="Skills Found" value={currentSkillsCount} icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
          color="text-emerald-500" delay={0.1} />
        <MetricCard label="Skills Missing" value={missingSkillsCount} icon={AlertCircle}
          gradient="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
          color="text-amber-500" delay={0.15} />
      </div>

      {/* ── Row 2: Hero Welcome + Gauge ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome / Career Select Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-gradient-to-br from-brand-indigo/12 to-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400/8 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="badge badge-indigo mb-3 inline-flex">
                  <Sparkles size={10} /> Career Engine Active
                </span>
                <h1 className="text-2xl lg:text-3xl font-black text-brand-slate leading-tight">
                  Design Your Future<br />Career Path
                </h1>
              </div>

              {/* Streak Widget */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-100 shrink-0">
                <Flame className="text-amber-500 fill-amber-400" size={24} />
                <div>
                  <p className="text-sm font-black text-slate-800">{streak} Days</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Streak</p>
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
              Upload your resume for AI analysis. Select a career goal to run real-time skill gap detection and generate your personalized roadmap.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide px-1">Target Career</label>
                <select
                  value={careerGoal?.career || ''}
                  onChange={handleCareerChange}
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 transition-all duration-300 text-slate-700 cursor-pointer">
                  <option value="" disabled>— Select Career Goal —</option>
                  {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex items-end">
                <button onClick={() => navigate('/skill-gap')} disabled={!careerGoal}
                  className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                  <span>Analyze Skill Gap</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume Score Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Career Match</span>
            <Award size={18} className="text-brand-purple" />
          </div>

          <div className="relative h-44 w-full flex items-center justify-center">
            {resume ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="55%" innerRadius="70%" outerRadius="90%" barSize={10}
                    data={gaugeData} startAngle={180} endAngle={0}>
                    <RadialBar background clockWise dataKey="value">
                      <Cell fill="#6366F1" />
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-6">
                  <span className="text-4xl font-black text-slate-800">{matchPercentage}<span className="text-xl text-slate-400">%</span></span>
                  <span className="text-xs text-slate-400 font-semibold mt-1">Career Match</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <FileText size={40} className="text-slate-200" />
                </motion.div>
                <p className="text-xs font-semibold">Upload resume to see your score</p>
              </div>
            )}
          </div>

          {resume && (
            <div className="mt-2 text-center space-y-1">
              <p className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{resume.filename}</p>
              <p className="text-[10px] text-slate-400">Score: <span className="font-bold text-brand-indigo">{resumeScore}/100</span></p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Row 3: Upload + Skills + Roadmap ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Upload size={13} /> Upload Resume
          </h3>
          <UploadZone
            file={file} onFileChange={handleFileChange}
            onUpload={handleUpload} uploading={uploading} uploadProgress={uploadProgress} />
        </motion.div>

        {/* Extracted Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          className="glass-card rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={13} /> Skills Extracted
            </h3>
            <span className="badge badge-indigo text-[10px] py-0.5 px-2">
              {resume?.extractedSkills?.length || 0} total
            </span>
          </div>

          <div className="flex flex-wrap gap-2 flex-grow max-h-44 overflow-y-auto">
            {resume?.extractedSkills?.length > 0 ? (
              resume.extractedSkills.map((s, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`skill-tag border ${SKILL_COLORS[idx % SKILL_COLORS.length]}`}>
                  {s}
                </motion.span>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-8 text-center">
                Upload resume to extract skills
              </div>
            )}
          </div>

          <button onClick={() => navigate('/profile')}
            className="btn-secondary w-full py-2.5 text-xs mt-4 text-center block">
            View Full Skills Profile
          </button>
        </motion.div>

        {/* Roadmap Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Map size={13} /> Roadmap Tracker
              </h3>
              <span className="text-xs font-bold text-brand-indigo">{roadmapProgressPercent}%</span>
            </div>

            {/* Progress ring */}
            <div className="flex items-center gap-5 mb-5">
              <div className="relative h-20 w-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <motion.circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - roadmapProgressPercent / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - roadmapProgressPercent / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }} />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-slate-800">{completedWeeks}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{completedWeeks} <span className="text-sm font-semibold text-slate-400">/ {totalWeeks}</span></p>
                <p className="text-xs text-slate-400 mt-1">Weeks Completed</p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {careerGoal ? `Target: ${careerGoal.career}` : 'Select a career goal to start'}
                </p>
              </div>
            </div>

            <div className="progress-bar"><div className="progress-fill" style={{ width: `${roadmapProgressPercent}%` }} /></div>
          </div>

          <button onClick={() => navigate('/roadmap')} disabled={!roadmap}
            className="btn-primary w-full py-3 text-xs mt-4 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            <span>Study Roadmap</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* ── Row 4: Career Predictions & Resume Tips ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Career Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Trophy size={13} /> Predicted Career Alignments
          </h3>
          
          {predictions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {predictions.map(c => (
                <div key={c.name} className="p-4 rounded-2xl border border-slate-100 hover:border-brand-indigo/10 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{c.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{c.description}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-brand-indigo mb-1">
                      <span>Match rate</span>
                      <span>{c.pct}%</span>
                    </div>
                    <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${c.pct}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              Upload your resume to calculate potential alignments.
            </div>
          )}
        </motion.div>

        {/* Resume Improvement Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
          className="glass-card rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={13} /> AI Resume Recommendations
          </h3>

          {suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((s, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed items-start">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No recommendations available yet. Upload resume first.
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Row 5: Skill Demand trends ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.44 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={13} /> Skill Market Demand Forecast
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Forecast percentage representing hiring manager index demand metrics.</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip />
                <Area type="monotone" dataKey="demand" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* SIH Finalist badge card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.46 }}
          className="glass-card rounded-3xl p-6 flex flex-col justify-between space-y-4 bg-gradient-to-tr from-brand-lavender/30 to-brand-lightBlue/30">
          <div>
            <span className="badge badge-purple text-[9px] py-0.5"><Sparkles size={9} /> SIH Finalist Portal</span>
            <h4 className="text-sm font-black text-slate-800 mt-2">Test Your Skills</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Participate in simulated technical tests, mock speech interviews, and audit your GitHub code profiles to unlock special badge ranks!
            </p>
          </div>
          <button onClick={() => navigate('/interview')}
            className="btn-primary py-3 text-xs w-full flex items-center justify-center gap-2">
            <span>Open Mock Interview</span>
            <ChevronRight size={13} />
          </button>
        </motion.div>
      </div>

      {/* ── Row 6: Upload History Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.48 }}
        className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileText size={13} /> Upload History
          </h3>
          <span className="badge badge-purple text-[10px] py-0.5 px-2">{history.length} resumes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-3 px-2">Filename</th>
                <th className="pb-3 px-2">Upload Date</th>
                <th className="pb-3 px-2">Skills Found</th>
                <th className="pb-3 px-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((h, i) => (
                <motion.tr key={h._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-brand-lightBlue flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-brand-indigo" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px] sm:max-w-xs">{h.filename}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-xs text-slate-500">{new Date(h.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="py-3.5 px-2">
                    <span className="badge badge-indigo text-[10px] py-0.5 px-2">{h.extractedSkills?.length || 0} skills</span>
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`text-xs font-black ${h.score >= 70 ? 'text-emerald-600' : h.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {h.score}/100
                    </span>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <FileText size={28} className="text-slate-200" />
                      <p className="text-sm font-medium">No upload history yet</p>
                      <p className="text-xs">Upload a resume above to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { 
  Upload, FileText, ArrowRight, CheckCircle2, Award, 
  Map, Sparkles, BookOpen, AlertCircle, RefreshCw 
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

const CAREERS = [
  'Software Engineer',
  'Full Stack Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Cyber Security Engineer',
  'Cloud Engineer',
  'DevOps Engineer'
];

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

  // Fetch initial profile/dashboard details
  const fetchDashboardData = async () => {
    try {
      // Get selected career goal
      const goalRes = await API.get('/career/goal');
      setCareerGoal(goalRes.data);

      // Get roadmap progress
      const roadmapRes = await API.get('/career/roadmap');
      setRoadmap(roadmapRes.data);

      // Get resume history (and set latest resume)
      const historyRes = await API.get('/resume/history');
      setHistory(historyRes.data);
      if (historyRes.data.length > 0) {
        setResume(historyRes.data[0]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCareerChange = async (e) => {
    const selected = e.target.value;
    if (!selected) return;

    setError('');
    setSuccess('');
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
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // Mock progress animation since standard axios uploadProgress can trigger fast on localhost
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const res = await API.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setResume(res.data.resume);
      setSuccess('Resume analyzed successfully! Skills extracted.');
      setFile(null);
      
      // Refresh details
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError('Error uploading/parsing resume. Ensure PDF contains readable text.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Compute stats
  const resumeScore = resume?.score || 0;
  const matchPercentage = careerGoal?.matchPercentage || 0;
  const currentSkillsCount = careerGoal?.requiredSkills?.length - careerGoal?.missingSkills?.length || 0;
  const totalRequired = careerGoal?.requiredSkills?.length || 0;

  // Calculate roadmap progress
  const completedWeeks = roadmap?.weeks?.filter(w => w.completed).length || 0;
  const totalWeeks = roadmap?.weeks?.length || 12;
  const roadmapProgressPercent = Math.round((completedWeeks / totalWeeks) * 100);

  // Prepare Recharts radial gauge data
  const data = [
    {
      name: 'Match Score',
      value: matchPercentage,
      fill: '#6366F1', // Indigo
    }
  ];

  return (
    <div className="space-y-6">
      {/* Messages */}
      {success && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-sm text-green-600 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome & Career Goal selection */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/60 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Engine Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-brand-slate tracking-tight">
              Design Your Future Career Path
            </h1>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              Upload your latest resume to analyze your profile. Select a career goal to run a real-time AI skill gap analysis and generate a personalized learning roadmap.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide px-1">Selected Career Goal</label>
              <select
                value={careerGoal?.career || ''}
                onChange={handleCareerChange}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 transition-all duration-300 text-slate-700"
              >
                <option value="" disabled>-- Select Career Goal --</option>
                {CAREERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => navigate('/skill-gap')}
                disabled={!careerGoal}
                className="w-full bg-brand-indigo hover:bg-brand-indigo/95 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md shadow-brand-indigo/20 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Review Skill Gap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Resume Score Card (Radial Gauge) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Resume Score</span>
            <Award className="w-5 h-5 text-brand-purple" />
          </div>

          <div className="relative h-40 w-full flex items-center justify-center">
            {resume ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="70%" 
                    outerRadius="90%" 
                    barSize={10} 
                    data={data}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar 
                      background 
                      clockWise 
                      dataKey="value" 
                    >
                      <Cell fill="#6366F1" />
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-4">
                  <span className="text-4xl font-extrabold text-slate-800">{resumeScore}</span>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">out of 100</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-2 px-6">
                <FileText className="w-10 h-10 text-slate-300 animate-bounce" />
                <p className="text-xs font-semibold">No resume uploaded yet</p>
              </div>
            )}
          </div>

          {resume ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">
                {resume.filename}
              </p>
              <p className="text-[10px] text-slate-400">
                Uploaded: {new Date(resume.uploadDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 max-w-[200px]">
              Upload a resume PDF below to evaluate your score and sync your skills list.
            </p>
          )}
        </div>

      </div>

      {/* Upload & Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Resume Upload Module */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60">
          <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide mb-4">Upload Resume</h3>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-brand-indigo/50 transition-colors duration-300 relative group cursor-pointer bg-white/35">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-indigo group-hover:scale-105 transition-all duration-300" />
              <p className="text-xs font-bold text-slate-600 mt-2.5">
                {file ? file.name : 'Choose PDF file'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">PDF file up to 5MB</p>
            </div>

            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-brand-indigo">
                  <span>Uploading & Parsing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-indigo to-brand-purple h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-2xl text-xs transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Analyze Resume
            </button>
          </form>
        </div>

        {/* Current Skills Badge List */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide">Skills Extracted</h3>
              <span className="text-xs font-bold text-brand-purple bg-brand-lavender px-2 py-0.5 rounded-lg">
                {resume?.extractedSkills?.length || 0} Total
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {resume?.extractedSkills && resume.extractedSkills.length > 0 ? (
                resume.extractedSkills.map((s, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-medium text-slate-600 bg-white border border-slate-100 px-2.5 py-1 rounded-xl shadow-sm"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <div className="text-slate-400 text-xs py-8 text-center w-full">
                  Upload a resume to extract and view your technical skills here.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-2xl text-xs transition-all duration-300 mt-4"
          >
            Manage Skills Profile
          </button>
        </div>

        {/* Roadmap Progress Module */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide">Roadmap Tracker</h3>
              <Map className="w-5 h-5 text-brand-indigo" />
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-800">
                  {completedWeeks} <span className="text-xs text-slate-400 font-semibold uppercase">/ {totalWeeks} Weeks</span>
                </span>
                <span className="text-xs font-bold text-brand-indigo">{roadmapProgressPercent}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-indigo to-brand-purple h-full transition-all duration-300"
                  style={{ width: `${roadmapProgressPercent}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {careerGoal 
                  ? `Mastering ${careerGoal.career}. Check off weeks in your active roadmap as you learn.` 
                  : 'Select a career goal above to initialize and track your custom learning roadmap.'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            disabled={!roadmap}
            className="w-full bg-brand-purple hover:bg-brand-purple/95 text-white font-semibold py-3 rounded-2xl text-xs shadow-md shadow-brand-purple/20 transition-all duration-300 mt-4 disabled:opacity-50"
          >
            Study Active Roadmap
          </button>
        </div>

      </div>

      {/* Upload History / Resume History */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60">
        <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide mb-4">Upload History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wide">
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Extracted Skills</th>
                <th className="py-3 px-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              {history.length > 0 ? (
                history.map((h) => (
                  <tr key={h._id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[150px] sm:max-w-xs">{h.filename}</span>
                    </td>
                    <td className="py-3 px-4">{new Date(h.uploadDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold bg-brand-lightBlue text-brand-indigo px-2 py-0.5 rounded-md">
                        {h.extractedSkills?.length || 0} skills
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{h.score}/100</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No upload history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

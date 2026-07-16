import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { 
  Award, CheckCircle2, AlertCircle, ArrowLeft, 
  ArrowRight, Compass, ShieldAlert 
} from 'lucide-react';

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

  useEffect(() => {
    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  if (!careerGoal) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/60 text-center max-w-xl mx-auto my-12 space-y-6">
        <Compass className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-slate-700">No Career Goal Selected</h3>
        <p className="text-slate-400 text-sm">
          Please select a career goal in the dashboard first to analyze your skill gaps.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 bg-brand-indigo text-white font-semibold py-3 px-6 rounded-2xl text-sm shadow-md shadow-brand-indigo/15 hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </button>
      </div>
    );
  }

  // Identify matching skills
  const required = careerGoal.requiredSkills || [];
  const missing = careerGoal.missingSkills || [];
  const current = required.filter(s => !missing.includes(s));

  return (
    <div className="space-y-6">
      {/* Header Back Link */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wide"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Analysis Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-lavender text-brand-purple rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Skill Gap Analysis</span>
            </span>
            <h1 className="text-3xl font-extrabold text-brand-slate tracking-tight">
              Target: {careerGoal.career}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              Here is a comparison of your resume skills against the industry standards for a <strong className="text-slate-700">{careerGoal.career}</strong>. Leverage the AI roadmap to bridge the gap.
            </p>
          </div>

          {/* Large Match Score */}
          <div className="flex flex-col items-center justify-center p-6 border border-brand-indigo/10 bg-brand-indigo/5 rounded-2xl text-center">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider mb-1">Match Percentage</span>
            <span className="text-5xl font-black text-brand-indigo">{careerGoal.matchPercentage}%</span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className="bg-brand-indigo h-full transition-all duration-500" 
                style={{ width: `${careerGoal.matchPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Comparison Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Skills (Matched) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide">Acquired Skills</h3>
              <p className="text-[10px] text-slate-400">Skills present in your resume that match</p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              {current.length} / {required.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
            {current.length > 0 ? (
              current.map((skill, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-7 w-7 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{skill}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-slate-400 text-xs py-8 text-center">
                No matching skills found. Upload a detailed resume.
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills (Gap) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-brand-slate uppercase tracking-wide">Missing Skills</h3>
              <p className="text-[10px] text-slate-400">Core skills required that you lack</p>
            </div>
            <span className="text-xs font-bold text-brand-indigo bg-brand-lightBlue px-2.5 py-1 rounded-xl flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-brand-indigo" />
              {missing.length} Missing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
            {missing.length > 0 ? (
              missing.map((skill, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="h-7 w-7 rounded-lg bg-brand-lightBlue flex items-center justify-center text-brand-indigo shrink-0 group-hover:scale-105 transition-transform">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{skill}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-slate-400 text-xs py-8 text-center text-green-600 font-bold bg-green-50 rounded-2xl">
                🚀 Congratulations! You have a 100% skill match for this career goal.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">Ready to bridge the gap?</h4>
            <p className="text-xs text-slate-400">Generate or view your 12-week curated learning roadmap.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/roadmap')}
          className="bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-indigo/95 hover:to-brand-purple/95 text-white font-semibold py-3 px-6 rounded-2xl text-xs shadow-md shadow-brand-indigo/20 transition-all duration-300 flex items-center gap-2 group shrink-0"
        >
          <span>Open AI Roadmap</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default SkillGap;

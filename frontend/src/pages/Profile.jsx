import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { 
  User, Mail, Award, Route, CheckCircle2, 
  LogOut, ClipboardList, ShieldAlert, Sparkles, BookOpen 
} from 'lucide-react';

const Profile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [careerGoal, setCareerGoal] = useState(null);
  const [resume, setResume] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const profileRes = await API.get('/auth/profile');
      setProfile(profileRes.data);

      const goalRes = await API.get('/career/goal');
      setCareerGoal(goalRes.data);

      const roadmapRes = await API.get('/career/roadmap');
      setRoadmap(roadmapRes.data);

      const historyRes = await API.get('/resume/history');
      if (historyRes.data.length > 0) {
        setResume(historyRes.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  // Calculate stats
  const completedWeeks = roadmap?.weeks?.filter(w => w.completed).length || 0;
  const totalWeeks = roadmap?.weeks?.length || 12;
  const progressPercent = Math.round((completedWeeks / totalWeeks) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/60 relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-brand-indigo/10 to-brand-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* User initials circle */}
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-extrabold text-3xl shrink-0 shadow-lg shadow-brand-indigo/20">
          {profile?.name ? profile.name[0].toUpperCase() : 'S'}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-black text-brand-slate tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <span>{profile?.name}</span>
            <Sparkles className="w-5 h-5 text-brand-purple" />
          </h1>
          <p className="text-xs font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-slate-300" />
            <span>{profile?.email}</span>
          </p>
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-brand-lightBlue px-2 py-0.5 rounded-md mt-2">
            Student Profile
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Academic & Career Summary */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Career Goal Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <ClipboardList className="w-4.5 h-4.5 text-brand-indigo" />
              <span>Career Target</span>
            </h3>

            {careerGoal ? (
              <div className="space-y-3">
                <p className="text-sm font-extrabold text-slate-700">{careerGoal.career}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Match score:</span>
                  <span className="font-bold text-brand-indigo">{careerGoal.matchPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-brand-indigo h-full transition-all duration-300" 
                    style={{ width: `${careerGoal.matchPercentage}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No career goal selected yet.</p>
            )}
          </div>

          {/* Resume Score Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-brand-purple" />
              <span>Resume Score</span>
            </h3>

            {resume ? (
              <div className="space-y-2">
                <span className="text-3xl font-black text-slate-700">{resume.score}</span>
                <span className="text-xs text-slate-400 block font-semibold">out of 100 points</span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Parsed from: <span className="font-bold truncate max-w-[120px] inline-block align-bottom">{resume.filename}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No resumes uploaded yet.</p>
            )}
          </div>

          {/* Roadmap completion */}
          <div className="glass-panel p-6 rounded-3xl border border-white/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <Route className="w-4.5 h-4.5 text-brand-indigo" />
              <span>Roadmap Progress</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-slate-700">
                  {completedWeeks} <span className="text-xs text-slate-400 font-semibold">/ {totalWeeks} Wks</span>
                </span>
                <span className="text-xs font-bold text-brand-indigo">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brand-indigo h-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogoutClick}
            className="w-full bg-red-50 border border-red-100 hover:bg-red-100/50 text-red-600 font-semibold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Sign Out Profile</span>
          </button>

        </div>

        {/* Right column: Full Extracted Skills List */}
        <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-white/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4.5 h-4.5 text-brand-indigo" />
              <span>Full Skills inventory</span>
            </h3>
            <span className="text-xs font-bold text-brand-indigo bg-brand-lightBlue px-2.5 py-0.5 rounded-lg">
              {resume?.extractedSkills?.length || 0} Total
            </span>
          </div>

          <div className="flex flex-wrap gap-2 flex-grow">
            {resume?.extractedSkills && resume.extractedSkills.length > 0 ? (
              resume.extractedSkills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2.5 px-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-600">{skill}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-xs py-12 text-center w-full">
                Upload your resume PDF in the Dashboard to populate your skills inventory.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;

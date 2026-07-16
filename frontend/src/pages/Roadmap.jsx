import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { 
  Route, Compass, CheckCircle2, Circle, Clock, 
  ExternalLink, Code, BookOpen, ArrowLeft, ChevronDown, ChevronUp 
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
      // Auto expand the first uncompleted week
      if (res.data && res.data.weeks) {
        const uncompleted = res.data.weeks.find(w => !w.completed);
        if (uncompleted) {
          setExpandedWeek(uncompleted.week);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve your roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  if (!roadmap || !roadmap.weeks || roadmap.weeks.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-white/60 text-center max-w-xl mx-auto my-12 space-y-6">
        <Route className="w-12 h-12 text-slate-300 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-slate-700">No Learning Roadmap Found</h3>
        <p className="text-slate-400 text-sm">
          Please select a career goal on the Dashboard. AI will analyze your skill gap and curate a personalized 12-week roadmap.
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

  const completedWeeks = roadmap.weeks.filter(w => w.completed).length;
  const totalWeeks = roadmap.weeks.length;
  const progressPercent = Math.round((completedWeeks / totalWeeks) * 100);

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

      {/* Progress Overview */}
      <div className="glass-panel p-6 rounded-3xl border border-white/60 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-brand-indigo/5 to-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-purple uppercase tracking-wider bg-brand-lavender px-2.5 py-0.5 rounded-lg">
            Active Study
          </span>
          <h1 className="text-2xl font-extrabold text-brand-slate tracking-tight">
            12-Week Roadmap: {roadmap.careerGoal}
          </h1>
          <p className="text-xs text-slate-400">
            Follow this customized timeline to master your missing skills. Check off completed weeks.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-xl font-extrabold text-slate-700">{completedWeeks} / {totalWeeks}</span>
            <span className="text-xs text-slate-400 font-semibold block">Weeks Completed</span>
          </div>
          
          <div className="relative h-14 w-14 flex items-center justify-center rounded-full bg-brand-indigo/10 border border-brand-indigo/20">
            <span className="text-xs font-black text-brand-indigo">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Roadmap Timeline Weeks */}
      <div className="space-y-4">
        {roadmap.weeks.map((weekItem) => {
          const isExpanded = expandedWeek === weekItem.week;
          return (
            <div 
              key={weekItem.week}
              className={`glass-panel border rounded-3xl transition-all duration-300 ${
                weekItem.completed 
                  ? 'border-green-100 bg-green-50/10' 
                  : isExpanded 
                    ? 'border-brand-indigo/30 shadow-md shadow-brand-indigo/5 bg-white/70' 
                    : 'border-white/60 hover:bg-white/40'
              }`}
            >
              {/* Card Header Accordion */}
              <div 
                onClick={() => toggleExpand(weekItem.week)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-4">
                  {/* Completion Toggle checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWeekCompletion(weekItem.week);
                    }}
                    className={`transition-transform duration-200 hover:scale-105 shrink-0 ${
                      weekItem.completed ? 'text-green-500' : 'text-slate-400 hover:text-brand-indigo'
                    }`}
                  >
                    {weekItem.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-green-50" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div>
                    <h3 className={`text-sm font-extrabold ${weekItem.completed ? 'text-green-700/80 line-through' : 'text-slate-800'}`}>
                      {weekItem.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      <span className="text-brand-indigo">Week {weekItem.week}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {weekItem.estimatedHours} Hours
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Card Body Contents */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100/50 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                  
                  {/* Left Column: Topics & Resources */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                        <BookOpen className="w-4 h-4 text-brand-indigo" />
                        <span>Core Topics To Learn</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {weekItem.topics && weekItem.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo shrink-0 mt-1.5"></span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                        <ExternalLink className="w-4 h-4 text-brand-purple" />
                        <span>Curated Resources</span>
                      </h4>
                      <div className="space-y-2">
                        {weekItem.resources && weekItem.resources.map((res, rIdx) => (
                          <a 
                            key={rIdx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 hover:text-brand-indigo text-xs font-bold transition-all duration-300"
                          >
                            <span>{res.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Project */}
                  <div className="p-4 bg-brand-lightBlue/30 border border-brand-lightBlue/50 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-brand-indigo uppercase tracking-wider flex items-center gap-1.5">
                        <Code className="w-4 h-4" />
                        <span>Weekly Mini Project</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {weekItem.project}
                      </p>
                    </div>

                    <div className="border-t border-brand-lightBlue/40 pt-3 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Hands-on Practice</span>
                      <span className="text-brand-indigo">Build & Verify</span>
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;

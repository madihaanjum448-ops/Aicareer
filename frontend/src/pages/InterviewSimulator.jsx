import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Play, CheckCircle2, AlertCircle, ArrowLeft,
  Sparkles, RefreshCw, Volume2, VolumeX, Send, Brain, Trophy
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';

const SAMPLE_QUESTIONS = {
  'Software Engineer': [
    "Can you explain the difference between processes and threads, and when you would use each?",
    "Describe what happens when you type a URL into a browser and press Enter.",
    "What is database normalization, and what are its pros and cons?",
  ],
  'Full Stack Developer': [
    "What are the differences between client-side rendering and server-side rendering, and how do you choose?",
    "Explain how CORS (Cross-Origin Resource Sharing) works and how you would fix a CORS error.",
    "Describe your favorite state management library and why you choose it over context or local state.",
  ],
  'AI Engineer': [
    "How does the self-attention mechanism work in Transformers, and why is it superior to RNNs?",
    "Explain the difference between overfitting and underfitting, and how to mitigate each in deep neural networks.",
    "What is the role of temperature in generative language model sampling?",
  ],
  'General / Behavioural': [
    "Tell me about a time you encountered a difficult technical challenge and how you solved it.",
    "How do you estimate developer timelines and prioritize tasks under tight deadlines?",
    "Describe a situation where you had to work with a teammate whose programming style differed from yours.",
  ]
};

const InterviewSimulator = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Software Engineer');
  const [stage, setStage] = useState('setup'); // setup, active, review
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);

  const recognitionRef = useRef(null);
  const questions = SAMPLE_QUESTIONS[role] || SAMPLE_QUESTIONS['General / Behavioural'];

  // Load interview history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('interview_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // Web Speech API - Dictation Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentResponse(transcript);
      };

      recognition.onerror = (e) => {
        console.error('Speech Recognition Error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Speak a question using TTS
  const speakQuestion = (text) => {
    if (!isSpeaking) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (stage === 'active') {
      speakQuestion(questions[questionIdx]);
    }
    return () => window.speechSynthesis.cancel();
  }, [stage, questionIdx]);

  const startInterview = () => {
    setAnswers([]);
    setQuestionIdx(0);
    setCurrentResponse('');
    setStage('active');
  };

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleNext = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Save answer
    const newAnswers = [...answers, {
      question: questions[questionIdx],
      answer: currentResponse.trim() || "(No response typed or spoken)"
    }];
    setAnswers(newAnswers);

    if (questionIdx < questions.length - 1) {
      setQuestionIdx(prev => prev + 1);
      setCurrentResponse('');
    } else {
      evaluateInterview(newAnswers);
    }
  };

  // Evaluate responses using a smart rubric (Gemini mock/local fallback rules)
  const evaluateInterview = async (completedAnswers) => {
    setLoadingFeedback(true);
    setStage('review');

    // Simulate AI response synthesis
    setTimeout(() => {
      // Calculate scores dynamically based on length & tech terms
      const techKeywords = ['architecture', 'api', 'state', 'process', 'normalization', 'thread', 'transformer', 'overfitting', 'performance', 'design'];
      let keywordMatches = 0;
      let totalLength = 0;

      completedAnswers.forEach(ans => {
        totalLength += ans.answer.length;
        techKeywords.forEach(kw => {
          if (ans.answer.toLowerCase().includes(kw)) keywordMatches++;
        });
      });

      const avgLen = totalLength / completedAnswers.length;
      const commScore = Math.min(60 + Math.round(avgLen / 10), 98);
      const techScore = Math.min(50 + keywordMatches * 10, 95);
      const clarityScore = Math.min(55 + Math.round(avgLen / 12), 97);
      const overallScore = Math.round((commScore + techScore + clarityScore) / 3);

      const computedEval = {
        role,
        date: new Date().toLocaleDateString(),
        overall: overallScore,
        categories: [
          { subject: 'Communication', score: commScore },
          { subject: 'Technical', score: techScore },
          { subject: 'Completeness', score: clarityScore },
          { subject: 'Structure', score: Math.min(60 + keywordMatches * 8, 95) },
          { subject: 'Tone', score: 85 }
        ],
        suggestions: [
          overallScore >= 80 ? "Your explanations are detailed and structured well." : "Try using the STAR methodology (Situation, Task, Action, Result) to format your explanations.",
          techScore >= 75 ? "Excellent use of technical terminology." : "Consider adding more industry-specific words (like latency, state management, normalization) to sound more authoritative.",
          "Ensure you explain constraints or trade-offs (e.g. pros vs cons) to show a mature architectural understanding."
        ]
      };

      setEvaluation(computedEval);

      // Save to history
      const updatedHistory = [computedEval, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('interview_history', JSON.stringify(updatedHistory));

      // Trigger achievement badge check
      const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      if (!currentAchievements.includes('interview')) {
        currentAchievements.push('interview');
        localStorage.setItem('achievements', JSON.stringify(currentAchievements));
      }

      setLoadingFeedback(false);
    }, 2000);
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
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <span className="badge badge-purple inline-flex"><Brain size={10} /> Live Simulator</span>
            <h1 className="text-3xl font-black text-brand-slate">AI Interview <span className="gradient-text">Simulator</span></h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Test your technical skills under realistic interview conditions. Use speech dictation to reply and get instant grading reports.
            </p>
          </div>
          <button onClick={() => setIsSpeaking(!isSpeaking)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
              isSpeaking ? 'bg-brand-indigo/10 border-brand-indigo/35 text-brand-indigo shadow-glow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
            {isSpeaking ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>Voice Prompts {isSpeaking ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup / Simulator Console */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {stage === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Configure Your Interview</h3>
                  <p className="text-xs text-slate-400 mt-1">Select your focus role. The AI will ask a series of 3 technical questions.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Software Engineer', 'Full Stack Developer', 'AI Engineer'].map(opt => (
                      <button key={opt} onClick={() => setRole(opt)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-350 ${
                          role === opt ? 'border-brand-indigo bg-brand-lightBlue/30 text-brand-indigo ring-2 ring-brand-indigo/10' : 'border-slate-100 bg-white/60 hover:bg-slate-50 text-slate-600'
                        }`}>
                        <Brain size={20} className={role === opt ? 'text-brand-indigo' : 'text-slate-400'} />
                        <p className="text-sm font-bold mt-3 leading-tight">{opt}</p>
                        <p className="text-[10px] text-slate-400 mt-1">3 Questions</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">Microphone Permission Recommended</p>
                      <p className="text-[10px] text-amber-600 mt-0.5 leading-relaxed">
                        To speak your answers, make sure to click "Allow microphone access" when requested by your browser.
                      </p>
                    </div>
                  </div>
                </div>

                <button onClick={startInterview} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2">
                  <Play size={16} />
                  <span>Start Mock Interview</span>
                </button>
              </motion.div>
            )}

            {stage === 'active' && (
              <motion.div key="active" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100/50">
                  <span className="badge badge-indigo text-[10px]">Question {questionIdx + 1} of {questions.length}</span>
                  <span className="text-xs text-slate-400 font-semibold">{role} Mock</span>
                </div>

                {/* Interviewer Box */}
                <div className="flex gap-4 items-start p-4 rounded-3xl bg-brand-lightBlue/40 border border-brand-indigo/5">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold shrink-0">
                    AI
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wide">Interviewer</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{questions[questionIdx]}</p>
                  </div>
                </div>

                {/* Response Entry Box */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wide">Your Answer</label>
                    {isListening && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Listening to mic...
                      </span>
                    )}
                  </div>

                  <textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder="Type your response, or click the mic to speak..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm font-medium leading-relaxed min-h-[140px] focus:bg-white focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 outline-none transition-all resize-none"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={handleMicToggle}
                      className={`h-12 px-6 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isListening
                          ? 'bg-red-50 border-red-200 text-red-500 ring-4 ring-red-100'
                          : 'bg-slate-100 border-slate-200 hover:bg-brand-lightBlue hover:text-brand-indigo text-slate-600'
                      }`}>
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      <span>{isListening ? 'Stop' : 'Voice Dictate'}</span>
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={!currentResponse.trim()}
                      className="btn-primary flex-1 h-12 text-sm flex items-center justify-center gap-2">
                      <span>{questionIdx === questions.length - 1 ? 'Finish & Grade' : 'Next Question'}</span>
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                {loadingFeedback ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="h-12 w-12 rounded-full border-3 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
                    <p className="text-sm font-semibold text-slate-400">AI is reviewing your performance...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-slate-800">Interview Evaluation</h3>
                      <button onClick={startInterview} className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5">
                        <RefreshCw size={13} /> Try Again
                      </button>
                    </div>

                    {evaluation && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Radar Chart */}
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={evaluation.categories} cx="50%" cy="50%" outerRadius="75%">
                              <PolarGrid stroke="#E2E8F0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
                              <Radar name="Performance" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} strokeWidth={2} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Suggestions / Overall Score */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-lightBlue/40 border border-brand-indigo/5">
                            <Trophy size={28} className="text-brand-indigo shrink-0" />
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Overall Score</p>
                              <p className="text-2xl font-black text-slate-800">{evaluation.overall}/100</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Feedback & Tips</p>
                            <ul className="space-y-2">
                              {evaluation.suggestions.map((s, idx) => (
                                <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed items-start">
                                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar History Panel */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={13} /> Simulation History
            </h3>

            {history.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-indigo/10 transition-colors flex justify-between items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{h.role}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{h.date}</p>
                    </div>
                    <span className="text-sm font-black text-brand-indigo bg-brand-lightBlue px-2.5 py-1 rounded-xl">
                      {h.overall}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No mock interviews simulated yet.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;

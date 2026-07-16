import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle2, AlertCircle, Play, Sparkles,
  RefreshCw, ClipboardList, Clock, HelpCircle, Trophy, BookOpen
} from 'lucide-react';

const QUESTIONS = {
  'JavaScript': [
    { q: "Which of the following is NOT a JavaScript data type?", options: ["Undefined", "Number", "Float", "Boolean"], correct: 2, desc: "JavaScript numbers can be integers or floats, but there is only one 'Number' data type." },
    { q: "What is the output of 'typeof null' in JavaScript?", options: ["'null'", "'object'", "'undefined'", "'boolean'"], correct: 1, desc: "This is a long-standing bug/behavior in JS where null is classified as an object." },
    { q: "Which keyword is used to declare block-scoped variables in modern ES6?", options: ["var", "let", "declare", "define"], correct: 1, desc: "'let' and 'const' provide block scoping, whereas 'var' is function-scoped." },
    { q: "What is the purpose of 'Promise.all()'?", options: ["Runs promises sequentially", "Resolves only if all promises resolve", "Resolves when the first promise resolves", "Rejects all promises"], correct: 1, desc: "Promise.all waits for all input promises to resolve and rejects if any reject." },
    { q: "Which method converts a JSON string to a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.convert()"], correct: 1, desc: "JSON.parse() parses a JSON string, constructing the JS value described by the string." },
  ],
  'Python': [
    { q: "Which data structure in Python is mutable?", options: ["Tuple", "String", "List", "Integer"], correct: 2, desc: "Lists are mutable, whereas tuples and strings are immutable." },
    { q: "How do you declare a function in Python?", options: ["func name():", "define name():", "def name():", "function name():"], correct: 2, desc: "Python uses the 'def' keyword to start function definitions." },
    { q: "What is the default return value of a function that doesn't explicitly return?", options: ["None", "Null", "0", "False"], correct: 0, desc: "In Python, functions return 'None' by default if no return statement is reached." },
    { q: "What does list comprehension do?", options: ["Sorts lists", "Compresses list memory size", "Creates a new list based on an existing iterable", "Clears a list"], correct: 2, desc: "List comprehensions offer a shorter syntax to create new lists from existing iterables." },
    { q: "Which of the following is used to handle exceptions in Python?", options: ["try/catch", "try/except", "catch/throw", "handle/error"], correct: 1, desc: "Python uses 'try' and 'except' blocks for exception handling." },
  ],
  'Aptitude': [
    { q: "A train running at 54 km/hr crosses a post in 9 seconds. What is the length of the train?", options: ["120 m", "135 m", "150 m", "165 m"], correct: 1, desc: "Speed = 54 * (5/18) = 15 m/s. Length = Speed * Time = 15 * 9 = 135 meters." },
    { q: "What is the probability of getting a sum of 9 when rolling two fair dice?", options: ["1/9", "1/6", "5/36", "1/12"], correct: 0, desc: "Favorable outcomes are (3,6), (4,5), (5,4), (6,3) — 4 outcomes out of 36. 4/36 = 1/9." },
    { q: "A sum of money doubles itself in 8 years at simple interest. What is the annual interest rate?", options: ["10%", "12.5%", "15%", "8%"], correct: 1, desc: "Simple Interest = Principal. R = (100 * I) / (P * T) = (100 * P) / (P * 8) = 100/8 = 12.5%." },
    { q: "If 12 men can build a wall in 20 days, how many days will it take 8 men to build the same wall?", options: ["30 days", "24 days", "28 days", "32 days"], correct: 0, desc: "Total Man-days = 12 * 20 = 240. Days for 8 men = 240 / 8 = 30 days." },
    { q: "What is the average of first 50 natural numbers?", options: ["25", "25.5", "26", "24.5"], correct: 1, desc: "Sum = n(n+1)/2. Average = (n+1)/2 = 51/2 = 25.5." },
  ],
  'Data Structures': [
    { q: "Which data structure works on the LIFO principle?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correct: 1, desc: "Stacks operate on Last-In, First-Out (LIFO), whereas queues operate on FIFO." },
    { q: "What is the worst-case time complexity of searching in a Hash Table?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 2, desc: "In the worst case (with many hash collisions), search time degrades to O(n)." },
    { q: "What traversal method yields elements of a Binary Search Tree (BST) in sorted order?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correct: 1, desc: "In-order traversal of a BST visits nodes in ascending/sorted order." },
    { q: "Which algorithm finds the shortest path in a weighted graph with no negative weights?", options: ["Kruskal's", "Dijkstra's", "Prim's", "Bellman-Ford"], correct: 1, desc: "Dijkstra's algorithm is optimal for finding single-source shortest paths on positive-weighted graphs." },
    { q: "What is a major advantage of a doubly linked list over a singly linked list?", options: ["Less memory usage", "Easier to implement", "Allows traversal in both directions", "Faster element access by index"], correct: 2, desc: "Each node holds a reference to both its next and previous elements, permitting bidirectional navigation." }
  ]
};

const MockTest = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('JavaScript');
  const [stage, setStage] = useState('setup'); // setup, active, results
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [history, setHistory] = useState([]);
  const [testResult, setTestResult] = useState(null);

  const testQuestions = QUESTIONS[topic] || QUESTIONS['JavaScript'];

  // Load test history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('test_history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (stage !== 'active') return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  const startTest = () => {
    setSelectedAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setTimeLeft(300);
    setStage('active');
  };

  const handleSelectAnswer = (optIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    testQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correctCount++;
    });

    const score = Math.round((correctCount / testQuestions.length) * 100);
    const result = {
      topic,
      date: new Date().toLocaleDateString(),
      score,
      correct: correctCount,
      total: testQuestions.length,
      timeTaken: 300 - timeLeft
    };

    setTestResult(result);
    const updatedHistory = [result, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('test_history', JSON.stringify(updatedHistory));

    // Achievement checklist sync
    const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!currentAchievements.includes('test')) {
      currentAchievements.push('test');
      localStorage.setItem('achievements', JSON.stringify(currentAchievements));
    }

    setStage('results');
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Back Button */}
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-indigo transition-colors uppercase tracking-widest group no-print">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Hero */}
      <div className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-indigo/8 to-brand-purple/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex justify-between items-center">
          <div className="space-y-2">
            <span className="badge badge-purple inline-flex"><ClipboardList size={10} /> Aptitude & Technical</span>
            <h1 className="text-3xl font-black text-brand-slate">Mock <span className="gradient-text">Tests</span></h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Simulate standard recruitment selection rounds with interactive quiz banks, time tracking, and detailed result explanations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Test Console */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {stage === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Select Test Topic</h3>
                  <p className="text-xs text-slate-400 mt-1">Each quiz contains 5 questions and has a limit of 5 minutes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(QUESTIONS).map(opt => (
                    <button key={opt} onClick={() => setTopic(opt)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        topic === opt ? 'border-brand-indigo bg-brand-lightBlue/30 text-brand-indigo ring-2 ring-brand-indigo/10' : 'border-slate-100 bg-white/60 hover:bg-slate-50 text-slate-600'
                      }`}>
                      <BookOpen size={22} className={topic === opt ? 'text-brand-indigo' : 'text-slate-400'} />
                      <p className="text-sm font-bold mt-4">{opt} Quiz</p>
                      <p className="text-xs text-slate-400 mt-1">5 MCQs · 5 Min Timer</p>
                    </button>
                  ))}
                </div>

                <button onClick={startTest} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2">
                  <Play size={16} />
                  <span>Begin Assessment</span>
                </button>
              </motion.div>
            )}

            {stage === 'active' && (
              <motion.div key="active" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                {/* Header status bar */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100/50">
                  <div className="flex items-center gap-4">
                    <span className="badge badge-indigo text-[10px]">Q {currentIdx + 1} of {testQuestions.length}</span>
                    <button onClick={toggleFlag}
                      className={`text-xs font-bold flex items-center gap-1 transition-colors ${flagged[currentIdx] ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}>
                      ★ {flagged[currentIdx] ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">
                    <Clock size={13} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 leading-relaxed">
                    {testQuestions[currentIdx].q}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {testQuestions[currentIdx].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === optIdx;
                      return (
                        <button key={optIdx} onClick={() => handleSelectAnswer(optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-brand-indigo bg-brand-lightBlue/30 text-brand-indigo font-black'
                              : 'border-slate-100 bg-white/60 hover:bg-slate-50 text-slate-600'
                          }`}>
                          <span className="inline-block w-6 h-6 rounded-lg bg-slate-100 border text-center leading-6 mr-3 text-[10px] font-bold text-slate-500 group-hover:bg-brand-indigo group-hover:text-white">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation inside quiz */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100/50">
                  <div className="flex gap-1.5">
                    {testQuestions.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentIdx(idx)}
                        className={`h-8 w-8 rounded-xl border text-xs font-bold flex items-center justify-center transition-all ${
                          currentIdx === idx
                            ? 'bg-brand-indigo text-white border-brand-indigo font-black'
                            : selectedAnswers[idx] !== undefined
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : flagged[idx]
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                        }`}>
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {currentIdx > 0 && (
                      <button onClick={() => setCurrentIdx(prev => prev - 1)}
                        className="px-4 h-10 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl">
                        Prev
                      </button>
                    )}
                    {currentIdx < testQuestions.length - 1 ? (
                      <button onClick={() => setCurrentIdx(prev => prev + 1)}
                        className="px-4 h-10 bg-brand-indigo hover:bg-brand-indigo/90 text-white text-xs font-bold rounded-xl">
                        Next
                      </button>
                    ) : (
                      <button onClick={handleSubmit}
                        className="px-6 h-10 bg-gradient-to-r from-brand-indigo to-brand-purple hover:opacity-90 text-white text-xs font-bold rounded-xl">
                        Submit Test
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {stage === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Assessment Scorecard</h3>
                  <button onClick={() => setStage('setup')} className="btn-secondary px-4 py-2 text-xs flex items-center gap-1.5">
                    <RefreshCw size={13} /> Review Topics
                  </button>
                </div>

                {testResult && (
                  <div className="space-y-6">
                    {/* Scores row */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-2xl bg-brand-lightBlue/40 border border-brand-indigo/5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Final Score</p>
                        <p className="text-2xl font-black text-brand-indigo">{testResult.score}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Accuracy</p>
                        <p className="text-2xl font-black text-emerald-600">{testResult.correct}/{testResult.total}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Time Elapsed</p>
                        <p className="text-2xl font-black text-brand-purple">{Math.round(testResult.timeTaken / 5)}s</p>
                      </div>
                    </div>

                    {/* Explanations review */}
                    <div className="space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <HelpCircle size={13} /> Explanation Review
                      </p>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {testQuestions.map((q, idx) => {
                          const wasCorrect = selectedAnswers[idx] === q.correct;
                          return (
                            <div key={idx} className={`p-4 rounded-2xl border ${wasCorrect ? 'border-emerald-100 bg-emerald-50/10' : 'border-red-100 bg-red-50/10'} space-y-2`}>
                              <div className="flex gap-2">
                                {wasCorrect
                                  ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                  : <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{q.q}</p>
                              </div>
                              <div className="pl-6 text-[11px] text-slate-500 leading-relaxed">
                                <p className="font-semibold">Your selection: <span className={wasCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>{selectedAnswers[idx] !== undefined ? q.options[selectedAnswers[idx]] : '(Skipped)'}</span></p>
                                {!wasCorrect && <p className="font-semibold text-emerald-600 mt-0.5">Correct answer: {q.options[q.correct]}</p>}
                                <p className="mt-2 text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100/50">{q.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
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
              <Trophy size={13} /> Assessment History
            </h3>

            {history.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {history.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-indigo/10 transition-colors flex justify-between items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{h.topic}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{h.date}</p>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${h.score >= 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-lightBlue text-brand-indigo'}`}>
                      {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No mock assessments taken yet.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;

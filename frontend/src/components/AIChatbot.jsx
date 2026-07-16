import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, ChevronDown, Trash2 } from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'How do I improve my resume?',
  'What career suits me?',
  'Prepare for interviews',
  'Roadmap tips',
];

const AI_RESPONSES = {
  resume: [
    "Great question! Here are my top resume tips:\n\n• **Tailor it** to each job description\n• Add **quantifiable achievements** (e.g., \"Increased performance by 40%\")\n• Keep it **1 page** for early career\n• Use **action verbs** like Built, Designed, Led\n• Include a clear **skills section** with relevant technologies\n\nWant me to analyze your uploaded resume for specific improvements? 🚀",
    "Your resume is your first impression! Make sure to:\n\n✅ Use ATS-friendly formatting (no tables/columns)\n✅ List projects with GitHub links\n✅ Highlight measurable impact\n✅ Include relevant certifications\n\nHead to the Dashboard to upload and score your resume with AI!",
  ],
  career: [
    "Based on trending tech careers in 2026, here are the hottest paths:\n\n🔥 **AI/ML Engineer** — Highest demand, great pay\n💻 **Full Stack Developer** — Always in demand\n☁️ **Cloud/DevOps Engineer** — Essential for every company\n🔐 **Cybersecurity Engineer** — Critical shortage\n\nSelect a career goal on your Dashboard to get a personalized skill gap analysis!",
    "The best career for you depends on your strengths! Consider:\n\n• If you love math/stats → **Data Science**\n• If you love building apps → **Full Stack Dev**\n• If you love automation → **DevOps**\n• If you love research → **AI/ML**\n\nTry our skill gap analyzer to find your best match! 🎯",
  ],
  interview: [
    "Interview prep tips from me, your AI mentor:\n\n📚 **Technical Round**:\n• Practice on LeetCode (150 problems)\n• Study System Design basics\n• Know your resume projects deeply\n\n💬 **HR Round**:\n• Use the STAR method for behavioral questions\n• Research the company's mission\n• Prepare 5 questions to ask them\n\nYou've got this! 💪",
    "For technical interviews, focus on:\n\n1. **Data Structures**: Arrays, Trees, Graphs, HashMaps\n2. **Algorithms**: Sorting, BFS/DFS, Dynamic Programming\n3. **System Design**: Load balancers, databases, caching\n4. **Projects**: Be ready to explain every line of your code\n\nWant a mock interview question? Ask me anytime! 🧠",
  ],
  roadmap: [
    "Your 12-week roadmap is designed for maximum results! Here's how to get the most out of it:\n\n✅ **Complete 1 week per week** — don't rush\n✅ **Build the mini project** each week to solidify learning\n✅ **Use all listed resources** — they're curated by AI\n✅ **Check off completed weeks** to track progress\n\nHead to your Roadmap page to start! 🗺️",
  ],
  motivation: [
    "You're doing amazing by investing in your career growth! 🌟\n\nRemember:\n• Every expert was once a beginner\n• Consistency beats perfection\n• Small daily progress compounds into massive results\n• The best time to start was yesterday, the second best time is NOW\n\nYou've got this! Keep going! 💪🚀",
    "\"The secret to getting ahead is getting started.\" — Mark Twain\n\nYou're already ahead of 90% of people just by using AI-powered tools to guide your career! Keep that momentum going. What skill are you working on today? 🎯",
  ],
  default: [
    "I'm your CareerPilot AI mentor! I can help you with:\n\n🎯 **Career advice** — paths, transitions, goals\n📄 **Resume tips** — writing, scoring, improvements\n🧠 **Interview prep** — technical & behavioral\n🗺️ **Roadmap guidance** — how to use your plan effectively\n💪 **Motivation** — when you need a boost\n\nWhat would you like help with today?",
    "That's an interesting question! While I'm specialized in career guidance, I can definitely help. Could you tell me more about:\n\n• Your current skill level?\n• Your target role or career goal?\n• What's blocking you right now?\n\nThe more context you share, the better advice I can give! 🎯",
  ],
};

const getAIResponse = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes('resume') || lower.includes('cv')) return AI_RESPONSES.resume[Math.floor(Math.random() * AI_RESPONSES.resume.length)];
  if (lower.includes('career') || lower.includes('job') || lower.includes('path') || lower.includes('suit')) return AI_RESPONSES.career[Math.floor(Math.random() * AI_RESPONSES.career.length)];
  if (lower.includes('interview') || lower.includes('prep') || lower.includes('prepare')) return AI_RESPONSES.interview[Math.floor(Math.random() * AI_RESPONSES.interview.length)];
  if (lower.includes('roadmap') || lower.includes('plan') || lower.includes('week')) return AI_RESPONSES.roadmap[0];
  if (lower.includes('motivat') || lower.includes('struggle') || lower.includes('hard') || lower.includes('give up')) return AI_RESPONSES.motivation[Math.floor(Math.random() * AI_RESPONSES.motivation.length)];
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map(i => (
      <motion.div key={i} className="h-2 w-2 rounded-full bg-slate-300"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
    ))}
  </div>
);

const MessageContent = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line">
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </p>
  );
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('careerpilot_chat_messages');
    return saved ? JSON.parse(saved) : [
      { id: 1, role: 'ai', text: "Hi! I'm your CareerPilot AI Mentor 🚀\n\nI can help with career advice, resume tips, interview prep, and more. What would you like to discuss today?" }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('careerpilot_chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const clearHistory = () => {
    const defaultMsg = [
      { id: Date.now(), role: 'ai', text: "Conversation history cleared! Let's start fresh. What career queries do you have today?" }
    ];
    setMessages(defaultMsg);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1200;
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl chatbot-bubble flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        id="chatbot-toggle">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <motion.div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(99, 102, 241, 0.25), 0 4px 16px rgba(0,0,0,0.10)' }}>

            {/* Header */}
            <div className="bg-gradient-to-r from-brand-indigo to-brand-purple p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">CareerPilot AI</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[11px] text-white/70">AI Mentor Online</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={clearHistory} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors" title="Clear chat history">
                  <Trash2 size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-white/95 backdrop-blur-xl">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Sparkles size={12} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 ${msg.role === 'user' ? 'chatbot-message-user' : 'chatbot-message-ai'}`}>
                    <MessageContent text={msg.text} />
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="chatbot-message-ai">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 flex gap-2 flex-wrap bg-white/90 border-t border-slate-100">
                {QUICK_SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-brand-indigo/20 text-brand-indigo bg-brand-lightBlue hover:bg-brand-indigo hover:text-white transition-all duration-200">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask your AI mentor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
              />
              <button type="submit" disabled={!input.trim() || isTyping}
                className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0 shadow-glow-sm hover:shadow-glow-indigo transition-shadow">
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

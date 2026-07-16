import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, MapPin, DollarSign, ExternalLink, Star,
  Filter, Search, Sparkles, Building2, Clock
} from 'lucide-react';

const INTERNSHIPS = [
  {
    id: 1, company: 'Google', role: 'Software Engineer Intern', location: 'Bangalore, India',
    salary: '₹1.2L–₹1.8L/mo', match: 92, type: 'Full-time', duration: '3 months',
    skills: ['Python', 'Go', 'Distributed Systems', 'Data Structures'],
    logo: 'G', color: 'from-blue-500 to-sky-400', applyUrl: 'https://careers.google.com',
    posted: '2 days ago', featured: true,
  },
  {
    id: 2, company: 'Microsoft', role: 'AI/ML Research Intern', location: 'Hyderabad, India',
    salary: '₹1.5L–₹2L/mo', match: 88, type: 'Full-time', duration: '6 months',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'NLP'],
    logo: 'M', color: 'from-emerald-500 to-teal-400', applyUrl: 'https://careers.microsoft.com',
    posted: '5 days ago', featured: true,
  },
  {
    id: 3, company: 'Amazon', role: 'Cloud Solutions Intern', location: 'Remote',
    salary: '₹80K–₹1.2L/mo', match: 85, type: 'Part-time', duration: '4 months',
    skills: ['AWS', 'Node.js', 'Docker', 'Kubernetes'],
    logo: 'A', color: 'from-amber-500 to-orange-400', applyUrl: 'https://amazon.jobs',
    posted: '1 week ago', featured: false,
  },
  {
    id: 4, company: 'Flipkart', role: 'Full Stack Developer Intern', location: 'Bangalore, India',
    salary: '₹60K–₹90K/mo', match: 90, type: 'Full-time', duration: '3 months',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    logo: 'F', color: 'from-brand-indigo to-brand-purple', applyUrl: 'https://careers.flipkart.com',
    posted: '3 days ago', featured: false,
  },
  {
    id: 5, company: 'Zomato', role: 'Data Science Intern', location: 'Delhi NCR, India',
    salary: '₹50K–₹80K/mo', match: 78, type: 'Full-time', duration: '2 months',
    skills: ['Python', 'Pandas', 'SQL', 'Tableau'],
    logo: 'Z', color: 'from-rose-500 to-red-500', applyUrl: 'https://careers.zomato.com',
    posted: '4 days ago', featured: false,
  },
  {
    id: 6, company: 'CRED', role: 'iOS Developer Intern', location: 'Bangalore, India',
    salary: '₹70K–₹1L/mo', match: 72, type: 'Full-time', duration: '6 months',
    skills: ['Swift', 'Xcode', 'REST APIs', 'UIKit'],
    logo: 'C', color: 'from-violet-600 to-purple-700', applyUrl: 'https://careers.cred.club',
    posted: '1 week ago', featured: false,
  },
];

const FILTERS = ['All', 'Full-time', 'Part-time', 'Remote'];

const MatchBadge = ({ match }) => {
  const color = match >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : match >= 70 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-slate-500 bg-slate-50 border-slate-200';

  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-black ${color}`}>
      <Star size={10} className="fill-current" />
      {match}% match
    </div>
  );
};

const InternshipCard = ({ internship, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    className={`glass-card rounded-3xl p-6 relative group ${internship.featured ? 'ring-1 ring-brand-indigo/20' : ''}`}>

    {internship.featured && (
      <div className="absolute -top-3 left-5">
        <span className="badge badge-indigo text-[9px] py-0.5 px-2.5 shadow-glow-sm">
          <Sparkles size={9} /> Featured
        </span>
      </div>
    )}

    <div className="flex items-start gap-4">
      {/* Company Logo */}
      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${internship.color} flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
        {internship.logo}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-brand-indigo transition-colors">{internship.role}</h3>
            <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building2 size={12} /> {internship.company}
            </p>
          </div>
          <MatchBadge match={internship.match} />
        </div>

        <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1"><MapPin size={11} /> {internship.location}</span>
          <span className="flex items-center gap-1"><DollarSign size={11} /> {internship.salary}</span>
          <span className="flex items-center gap-1"><Clock size={11} /> {internship.duration}</span>
          <span className="badge badge-purple text-[9px] py-0 px-2">{internship.type}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {internship.skills.map(s => (
            <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60">{s}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
      <span className="text-[10px] text-slate-400 font-medium">Posted {internship.posted}</span>
      <a href={internship.applyUrl} target="_blank" rel="noopener noreferrer"
        className="btn-primary px-5 py-2 text-xs flex items-center gap-1.5 group/btn">
        Apply Now
        <ExternalLink size={12} className="group-hover/btn:scale-110 transition-transform" />
      </a>
    </div>
  </motion.div>
);

const Internships = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = INTERNSHIPS.filter(i => {
    const matchesFilter = activeFilter === 'All' || i.type === activeFilter || (activeFilter === 'Remote' && i.location === 'Remote');
    const matchesSearch = !search || i.role.toLowerCase().includes(search.toLowerCase()) || i.company.toLowerCase().includes(search.toLowerCase()) || i.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-8 page-wrapper">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card rounded-4xl p-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-brand-indigo/8 to-brand-purple/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="badge badge-indigo inline-flex"><Sparkles size={10} /> AI-Matched Opportunities</span>
            <h1 className="text-3xl font-black text-brand-slate">
              Internship <span className="gradient-text">Finder</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Curated internships matched to your skills and career goal. Apply directly with one click.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center glass-card rounded-2xl px-5 py-3">
              <p className="text-2xl font-black text-brand-indigo">{INTERNSHIPS.length}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Open Roles</p>
            </div>
            <div className="text-center glass-card rounded-2xl px-5 py-3">
              <p className="text-2xl font-black gradient-text">{Math.round(INTERNSHIPS.reduce((a, i) => a + i.match, 0) / INTERNSHIPS.length)}%</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Avg Match</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, company, or skill..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white/70 text-sm outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/8 transition-all font-medium" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 glass-card rounded-2xl p-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-brand-indigo to-brand-purple text-white shadow-glow-sm'
                  : 'text-slate-500 hover:text-brand-indigo hover:bg-brand-lightBlue'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400">
          Showing <span className="text-slate-700 font-bold">{filtered.length}</span> internships
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Filter size={12} /> Sorted by match %
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filtered.sort((a, b) => b.match - a.match).map((internship, i) => (
            <InternshipCard key={internship.id} internship={internship} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-16 text-center space-y-3">
          <Briefcase size={36} className="text-slate-200 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">No internships found</p>
          <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Internships;

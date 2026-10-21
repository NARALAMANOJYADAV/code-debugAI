'use client';

import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle2, ChevronRight, Play, 
  Sparkles, Award, FileCode, Building2, Search, Filter, BookOpen
} from 'lucide-react';

interface Question {
  id: number;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company: string;
  frequency: string;
  askedCount: number;
}

const mockInterviewQuestions: Question[] = [
  { id: 1, title: 'Explain Event Loop and Microtask Queue in JS', category: 'JavaScript', difficulty: 'Medium', company: 'Google', frequency: '98%', askedCount: 1420 },
  { id: 2, title: 'Design a High-Throughput URL Shortener (System Design)', category: 'System Design', difficulty: 'Hard', company: 'Amazon', frequency: '95%', askedCount: 2310 },
  { id: 3, title: 'Invert a Binary Tree & Discuss Time/Space Complexity', category: 'DSA', difficulty: 'Easy', company: 'Meta', frequency: '92%', askedCount: 3100 },
  { id: 4, title: 'Difference between Process and Thread', category: 'Operating Systems', difficulty: 'Easy', company: 'Microsoft', frequency: '89%', askedCount: 1850 },
  { id: 5, title: 'How does React Fiber Architecture work reconciliation?', category: 'React', difficulty: 'Hard', company: 'Uber', frequency: '87%', askedCount: 940 },
  { id: 6, title: 'Explain Database Indexing, B-Trees vs Hash Indexes', category: 'Databases', difficulty: 'Medium', company: 'Apple', frequency: '94%', askedCount: 1670 },
];

export default function InterviewPrepPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(mockInterviewQuestions[0]);
  const [userNotes, setUserNotes] = useState('');

  const companies = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Uber', 'Apple'];
  const categories = ['All', 'DSA', 'JavaScript', 'System Design', 'React', 'Databases', 'Operating Systems'];

  const filteredQuestions = mockInterviewQuestions.filter(q => {
    const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesComp = selectedCompany === 'All' || q.company === selectedCompany;
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesComp && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Company Interview Kits & Mock Drills
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Tech Interview Prep Suite
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Master top company interview questions, behavioral STAR models, system design blueprints, and mock AI drill sessions.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2">
            <Play className="w-4 h-4 fill-white" /> Start AI Mock Interview
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search interview questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium">Company:</span>
          {companies.slice(0, 5).map(c => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCompany === c 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium">Topic:</span>
          {categories.slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Questions List + Interactive Answer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
            Top Questions ({filteredQuestions.length})
          </h2>
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isSelected = activeQuestion?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestion(q)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      {q.company}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      q.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' :
                      q.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {q.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                    <span>Topic: {q.category}</span>
                    <span className="text-emerald-400 font-medium">{q.frequency} frequency</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Answer & AI Feedback Panel */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-medium text-cyan-400">{activeQuestion.company} Interview Question</span>
                  <h2 className="text-xl font-bold text-white mt-1">{activeQuestion.title}</h2>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Solved
                </button>
              </div>

              {/* AI Expert Model Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Ideal Answer Outline & STAR Method
                </h3>
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p><strong>1. Executive Summary:</strong> Start with a high-level 2-sentence explanation before diving into nuances.</p>
                  <p><strong>2. Core Mechanics:</strong> Break down internal queue loops, call stack execution, and asynchronous event handler callback resolution.</p>
                  <p><strong>3. Complexity & Edge Cases:</strong> Address call stack overflow, blocking code in main loops, and memory leaks.</p>
                </div>
              </div>

              {/* Practice Notes / Draft Answer */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Your Draft Response / Notes:</span>
                  <span className="text-slate-500 font-normal">Auto-saved to profile</span>
                </label>
                <textarea
                  rows={6}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Draft your explanation here... Try using key technical terms like Call Stack, Event Loop, Microtask Queue..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all">
                  Generate AI Hint
                </button>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-medium shadow-lg shadow-purple-500/20 transition-all flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Evaluate My Answer with AI
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Select a question to view breakdown and practice your response.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

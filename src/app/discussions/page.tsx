'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, ThumbsUp, MessageCircle, Share2, Plus, 
  Search, Filter, Tag, User, Sparkles, Pin, Flame
} from 'lucide-react';

interface Discussion {
  id: number;
  title: string;
  author: string;
  authorAvatar?: string;
  category: 'Bug Fix' | 'DSA' | 'Interview' | 'General';
  upvotes: number;
  replies: number;
  timeAgo: string;
  isPinned?: boolean;
  tags: string[];
}

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: 'How to handle Memory Leaks when using useEffect in Next.js 15 App Router?',
    author: 'Alex Developer',
    category: 'Bug Fix',
    upvotes: 142,
    replies: 28,
    timeAgo: '2 hours ago',
    isPinned: true,
    tags: ['Next.js', 'React', 'Performance', 'Memory Leak']
  },
  {
    id: 2,
    title: 'Visualizing Dynamic Programming: 0/1 Knapsack Intuition & Space Optimization',
    author: 'Sarah Algo',
    category: 'DSA',
    upvotes: 389,
    replies: 64,
    timeAgo: '5 hours ago',
    isPinned: true,
    tags: ['DP', 'Algorithms', 'Optimization']
  },
  {
    id: 3,
    title: 'Meta Senior Engineer Interview Experience (2026 Round Breakdown)',
    author: 'CodeMaster99',
    category: 'Interview',
    upvotes: 512,
    replies: 95,
    timeAgo: '1 day ago',
    tags: ['Meta', 'System Design', 'Interview Prep']
  },
  {
    id: 4,
    title: 'Why Python Recursion Depth error happens and how to optimize tail calls',
    author: 'PyDev_Guru',
    category: 'Bug Fix',
    upvotes: 88,
    replies: 15,
    timeAgo: '1 day ago',
    tags: ['Python', 'Recursion', 'Stack Overflow']
  }
];

export default function DiscussionsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [showNewModal, setShowNewModal] = useState(false);

  const categories = ['All', 'Bug Fix', 'DSA', 'Interview', 'General'];

  const filteredDiscussions = discussions.filter(d => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleUpvote = (id: number) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" /> Community Knowledge Base & Q&A
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Discussions & AI Notes
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Ask coding questions, share bug debugging solutions, discuss algorithm techniques, and read tech community articles.
          </p>
        </div>

        <button 
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Start Discussion
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search discussions or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filteredDiscussions.map((d) => (
          <div 
            key={d.id}
            className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all hover:bg-slate-900/80 group"
          >
            <div className="flex items-start gap-4">
              {/* Upvote Button */}
              <button 
                onClick={() => handleUpvote(d.id)}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-slate-700/50 text-slate-400 hover:text-cyan-400 transition-all group/btn"
              >
                <ThumbsUp className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs font-bold mt-1 text-slate-200 group-hover/btn:text-cyan-400">
                  {d.upvotes}
                </span>
              </button>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  {d.isPinned && (
                    <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded font-medium bg-slate-800 text-cyan-400 border border-slate-700">
                    {d.category}
                  </span>
                  <span className="text-slate-400">Posted by <strong className="text-slate-200">{d.author}</strong></span>
                  <span className="text-slate-500">• {d.timeAgo}</span>
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
                  {d.title}
                </h2>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {d.tags.map(tag => (
                      <span key={tag} className="text-[11px] bg-slate-950/60 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" /> {d.replies} replies
                    </span>
                    <button className="hover:text-slate-200">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

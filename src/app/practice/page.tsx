'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockProblems, Problem } from '../../lib/data/mockData';
import { useAppStore } from '../../lib/store';
import { insforge } from '../../lib/insforge';
import { 
  BookOpen, Search, CheckCircle, Flame, 
  HelpCircle, ArrowUpRight, Award, Library
} from 'lucide-react';

const CATEGORIES = ['All', 'Arrays', 'Stack', 'Sliding Window', 'Dynamic Programming', 'Math'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const COMPANIES = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'Adobe'];

function parseJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return parsed !== null ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return val;
}

export default function PracticePage() {
  const { userStats } = useAppStore();
  
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [activeCompany, setActiveCompany] = useState('All');

  useEffect(() => {
    async function fetchProblems() {
      const { data, error } = await insforge.database
        .from('problems')
        .select('*');

      if (data && data.length > 0) {
        const formatted: Problem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          difficulty: item.difficulty as 'Easy' | 'Medium' | 'Hard',
          acceptanceRate: item.acceptance_rate || '70%',
          companies: parseJson(item.companies, ['Google']),
          description: item.description,
          examples: parseJson(item.examples, []),
          constraints: parseJson(item.constraints, []),
          editorial: item.editorial || '',
          codeTemplates: parseJson(item.code_templates, {})
        }));
        setProblems(formatted);
      }
    }

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = prob.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || prob.category === activeCategory;
    const matchesDifficulty = activeDifficulty === 'All' || prob.difficulty === activeDifficulty;
    const companiesList = Array.isArray(prob.companies) ? prob.companies : [];
    const matchesCompany = activeCompany === 'All' || companiesList.includes(activeCompany);
    return matchesSearch && matchesCategory && matchesDifficulty && matchesCompany;
  });



  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Library className="h-8 w-8 text-cyan-400" />
            <span>Problem Practice Library</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Solve thousands of structured computer science challenges, get live evaluations, and earn achievements.
          </p>
        </div>
      </div>

      {/* Stats header widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-cyber-border p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black">Total Solved</span>
            <div className="text-2xl font-black text-white">{userStats.solvedIds.length} / {mockProblems.length}</div>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500/20" />
        </div>
        <div className="bg-slate-900 border border-cyber-border p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black">Level XP Progress</span>
            <div className="text-2xl font-black text-white">{userStats.xp} XP</div>
          </div>
          <Award className="h-8 w-8 text-cyan-500/20" />
        </div>
        <div className="bg-slate-900 border border-cyber-border p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black">Active Streak</span>
            <div className="text-2xl font-black text-amber-500">{userStats.streak} Days</div>
          </div>
          <Flame className="h-8 w-8 text-amber-500/20" />
        </div>
      </div>

      {/* Filter and catalog tools layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Panel (Left Sidebar on Large screens) */}
        <div className="space-y-4">
          <div className="glass-panel border border-cyber-border rounded-xl p-5 space-y-5">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Refine Search</h3>
            
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search index name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070b13] border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 outline-none transition"
              />
            </div>

            {/* Difficulties */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Difficulty</span>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setActiveDifficulty(diff)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded transition border ${
                      activeDifficulty === diff 
                        ? 'bg-cyan-500 text-slate-950 border-cyan-500' 
                        : 'bg-slate-950 text-slate-400 border-cyber-border hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Topics</span>
              <div className="flex flex-col space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left text-xs font-semibold py-1.5 px-2.5 rounded transition ${
                      activeCategory === cat 
                        ? 'bg-slate-800 text-cyan-400 font-bold border-l-2 border-cyan-500' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Companies tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Target Companies</span>
              <div className="flex flex-wrap gap-1.5">
                {COMPANIES.map((company) => (
                  <button
                    key={company}
                    onClick={() => setActiveCompany(company)}
                    className={`text-[10px] font-semibold px-2 py-1 rounded border transition ${
                      activeCompany === company 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-slate-950 text-slate-400 border-cyber-border hover:text-white'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Problems List Grid (Right Pane) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>Showing {filteredProblems.length} matching questions</span>
            <span>Sorted by popularity</span>
          </div>

          <div className="space-y-3">
            {filteredProblems.map((prob) => {
              const isSolved = userStats.solvedIds.includes(prob.id);
              return (
                <div 
                  key={prob.id} 
                  className={`glass-panel border p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isSolved 
                      ? 'border-emerald-500/20 bg-emerald-950/5' 
                      : 'border-cyber-border hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="font-extrabold text-white text-base hover:text-cyan-400 transition-colors">
                        <Link href={`/practice/${prob.id}`}>{prob.title}</Link>
                      </h3>
                      {isSolved && (
                        <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-400/20" title="Solved" />
                      )}
                    </div>
                    
                    {/* Companies Asked Badge list */}
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(prob.companies) ? prob.companies : []).map((company) => (
                        <span key={company} className="text-[9px] font-bold text-slate-500 bg-slate-900 border border-cyber-border px-1.5 py-0.5 rounded">
                          {company}
                        </span>
                      ))}
                    </div>

                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-500 block">Category</span>
                      <span className="text-slate-300 font-semibold">{prob.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Acceptance</span>
                      <span className="text-slate-300 font-semibold">{prob.acceptanceRate}</span>
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border ${
                      prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {prob.difficulty}
                    </span>

                    <Link 
                      href={`/practice/${prob.id}`}
                      className="bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-cyber-border hover:border-cyan-500 text-slate-300 p-2 rounded-lg transition"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {filteredProblems.length === 0 && (
              <div className="text-center p-12 border border-dashed border-cyber-border rounded-xl">
                <p className="text-slate-500 text-sm">No problems match your selection criteria. Clear filters and try again.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

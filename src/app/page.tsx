'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Terminal, Trophy, Sparkles, Flame, CheckCircle, 
  ArrowRight, Users, Play, BookOpen, Clock, Heart, MessageSquare
} from 'lucide-react';
import { mockProblems, mockContests, mockDiscussions } from '../lib/data/mockData';

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const codePhrases = [
    'System.out.println("Hello World");',
    'print("Detecting compilation bugs...")',
    'std::cout << "Optimizing Call Stack..." << std::endl;',
    'console.log("Locating logical errors...");'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Typing effect loop
  useEffect(() => {
    const currentPhrase = codePhrases[phraseIndex];
    if (charIndex < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + currentPhrase.charAt(charIndex));
        setCharIndex(charIndex + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText('');
        setCharIndex(0);
        setPhraseIndex((phraseIndex + 1) % codePhrases.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, phraseIndex]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      
      {/* 1. Beautiful Hero Section */}
      <section className="relative rounded-2xl overflow-hidden glass-panel border border-cyber-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 glow-shadow-cyan">
        {/* Animated background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-30 pointer-events-none" />
        
        <div className="flex-1 space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1 rounded-full font-bold">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Next-Gen AI Debugger & IDE Live</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Stop Guessing Your <br />
            <span className="text-gradient-cyan-purple">Bugs & Code Errors</span>
          </h1>
          
          <p className="text-slate-300 text-base max-w-lg leading-relaxed">
            Paste broken snippets from any platform. Get line-by-line diagnostics, variable dry-runs, memory state animations, and 5 grades of production-ready fixes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/debugger" 
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg flex items-center space-x-2 transition shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch AI Debugger</span>
            </Link>
            
            <Link 
              href="/practice" 
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold border border-cyber-border hover:border-cyan-500/50 px-6 py-3 rounded-lg flex items-center space-x-2 transition active:scale-95"
            >
              <span>Practice Problems</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Code Editor Mockup Card */}
        <div className="flex-1 w-full md:max-w-md relative z-10">
          <div className="w-full bg-[#0d131f] border border-cyber-border rounded-xl shadow-2xl overflow-hidden font-mono text-sm">
            <div className="bg-[#131b2e] border-b border-cyber-border px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-3 w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-2 text-cyan-400">codebug_resolver.py</span>
              </div>
              <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded text-slate-400">AI Active</span>
            </div>
            
            <div className="p-5 min-h-[140px] text-slate-300 space-y-1 relative">
              <div className="text-slate-500 text-xs">// Automated Diagnostics Console</div>
              <div className="text-pink-400">def <span className="text-cyan-400">analyze_stack</span>(code):</div>
              <div className="text-slate-300 pl-4">{typedText}<span className="text-cyan-400 animate-pulse">|</span></div>
              
              <div className="mt-4 pt-4 border-t border-cyber-border flex items-start space-x-3 text-xs">
                <span className="bg-red-500/10 text-red-400 border border-red-500/25 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Bug Identified</span>
                <span className="text-slate-400">Stack overflow on infinite recursion edge case.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered Engineers', val: '240,000+', icon: Users, color: 'text-cyan-400' },
          { label: 'Problems Solved', val: '1.2M+', icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Bugs Terminated', val: '640k+', icon: Flame, color: 'text-rose-400' },
          { label: 'Contests Completed', val: '840+', icon: Trophy, color: 'text-yellow-400' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel border border-cyber-border p-5 rounded-xl flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-slate-900 border border-cyber-border ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{stat.val}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Daily Challenge & Dashboard Features Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Daily Challenge & Trending Problems */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-cyber-border pb-3">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span>Daily Practice Hub</span>
            </h2>
            <Link href="/practice" className="text-xs text-cyan-400 hover:underline">View All Problems →</Link>
          </div>

          {/* Daily Challenge Hero Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/20 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
                Daily Coding Challenge
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Expires in 14h 22m</span>
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Two Sum</h3>
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">
              Find indices of two numbers that add up to a targeted integer value. Optimized lookup maps required.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Easy</span>
                <span>XP: +50</span>
                <span>Coins: +10</span>
              </div>
              <Link 
                href="/practice/1" 
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded flex items-center space-x-1.5 transition active:scale-95"
              >
                <Play className="h-3 w-3 fill-slate-950" />
                <span>Solve Now</span>
              </Link>
            </div>
          </div>

          {/* Trending Problems List */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Trending Problems</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProblems.slice(1).map((prob) => (
                <Link
                  key={prob.id}
                  href={`/practice/${prob.id}`}
                  className="glass-panel glass-panel-hover border border-cyber-border p-4 rounded-xl block transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white group-hover:text-cyan-400 text-sm line-clamp-1">{prob.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                      prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{prob.category}</span>
                    <span>Acceptance: {prob.acceptanceRate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contests, Discussions, Top Coders */}
        <div className="space-y-8">
          {/* Contests Hub */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Contests Stream</span>
            </h2>
            <div className="space-y-3">
              {mockContests.slice(0, 2).map((contest) => (
                <div key={contest.id} className="glass-panel border border-cyber-border p-4 rounded-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-200">{contest.title}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      contest.status === 'Active' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {contest.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{contest.startTime}</span>
                    <span>{contest.registeredUsers} Coders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Learning roadmap advertisement */}
          <div className="border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-slate-900/60 rounded-xl p-5 space-y-3">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">Featured roadmap</span>
            <h4 className="font-extrabold text-white text-base">Full-Stack Engineering path</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step-by-step master track from zero database design up to micro-frontend architectures with automated tests.
            </p>
            <Link 
              href="/roadmaps" 
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center space-x-1"
            >
              <span>Explore Interactive Roadmap</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Top Discussions thread */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Trending Discussions</span>
            </h3>
            <div className="space-y-3">
              {mockDiscussions.slice(0, 2).map((disc) => (
                <Link
                  key={disc.id}
                  href="/discuss"
                  className="block glass-panel border border-cyber-border hover:border-slate-700 p-3 rounded-lg transition-all"
                >
                  <p className="text-xs font-semibold text-slate-200 line-clamp-2 hover:text-cyan-400 transition-colors">
                    {disc.title}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-500">
                    <span>Votes: {disc.votes}</span>
                    <span>Answers: {disc.answers}</span>
                    {disc.solved && <span className="text-emerald-400 font-bold">Solved</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { mockContests, Contest } from '../../lib/data/mockData';
import { 
  Trophy, Clock, Users, ArrowUpRight, Play, 
  Award, Sparkles, RefreshCw
} from 'lucide-react';

export default function ContestsPage() {
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  
  // Real-time counter simulation
  const [secondsLeft, setSecondsLeft] = useState(7200); // 2 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRegister = (title: string) => {
    alert(`Successfully registered for: ${title}! 🎉\nCheck your dashboard for the scheduled invite link.`);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span>Coding Contests Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compete in weekly algorithmic face-offs, track live scoreboards, and boost your worldwide ranking level.
          </p>
        </div>
      </div>

      {/* Hero: Active Live Contest Panel */}
      <div className="relative rounded-2xl overflow-hidden border border-red-500/25 bg-gradient-to-br from-red-950/20 to-slate-900/60 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10 flex-1">
          <div className="inline-flex items-center space-x-2 bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider animate-pulse">
            <span>Live Contest In Progress</span>
          </div>
          
          <h2 className="text-2xl font-black text-white">Weekly Cyber Code Clash #42</h2>
          <p className="text-slate-300 text-sm max-w-md">
            Complete 4 complex algorithmic optimization challenges in a secure race against 2,450 coders globally.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-cyan-400" />
              <span>2,450 competitors online</span>
            </span>
            <span className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>Up to +300 XP ratings</span>
            </span>
          </div>
        </div>

        {/* Real-time Timer visual block */}
        <div className="bg-[#0b0f19] border border-red-500/30 p-6 rounded-xl text-center relative z-10 w-full md:max-w-xs space-y-3">
          <span className="text-[10px] uppercase font-bold text-slate-500">Timer Count Down</span>
          <div className="text-3xl font-black text-red-400 font-mono tracking-widest">{formatTimer(secondsLeft)}</div>
          
          <button 
            onClick={() => alert('Launching active contest workspace! Loading problems...')}
            className="w-full bg-red-500 hover:bg-red-400 text-slate-950 font-black text-xs py-2.5 rounded-lg transition active:scale-95 cursor-pointer shadow-md shadow-red-500/20"
          >
            Enter Battle Arena
          </button>
        </div>
      </div>

      {/* Split: Upcoming Contests & Past Archives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upcoming Contests Catalog (Left Pane) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Scheduled Tournaments</h3>
          
          <div className="space-y-4">
            {mockContests.filter(c => c.status === 'Upcoming').map((contest) => (
              <div 
                key={contest.id}
                className="glass-panel border border-cyber-border hover:border-slate-700 p-5 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="space-y-2">
                  <h4 className="font-extrabold text-white text-base">{contest.title}</h4>
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{contest.startTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-3.5 w-3.5" />
                      <span>{contest.registeredUsers} Coders registered</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 font-semibold">{contest.duration}</span>
                  <button
                    onClick={() => handleRegister(contest.title)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition active:scale-95"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Archives (Right Pane) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Leaderboard Archive</h3>
          
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-5 space-y-4">
            <div className="border-b border-cyber-border/40 pb-3">
              <h4 className="font-bold text-slate-200 text-xs">Past Contest Clash #41 Rankings</h4>
            </div>

            <div className="space-y-3">
              {[
                { rank: 1, name: 'algo_sorcerer', solved: '4/4', time: '42m' },
                { rank: 2, name: 'heap_overflow_4', solved: '4/4', time: '55m' },
                { rank: 3, name: 'const_char_pointer', solved: '4/4', time: '1h 04m' }
              ].map((coder) => (
                <div key={coder.rank} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`h-5 w-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                      coder.rank === 1 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      coder.rank === 2 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                      'bg-amber-600/10 text-amber-500 border border-amber-600/20'
                    }`}>{coder.rank}</span>
                    <span className="text-slate-300 font-semibold">{coder.name}</span>
                  </div>
                  <span className="text-slate-500">{coder.solved} solved ({coder.time})</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => alert('Loading past contest index list...')}
              className="w-full bg-slate-900 border border-cyber-border hover:border-slate-800 text-slate-300 text-xs py-2 rounded transition active:scale-95"
            >
              View Historical Scoreboards
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { insforge } from '../../lib/insforge';
import { 
  Trophy, Medal, Flame, Star, Award, User, 
  Crown, ArrowUpRight, ShieldCheck, Sparkles 
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  streak: number;
  level: number;
  solvedCount: number;
}

const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: '1', name: 'Manoj N (Admin)', xp: 2450, streak: 15, level: 8, solvedCount: 42 },
  { rank: 2, id: '2', name: 'Sarah Jenkins', xp: 2180, streak: 12, level: 7, solvedCount: 38 },
  { rank: 3, id: '3', name: 'Alex Rivera', xp: 1940, streak: 10, level: 6, solvedCount: 31 },
  { rank: 4, id: '4', name: 'Chen Wei', xp: 1720, streak: 8, level: 5, solvedCount: 27 },
  { rank: 5, id: '5', name: 'Emily Davis', xp: 1510, streak: 7, level: 5, solvedCount: 23 },
  { rank: 6, id: '6', name: 'David Kim', xp: 1340, streak: 5, level: 4, solvedCount: 19 },
  { rank: 7, id: '7', name: 'Priya Sharma', xp: 1150, streak: 4, level: 4, solvedCount: 16 },
  { rank: 8, id: '8', name: 'Lucas Rossi', xp: 980, streak: 3, level: 3, solvedCount: 14 }
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>(mockLeaderboard);

  useEffect(() => {
    async function loadGlobalStats() {
      const { data } = await insforge.database
        .from('user_stats')
        .select('*')
        .order('xp', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        const formatted: LeaderboardUser[] = data.map((item: any, idx: number) => ({
          rank: idx + 1,
          id: item.id || item.user_id,
          name: item.name || 'Anonymous Coder',
          xp: item.xp || 1000,
          streak: item.streak || 1,
          level: item.level || 1,
          solvedCount: Array.isArray(item.solved_ids) ? item.solved_ids.length : 0
        }));
        setLeaders(formatted);
      }
    }
    loadGlobalStats();
  }, []);

  const topThree = leaders.slice(0, 3);
  const remaining = leaders.slice(3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" /> Global Coding Arena & Rankings
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            CodeBug Hall of Fame
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Compete with top algorithm programmers worldwide. Earn XP points by solving problems and maintaining daily streaks.
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden order-2 md:order-1 transform hover:-translate-y-1 transition-all">
            <div className="absolute top-3 right-3 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              #2 SILVER
            </div>
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 p-1 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-slate-400/20">
              {topThree[1].name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{topThree[1].name}</h3>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{topThree[1].xp} XP</p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5" /> {topThree[1].streak}d</span>
              <span>Lvl {topThree[1].level}</span>
            </div>
          </div>
        )}

        {/* 1st Place GOLD */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-amber-500/10 via-slate-900/80 to-slate-900/60 border border-amber-500/30 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden order-1 md:order-2 transform -translate-y-2 hover:-translate-y-3 transition-all shadow-xl shadow-amber-500/10">
            <div className="absolute top-3 right-3 text-xs font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> #1 GOLD
            </div>
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-1 flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-amber-400/30">
              {topThree[0].name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{topThree[0].name}</h3>
              <p className="text-sm text-amber-400 font-bold mt-0.5">{topThree[0].xp} XP</p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-300 border-t border-amber-500/20 pt-3">
              <span className="flex items-center gap-1 text-amber-400 font-bold"><Flame className="w-3.5 h-3.5 fill-amber-400" /> {topThree[0].streak}d Streak</span>
              <span className="text-cyan-400 font-bold">Lvl {topThree[0].level}</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden order-3 transform hover:-translate-y-1 transition-all">
            <div className="absolute top-3 right-3 text-xs font-bold text-amber-600 bg-slate-800 px-2 py-0.5 rounded">
              #3 BRONZE
            </div>
            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 p-1 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-amber-700/20">
              {topThree[2].name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{topThree[2].name}</h3>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{topThree[2].xp} XP</p>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5" /> {topThree[2].streak}d</span>
              <span>Lvl {topThree[2].level}</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-bold uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Coder</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Streak</th>
              <th className="px-6 py-4">Solved</th>
              <th className="px-6 py-4 text-right">XP Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {leaders.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    user.rank === 1 ? 'bg-amber-400 text-slate-950' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {user.rank}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
                    Lvl {user.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" /> {user.streak} days
                </td>
                <td className="px-6 py-4 text-slate-300 font-bold">
                  {user.solvedCount} problems
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-cyan-400">
                  {user.xp.toLocaleString()} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { useAppStore } from '../../lib/store';
import { insforge } from '../../lib/insforge';
import { 
  User as UserIcon, Award, Flame, Star, Coins, CheckCircle, 
  Calendar, Clock, Edit, Save, Shield, Settings, Info
} from 'lucide-react';

interface ActivityLog {
  id: string;
  problem_title: string;
  status: string;
  language: string;
  time: string;
}

export default function ProfilePage() {
  const { user, profile, updateProfileStats, refreshProfile } = useAuth();
  const { userStats } = useAppStore();

  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Load profile values on startup
  useEffect(() => {
    if (profile) {
      setName(profile.name || user?.email?.split('@')[0] || 'Coder');
    }
  }, [profile, user]);

  // Load recent submission activity from database
  useEffect(() => {
    async function loadActivities() {
      if (!user?.id) return;
      const { data } = await insforge.database
        .from('submissions')
        .select('*, problems(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        const formatted: ActivityLog[] = data.map((item: any) => ({
          id: item.id,
          problem_title: item.problems?.title || `Problem ${item.problem_id}`,
          status: item.status,
          language: item.language,
          time: new Date(item.created_at || Date.now()).toLocaleDateString()
        }));
        setActivities(formatted);
      }
    }
    loadActivities();
  }, [user?.id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Save updated name to database user_stats
    await updateProfileStats({
      name: name
    });

    setSaving(false);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const heatmapBlocks = Array.from({ length: 154 }, (_, idx) => {
    let intensity = 0;
    if (idx % 7 === 0 || idx % 11 === 0) intensity = 3;
    else if (idx % 3 === 0) intensity = 1;
    else if (idx % 5 === 0) intensity = 2;
    return { id: idx, intensity };
  });

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* 1. Header Profile Card */}
      <div className="glass-panel border border-cyber-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5 pointer-events-none" />
        
        {/* Left Side: Avatar & Editable Username */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
          <div className="h-20 w-20 rounded-full bg-gradient-cyber p-1 glow-shadow-purple">
            <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center text-3xl font-black text-white">
              {name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="text-center sm:text-left space-y-2">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900 border border-cyber-border text-white text-lg font-bold px-3 py-1 rounded focus:outline-none focus:border-cyan-500"
                  required
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="p-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  <Save className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-slate-500 hover:text-white transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 font-mono">Email: {user?.email || 'Guest Session'}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Professional Developer
              </span>
              {profile?.level && profile.level > 3 && (
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Shield className="w-3 h-3" /> DSA Grandmaster
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Metrics Summary */}
        <div className="grid grid-cols-3 gap-6 text-center divide-x divide-cyber-border/40 relative z-10">
          <div className="px-4">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Streak</span>
            <span className="text-xl font-bold text-amber-500 flex items-center justify-center space-x-1">
              <Flame className="h-4.5 w-4.5 fill-amber-500 animate-pulse" />
              <span>{profile?.streak || userStats.streak}d</span>
            </span>
          </div>
          <div className="px-4">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Level</span>
            <span className="text-xl font-bold text-cyan-400 flex items-center justify-center space-x-1">
              <Star className="h-4.5 w-4.5 fill-cyan-400" />
              <span>Lvl {profile?.level || userStats.level}</span>
            </span>
          </div>
          <div className="px-4">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">XP Balance</span>
            <span className="text-xl font-bold text-slate-200">{profile?.xp || userStats.xp}</span>
          </div>
        </div>
      </div>

      {/* 2. Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Stats Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Solved Problems Count */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>DSA Problem Solving Metrics</span>
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-emerald-400">Easy ({(profile?.solved_ids || userStats.solvedIds).length} Solved)</span>
                  <span className="text-slate-400">Target: 10</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-cyber-border">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((((profile?.solved_ids || userStats.solvedIds).length) / 10) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-400">Medium ({userStats.solvedStats.medium} Solved)</span>
                  <span className="text-slate-400">Target: 10</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-cyber-border">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${(userStats.solvedStats.medium / 10) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Unlocked Badges */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-400" />
              <span>Earned Achievements & Badges</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {(profile?.badges || userStats.badges).map((badge, idx) => (
                <div key={idx} className="p-3 bg-slate-900 border border-cyber-border/60 rounded-lg flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-200">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Activity Heatmap */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>DSA Practice Heatmap Calendar</span>
            </h3>
            
            <div className="p-3 bg-slate-950 border border-cyber-border rounded-lg overflow-x-auto">
              <div className="grid grid-flow-col grid-rows-7 gap-1 w-[450px]">
                {heatmapBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`h-2.5 w-2.5 rounded-sm transition ${
                      block.intensity === 0 ? 'bg-slate-900 border border-slate-800' :
                      block.intensity === 1 ? 'bg-emerald-900' :
                      block.intensity === 2 ? 'bg-emerald-600' : 'bg-emerald-400'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-cyber-border/40">
                <span>Less</span>
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-sm bg-slate-900 border border-slate-800" />
                  <span className="h-2 w-2 rounded-sm bg-emerald-900" />
                  <span className="h-2 w-2 rounded-sm bg-emerald-600" />
                  <span className="h-2 w-2 rounded-sm bg-emerald-400" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Recent Submissions Activity */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Recent Submissions Log</span>
            </h3>
            
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3">No recent submissions found.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex justify-between items-center text-xs p-3 bg-slate-900 border border-cyber-border/40 rounded-lg">
                    <div className="space-y-1">
                      <span className="text-slate-200 font-bold">{act.problem_title}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({act.language.toUpperCase()})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        act.status === 'Accepted'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {act.status}
                      </span>
                      <span className="text-slate-500 text-[10px]">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

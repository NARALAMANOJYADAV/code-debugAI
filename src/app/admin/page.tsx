'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { insforge } from '../../lib/insforge';
import { Problem } from '../../lib/data/mockData';
import { 
  ShieldAlert, Users, Cpu, Activity, Server, Zap, Plus,
  Search, Filter, CheckCircle2, AlertTriangle, RefreshCw, 
  BarChart2, Edit, Trash2, Code, Shield, Key, ToggleLeft, ToggleRight
} from 'lucide-react';

interface UserRecord {
  user_id: string;
  name: string;
  xp: number;
  coins: number;
  streak: number;
  level: number;
  badges: string[];
  solved_ids: number[];
  status?: string;
  email?: string;
}

interface SubmissionRecord {
  id: string;
  problem_id: number;
  user_id: string;
  status: string;
  language: string;
  execution_time_ms: number;
  memory_mb: number;
  code: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, isAdmin, signIn } = useAuth();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'problems' | 'submissions'>('dashboard');

  // Problems States
  const [problems, setProblems] = useState<any[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [editingProblem, setEditingProblem] = useState<any | null>(null);
  const [showProblemForm, setShowProblemForm] = useState(false);

  // New problem form fields
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('Arrays');
  const [pDifficulty, setPDifficulty] = useState('Easy');
  const [pDescription, setPDescription] = useState('');
  const [pAcceptance, setPAcceptance] = useState('75%');
  const [pExamples, setPExamples] = useState('[{"id": 1, "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}]');
  const [pConstraints, setPConstraints] = useState('["2 <= nums.length <= 10^4"]');
  const [pTemplates, setPTemplates] = useState('{"python": "def solve(nums, target):\\n    return []"}');

  // Users States
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [uName, setUName] = useState('');
  const [uXp, setUXp] = useState(100);
  const [uCoins, setUCoins] = useState(10);
  const [uLevel, setULevel] = useState(1);

  // Submissions States
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // General Telemetry
  const [telemetry, setTelemetry] = useState({
    usersCount: 0,
    problemsCount: 0,
    submissionsCount: 0,
    activeNodes: 8,
    sandboxLoad: '2.4%'
  });

  // Load telemetry stats
  const loadTelemetry = async () => {
    try {
      const { data: uData } = await insforge.database.from('user_stats').select('user_id');
      const { data: pData } = await insforge.database.from('problems').select('id');
      const { data: sData } = await insforge.database.from('submissions').select('id');
      
      setTelemetry({
        usersCount: uData?.length || 0,
        problemsCount: pData?.length || 0,
        submissionsCount: sData?.length || 0,
        activeNodes: 8,
        sandboxLoad: '1.8%'
      });
    } catch (e) {
      console.warn('Failed to load telemetry details:', e);
    }
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  // Fetch Problems
  const fetchProblems = async () => {
    setLoadingProblems(true);
    const { data } = await insforge.database.from('problems').select('*').order('id', { ascending: true });
    if (data) setProblems(data);
    setLoadingProblems(false);
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const { data } = await insforge.database.from('user_stats').select('*');
    if (data) setUsers(data);
    setLoadingUsers(false);
  };

  // Fetch Submissions
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    const { data } = await insforge.database.from('submissions').select('*').order('created_at', { ascending: false });
    if (data) setSubmissions(data);
    setLoadingSubmissions(false);
  };

  useEffect(() => {
    if (activeTab === 'problems') fetchProblems();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'submissions') fetchSubmissions();
  }, [activeTab]);

  // Admin Quick Login Bypass Helper
  const handleQuickLogin = async () => {
    await signIn({
      email: 'manojnarala245@gmail.com',
      password: 'manoj@123'
    });
  };

  // Add/Update Problem
  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: pTitle,
      category: pCategory,
      difficulty: pDifficulty,
      description: pDescription,
      acceptance_rate: pAcceptance,
      examples: JSON.parse(pExamples),
      constraints: JSON.parse(pConstraints),
      code_templates: JSON.parse(pTemplates)
    };

    if (editingProblem) {
      const { error } = await insforge.database
        .from('problems')
        .update(payload)
        .eq('id', editingProblem.id);
      if (!error) {
        alert('Problem updated successfully!');
        setEditingProblem(null);
        setShowProblemForm(false);
        fetchProblems();
      } else {
        alert('Error updating problem: ' + error.message);
      }
    } else {
      const { error } = await insforge.database
        .from('problems')
        .insert([payload]);
      if (!error) {
        alert('Problem created successfully!');
        setShowProblemForm(false);
        fetchProblems();
      } else {
        alert('Error creating problem: ' + error.message);
      }
    }
  };

  // Edit Problem Trigger
  const startEditProblem = (prob: any) => {
    setEditingProblem(prob);
    setPTitle(prob.title);
    setPCategory(prob.category);
    setPDifficulty(prob.difficulty);
    setPDescription(prob.description);
    setPAcceptance(prob.acceptance_rate || '70%');
    setPExamples(JSON.stringify(prob.examples || []));
    setPConstraints(JSON.stringify(prob.constraints || []));
    setPTemplates(JSON.stringify(prob.code_templates || {}));
    setShowProblemForm(true);
  };

  // Delete Problem
  const handleDeleteProblem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    const { error } = await insforge.database.from('problems').delete().eq('id', id);
    if (!error) {
      alert('Problem deleted successfully!');
      fetchProblems();
    }
  };

  // Add/Update User Stats
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: uName,
      xp: Number(uXp),
      coins: Number(uCoins),
      level: Number(uLevel)
    };

    if (editingUser) {
      const { error } = await insforge.database
        .from('user_stats')
        .update(payload)
        .eq('user_id', editingUser.user_id);
      if (!error) {
        alert('User details updated successfully!');
        setEditingUser(null);
        setShowUserForm(false);
        fetchUsers();
      }
    }
  };

  const startEditUser = (record: UserRecord) => {
    setEditingUser(record);
    setUName(record.name || 'User');
    setUXp(record.xp || 100);
    setUCoins(record.coins || 10);
    setULevel(record.level || 1);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove stats for this user?')) return;
    await insforge.database.from('user_stats').delete().eq('user_id', userId);
    fetchUsers();
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission log?')) return;
    await insforge.database.from('submissions').delete().eq('id', id);
    fetchSubmissions();
  };

  // Access Control Screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-extrabold text-white">Access Control Denied</h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          You must be logged in as an Administrator to access administrative commands, database configurations, and compiler metrics.
        </p>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-left text-xs font-mono text-cyan-400">
          <div className="font-bold text-slate-300">Admin Account Info:</div>
          <div>Email: manojnarala245@gmail.com</div>
          <div>Pass: manoj@123</div>
        </div>

        <button
          onClick={handleQuickLogin}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Key className="w-4 h-4" /> Log In as Administrator
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Panel */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" /> Administrative Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Live operations, database synchronization, problem creation catalog, and user metrics configuration.
          </p>
        </div>

        <button 
          onClick={loadTelemetry}
          className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        {[
          { id: 'dashboard', label: 'Telemetry Overview' },
          { id: 'users', label: 'User Directories' },
          { id: 'problems', label: 'Problem Catalog' },
          { id: 'submissions', label: 'Live Submissions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition ${
              activeTab === tab.id 
                ? 'border-purple-500 text-purple-400 font-black' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Telemetry Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold block">TOTAL USERS</span>
              <p className="text-2xl font-black text-white">{telemetry.usersCount}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold block">PRACTICE PROBLEMS</span>
              <p className="text-2xl font-black text-white">{telemetry.problemsCount}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold block">TOTAL SUBMISSIONS</span>
              <p className="text-2xl font-black text-white">{telemetry.submissionsCount}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold block">CLUSTER NODE INSTANCES</span>
              <p className="text-2xl font-black text-emerald-400">Optimal ({telemetry.activeNodes} Nodes)</p>
            </div>
          </div>

          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-200">Database & System Live Health</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">API Latency</span>
                <span className="text-xs font-mono text-cyan-400">45ms</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">InsForge DB Connection</span>
                <span className="text-xs font-mono text-emerald-400">Connected</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Daily CPU Load</span>
                <span className="text-xs font-mono text-purple-400">{telemetry.sandboxLoad}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. User Directory */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Users List & Stats Management</h2>
          </div>

          {showUserForm && (
            <form onSubmit={handleSaveUser} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 max-w-lg">
              <h3 className="font-bold text-sm text-white">Edit User Stats ({editingUser?.user_id})</h3>
              
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Name</label>
                <input
                  type="text"
                  value={uName}
                  onChange={(e) => setUName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">XP</label>
                  <input
                    type="number"
                    value={uXp}
                    onChange={(e) => setUXp(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Coins</label>
                  <input
                    type="number"
                    value={uCoins}
                    onChange={(e) => setUCoins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Level</label>
                  <input
                    type="number"
                    value={uLevel}
                    onChange={(e) => setULevel(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUserForm(false)}
                  className="px-4 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-purple-600 text-white text-xs font-bold"
                >
                  Save Stats
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden">
            {loadingUsers ? (
              <p className="p-6 text-center text-xs text-slate-500">Loading user directories...</p>
            ) : (
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Profile Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">XP Score</th>
                    <th className="p-3">Coins</th>
                    <th className="p-3">Daily Streak</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {users.map(u => (
                    <tr key={u.user_id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-mono text-[10px] text-slate-500">{u.user_id}</td>
                      <td className="p-3 text-white font-bold">{u.name || 'Anonymous User'}</td>
                      <td className="p-3">Lvl {u.level}</td>
                      <td className="p-3 font-mono">{u.xp} XP</td>
                      <td className="p-3 font-mono">{u.coins}</td>
                      <td className="p-3">{u.streak} days</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => startEditUser(u)}
                          className="p-1 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.user_id)}
                          className="p-1 rounded border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 3. Problems Catalog */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Algorithmic Problem Catalog Management</h2>
            <button
              onClick={() => {
                setEditingProblem(null);
                setPTitle('');
                setPDescription('');
                setShowProblemForm(!showProblemForm);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Problem
            </button>
          </div>

          {showProblemForm && (
            <form onSubmit={handleSaveProblem} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 max-w-3xl">
              <h3 className="font-bold text-sm text-white">
                {editingProblem ? 'Edit Problem details' : 'Add New Algorithmic Problem'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Problem Title</label>
                  <input
                    type="text"
                    value={pTitle}
                    onChange={(e) => setPTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Category</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white"
                    >
                      <option value="Arrays">Arrays</option>
                      <option value="Stack">Stack</option>
                      <option value="Sliding Window">Sliding Window</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                      <option value="Math">Math</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Difficulty</label>
                    <select
                      value={pDifficulty}
                      onChange={(e) => setPDifficulty(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Acceptance</label>
                    <input
                      type="text"
                      value={pAcceptance}
                      onChange={(e) => setPAcceptance(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Problem Description</label>
                <textarea
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white h-24 font-sans resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Examples (JSON string)</label>
                  <textarea
                    value={pExamples}
                    onChange={(e) => setPExamples(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-[11px] text-yellow-500 h-20 font-mono resize-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Constraints (JSON string)</label>
                  <textarea
                    value={pConstraints}
                    onChange={(e) => setPConstraints(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-[11px] text-yellow-500 h-20 font-mono resize-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Code Templates (JSON string)</label>
                  <textarea
                    value={pTemplates}
                    onChange={(e) => setPTemplates(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-[11px] text-yellow-500 h-20 font-mono resize-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemForm(false)}
                  className="px-4 py-1.5 rounded bg-slate-850 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-purple-600 text-white text-xs font-bold"
                >
                  {editingProblem ? 'Update Problem' : 'Create Problem'}
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden">
            {loadingProblems ? (
              <p className="p-6 text-center text-xs text-slate-500">Loading catalog items...</p>
            ) : (
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Acceptance</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {problems.map(p => (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-mono">{p.id}</td>
                      <td className="p-3 text-white font-bold">{p.title}</td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                          p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                          p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400">{p.acceptance_rate || '70%'}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => startEditProblem(p)}
                          className="p-1 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(p.id)}
                          className="p-1 rounded border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 4. Live Submissions */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Live Evaluator Submissions Logs</h2>
          </div>

          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden">
            {loadingSubmissions ? (
              <p className="p-6 text-center text-xs text-slate-500">Loading live logs...</p>
            ) : (
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Problem ID</th>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Lang</th>
                    <th className="p-3">Runtime</th>
                    <th className="p-3">Memory</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {submissions.map(s => (
                    <tr key={s.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-mono text-[10px] text-slate-500">{s.id}</td>
                      <td className="p-3">Problem {s.problem_id}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{s.user_id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                          s.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-cyan-400 uppercase">{s.language}</td>
                      <td className="p-3 font-mono">{s.execution_time_ms} ms</td>
                      <td className="p-3 font-mono">{s.memory_mb} MB</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSubmission(s.id)}
                          className="p-1 rounded border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-500 italic">
                        No submissions recorded in the database telemetry yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

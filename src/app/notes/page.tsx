'use client';

import React, { useState } from 'react';
import { 
  Clipboard, Plus, Trash2, Edit3, Save, Search, 
  Tag, Sparkles, BookOpen, Code, FileText, CheckCircle
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  codeSnippet?: string;
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Two Pointers Pattern for Array Problems',
    category: 'Algorithms',
    date: '2026-07-20',
    content: 'Use left and right pointers when working on sorted arrays or searching pair sums to reduce O(N^2) brute force to O(N).',
    codeSnippet: `def two_sum(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        curr = nums[left] + nums[right]\n        if curr == target: return [left, right]\n        elif curr < target: left += 1\n        else: right -= 1`
  },
  {
    id: '2',
    title: 'Fast & Slow Pointer (Floyd Cycle Detection)',
    category: 'Linked List',
    date: '2026-07-21',
    content: 'Advance slow pointer 1 step and fast pointer 2 steps. If there is a cycle, fast will eventually meet slow inside the loop.',
    codeSnippet: `def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False`
  },
  {
    id: '3',
    title: 'System Design: Consistency vs Availability (CAP Theorem)',
    category: 'System Design',
    date: '2026-07-22',
    content: 'In distributed systems under network partition (P), you must choose between Consistency (all nodes see same data) or Availability (every request gets a response).',
  }
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(initialNotes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Note state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Algorithms');
  const [newContent, setNewContent] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.category.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Note = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      content: newContent,
      codeSnippet: newSnippet || undefined,
      date: new Date().toISOString().split('T')[0]
    };

    setNotes([created, ...notes]);
    setActiveNote(created);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
    setNewSnippet('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (activeNote?.id === id) {
      setActiveNote(updated[0] || null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <Clipboard className="w-3.5 h-3.5" /> Personal Knowledge Base & DSA Cheatsheets
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Study Notes & Code Snippets
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Save algorithm cheat sheets, interview revision notes, and code snippets in your secure cloud workspace.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Note
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Notes List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search notes or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {note.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{note.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate">{note.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{note.content}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Viewer / Detail */}
        <div className="lg:col-span-7">
          {activeNote ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-medium text-cyan-400">{activeNote.category} Note</span>
                  <h2 className="text-xl font-bold text-white mt-1">{activeNote.title}</h2>
                </div>
                <button 
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-xs flex items-center gap-1.5 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {activeNote.content}
                </p>

                {activeNote.codeSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Code className="w-4 h-4 text-cyan-400" /> Attached Code Snippet
                    </div>
                    <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      <code>{activeNote.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Select or create a note to start writing.
            </div>
          )}
        </div>

      </div>

      {/* New Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Create New Study Note</h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binary Search Boundary Logic"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="Algorithms">Algorithms</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="System Design">System Design</option>
                  <option value="React & Frontend">React & Frontend</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Note Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your study notes here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="// Optional Python or JS code block"
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

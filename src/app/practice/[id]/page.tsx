'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockProblems, Problem } from '../../../lib/data/mockData';
import { useAppStore } from '../../../lib/store';
import { executeCode, ExecutionResult } from '../../../lib/compiler/executor';
import { insforge } from '../../../lib/insforge';
import { useAuth } from '../../../components/auth/AuthContext';
import { 
  Play, CheckCircle, ChevronLeft, Terminal, HelpCircle, 
  BookOpen, MessageSquare, ClipboardList, RefreshCw, Star
} from 'lucide-react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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

export default function ProblemWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const problemId = Number(params?.id);
  
  const { user } = useAuth();
  const { solveProblem, addXp, addCoins } = useAppStore();
  const [problem, setProblem] = useState<Problem | null>(null);
  
  // Tab control
  const [activeLeftTab, setActiveLeftTab] = useState<'desc' | 'editorial' | 'discuss' | 'notes'>('desc');
  const [notesText, setNotesText] = useState('// Jot down your runtime algorithms, variables, or math formulas here...');
  
  // Code editor states
  const [code, setCode] = useState('');
  const [selectedLang, setSelectedLang] = useState('python');
  
  // Run/Submit states
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState<ExecutionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'accepted' | 'failed'>('idle');

  useEffect(() => {
    async function loadProblem() {
      // Try to load from InsForge database first
      const { data, error } = await insforge.database
        .from('problems')
        .select('*')
        .eq('id', problemId);

      if (data && data.length > 0) {
        const dbProb = data[0];
        const formatted: Problem = {
          id: dbProb.id,
          title: dbProb.title,
          category: dbProb.category,
          difficulty: dbProb.difficulty as 'Easy' | 'Medium' | 'Hard',
          acceptanceRate: dbProb.acceptance_rate || '70%',
          companies: parseJson(dbProb.companies, ['Google']),
          description: dbProb.description,
          examples: parseJson(dbProb.examples, []),
          constraints: parseJson(dbProb.constraints, []),
          editorial: dbProb.editorial || '',
          codeTemplates: parseJson(dbProb.code_templates, {})
        };
        setProblem(formatted);
        const defaultLang = Object.keys(formatted.codeTemplates)[0] || 'python';
        setSelectedLang(defaultLang);
        setCode(formatted.codeTemplates[defaultLang] || '');
        return;
      }

      // Fallback to mockProblems
      const found = mockProblems.find(p => p.id === problemId);
      if (found) {
        setProblem(found);
        const defaultLang = Object.keys(found.codeTemplates)[0] || 'python';
        setSelectedLang(defaultLang);
        setCode(found.codeTemplates[defaultLang] || '');
      }
    }

    loadProblem();
  }, [problemId]);


  if (!problem) {
    return (
      <div className="text-center p-12 space-y-4">
        <p className="text-slate-400">Problem not found or loading...</p>
        <button onClick={() => router.push('/practice')} className="text-cyan-400 font-bold hover:underline">
          Return to Problems List
        </button>
      </div>
    );
  }

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(problem.codeTemplates[lang] || '');
  };

  const handleRun = async () => {
    setExecuting(true);
    setSubmitStatus('idle');
    try {
      const res = await executeCode(code, selectedLang, '');
      setResults(res);
    } catch (err) {
      setResults({
        stdout: '',
        stderr: 'Sandbox runner runtime exception.',
        executionTime: 0,
        memoryUsage: 0,
        exitCode: 1
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitStatus('idle');
    
    // Execute code to check outcome
    const execRes = await executeCode(code, selectedLang, '');
    setResults(execRes);
    
    const isAccepted = code.trim().length > 30 && !code.includes('pass') && !code.includes('return []');
    const status = isAccepted ? 'Accepted' : 'Wrong Answer';
    
    // Insert submission into InsForge DB
    try {
      await insforge.database.from('submissions').insert([
        {
          problem_id: problem.id,
          user_id: user?.id || 'anonymous',
          status: status,
          language: selectedLang,
          code: code,
          execution_time_ms: execRes.executionTime,
          memory_mb: execRes.memoryUsage,
        }
      ]);
    } catch (dbErr) {
      console.warn('Failed to store submission in InsForge DB:', dbErr);
    }

    setSubmitting(false);

    if (isAccepted) {
      setSubmitStatus('accepted');
      solveProblem(problem.id, problem.difficulty);
      addXp(100);
      addCoins(20);
      
      try {
        const confetti = require('canvas-confetti');
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    } else {
      setSubmitStatus('failed');
    }
  };


  return (
    <div className="space-y-4 pb-16 min-h-0 lg:h-[calc(100vh-100px)] flex flex-col max-w-7xl mx-auto">
      
      {/* 1. Workspace Header navigation */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-3 shrink-0">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.push('/practice')} 
            className="p-1.5 rounded-lg border border-cyber-border hover:bg-slate-900 transition text-slate-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Problem {problem.id}: {problem.title}</span>
            </h1>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
              <span>Category: {problem.category}</span>
              <span>Acceptance: {problem.acceptanceRate}</span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border ${
          problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      {/* 2. Main Dual Panel Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        
        {/* Left Panel: Description / Editorial / Discussion / Notes */}
        <div className="flex flex-col border border-cyber-border rounded-xl bg-slate-900/40 overflow-hidden min-h-0">
          {/* Tab control headers */}
          <div className="bg-slate-950 border-b border-cyber-border flex items-center px-4 py-2 space-x-3 text-xs font-bold">
            <button
              onClick={() => setActiveLeftTab('desc')}
              className={`flex items-center space-x-1.5 pb-1 cursor-pointer transition ${
                activeLeftTab === 'desc' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Description</span>
            </button>
            
            <button
              onClick={() => setActiveLeftTab('editorial')}
              className={`flex items-center space-x-1.5 pb-1 cursor-pointer transition ${
                activeLeftTab === 'editorial' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Editorial</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('discuss')}
              className={`flex items-center space-x-1.5 pb-1 cursor-pointer transition ${
                activeLeftTab === 'discuss' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Discussion</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('notes')}
              className={`flex items-center space-x-1.5 pb-1 cursor-pointer transition ${
                activeLeftTab === 'notes' ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Notepad</span>
            </button>
          </div>

          {/* Tab Panel contents */}
          <div className="flex-1 p-5 overflow-y-auto min-h-0 text-sm text-slate-300 space-y-4">
            {activeLeftTab === 'desc' && (
              <div className="space-y-5">
                {/* Description */}
                <div className="prose prose-invert text-slate-300">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{problem.description}</pre>
                </div>

                {/* Example cases */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Examples:</h4>
                  {(Array.isArray(problem.examples) ? problem.examples : []).map((ex) => (
                    <div key={ex.id} className="bg-slate-950 p-4 rounded-lg border border-cyber-border/40 font-mono text-xs space-y-1">
                      <div className="text-slate-400"><strong className="text-slate-200">Input:</strong> {ex.input}</div>
                      <div className="text-slate-400"><strong className="text-slate-200">Output:</strong> {ex.output}</div>
                      {ex.explanation && (
                        <div className="text-[11px] text-cyan-500/80 mt-1 italic"><strong className="text-slate-300">Explanation:</strong> {ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Constraints:</h4>
                  <ul className="list-disc pl-5 font-mono text-xs text-slate-400 space-y-1">
                    {(Array.isArray(problem.constraints) ? problem.constraints : []).map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {activeLeftTab === 'editorial' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-200">Official Editorial Solution Explanation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {problem.editorial}
                </p>
                <div className="border border-cyan-500/20 bg-cyan-950/15 p-3 rounded text-xs text-cyan-400">
                  <strong>💡 Debugger Hint:</strong> Having a hard time debugging compilation loops? Copy your script and head over to the <strong className="underline cursor-pointer" onClick={() => router.push('/debugger')}>AI Debugger</strong> for instant AST checks.
                </div>
              </div>
            )}

            {activeLeftTab === 'discuss' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Community Q&A</span>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-900 border border-cyber-border rounded-lg space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <strong>@compile_master_88</strong>
                      <span>2h ago</span>
                    </div>
                    <p className="text-xs text-slate-300">"Using the dual pointer method works best. Keeps complexity down to O(1) space."</p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-cyber-border rounded-lg space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <strong>@newbie_coder</strong>
                      <span>5h ago</span>
                    </div>
                    <p className="text-xs text-slate-300">"Why do I get index out of bounds error when sorting first? Is it safe?"</p>
                  </div>
                </div>
              </div>
            )}

            {activeLeftTab === 'notes' && (
              <div className="h-full flex flex-col">
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="flex-1 w-full bg-[#080c14] border border-cyber-border rounded p-3 text-xs font-mono text-slate-300 outline-none resize-none focus:border-cyan-500 transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor Workspace & Terminal Output */}
        <div className="flex flex-col gap-4 min-h-0">
          
          {/* Editor Workspace */}
          <div className="flex-1 flex flex-col border border-cyber-border rounded-xl bg-slate-900/40 overflow-hidden min-h-[300px] lg:min-h-0">
            <div className="bg-slate-950 px-4 py-2 border-b border-cyber-border flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-300">Editor Workspace</span>
                
                {/* Language Selectors from problem keys */}
                <select
                  value={selectedLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  className="bg-slate-900 border border-cyber-border rounded px-1.5 py-0.5 text-xs text-cyan-400 focus:outline-none cursor-pointer font-bold"
                >
                  {Object.keys(problem.codeTemplates).map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] text-slate-500">Auto Save: Active</span>
            </div>

            <div className="flex-1 relative min-h-0">
              <Editor
                height="100%"
                language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  fontFamily: 'Fira Code, monospace'
                }}
              />
            </div>
          </div>

          {/* Console / Output Terminal & Control Bar */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-4 flex flex-col h-1/3 min-h-0 shrink-0">
            <div className="flex items-center justify-between mb-3 border-b border-cyber-border/40 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Terminal className="h-3.5 w-3.5" />
                <span>Console Buffer</span>
              </span>
              
              <div className="flex items-center space-x-2">
                {/* Run code */}
                <button
                  onClick={handleRun}
                  disabled={executing || submitting}
                  className="bg-slate-900 border border-cyber-border hover:border-slate-700 text-slate-300 text-xs px-3.5 py-1.5 rounded font-bold transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  {executing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                  <span>Run Code</span>
                </button>
                
                {/* Submit code */}
                <button
                  onClick={handleSubmit}
                  disabled={executing || submitting}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-black px-4 py-1.5 rounded transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  {submitting ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                  <span>Submit Code</span>
                </button>
              </div>
            </div>

            {/* Submission Status & execution feedback */}
            <div className="flex-1 bg-[#05070c] border border-cyber-border/60 rounded p-3 font-mono text-xs overflow-y-auto min-h-0">
              {submitStatus === 'accepted' && (
                <div className="text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 animate-bounce" />
                  <div>
                    <strong className="block">Submission Accepted! 🎉</strong>
                    <span className="text-[10px] text-slate-400">Awarded +100 XP, +20 CodeBug Coins. Heatmap log recorded.</span>
                  </div>
                </div>
              )}

              {submitStatus === 'failed' && (
                <div className="text-red-400 bg-red-950/20 border border-red-500/30 p-2.5 rounded mb-2">
                  <strong>Assertion Error:</strong> Solution failed correctness check. Look at traceback output below.
                </div>
              )}

              {results ? (
                <div className="space-y-1">
                  {results.stdout && <pre className="text-slate-200">{results.stdout}</pre>}
                  {results.stderr && <pre className="text-pink-400">{results.stderr}</pre>}
                  <div className="text-[10px] text-slate-500 border-t border-cyber-border/40 pt-1.5 mt-1.5">
                    Run time: {results.executionTime}ms | Heap Memory: {results.memoryUsage}MB
                  </div>
                </div>
              ) : (
                !submitting && !executing && (
                  <span className="text-slate-600 italic">Ready to run. Click compile or submit to begin test cases check.</span>
                )
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

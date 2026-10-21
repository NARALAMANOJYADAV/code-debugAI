'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { analyzeCode, DiagnosticResult } from '../../lib/ai/debugger';
import { 
  Bug, Play, Code, CheckCircle, RefreshCw, AlertTriangle, 
  HelpCircle, Eye, Columns, BookOpen, Layers, Terminal, Sparkles
} from 'lucide-react';

export default function DebuggerPage() {
  const { selectedModel } = useAppStore();
  
  // State for code entry
  const [code, setCode] = useState(
    `# Define two numbers\nnum1 = 5\nnum2 = 10\n\n# Calculate the sum\ntotal = num1 + num2\n\n# Print the result\nprint("The sum is:", total)`
  );
  const [errorLogs, setErrorLogs] = useState('');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DiagnosticResult | null>(null);
  
  // Tab states
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [activeSolutionTier, setActiveSolutionTier] = useState<'beginner' | 'professional' | 'optimized' | 'bestPractice' | 'industryStandard'>('optimized');
  const [visualizationTab, setVisualizationTab] = useState<'dryRun' | 'stack' | 'complexity'>('dryRun');

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const report = analyzeCode(code, selectedModel, errorLogs);
      setResults(report);
      setAnalyzing(false);
    }, 1000);
  };


  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Bug className="h-8 w-8 text-cyan-400 animate-pulse" />
            <span>AI Error Resolver & Debugger</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated AST parser, line-by-line compiler analysis, memory diagnostics and optimized multi-tier suggestions.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-cyber-border rounded px-3 py-1.5">
          <span>Active Engine:</span>
          <span className="font-bold text-cyan-400 uppercase">{selectedModel}</span>
        </div>
      </div>

      {/* Main Workspaces Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Code Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border border-cyber-border rounded-xl overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="bg-slate-900 border-b border-cyber-border px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-300 flex items-center space-x-2">
                <Code className="h-4 w-4 text-cyan-400" />
                <span>Pasted Code Input</span>
              </span>
              <button 
                onClick={() => setCode('')} 
                className="text-[10px] text-slate-500 hover:text-slate-300 transition"
              >
                Clear
              </button>
            </div>
            
            {/* Textarea Code Entry */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#090d16] p-4 text-slate-200 font-mono text-sm leading-relaxed outline-none border-none resize-none"
              placeholder="Paste your compiler error code, broken function, or script here..."
            />

            {/* Error Message Input */}
            <div className="border-t border-cyber-border bg-[#0b0f19] p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Compiler Output / Error Logs (Optional)</span>
              <textarea
                value={errorLogs}
                onChange={(e) => setErrorLogs(e.target.value)}
                className="w-full h-16 bg-[#070b13] border border-cyber-border hover:border-slate-800 focus:border-cyan-500 rounded p-2 text-xs font-mono text-pink-400 outline-none resize-none transition"
                placeholder="Paste the traceback, compiler log, crash stacktrace..."
              />
            </div>

            {/* Run Button */}
            <div className="bg-slate-900 border-t border-cyber-border p-3 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !code.trim()}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg flex items-center space-x-2 transition cursor-pointer active:scale-95"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Syntax & AST...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-slate-950" />
                    <span>Run AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Diagnostics Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="glass-panel border border-cyber-border rounded-xl h-[520px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-4 bg-slate-900 border border-cyber-border rounded-full text-slate-500 animate-bounce">
                <Bug className="h-10 w-10" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-300">Awaiting Code Input</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Paste your coding problem file on the left side and press "Run AI Diagnostics" to analyze AST structures, identify bugs, and view multiple solution tracks.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* 1. Diagnostics Header Overview */}
              <div className="bg-slate-900/60 border border-cyber-border rounded-xl p-5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyber-border/40 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded border ${
                      results.isValid
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-red-500/10 text-red-400 border-red-500/25'
                    }`}>
                      {results.errorType}
                    </span>
                    <span className="text-xs text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                      Language: {results.detectedLanguage}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                    results.isValid ? 'bg-emerald-500/10 text-emerald-400' :
                    results.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                    results.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {results.isValid ? 'Clean Code ✓' : `${results.difficulty} Severity`}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-200">Analysis Summary:</h4>
                  <p className={`text-xs p-2.5 rounded border font-mono ${
                    results.isValid
                      ? 'text-emerald-300 bg-emerald-950/20 border-emerald-500/30'
                      : 'text-slate-300 bg-slate-950 border-cyber-border'
                  }`}>
                    {results.errorSummary}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-400">Diagnosis Details:</span>
                  <p className="text-slate-300">{results.rootCause}</p>
                </div>
              </div>


              {/* 2. Before/After Code Diff Viewer (GitHub Style) */}
              <div className="glass-panel border border-cyber-border rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-cyber-border flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center space-x-2">
                    <Columns className="h-4 w-4 text-cyan-400" />
                    <span>{results.isValid ? 'Verified Code Structure' : 'Proposed Fix Diff (GitHub Style)'}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cyber-border text-xs font-mono">
                  {/* Before Segment */}
                  <div className={`p-4 space-y-1 ${results.isValid ? 'bg-emerald-950/5' : 'bg-red-950/10'}`}>
                    <div className={`text-[10px] uppercase font-black mb-2 ${results.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                      {results.isValid ? 'Submitted Code (Clean)' : 'Original Code (Broken)'}
                    </div>
                    <pre className="overflow-x-auto text-slate-300 select-none">
                      {results.diff.beforeCode.split('\n').map((line, idx) => (
                        <div 
                          key={idx} 
                          className={`${results.affectedLines.includes(idx + 1) ? 'bg-red-500/15 border-l-2 border-red-500 pl-1' : 'pl-1'}`}
                        >
                          <span className="text-slate-600 inline-block w-6 text-right mr-3 select-none">{idx + 1}</span>
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                  {/* After Segment */}
                  <div className="p-4 bg-emerald-950/10 space-y-1">
                    <div className="text-[10px] text-emerald-400 uppercase font-black mb-2">
                      {results.isValid ? 'Verified Output' : 'Corrected Version'}
                    </div>
                    <pre className="overflow-x-auto text-slate-300">
                      {results.diff.afterCode.split('\n').map((line, idx) => (
                        <div 
                          key={idx} 
                          className={`${results.diff.additions.includes(idx + 1) ? 'bg-emerald-500/15 border-l-2 border-emerald-500 pl-1' : 'pl-1'}`}
                        >
                          <span className="text-slate-600 inline-block w-6 text-right mr-3 select-none">{idx + 1}</span>
                          {line}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>


              {/* 3. Deep Explanations (Beginner/Intermediate/Expert Modes) */}
              <div className="glass-panel border border-cyber-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-cyber-border pb-3">
                  <span className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span>Line Explanation & Behavior Insights</span>
                  </span>
                  
                  {/* Explanation Toggle */}
                  <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-cyber-border">
                    {['beginner', 'intermediate', 'expert'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setExplanationMode(mode as any)}
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition ${
                          explanationMode === mode ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900 p-3 rounded border border-cyber-border">
                  {explanationMode === 'beginner' && results.explanationBeginner}
                  {explanationMode === 'intermediate' && results.explanationIntermediate}
                  {explanationMode === 'expert' && results.explanationExpert}
                </p>
              </div>

              {/* 4. Multi-Tier Solution Submissions (Tabs 1 to 5) */}
              <div className="glass-panel border border-cyber-border rounded-xl overflow-hidden">
                <div className="bg-slate-900 border-b border-cyber-border px-4 py-2 flex overflow-x-auto space-x-2 scrollbar-none">
                  {[
                    { id: 'beginner', label: '1. Beginner' },
                    { id: 'professional', label: '2. Professional' },
                    { id: 'optimized', label: '3. Optimized' },
                    { id: 'bestPractice', label: '4. Best Practice' },
                    { id: 'industryStandard', label: '5. Enterprise' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSolutionTier(tab.id as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded whitespace-nowrap transition cursor-pointer ${
                        activeSolutionTier === tab.id 
                          ? 'bg-cyan-500 text-slate-950' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-200">
                      {results.solutions[activeSolutionTier].title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">
                      {results.solutions[activeSolutionTier].description}
                    </p>
                  </div>
                  
                  <pre className="bg-[#090d16] p-4 rounded-lg border border-cyber-border font-mono text-xs text-slate-300 overflow-x-auto">
                    {results.solutions[activeSolutionTier].code}
                  </pre>

                  <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded border border-cyber-border/40">
                    <span className="font-bold block mb-1 text-slate-400">Fix Rationale:</span>
                    {results.solutions[activeSolutionTier].explanation}
                  </div>
                </div>
              </div>

              {/* 5. Visualization Suite (Dry Run, Call Stack, Memory heap, Complexity) */}
              <div className="glass-panel border border-cyber-border rounded-xl overflow-hidden">
                <div className="bg-slate-900 border-b border-cyber-border px-4 py-3 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-300 flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span>Memory & Call Stack Visualization Suite</span>
                  </span>
                  
                  <div className="flex space-x-1">
                    {[
                      { id: 'dryRun', label: 'Dry Run Table' },
                      { id: 'stack', label: 'Call Stack & Heap' },
                      { id: 'complexity', label: 'Complexity Meters' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setVisualizationTab(tab.id as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition ${
                          visualizationTab === tab.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  {/* Dry Run Table */}
                  {visualizationTab === 'dryRun' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-cyber-border bg-[#0b0f19] text-slate-400">
                            <th className="p-2">Step</th>
                            <th className="p-2">Line</th>
                            <th className="p-2">Variable State</th>
                            <th className="p-2">Action / Summary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.dryRunTable.map((step, idx) => (
                            <tr key={idx} className="border-b border-cyber-border/40 hover:bg-slate-900/20">
                              <td className="p-2 font-bold text-purple-400">{step.step}</td>
                              <td className="p-2 font-mono text-cyan-400">Line {step.lineNum}</td>
                              <td className="p-2 font-mono text-xs text-yellow-500">
                                {JSON.stringify(step.variables).replace(/[{}\"]/g, '')}
                              </td>
                              <td className="p-2 text-slate-300">{step.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Call Stack & Heap Visual representation */}
                  {visualizationTab === 'stack' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#090d16] p-3 rounded-lg border border-cyber-border space-y-2">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block">Execution Call Stack (FILO)</span>
                        <div className="space-y-1">
                          {results.callStack.map((frame, idx) => (
                            <div 
                              key={idx} 
                              className={`p-2 rounded text-xs font-mono text-center border ${
                                idx === 0 
                                  ? 'bg-purple-950/30 text-purple-400 border-purple-500/40 animate-pulse' 
                                  : 'bg-slate-900/60 text-slate-400 border-cyber-border'
                              }`}
                            >
                              {frame} {idx === 0 && '← Active Frame'}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#090d16] p-3 rounded-lg border border-cyber-border space-y-2">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block">Active Memory Heap Allocations</span>
                        <div className="space-y-1 text-xs font-mono">
                          {Object.entries(results.memoryHeap).map(([key, val]) => (
                            <div key={key} className="flex justify-between p-1.5 border-b border-cyber-border/30">
                              <span className="text-slate-400">{key}:</span>
                              <span className="text-cyan-400 font-bold">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Complexity meters */}
                  {visualizationTab === 'complexity' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Time Complexity */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-400">Time Complexity:</span>
                            <span className="text-cyan-400 font-mono">{results.timeComplexity}</span>
                          </div>
                          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-cyber-border">
                            <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${results.timeComplexityMeter}%` }} />
                          </div>
                        </div>

                        {/* Space Complexity */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-400">Space Complexity:</span>
                            <span className="text-purple-400 font-mono">{results.spaceComplexity}</span>
                          </div>
                          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-cyber-border">
                            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${results.spaceComplexityMeter}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Alternate Algorithms List */}
                      <div className="pt-2">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block mb-2">Alternative Architectural Options</span>
                        <div className="space-y-2 text-xs">
                          {results.alternativeAlgorithms.map((alt, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 rounded border border-cyber-border space-y-1">
                              <div className="flex justify-between font-bold text-slate-200">
                                <span>{alt.algo}</span>
                                <span className="text-[10px] text-slate-400">Time: {alt.time} | Space: {alt.space}</span>
                              </div>
                              <p className="text-slate-400 text-[11px]">{alt.prosCons}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Interview Question Generator & Follow-up MCQ Section */}
              <div className="bg-gradient-to-br from-[#121927] to-[#0c0f17] border border-cyber-border rounded-xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
                  <span>AI Interview Follow-Ups & Assessment</span>
                </h4>
                
                {/* Interview Questions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Generated Technical Interview Questions:</span>
                  <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                    {results.interviewQuestions.map((q, idx) => (
                      <li key={idx} className="hover:text-cyan-300 transition-colors cursor-pointer">{q}</li>
                    ))}
                  </ul>
                </div>

                {/* MCQs */}
                <div className="space-y-3 pt-2 border-t border-cyber-border/40">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evaluate Yourself (Quick Quiz):</span>
                  {results.mcqs.map((mcq, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3.5 rounded border border-cyber-border/40 space-y-2">
                      <p className="text-xs font-semibold text-slate-200">{mcq.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mcq.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => alert(oIdx === mcq.correctOption ? 'Correct answer! 🎉\n\n' + mcq.explanation : 'Incorrect answer! Try again.')}
                            className="bg-[#0e1424] hover:bg-[#151f38] text-slate-300 text-xs py-2 px-3 rounded text-left border border-cyber-border hover:border-slate-700 transition"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}

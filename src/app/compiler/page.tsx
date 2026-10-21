'use client';

import React, { useState } from 'react';
import { executeCode, ExecutionResult } from '../../lib/compiler/executor';
import { 
  Play, CheckCircle, Download, Upload, Share2, 
  Terminal, Settings, PlayCircle, RefreshCw, Cpu
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Import Monaco editor dynamically to prevent SSR hydration mismatches
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { id: 'python', label: 'Python 3', template: 'def main():\n    # Take input from user or stdin\n    num = int(input("Enter number: "))\n    for i in range(1, 11):\n        print(f"{num} x {i} = {num * i}")\n\nif __name__ == "__main__":\n    main()' },
  { id: 'javascript', label: 'JavaScript (ES6)', template: 'function printTable(num) {\n  for (let i = 1; i <= 10; i++) {\n    console.log(`${num} x ${i} = ${num * i}`);\n  }\n}\nprintTable(5);' },
  { id: 'typescript', label: 'TypeScript', template: 'const greet = (name: string): string => {\n  return `Hello, ${name}!`;\n};\nconsole.log(greet("TypeScript"));' },
  { id: 'cpp', label: 'C++ (G++ 20)', template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}' },
  { id: 'java', label: 'Java 17', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}' },
  { id: 'go', label: 'Go (Golang)', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}' },
  { id: 'rust', label: 'Rust', template: 'fn main() {\n    println!("Hello from Rust!");\n}' },
  { id: 'sql', label: 'SQL', template: 'SELECT * FROM users WHERE status = \'active\';' },
  { id: 'html', label: 'HTML/CSS', template: '<!DOCTYPE html>\n<html>\n<head>\n  <style>body { color: cyan; font-family: sans-serif; }</style>\n</head>\n<body>\n  <h1>Hello CodeBug IDE</h1>\n</body>\n</html>' }
];

const THEMES = [
  { id: 'vs-dark', label: 'VS Dark' },
  { id: 'light', label: 'VS Light' }
];

export default function CompilerPage() {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedTheme, setSelectedTheme] = useState('vs-dark');
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [customInput, setCustomInput] = useState('');
  
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState<ExecutionResult | null>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0];
    setSelectedLang(lang);
    setCode(lang.template);
  };

  const handleRunCode = async () => {
    setExecuting(true);
    try {
      const res = await executeCode(code, selectedLang.id, customInput);
      setResults(res);
    } catch (err) {
      setResults({
        stdout: '',
        stderr: 'Compilation / Sandbox runner encountered an execution exception.',
        executionTime: 0,
        memoryUsage: 0,
        exitCode: 1
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solution.${selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'python' ? 'py' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCode(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto flex flex-col min-h-0 lg:h-[calc(100vh-100px)]">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyber-border pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <PlayCircle className="h-5 sm:h-6 w-5 sm:w-6 text-cyan-400" />
            <span>Interactive Multi-Language Compiler</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Write, execute, compile, download, and share code in our sandboxed IDE.
          </p>
        </div>

        {/* Action Controls bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-cyber-border rounded-lg px-2.5 py-1.5">
            <span className="text-xs text-slate-400">Lang:</span>
            <select
              value={selectedLang.id}
              onChange={handleLanguageChange}
              className="bg-transparent border-none text-xs font-bold text-cyan-400 focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-slate-950 text-white">{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-cyber-border rounded-lg px-2.5 py-1.5">
            <span className="text-xs text-slate-400">Theme:</span>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              {THEMES.map((theme) => (
                <option key={theme.id} value={theme.id} className="bg-slate-950 text-white">{theme.label}</option>
              ))}
            </select>
          </div>

          {/* Code Import/Export */}
          <label className="bg-slate-900 border border-cyber-border hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition">
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
            <input type="file" onChange={handleImport} className="hidden" accept=".py,.cpp,.java,.js,.ts,.go,.rs,.sql,.txt" />
          </label>

          <button 
            onClick={handleDownload}
            className="bg-slate-900 border border-cyber-border hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>

          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Code sharing snippet link copied to clipboard!');
            }}
            className="bg-slate-900 border border-cyber-border hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 2. Monaco Editor & Split Execution panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Editor (Left Pane) */}
        <div className="lg:col-span-8 flex flex-col border border-cyber-border rounded-xl bg-slate-900/40 overflow-hidden min-h-[350px] lg:min-h-0">
          <div className="bg-slate-900 px-4 py-2 border-b border-cyber-border flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300">Editor Pane: src/solution.{selectedLang.id === 'cpp' ? 'cpp' : selectedLang.id === 'python' ? 'py' : 'js'}</span>
            <span className="text-[10px] text-cyan-400">Autosave Enabled</span>
          </div>

          <div className="flex-1 relative min-h-[300px] lg:min-h-0">
            <Editor
              height="100%"
              language={selectedLang.id}
              theme={selectedTheme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: 'on',
                bracketPairColorization: { enabled: true },
                fontFamily: 'Fira Code, JetBrains Mono, monospace',
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* Input/Output Sandbox (Right Pane) */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0">
          
          {/* Custom Input */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-4 flex flex-col min-h-[140px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span>Standard Input (stdin)</span>
            </span>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 w-full min-h-[80px] bg-[#070b13] border border-cyber-border rounded p-2 text-xs font-mono text-slate-300 outline-none resize-none focus:border-cyan-500 transition"
              placeholder="Provide runtime input values here (e.g. 5)..."
            />
          </div>

          {/* Code Execution Panel */}
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-4 flex flex-col flex-1 min-h-[260px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span>Execution Output</span>
              </span>
              <button
                onClick={handleRunCode}
                disabled={executing}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-black px-4 py-2 rounded-lg flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-md shadow-cyan-500/10"
              >
                {executing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-slate-950" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated runtime metrics */}
            {results && (
              <div className="grid grid-cols-3 gap-2 mb-3 text-[10px] bg-slate-900/60 p-2 rounded border border-cyber-border/40 font-mono">
                <div className="text-center">
                  <span className="text-slate-500 block">Exit Code</span>
                  <span className={`font-bold ${results.exitCode === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{results.exitCode}</span>
                </div>
                <div className="text-center border-x border-cyber-border/40">
                  <span className="text-slate-500 block">Run Time</span>
                  <span className="text-cyan-400 font-bold">{results.executionTime} ms</span>
                </div>
                <div className="text-center">
                  <span className="text-slate-500 block">Memory</span>
                  <span className="text-purple-400 font-bold">{results.memoryUsage} MB</span>
                </div>
              </div>
            )}

            {/* Terminal output box */}
            <div className="flex-1 min-h-[120px] bg-[#05070c] border border-cyber-border/60 rounded p-3 font-mono text-xs overflow-y-auto">
              {!results && !executing && (
                <span className="text-slate-600 italic">No execution logs outputted yet. Click "Run Code" to compile and run.</span>
              )}
              {executing && (
                <div className="text-slate-400 animate-pulse">Running compiler process worker on sandboxed container...</div>
              )}
              {results && (
                <div className="space-y-2">
                  {results.stdout && (
                    <div className="text-slate-200">
                      <span className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider block mb-1">STDOUT:</span>
                      <pre className="whitespace-pre-wrap">{results.stdout}</pre>
                    </div>
                  )}
                  {results.stderr && (
                    <div className="text-pink-400">
                      <span className="text-[10px] uppercase text-pink-500 font-bold tracking-wider block mb-1">STDERR:</span>
                      <pre className="whitespace-pre-wrap">{results.stderr}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAppStore } from '../../lib/store';
import { 
  Cpu, Send, RefreshCw, Code, ArrowLeftRight, 
  Sparkles, Check, FileText, ClipboardList
} from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}

export default function AiTutorPage() {
  const { selectedModel } = useAppStore();
  
  // Tab states
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'translate' | 'generator'>('chat');
  
  // Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'assistant', text: 'Hello! I am your CodeBug AI assistant. Ask me anything about Data Structures, Web Development, Docker, Git, or System Design. I can also help you refactor or document code.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Translation workspace
  const [sourceCode, setSourceCode] = useState('console.log("Translate me!");');
  const [langFrom, setLangFrom] = useState('javascript');
  const [langTo, setLangTo] = useState('python');
  const [translatedCode, setTranslatedCode] = useState('');
  const [translating, setTranslating] = useState(false);

  // Prompt Generator
  const [prompt, setPrompt] = useState('Write a Python function to check if a binary tree is symmetric.');
  const [generatedCode, setGeneratedCode] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = `I parsed your query using ${selectedModel}. Here is a conceptual breakdown: \n\n1. Ensure that your pointer references are clean.\n2. Consider cache-locality when designing recursive iterations.\n3. Make sure to profile runtime allocations.`;
      
      if (chatInput.toLowerCase().includes('docker')) {
        botResponse = `To containerize a standard application:\n1. Write a \`Dockerfile\` defining bases (e.g. \`node:20-alpine\`).\n2. Set environment configurations (\`ENV\`).\n3. Expose the port (\`EXPOSE 3000\`).\n4. Use \`CMD ["npm", "start"]\` to fire process nodes.`;
      } else if (chatInput.toLowerCase().includes('reverse') || chatInput.toLowerCase().includes('string')) {
        botResponse = `To reverse a string in Python optimally:\n\`\`\`python\ndef reverse_str(s: str) -> str:\n    return s[::-1]  # O(N) time complexity slice logic\n\`\`\``;
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: botResponse }]);
      setChatLoading(false);
    }, 1000);
  };

  const handleTranslate = () => {
    setTranslating(true);
    setTimeout(() => {
      let result = '';
      if (langTo === 'python') {
        result = `def main():\n    print("Translate me!")\n\nif __name__ == "__main__":\n    main()`;
      } else if (langTo === 'java') {
        result = `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Translate me!");\n    }\n}`;
      } else {
        result = `console.log("Translate me!");`;
      }
      setTranslatedCode(result);
      setTranslating(false);
    }, 1000);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const solution = `def isSymmetric(root) -> bool:\n    if not root:\n        return True\n    \n    def isMirror(t1, t2):\n        if not t1 and not t2:\n            return True\n        if not t1 or not t2:\n            return False\n        return t1.val == t2.val and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)\n        \n    return isMirror(root.left, root.right)`;
      setGeneratedCode(solution);
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyber-border pb-4 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            <span>AI Code Assistant & Copilot Studio</span>
          </h1>
          <p className="text-xs text-slate-400">
            Generate custom boilerplates, translate syntax logic across languages, or chat with our specialized coding model.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-[#0b0f19] border border-cyber-border p-1 rounded-lg">
          {[
            { id: 'chat', label: 'Tutor Chat' },
            { id: 'translate', label: 'Code Translator' },
            { id: 'generator', label: 'AI Code Generator' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`text-xs font-bold px-4 py-1.5 rounded-md transition cursor-pointer ${
                activeSubTab === tab.id 
                  ? 'bg-cyan-500 text-slate-950' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Display */}
      <div className="flex-1 min-h-0 bg-[#0d1320]/40 border border-cyber-border rounded-xl flex flex-col overflow-hidden">
        
        {/* TAB 1: Chat Assistant */}
        {activeSubTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Conversation Log */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-purple-950/20 border-purple-500/20 text-slate-200'
                      : 'bg-slate-900 border-cyber-border text-slate-300'
                  }`}>
                    <span className="font-extrabold text-[9px] uppercase tracking-wider block mb-1 text-slate-500">
                      {msg.sender === 'user' ? 'You' : `${selectedModel} Assistant`}
                    </span>
                    <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-cyber-border rounded-xl p-4 text-xs text-slate-400 flex items-center space-x-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Message Area */}
            <div className="p-4 border-t border-cyber-border bg-slate-950 flex space-x-3 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about data structures, recursion, docker setups, or system designs..."
                className="flex-1 bg-[#090d16] border border-cyber-border hover:border-slate-800 focus:border-cyan-500 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition"
              />
              <button
                onClick={handleSendMessage}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition cursor-pointer active:scale-95 shadow-md shadow-cyan-500/10"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Code Translator */}
        {activeSubTab === 'translate' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cyber-border min-h-0">
            {/* Input Pane */}
            <div className="p-5 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Code (From)</span>
                <select
                  value={langFrom}
                  onChange={(e) => setLangFrom(e.target.value)}
                  className="bg-slate-900 border border-cyber-border rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="flex-1 w-full bg-[#070b13] border border-cyber-border rounded-lg p-3 text-xs font-mono text-slate-300 outline-none resize-none focus:border-cyan-500 transition"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleTranslate}
                  disabled={translating}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2 rounded-lg flex items-center space-x-1.5 transition cursor-pointer active:scale-95"
                >
                  {translating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowLeftRight className="h-3.5 w-3.5" />}
                  <span>Translate Syntax</span>
                </button>
              </div>
            </div>

            {/* Output Pane */}
            <div className="p-5 flex flex-col min-h-0 bg-[#090d16]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Code (To)</span>
                <select
                  value={langTo}
                  onChange={(e) => setLangTo(e.target.value)}
                  className="bg-slate-900 border border-cyber-border rounded px-2 py-1 text-xs text-cyan-400 focus:outline-none"
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <pre className="flex-1 w-full bg-[#070b13] border border-cyber-border rounded-lg p-3 text-xs font-mono text-slate-300 overflow-y-auto">
                {translatedCode || '// Translated code will be outputted here...'}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: AI Code Generator */}
        {activeSubTab === 'generator' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cyber-border min-h-0">
            {/* Input Prompt pane */}
            <div className="p-5 flex flex-col min-h-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prompt Specification</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 w-full bg-[#070b13] border border-cyber-border rounded-lg p-3 text-xs text-slate-300 outline-none resize-none focus:border-cyan-500 transition mb-4"
                placeholder="Describe what algorithm, API server, DB trigger, or React component you want to write..."
              />
              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition active:scale-95"
                >
                  {generating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 fill-slate-950" />}
                  <span>Generate Component</span>
                </button>
              </div>
            </div>

            {/* Generated Code pane */}
            <div className="p-5 flex flex-col min-h-0 bg-[#090d16]/30">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Generated Source Code</span>
              <pre className="flex-1 w-full bg-[#070b13] border border-cyber-border rounded-lg p-3 text-xs font-mono text-slate-300 overflow-y-auto">
                {generatedCode || '// AI code results will be displayed here...'}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

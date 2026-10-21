'use client';

import React, { useState } from 'react';
import { mockRoadmaps, RoadmapTrack, RoadmapNode } from '../../lib/data/mockData';
import { 
  Map, CheckCircle, Unlock, Lock, ExternalLink, 
  Code, BookOpen, Star, RefreshCw
} from 'lucide-react';

export default function RoadmapsPage() {
  const [activeTrackId, setActiveTrackId] = useState(mockRoadmaps[0].id);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(mockRoadmaps[0].nodes[0]);

  const activeTrack = mockRoadmaps.find(t => t.id === activeTrackId) || mockRoadmaps[0];

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-cyber-border pb-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center space-x-3">
            <Map className="h-8 w-8 text-cyan-400" />
            <span>Interactive Learning Roadmaps</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Follow structured step-by-step career guidelines, unlock core topics, practice syntaxes, and read official documentations.
          </p>
        </div>
      </div>

      {/* Track Selector Tab Switcher */}
      <div className="flex space-x-2 border-b border-cyber-border/40 pb-2 overflow-x-auto">
        {mockRoadmaps.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              setActiveTrackId(track.id);
              setSelectedNode(track.nodes[0]);
            }}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTrackId === track.id 
                ? 'bg-gradient-cyber text-white glow-shadow-cyan' 
                : 'bg-slate-900 border border-cyber-border text-slate-400 hover:text-white'
            }`}
          >
            {track.title}
          </button>
        ))}
      </div>

      {/* Grid: Left - Graph visual, Right - Node Details detail card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Roadmaps Graph Flow (Left Pane) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0b0f19] border border-cyber-border rounded-xl p-6 relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Learning Track Nodes</h3>
            
            <div className="w-full max-w-md flex flex-col items-center space-y-8 relative">
              {/* Vertical connector line */}
              <div className="absolute top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500 via-cyan-500 to-slate-800 left-1/2 transform -translate-x-1/2 pointer-events-none" />
              
              {activeTrack.nodes.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                
                return (
                  <div key={node.id} className="relative z-10 w-full flex items-center justify-center">
                    
                    {/* Node Circle Box */}
                    <button
                      onClick={() => handleNodeClick(node)}
                      className={`w-72 p-4 rounded-xl border text-left transition-all duration-300 transform cursor-pointer active:scale-95 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#151f38] border-cyan-500 shadow-md shadow-cyan-500/10 scale-105'
                          : 'bg-[#0d1324] border-cyber-border hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Step {index + 1}</div>
                        <h4 className="font-extrabold text-sm text-white">{node.label}</h4>
                      </div>
                      
                      {/* Status Icon */}
                      <div className="p-1.5 rounded-full">
                        {node.status === 'completed' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
                        {node.status === 'unlocked' && <Unlock className="h-5 w-5 text-cyan-400" />}
                        {node.status === 'locked' && <Lock className="h-5 w-5 text-slate-600" />}
                      </div>
                    </button>
                    
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Details (Right Pane) */}
        <div className="lg:col-span-5">
          {selectedNode ? (
            <div className="glass-panel border border-cyber-border rounded-xl p-6 space-y-6 sticky top-20">
              {/* Title & Status Header */}
              <div className="border-b border-cyber-border pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Node Parameters</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center space-x-1 ${
                    selectedNode.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    selectedNode.status === 'unlocked' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                    'bg-slate-800 text-slate-500 border-cyber-border'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Overview:</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Code Snippets (if any) */}
              {selectedNode.codeSnippet && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Code className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Syntax Snippet Example:</span>
                  </h4>
                  <pre className="bg-[#090d16] border border-cyber-border p-3.5 rounded-lg text-xs text-slate-300 font-mono overflow-x-auto">
                    {selectedNode.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Core Resources list */}
              <div className="space-y-3 pt-2 border-t border-cyber-border/40">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                  <span>Curated Learning Resources:</span>
                </h4>
                <div className="space-y-2">
                  {selectedNode.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Redirecting to documentation source: ${res}`); }}
                      className="flex items-center justify-between p-2.5 bg-slate-900 border border-cyber-border rounded hover:bg-slate-850 hover:border-cyan-500 transition text-xs font-semibold text-slate-300 group"
                    >
                      <span>{res}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                    </a>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel border border-cyber-border rounded-xl p-8 text-center text-slate-500">
              Select a learning track node on the left to display resource details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

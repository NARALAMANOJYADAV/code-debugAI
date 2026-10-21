'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Code, Bug, BookOpen, Trophy, 
  Map, MessageSquare, Clipboard, Star, BarChart, 
  User, ShieldAlert, Cpu, Menu, X 
} from 'lucide-react';
import { clsx } from 'clsx';

export const menuItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'AI Debugger', icon: Bug, path: '/debugger', badge: 'Core' },
  { label: 'Online Compiler', icon: Code, path: '/compiler' },
  { label: 'Practice Problems', icon: BookOpen, path: '/practice' },
  { label: 'Learning Roadmaps', icon: Map, path: '/roadmaps' },
  { label: 'AI Code Assistant', icon: Cpu, path: '/ai-tutor' },
  { label: 'Coding Contests', icon: Trophy, path: '/contests' },
  { label: 'Interview Prep', icon: Star, path: '/interview-prep' },
  { label: 'Discuss Forum', icon: MessageSquare, path: '/discussions' },
  { label: 'My Notes', icon: Clipboard, path: '/notes' },
  { label: 'Leaderboard', icon: BarChart, path: '/leaderboard' },
  { label: 'User Profile', icon: User, path: '/profile' },
  { label: 'Admin Dashboard', icon: ShieldAlert, path: '/admin' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 border-r border-cyber-border glass-panel h-[calc(100vh-61px)] overflow-y-auto flex-col p-4 space-y-6 shrink-0">
      {/* Menu Categories */}
      <div className="flex-1 flex flex-col space-y-1">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 px-3 mb-2">Navigation</span>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.path}
              className={clsx(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group duration-200",
                isActive 
                  ? "bg-gradient-cyber text-white font-semibold shadow-md shadow-cyan-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-800"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className={clsx(
                  "h-4 w-4 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                )} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={clsx(
                  "text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide uppercase",
                  isActive 
                    ? "bg-slate-950/40 text-cyan-200" 
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Info inside Sidebar */}
      <div className="border-t border-cyber-border pt-4 text-center">
        <p className="text-[10px] text-slate-500">CodeBug AI v1.0.0</p>
        <p className="text-[9px] text-slate-600 mt-1">Intelligent Error Diagnostics & Coding sandbox</p>
      </div>
    </aside>
  );
}

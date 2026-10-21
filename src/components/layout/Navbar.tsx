'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, AIModel } from '../../lib/store';
import { useAuth } from '../auth/AuthContext';
import { menuItems } from './Sidebar';
import { 
  Flame, Star, Coins, Zap, Sun, Moon, Cpu, Search, Bell, 
  LogIn, LogOut, Shield, CheckCheck, Trash2, X, Info, Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'contest' | 'achievement' | 'system';
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: '🚀 Platform Initialized',
    description: 'Welcome to CodeBug AI! Start solving challenges and debugging code in our sandbox.',
    time: 'Just now',
    read: false,
    type: 'system'
  },
  {
    id: 'n2',
    title: '🏆 Weekly Contest Live',
    description: 'Algorithmic Sprint #42 is now active. Solve 4 problems to earn 500 XP.',
    time: '2 hours ago',
    read: false,
    type: 'contest'
  },
  {
    id: 'n3',
    title: '⭐ Level Up Achievement',
    description: 'You reached Level 4 with 1,250 XP! Keep up the daily streak.',
    time: '1 day ago',
    read: true,
    type: 'achievement'
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const { userStats, selectedModel, setSelectedModel, theme, toggleTheme } = useAppStore();
  const { user, signOut, isAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Sync theme with HTML root tag
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Close mobile menu on page navigate
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value as AIModel);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getInitials = () => {
    if (!user) return '??';
    if (user.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-cyber-border glass-panel px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Mobile Menu Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-cyber-border"
            title="Toggle Navigation Menu"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-cyber p-1.5 sm:p-2 rounded-lg text-white font-black tracking-wider flex items-center justify-center glow-shadow-cyan">
              <Cpu className="h-4 sm:h-5 w-4 sm:w-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CODEBUG.AI
            </span>
          </Link>
        </div>

        {/* Global Search Command Palette (Desktop) */}
        <div className="hidden md:flex items-center bg-cyber-bg border border-cyber-border rounded-lg px-3 py-1.5 w-72 lg:w-80 space-x-2 text-slate-400 text-sm focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search problems, concepts... (Ctrl+K)"
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-xs"
            readOnly
            onClick={() => alert('Search Command Palette activated! (Ctrl+K)')}
          />
          <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">⌘K</span>
        </div>

        {/* Right Controls Area */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Active AI Model Switcher */}
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-cyber-border rounded-lg px-2 py-1">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-slate-300 hidden md:inline">Model:</span>
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="bg-transparent border-none text-[11px] font-bold text-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="gemini-2.5" className="bg-slate-950 text-white">Gemini 2.5 Pro</option>
              <option value="gpt-5.5" className="bg-slate-950 text-white">GPT-5.5 (Ultra)</option>
              <option value="claude-3.7" className="bg-slate-950 text-white">Claude 3.7 Sonnet</option>
              <option value="deepseek-r1" className="bg-slate-950 text-white">DeepSeek R1</option>
              <option value="llama-3" className="bg-slate-950 text-white">Llama 3.3</option>
            </select>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 text-xs sm:text-sm">
            {/* Daily Streak */}
            <div className="flex items-center space-x-1 text-amber-500 bg-amber-500/10 px-1.5 sm:px-2 py-1 rounded-md border border-amber-500/20 font-bold" title="Daily Streak">
              <Flame className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-amber-500" />
              <span>{userStats.streak}d</span>
            </div>

            {/* Level Badge */}
            <div className="flex items-center space-x-1 text-cyan-400 bg-cyan-400/10 px-1.5 sm:px-2 py-1 rounded-md border border-cyan-400/20 font-bold" title="Current Level">
              <Star className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-cyan-400" />
              <span>Lvl {userStats.level}</span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-cyber-border transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-cyber-border relative transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-slate-950/95 backdrop-blur-xl border border-cyber-border rounded-xl shadow-2xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-cyber-border/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-xs text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-cyan-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] text-cyan-400 hover:underline font-semibold flex items-center space-x-1"
                      >
                        <CheckCheck className="h-3 w-3" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] text-slate-500 hover:text-rose-400 transition"
                        title="Clear All"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-center p-6 text-xs text-slate-500">
                      No new notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                          n.read
                            ? 'bg-slate-900/40 border-cyber-border/30 opacity-70'
                            : 'bg-slate-900 border-cyan-500/30'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-200">{n.title}</span>
                          <span className="text-[9px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1 leading-snug">{n.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Auth Profile / Login */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile" className="flex items-center space-x-2 group">
                <div className="h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-gradient-cyber p-[1.5px] glow-shadow-purple">
                  <div className="h-full w-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-white group-hover:text-cyan-400 transition">
                    {getInitials()}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-900 border border-cyber-border transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay Navigation */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden bg-slate-950/80 backdrop-blur-md flex flex-col">
          <div className="p-4 border-b border-cyber-border flex items-center justify-between bg-slate-900">
            <span className="text-sm font-bold text-cyan-400">Navigation Menu</span>
            <button onClick={() => setShowMobileMenu(false)} className="text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={clsx(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-cyber text-white font-bold"
                      : "text-slate-300 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

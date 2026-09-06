"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Flame, Sparkles, Moon, Sun, Clock } from "lucide-react";
import { useStreak } from "@/lib/storage";

interface NavbarProps {
  onOpenVerseModal?: () => void;
  onOpenTimerModal?: () => void;
}

export function Navbar({ onOpenVerseModal, onOpenTimerModal }: NavbarProps) {
  const streak = useStreak();
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const nextState = !isDark;
    setIsDark(nextState);
    if (nextState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-amber-50/80 dark:bg-slate-950/80 border-b border-amber-200/50 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                QT for Youth
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/50">
                青年靈修
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[180px] sm:max-w-none">
              每週深研・在日常中遇見復活的大能
            </p>
          </div>
        </Link>

        {/* Center / Right: Interactive Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator badge */}
          <div
            title={`連續靈修打卡 ${streak} 天`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>{streak} 天</span>
          </div>

          {/* Verse Card Share Button */}
          {onOpenVerseModal && (
            <button
              onClick={onOpenVerseModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>金句卡片</span>
            </button>
          )}

          {/* Meditation Timer Button */}
          {onOpenTimerModal && (
            <button
              onClick={onOpenTimerModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition"
            >
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>靜心默想</span>
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="切換深淺模式"
            className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, Wind } from "lucide-react";

interface MeditationTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeditationTimer({ isOpen, onClose }: MeditationTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [isActive, setIsActive] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Derived breathing phase
  const elapsed = selectedMinutes * 60 - timeLeft;
  const cycleTime = elapsed % 16;
  const breathPhase =
    cycleTime < 4 ? "吸氣" : cycleTime < 8 ? "屏息" : cycleTime < 12 ? "呼氣" : "安歇";

  const handleSelectMinutes = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedMinutes * 60);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          <Wind className="w-4 h-4" />
          <span>靜心・安歇在主懷</span>
        </div>

        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          靈修前安靜默想
        </h3>

        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 italic">
          「你們要休息，要知道我是神。」（詩篇 46:10）
        </p>

        {/* Breathing Orb Visualization */}
        <div className="my-8 relative flex items-center justify-center">
          <div
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
              isActive
                ? breathPhase === "吸氣"
                  ? "scale-110 bg-amber-500/20 border-2 border-amber-400 shadow-xl shadow-amber-500/20"
                  : breathPhase === "屏息"
                  ? "scale-110 bg-orange-500/25 border-2 border-orange-400 shadow-xl"
                  : breathPhase === "呼氣"
                  ? "scale-90 bg-amber-500/10 border-2 border-amber-300"
                  : "scale-95 bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700"
                : "bg-amber-500/10 border border-amber-300/60 dark:border-amber-700/60"
            }`}
          >
            <span className="text-3xl font-extrabold tracking-wider font-mono text-stone-900 dark:text-stone-100">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            {isActive && (
              <span className="mt-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 animate-pulse">
                {breathPhase}（4秒）
              </span>
            )}
            {!isActive && (
              <span className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                點擊播放開始
              </span>
            )}
          </div>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 3, 5, 10].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedMinutes === mins
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
              }`}
            >
              {mins} 分鐘
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            title="重設"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-600/30 transition active:scale-95"
            title={isActive ? "暫停" : "開始"}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, Share2, Quote } from "lucide-react";
import { DevotionalWeek } from "@/types/devotional";

interface VerseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: DevotionalWeek;
}

const THEMES = [
  {
    id: "sunrise",
    name: "晨曦暖光",
    bgClass: "bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400 text-white",
    cardBorder: "border-amber-300/40",
    quoteColor: "text-white/60",
    subColor: "text-white/90"
  },
  {
    id: "midnight",
    name: "星夜深思",
    bgClass: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-stone-100",
    cardBorder: "border-indigo-800/60",
    quoteColor: "text-amber-400/60",
    subColor: "text-indigo-200"
  },
  {
    id: "sage",
    name: "清心草綠",
    bgClass: "bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-stone-100",
    cardBorder: "border-emerald-700/50",
    quoteColor: "text-emerald-400/60",
    subColor: "text-emerald-200"
  },
  {
    id: "paper",
    name: "極簡雅致",
    bgClass: "bg-[#fcfbf9] text-stone-900 border border-stone-200",
    cardBorder: "border-stone-300",
    quoteColor: "text-amber-600/40",
    subColor: "text-stone-600"
  }
];

export function VerseShareModal({ isOpen, onClose, week }: VerseShareModalProps) {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build verse options from current week
  const verseOptions = [
    {
      text: week.goldenVerse.text,
      ref: week.goldenVerse.reference,
      context: `${week.title}・每週核心`
    },
    ...week.days.map((d) => ({
      text: d.goldenVerse,
      ref: d.scriptureRef,
      context: `${d.dayLabel}・${d.title}`
    }))
  ];

  const currentVerse = verseOptions[selectedVerseIndex] || verseOptions[0];
  const currentTheme = THEMES[selectedThemeIndex];

  const handleCopyText = async () => {
    const fullText = `「${currentVerse.text}」—— ${currentVerse.ref}\n（來自 QT for Youth 青年靈修）`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              靈修金句卡片產生器
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Card Preview */}
          <div
            id="verse-card-preview"
            className={`relative rounded-2xl p-8 sm:p-10 shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] ${currentTheme.bgClass}`}
          >
            <Quote className={`w-10 h-10 ${currentTheme.quoteColor} rotate-180 mb-2`} />

            <div className="my-auto py-4">
              <p className="text-xl sm:text-2xl font-bold leading-relaxed tracking-wide font-serif">
                「{currentVerse.text}」
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-current/20 flex items-end justify-between">
              <div>
                <div className="font-bold text-sm tracking-wide">{currentVerse.ref}</div>
                <div className={`text-xs ${currentTheme.subColor}`}>
                  {currentVerse.context}
                </div>
              </div>

              <div className="text-[11px] uppercase tracking-widest font-semibold opacity-75">
                QT for Youth
              </div>
            </div>
          </div>

          {/* Verse Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
              選擇經文金句
            </label>
            <select
              value={selectedVerseIndex}
              onChange={(e) => setSelectedVerseIndex(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {verseOptions.map((v, idx) => (
                <option key={idx} value={idx}>
                  {v.context}：{v.text.slice(0, 24)}... ({v.ref})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Palette Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
              選擇卡片風格
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {THEMES.map((theme, idx) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition border ${
                    selectedThemeIndex === idx
                      ? "ring-2 ring-amber-500 border-transparent shadow-sm"
                      : "border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "已複製金句" : "複製經文文字"}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>分享給朋友 / 群組</span>
          </button>
        </div>
      </div>
    </div>
  );
}

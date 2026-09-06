"use client";

import React, { useState } from "react";
import { GreekKeyword } from "@/types/devotional";
import { BookMarked, ChevronDown } from "lucide-react";

interface GreekKeywordsSectionProps {
  keywords: GreekKeyword[];
}

export function GreekKeywordsSection({ keywords }: GreekKeywordsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-300/40 dark:border-amber-800/40 bg-amber-500/5 dark:bg-amber-950/20 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-500/10 transition"
      >
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
            原文與神學聚焦（Greek & Context Insights）
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {keywords.map((kw, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif italic font-bold text-amber-700 dark:text-amber-400 text-sm">
                  {kw.word}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                  {kw.transliteration}
                </span>
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {kw.meaning}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {kw.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

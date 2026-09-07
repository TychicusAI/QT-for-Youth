"use client";

import { useState } from "react";
import { ExtendedStudyItem } from "@/types/devotional";
import { BookOpen, ExternalLink, ChevronDown } from "lucide-react";

interface ExtendedStudySectionProps {
  items: ExtendedStudyItem[];
}

export function ExtendedStudySection({ items }: ExtendedStudySectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="p-5 sm:p-6 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>延伸研讀</span>
        </h4>
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          共 {items.length} 處對照
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 text-xs space-y-2 transition shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-amber-700 dark:text-amber-400 text-xs sm:text-sm tracking-tight">
                  {item.title}
                </span>

                <div className="flex items-center gap-2">
                  {item.text && (
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? "收合經文" : "展開經文"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {item.bibliaUrl && (
                    <a
                      href={item.bibliaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title="在 Biblia 深入查閱前後文"
                    >
                      <span>Biblia 查經</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs sm:text-[13px]">
                {item.question}
              </p>

              {/* Expandable Scripture Box */}
              {item.text && isExpanded && (
                <div className="pt-2.5 mt-2 border-t border-amber-200/50 dark:border-amber-900/40 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium mb-1.5">
                    <span>【經文內容】</span>
                    <span className="text-[10px] text-stone-400">新標點和合本</span>
                  </div>
                  <blockquote className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-950/30 border border-amber-300/40 dark:border-amber-700/30 font-serif text-stone-800 dark:text-stone-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {item.text}
                  </blockquote>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

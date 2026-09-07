"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Sparkles, Calendar, BookMarked } from "lucide-react";
import { DevotionalWeek } from "@/types/devotional";
import { formatWeekDateRange } from "@/lib/devotional-service";
import { useIsDayCompleted, toggleDayCompleted } from "@/lib/storage";
import confetti from "canvas-confetti";

interface TodayHeroCardProps {
  week: DevotionalWeek;
  recommendedDayId: string;
}

export function TodayHeroCard({ week, recommendedDayId }: TodayHeroCardProps) {
  const [selectedDayId, setSelectedDayId] = useState<string>(recommendedDayId);

  const currentDay = week.days.find((d) => d.id === selectedDayId) || week.days[0];
  const completed = useIsDayCompleted(week.id, currentDay.id);

  const handleToggleCheck = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleDayCompleted(week.id, currentDay.id);
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-100/30 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-950 border border-amber-300/40 dark:border-amber-700/40 p-5 sm:p-8 md:p-10 shadow-xl shadow-amber-500/5 transition-all">
      {/* Background ambient glowing orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/20 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-orange-400/20 dark:bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm shadow-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            今日特推
          </span>
          <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            {formatWeekDateRange(week)}・{currentDay.dayLabel}
          </span>
        </div>

        {/* 6-Day quick switcher pill bar (scrollable on mobile) */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-stone-900/70 p-1 rounded-full border border-amber-200/60 dark:border-stone-800 backdrop-blur-sm text-xs max-w-full overflow-x-auto whitespace-nowrap">
          {week.days.map((d) => {
            const isSelected = d.id === selectedDayId;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDayId(d.id)}
                className={`px-2.5 py-1 rounded-full transition font-medium ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                {d.dayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <div className="inline-block text-xs font-semibold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/80">
            {currentDay.scriptureRef}（{currentDay.scriptureVersion}）
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-snug">
            {currentDay.title}
          </h2>

          {currentDay.subtitle && (
            <p className="text-sm sm:text-base font-medium text-amber-800/80 dark:text-amber-200/80 leading-relaxed">
              {currentDay.subtitle}
            </p>
          )}

          {/* Scripture preview quote */}
          <blockquote className="my-3 pl-4 border-l-2 border-amber-500/60 text-stone-700 dark:text-stone-300 text-sm italic line-clamp-2 bg-amber-50/40 dark:bg-stone-900/40 py-1.5 pr-2 rounded-r-lg">
            {currentDay.goldenVerse}
          </blockquote>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-400 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              閱讀時間約 {currentDay.readTimeMinutes} 分鐘
            </span>
            <span className="flex items-center gap-1 font-medium">
              <BookMarked className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              包含希臘原文解析與默想導引
            </span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-stretch justify-center gap-3">
          <Link
            href={`/devotional/${week.id}/${currentDay.id}`}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-amber-600/30 hover:shadow-amber-500/40 transition group"
          >
            <span>開始靈修</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={handleToggleCheck}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition ${
              completed
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                : "bg-white/80 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                completed ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"
              }`}
            />
            <span>{completed ? "今日已完成靈修" : "標記為已完成"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

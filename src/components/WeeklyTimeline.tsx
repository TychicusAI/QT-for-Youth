"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, BookOpen, Quote, Info } from "lucide-react";
import { DevotionalWeek } from "@/types/devotional";
import { useCompletedDays, toggleDayCompleted } from "@/lib/storage";
import confetti from "canvas-confetti";

interface WeeklyTimelineProps {
  week: DevotionalWeek;
  recommendedDayId: string;
}

export function WeeklyTimeline({ week, recommendedDayId }: WeeklyTimelineProps) {
  const completedMap = useCompletedDays();
  const [showForeword, setShowForeword] = useState<boolean>(false);

  const handleToggle = (e: React.MouseEvent, dayId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleDayCompleted(week.id, dayId);
    if (nextState) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const completedCount = week.days.filter((d) => completedMap[`${week.id}-${d.id}`]).length;
  const progressPercent = Math.round((completedCount / week.days.length) * 100);

  return (
    <section className="space-y-6">
      {/* Weekly Header & Progress Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-1">
            <span>週次特輯研經手冊</span>
            <span>•</span>
            <span>{week.book}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
            <span>{week.title}</span>
            <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
              {week.subtitle}
            </span>
          </h2>
        </div>

        {/* Progress Bar & Foreword Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForeword(!showForeword)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
          >
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>本週導言簡介</span>
          </button>

          <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-800/60 px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              完成進度: {completedCount}/{week.days.length} 天
            </span>
            <div className="w-16 h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Foreword Box */}
      {showForeword && (
        <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-300/30 dark:border-amber-700/30 text-stone-700 dark:text-stone-300 text-sm leading-relaxed space-y-2">
          <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>前言：死地中的凱歌</span>
          </div>
          <p className="whitespace-pre-line text-stone-700 dark:text-stone-300 font-sans">
            {week.foreword}
          </p>
        </div>
      )}

      {/* Golden Verse of the Week Callout */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-sm">
        <Quote className="w-5 h-5 text-amber-500 shrink-0 rotate-180" />
        <div className="flex-1">
          <span className="font-semibold text-stone-900 dark:text-stone-100 mr-2">
            本週核心金句：
          </span>
          <span className="italic">「{week.goldenVerse.text}」</span>
          <span className="ml-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
            —— {week.goldenVerse.reference}
          </span>
        </div>
      </div>

      {/* 6 Days Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {week.days.map((day) => {
          const isCompleted = Boolean(completedMap[`${week.id}-${day.id}`]);
          const isToday = day.id === recommendedDayId;

          return (
            <div
              key={day.id}
              className={`group relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 ${
                isToday
                  ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-400/80 dark:border-amber-600/80 shadow-md shadow-amber-500/5"
                  : "bg-white dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-md"
              }`}
            >
              <div>
                {/* Header: Day Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        isToday
                          ? "bg-amber-600 text-white"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {day.dayLabel}
                    </span>
                    {isToday && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        今日推薦
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleToggle(e, day.id)}
                    title={isCompleted ? "點擊標記為未完成" : "點擊完成打卡"}
                    className="p-1 text-stone-400 hover:text-amber-600 transition"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 transition-colors ${
                        isCompleted
                          ? "text-emerald-500 fill-emerald-100 dark:fill-emerald-950"
                          : "text-stone-300 dark:text-stone-700 hover:text-amber-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Scripture ref */}
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  {day.scriptureRef}
                </div>

                {/* Day Title */}
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                  {day.title}
                </h3>

                {/* Subtitle / Key Thought */}
                {day.subtitle && (
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {day.subtitle}
                  </p>
                )}
              </div>

              {/* Footer row */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {day.readTimeMinutes} 分鐘
                </span>

                <Link
                  href={`/devotional/${week.id}/${day.id}`}
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform"
                >
                  <span>進入閱讀</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

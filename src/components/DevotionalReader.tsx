"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Quote,
  Clock,
  Share2,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { DevotionalDay, DevotionalWeek } from "@/types/devotional";
import { GreekKeywordsSection } from "@/components/GreekKeywordsSection";
import { JournalBox } from "@/components/JournalBox";
import { PrayerAmenButton } from "@/components/PrayerAmenButton";
import { VerseShareModal } from "@/components/VerseShareModal";

interface DevotionalReaderProps {
  week: DevotionalWeek;
  day: DevotionalDay;
}

export function DevotionalReader({ week, day }: DevotionalReaderProps) {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Find previous and next days
  const currentIndex = week.days.findIndex((d) => d.id === day.id);
  const prevDay = currentIndex > 0 ? week.days[currentIndex - 1] : null;
  const nextDay = currentIndex < week.days.length - 1 ? week.days[currentIndex + 1] : null;

  // Font size classes
  const fontClasses = {
    normal: "text-base leading-relaxed sm:leading-loose",
    large: "text-lg leading-relaxed sm:leading-loose",
    xlarge: "text-xl leading-loose"
  }[fontSize];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 pb-3 border-b border-stone-200 dark:border-stone-800">
        <nav className="flex items-center gap-2">
          <Link href="/" className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>首頁</span>
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-stone-900 dark:hover:text-stone-100 truncate max-w-[120px] sm:max-w-none">
            {week.title}
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">{day.dayLabel}</span>
        </nav>

        {/* Font size switcher and share button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 rounded-lg p-0.5 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setFontSize("normal")}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                fontSize === "normal" ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs" : "text-stone-500"
              }`}
            >
              小
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                fontSize === "large" ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs" : "text-stone-500"
              }`}
            >
              中
            </button>
            <button
              onClick={() => setFontSize("xlarge")}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                fontSize === "xlarge" ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs" : "text-stone-500"
              }`}
            >
              大
            </button>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享金句</span>
          </button>
        </div>
      </div>

      {/* Hero Title Section */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm shadow-amber-500/20">
            {day.dayLabel} 靈修
          </span>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
            {day.scriptureRef}（{day.scriptureVersion}）
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            閱讀時間約 {day.readTimeMinutes} 分鐘
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
          {day.title}
        </h1>

        {day.subtitle && (
          <p className="text-base sm:text-lg font-medium text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
            {day.subtitle}
          </p>
        )}
      </header>

      {/* 1. Scripture Reading Card */}
      <section className="rounded-3xl p-6 sm:p-8 bg-amber-500/5 dark:bg-amber-950/20 border border-amber-300/50 dark:border-amber-700/40 relative overflow-hidden shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-3">
          <BookOpen className="w-4 h-4" />
          <span>今日經文</span>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif text-stone-800 dark:text-stone-100 leading-relaxed font-semibold">
          {day.scriptureText}
        </blockquote>
      </section>

      {/* 2. Greek Keyword Accordion */}
      {day.keywords && day.keywords.length > 0 && (
        <GreekKeywordsSection keywords={day.keywords} />
      )}

      {/* 3. Deep Devotional Message */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Quote className="w-4 h-4 rotate-180" />
          <span>深度信息默想</span>
        </div>

        <div className={`prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 ${fontClasses} space-y-5`}>
          {day.message.split("\n\n").map((paragraph, idx) => {
            // Render bolding and emphasis cleanly
            const rendered = paragraph
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-950 dark:text-white">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="italic text-amber-700 dark:text-amber-300">$1</em>');

            return (
              <p
                key={idx}
                dangerouslySetInnerHTML={{ __html: rendered }}
                className="leading-relaxed"
              />
            );
          })}
        </div>
      </section>

      {/* 4. Meditation Question Card */}
      {day.meditationQuestion && (
        <section className="rounded-2xl p-5 sm:p-6 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>今日默想問題（心靈反思）</span>
          </div>
          <p className="text-sm font-medium text-stone-800 dark:text-stone-100 leading-relaxed italic">
            「{day.meditationQuestion}」
          </p>
        </section>
      )}

      {/* 5. Journal Reflection Box */}
      <JournalBox key={`${week.id}-${day.id}`} weekId={week.id} dayId={day.id} dayTitle={day.title} />

      {/* 5. Suggested Prayer Section */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-100/20 dark:from-slate-900 dark:via-stone-900 dark:to-slate-950 border border-amber-300/60 dark:border-amber-800/60 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
          <span>建議禱告回應</span>
        </div>

        <div className="font-serif italic text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 bg-white/60 dark:bg-stone-950/40 p-5 rounded-2xl border border-amber-200/50 dark:border-stone-800">
          {day.suggestedPrayer}
        </div>

        {/* Amen Celebration Button */}
        <PrayerAmenButton weekId={week.id} dayId={day.id} />
      </section>

      {/* 6. Extended Study */}
      {day.extendedStudy && day.extendedStudy.length > 0 && (
        <section className="p-6 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>延伸研讀與課後思考</span>
          </h4>
          <div className="space-y-2.5">
            {day.extendedStudy.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs space-y-1"
              >
                <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-stone-500 font-mono">{item.reference}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                  {item.question}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Navigation: Prev / Next Day */}
      <footer className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
        {prevDay ? (
          <Link
            href={`/devotional/${week.id}/${prevDay.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-300 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition text-xs font-semibold group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>上一日：{prevDay.dayLabel}</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/"
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          返回六日目錄
        </Link>

        {nextDay ? (
          <Link
            href={`/devotional/${week.id}/${nextDay.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition text-xs font-semibold group shadow-md shadow-amber-600/20"
          >
            <span>下一日：{nextDay.dayLabel}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>完成本週全部旅程</span>
          </Link>
        )}
      </footer>

      {/* Share Modal */}
      <VerseShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        week={week}
      />
    </article>
  );
}

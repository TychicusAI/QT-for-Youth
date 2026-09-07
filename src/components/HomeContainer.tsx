"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TodayHeroCard } from "@/components/TodayHeroCard";
import { WeeklyTimeline } from "@/components/WeeklyTimeline";
import { VerseShareModal } from "@/components/VerseShareModal";
import { MeditationTimer } from "@/components/MeditationTimer";
import { getCurrentWeek, getRecommendedDayIdForToday } from "@/lib/devotional-service";
import { Sparkles, Clock, Heart, Layers } from "lucide-react";

export function HomeContainer() {
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [recommendedDayId] = useState(() => getRecommendedDayIdForToday());

  const currentWeek = getCurrentWeek();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] dark:bg-[#090d16] text-stone-900 dark:text-stone-100 selection:bg-amber-500/20">
      {/* Top Navigation */}
      <Navbar
        onOpenVerseModal={() => setIsVerseModalOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        {/* Welcome Tagline for Youth */}
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>青年專屬深度靈修・每週更新</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
            在世界的遊戲規則外，
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              活出天國的尊貴身份
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
            拒絕廉價的成功學，走進聖經第一現場。每天 6~8 分鐘，拆毀自我信靠的焦慮堡壘，迎見那叫死人復活的神。
          </p>
        </section>

        {/* 1. Hero: Today's Devotional Quick Card */}
        <TodayHeroCard week={currentWeek} recommendedDayId={recommendedDayId} />

        {/* 2. 6-Day Devotional Journey */}
        <WeeklyTimeline week={currentWeek} recommendedDayId={recommendedDayId} />

        {/* 3. Interactive Youth Faith Toolkit */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
            <span>青年靈修工具箱</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Tool 1: Verse Generator */}
            <div
              onClick={() => setIsVerseModalOpen(true)}
              className="group cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-300/40 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-600 transition shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  靈修金句卡片產生器
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  將本週觸動你的經文，一鍵套用晨曦、星夜等四款專屬美感樣式，輕鬆分享至 Instagram 限時動態或團契群組。
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-stone-800 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                <span>立即製作卡片</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Tool 2: Meditation Timer */}
            <div
              onClick={() => setIsTimerModalOpen(true)}
              className="group cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-stone-100 to-stone-200/50 dark:from-stone-900 dark:to-stone-950 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-stone-700 dark:bg-stone-700 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  靜心深呼吸計時器
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  在展開每日繁重的課業或社群滑動前，給自己 3~5 分鐘安靜在主前。跟隨節奏深呼吸，卸下心中的重擔。
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>開啟靜心模式</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Youth Community Vision / Scripture Anchor Banner */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-stone-100 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span>屬靈痛覺共生・跨越孤島</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              「你們以祈禱幫助我們，好叫許多人為我們得恩的緣故格外謝恩。」
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              基督徒從來不是孤軍奮戰的個體。當我們在死地中學會專靠上帝，那無數張原本憂傷發顫的臉龐，將在同心仰望中被神照亮，匯聚成奪眶而出的感恩洪流。
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 dark:text-stone-200">
              QT for Youth
            </span>
            <span>•</span>
            <span>青年每日靈修平台</span>
          </div>

          <div className="text-center sm:text-right">
            <span>由 Tychicus AI 事工推動</span>
            <span className="mx-2">•</span>
            <span>每週定時更新當週教材</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VerseShareModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        week={currentWeek}
      />

      <MeditationTimer
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </div>
  );
}

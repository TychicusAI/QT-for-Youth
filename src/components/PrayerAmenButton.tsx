"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useIsDayCompleted, toggleDayCompleted } from "@/lib/storage";
import confetti from "canvas-confetti";

interface PrayerAmenButtonProps {
  weekId: string;
  dayId: string;
}

export function PrayerAmenButton({ weekId, dayId }: PrayerAmenButtonProps) {
  const completed = useIsDayCompleted(weekId, dayId);

  const handleAmen = () => {
    const nextState = toggleDayCompleted(weekId, dayId);

    if (nextState) {
      // Big celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-3">
      <button
        onClick={handleAmen}
        className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl active:scale-95 ${
          completed
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
            : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 hover:shadow-amber-500/40"
        }`}
      >
        {completed ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>今日靈修已完成（同心阿們）</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>同心阿們・完成今日靈修</span>
          </>
        )}
      </button>

      <p className="text-xs text-stone-500 dark:text-stone-400">
        {completed ? "恭喜你！點擊可取消打卡狀態" : "讀完建議禱告後，點擊以打卡記錄今日靈修"}
      </p>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { PenLine, Check } from "lucide-react";
import { getJournalNote, saveJournalNote } from "@/lib/storage";

interface JournalBoxProps {
  weekId: string;
  dayId: string;
  dayTitle: string;
}

export function JournalBox({ weekId, dayId, dayTitle }: JournalBoxProps) {
  const [note, setNote] = useState(() => getJournalNote(weekId, dayId));
  const [savedStatus, setSavedStatus] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    saveJournalNote(weekId, dayId, val);
    setSavedStatus(true);
    const timeout = setTimeout(() => setSavedStatus(false), 1500);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-amber-500/5 dark:bg-stone-900/60 border border-amber-300/40 dark:border-stone-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <PenLine className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            我的靈修筆記本（{dayTitle}）
          </h4>
        </div>

        <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
          {savedStatus ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 已自動存檔
            </span>
          ) : (
            <span>免登入・自動保存於瀏覽器</span>
          )}
        </span>
      </div>

      <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
        這篇信息觸動了你的哪一部分？面對身邊的演算法焦慮或人際壓力，今天你有哪些具體的降服或轉向？
      </p>

      <textarea
        value={note}
        onChange={handleChange}
        placeholder="在此寫下今天神對你的說話、安靜中的領受、或是寫給天父的真實禱告..."
        rows={4}
        className="w-full p-3.5 rounded-xl text-sm bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y leading-relaxed"
      />
    </div>
  );
}

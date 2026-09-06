"use client";

import { useSyncExternalStore } from "react";

const COMPLETED_KEY = "qtyouth_completed_days";
const NOTES_KEY = "qtyouth_journal_notes";
const STREAK_KEY = "qtyouth_streak_info";

export interface StreakInfo {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

let cachedCompletedDaysRaw: string | null = null;
let cachedCompletedDays: Record<string, boolean> = {};

export function getCompletedDays(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    if (raw !== cachedCompletedDaysRaw) {
      cachedCompletedDaysRaw = raw;
      cachedCompletedDays = raw ? JSON.parse(raw) : {};
    }
    return cachedCompletedDays;
  } catch {
    return {};
  }
}

export function isDayCompleted(weekId: string, dayId: string): boolean {
  const completed = getCompletedDays();
  return Boolean(completed[`${weekId}-${dayId}`]);
}

export function toggleDayCompleted(weekId: string, dayId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${weekId}-${dayId}`;
    const completed = { ...getCompletedDays() };
    const nextState = !completed[key];
    completed[key] = nextState;
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));

    // Update streak if newly completed today
    if (nextState) {
      updateStreak();
    }

    // Trigger local event so all components update immediately
    window.dispatchEvent(new Event("qt_progress_updated"));
    return nextState;
  } catch {
    return false;
  }
}

function updateStreak() {
  try {
    const today = getTodayDateString();
    const raw = localStorage.getItem(STREAK_KEY);
    const streakInfo: StreakInfo = raw ? JSON.parse(raw) : { count: 0, lastDate: "" };

    if (streakInfo.lastDate === today) {
      // Already credited today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(yesterday.getDate()).padStart(2, "0")}`;

    if (streakInfo.lastDate === yesterdayStr) {
      streakInfo.count += 1;
    } else {
      streakInfo.count = 1;
    }
    streakInfo.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakInfo));
  } catch {
    // ignore
  }
}

let cachedStreakRaw: string | null = null;
let cachedStreakCount = 0;

export function getStreakCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw !== cachedStreakRaw) {
      cachedStreakRaw = raw;
      const info: StreakInfo = raw ? JSON.parse(raw) : { count: 0, lastDate: "" };
      cachedStreakCount = info.count || 0;
    }
    return cachedStreakCount;
  } catch {
    return 0;
  }
}

export function getJournalNote(weekId: string, dayId: string): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const notes = raw ? JSON.parse(raw) : {};
    return notes[`${weekId}-${dayId}`] || "";
  } catch {
    return "";
  }
}

export function saveJournalNote(weekId: string, dayId: string, note: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const notes = raw ? JSON.parse(raw) : {};
    notes[`${weekId}-${dayId}`] = note;
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

// React 19 subscription for useSyncExternalStore
function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("qt_progress_updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("qt_progress_updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCompletedDays(): Record<string, boolean> {
  return useSyncExternalStore(
    subscribeToStorage,
    getCompletedDays,
    () => ({})
  );
}

export function useStreak(): number {
  return useSyncExternalStore(
    subscribeToStorage,
    getStreakCount,
    () => 0
  );
}

export function useIsDayCompleted(weekId: string, dayId: string): boolean {
  const completedMap = useCompletedDays();
  return Boolean(completedMap[`${weekId}-${dayId}`]);
}

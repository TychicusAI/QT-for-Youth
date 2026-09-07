import { DevotionalDay, DevotionalWeek } from "@/types/devotional";
import { week_2026_09_07 } from "@/data/weeks/2026-09-07";

// All available weekly devotionals list (sorted by latest week first)
export const allWeeks: DevotionalWeek[] = [week_2026_09_07];

export function getCurrentWeek(): DevotionalWeek {
  const current = allWeeks.find((w) => w.isCurrentWeek);
  return current || allWeeks[0];
}

export function getWeekById(weekId: string): DevotionalWeek | undefined {
  return allWeeks.find((w) => w.id === weekId);
}

export function getDayById(
  weekId: string,
  dayId: string
): { week: DevotionalWeek; day: DevotionalDay } | null {
  const week = getWeekById(weekId);
  if (!week) return null;
  const day = week.days.find((d) => d.id === dayId);
  if (!day) return null;
  return { week, day };
}

/**
 * Automatically calculates the 6-day date range (Mon to Sat) from the week ID (e.g. '2026-09-07').
 * Output: '2026.09.07 - 09.12'
 */
export function formatWeekDateRange(week: DevotionalWeek): string {
  try {
    const monday = new Date(week.id);
    if (isNaN(monday.getTime())) {
      return week.id;
    }
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    const pad = (n: number) => String(n).padStart(2, "0");
    const mYear = monday.getFullYear();
    const mMonth = pad(monday.getMonth() + 1);
    const mDate = pad(monday.getDate());

    const sMonth = pad(saturday.getMonth() + 1);
    const sDate = pad(saturday.getDate());

    if (monday.getMonth() === saturday.getMonth()) {
      return `${mYear}.${mMonth}.${mDate} - ${sDate}`;
    }
    return `${mYear}.${mMonth}.${mDate} - ${sMonth}.${sDate}`;
  } catch {
    return week.id;
  }
}

/**
 * Determines which day of the week matches today's real day.
 * JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
 */
export function getRecommendedDayIdForToday(): string {
  if (typeof window === "undefined") {
    return "mon";
  }
  const dayOfWeek = new Date().getDay();
  switch (dayOfWeek) {
    case 1:
      return "mon";
    case 2:
      return "tue";
    case 3:
      return "wed";
    case 4:
      return "thu";
    case 5:
      return "fri";
    case 6:
      return "sat";
    case 0:
    default:
      return "mon";
  }
}

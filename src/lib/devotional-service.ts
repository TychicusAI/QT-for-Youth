import { DevotionalDay, DevotionalWeek } from "@/types/devotional";
import { week01 } from "@/data/weeks/week-01";

// All available weekly devotionals list (new weeks will be registered here)
export const allWeeks: DevotionalWeek[] = [week01];

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
 * Determines which day of the week matches today's real day.
 * JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
 */
export function getRecommendedDayIdForToday(): string {
  if (typeof window === "undefined") {
    // Default server render fallback
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
      // Sunday - recommend Saturday recap or Monday
      return "mon";
  }
}

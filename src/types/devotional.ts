export interface GreekKeyword {
  word: string;
  transliteration: string;
  meaning: string;
  explanation: string;
}

export interface ExtendedStudyItem {
  title: string;
  reference: string;
  question: string;
}

export interface DevotionalDay {
  id: string; // e.g. 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'
  dayNumber: number; // 1 - 6
  dayLabel: string; // e.g. '週一', '週二'
  title: string; // Short title
  subtitle?: string; // Subtitle theme
  scriptureRef: string; // e.g. '哥林多後書 1:1-2'
  scriptureVersion: string; // e.g. '和合本'
  scriptureText: string;
  goldenVerse: string;
  readTimeMinutes: number;
  message: string; // Full message content with markdown formatting
  keywords?: GreekKeyword[];
  suggestedPrayer: string;
  extendedStudy: ExtendedStudyItem[];
  meditationQuestion?: string;
}

export interface DevotionalWeek {
  id: string; // Weekly Monday date e.g. '2026-09-07'
  startDate?: string; // e.g. '2026-09-07'
  title: string; // e.g. '死地中的凱歌'
  book: string; // e.g. '哥林多後書 1:1-11'
  subtitle?: string; // e.g. '六日深度研經靈修手冊'
  goldenVerse: {
    text: string;
    reference: string;
  };
  foreword: string;
  days: DevotionalDay[];
  publishedAt: string;
  isCurrentWeek?: boolean;
}

export interface UserQTProgress {
  completedDays: Record<string, boolean>; // key: `${weekId}-${dayId}`
  notes: Record<string, string>; // key: `${weekId}-${dayId}`
  streak: number;
  lastCompletedDate?: string;
}

import { DevotionalWeek, DevotionalDay, ExtendedStudyItem, GreekKeyword } from "@/types/devotional";

const DAY_MAP: Record<string, { id: string; dayNumber: number }> = {
  週一: { id: "mon", dayNumber: 1 },
  週二: { id: "tue", dayNumber: 2 },
  週三: { id: "wed", dayNumber: 3 },
  週四: { id: "thu", dayNumber: 4 },
  週五: { id: "fri", dayNumber: 5 },
  週六: { id: "sat", dayNumber: 6 },
  週日: { id: "sun", dayNumber: 7 },
};

export function parseDevotionalMarkdown(fileContent: string, fileId: string): DevotionalWeek {
  const lines = fileContent.split("\n");

  // 1. Extract Title
  let title = "靈修手冊";
  let book = "經文精選";
  let i = 0;

  // Header parsing
  while (i < lines.length && !lines[i].startsWith("## ")) {
    const line = lines[i].trim();
    if (line && !line.startsWith("===") && !line.startsWith("經文範圍：") && title === "靈修手冊") {
      title = line;
    } else if (line.startsWith("經文範圍：")) {
      book = line.replace("經文範圍：", "").trim();
    }
    i++;
  }

  // 2. Extract Foreword
  let foreword = "";
  if (i < lines.length && lines[i].includes("前言")) {
    i++; // skip header
    const forewordLines: string[] = [];
    while (i < lines.length && !lines[i].startsWith("## 【")) {
      forewordLines.push(lines[i]);
      i++;
    }
    foreword = forewordLines.join("\n").trim();
  }

  // 3. Extract Days
  const daysContent = lines.slice(i).join("\n");
  const daySections = daysContent.split(/(?=##\s*【週[一二三四五六日]】)/g);

  const days: DevotionalDay[] = [];

  for (const sec of daySections) {
    const trimmed = sec.trim();
    if (!trimmed) continue;

    const dayMatch = trimmed.match(/##\s*【(週[一二三四五六日])】(?:[^\n]*)?\n([\s\S]*)/);
    if (!dayMatch) continue;

    const dayLabel = dayMatch[1];
    const dayBody = dayMatch[2];
    const dayInfo = DAY_MAP[dayLabel] || { id: "mon", dayNumber: 1 };

    // Parse sub-sections
    // Theme
    const themeMatch = dayBody.match(/###\s*【主題】\s*\n+([^\n#]+)/);
    const theme = themeMatch ? themeMatch[1].trim() : `${dayLabel} 靈修`;

    // Scripture
    let scriptureVersion = "和合本";
    const versionMatch = dayBody.match(/###\s*【經文】[（(]([^）)]+)[）)]/);
    if (versionMatch) {
      scriptureVersion = versionMatch[1].trim();
    }

    let scriptureText = "";
    let scriptureRef = book;
    const scriptureBlockMatch = dayBody.match(/###\s*【經文】[^\n]*\n+([\s\S]*?)(?=###|$)/);
    if (scriptureBlockMatch) {
      const block = scriptureBlockMatch[1].trim();
      // Look for quote and ref
      const quoteMatch = block.match(/>\s*([「"“][\s\S]*?[」"”])(?:\s*[（(]([^）)]+)[）)])?/);
      if (quoteMatch) {
        scriptureText = quoteMatch[1].trim();
        if (quoteMatch[2]) {
          scriptureRef = quoteMatch[2].trim();
        }
      } else {
        scriptureText = block.replace(/^>\s*/gm, "").trim();
      }
    }

    // Message
    let message = "";
    const messageMatch = dayBody.match(/###\s*【信息】\s*\n+([\s\S]*?)(?=###\s*【建議禱告】|###|$)/);
    if (messageMatch) {
      message = messageMatch[1].trim();
    }

    // Suggested Prayer
    let suggestedPrayer = "";
    const prayerMatch = dayBody.match(/###\s*【建議禱告】\s*\n+([\s\S]*?)(?=###\s*【延伸研讀】|###|$)/);
    if (prayerMatch) {
      suggestedPrayer = prayerMatch[1].trim().replace(/^[「"“]|["”」]$/g, "");
    }

    // Extended Study
    const extendedStudy: ExtendedStudyItem[] = [];
    const extendedMatch = dayBody.match(/###\s*【延伸研讀】\s*\n+([\s\S]*?)(?=###\s*【默想問題】|###|$)/);
    if (extendedMatch) {
      const extLines = extendedMatch[1].trim().split("\n");
      let currentItem: Partial<ExtendedStudyItem> | null = null;
      for (const el of extLines) {
        const itemHeaderMatch = el.match(/^\d+\.\s*\*\*([^*]+)\*\*(?:\s*(.*))?$/);
        if (itemHeaderMatch) {
          if (currentItem && currentItem.title) {
            extendedStudy.push(currentItem as ExtendedStudyItem);
          }
          currentItem = {
            title: itemHeaderMatch[1].trim(),
            reference: itemHeaderMatch[1].trim(),
            question: itemHeaderMatch[2] ? itemHeaderMatch[2].trim() : "",
          };
        } else if (el.trim().startsWith("*") && currentItem) {
          const content = el.trim().replace(/^\*+|\*+$/g, "").trim();
          currentItem.question = currentItem.question ? `${currentItem.question} ${content}` : content;
        }
      }
      if (currentItem && currentItem.title) {
        extendedStudy.push(currentItem as ExtendedStudyItem);
      }
    }

    // Meditation Question
    let meditationQuestion = "";
    const medMatch = dayBody.match(/###\s*【默想問題】\s*\n+([\s\S]*?)(?=##|$)/);
    if (medMatch) {
      meditationQuestion = medMatch[1].trim().replace(/^[「"“]|["”」]$/g, "");
    }

    // Keywords extraction from message
    const keywords: GreekKeyword[] = [];
    const keywordMatches = message.matchAll(/([^\s，。、「」]+)（([A-Za-z\s'’ēōē-]+)(?:，([^）]+))?）/g);
    const seen = new Set<string>();
    for (const km of keywordMatches) {
      const word = km[2]?.trim();
      if (word && !seen.has(word) && word.length > 2 && seen.size < 4) {
        seen.add(word);
        keywords.push({
          word,
          transliteration: km[1]?.trim() || "",
          meaning: km[3]?.trim() || km[1]?.trim() || "",
          explanation: `經文關鍵詞：${km[1]?.trim()}`,
        });
      }
    }

    // Golden Verse snippet
    const goldenVerse = scriptureText.length > 80 ? `${scriptureText.slice(0, 80)}...` : scriptureText;

    days.push({
      id: dayInfo.id,
      dayNumber: dayInfo.dayNumber,
      dayLabel,
      title: theme,
      subtitle: `${dayLabel} 深度默想`,
      scriptureRef,
      scriptureVersion,
      scriptureText,
      goldenVerse: goldenVerse.replace(/^[「"“]|["”」]$/g, ""),
      readTimeMinutes: Math.max(5, Math.ceil(message.length / 300)),
      message,
      keywords,
      suggestedPrayer,
      extendedStudy,
      meditationQuestion,
    });
  }

  // Golden Verse for the week: take from day 3 (Wed) or first available
  const defaultGoldenVerse = days[2]?.goldenVerse || days[0]?.goldenVerse || "";
  const defaultGoldenRef = days[2]?.scriptureRef || days[0]?.scriptureRef || book;

  return {
    id: fileId,
    startDate: fileId,
    title,
    book,
    subtitle: "六日深度研經靈修手冊",
    goldenVerse: {
      text: defaultGoldenVerse,
      reference: defaultGoldenRef,
    },
    foreword,
    days,
    publishedAt: fileId,
    isCurrentWeek: true,
  };
}

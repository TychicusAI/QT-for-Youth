import fs from "fs";
import path from "path";

const DAY_MAP = {
  週一: { id: "mon", dayNumber: 1 },
  週二: { id: "tue", dayNumber: 2 },
  週三: { id: "wed", dayNumber: 3 },
  週四: { id: "thu", dayNumber: 4 },
  週五: { id: "fri", dayNumber: 5 },
  週六: { id: "sat", dayNumber: 6 },
  週日: { id: "sun", dayNumber: 7 },
};

const BIBLE_BOOK_MAP = {
  創世記: "Gen", 出埃及記: "Exod", 利未記: "Lev", 民數記: "Num", 申命記: "Deut",
  約書亞記: "Josh", 士師記: "Judg", 路得記: "Ruth", 撒母耳記上: "1Sam", 撒母耳記下: "2Sam",
  列王紀上: "1Kgs", 列王紀下: "2Kgs", 歷代志上: "1Chr", 歷代志下: "2Chr", 以斯拉記: "Ezra",
  尼希米記: "Neh", 以斯帖記: "Esth", 約伯記: "Job", 詩篇: "Ps", 箴言: "Prov",
  傳道書: "Eccl", 雅歌: "Song", 以賽亞書: "Isa", 耶利米書: "Jer", 耶利米哀歌: "Lam",
  以西結書: "Ezek", 但以理書: "Dan", 何西阿書: "Hos", 約珥書: "Joel", 阿摩司書: "Amos",
  俄巴底亞書: "Obad", 約拿書: "Jonah", 彌迦書: "Mic", 那鴻書: "Nah", 哈巴谷書: "Hab",
  西番雅書: "Zeph", 哈該書: "Hag", 撒迦利亞書: "Zech", 瑪拉基書: "Mal",
  馬太福音: "Matt", 馬可福音: "Mark", 路加福音: "Luke", 約翰福音: "John", 使徒行傳: "Acts",
  羅馬書: "Rom", 哥林多前書: "1Cor", 哥林多後書: "2Cor", 加拉太書: "Gal", 以弗所書: "Eph",
  腓立比書: "Phil", 歌羅西書: "Col", 帖撒羅尼迦前書: "1Thess", 帖撒羅尼迦後書: "2Thess",
  提摩太前書: "1Tim", 提摩太後書: "2Tim", 提多書: "Titus", 腓利門書: "Phlm", 希伯來書: "Heb",
  雅各書: "Jas", 彼得前書: "1Pet", 彼得後書: "2Pet", 約翰一書: "1John", 約翰二書: "2John",
  約翰三書: "3John", 猶大書: "Jude", 啟示錄: "Rev"
};

function getBibliaUrl(ref) {
  if (!ref) return "";
  const match = ref.match(/^([\u4e00-\u9fa5]+)\s*(\d+)(?:[:：](\d+(?:-\d+)?))?/);
  if (!match) return "";
  const bookName = match[1];
  const chapter = match[2];
  const verse = match[3];
  const bookCode = BIBLE_BOOK_MAP[bookName];
  if (!bookCode) return "";
  const passage = verse ? `${bookCode}${chapter}.${verse}` : `${bookCode}${chapter}`;
  return `https://biblia.com/books/hlybbltrdshndtn/${passage}`;
}

function parseMarkdown(content, fileId) {
  const lines = content.split("\n");

  let title = "在深淵中仰望叫死人復活的神";
  let book = "哥林多後書 1:1-11";
  let i = 0;

  // Header parsing
  while (i < lines.length && !lines[i].startsWith("## ")) {
    const line = lines[i].trim();
    if (line && !line.startsWith("===") && !line.startsWith("經文範圍：") && !line.startsWith("#")) {
      title = line;
    } else if (line.startsWith("經文範圍：")) {
      book = line.replace("經文範圍：", "").trim();
    }
    i++;
  }

  // Foreword
  let foreword = "";
  if (i < lines.length && lines[i].includes("前言")) {
    i++;
    const forewordLines = [];
    while (i < lines.length && !lines[i].startsWith("## 【")) {
      forewordLines.push(lines[i]);
      i++;
    }
    foreword = forewordLines.join("\n").trim();
  }

  const daysContent = lines.slice(i).join("\n");
  const daySections = daysContent.split(/(?=##\s*【週[一二三四五六日]】)/g);
  const days = [];

  for (const sec of daySections) {
    const trimmed = sec.trim();
    if (!trimmed) continue;

    const dayMatch = trimmed.match(/##\s*【(週[一二三四五六日])】(?:[^\n]*)?\n([\s\S]*)/);
    if (!dayMatch) continue;

    const dayLabel = dayMatch[1];
    const dayBody = dayMatch[2];
    const dayInfo = DAY_MAP[dayLabel] || { id: "mon", dayNumber: 1 };

    // Theme
    const themeMatch = dayBody.match(/###\s*【主題】\s*\n+([^\n#]+)/);
    const theme = themeMatch ? themeMatch[1].trim() : `${dayLabel} 靈修`;

    // Scripture version & text & ref
    let scriptureVersion = "";
    const versionMatch = dayBody.match(/###\s*【經文】[（(]([^）)]+)[）)]/);
    if (versionMatch) {
      scriptureVersion = versionMatch[1].trim();
    }

    let scriptureText = "";
    let scriptureRef = book;
    const scriptureBlockMatch = dayBody.match(/###\s*【經文】[^\n]*\n+([\s\S]*?)(?=###|$)/);
    if (scriptureBlockMatch) {
      const block = scriptureBlockMatch[1].trim();
      const refMatch = block.match(/[（(]([^）)]+)[）)]\s*$/);
      if (refMatch) {
        scriptureRef = refMatch[1].trim();
      }
      const cleanBlock = block.replace(/[（(][^）)]+[）)]\s*$/, "").replace(/^>\s*/gm, "").trim();
      scriptureText = cleanBlock.replace(/^[「"“]|["”」]$/g, "").trim();
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
    const extendedStudy = [];
    const extendedMatch = dayBody.match(/###\s*【延伸研讀】\s*\n+([\s\S]*?)(?=###\s*【默想問題】|###|$)/);
    if (extendedMatch) {
      const extLines = extendedMatch[1].trim().split("\n");
      let currentItem = null;
      for (const el of extLines) {
        const itemHeaderMatch = el.match(/^\d+\.\s*\*\*([^*]+)\*\*(?:\s*(.*))?$/);
        if (itemHeaderMatch) {
          if (currentItem && currentItem.title) {
            extendedStudy.push(currentItem);
          }
          const ref = itemHeaderMatch[1].trim();
          currentItem = {
            title: ref,
            reference: ref,
            text: "",
            question: itemHeaderMatch[2] ? itemHeaderMatch[2].trim() : "",
            bibliaUrl: getBibliaUrl(ref),
          };
        } else if (el.trim().startsWith(">") && currentItem) {
          const scriptureQuote = el.trim().replace(/^>\s*/, "").replace(/^[「"“]|["”」]$/g, "").trim();
          currentItem.text = currentItem.text ? `${currentItem.text} ${scriptureQuote}` : scriptureQuote;
        } else if (el.trim().startsWith("*") && currentItem) {
          const content = el.trim().replace(/^\*+|\*+$/g, "").trim();
          currentItem.question = currentItem.question ? `${currentItem.question} ${content}` : content;
        }
      }
      if (currentItem && currentItem.title) {
        extendedStudy.push(currentItem);
      }
    }

    // Meditation Question
    let meditationQuestion = "";
    const medMatch = dayBody.match(/###\s*【默想問題】\s*\n+([\s\S]*?)(?=##|$)/);
    if (medMatch) {
      meditationQuestion = medMatch[1].trim().replace(/^[「"“]|["”」]$/g, "");
    }

    const cleanQuote = scriptureText.replace(/^[「"“]|["”」]$/g, "");
    const goldenVerse = cleanQuote.length > 90 ? `${cleanQuote.slice(0, 90)}...` : cleanQuote;

    days.push({
      id: dayInfo.id,
      dayNumber: dayInfo.dayNumber,
      dayLabel,
      title: theme,
      scriptureRef,
      scriptureVersion,
      scriptureText,
      goldenVerse,
      readTimeMinutes: Math.max(5, Math.ceil(message.length / 280)),
      message,
      suggestedPrayer,
      extendedStudy,
      meditationQuestion,
    });
  }

  // Golden verse for the week
  const defaultGoldenVerse = days[2]?.goldenVerse || days[0]?.goldenVerse || "我們既多受基督的苦楚、靠基督多得安慰。";
  const defaultGoldenRef = days[2]?.scriptureRef || days[0]?.scriptureRef || "哥林多後書 1:5";

  return {
    id: fileId,
    startDate: fileId,
    title,
    book,
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

// Find all markdown files in data (primary) or src/data (fallback)
const candidateDirs = [path.join(process.cwd(), "data"), path.join(process.cwd(), "src", "data")];

const weeksOutputDir = path.join(process.cwd(), "src", "data", "weeks");
if (!fs.existsSync(weeksOutputDir)) {
  fs.mkdirSync(weeksOutputDir, { recursive: true });
}

const foundFiles = [];
const seenFilenames = new Set();
for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      if (!seenFilenames.has(f)) {
        seenFilenames.add(f);
        foundFiles.push({ filename: f, fullPath: path.join(dir, f) });
      }
    }
  }
}

console.log(`Found ${foundFiles.length} markdown file(s)...`);

const generatedWeeks = [];

for (const { filename, fullPath } of foundFiles) {
  const fileId = filename.replace(/\.md$/, "");
  const content = fs.readFileSync(fullPath, "utf-8");
  const weekObj = parseMarkdown(content, fileId);

  const outTsPath = path.join(weeksOutputDir, `${fileId}.ts`);
  const safeVarName = `week_${fileId.replace(/-/g, "_")}`;

  const tsContent = `import { DevotionalWeek } from "@/types/devotional";\n\nexport const ${safeVarName}: DevotionalWeek = ${JSON.stringify(
    weekObj,
    null,
    2
  )};\n`;

  fs.writeFileSync(outTsPath, tsContent, "utf-8");
  console.log(`✓ Generated: ${outTsPath} (${weekObj.title}, ${weekObj.days.length} days)`);
  generatedWeeks.push({ fileId, safeVarName });
}

// Regenerate devotional-service.ts imports
const servicePath = path.join(process.cwd(), "src", "lib", "devotional-service.ts");
const imports = generatedWeeks
  .map((w) => `import { ${w.safeVarName} } from "@/data/weeks/${w.fileId}";`)
  .join("\n");
const list = `export const allWeeks: DevotionalWeek[] = [${generatedWeeks
  .map((w) => w.safeVarName)
  .join(", ")}];`;

const serviceContent = `import { DevotionalDay, DevotionalWeek } from "@/types/devotional";
${imports}

// All available weekly devotionals list (sorted by latest week first)
${list}

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
      return \`\${mYear}.\${mMonth}.\${mDate} - \${sDate}\`;
    }
    return \`\${mYear}.\${mMonth}.\${mDate} - \${sMonth}.\${sDate}\`;
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
`;

fs.writeFileSync(servicePath, serviceContent, "utf-8");
console.log(`✓ Updated devotional-service.ts with ${generatedWeeks.length} week(s)`);

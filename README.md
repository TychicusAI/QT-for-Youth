# QT for Youth（青年靈修平台）

專為青年基督徒量身打造的現代互動式靈修（Quiet Time）Web 應用。每週深度研經，立足於十字架與復活，陪伴青年在升學、職場與人際風浪中，拆毀自我信靠的焦慮堡壘，活出天國的尊貴身份。

---

## 🌟 核心特色

1. **今日靈修智慧通道（Today's Walk）**：
   * 首頁 Hero 卡片根據當前星期幾自動對焦「今日靈修」，一鍵進入閱讀，降低靈修啟動阻力。
2. **六日靈修旅程（6-Day Journey）**：
   * 完整呈現每週主題、前言導讀、每日經文、希臘原文解析、深度信息、禱告與延伸研讀。
3. **青年靈修工具箱（Youth Faith Toolkit）**：
   * **金句卡片產生器**：一鍵套用晨曦、星夜、清心、雅致四款美感背景，生成社群分享圖文。
   * **靜心深呼吸計時器**：內建 3/5/10 分鐘安靜默想引導，陪伴青年在閱讀前安息在主前。
4. **Local-first 靈修打卡與心得筆記**：
   * 青年無需繁瑣註冊登入即可在頁面直接記錄個人靈修心得與完成「同心阿們」打卡。
   * 所有資料均即時自動保存在使用者本機瀏覽器（LocalStorage），隱私安全且永不遺失。
5. **深色／淺色模式切換**：
   * 晨禱時使用溫暖雅致的淺色紙感，夜間默想時一鍵切換柔和深色護眼模式。

---

## 🚀 快速啟動

```bash
# 安裝相依套件
npm install

# 啟動本地開發伺服器
npm run dev

# 構建生產版本（靜態預渲染 SSG）
npm run build
npm run start
```

瀏覽器打開 `http://localhost:3000` 即可預覽。

---

## 📖 如何每週新增靈修教材？

每週新增教材非常簡單，只需兩步：

### 步驟 1：建立新的週次檔案
在 `src/data/weeks/` 目錄下建立新檔案，例如 `week-02.ts`（可複製 `week-01.ts` 作為範本）：

```ts
import { DevotionalWeek } from "@/types/devotional";

export const week02: DevotionalWeek = {
  id: "week-02",
  weekNumber: 2,
  dateRange: "2026 第 37 週",
  title: "本週主題名稱",
  book: "經卷範圍 (如：歌羅西書 1:1-14)",
  subtitle: "六日深度研經靈修手冊",
  goldenVerse: {
    text: "核心金句文字",
    reference: "經文出處"
  },
  foreword: "本週主題導言與前言...",
  publishedAt: "2026-09-13",
  isCurrentWeek: true, // 設為 true 成為首頁當前主打
  days: [
    // 週一到週六的 6 篇靈修內容（包含 title, scriptureRef, scriptureText, message, suggestedPrayer, keywords, extendedStudy 等）
  ]
};
```

### 步驟 2：註冊新週次
在 `src/lib/devotional-service.ts` 中將新週次加入清單：

```ts
import { week01 } from "@/data/weeks/week-01";
import { week02 } from "@/data/weeks/week-02"; // 匯入新的一週

export const allWeeks: DevotionalWeek[] = [week02, week01];
```

網站便會自動更新首頁焦點、歷史歸檔與所有 6 日靜態靈修頁面！

---

## 🛠️ 技術棧

* **Framework**：Next.js 16 (App Router, Turbopack, React 19)
* **Styling**：Tailwind CSS v4 (Warm Spiritual Palette, Dark Mode)
* **Icons**：Lucide React
* **Micro-interactions**：canvas-confetti
* **Storage**：Browser LocalStorage + `useSyncExternalStore` (Zero backend overhead)

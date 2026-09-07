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

每週新增教材極其簡單，**完全不需要寫任何程式碼**：

### 只要一步：放入 Markdown 檔案
在專案根目錄的 `data/` 資料夾下，新增以當週週一日期命名的 Markdown 檔案（例如 `data/2026-09-14.md`）。

系統在 `npm run dev` 或 `npm run build`（包括 Vercel 部署）時，會**全自動解析該 Markdown 檔案，自動生成型別定義與靜態頁面**，並自動推算日期區間（如 `2026.09.14 - 09.19`）！

您也可以手動執行一次同步檢查：
```bash
npm run sync
```

---

## 📂 專案目錄結構說明

```
QT-for-Youth/
├── data/                         # 原始每週靈修 Markdown 材料（如 2026-09-07.md）
├── scripts/                      # 自動化腳本（如 sync-markdown.mjs 自動轉換教材）
├── public/                       # 靜態公開資源
├── src/
│   ├── app/                      # Next.js App Router 路由與頁面
│   │   ├── devotional/[weekId]/[dayId]/ # 每日靈修閱讀頁面（SSG 靜態預渲染）
│   │   ├── globals.css           # 全域樣式與色調設定
│   │   ├── layout.tsx            # 根版面配置
│   │   └── page.tsx              # 首頁入口
│   ├── components/               # 互動式 UI 組件（卡片、計時器、金句分享等）
│   ├── data/weeks/               # 自動由 data/*.md 生成的週次 TypeScript 資料
│   ├── lib/                      # 核心工具函式（儲存、週次服務）
│   └── types/                    # TypeScript 型別定義
├── next.config.ts                # Next.js 設定
└── package.json                  # 套件依賴與腳本
```

---

## 🛠️ 技術棧

* **Framework**：Next.js 16 (App Router, Turbopack, React 19)
* **Styling**：Tailwind CSS v4 (Warm Spiritual Palette, Dark Mode)
* **Icons**：Lucide React
* **Micro-interactions**：canvas-confetti
* **Storage**：Browser LocalStorage + `useSyncExternalStore` (Zero backend overhead)

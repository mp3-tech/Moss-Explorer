# AI 蘚苔探險家 (Moss Explorer)

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-success?logo=github)](https://mp3-tech.github.io)
[![Python](https://img.shields.io/badge/Scraper-Python%203.10+-blue?logo=python)](#)
[![License](https://img.shields.io/badge/Data-GBIF%20%7C%20iNaturalist-green)](#)

 
 專為高中生打造的科展與小論文學習資訊平台。結合 **GBIF 開放資料**、**前端互動工具**與 **AI 圖像辨識邏輯**，帶領學生完成從「提問」、「探索」到「發表」的完整科學研究旅程。

---

# 核心特色與功能導覽

本平台提供多樣化的互動頁面，將研究歷程系統化地分為三大模組：

探險與學習 (Explore & Learn)
* **`index.html`**：平台入口首頁，包含 Quest 探險任務導覽。
* **`quest.html`**：Quest 1–5 研究歷程步驟詳細說明。
* **`microscope.html`**：微觀探險儀（苔蘚觀察基礎介紹）。
* **`ai-logic.html`**：AI 腦袋怎麼動（圖像辨識與矩陣比對原理）。
* **`issues.html`**：延伸議題探索（如：空氣汙染、全球暖化、商業應用等）。

# 研究工具箱 (Research Tools)
* **`tools.html`**：研究輔助小工具總覽。
* **`matrix.html`**：苔蘚特徵矩陣比對器（即時讀取資料庫，協助物種特徵篩選）。
* **`ratio-calculator.html`**：AI 訓練資料集比例計算機。
* **`palette.html`**：學術海報配色建議工具。
* **`countdown.html`**：科展投稿倒數計時器。

### 資源與支援 (Resources & Support)
* **`calendar.html`**：館員諮詢服務月時間表。
* **`glossary.html`**：關鍵詞彙索引典（完整包含 BT/NT/RT 關聯）。
* **`resources.html`**：外部權威資源（組織名錄、學術期刊、研討會推薦）。
* **`about.html`**：關於本站（平台理念、適用對象與 AI 使用聲明）。

---

## 專案目錄結構

專案採用前後端分離概念，以靜態網頁搭配本地端 Python 爬蟲更新資料：

```text
mp3-tech.github.io/
├── frontend/               # 網站前端所有頁面與資源
│   ├── data/
│   │   └── moss_matrix.json # 苔蘚特徵資料庫（由爬蟲匯出後部署）
│   ├── css/style.css       # 核心樣式表
│   ├── js/main.js          # 共用互動腳本
│   └── *.html              # 各功能頁面
├── moss_scraper/           # 後台爬蟲腳本（本地執行，不推送至遠端）
│   ├── scraper.py          # GBIF 資料抓取主程式
│   ├── upload_to_supabase.py # 資料庫串接腳本
│   ├── .env.example        # 環境變數範例檔
│   └── output/             # 爬蟲自動匯出目錄
├── .gitignore              # Git 忽略清單（包含 .env 等敏感資訊）
└── README.md               # 專案說明文件

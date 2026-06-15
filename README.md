# 🌿 Moss Explorer (青苔探索者)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20JS%20%7C%20CSS-orange)
![Backend](https://img.shields.io/badge/Data-Python%20%7C%20Supabase-green)

**Moss Explorer** 是一個專為高中生與自然科學愛好者設計的開源教育工具。本專案透過視覺化的前端介面與強大的後端資料庫，幫助學習者輕鬆進行「青苔特徵矩陣 (Moss Feature Matrix)」的比較與分析，降低生物分類學的學習門檻。

## ✨ 核心特色 (Features)

*   **🔍 互動式特徵矩陣 (Interactive Matrix)**：提供直覺的介面（`matrix.html`）讓學生能交叉比對不同苔蘚的生物特徵。
*   **🛠️ 豐富的探索工具 (Exploration Tools)**：內建顯微鏡視角模擬 (`microscope.html`)、比例計算機 (`ratio-calculator.html`) 與互動式問答 (`quest.html`)。
*   **🤖 AI 輔助邏輯 (AI-Logic)**：預留 AI 模組 (`ai-logic.html`)，協助自動分類與特徵辨識。
*   **📊 自動化資料爬取與儲存 (Automated Scraper & DB)**：內建 Python 爬蟲，能自動抓取最新的苔蘚數據，並透過腳本一鍵同步至 **Supabase** 資料庫。
*   **⚙️ CI/CD 整合**：包含 GitHub Actions 自動化部署流程 (`deploy.yml`)。

## 📂 專案架構 (Repository Structure)

專案主要分為「前端介面」與「資料處理」兩大模組：

```text
Moss-Explorer/
├── frontend/                  # 使用者介面與互動邏輯
│   ├── index.html             # 網站入口
│   ├── matrix.html            # 核心特徵矩陣比較工具
│   ├── ai-logic.html          # AI 邏輯與分析模組
│   ├── js/ & css/             # 核心 JavaScript 邏輯與樣式表
│   └── data/                  # 靜態 JSON 備用資料 (moss_matrix.json)
├── moss_scraper/              # Python 資料獲取與資料庫同步模組
│   ├── scraper.py             # 苔蘚特徵資料爬蟲
│   ├── upload_to_supabase.py  # Supabase 資料庫上傳腳本
│   ├── database/schema.sql    # 資料庫表結構 (SQL)
│   └── output/                # 爬蟲輸出的 CSV/JSON 暫存區
└── .github/workflows/         # GitHub Actions 自動化工作流
快速開始 (Getting Started)
1. 前端環境 (Frontend)
前端採靜態網頁設計，無需複雜的編譯過程：

將 Repository clone 到本地端。

直接使用瀏覽器開啟 frontend/index.html，或使用 VS Code 的 Live Server 啟動。

2. 資料爬蟲與資料庫 (Data Scraper & Supabase)
若要更新資料庫或執行爬蟲：

進入 moss_scraper/ 目錄。

複製環境變數範例檔：cp .env.example .env，並填入您的 Supabase URL 與 API Key。

安裝所需套件（建議使用虛擬環境）。

執行爬蟲：python scraper.py

同步至資料庫：python upload_to_supabase.py

🤝 參與貢獻 (Contributing)
我們非常歡迎開發者、教育工作者與生物學愛好者加入維護！無論是：

修復前端 Bug 或優化 UI/UX

擴充 Python 爬蟲的資料來源

完善教育文件與 Glossary (詞彙表)

導入 AI 自動化程式碼審查與 Issue 分流 (Current Focus)

請直接發送 Pull Request，或在 Issues 區塊提出您的想法。針對開源新手，請參考 issues.html 中的指引。

📄 授權條款 (License)
本專案採用開源授權，鼓勵教育用途的散佈與修改。

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

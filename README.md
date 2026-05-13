# 🌿 AI 蘚苔探險家 — mp3-tech.github.io

> 114-2 科技文獻 期中報告 · 第五組 · 資圖三 B  
> 以高中科展與小論文學習為核心的資訊平台，結合 GBIF 開放資料與前端互動工具，帶領高中生完成從「提問」到「發表」的完整研究旅程。

---

## 📁 專案結構

```
mp3-tech.github.io/
├── frontend/          # 網站所有頁面與資源
│   ├── data/
│   │   └── moss_matrix.json   # 苔蘚特徵資料（由爬蟲產生後複製過來）
│   ├── css/style.css
│   ├── js/main.js
│   └── *.html
├── moss_scraper/      # 爬蟲腳本（本地執行，不上傳 GitHub）
│   ├── scraper.py
│   ├── upload_to_supabase.py
│   ├── .env.example
│   └── output/        # 爬蟲輸出（不上傳 GitHub）
├── .gitignore
└── README.md
```

---

## 🌐 網站頁面說明

| 頁面 | 功能 |
|------|------|
| `index.html` | 首頁，含 Quest 探險任務導覽與投稿倒數 |
| `quest.html` | Quest 1–5 研究歷程步驟說明 |
| `tools.html` | 研究工具箱總覽 |
| `countdown.html` | 科展投稿倒數計時器 |
| `calendar.html` | 館員諮詢服務月時間表 |
| `palette.html` | 海報配色建議工具 |
| `matrix.html` | 苔蘚特徵矩陣比對器（讀取 GBIF 資料） |
| `ratio-calculator.html` | AI 訓練資料集比例計算機 |
| `microscope.html` | 微觀探險儀（苔蘚觀察介紹） |
| `ai-logic.html` | AI 腦袋怎麼動（圖像辨識原理） |
| `issues.html` | 延伸議題探索（空汙、暖化、商業等） |
| `glossary.html` | 關鍵詞彙索引典（含 BT/NT/RT） |
| `resources.html` | 可供參考外部資源（組織、期刊、研討會） |
| `about.html` | 關於探險（平台理念與 AI 使用聲明） |

---

## 🕷️ 爬蟲使用方式

苔蘚特徵資料來源為 **GBIF**（全球生物多樣性資訊機構），爬取蘚類、苔類、角苔類三大類群。

### 環境需求

- Python 3.10 以上
- 網際網路連線

### 第一次執行

```bash
# 1. 進入爬蟲資料夾
cd moss_scraper

# 2. 安裝依賴套件
pip install requests python-dotenv supabase

# 3. 執行爬蟲
python scraper.py
```

爬完後 `output/` 資料夾會產生：

```
moss_scraper/output/
├── moss_matrix.csv    # 可用 Excel 開啟查看
└── moss_matrix.json   # 供網站讀取
```

### 更新網站資料

將爬蟲產出的 JSON 複製到網站的 `data/` 資料夾：

```bash
# Windows
copy output\moss_matrix.json ..\frontend\data\moss_matrix.json

# Mac / Linux
cp output/moss_matrix.json ../frontend/data/moss_matrix.json
```

複製完成後，`matrix.html` 的查詢功能就會自動使用新資料，**不需要重新部署**。

### 爬蟲參數說明

開啟 `scraper.py`，在最底部的 `if __name__ == "__main__":` 區塊可調整：

```python
# GBIF（主要資料來源）
gbif_records = fetch_gbif(pages=3)
# pages=3 → 每個類群 300 筆，三群合計最多 900 筆
# 增加 pages 數字可爬更多筆
```

GBIF 爬取的三大類群與對應 taxonKey：

| 類群 | 中文 | taxonKey |
|------|------|----------|
| Bryophyta | 蘚類 | 35 |
| Marchantiophyta | 苔類 | 7707 |
| Anthocerotophyta | 角苔類 | 7708 |

---

## 🚀 部署說明

本網站為**純靜態網站**，不需要後端伺服器，直接部署到 GitHub Pages 即可。

### 部署到 GitHub Pages

```bash
# 1. 初始化 Git（第一次）
git init
git remote add origin https://github.com/mp3-tech/mp3-tech.github.io.git

# 2. 每次更新
git add .
git commit -m "更新說明（例如：更新苔蘚資料、修正 matrix.html）"
git push origin main
```

推送後約 1–2 分鐘，網站會自動更新於：  
👉 `https://mp3-tech.github.io`

### .gitignore 重要說明

以下項目**不應上傳** GitHub，已加入 `.gitignore`：

```
.env                    # 含有 Supabase 金鑰，絕對不能公開
moss_scraper/output/    # 爬蟲輸出，透過複製流程手動更新到 frontend/data/
```

---

## 📊 資料來源

| 來源 | 類型 | 授權 |
|------|------|------|
| [GBIF](https://www.gbif.org) | 苔蘚物種觀測資料 | CC BY 4.0 |
| [iNaturalist](https://www.inaturalist.org) | 生態觀測記錄 | CC BY-NC 4.0 |

---

## 👥 分工說明

| 成員 | 工作內容 |
|------|---------|
| 李旻昕（組長） | 索引典、校對 |
| 林幸甄 | 上台報告 |
| 高人鳳 | 參考文獻與 AI 引用、排版 |
| 李昀翰 | 相關學科與素養介紹、延伸議題 |
| 鄧凱謙 | 組織名錄、期刊、研討會、輔助小工具 |
| 梁毓婷 | 網頁品牌形象、適用對象說明、網頁地圖 |

---

## 🤖 AI 使用聲明

本專案在開發過程中使用 AI 工具輔助，範圍包含：

1. **文本轉譯**：將學術步驟轉化為高中生易讀的「探險任務」語言
2. **工具架構**：協助梳理 Vibe Coding 輔助工具的功能邏輯
3. **文獻檢索**：萃取關鍵字後，人工至正規資料庫（Scopus、Google Scholar）查證

所有文獻皆由團隊親自確認來源真實性，杜絕 AI 幻覺（Hallucination）風險。

---

*最後更新：2026 年 5 月*

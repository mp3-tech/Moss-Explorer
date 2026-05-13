"""
upload_to_supabase.py
=====================
爬蟲跑完後，執行這支程式把 output/moss_matrix.json 寫入 Supabase。

安裝依賴：
    pip install supabase python-dotenv

執行方式：
    1. 複製 .env.example 為 .env，填入你的 Supabase URL 和 KEY
    2. 先跑 scraper.py 產生 output/moss_matrix.json
    3. python upload_to_supabase.py
"""

import json
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("❌ 請先設定 .env 檔案（參考 .env.example）")

# ── 讀取爬蟲輸出 ───────────────────────────────────────────────────────────────

json_path = Path("output/moss_matrix.json")
if not json_path.exists():
    raise SystemExit("❌ 找不到 output/moss_matrix.json，請先執行 scraper.py")

with open(json_path, encoding="utf-8") as f:
    records = json.load(f)

print(f"📂 讀取完成，共 {len(records)} 筆資料")

# ── 欄位對應（JSON key → 資料庫欄位）──────────────────────────────────────────

def to_row(r: dict) -> dict:
    return {
        "sample_id":        r.get("樣本編號", ""),
        "common_name":      r.get("中文俗名", ""),
        "sci_name":         r.get("學名", ""),
        "bryophyte_group":  r.get("苔蘚類群", ""),
        "growth_form":      r.get("生長型態", ""),
        "color":       r.get("主要顏色", ""),
        "substrate":   r.get("生長基質", ""),
        "has_capsule": r.get("孢蒴有無", ""),
        "location":    r.get("觀測地點", ""),
        "source":      r.get("資料來源", ""),
    }

rows = [to_row(r) for r in records]

# ── 寫入 Supabase（分批，每次 500 筆）─────────────────────────────────────────

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BATCH = 500
success = 0
skipped = 0

for i in range(0, len(rows), BATCH):
    batch = rows[i : i + BATCH]
    try:
        # upsert：sample_id 重複時更新，不重複時新增
        result = (
            supabase.table("moss_matrix")
            .upsert(batch, on_conflict="sample_id")
            .execute()
        )
        success += len(batch)
        print(f"  ✓ 第 {i//BATCH + 1} 批：{len(batch)} 筆寫入成功")
    except Exception as e:
        skipped += len(batch)
        print(f"  ✗ 第 {i//BATCH + 1} 批失敗：{e}")

print(f"\n🎉 完成！成功 {success} 筆 / 失敗 {skipped} 筆")
print(f"   可到 Supabase Table Editor 確認資料是否已進入 moss_matrix 資料表")

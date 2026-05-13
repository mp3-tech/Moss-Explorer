"""
苔蘚特徵矩陣爬蟲
=================
資料來源：
  1. iNaturalist API  — 物種觀測紀錄（含基質、生長環境標記）
  2. GBIF API        — 全球生物多樣性物種分佈與特徵

輸出：
  - moss_matrix.csv  → 可直接匯入 matrix.html
  - moss_matrix.json → 可直接餵給前端 JS

安裝依賴：
  pip install requests beautifulsoup4

執行方式：
  python scraper.py
"""

import requests
import csv
import json
import time
import re
from pathlib import Path

# ─── 設定 ────────────────────────────────────────────────────────────────────

OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

HEADERS = {"User-Agent": "MossExplorer-Research/1.0 (high-school science project)"}

# 對應到 matrix.html 的欄位選項
GROWTH_MAP = {
    # iNaturalist tag → matrix.html 選項
    "cushion":   "墊狀 (Cushion)",
    "mat":       "毯狀 (Mat)",
    "tuft":      "叢生 (Tuft)",
    "dendroid":  "樹狀 (Dendroid)",
    "pleurocarpous": "毯狀 (Mat)",
    "acrocarpous":   "叢生 (Tuft)",
}

COLOR_MAP = {
    "dark green":    "深綠 (Dark Green)",
    "bright green":  "翠綠 (Bright Green)",
    "yellow":        "黃綠 (Yellow-Green)",
    "yellow-green":  "黃綠 (Yellow-Green)",
    "brown":         "紅褐 (Red-Brown)",
    "red":           "紅褐 (Red-Brown)",
}

SUBSTRATE_MAP = {
    "rock":      "岩石 (Rock)",
    "stone":     "岩石 (Rock)",
    "cliff":     "岩石 (Rock)",
    "bark":      "樹皮 (Bark)",
    "tree":      "樹皮 (Bark)",
    "wood":      "樹皮 (Bark)",
    "soil":      "土壤 (Soil)",
    "ground":    "土壤 (Soil)",
    "concrete":  "人造物 (Concrete/Brick)",
    "wall":      "人造物 (Concrete/Brick)",
    "brick":     "人造物 (Concrete/Brick)",
}


def normalize(raw: str | None, mapping: dict, default: str = "未知") -> str:
    """將原始英文標記對應到 matrix.html 的中文選項。"""
    if not raw:
        return default
    raw_lower = raw.lower()
    for key, val in mapping.items():
        if key in raw_lower:
            return val
    return default


# ─── 來源 1：iNaturalist API ─────────────────────────────────────────────────

def fetch_inaturalist(taxon_name: str = "Bryophyta", pages: int = 5) -> list[dict]:
    """
    從 iNaturalist 抓取苔蘚觀測紀錄。
    API 文件：https://www.inaturalist.org/pages/api+reference
    """
    records = []
    per_page = 50

    print(f"\n[iNaturalist] 開始爬取「{taxon_name}」，共 {pages} 頁...")

    for page in range(1, pages + 1):
        url = "https://api.inaturalist.org/v1/observations"
        params = {
            "taxon_name": taxon_name,
            "quality_grade": "research",   # 只取研究等級（多人確認）
            "per_page": per_page,
            "page": page,
            "order_by": "votes",
            "photos": "true",
            "fields": "taxon,place_guess,description,ofvs,quality_grade",
        }

        try:
            resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as e:
            print(f"  ✗ 第 {page} 頁失敗：{e}")
            continue

        results = data.get("results", [])
        print(f"  ✓ 第 {page} 頁：取得 {len(results)} 筆")

        for i, obs in enumerate(results):
            taxon      = obs.get("taxon", {})
            name       = taxon.get("preferred_common_name") or taxon.get("name", "Unknown")
            sci_name   = taxon.get("name", "")
            place      = obs.get("place_guess", "")
            desc       = obs.get("description", "") or ""

            # 從觀測欄位值（ofvs）抓基質、顏色等標記
            ofvs = obs.get("ofvs", [])
            substrate_raw = ""
            color_raw     = ""
            growth_raw    = ""
            capsule_raw   = ""

            for ofv in ofvs:
                fname = (ofv.get("field", {}).get("name") or "").lower()
                fval  = (ofv.get("value") or "").lower()
                if "substrate" in fname or "surface" in fname:
                    substrate_raw = fval
                elif "color" in fname or "colour" in fname:
                    color_raw = fval
                elif "growth" in fname or "form" in fname:
                    growth_raw = fval
                elif "capsule" in fname or "sporophyte" in fname:
                    capsule_raw = fval

            # 從描述文字補充推斷
            desc_lower = desc.lower()
            if not substrate_raw:
                for k in SUBSTRATE_MAP:
                    if k in desc_lower:
                        substrate_raw = k
                        break
            if not growth_raw:
                for k in GROWTH_MAP:
                    if k in desc_lower:
                        growth_raw = k
                        break

            # 孢蒴判斷
            if capsule_raw in ("yes", "present", "true", "1"):
                capsule = "有 (Present)"
            elif capsule_raw in ("no", "absent", "false", "0"):
                capsule = "無 (Absent)"
            else:
                # 從描述推斷
                capsule = "有 (Present)" if re.search(r"capsule|sporophyte|seta", desc_lower) else "無 (Absent)"

            sample_id = f"iNAT-{obs.get('id', f'{page}{i:02d}')}"

            records.append({
                "樣本編號":    sample_id,
                "中文俗名":    name,
                "學名":        sci_name,
                "生長型態":    normalize(growth_raw,    GROWTH_MAP),
                "主要顏色":    normalize(color_raw,     COLOR_MAP),
                "生長基質":    normalize(substrate_raw, SUBSTRATE_MAP),
                "孢蒴有無":    capsule,
                "觀測地點":    place,
                "資料來源":    "iNaturalist",
            })

        time.sleep(1)  # 避免過快請求

    print(f"[iNaturalist] 完成，共 {len(records)} 筆")
    return records


# ─── 來源 2：GBIF API ────────────────────────────────────────────────────────

# GBIF 苔蘚三大類群的 taxonKey
BRYOPHYTE_GROUPS = {
    "蘚類 Bryophyta":            35,    # 最常見，葉狀莖，直立或匍匐
    "苔類 Marchantiophyta":    7707,    # 地錢、葉苔等
    "角苔類 Anthocerotophyta": 7708,    # 角狀孢蒴，最罕見
}


def fetch_gbif(pages: int = 3) -> list[dict]:
    """
    從 GBIF 爬取完整苔蘚植物資料（蘚類＋苔類＋角苔類）。
    API 文件：https://www.gbif.org/developer/occurrence
    """
    all_records = []

    for group_name, taxon_key in BRYOPHYTE_GROUPS.items():
        records = []
        limit = 100

        print(f"\n[GBIF] 開始爬取「{group_name}」(taxonKey={taxon_key})，共 {pages} 頁...")

        for page in range(pages):
            url = "https://api.gbif.org/v1/occurrence/search"
            params = {
                "taxonKey":      taxon_key,
                "limit":         limit,
                "offset":        page * limit,
                "hasCoordinate": "true",
                "country":       "TW",      # 優先台灣資料
            }

            try:
                resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
                resp.raise_for_status()
                data = resp.json()
            except requests.RequestException as e:
                print(f"  ✗ 第 {page+1} 頁失敗：{e}")
                # 台灣沒資料時改抓全球
                params.pop("country", None)
                try:
                    resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
                    resp.raise_for_status()
                    data = resp.json()
                except Exception:
                    continue

            results = data.get("results", [])
            print(f"  ✓ 第 {page+1} 頁：取得 {len(results)} 筆")

            for occ in results:
                sci_name    = occ.get("species", occ.get("scientificName", "Unknown"))
                common_name = occ.get("vernacularName", "")
                locality    = occ.get("locality", "") or occ.get("stateProvince", "")
                habitat     = (occ.get("habitat") or "").lower()
                substrate   = (occ.get("substrate") or "").lower()

                growth_raw    = habitat
                substrate_raw = substrate or habitat

                # 加入類群欄位，方便之後篩選
                sample_id = f"GBIF-{occ.get('key', 'N/A')}"

                records.append({
                    "樣本編號":    sample_id,
                    "中文俗名":    common_name or sci_name,
                    "學名":        sci_name,
                    "苔蘚類群":    group_name,
                    "生長型態":    normalize(growth_raw,    GROWTH_MAP),
                    "主要顏色":    normalize("",            COLOR_MAP, "未記錄"),
                    "生長基質":    normalize(substrate_raw, SUBSTRATE_MAP),
                    "孢蒴有無":    "未記錄",
                    "觀測地點":    locality,
                    "資料來源":    "GBIF",
                })

            time.sleep(0.5)

        print(f"  → 「{group_name}」共 {len(records)} 筆")
        all_records.extend(records)

    print(f"\n[GBIF] 三大類群合計 {len(all_records)} 筆")
    return all_records


# ─── 輸出 CSV ─────────────────────────────────────────────────────────────────

def save_csv(records: list[dict], filename: str = "moss_matrix.csv"):
    path = OUTPUT_DIR / filename
    if not records:
        print("⚠️  沒有資料，跳過輸出。")
        return

    fieldnames = ["樣本編號", "中文俗名", "學名", "苔蘚類群", "生長型態", "主要顏色", "生長基質", "孢蒴有無", "觀測地點", "資料來源"]
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"\n✅ CSV 已儲存：{path}（共 {len(records)} 筆）")


# ─── 輸出 JSON（供前端 JS 直接讀取）─────────────────────────────────────────

def save_json(records: list[dict], filename: str = "moss_matrix.json"):
    path = OUTPUT_DIR / filename
    with open(path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"✅ JSON 已儲存：{path}")


# ─── 主程式 ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 50)
    print("  🌿 苔蘚特徵矩陣爬蟲  v1.0")
    print("=" * 50)

    all_records = []

    # --- iNaturalist（建議先跑，資料品質較高）---
    inat_records = fetch_inaturalist(taxon_name="Bryophyta", pages=5)
    all_records.extend(inat_records)

    # --- GBIF（補充更多筆數）---
    gbif_records = fetch_gbif(pages=3)
    all_records.extend(gbif_records)

    # --- 重複去除（以樣本編號為 key）---
    seen = set()
    unique = []
    for r in all_records:
        if r["樣本編號"] not in seen:
            seen.add(r["樣本編號"])
            unique.append(r)

    print(f"\n📊 總計：{len(unique)} 筆（去重後）")

    save_csv(unique)
    save_json(unique)

    print("\n🎉 完成！輸出在 output/ 資料夾：")
    print("   moss_matrix.csv  → 匯入 matrix.html 的「匯出 CSV」功能")
    print("   moss_matrix.json → 供前端 JS 動態載入使用")

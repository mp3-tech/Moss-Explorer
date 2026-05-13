-- 苔蘚特徵矩陣資料表
CREATE TABLE moss_matrix (
    id           SERIAL PRIMARY KEY,
    sample_id    TEXT NOT NULL UNIQUE,   -- 例如 iNAT-12345678
    common_name  TEXT,                   -- 中文俗名
    sci_name     TEXT,                   -- 學名
    growth_form  TEXT,                   -- 生長型態
    color        TEXT,                   -- 主要顏色
    substrate    TEXT,                   -- 生長基質
    has_capsule  TEXT,                   -- 孢蒴有無
    location     TEXT,                   -- 觀測地點
    bryophyte_group TEXT,                -- 苔蘚類群（蘚類/苔類/角苔類）
    source       TEXT,                   -- 資料來源 (iNaturalist / GBIF)
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 讓前端可以直接用 Supabase JS SDK 查詢（不需要登入）
ALTER TABLE moss_matrix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允許所有人讀取"
    ON moss_matrix FOR SELECT
    USING (true);

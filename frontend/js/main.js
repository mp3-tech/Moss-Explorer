document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 動態載入導覽列 ---
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) throw new Error("無法載入導覽列");
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("載入導覽列時發生錯誤:", error));
    }
// --- 2. 倒數計時器邏輯 (首頁儀表板專用) ---
    function updateCountdowns() {
        const timerScience = document.getElementById("timer-science");
        const timerEssay = document.getElementById("timer-essay");
        if (!timerScience || !timerEssay) return; 

        const now = new Date().getTime();
        
        // 嘗試從 localStorage 讀取使用者設定的時間，如果沒有，就用預設值
        const currentYear = new Date().getFullYear();
        const defaultSci = `${currentYear}-09-01T23:59:59`;
        const defaultEss = `${currentYear}-10-15T12:00:00`;

        const savedSciStr = localStorage.getItem("targetDateScience") || defaultSci;
        const savedEssStr = localStorage.getItem("targetDateEssay") || defaultEss;

        const scienceDate = new Date(savedSciStr).getTime();
        const essayDate = new Date(savedEssStr).getTime();

        function formatTime(distance) {
            if (isNaN(distance) || distance < 0) return "已截止";
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const hrStr = hours.toString().padStart(2, '0');
            const minStr = minutes.toString().padStart(2, '0');
            const secStr = seconds.toString().padStart(2, '0');

            return `${days}<span>天</span>${hrStr}<span>時</span>${minStr}<span>分</span>${secStr}<span>秒</span>`;
        }

        timerScience.innerHTML = formatTime(scienceDate - now);
        timerEssay.innerHTML = formatTime(essayDate - now);
    }
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    
    // --- 3. 懸浮調色盤開關邏輯 ---
    const colorBarPanel = document.getElementById('color-bar-panel');
    const openColorBtn = document.getElementById('open-color-btn');
    const closeColorBtn = document.getElementById('close-color-btn');

    if (openColorBtn && closeColorBtn && colorBarPanel) {
        openColorBtn.addEventListener('click', () => {
            colorBarPanel.classList.add('show');
            openColorBtn.style.display = 'none'; 
        });

        closeColorBtn.addEventListener('click', () => {
            colorBarPanel.classList.remove('show');
            openColorBtn.style.display = 'flex'; 
        });
    }

    /* =========================================
   4. 專案儀表板首頁 (Index Dashboard)
========================================= */
/* 改為單欄置中、向下延伸的版型 */
.dashboard-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 32px 5%;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
}

/* 頂部數據看板 */
.top-widgets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
.widget-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
}
.widget-icon {
    font-size: 2rem;
    background: #f5f5f5;
    width: 60px; height: 60px;
    display: flex; justify-content: center; align-items: center;
    border-radius: 12px;
}
.widget-info { flex-grow: 1; }

/* 橫向 Quest 導航 */
.horizontal-quest-track {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 10px;
    overflow-x: auto;
}
.h-quest-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    transition: transform 0.2s;
    min-width: 120px;
}
.h-quest-node:hover { transform: translateY(-3px); }
.h-quest-marker {
    width: 45px; height: 45px;
    background-color: var(--primary); color: white;
    border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    font-size: 1.2rem; font-weight: bold;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.h-quest-node:hover .h-quest-marker { box-shadow: 0 6px 15px rgba(46, 125, 50, 0.3); }
.h-quest-title {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--text-main);
}
.h-quest-line {
    flex-grow: 1;
    height: 4px;
    background-color: #e0e0e0;
    margin: 0 10px;
    border-radius: 2px;
    transform: translateY(-15px); /* 對齊圓圈高度 */
}

/* Hero Banner 優化 */
.hero-banner {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-radius: var(--radius); padding: 50px; position: relative; overflow: hidden;
    border: 1px solid #c8e6c9; display: flex; justify-content: space-between; align-items: center;
}
.hero-text h1 { margin: 0 0 12px 0; font-size: 2.2rem; color: var(--primary); }
.hero-text p { margin: 0; font-size: 1.1rem; color: var(--text-main); }

/* 文章資源區 */
.articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.article-card { border: 1px solid var(--border-color); border-radius: var(--radius); overflow: hidden; background: var(--bg-card);}
.article-img { height: 120px; background-color: #e0e0e0; width: 100%; }
.article-content { padding: 12px; }
.article-tag { display: inline-block; padding: 2px 8px; background: #eee; border-radius: 4px; font-size: 0.7rem; color: #555; margin-bottom: 8px;}
.article-content h5 { margin: 0 0 8px 0; font-size: 0.95rem; }
.article-content p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }

/* 響應式優化 */
@media (max-width: 768px) {
    .horizontal-quest-track { justify-content: flex-start; }
    .articles-grid { grid-template-columns: 1fr; }
    .hero-banner { padding: 30px; }
}
    // --- 5. AI 訓練資料庫比例計算機邏輯 ---
    const totalInput = document.getElementById('totalPhotos');
    if (totalInput) {
        const ratioSelect = document.getElementById('ratioSelect');
        const resTrain = document.getElementById('res-train');
        const resValid = document.getElementById('res-valid');
        const resTest = document.getElementById('res-test');
        const barTrain = document.getElementById('bar-train');
        const barValid = document.getElementById('bar-valid');
        const barTest = document.getElementById('bar-test');

        function calculateRatio() {
            let total = parseInt(totalInput.value);
            if(isNaN(total) || total < 0) total = 0;

            let ratios = ratioSelect.value.split(',').map(Number);
            let sumRatio = ratios[0] + ratios[1] + ratios[2];

            let validCount = Math.round(total * (ratios[1] / sumRatio));
            let testCount = Math.round(total * (ratios[2] / sumRatio));
            let trainCount = total - validCount - testCount; 

            resTrain.textContent = trainCount;
            resValid.textContent = validCount;
            resTest.textContent = testCount;

            barTrain.style.width = `${(trainCount / total) * 100}%`;
            barValid.style.width = `${(validCount / total) * 100}%`;
            barTest.style.width = `${(testCount / total) * 100}%`;
        }

        totalInput.addEventListener('input', calculateRatio);
        ratioSelect.addEventListener('change', calculateRatio);
        calculateRatio(); // 初始載入時計算一次
    }
});
// --- 6. 館員諮詢服務月 (Calendar) 邏輯 ---
    const calendarBody = document.getElementById("calendar-body");
    if (calendarBody) {
        const selectedDateInput = document.getElementById("selected-date");
        const btnGenLetter = document.getElementById("btn-gen-letter");
        const letterResult = document.getElementById("letter-result");
        const letterContent = document.getElementById("letter-content");
        
        // 預設預定日期 (模擬資料)
        const bookedDates = [13, 15, 20];
        const today = 27; // 模擬今天為 5/27

        function renderCalendar() {
            let html = "";
            let date = 1;
            // 2026年5月從星期五開始 (第一排前4格是空的)
            for (let i = 0; i < 5; i++) {
                html += "<tr>";
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < 5) {
                        html += "<td class='empty'></td>";
                    } else if (date > 31) {
                        html += "<td class='empty'></td>";
                    } else {
                        let className = "";
                        if (date === today) className += " date-today";
                        if (!bookedDates.includes(date)) className += " date-available";
                        
                        html += `<td class="${className}" onclick="selectDate(this, ${date})">${date}</td>`;
                        date++;
                    }
                }
                html += "</tr>";
                if (date > 31) break;
            }
            calendarBody.innerHTML = html;
        }

        window.selectDate = function(el, day) {
            // 移除其他選取狀態
            document.querySelectorAll('#calendar-body td').forEach(td => td.classList.remove('date-selected'));
            el.classList.add('date-selected');
            selectedDateInput.value = `2026-05-${day.toString().padStart(2, '0')}`;
        };

        btnGenLetter.addEventListener("click", function() {
            const date = selectedDateInput.value;
            const school = document.getElementById("student-school").value || "[您的學校]";
            const title = document.getElementById("project-title").value || "[您的研究題目]";

            if (!date) { alert("請先選擇諮詢日期！"); return; }

            const template = `館員您好：\n\n我們是來自${school}的學生，目前正在進行一項關於「${title}」的研究計畫。\n\n我們在文獻搜尋過程中遇到了一些瓶頸，希望能預約在 ${date} 進行專業諮詢。希望能針對：\n1. 如何在學術資料庫中更精準地搜尋「蘚苔植物與AI」的相關論文。\n2. 引用格式的校對建議。\n\n不知當天時間是否方便？期待您的回覆，謝謝您！`;

            letterContent.value = template;
            letterResult.style.display = "block";
        });

        document.getElementById("btn-copy-letter")?.addEventListener("click", function() {
            letterContent.select();
            document.execCommand("copy");
            alert("邀請信內容已複製到剪貼簿！");
        });

        renderCalendar();
    }
// --- 7. 海報配色建議工具 (Palette) 邏輯 ---
    const palettePage = document.querySelector('.palette-page');
    if (palettePage) {
        const themeData = {
            moss: { primary: '#2e7d32', secondary: '#81c784', accent: '#ffb300', bg: '#f7faf5', text: '#333' },
            tech: { primary: '#1565c0', secondary: '#90caf9', accent: '#ff5722', bg: '#f0f4f8', text: '#222' },
            earth: { primary: '#5d4037', secondary: '#a1887f', accent: '#8bc34a', bg: '#efebe9', text: '#3e2723' }
        };

        const paletteCards = document.querySelectorAll('.palette-card');
        const posterBoard = document.getElementById('poster-board');
        const pHeader = document.getElementById('p-header');
        const pHeadings = document.querySelectorAll('.p-heading');
        const pTexts = document.querySelectorAll('.p-text');
        const pAccent = document.getElementById('p-accent');
        const copyMsg = document.getElementById('copy-msg');

        // 切換主題預覽
        paletteCards.forEach(card => {
            card.addEventListener('click', function() {
                // 更新按鈕 active 狀態
                paletteCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                // 取得對應主題顏色
                const theme = themeData[this.getAttribute('data-theme')];

                // 更新海報預覽顏色
                posterBoard.style.backgroundColor = theme.bg;
                pHeader.style.backgroundColor = theme.primary;
                pAccent.style.backgroundColor = theme.accent;
                
                pHeadings.forEach(h => {
                    h.style.color = theme.primary;
                    h.style.borderBottomColor = theme.secondary;
                });
                
                pTexts.forEach(t => {
                    t.style.color = theme.text;
                });
            });
        });

        // 點擊色塊複製 Hex 碼
        const swatches = document.querySelectorAll('.swatch-item');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', function(e) {
                e.stopPropagation(); // 避免觸發卡片切換
                const hexCode = this.querySelector('span').innerText;
                
                // 複製到剪貼簿
                navigator.clipboard.writeText(hexCode).then(() => {
                    copyMsg.innerText = `已複製色碼：${hexCode} 📋`;
                    setTimeout(() => { copyMsg.innerText = ''; }, 2000);
                });
            });
        });
    }
// --- 8. 苔蘚特徵矩陣比對器 (Matrix) 邏輯 ---
    const matrixForm = document.getElementById("matrix-form");
    if (matrixForm) {
        const tbody = document.getElementById("matrix-tbody");
        const btnExportCSV = document.getElementById("btn-export-csv");
        let matrixData = [];

        // 處理表單提交
        matrixForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // 取得輸入資料
            const sample = {
                id: document.getElementById("m-id").value,
                growth: document.getElementById("m-growth").value,
                color: document.getElementById("m-color").value,
                substrate: document.getElementById("m-substrate").value,
                capsule: document.getElementById("m-capsule").value
            };

            // 存入陣列
            matrixData.push(sample);
            renderMatrixTable();
            
            // 清空表單並將焦點放回 ID
            matrixForm.reset();
            document.getElementById("m-id").focus();
        });

        // 渲染表格畫面
        function renderMatrixTable() {
            if (matrixData.length === 0) {
                tbody.innerHTML = `<tr class="empty-row"><td colspan="6" style="text-align: center; color: #999;">尚未加入任何特徵資料，請由左方表單新增。</td></tr>`;
                return;
            }

            tbody.innerHTML = "";
            matrixData.forEach((item, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="font-family: monospace; font-weight: bold; color: var(--primary);">${item.id}</td>
                    <td>${item.growth}</td>
                    <td>${item.color}</td>
                    <td>${item.substrate}</td>
                    <td>${item.capsule}</td>
                    <td><button class="btn-delete-row" onclick="deleteMatrixRow(${index})">刪除</button></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // 全域刪除函數
        window.deleteMatrixRow = function(index) {
            matrixData.splice(index, 1);
            renderMatrixTable();
        };

        // 匯出 CSV 檔功能
        btnExportCSV.addEventListener("click", function() {
            if (matrixData.length === 0) {
                alert("目前沒有資料可以匯出喔！請先新增資料。");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // 加上 BOM 確保中文不亂碼
            csvContent += "樣本編號,生長型態,顏色,生長基質,孢蒴有無\n"; // 表頭

            matrixData.forEach(row => {
                const rowString = `${row.id},${row.growth},${row.color},${row.substrate},${row.capsule}`;
                csvContent += rowString + "\n";
            });

            // 觸發下載
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "moss_feature_matrix.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

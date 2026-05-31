document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. 動態載入導覽列（直接寫入，不依賴 fetch，相容 file:// 本機開啟）---
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
        navbarPlaceholder.innerHTML = `
<header>
    <div class="brand">
        <a href="index.html" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
            <img src="images/logo.png" alt="LOGO" class="logo-img" onerror="this.style.display='none'">
            <div class="brand-text">
                <h2>AI 蘚苔探險家</h2>
                <span>發現腳下的森林，讓 AI 成為你的科學放大鏡！</span>
            </div>
        </a>
    </div>
    <button class="menu-toggle" id="mobile-menu-btn">☰</button>
    <nav class="nav-links" id="nav-links">
        <a href="index.html">首頁</a>
        <a href="quest.html">研究導航</a>
        <a href="microscope.html">蘚苔觀察</a>
        <a href="ai-logic.html">AI 苔蘚解碼</a>
        <div class="dropdown">
            <a href="tools.html" class="dropbtn">研究工具箱 </a>
            <div class="dropdown-content">
                <div class="dropdown-submenu">
                    <button class="submenu-btn">科展輔助工具</button>
                    <div class="submenu-content">
                        <a href="countdown.html">投稿倒數計時器</a>
                        <a href="calendar.html">館員諮詢預約</a>
                        <a href="palette.html">海報配色實驗室</a>
                    </div>
                </div>
                <div class="dropdown-submenu">
                    <button class="submenu-btn">AI 研究工具</button>
                    <div class="submenu-content">
                        <a href="matrix.html">特徵比較器</a>
                        <a href="ratio-calculator.html">AI 資料比例</a>
                    </div>
                </div>
            </div>
        </div>
        <a href="issues.html">延伸議題</a>
        <a href="resources.html">學術資源</a>
        <a href="glossary.html">關鍵詞表</a>
        <a href="faq.html">常見問題</a>
        <a href="about.html">關於我們</a>
    </nav>
</header>`;
    }

    // --- 2. 倒數計時器邏輯 (首頁儀表板專用) ---
    function updateCountdowns() {
        const now = new Date().getTime();
        const currentYear = new Date().getFullYear();
        
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

        // 獨立更新：科學展覽會倒數
        const timerScience = document.getElementById("timer-science");
        if (timerScience) {
            const savedSciStr = localStorage.getItem("targetDateScience") || `${currentYear}-09-01T23:59:59`;
            timerScience.innerHTML = formatTime(new Date(savedSciStr).getTime() - now);
        }

        // 獨立更新：小論文倒數 (若該頁面沒有此區塊也不會當機)
        const timerEssay = document.getElementById("timer-essay");
        if (timerEssay) {
            const savedEssStr = localStorage.getItem("targetDateEssay") || `${currentYear}-10-15T12:00:00`;
            timerEssay.innerHTML = formatTime(new Date(savedEssStr).getTime() - now);
        }
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
        calculateRatio(); 
    }

    // --- 6. 館員諮詢服務月 (Calendar) 邏輯 ---
    const calendarBody = document.getElementById("calendar-body");
    if (calendarBody) {
        const selectedDateInput = document.getElementById("selected-date");
        const btnGenLetter = document.getElementById("btn-gen-letter");
        const letterResult = document.getElementById("letter-result");
        const letterContent = document.getElementById("letter-content");
        
        const bookedDates = [13, 15, 20];
        const today = 27; 

        function renderCalendar() {
            let html = "";
            let date = 1;
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

        paletteCards.forEach(card => {
            card.addEventListener('click', function() {
                paletteCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                const theme = themeData[this.getAttribute('data-theme')];

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

        const swatches = document.querySelectorAll('.swatch-item');
        swatches.forEach(swatch => {
            swatch.addEventListener('click', function(e) {
                e.stopPropagation(); 
                const hexCode = this.querySelector('span').innerText;
                
                navigator.clipboard.writeText(hexCode).then(() => {
                    copyMsg.innerText = `已複製色碼：${hexCode} `;
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
        const btnExportJSON = document.getElementById("btn-export-json");
        let matrixData = [];

        // 將 matrixData 掛到 window，讓 matrix.html 的 inline script 可以存取
        window.matrixData = matrixData;

        matrixForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const sample = {
                id:        document.getElementById("m-id").value,
                growth:    document.getElementById("m-growth").value,
                color:     document.getElementById("m-color").value,
                substrate: document.getElementById("m-substrate").value,
                capsule:   document.getElementById("m-capsule").value,
                location:  document.getElementById("m-location").value || "未記錄"
            };

            matrixData.push(sample);
            window.matrixData = matrixData; // 同步更新全域參考
            renderMatrixTable();
            
            matrixForm.reset();
            document.getElementById("m-id").focus();
        });

        function renderMatrixTable() {
            if (matrixData.length === 0) {
                tbody.innerHTML = `<tr class="empty-row"><td colspan="8" style="text-align: center; color: #999;">尚未加入任何特徵資料，請由左方表單新增。</td></tr>`;
                return;
            }

            tbody.innerHTML = "";
            matrixData.forEach((item, index) => {
                const inA = window.compareA && window.compareA['樣本編號'] === item.id;
                const inB = window.compareB && window.compareB['樣本編號'] === item.id;

                const tr = document.createElement("tr");
                if (inA) tr.style.background = '#e8f5e9';
                if (inB) tr.style.background = '#e3f2fd';

                tr.innerHTML = `
                    <td style="font-family: monospace; font-weight: bold; color: var(--primary);">${item.id}</td>
                    <td>${item.growth}</td>
                    <td>${item.color}</td>
                    <td>${item.substrate}</td>
                    <td>${item.capsule}</td>
                    <td>${item.location}</td>
                    <td>
                        <button class="btn-delete-row" onclick="deleteMatrixRow(${index})">刪除</button>
                    </td>
                    <td>
                        <button class="btn-add-compare"
                            data-index="${index}"
                            style="font-size:0.78rem; padding:3px 10px; border-radius:8px;
                                   border:1.5px solid #a5d6a7;
                                   background:${inA ? '#2e7d32' : inB ? '#1565c0' : 'transparent'};
                                   color:${(inA || inB) ? '#fff' : '#2e7d32'};
                                   cursor:pointer; white-space:nowrap; transition: all 0.2s;">
                            ${inA ? '✓ 樣本A' : inB ? '✓ 樣本B' : '＋ 加入比對'}
                        </button>
                    </td>`;
                tbody.appendChild(tr);
            });

            // 綁定加入比對按鈕事件
            tbody.querySelectorAll('.btn-add-compare').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-index'));
                    if (typeof window.addMyRecordToCompare === 'function') {
                        window.addMyRecordToCompare(idx);
                    }
                });
            });
        }

        // 公開給 matrix.html 的 inline script 呼叫，以便同步重繪
        window.rerenderMatrixTable = renderMatrixTable;

        window.deleteMatrixRow = function(index) {
            // 若刪除的資料正在比對中，一併清除
            if (window.compareA && window.compareA['_isMyRecord'] && window.compareA['樣本編號'] === matrixData[index]?.id) {
                window.compareA = null;
            }
            if (window.compareB && window.compareB['_isMyRecord'] && window.compareB['樣本編號'] === matrixData[index]?.id) {
                window.compareB = null;
            }
            matrixData.splice(index, 1);
            window.matrixData = matrixData;
            renderMatrixTable();
            // 若比對列存在，同步更新
            if (typeof window.updateCompareBar === 'function') {
                window.updateCompareBar();
            }
        };

        // CSV 匯出
        if (btnExportCSV) {
            btnExportCSV.addEventListener("click", function() {
                if (matrixData.length === 0) {
                    alert("目前沒有資料可以匯出喔！請先新增資料。");
                    return;
                }

                let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
                csvContent += "樣本編號,生長型態,顏色,生長基質,孢蒴有無,觀測地點\n";

                matrixData.forEach(row => {
                    const rowString = `${row.id},${row.growth},${row.color},${row.substrate},${row.capsule},${row.location}`;
                    csvContent += rowString + "\n";
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "moss_feature_matrix.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }

        // JSON 匯出
        if (btnExportJSON) {
            btnExportJSON.addEventListener("click", function() {
                if (matrixData.length === 0) {
                    alert("目前沒有資料可以匯出喔！請先新增資料。");
                    return;
                }

                const jsonData = matrixData.map(row => ({
                    "樣本編號": row.id,
                    "生長型態": row.growth,
                    "主要顏色": row.color,
                    "生長基質": row.substrate,
                    "孢蒴有無": row.capsule,
                    "觀測地點": row.location
                }));

                const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", "moss_feature_matrix.json");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        }
    }

    // --- 9. 開場動畫 (Splash Screen) 終極防呆邏輯 ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        const hasSeenSplash = sessionStorage.getItem('moss_splash_seen');
        
        if (!hasSeenSplash) {
            if (navbarPlaceholder) {
                navbarPlaceholder.style.display = 'none';
            }

            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.style.visibility = 'hidden';
                splashScreen.style.pointerEvents = 'none';
                sessionStorage.setItem('moss_splash_seen', 'true');
                
                if (navbarPlaceholder) {
                    navbarPlaceholder.style.display = 'block';
                }
                
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500); 
            }, 2500); 
        } else {
            splashScreen.style.display = 'none';
            if (navbarPlaceholder) {
                navbarPlaceholder.style.display = 'block';
            }
        }
    }

});

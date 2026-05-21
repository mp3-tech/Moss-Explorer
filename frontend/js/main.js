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
        const now = new Date().getTime();
        const currentYear = new Date().getFullYear();
        
        function formatTime(distance) {
            if (isNaN(distance) || distance < 0) return "已截止";
            const days = Math.floor(distance / (86400000));
            const hours = Math.floor((distance % 86400000) / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor((distance % 3600000) / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((distance % 60000) / 1000).toString().padStart(2, '0');

            return `${days}<span>天</span>${hours}<span>時</span>${minutes}<span>分</span>${seconds}<span>秒</span>`;
        }

        const timerScience = document.getElementById("timer-science");
        if (timerScience) {
            const savedSciStr = localStorage.getItem("targetDateScience") || `${currentYear}-09-01T23:59:59`;
            timerScience.innerHTML = formatTime(new Date(savedSciStr).getTime() - now);
        }

        const timerEssay = document.getElementById("timer-essay");
        if (timerEssay) {
            const savedEssStr = localStorage.getItem("targetDateEssay") || `${currentYear}-10-15T12:00:00`;
            timerEssay.innerHTML = formatTime(new Date(savedEssStr).getTime() - now);
        }
    }
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    
    // --- 3. 全站色彩同步智慧控制中心 (全新升級版) ---
    function applyGlobalSavedColors() {
        const stored = localStorage.getItem('siteColorTheme');
        if (stored) {
            try {
                const theme = JSON.parse(stored);
                // 讀取 JSON 並精準修改當前頁面的 CSS 全域變數
                if (theme.primary) {
                    document.documentElement.style.setProperty('--primary', theme.primary);
                }
                if (theme.secondary) {
                    document.documentElement.style.setProperty('--secondary', theme.secondary);
                }
                if (theme.accent) {
                    document.documentElement.style.setProperty('--accent', theme.accent);
                }
                if (theme.bg) {
                    document.documentElement.style.setProperty('--bg-body', theme.bg);
                }
            } catch (e) {
                console.error("同步全站配色時發生錯誤:", e);
            }
        }
    }
    // 任何分頁一載入，立刻向首頁調色盤對齊顏色
    applyGlobalSavedColors();

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

        matrixForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const sample = {
                id: document.getElementById("m-id").value,
                growth: document.getElementById("m-growth").value,
                color: document.getElementById("m-color").value,
                substrate: document.getElementById("m-substrate").value,
                capsule: document.getElementById("m-capsule").value
            };

            matrixData.push(sample);
            renderMatrixTable();
            
            matrixForm.reset();
            document.getElementById("m-id").focus();
        });

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

        window.deleteMatrixRow = function(index) {
            matrixData.splice(index, 1);
            renderMatrixTable();
        };

        btnExportCSV.addEventListener("click", function() {
            if (matrixData.length === 0) {
                alert("目前沒有資料可以匯出喔！請先新增資料。");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
            csvContent += "樣本編號,生長型態,顏色,生長基質,孢蒴有無\n"; 

            matrixData.forEach(row => {
                const rowString = `${row.id},${row.growth},${row.color},${row.substrate},${row.capsule}`;
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

    // --- 9. 開場動畫 (Splash Screen) 智慧控制邏輯 ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        const hasSeenSplash = sessionStorage.getItem('moss_splash_seen');
        
        if (!hasSeenSplash) {
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.style.visibility = 'hidden';
                splashScreen.style.pointerEvents = 'none'; 
                sessionStorage.setItem('moss_splash_seen', 'true');
                
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 500); 
            }, 2500); 
        } else {
            splashScreen.style.display = 'none';
        }
    }

});

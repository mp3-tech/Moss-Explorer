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

    // --- 4. 底部即時調色盤邏輯 ---
    const cpPrimary = document.getElementById('cp-primary');
    const cpBg = document.getElementById('cp-bg');
    const hexPrimary = document.getElementById('hex-primary');
    const hexBg = document.getElementById('hex-bg');
    const btnReset = document.getElementById('btn-reset');
    const root = document.documentElement;

    const defaultPrimary = "#2e7d32";
    const defaultBg = "#f7faf5";

    if (cpPrimary && cpBg && btnReset) {
        cpPrimary.addEventListener('input', function(e) {
            const val = e.target.value;
            root.style.setProperty('--primary', val);
            hexPrimary.textContent = val;
        });
        cpBg.addEventListener('input', function(e) {
            const val = e.target.value;
            root.style.setProperty('--bg-body', val);
            root.style.setProperty('--bg-card', val === '#ffffff' ? '#ffffff' : val);
            hexBg.textContent = val;
        });
        btnReset.addEventListener('click', function() {
            root.style.setProperty('--primary', defaultPrimary);
            root.style.setProperty('--bg-body', defaultBg);
            cpPrimary.value = defaultPrimary;
            cpBg.value = defaultBg;
            hexPrimary.textContent = defaultPrimary;
            hexBg.textContent = defaultBg;
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

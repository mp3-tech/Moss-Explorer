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

    // --- 2. 倒數計時器邏輯 ---
    function updateCountdowns() {
        const timerScience = document.getElementById("timer-science");
        const timerEssay = document.getElementById("timer-essay");
        if (!timerScience || !timerEssay) return; // 如果當前頁面沒有計時器就不執行

        const now = new Date().getTime();
        const currentYear = new Date().getFullYear();
        const scienceDate = new Date(`${currentYear}-09-01T23:59:59`).getTime();
        const essayDate = new Date(`${currentYear}-10-15T12:00:00`).getTime();

        function formatTime(distance) {
            if (distance < 0) return "已截止";
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
});

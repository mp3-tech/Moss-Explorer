// 等待網頁載入完成後執行
document.addEventListener("DOMContentLoaded", function() {
    // 尋找網頁中有沒有 id="navbar-placeholder" 的區塊
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    
    if (navbarPlaceholder) {
        // 使用 fetch 抓取 navbar.html 的內容
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) throw new Error("無法載入導覽列");
                return response.text();
            })
            .then(data => {
                // 將抓取到的 HTML 塞進佔位符中
                navbarPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error("載入導覽列時發生錯誤:", error);
            });
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const res = await fetch("/me");
        if (res.ok) {
            const data = await res.json();

            // เก็บ user ID ลงใน localStorage
            const userId = data.sub || data.id; // ลองเช็คทั้งสองแบบ เผื่อ API ใช้ชื่ออื่น
            if (userId) {
                localStorage.setItem("sub", userId);
            }

            const username = data["cognito:username"] || data.username || "ผู้ใช้";

            const loginBtn = document.getElementById("nav-signup-signin-btn");
            const dropdown = document.getElementById("dropdown-menu");

            // เปลี่ยนปุ่มเป็นชื่อผู้ใช้
            loginBtn.innerHTML = `${username} <i class="fa fa-caret-down"></i>`;
            loginBtn.href = "#";

            // แสดง dropdown เมื่อคลิกชื่อผู้ใช้
            loginBtn.addEventListener("click", function (e) {
                e.preventDefault();
                dropdown.classList.toggle("hidden");
            });

            // เพิ่ม listener ให้ logout
            document.getElementById("logout-link").addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.removeItem("sub");

                // ใช้ Logout URL จาก CognitoLogoutHandler
                window.location.href = "https://us-east-1d5g1txqdm.auth.us-east-1.amazoncognito.com/logout" +
                    "?client_id=2ud3ee8v1e6ck26am9hag5j2ra" +
                    "&logout_uri=http://localhost:8080/logout";
            });
        }
    } catch (error) {
        console.error("Login error:", error);
    }
});

window.onload = async function () {
    try {
        const res = await fetch("/me");
        if (res.ok) {
            const data = await res.json();
            const username = data["username"] || data.username || "ผู้ใช้";

            // Replace "เข้าสู่ระบบ" with username
            const loginBtn = document.getElementById("nav-signup-signin-btn");
            loginBtn.innerHTML = `${username} <i class="fa fa-caret-down"></i>`;
            loginBtn.href = "#";

            // Show dropdown menu
            const dropdown = document.getElementById("dropdown-menu");
            dropdown.classList.remove("hidden");

            loginBtn.onclick = function (e) {
                e.preventDefault();
                dropdown.classList.toggle("hidden");
            };

            // Logout functionality
            document.getElementById("logout-link").addEventListener("click", function () {
                localStorage.removeItem("id_token");

                const logoutUrl = "https://your-cognito-domain.auth.us-east-1.amazoncognito.com/logout" +
                    "?client_id=YOUR_CLIENT_ID" +
                    "&logout_uri=http://localhost:8080";
                window.location.href = logoutUrl;
            });
        }
    } catch (error) {
        console.error("Not logged in or failed to get user info:", error);
    }
};

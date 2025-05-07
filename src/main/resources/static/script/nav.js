document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("nav-signup-signin-btn");
    if (!authButton) {
        console.warn("Auth button not found in the DOM.");
        return; // Exit early if the button does not exist
    }

    const overlay = document.getElementById("overlay");
    const closeOverlay = document.getElementById("close-overlay");
    const switchAuthMode = document.getElementById("switch-auth-mode");
    const authForm = document.getElementById("auth-form");
    const modalTitle = document.getElementById("modal-title");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutLink = document.getElementById("logout-link");
    const emailField = document.getElementById("email");
    const confirmPasswordField = document.getElementById("confirm-password");
    const profileLink = document.getElementById("profile-link");

    let isRegistering = false;
    let isAuthenticated = false;

    const toggleOverlay = () => overlay?.classList.toggle("overlay");
    const savedUsername = localStorage.getItem("username");
    const savedAuthState = localStorage.getItem("isAuthenticated");

    if (savedAuthState === "true" && savedUsername) {
        authButton.textContent = savedUsername;
        isAuthenticated = true;
    }

    authButton.addEventListener("click", () => {
        if (isAuthenticated) {
            dropdownMenu?.classList.toggle("hidden");
        } else {
            toggleOverlay();
        }
    });

    closeOverlay?.addEventListener("click", toggleOverlay);

    /*switchAuthMode.addEventListener("click", () => {
        isRegistering = !isRegistering;
        modalTitle.textContent = isRegistering ? "ลงทะเบียน" : "เข้าสู่ระบบ";
        switchAuthMode.textContent = isRegistering
            ? "เข้าสู่ระบบ"
            : "ลงทะเบียน";

        // ซ่อน/แสดงช่อง email และ confirm password
        emailField.classList.toggle("hidden", !isRegistering);
        confirmPasswordField.classList.toggle("hidden", !isRegistering);

        emailField.required = isRegistering;
        confirmPasswordField.required = isRegistering;

        // เปลี่ยนปุ่ม submit ให้เหมาะสม
        authForm.querySelector("button[type='submit']").textContent = isRegistering
            ? "ลงทะเบียน"
            : "เข้าสู่ระบบ";
    });*/

    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (isRegistering) {
            const confirmPassword = confirmPasswordField.value;

            // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
            if (password !== confirmPassword) {
                alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
                return;
            }

            // ตรวจสอบว่าอีเมลถูกต้องหรือไม่ (ใช้ HTML attribute `required` หรือเพิ่มเติมการตรวจสอบแบบ regex)
            if (!email) {
                alert("กรุณากรอกอีเมลที่ถูกต้อง!");
                return;
            }
        }

        const endpoint = isRegistering
            ? "/api/auth/signup"
            : "/api/auth/signin";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    isRegistering
                        ? { username, email, password }
                        : { username, password }
                ),
                credentials: "include", // สำคัญสำหรับส่ง cookie
            });

            if (!response.ok) {
                throw new Error("Authentication failed!");
            }

            const data = await response.json(); // ข้อมูล response body
            localStorage.setItem("id", data.id); // Save user ID
            localStorage.setItem("username", data.username); // Save username
            localStorage.setItem("isAuthenticated", "true"); // Save authentication state


            // อัปเดต UI ด้วย username
            authButton.textContent = data.username;
            window.location.reload();

            // ปิด overlay
            toggleOverlay();
        } catch (error) {
            alert(error.message);
        }
    });

    logoutLink.addEventListener("click", () => {
        // Reset UI
        isAuthenticated = false;
        authButton.textContent = "เข้าสู่ระบบ";
        dropdownMenu.classList.add("hidden");

        // Clear localStorage
        localStorage.removeItem("username");
        localStorage.removeItem("isAuthenticated");

        // Send a logout request to the server
        fetch("/api/auth/signout", {
            method: "POST",
            credentials: "include", // Include cookie
        })
        .then(() => {
            // Reload the page after successful logout
            window.location.reload();
        })
        .catch(() => {
            alert("Logout failed!");
            // Optional: Reload the page even if the logout request fails
            window.location.reload();
        });
    });
});
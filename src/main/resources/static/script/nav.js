(async function checkServerRestart() {
    const savedServerId = localStorage.getItem("server_id");

    const res = await fetch("/api/version");
    const data = await res.json();

    if (savedServerId !== data.serverId) {
        console.log("Server restarted! Clearing localStorage...");
        localStorage.clear(); // หรือเฉพาะบาง key เช่น localStorage.removeItem("sub");
        localStorage.setItem("server_id", data.serverId);
        location.reload(); // ถ้าต้อง reload หน้า
    }
})();


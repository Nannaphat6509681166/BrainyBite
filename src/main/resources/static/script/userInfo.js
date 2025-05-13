document.addEventListener("DOMContentLoaded", () => {
    // Get user ID from localStorage
    const userId = localStorage.getItem("id");
    if (!userId) {
        alert("No user ID found. Please log in again.");
        window.location.href = "login.html"; // Redirect to login page if user ID is missing
        return;
    }

    // Fetch user information from the backend
    // Fetch user information from the backend
    fetch(`/api/info/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            const userInfoContainer = document.getElementById("userinfo");

            // Clear previous content (if any)
            userInfoContainer.innerHTML = `
                <img src="pic/user.jpg" alt="User" width="150" height="150">
            `;

            // Dynamically add user details
            const userCard = document.createElement("div");
            userCard.classList.add("user-card");

            userCard.innerHTML = `
                <h3>${data.username}</h3>
                <p>${data.email}</p>
                <p>${data.bio}</p>
            `;

            userInfoContainer.appendChild(userCard);
        })
        .catch(error => {
            console.error("Error loading user information:", error);
            alert("Error loading user information. Please try again later.");
        });
});

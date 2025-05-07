// Helper function to check if the user is logged in
function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

// Load and render all articles
async function loadArticles() {
    try {
        const response = await fetch('/api/allArticles');
        const data = await response.json();
        const articlesContainer = document.getElementById("allArticles");

        const loggedIn = isUserLoggedIn(); // Check if the user is logged in
        console.log("User Logged In:", loggedIn); // Debugging output

        const userId = localStorage.getItem("id");

        data.forEach(async article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            // Determine the bookmark state for the article
            //const isBookmarked = bookmarkStates[article.article_id] || false;

            var isBookmarked = await checkBookmarkStatus(userId, article.article_id);


            // Insert the article content
            articleCard.innerHTML = `
                <img src="${article.thumbnail_url}" class="thumbnail" alt="${article.title}">
                <div class="upper">
                    <h3 class="article-title">${article.title}</h3>
                    <img src="${isBookmarked ? "pic/bookmark-yellow.png" : "pic/bookmark.png"}"
                        alt="Bookmark"
                        class="bookmark-icon ${loggedIn ? '' : 'hidden'}">
                </div>
                <p>${article.description}</p>
            `;

            // Add click event to the thumbnail and title
            articleCard.querySelector(".thumbnail").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            articleCard.querySelector(".article-title").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            // Add click event to the bookmark icon
            const bookmarkIcon = articleCard.querySelector(".bookmark-icon");
            if (bookmarkIcon) {
                bookmarkIcon.addEventListener("click", (event) => {
                    event.stopPropagation(); // ป้องกันไม่ให้เกิด event ที่ซ้อนกัน
                    handleBookmarkClick(event, article.article_id, bookmarkIcon);
                });
            }

            // Append the article card to the articles container
            articlesContainer.appendChild(articleCard);
        });
    } catch (error) {
        console.error("Error loading articles:", error);
        alert("Error loading articles. Please try again later.");
    }
}

// Handle bookmark click events
async function handleBookmarkClick(event, articleId, bookmarkIcon) {
    event.stopPropagation(); // Prevent the card click from triggering

    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not authenticated. Please log in.");
        return;
    }

    try {
        const currentState = await checkBookmarkStatus(userId, articleId);

        if (currentState == true) {
            // Already bookmarked, remove it
            bookmarkIcon.src = "pic/bookmark.png";
            await deleteBookmark(articleId);
        } else if (currentState == false) {
            // Not bookmarked, add it
            await addBookmark(articleId);
            bookmarkIcon.src = "pic/bookmark-yellow.png";
        }

        // Add animation class
        bookmarkIcon.classList.add("animate");
        setTimeout(() => bookmarkIcon.classList.remove("animate"), 200);
    } catch (error) {
        console.error("Error handling bookmark click:", error);
    }
}

// Check if an article is bookmarked
async function checkBookmarkStatus(userId, articleId) {
    try {
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`, { method: "GET" });
        if (!response.ok) {
            return false; // ไม่เจอข้อมูลถือว่าไม่ bookmark
        } else {
            return true;
        }

    } catch (error) {
        console.error("Error checking bookmark status", error);
        throw error;
    }
}

// Add a bookmark (POST request)
async function addBookmark(articleId) {
    const userId = localStorage.getItem("id");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId), article_id: Number(articleId) }),
    };

    try {
        const response = await fetch("/api/addBookmark", requestOptions);
        if (!response.ok) {
            throw new Error(`Error adding bookmark: ${response.status}`);
        }
        console.log("Bookmark added successfully.");
    } catch (error) {
        console.error("Error adding bookmark:", error);
        throw error;
    }
}

// Remove a bookmark (DELETE request)
async function deleteBookmark(articleId) {
    const userId = localStorage.getItem("id");
    if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
    }

    try {
        // Fetch the bookmark ID first
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`, { method: "GET" });
        if (!response.ok) {
            throw new Error(`Error fetching bookmark: HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.bookmark_id) {
            throw new Error("Invalid response: bookmark_id is missing.");
        }
        const bookmarkId = data.bookmark_id;

        // Delete the bookmark
        const deleteResponse = await fetch(`/api/delete/${bookmarkId}`, { method: "DELETE" });
        if (!deleteResponse.ok) {
            throw new Error(`Error deleting bookmark: HTTP ${deleteResponse.status}`);
        }

        console.log("Bookmark deleted successfully.");
    } catch (error) {
        console.error("Error while deleting bookmark:", error);
        alert("Failed to delete bookmark. Please try again later.");
    }
}


// Initialize the application
loadArticles(); 

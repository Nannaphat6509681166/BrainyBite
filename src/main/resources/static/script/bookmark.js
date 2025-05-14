// Handle bookmark click events

async function handleBookmarkClick(event, articleId, bookmarkIcon) {
    event.stopPropagation(); // Prevent the card click from triggering

    const userId = localStorage.getItem("sub");

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
    const userId = localStorage.getItem("sub");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub: userId, article_id: Number(articleId) }),
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
    const userId = localStorage.getItem("sub");
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
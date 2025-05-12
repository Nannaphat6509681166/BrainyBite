// Function to check if user is logged in
function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token);
    return !!token;
}

// Get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fetch articles based on search term
function fetchArticles(searchTerm) {
    fetch('/api/article/' + searchTerm)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => displayArticles(data))
        .catch(error => console.error('Fetch error:', error));
}

// Display articles on the page
async function displayArticles(articles) {
    console.log('Fetched Articles:', articles);

    const searchResultsDiv = document.getElementById('searchResults');
    const articlesContainer = document.getElementById("allArticles");
    articlesContainer.innerHTML = ''; // Clear previous

    if (articles.length === 0) {
        searchResultsDiv.textContent = 'No articles found.';
        return;
    }

    const loggedIn = isUserLoggedIn();
    const userId = localStorage.getItem("id");

    for (const article of articles) {
        if (!article.id && !article.article_id) {
            console.warn("Skipping article with missing ID:", article);
            continue;
        }

        let isBookmarked = false;
        try {
            isBookmarked = await checkBookmarkStatus(userId, article.article_id);
        } catch (e) {
            console.warn("Bookmark check failed:", e);
        }

        const thumbnail = article.thumbnail_url || 'default-thumbnail.jpg';
        const title = article.title || 'Untitled';
        const description = article.description || 'No description available.';

        const articleCard = document.createElement("div");
        articleCard.classList.add("article-card");

        articleCard.innerHTML = `
            <img src="${thumbnail}" class="thumbnail" alt="${title}">
            <div class="upper">
                <h3 class="article-title">${title}</h3>
                <img src="${isBookmarked ? "pic/bookmark-yellow.png" : "pic/bookmark.png"}"
                    alt="Bookmark"
                    class="bookmark-icon ${loggedIn ? '' : 'hidden'}">
            </div>
            <p>${description}</p>
        `;

        // Click to open article detail
        const openArticle = () => {
            window.location.href = `article-detail.html?articleId=${article.article_id}`;
        };
        articleCard.querySelector(".thumbnail").addEventListener("click", openArticle);
        articleCard.querySelector(".article-title").addEventListener("click", openArticle);

        const bookmarkIcon = articleCard.querySelector(".bookmark-icon");
        if (bookmarkIcon) {
            bookmarkIcon.addEventListener("click", (event) => {
                event.stopPropagation();
                handleBookmarkClick(event, article.article_id, bookmarkIcon);
            });
        }

        articlesContainer.appendChild(articleCard);
    }
}

// On page load
window.onload = function () {
    const searchTerm = getQueryParam('search');
    const searchResultsDiv = document.getElementById('searchResults');

    if (searchTerm) {
        fetchArticles(searchTerm);
    } else {
        searchResultsDiv.textContent = 'No search term provided.';
    }
};

// Handle bookmark icon click
async function handleBookmarkClick(event, articleId, bookmarkIcon) {
    event.stopPropagation();

    const userId = localStorage.getItem("id");
    if (!userId) {
        alert("User not authenticated. Please log in.");
        return;
    }

    try {
        const currentState = await checkBookmarkStatus(userId, articleId);

        if (currentState) {
            bookmarkIcon.src = "pic/bookmark.png";
            await deleteBookmark(articleId);
        } else {
            await addBookmark(articleId);
            bookmarkIcon.src = "pic/bookmark-yellow.png";
        }

        bookmarkIcon.classList.add("animate");
        setTimeout(() => bookmarkIcon.classList.remove("animate"), 200);
    } catch (error) {
        console.error("Bookmark click error:", error);
    }
}

// Check bookmark status
async function checkBookmarkStatus(userId, articleId) {
    try {
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`);
        if (!response.ok) return false;

        const data = await response.json();
        return data && data.bookmark_id !== undefined;
    } catch (error) {
        console.error("Error checking bookmark status", error);
        return false;
    }
}

// Add a bookmark
async function addBookmark(articleId) {
    const userId = localStorage.getItem("id");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId), article_id: Number(articleId) }),
    };

    const response = await fetch("/api/addBookmark", requestOptions);
    if (!response.ok) {
        throw new Error(`Add bookmark failed: ${response.status}`);
    }

    console.log("Bookmark added.");
}

// Delete a bookmark
async function deleteBookmark(articleId) {
    const userId = localStorage.getItem("id");
    if (!userId) {
        console.error("User ID missing.");
        return;
    }

    try {
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`);
        if (!response.ok) throw new Error("Bookmark not found.");

        const data = await response.json();
        if (!data.bookmark_id) throw new Error("Missing bookmark ID");

        const deleteResponse = await fetch(`/api/delete/${data.bookmark_id}`, { method: "DELETE" });
        if (!deleteResponse.ok) throw new Error(`Delete failed: ${deleteResponse.status}`);

        console.log("Bookmark deleted.");
    } catch (error) {
        console.error("Delete bookmark error:", error);
        alert("Failed to delete bookmark.");
    }
}

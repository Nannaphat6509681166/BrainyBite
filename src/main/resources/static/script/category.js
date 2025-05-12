// Helper function to get query parameter values
function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch and display articles by category
function fetchArticlesByCategory(category) {
    //articlesContainer.innerHTML = '<p>Loading articles...</p>'; // Placeholder while loading

    fetch(`/api/category/${encodeURIComponent(category)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayArticles(data);
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
        });
}

// Function to render articles dynamically
function displayArticles(articles) {
    const articlesContainer = document.getElementById('allArticles');
    articlesContainer.innerHTML = ''; // Clear previous content

    if (!articles || articles.length === 0) {
        articlesContainer.innerHTML = '<p>No articles found for this category.</p>';
        return;
    }

    articles.forEach(async article => {
        const articleDiv = document.createElement('div');
        //articleDiv.classList.add('article');

        // Add article image

        const loggedIn = isUserLoggedIn(); // Check if the user is logged in
        console.log("User Logged In:", loggedIn);

        const userId = localStorage.getItem("id");

        const articleCard = document.createElement("div");
        articleCard.classList.add("article-card");
        const articlesContainer = document.getElementById("allArticles");

        var isBookmarked = await checkBookmarkStatus(userId, article.article_id)

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

        /*const img = document.createElement('img');
        img.src = article.thumbnail_url || 'default-thumbnail.jpg';
        img.alt = article.title || 'Article Image';
        articleDiv.appendChild(img);

        // Add article title
        const title = document.createElement('h3');
        title.textContent = article.title || 'Untitled';
        articleDiv.appendChild(title);

        // Add article description
        const description = document.createElement('p');
        description.textContent = article.description || 'No description available.';
        articleDiv.appendChild(description);

        // Add click event listener for navigation
        const articleId = article.id || article.article_id; // Adjust based on API response
        articleDiv.addEventListener('click', () => {
            if (articleId) {
                window.location.href = `article-detail.html?articleId=${articleId}`;
            } else {
                console.error('Article ID is missing:', article);
                alert('Unable to navigate: Article ID is missing.');
            }
        });*/
        articleCard.querySelector(".thumbnail").addEventListener("click", () => {
            window.location.href = `article-detail.html?articleId=${article.article_id}`;
        });

        articleCard.querySelector(".article-title").addEventListener("click", () => {
            window.location.href = `article-detail.html?articleId=${article.article_id}`;
        });

        const bookmarkIcon = articleCard.querySelector(".bookmark-icon");
        if (bookmarkIcon) {
            bookmarkIcon.addEventListener("click", (event) => {
                event.stopPropagation(); // ป้องกันไม่ให้เกิด event ที่ซ้อนกัน
                handleBookmarkClick(event, article.article_id, bookmarkIcon);
            });
        }

        // Append article div to the container
        articlesContainer.appendChild(articleCard);
    });
}

// Function to update the category title
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) {
        categoryTitle.textContent = `${category || 'Unknown'}`;
    }
}

// Entry point on page load
window.onload = function () {
    const category = getQueryParam('category');

    if (category) {
        // Update the category title
        updateCategoryTitle(category);

        // Fetch and display articles for the selected category
        fetchArticlesByCategory(category);
    } else {
        const articlesContainer = document.getElementById('allArticles');
    }
};

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


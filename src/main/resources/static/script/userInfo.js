function isUserLoggedIn() {
  const user_sub = localStorage.getItem("sub");
  console.log("User Sub from localStorage:", user_sub); // Debugging output
  return !!user_sub;
}

document.addEventListener("DOMContentLoaded", () => {
    const userInfoContainer = document.getElementById("userInfoContainer");

      // สร้าง HTML structure ที่รวมรูปกับ user info
      userInfoContainer.innerHTML = `
        <img src="pic/user.jpg" alt="User" width="150" height="150">
        <div class="user-card">
          <h3>Username</h3>
          <p id="username">Loading...</p>
          <h3>Email</h3>
          <p id="email">Loading...</p>
        </div>
      `;

  const usernameElem = document.getElementById("username");
  const emailElem = document.getElementById("email");
  const userBookmarkContainer = document.getElementById("userbookmark");

  // Step 1: Fetch user info
  fetch("/me")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      return response.json();
    })
    .then(data => {
      const username = data.username || "N/A";
      const email = data.email || "N/A";
      const sub = data.sub;

      // Update UI with user info
      usernameElem.textContent = username;
      emailElem.textContent = email;

      // Store sub in localStorage for later use
      localStorage.setItem("sub", sub);

      // Step 2: Fetch user bookmarks using sub
      return fetch(`/api/bookmark/${sub}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(bookmarks => {
      // Clear previous content
      userBookmarkContainer.innerHTML = "";

      if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
        const noBookmarkMessage = document.createElement("p");
        noBookmarkMessage.textContent =
          "No bookmarks found. Start adding your favorite content!";
        noBookmarkMessage.classList.add("no-bookmark-message");
        userBookmarkContainer.appendChild(noBookmarkMessage);
        return;
      }

      // Render each bookmark
      bookmarks.forEach(bookmark => {
        const bookmarkCard = document.createElement("div");
        bookmarkCard.classList.add("bookmark-card");

        bookmarkCard.innerHTML = `
          <div class="thumbnail">
            <img src="${bookmark.thumbnail_url}" alt="${bookmark.title}" width="100" height="100">
          </div>
          <div class="bookmark-details">
            <h3 class="article-title">${bookmark.title}</h3>
            <p>${bookmark.description}</p>
          </div>
        `;

        const linkTarget = `article-detail.html?articleId=${bookmark.article_id}`;
        bookmarkCard.querySelector(".thumbnail img").addEventListener("click", () => {
          window.location.href = linkTarget;
        });
        bookmarkCard.querySelector(".article-title").addEventListener("click", () => {
          window.location.href = linkTarget;
        });

        userBookmarkContainer.appendChild(bookmarkCard);
      });
    })
    .catch(error => {
      console.error("Error loading bookmarks:", error);
      userBookmarkContainer.innerHTML =
        '<p class="error-message">Error loading bookmarks. Please try again later.</p>';
    });
});

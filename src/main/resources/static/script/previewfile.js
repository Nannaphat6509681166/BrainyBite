// Extract article ID from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('articleId'); // Make sure the parameter matches

// Function to format the date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);

    // Adjust to Buddhist calendar for Thai year
    const buddhistYear = date.getFullYear() + 543;
    const thaiMonth = date.toLocaleDateString('th-TH', { month: 'long' });
    const day = date.getDate();

    return `${day} ${thaiMonth} ${buddhistYear}`;
}

if (articleId) {
    // Fetch article details using the article ID
    fetch(`/api/article-detail/${articleId}`)
        .then(response => response.json())
        .then(data => {
            const articleDetailsContainer = document.getElementById("articleDetails");

            if (data) {
                // Format the published date
                const formattedDate = formatDate(data.published);

                // Display article details
                articleDetailsContainer.innerHTML = `
                    <img src="${data.thumbnail_url}" alt="${data.title}">
                    <h1>${data.title}</h1>
                    <h2>ผู้เขียน: ${data.author}</h2>
                    <h2>เผยแพร่เมื่อ: ${formattedDate}</h2>
                    <div id="markdown-content" class="markdown-section"></div>
                `;

                // Use the article URL as the Markdown file URL
                const markdownUrl = data.article_url;

                // Fetch and display the Markdown content
                fetch(markdownUrl)
                    .then(response => response.text())
                    .then(markdown => {
                        const converter = new showdown.Converter();
                        const htmlContent = converter.makeHtml(markdown);
                        document.getElementById('markdown-content').innerHTML = htmlContent;
                    })
                    .catch(error => {
                        console.error('Error loading Markdown:', error);
                        document.getElementById('markdown-content').textContent = 'Failed to load content.';
                    });
            } else {
                articleDetailsContainer.innerHTML = '<p>Article not found.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching article details:", error);
            alert("Error loading article. Please try again later.");
        });
} else {
    alert("No article ID provided in the URL.");
}

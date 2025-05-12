// Function to handle form submission
function handleSearch(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the value from the search input
    var searchTerm = document.getElementById('searchInput').value.trim();

    // Ensure the search term is valid
    if (!searchTerm) {
        alert('กรุณาใส่คำค้นหา'); // Show an alert if the search term is empty
        return;
    }

    // Redirect to the search results page with the search term
    window.location.href = 'search.html?search=' + encodeURIComponent(searchTerm);
}

// Add event listener to the form
document.getElementById('searchForm').addEventListener('submit', handleSearch);

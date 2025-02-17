document.addEventListener("DOMContentLoaded", function () {
    // Hide all sections except Home
    function hideAllSections() {
        document.querySelectorAll("section").forEach(section => {
            section.style.display = "none";
        });
    }

    // Show the selected section
    function showSection(sectionId) {
        hideAllSections();
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "block";
        }
    }

    // Add event listeners to navigation links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute("href").substring(1);
            showSection(targetSection);
        });
    });

    // Show Home section by default
    showSection("home");
});
document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission
    const query = document.getElementById("searchInput").value.toLowerCase();
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        const productName = product.querySelector("h3").textContent.toLowerCase();
        if (productName.includes(query)) {
            product.style.display = "block"; // Show matching product
        } else {
            product.style.display = "none"; // Hide non-matching product
        }
    });
});

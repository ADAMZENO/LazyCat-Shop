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

    // ค้นหาสินค้าในหน้า Products
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission
        const query = document.getElementById("searchInput").value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(query) ? "block" : "none";
        });
    });

    // เพิ่ม Scroll Effect ให้ Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // เพิ่ม Parallax Effect ให้ Hero Section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        let scrollPosition = window.scrollY;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // ฟอร์มติดต่อ (Contact Form) ใช้ SweetAlert
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault(); // ป้องกันการรีโหลดหน้า

        Swal.fire({
            title: "ส่งแบบฟอร์มสำเร็จแล้ว!",
            text: "เราจะติดต่อกลับโดยเร็วที่สุด 😊",
            icon: "success",
            confirmButtonColor: "#6a0dad"
        });

        // ล้างค่าฟอร์ม
        this.reset();
    });
});

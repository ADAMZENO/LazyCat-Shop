document.addEventListener("DOMContentLoaded", function () {
    // ส่วนของ Navigation และ Section Management
    function hideAllSections() {
        document.querySelectorAll("section").forEach(section => {
            section.style.display = "none";
        });
    }

    function showSection(sectionId) {
        hideAllSections();
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = "block";
        }
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute("href").substring(1);
            showSection(targetSection);
        });
    });

    showSection("home");

    // ส่วนของ Search
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(query) ? "block" : "none";
        });
    });

    // ส่วนของ Scroll Effects
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        let scrollPosition = window.scrollY;
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });

    // ส่วนของ Contact Form
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault();
        Swal.fire({
            title: "ส่งแบบฟอร์มสำเร็จแล้ว!",
            text: "เราจะติดต่อกลับโดยเร็วที่สุด 😊",
            icon: "success",
            confirmButtonColor: "#6a0dad"
        });
        this.reset();
    });

    // ส่วนของตะกร้าสินค้า
    let cart = []; // เก็บสินค้าที่เพิ่มลงตะกร้า

    // เปิด/ปิด Sidebar ตะกร้าสินค้า
    document.getElementById("cart-icon").addEventListener("click", function () {
        document.getElementById("cart-sidebar").classList.toggle("open");
    });

    document.getElementById("close-cart").addEventListener("click", function () {
        document.getElementById("cart-sidebar").classList.remove("open");
    });

    // เพิ่มสินค้าไปยังตะกร้า
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.closest(".product");
            const productName = product.querySelector("h3").textContent;
            const productPrice = product.querySelector(".price").textContent;
            const productImage = product.querySelector("img").src;
            const productId = product.getAttribute("data-id");

            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
                Swal.fire({
                    title: "เพิ่มสินค้าสำเร็จ!",
                    text: `เพิ่ม ${productName} ลงในตะกร้าแล้ว (จำนวน: ${existingItem.quantity})`,
                    icon: "success",
                    confirmButtonColor: "#6a0dad"
                });
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
                Swal.fire({
                    title: "เพิ่มสินค้าสำเร็จ!",
                    text: `เพิ่ม ${productName} ลงในตะกร้าแล้ว`,
                    icon: "success",
                    confirmButtonColor: "#6a0dad"
                });
            }

            // เพิ่มคลาส "added" เพื่อแสดงเอฟเฟกต์
            this.classList.add("added");
            setTimeout(() => {
                this.classList.remove("added");
            }, 500); // ลบคลาสหลังจาก 0.5 วินาที

            updateCart();
        });
    });

    // อัปเดตแสดงผลตะกร้า
    function updateCart() {
        const cartContainer = document.getElementById("cart-items");
        cartContainer.innerHTML = "";

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price}</span>
                    <span class="cart-item-quantity">จำนวน: ${item.quantity}</span>
                </div>
                <button class="remove-item" data-id="${item.id}">X</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // กำหนดปุ่มลบสินค้า
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-id");
                const productName = cart.find(item => item.id === productId).name;
                cart = cart.filter(item => item.id !== productId);

                Swal.fire({
                    title: "Remove from Cart",
                    text: `ลบ ${productName} ออกจากตะกร้าแล้ว`,
                    icon: "success",
                    confirmButtonColor: "#6a0dad"
                });

                updateCart();
            });
        });

        // อัปเดตราคาทั้งหมด
        updateTotal();
    }

    // คำนวณราคาทั้งหมด
    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace("฿", "")) * item.quantity, 0);
        document.getElementById("cart-total").textContent = `รวม: ฿${total.toFixed(2)}`;
    }

    // ตรวจสอบว่าตะกร้าว่างหรือไม่
    function checkCartEmpty() {
        if (cart.length === 0) {
            document.getElementById("cart-items").innerHTML = "<p>Your cart is empty.</p>";
            document.getElementById("cart-total").textContent = "Total price: ฿0.00";
        }
    }

    // เรียกใช้ฟังก์ชันตรวจสอบตะกร้าว่างเมื่อโหลดหน้าเว็บ
    checkCartEmpty();
});

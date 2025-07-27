/* index.js */
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    showSection("home");

    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(product => {
            const productName = product.querySelector("h3").textContent.toLowerCase();
            product.style.display = productName.includes(query) ? "block" : "none";
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const backToTop = document.getElementById('back-to-top');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTop.style.display = 'block';
        } else {
            header.classList.remove('scrolled');
            backToTop.style.display = 'none';
        }
    });

    document.getElementById("back-to-top").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = 'block';
        setTimeout(() => {
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                spinner.style.display = 'none';
                if (response.ok) {
                    Swal.fire({
                        title: "Message Sent!",
                        text: "We'll get back to you soon 😺",
                        icon: "success",
                        confirmButtonColor: "#6a0dad"
                    });
                    this.reset();
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to send message. Please try again.",
                        icon: "error",
                        confirmButtonColor: "#6a0dad"
                    });
                }
            });
        }, 1000);
    });

    document.getElementById("cart-icon").addEventListener("click", function () {
        document.getElementById("cart-sidebar").classList.toggle("open");
    });

    document.getElementById("close-cart").addEventListener("click", function () {
        document.getElementById("cart-sidebar").classList.remove("open");
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        if (cart.length === 0) {
            Swal.fire({
                title: "Empty Cart",
                text: "Your cart is empty. Add some outfits first!",
                icon: "warning",
                confirmButtonColor: "#6a0dad"
            });
        } else {
            Swal.fire({
                title: "Checkout",
                text: "Proceeding to checkout (simulated).",
                icon: "success",
                confirmButtonColor: "#6a0dad"
            });
        }
    });

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
                    title: "Added to Cart!",
                    text: `${productName} (x${existingItem.quantity}) added to cart.`,
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
                    title: "Added to Cart!",
                    text: `${productName} added to cart.`,
                    icon: "success",
                    confirmButtonColor: "#6a0dad"
                });
            }

            this.classList.add("added");
            setTimeout(() => this.classList.remove("added"), 500);
            updateCart();
            saveCart();
        });
    });

    function updateCart() {
        const cartContainer = document.getElementById("cart-items");
        cartContainer.innerHTML = cart.length === 0 ? "<p>Your cart is empty.</p>" : "";

        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price}</span>
                    <span class="cart-item-quantity">
                        Quantity: 
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        ${item.quantity}
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </span>
                </div>
                <button class="remove-item" data-id="${item.id}">X</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-id");
                const productName = cart.find(item => item.id === productId).name;
                cart = cart.filter(item => item.id !== productId);
                Swal.fire({
                    title: "Removed from Cart",
                    text: `${productName} removed from cart.`,
                    icon: "success",
                    confirmButtonColor: "#6a0dad"
                });
                updateCart();
                saveCart();
            });
        });

        document.querySelectorAll(".quantity-btn").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-id");
                const action = this.getAttribute("data-action");
                const item = cart.find(item => item.id === productId);
                if (action === "increase") {
                    item.quantity++;
                } else if (action === "decrease" && item.quantity > 1) {
                    item.quantity--;
                }
                updateCart();
                saveCart();
            });
        });

        updateTotal();
    }

    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace("฿", "")) * item.quantity, 0);
        document.getElementById("cart-total").textContent = `Total: ฿${total.toFixed(2)}`;
    }

    updateCart();
    updateCartCount();
});

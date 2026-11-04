// Velora - E-commerce Website

const products = [
    {
        id: 1,
        name: "Classic Beige Blazer",
        price: 2499,
        category: "Clothing",
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Everyday Tote Bag",
        price: 1499,
        category: "Accessories",
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Minimal Ceramic Vase",
        price: 899,
        category: "Home",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Elegant Summer Dress",
        price: 1999,
        category: "Clothing",
        tag: "TRENDING",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Classic Sunglasses",
        price: 799,
        category: "Accessories",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Soft Cushion Set",
        price: 1199,
        category: "Home",
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Women's Casual Shirt",
        price: 1299,
        category: "Clothing",
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Minimal Gold Watch",
        price: 1799,
        category: "Accessories",
        tag: "LIMITED",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    }
];

// Load saved data
let cart = JSON.parse(localStorage.getItem("veloraCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("veloraWishlist")) || [];

let activeCategory = "All";

// HTML elements
const productGrid = document.getElementById("productGrid");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishlistButton = document.getElementById("wishlistButton");
const wishlistDrawer = document.getElementById("wishlistDrawer");
const wishlistItems = document.getElementById("wishlistItems");
const wishlistCount = document.getElementById("wishlistCount");

const overlay = document.getElementById("overlay");

// Format prices in Indian Rupees
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Save data in browser
function saveData() {
    localStorage.setItem("veloraCart", JSON.stringify(cart));
    localStorage.setItem("veloraWishlist", JSON.stringify(wishlist));
}

// Display products
function displayProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = "";

    emptyMessage.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const isWishlisted = wishlist.includes(product.id);

        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-tag">${product.tag}</span>

                <button class="wishlist-btn ${isWishlisted ? "selected" : ""}"
                    data-id="${product.id}"
                    aria-label="Add ${product.name} to wishlist">
                    ${isWishlisted ? "♥" : "♡"}
                </button>

                <button class="add-btn" data-id="${product.id}">
                    Add to Bag +
                </button>
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)}</p>
            </div>
        `;

        productGrid.appendChild(card);
    });

    updateCounts();
}

// Category filter
document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        activeCategory = button.dataset.category;

        displayProducts();
    });
});

// Search products
searchInput.addEventListener("input", displayProducts);

// Add to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveData();
    updateCart();
}

// Change product quantity
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveData();
    updateCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    saveData();
    updateCart();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="cart-empty">Your bag is currently empty.</p>`;
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        total += product.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-details">
                <h4>${product.name}</h4>
                <p>${formatPrice(product.price)}</p>

                <div class="quantity-controls">
                    <button data-action="decrease" data-id="${product.id}">−</button>
                    <span>${item.quantity}</span>
                    <button data-action="increase" data-id="${product.id}">+</button>
                    <button class="remove-btn" data-action="remove" data-id="${product.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = formatPrice(total);
    cartCount.textContent = totalQuantity;

    updateCounts();
}

// Update cart and wishlist counts
function updateCounts() {
    cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    wishlistCount.textContent = wishlist.length;
}

// Wishlist
function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }

    saveData();
    displayProducts();
    updateWishlist();
}

// Display wishlist
function updateWishlist() {
    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistItems.innerHTML =
            `<p class="cart-empty">Your wishlist is empty.</p>`;
        return;
    }

    wishlist.forEach(id => {
        const product = products.find(p => p.id === id);

        if (!product) return;

        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-details">
                <h4>${product.name}</h4>
                <p>${formatPrice(product.price)}</p>

                <div class="quantity-controls">
                    <button data-wish-action="add" data-id="${product.id}">
                        Add to Bag
                    </button>
                    <button class="remove-btn"
                        data-wish-action="remove" data-id="${product.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;

        wishlistItems.appendChild(item);
    });
}

// Open and close drawers
function openDrawer(drawer) {
    cartDrawer.classList.remove("open");
    wishlistDrawer.classList.remove("open");

    drawer.classList.add("open");
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeDrawers() {
    cartDrawer.classList.remove("open");
    wishlistDrawer.classList.remove("open");
    overlay.classList.remove("show");
    document.body.style.overflow = "";
}

cartButton.addEventListener("click", () => {
    updateCart();
    openDrawer(cartDrawer);
});

wishlistButton.addEventListener("click", () => {
    updateWishlist();
    openDrawer(wishlistDrawer);
});

document.getElementById("closeCart").addEventListener("click", closeDrawers);
document.getElementById("closeWishlist").addEventListener("click", closeDrawers);
overlay.addEventListener("click", closeDrawers);

// Product buttons
productGrid.addEventListener("click", event => {
    const addButton = event.target.closest(".add-btn");
    const wishButton = event.target.closest(".wishlist-btn");

    if (addButton) {
        addToCart(Number(addButton.dataset.id));
        addButton.textContent = "Added ✓";

        setTimeout(() => {
            addButton.textContent = "Add to Bag +";
        }, 1000);
    }

    if (wishButton) {
        toggleWishlist(Number(wishButton.dataset.id));
    }
});

// Cart quantity and remove buttons
cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(productId, 1);
    }

    if (action === "decrease") {
        changeQuantity(productId, -1);
    }

    if (action === "remove") {
        removeFromCart(productId);
    }
});

// Wishlist buttons
wishlistItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);
    const action = button.dataset.wishAction;

    if (action === "add") {
        addToCart(productId);
    }

    if (action === "remove") {
        wishlist = wishlist.filter(id => id !== productId);

        saveData();
        updateWishlist();
        displayProducts();
    }
});

// Checkout demo
document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty!");
        return;
    }

    const confirmed = confirm(
        "This is a demo checkout. No real payment will be collected. Continue?"
    );

    if (confirmed) {
        alert("Thank you for visiting Velora! This is a demo order.");
    }
});

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });
});

// Search icon
document.getElementById("searchFocus").addEventListener("click", () => {
    document.getElementById("shop").scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(() => searchInput.focus(), 500);
});

// Newsletter demo
document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("newsletterEmail").value;
    const message = document.getElementById("newsletterMessage");

    if (email) {
        message.textContent = "Thank you for subscribing!";
        event.target.reset();
    }
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial page setup
displayProducts();
updateCart();
updateWishlist();
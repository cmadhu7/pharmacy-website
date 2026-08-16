// ================================
// MEDICARE PHARMACY - SHOPPING CART
// ================================

// ---------- SHOPPING CART ----------

let cart = [];


// Add product to cart
function addToCart(productName, price) {

    const existingProduct = cart.find(function(product) {
        return product.name === productName;
    });


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });

    }


    displayCart();
}


// Display cart
function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        updateCartTotal();
        

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach(function(product, index) {

        const item =
            document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `
            <span>
                ${product.name}
            </span>

            <div class="quantity-controls">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <strong>
                    ${product.quantity}
                </strong>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>

            <span>
                ₹${product.price * product.quantity}
            </span>

            <button onclick="removeFromCart(${index})">
                Remove
            </button>
        `;


        cartItems.appendChild(item);

    });


    updateCartTotal();
    updateCartCount();
}


// Increase quantity
function increaseQuantity(index) {

    cart[index].quantity++;

    displayCart();
}


// Decrease quantity
function decreaseQuantity(index) {

    cart[index].quantity--;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    displayCart();
}


// Remove product completely
function removeFromCart(index) {

    cart.splice(index, 1);

    displayCart();
}


// Calculate total
function updateCartTotal() {

    const cartTotal =
        document.querySelector("#cart h3");

    let total = 0;


    cart.forEach(function(product) {

        total +=
            product.price * product.quantity;

    });


    cartTotal.textContent =
        "Total: ₹" + total;
}



// ---------- SEARCH PRODUCTS ----------

// Search products
function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const searchValue =
        searchInput.value.toLowerCase();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(function(product) {

        const productName =
            product.getAttribute("data-name").toLowerCase();

        if (productName.includes(searchValue)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });
}
// Update cart count
function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    let count = 0;

    cart.forEach(function(product) {

        count += product.quantity;

    });

    cartCount.textContent = count;
}
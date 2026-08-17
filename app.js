// State Management & LocalStorage Sync
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  ensureCartDrawerExists();
  updateCartBadge();
  renderCartPageItems();
  startLiveTelemetry();
  
  // Bind top navbar cart button on every page
  const cartBtn = document.querySelector('nav a[href*="cart"]');
  if (cartBtn) {
    cartBtn.setAttribute('href', 'javascript:void(0)');
    cartBtn.setAttribute('onclick', 'toggleCartDrawer()');
  }
});

// Cart Controls
function addToCart(itemName, price) {
  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
  cart.push({ name: itemName, price: price, id: Date.now() });
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartPageItems();
  showToast(`💊 Added "${itemName}" to Clinical Express Cart!`);
}

function updateCartBadge() {
  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.innerText = cart.length;
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed; bottom: 30px; right: 30px;
    background: linear-gradient(135deg, #06B6D4, #0284C7);
    color: white; padding: 1rem 1.5rem; border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-weight: 700;
    z-index: 9999; animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Ensure Cart Drawer markup is dynamically injected into body if missing
function ensureCartDrawerExists() {
  if (!document.getElementById('cart-drawer')) {
    const overlay = document.createElement('div');
    overlay.className = 'cart-drawer-overlay';
    overlay.id = 'cart-drawer-overlay';
    overlay.onclick = toggleCartDrawer;

    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.id = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h3>🛒 Your Medical Cart</h3>
        <button class="cart-close-btn" onclick="toggleCartDrawer()">&times;</button>
      </div>

      <div class="cart-drawer-body" id="drawer-cart-items">
        <!-- Selected items list will render dynamically here -->
      </div>

      <div class="cart-drawer-footer">
        <div class="cart-total-row">
          <span>Subtotal:</span>
          <span id="drawer-subtotal">₹0.00</span>
        </div>
        <div class="cart-total-row final-price">
          <span>Total (incl. Taxes):</span>
          <span id="drawer-total">₹0.00</span>
        </div>
        <button class="btn-buy" style="width: 100%; margin-top: 1rem;" onclick="alert('Order Dispatched Successfully! 🚀')">Proceed to Checkout 💳</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }
}

// Interactive Features
function uploadPrescription() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = () => {
    if (typeof showToast === "function") {
      showToast("📜 Prescription received! AI Scanner inspecting dosage matrix...");
    }
    setTimeout(() => {
      openPrescriptionModal();
    }, 1200);
  };
  fileInput.click();
}

function openPrescriptionModal() {
  const modal = document.getElementById('rx-modal');
  if (modal) modal.style.display = 'flex';
}

function closePrescriptionModal() {
  const modal = document.getElementById('rx-modal');
  if (modal) modal.style.display = 'none';
}

function autoAddScannedMeds() {
  addToCart("Amoxicillin Trio-Pack 500mg", 185);
  addToCart("Bio-Zinc Multi-Vitamin Complex", 340);
  closePrescriptionModal();
  showToast("✅ AI Extracted Medicines pushed to active Cart!");
}

function searchStore() {
  const query = document.getElementById('search-input')?.value;
  if (query) {
    showToast(`🔍 Querying Vault Database for: "${query}"`);
  } else {
    alert("Please enter a medicine or salt name.");
  }
}

function startLiveTelemetry() {
  setInterval(() => {
    const tempElement = document.getElementById('live-temp');
    if (tempElement) {
      const randomTemp = (3.5 + (Math.random() * 0.6 - 0.3)).toFixed(2);
      tempElement.innerText = `${randomTemp} °C`;
    }
  }, 2000);
}

// Auth Modals Toggle
function openAuthModal(type) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('auth-title');

  modal.style.display = 'flex';
  if (type === 'login') {
    title.innerText = "Security Portal • Sign In";
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  } else {
    title.innerText = "Register Clinical Profile";
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
}

function handleLogin(e) {
  e.preventDefault();
  closeAuthModal();
  showToast("🔓 User authenticated successfully via Biometric Check!");
}

function handleSignup(e) {
  e.preventDefault();
  closeAuthModal();
  showToast("🎉 Account created! Verification key sent to mobile.");
}

// Delivery Location Simulator
function updateDeliveryLocation() {
  const locInput = document.getElementById('user-location')?.value;
  const statusBox = document.getElementById('dispatch-status');
  if (locInput && statusBox) {
    statusBox.innerHTML = `📍 Target: <b>${locInput}</b> • ETA: <b>14 Mins</b> via Express Hub Drone`;
    showToast(`📍 Logistics recalculating route for: ${locInput}`);
  } else {
    alert("Please enter a valid delivery location or pincode.");
  }
}

// Cart Drawer Open/Close & Dynamic Render Logic
function toggleCartDrawer() {
  ensureCartDrawerExists();
  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
  
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  
  if (drawer && drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
  } else if (drawer) {
    drawer.classList.add('open');
    if (overlay) overlay.style.display = 'block';
    renderDrawerItems();
  }
}

function renderDrawerItems() {
  ensureCartDrawerExists();
  const container = document.getElementById('drawer-cart-items');
  const subtotalEl = document.getElementById('drawer-subtotal');
  const totalEl = document.getElementById('drawer-total');

  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align:center; color: var(--text-muted); margin-top: 3rem;">🛒 Your cart is currently empty.</div>`;
    if (subtotalEl) subtotalEl.innerText = "₹0.00";
    if (totalEl) totalEl.innerText = "₹0.00";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map((item, index) => {
    subtotal += item.price;
    return `
      <div class="cart-item-card">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>
        </div>
        <button class="cart-remove-btn" onclick="removeFromDrawer(${index})">Remove</button>
      </div>
    `;
  }).join('');

  const total = subtotal + (subtotal * 0.12);
  if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `₹${total.toFixed(2)}`;
}

function removeFromDrawer(index) {
  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateCartBadge();
  renderDrawerItems();
  renderCartPageItems();
}

// Full page cart items renderer for cart.html
function renderCartPageItems() {
  const container = document.getElementById('cart-page-items');
  if (!container) return;

  cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-surface); padding: 3rem; border-radius: 20px; border: 1px dashed var(--cyan-neon); text-align: center; margin: 2rem 0;">
        <h3 style="color: var(--text-muted); margin-bottom: 1rem;">🛒 Your Cart is Currently Empty</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Explore our clinical medicines catalog or botanical care products to add items.</p>
        <a href="medicines.html" class="btn-buy" style="text-decoration: none; display: inline-block;">Explore Medicines Catalog 💊</a>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  const itemsHtml = cart.map((item, index) => {
    subtotal += item.price;
    return `
      <div style="background: var(--bg-surface); border: 1px solid var(--panel-border); border-radius: 16px; padding: 1.2rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.3rem;">${item.name}</h4>
          <span style="color: var(--cyan-neon); font-weight: 700;">₹${item.price}</span>
        </div>
        <button class="cart-remove-btn" onclick="removeFromDrawer(${index})">Remove Item 🗑️</button>
      </div>
    `;
  }).join('');

  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; margin: 2rem 0;">
      <div>
        <h3 style="color: var(--blue-glow); margin-bottom: 1rem;">Selected Clinical Supplies (${cart.length})</h3>
        ${itemsHtml}
      </div>
      <div style="background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 20px; padding: 1.8rem; height: fit-content;">
        <h3 style="color: #fff; margin-bottom: 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.8rem;">Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; color: var(--text-muted);">
          <span>Items Subtotal:</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; color: var(--text-muted);">
          <span>GST Tax (12%):</span>
          <span>₹${tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 1.2rem; padding-top: 1rem; border-top: 1px solid var(--panel-border); color: #fff; font-size: 1.2rem; font-weight: 800;">
          <span>Total:</span>
          <span style="color: var(--cyan-neon);">₹${total.toFixed(2)}</span>
        </div>
        <button class="btn-buy" style="width: 100%; margin-top: 1.5rem; padding: 0.9rem;" onclick="alert('Order Dispatched Successfully! 🚀')">Proceed to Express Checkout 💳</button>
        <button class="btn-auth-outline" style="width: 100%; margin-top: 0.8rem;" onclick="clearCart()">Clear Cart 🗑️</button>
      </div>
    </div>
  `;
}

function clearCart() {
  cart = [];
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCartPageItems();
  renderDrawerItems();
  showToast("🗑️ Express Cart cleared!");
}

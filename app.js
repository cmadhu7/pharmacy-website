// State Management
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  startLiveTelemetry();
});

// Cart Controls
function addToCart(itemName, price) {
  cart.push({ name: itemName, price: price, id: Date.now() });
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`💊 Added "${itemName}" to Clinical Express Cart!`);
}

function updateCartBadge() {
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

// Interactive Features
function uploadPrescription() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = () => {
    showToast("📜 Prescription file received! AI Scanner inspecting dosage matrix...");
  };
  fileInput.click();
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
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const title = document.getElementById('auth-title');

  modal.style.display = 'flex';
  if (type === 'login') {
    title.innerText = "Security Portal • Sign In";
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  } else {
    title.innerText = "Register Clinical Profile";
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  }
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
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
  if (locInput) {
    statusBox.innerHTML = `📍 Target: <b>${locInput}</b> • ETA: <b>14 Mins</b> via Express Hub Drone`;
    showToast(`📍 Logistics recalculating route for: ${locInput}`);
  } else {
    alert("Please enter a valid delivery location or pincode.");
  }
}
// ==================== KOTHA LOGIC ADDONS ==================== //

// AI Prescription Scanner Logic
function uploadPrescription() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.onchange = () => {
    if (typeof showToast === "function") {
      showToast("📜 Prescription received! AI Scanner inspecting dosage matrix...");
    } else {
      alert("📜 Prescription received! AI Scanner inspecting dosage matrix...");
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
  if (typeof addToCart === "function") {
    addToCart("Amoxicillin Trio-Pack 500mg", 185);
    addToCart("Bio-Zinc Multi-Vitamin Complex", 340);
  }
  closePrescriptionModal();
  if (typeof showToast === "function") {
    showToast("✅ AI Extracted Medicines pushed to active Cart!");
  }
}
// Cart Drawer Open/Close & Dynamic Render Logic
function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  
  if (drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    overlay.style.display = 'none';
  } else {
    drawer.classList.add('open');
    overlay.style.display = 'block';
    renderDrawerItems();
  }
}

// Navigation lo Cart Button click event override
document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.querySelector('nav a[href*="cart"]');
  if (cartBtn) {
    cartBtn.setAttribute('href', 'javascript:void(0)');
    cartBtn.setAttribute('onclick', 'toggleCartDrawer()');
  }
});

function renderDrawerItems() {
  const container = document.getElementById('drawer-cart-items');
  const subtotalEl = document.getElementById('drawer-subtotal');
  const totalEl = document.getElementById('drawer-total');

  if (!cart || cart.length === 0) {
    container.innerHTML = `<div style="text-align:center; color: var(--text-muted); margin-top: 3rem;">🛒 Your cart is currently empty.</div>`;
    subtotalEl.innerText = "₹0.00";
    totalEl.innerText = "₹0.00";
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
  subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
  totalEl.innerText = `₹${total.toFixed(2)}`;
}

function removeFromDrawer(index) {
  cart.splice(index, 1);
  localStorage.setItem('aura_cart', JSON.stringify(cart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  renderDrawerItems();
}

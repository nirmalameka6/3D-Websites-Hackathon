/**
 * VisionVerse 3D Commerce - Main System & Shared Utilities
 * Manages Cart & Wishlist storage, Toast notifications, Navigation counters,
 * 3D Quick-View Modal, and Interactive Hero Backgrounds.
 */

// Storage Keys
const STORAGE_KEYS = {
  CART: "visionverse_cart_items",
  WISHLIST: "visionverse_wishlist_items",
  RECENT: "visionverse_recent_items",
  LAST_ORDER: "visionverse_last_order"
};

// ==========================================
// 1. Storage & State Management
// ==========================================

function getCartItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

function saveCartItems(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    updateNavCounters();
    window.dispatchEvent(new CustomEvent('visionverse-cart-updated', { detail: items }));
  } catch (e) {
    console.error("Error saving cart to localStorage", e);
  }
}

function getWishlistItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading wishlist from localStorage", e);
    return [];
  }
}

function saveWishlistItems(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    updateNavCounters();
    window.dispatchEvent(new CustomEvent('visionverse-wishlist-updated', { detail: items }));
  } catch (e) {
    console.error("Error saving wishlist to localStorage", e);
  }
}

function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addRecentlyViewed(productId) {
  if (!productId) return;
  let items = getRecentlyViewed();
  items = items.filter(id => id !== productId);
  items.unshift(productId);
  if (items.length > 8) items.pop();
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(items));
  } catch (e) {}
}

// ==========================================
// 2. Cart Operations
// ==========================================

function addToCart(product, customization = null, quantity = 1) {
  if (!product) return;
  const cart = getCartItems();

  const custom = customization || {
    color: product.colors ? product.colors[0].name : "Standard",
    colorHex: product.colors ? product.colors[0].hex : "#8a2be2",
    material: "Standard",
    materialId: "standard",
    materialPrice: 0,
    size: "Standard",
    sizeId: "medium",
    sizePrice: 0,
    unitPrice: product.price
  };

  const calculatedUnitPrice = product.price + (custom.materialPrice || 0) + (custom.sizePrice || 0);

  // Generate unique customization signature
  const customKey = `${product.id}-${custom.colorHex}-${custom.materialId}-${custom.sizeId}`;

  const existingIndex = cart.findIndex(item => item.customKey === customKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      modelType: product.modelType,
      customKey: customKey,
      customization: custom,
      unitPrice: calculatedUnitPrice,
      basePrice: product.price,
      quantity: quantity
    });
  }

  saveCartItems(cart);
  showToast(`Added <strong>${product.name}</strong> to your Cart!`, 'success');
}

function removeFromCart(customKey) {
  let cart = getCartItems();
  const item = cart.find(i => i.customKey === customKey);
  cart = cart.filter(i => i.customKey !== customKey);
  saveCartItems(cart);
  if (item) {
    showToast(`Removed <strong>${item.name}</strong> from Cart`, 'info');
  }
}

function updateCartQuantity(customKey, newQty) {
  let cart = getCartItems();
  const index = cart.findIndex(i => i.customKey === customKey);
  if (index > -1) {
    if (newQty <= 0) {
      removeFromCart(customKey);
    } else {
      cart[index].quantity = newQty;
      saveCartItems(cart);
    }
  }
}

// ==========================================
// 3. Wishlist Operations
// ==========================================

function toggleWishlist(productId) {
  const product = getProductById(productId);
  if (!product) return false;

  let wishlist = getWishlistItems();
  const exists = wishlist.includes(productId);

  if (exists) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlistItems(wishlist);
    showToast(`Removed <strong>${product.name}</strong> from Wishlist`, 'info');
    return false;
  } else {
    wishlist.push(productId);
    saveWishlistItems(wishlist);
    showToast(`Added <strong>${product.name}</strong> to Wishlist!`, 'success');
    return true;
  }
}

function isProductInWishlist(productId) {
  const wishlist = getWishlistItems();
  return wishlist.includes(productId);
}

// ==========================================
// 4. UI: Dynamic Counters & Navigation
// ==========================================

function updateNavCounters() {
  const cartItems = getCartItems();
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const wishlistItems = getWishlistItems();
  const totalWishlistCount = wishlistItems.length;

  document.querySelectorAll('.cart-count-badge').forEach(el => {
    el.textContent = totalCartCount;
    el.style.display = totalCartCount > 0 ? 'inline-flex' : 'none';
  });

  document.querySelectorAll('.nav-cart-text').forEach(el => {
    el.textContent = `Cart (${totalCartCount})`;
  });

  document.querySelectorAll('.wishlist-count-badge').forEach(el => {
    el.textContent = totalWishlistCount;
    el.style.display = totalWishlistCount > 0 ? 'inline-flex' : 'none';
  });

  document.querySelectorAll('.nav-wishlist-text').forEach(el => {
    el.textContent = `Wishlist (${totalWishlistCount})`;
  });
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-links');
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuBtn.classList.toggle('open');
    });
  }
}

// ==========================================
// 5. Global Toast Notification System
// ==========================================

function showToast(message, type = 'info') {
  let container = document.getElementById('vision-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'vision-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-pill toast-${type}`;
  
  let icon = '⚡';
  if (type === 'success') icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'info') icon = '✦';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-content">${message}</span>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3800);
}

// ==========================================
// 6. Quick 3D Preview Modal
// ==========================================

let quickViewerInstance = null;

function openQuick3DModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let modal = document.getElementById('quick-3d-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-3d-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card glass-panel">
        <div class="modal-header">
          <div>
            <span class="badge-tag" id="quick-modal-cat">Wearables</span>
            <h3 id="quick-modal-title">VisionWatch X1</h3>
          </div>
          <button class="modal-close-btn" id="close-quick-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-3d-canvas" id="quick-modal-canvas"></div>
          <div class="modal-info">
            <div class="modal-price" id="quick-modal-price">₹4,999</div>
            <p class="modal-desc" id="quick-modal-desc"></p>
            <div class="modal-actions">
              <a href="#" id="quick-modal-view-btn" class="btn btn-primary">Full 3D & Customizer →</a>
              <button id="quick-modal-cart-btn" class="btn btn-outline">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#close-quick-modal').addEventListener('click', closeQuick3DModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuick3DModal();
    });
  }

  // Populate data
  document.getElementById('quick-modal-cat').textContent = product.category;
  document.getElementById('quick-modal-title').textContent = product.name;
  document.getElementById('quick-modal-price').textContent = formatPriceINR(product.price);
  document.getElementById('quick-modal-desc').textContent = product.shortDesc;
  document.getElementById('quick-modal-view-btn').href = `product.html?id=${product.id}`;

  const cartBtn = document.getElementById('quick-modal-cart-btn');
  cartBtn.onclick = () => {
    addToCart(product);
  };

  modal.classList.add('active');

  // Initialize Three.js in modal
  setTimeout(() => {
    const canvasContainer = document.getElementById('quick-modal-canvas');
    if (quickViewerInstance) {
      quickViewerInstance.dispose();
    }
    quickViewerInstance = new VisionThreeViewer(canvasContainer, {
      autoRotate: true,
      autoRotateSpeed: 1.8,
      cameraZ: 4.2,
      enableHotspots: false
    });
    quickViewerInstance.loadProductModel(product);
  }, 100);
}

function closeQuick3DModal() {
  const modal = document.getElementById('quick-3d-modal');
  if (modal) {
    modal.classList.remove('active');
    if (quickViewerInstance) {
      quickViewerInstance.dispose();
      quickViewerInstance = null;
    }
  }
}

// ==========================================
// 7. Interactive Hero 3D Animated Background
// ==========================================

function initHeroBackground(canvasId = 'hero-3d-bg') {
  const container = document.getElementById(canvasId);
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // 1. Particle Cloud Matrix
  const particleCount = 700;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const col1 = new THREE.Color(0x00f0ff);
  const col2 = new THREE.Color(0x8a2be2);
  const tempCol = new THREE.Color();

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 15;

    tempCol.copy(col1).lerp(col2, Math.random());
    colors[i] = tempCol.r;
    colors[i + 1] = tempCol.g;
    colors[i + 2] = tempCol.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. Floating Cyber Geometric Rings
  const ring1Geo = new THREE.TorusGeometry(3.5, 0.04, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35, wireframe: true });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  scene.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.4, 0.03, 16, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45, wireframe: true });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  scene.add(ring2);

  // Floating Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.25 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // Mouse Parallax
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateHero() {
    requestAnimationFrame(animateHero);
    const time = performance.now() * 0.0008;

    particleSystem.rotation.y = time * 0.15;
    particleSystem.rotation.x = time * 0.08;

    ring1.rotation.x = time * 0.3;
    ring1.rotation.y = time * 0.2;

    ring2.rotation.y = -time * 0.4;
    ring2.rotation.z = time * 0.25;

    ico.rotation.x = time * 0.5;
    ico.rotation.y = time * 0.6;

    // Smooth camera mouse follow
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animateHero();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ==========================================
// 8. Wishlist Drawer Modal
// ==========================================

function openWishlistModal() {
  let modal = document.getElementById('wishlist-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wishlist-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card glass-panel wishlist-drawer">
        <div class="modal-header">
          <h3>Your Saved Wishlist</h3>
          <button class="modal-close-btn" id="close-wishlist-modal">&times;</button>
        </div>
        <div class="wishlist-body" id="wishlist-items-container">
          <!-- Dynamic Items -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#close-wishlist-modal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  renderWishlistModalItems();
  modal.classList.add('active');
}

function renderWishlistModalItems() {
  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  const wishlistIds = getWishlistItems();
  if (wishlistIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">♡</div>
        <p>Your wishlist is empty.</p>
        <a href="shop.html" class="btn btn-outline btn-sm">Explore Products</a>
      </div>
    `;
    return;
  }

  let html = `<div class="wishlist-list">`;
  wishlistIds.forEach(id => {
    const product = getProductById(id);
    if (!product) return;
    html += `
      <div class="wishlist-item-row glass-subcard">
        <div class="wishlist-thumb">
          ${generateProductSVG(product, 80, 80)}
        </div>
        <div class="wishlist-details">
          <h4>${product.name}</h4>
          <div class="wishlist-price">${formatPriceINR(product.price)}</div>
        </div>
        <div class="wishlist-actions">
          <button class="btn btn-primary btn-sm" onclick="addToCart(getProductById('${product.id}')); toggleWishlist('${product.id}'); renderWishlistModalItems();">Move to Cart</button>
          <button class="btn btn-icon btn-sm" onclick="toggleWishlist('${product.id}'); renderWishlistModalItems();" title="Remove">&times;</button>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// ==========================================
// 9. Dom Ready Initializer
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  updateNavCounters();
  setupMobileMenu();

  // Attach Wishlist modal triggers
  document.querySelectorAll('.wishlist-nav-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishlistModal();
    });
  });
});

// Export to window
if (typeof window !== 'undefined') {
  window.getCartItems = getCartItems;
  window.saveCartItems = saveCartItems;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateCartQuantity = updateCartQuantity;
  window.getWishlistItems = getWishlistItems;
  window.toggleWishlist = toggleWishlist;
  window.isProductInWishlist = isProductInWishlist;
  window.getRecentlyViewed = getRecentlyViewed;
  window.addRecentlyViewed = addRecentlyViewed;
  window.updateNavCounters = updateNavCounters;
  window.showToast = showToast;
  window.openQuick3DModal = openQuick3DModal;
  window.closeQuick3DModal = closeQuick3DModal;
  window.initHeroBackground = initHeroBackground;
  window.openWishlistModal = openWishlistModal;
}

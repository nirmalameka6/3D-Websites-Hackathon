/**
 * VisionVerse 3D Commerce - Product Detail & 3D Experience Controller
 * Orchestrates 3D model viewing, interactive hotspots, live customizer,
 * dynamic pricing calculation, studio lighting switch, explode mode, and AR mode.
 */

class VisionProductPage {
  constructor() {
    this.product = null;
    this.viewer = null;
    this.quantity = 1;

    // Active Customization State
    this.customization = {
      color: null,
      colorHex: "#8a2be2",
      material: "Standard",
      materialId: "standard",
      materialPrice: 0,
      size: "Standard",
      sizeId: "medium",
      sizePrice: 0,
      designStyle: "Cyber Glow",
      designPrice: 0
    };

    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || "visionwatch-x1";
    this.product = getProductById(productId) || PRODUCTS_DATABASE[0];

    // Save to recently viewed
    addRecentlyViewed(this.product.id);

    // Initialize UI fields
    this.renderProductDetails();
    this.init3DViewer();
    this.setupCustomizer();
    this.setupHotspotList();
    this.setupActionButtons();
    this.setupAdvanced3DControls();
    this.setupTabNavigation();
    this.renderRecommendations();
    this.renderRecentlyViewed();
    this.calculateDynamicPrice();
  }

  renderProductDetails() {
    const p = this.product;

    document.title = `${p.name} - VisionVerse 3D Commerce`;
    const breadcrumbCat = document.getElementById('p-breadcrumb-cat');
    if (breadcrumbCat) {
      breadcrumbCat.textContent = p.category;
      breadcrumbCat.href = `shop.html?category=${encodeURIComponent(p.category)}`;
    }
    const breadcrumbTitle = document.getElementById('p-breadcrumb-title');
    if (breadcrumbTitle) breadcrumbTitle.textContent = p.name;

    const badgeEl = document.getElementById('p-badge');
    if (badgeEl) {
      badgeEl.textContent = p.badge || p.category;
      badgeEl.style.display = p.badge ? 'inline-block' : 'none';
    }

    const titleEl = document.getElementById('p-title');
    if (titleEl) titleEl.textContent = p.name;

    const ratingEl = document.getElementById('p-rating');
    if (ratingEl) ratingEl.textContent = p.rating;

    const reviewsEl = document.getElementById('p-reviews');
    if (reviewsEl) reviewsEl.textContent = `(${p.reviews} verified reviews)`;

    const descEl = document.getElementById('p-description');
    if (descEl) descEl.textContent = p.description;

    const specsContainer = document.getElementById('p-specs-grid');
    if (specsContainer && p.specifications) {
      let specsHtml = "";
      for (const [key, val] of Object.entries(p.specifications)) {
        specsHtml += `
          <div class="spec-row">
            <span class="spec-key">${key}</span>
            <span class="spec-val">${val}</span>
          </div>
        `;
      }
      specsContainer.innerHTML = specsHtml;
    }

    const wishlistBtn = document.getElementById('p-wishlist-toggle');
    if (wishlistBtn) {
      const inWish = isProductInWishlist(p.id);
      wishlistBtn.classList.toggle('active', inWish);
      wishlistBtn.innerHTML = inWish ? '♥ Saved in Wishlist' : '♡ Add to Wishlist';
    }
  }

  init3DViewer() {
    const canvasContainer = document.getElementById('product-3d-viewport');
    if (!canvasContainer) return;

    this.viewer = new VisionThreeViewer(canvasContainer, {
      autoRotate: true,
      autoRotateSpeed: 1.2,
      cameraZ: 4.6,
      enableHotspots: true,
      enableParticles: true
    });

    this.viewer.loadProductModel(this.product);

    // Setup 3D Control Toolbar
    const autoRotateBtn = document.getElementById('btn-3d-autorotate');
    if (autoRotateBtn) {
      autoRotateBtn.addEventListener('click', () => {
        const isRotating = this.viewer.toggleAutoRotate();
        autoRotateBtn.classList.toggle('active', isRotating);
      });
    }

    const resetCamBtn = document.getElementById('btn-3d-reset');
    if (resetCamBtn) {
      resetCamBtn.addEventListener('click', () => {
        this.viewer.resetCamera();
        showToast("Camera View Reset", "info");
      });
    }

    const wireframeBtn = document.getElementById('btn-3d-wireframe');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        const isWire = this.viewer.toggleWireframe();
        wireframeBtn.classList.toggle('active', isWire);
        showToast(`Wireframe Mode: ${isWire ? 'ON' : 'OFF'}`, 'info');
      });
    }

    const explodeBtn = document.getElementById('btn-3d-explode');
    if (explodeBtn) {
      explodeBtn.addEventListener('click', () => {
        const exploded = this.viewer.toggleExplodeView();
        explodeBtn.classList.toggle('active', exploded);
        showToast(`3D Explode View: ${exploded ? 'DECONSTRUCTED' : 'ASSEMBLED'}`, 'info');
      });
    }

    const fullscreenBtn = document.getElementById('btn-3d-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          canvasContainer.requestFullscreen().catch(err => {
            console.error("Fullscreen error", err);
          });
        } else {
          document.exitFullscreen();
        }
      });
    }
  }

  setupAdvanced3DControls() {
    // Studio Lighting Environment Switcher
    const lightBtns = document.querySelectorAll('.light-env-chip');
    lightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lightBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const env = btn.dataset.env;
        if (this.viewer) {
          this.viewer.setLightEnvironment(env);
          showToast(`Studio Lighting: <strong>${btn.textContent}</strong>`, 'info');
        }
      });
    });

    // Camera Angle Presets
    const camBtns = document.querySelectorAll('.cam-preset-btn');
    camBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        camBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const angle = btn.dataset.angle;
        if (this.viewer) {
          this.viewer.setCameraPreset(angle);
        }
      });
    });
  }

  setupCustomizer() {
    const p = this.product;

    // 1. Color Swatches
    const colorContainer = document.getElementById('customizer-colors');
    if (colorContainer && p.colors) {
      colorContainer.innerHTML = "";
      this.customization.color = p.colors[0].name;
      this.customization.colorHex = p.colors[0].hex;

      p.colors.forEach((col, idx) => {
        const swatch = document.createElement('button');
        swatch.className = `color-swatch-btn ${idx === 0 ? 'active' : ''}`;
        swatch.style.backgroundColor = col.hex;
        swatch.title = col.name;
        swatch.setAttribute('aria-label', col.name);

        swatch.addEventListener('click', () => {
          colorContainer.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('active'));
          swatch.classList.add('active');
          this.customization.color = col.name;
          this.customization.colorHex = col.hex;

          const label = document.getElementById('selected-color-label');
          if (label) label.textContent = col.name;

          if (this.viewer) {
            this.viewer.updateCustomization(col.hex, this.customization.materialId, this.getCurrentScale());
          }
          this.calculateDynamicPrice();
        });

        colorContainer.appendChild(swatch);
      });

      const label = document.getElementById('selected-color-label');
      if (label) label.textContent = p.colors[0].name;
    }

    // 2. Material Options
    const matContainer = document.getElementById('customizer-materials');
    if (matContainer && p.materials) {
      matContainer.innerHTML = "";
      this.customization.material = p.materials[0].name;
      this.customization.materialId = p.materials[0].id;
      this.customization.materialPrice = p.materials[0].priceMod || 0;

      p.materials.forEach((mat, idx) => {
        const card = document.createElement('div');
        card.className = `material-option-card glass-subcard ${idx === 0 ? 'active' : ''}`;
        card.dataset.id = mat.id;
        card.innerHTML = `
          <div class="mat-info">
            <span class="mat-name">${mat.name}</span>
            <span class="mat-desc">${mat.desc}</span>
          </div>
          <span class="mat-price">${mat.priceMod > 0 ? `+${formatPriceINR(mat.priceMod)}` : 'Base'}</span>
        `;

        card.addEventListener('click', () => {
          matContainer.querySelectorAll('.material-option-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.customization.material = mat.name;
          this.customization.materialId = mat.id;
          this.customization.materialPrice = mat.priceMod || 0;

          if (this.viewer) {
            this.viewer.updateCustomization(this.customization.colorHex, mat.id, this.getCurrentScale());
          }
          this.calculateDynamicPrice();
        });

        matContainer.appendChild(card);
      });
    }

    // 3. Size Options
    const sizeContainer = document.getElementById('customizer-sizes');
    if (sizeContainer && p.sizes) {
      sizeContainer.innerHTML = "";
      this.customization.size = p.sizes[0].name;
      this.customization.sizeId = p.sizes[0].id;
      this.customization.sizePrice = p.sizes[0].priceMod || 0;

      p.sizes.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.className = `size-pill-btn ${idx === 0 ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="size-name">${s.name}</span>
          ${s.priceMod > 0 ? `<span class="size-mod">+${formatPriceINR(s.priceMod)}</span>` : ''}
        `;

        btn.addEventListener('click', () => {
          sizeContainer.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.customization.size = s.name;
          this.customization.sizeId = s.id;
          this.customization.sizePrice = s.priceMod || 0;

          if (this.viewer) {
            this.viewer.updateCustomization(this.customization.colorHex, this.customization.materialId, s.scale || 1.0);
          }
          this.calculateDynamicPrice();
        });

        sizeContainer.appendChild(btn);
      });
    }
  }

  getCurrentScale() {
    if (!this.product.sizes) return 1.0;
    const match = this.product.sizes.find(s => s.id === this.customization.sizeId);
    return match ? (match.scale || 1.0) : 1.0;
  }

  setupHotspotList() {
    const listContainer = document.getElementById('hotspots-guide-list');
    if (!listContainer || !this.product.hotspots) return;

    listContainer.innerHTML = "";
    this.product.hotspots.forEach((h, idx) => {
      const item = document.createElement('div');
      item.className = 'hotspot-list-item glass-subcard';
      item.innerHTML = `
        <div class="h-num">${idx + 1}</div>
        <div class="h-content">
          <h5>${h.title}</h5>
          <p>${h.description}</p>
        </div>
      `;

      item.addEventListener('click', () => {
        listContainer.querySelectorAll('.hotspot-list-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const marker = document.querySelector(`.hotspot-marker[data-id="${h.id}"]`);
        if (marker) {
          marker.classList.add('active');
          setTimeout(() => marker.classList.remove('active'), 3500);
        }
        showToast(`Inspecting: <strong>${h.title}</strong>`, 'info');
      });

      listContainer.appendChild(item);
    });

    window.addEventListener('visionverse-hotspot-click', (e) => {
      const spot = e.detail;
      const items = listContainer.querySelectorAll('.hotspot-list-item');
      this.product.hotspots.forEach((h, i) => {
        if (h.id === spot.id && items[i]) {
          items[i].classList.add('active');
          items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (items[i]) {
          items[i].classList.remove('active');
        }
      });
    });
  }

  calculateDynamicPrice() {
    const base = this.product.price;
    const matExtra = this.customization.materialPrice || 0;
    const sizeExtra = this.customization.sizePrice || 0;
    const totalUnitPrice = base + matExtra + sizeExtra;

    const currentPriceEl = document.getElementById('p-dynamic-price');
    if (currentPriceEl) currentPriceEl.textContent = formatPriceINR(totalUnitPrice);

    const oldPriceEl = document.getElementById('p-old-price');
    if (oldPriceEl) oldPriceEl.textContent = formatPriceINR(this.product.oldPrice + matExtra + sizeExtra);

    const baseBreakdown = document.getElementById('breakdown-base');
    if (baseBreakdown) baseBreakdown.textContent = formatPriceINR(base);

    const matBreakdown = document.getElementById('breakdown-material');
    if (matBreakdown) matBreakdown.textContent = matExtra > 0 ? `+${formatPriceINR(matExtra)}` : 'Included';

    const sizeBreakdown = document.getElementById('breakdown-size');
    if (sizeBreakdown) sizeBreakdown.textContent = sizeExtra > 0 ? `+${formatPriceINR(sizeExtra)}` : 'Included';

    const totalBreakdown = document.getElementById('breakdown-total');
    if (totalBreakdown) totalBreakdown.textContent = formatPriceINR(totalUnitPrice * this.quantity);

    this.customization.unitPrice = totalUnitPrice;
  }

  setupActionButtons() {
    const minusBtn = document.getElementById('qty-minus-btn');
    const plusBtn = document.getElementById('qty-plus-btn');
    const qtyDisplay = document.getElementById('qty-input-display');

    if (minusBtn && plusBtn && qtyDisplay) {
      minusBtn.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyDisplay.textContent = this.quantity;
          this.calculateDynamicPrice();
        }
      });

      plusBtn.addEventListener('click', () => {
        if (this.quantity < 10) {
          this.quantity++;
          qtyDisplay.textContent = this.quantity;
          this.calculateDynamicPrice();
        }
      });
    }

    const addCartBtn = document.getElementById('btn-add-custom-cart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        addToCart(this.product, this.customization, this.quantity);
      });
    }

    const buyNowBtn = document.getElementById('btn-buy-now');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        addToCart(this.product, this.customization, this.quantity);
        window.location.href = "checkout.html";
      });
    }

    const wishlistBtn = document.getElementById('p-wishlist-toggle');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        const added = toggleWishlist(this.product.id);
        wishlistBtn.classList.toggle('active', added);
        wishlistBtn.innerHTML = added ? '♥ Saved in Wishlist' : '♡ Add to Wishlist';
      });
    }

    const arBtn = document.getElementById('btn-view-ar');
    if (arBtn) {
      arBtn.addEventListener('click', () => {
        this.launchARMode();
      });
    }
  }

  launchARMode() {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
          showToast("Launching WebXR Immersive AR Session...", "info");
        } else {
          this.openARModalFallback();
        }
      }).catch(() => this.openARModalFallback());
    } else {
      this.openARModalFallback();
    }
  }

  openARModalFallback() {
    let modal = document.getElementById('ar-experience-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ar-experience-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-card glass-panel ar-modal-card">
          <div class="modal-header">
            <div>
              <span class="badge-tag">🥽 Augmented Reality</span>
              <h3>View ${this.product.name} in your Space</h3>
            </div>
            <button class="modal-close-btn" id="close-ar-modal">&times;</button>
          </div>
          <div class="ar-modal-body">
            <div class="ar-qr-box">
              <div class="ar-qr-frame">
                <svg viewBox="0 0 160 160" width="160" height="160">
                  <rect width="160" height="160" fill="#070a14" rx="8"/>
                  <rect x="20" y="20" width="40" height="40" fill="none" stroke="#00f0ff" stroke-width="6"/>
                  <rect x="30" y="30" width="20" height="20" fill="#00f0ff"/>
                  <rect x="100" y="20" width="40" height="40" fill="none" stroke="#00f0ff" stroke-width="6"/>
                  <rect x="110" y="30" width="20" height="20" fill="#00f0ff"/>
                  <rect x="20" y="100" width="40" height="40" fill="none" stroke="#00f0ff" stroke-width="6"/>
                  <rect x="30" y="110" width="20" height="20" fill="#00f0ff"/>
                  <circle cx="80" cy="40" r="5" fill="#a855f7"/>
                  <circle cx="80" cy="80" r="8" fill="#00f0ff"/>
                  <circle cx="40" cy="80" r="5" fill="#a855f7"/>
                  <circle cx="120" cy="80" r="6" fill="#a855f7"/>
                  <circle cx="100" cy="120" r="5" fill="#00f0ff"/>
                  <circle cx="130" cy="130" r="7" fill="#00f0ff"/>
                </svg>
              </div>
              <p class="ar-qr-label">Scan with your phone to view in AR</p>
            </div>
            <div class="ar-features-list">
              <div class="ar-feat-item">
                <span class="ar-feat-icon">📱</span>
                <div>
                  <strong>True-to-Scale Spatial Projection</strong>
                  <p>1:1 physical dimensions placed onto your desk or floor.</p>
                </div>
              </div>
              <div class="ar-feat-item">
                <span class="ar-feat-icon">💡</span>
                <div>
                  <strong>Live Environmental Light Estimation</strong>
                  <p>Matches the shadows and color temperature of your physical room.</p>
                </div>
              </div>
              <div class="ar-feat-item">
                <span class="ar-feat-icon">🎨</span>
                <div>
                  <strong>Real-Time Customization Retained</strong>
                  <p>Your selected color (${this.customization.color}) & material are synchronized.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="close-ar-modal-btn">Close AR Preview</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#close-ar-modal').addEventListener('click', () => modal.classList.remove('active'));
      modal.querySelector('#close-ar-modal-btn').addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    modal.classList.add('active');
  }

  setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.product-tab-btn');
    const tabPanels = document.querySelectorAll('.product-tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`tab-panel-${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  }

  renderRecommendations() {
    const container = document.getElementById('related-products-grid');
    if (!container) return;

    let related = PRODUCTS_DATABASE.filter(p => p.category === this.product.category && p.id !== this.product.id);
    if (related.length < 3) {
      related = [...related, ...PRODUCTS_DATABASE.filter(p => p.id !== this.product.id && !related.includes(p))];
    }

    let html = "";
    related.slice(0, 3).forEach(p => {
      html += `
        <div class="product-card glass-panel">
          <div class="card-badges">
            <span class="badge-discount">${p.discount}</span>
          </div>
          <div class="product-image-wrap" onclick="window.location.href='product.html?id=${p.id}'">
            <div class="product-svg-box">${generateProductSVG(p, 240, 200)}</div>
          </div>
          <div class="product-content">
            <div class="product-meta">
              <span class="product-cat">${p.category}</span>
              <span class="rating-num">★ ${p.rating}</span>
            </div>
            <h4 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h4>
            <div class="product-price-row">
              <span class="price-current">${formatPriceINR(p.price)}</span>
            </div>
            <div class="product-card-actions">
              <a href="product.html?id=${p.id}" class="btn btn-primary btn-sm flex-1">View in 3D →</a>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  renderRecentlyViewed() {
    const container = document.getElementById('recently-viewed-grid');
    if (!container) return;

    const recentIds = getRecentlyViewed().filter(id => id !== this.product.id);
    if (recentIds.length === 0) {
      const wrapper = document.getElementById('recently-viewed-section');
      if (wrapper) wrapper.style.display = 'none';
      return;
    }

    let html = "";
    recentIds.slice(0, 5).forEach(id => {
      const p = getProductById(id);
      if (!p) return;
      html += `
        <div class="recent-item-pill glass-subcard" onclick="window.location.href='product.html?id=${p.id}'">
          <div class="recent-thumb">${generateProductSVG(p, 60, 60)}</div>
          <div class="recent-info">
            <h5>${p.name}</h5>
            <span>${formatPriceINR(p.price)}</span>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-3d-viewport')) {
    window.visionProductPage = new VisionProductPage();
  }
});

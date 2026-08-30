/**
 * VisionVerse 3D Commerce - Shop & Product Catalog Controller
 * Live search, multi-filter (from ₹10 to ₹10L), sorting, dynamic grid rendering, and 3D card interactions.
 */

class VisionShop {
  constructor() {
    this.products = [...PRODUCTS_DATABASE];
    this.filteredProducts = [...PRODUCTS_DATABASE];
    this.currentCategory = "All";
    this.searchQuery = "";
    this.maxPrice = 1000000;
    this.minRating = 0;
    this.sortBy = "popular";
    this.viewMode = "grid";

    this.init();
  }

  init() {
    this.parseURLParams();
    this.setupCategoryFilters();
    this.setupSearchInput();
    this.setupPriceSlider();
    this.setupRatingFilters();
    this.setupSorting();
    this.setupViewToggle();
    this.applyFiltersAndSort();
  }

  parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category');
    const search = urlParams.get('search');
    const sort = urlParams.get('sort');

    if (cat && PRODUCT_CATEGORIES.map(c => c.toLowerCase()).includes(cat.toLowerCase())) {
      const match = PRODUCT_CATEGORIES.find(c => c.toLowerCase() === cat.toLowerCase());
      if (match) this.currentCategory = match;
    }

    if (search) {
      this.searchQuery = search.trim();
      const searchInput = document.getElementById('shop-search-input');
      if (searchInput) searchInput.value = search;
    }

    if (sort) {
      this.sortBy = sort;
      const sortSelect = document.getElementById('shop-sort-select');
      if (sortSelect) sortSelect.value = sort;
    }
  }

  setupCategoryFilters() {
    const container = document.getElementById('category-filter-container');
    if (!container) return;

    container.innerHTML = "";
    PRODUCT_CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-pill ${cat.toLowerCase() === this.currentCategory.toLowerCase() ? 'active' : ''}`;
      btn.textContent = cat;
      btn.dataset.category = cat;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = cat;
        this.applyFiltersAndSort();
      });
      container.appendChild(btn);
    });
  }

  setupSearchInput() {
    const input = document.getElementById('shop-search-input');
    const clearBtn = document.getElementById('shop-search-clear');
    if (!input) return;

    input.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim();
      if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.applyFiltersAndSort();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = "";
        this.searchQuery = "";
        clearBtn.style.display = 'none';
        this.applyFiltersAndSort();
        input.focus();
      });
    }
  }

  setupPriceSlider() {
    const slider = document.getElementById('price-range-slider');
    const display = document.getElementById('price-range-display');
    if (!slider) return;

    slider.addEventListener('input', (e) => {
      this.maxPrice = Number(e.target.value);
      if (display) {
        display.textContent = `Up to ${formatPriceINR(this.maxPrice)}`;
      }
      this.applyFiltersAndSort();
    });
  }

  setupRatingFilters() {
    const ratingRadios = document.querySelectorAll('input[name="rating-filter"]');
    ratingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.minRating = Number(e.target.value);
        this.applyFiltersAndSort();
      });
    });
  }

  setupSorting() {
    const sortSelect = document.getElementById('shop-sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFiltersAndSort();
    });
  }

  setupViewToggle() {
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    const productsContainer = document.getElementById('products-grid-container');

    if (gridBtn && listBtn && productsContainer) {
      gridBtn.addEventListener('click', () => {
        this.viewMode = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        productsContainer.className = 'products-grid';
      });

      listBtn.addEventListener('click', () => {
        this.viewMode = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        productsContainer.className = 'products-list';
      });
    }
  }

  applyFiltersAndSort() {
    let result = [...this.products];

    // 1. Category Filter
    if (this.currentCategory !== "All") {
      result = result.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    // 2. Search Query Filter
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    result = result.filter(p => p.price <= this.maxPrice);

    // 4. Rating Filter
    if (this.minRating > 0) {
      result = result.filter(p => p.rating >= this.minRating);
    }

    // 5. Sorting
    switch (this.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    this.filteredProducts = result;
    this.renderProducts();
    this.updateProductCountBadge(result.length);
  }

  renderProducts() {
    const container = document.getElementById('products-grid-container');
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="no-products-box glass-panel">
          <div class="no-prod-icon">🔍</div>
          <h3>No matching products found</h3>
          <p>Try adjusting your search keywords, price slider, or category selection.</p>
          <button class="btn btn-primary" id="reset-all-filters-btn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-all-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetFilters());
      }
      return;
    }

    let html = "";
    this.filteredProducts.forEach((product, idx) => {
      const inWishlist = isProductInWishlist(product.id);
      const delay = (idx % 12) * 0.04;

      html += `
        <div class="product-card glass-panel" style="animation-delay: ${delay}s" data-product-id="${product.id}">
          <div class="card-badges">
            ${product.badge ? `<span class="badge-featured">${product.badge}</span>` : ''}
            <span class="badge-discount">${product.discount}</span>
          </div>

          <button class="wishlist-btn ${inWishlist ? 'active' : ''}" 
                  data-id="${product.id}" 
                  title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                  onclick="handleCardWishlistClick(event, '${product.id}')">
            ${inWishlist ? '♥' : '♡'}
          </button>

          <!-- 3D Preview Image Wrap -->
          <div class="product-image-wrap" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="product-svg-box">
              ${generateProductSVG(product, 280, 240)}
            </div>
            <div class="quick-3d-hover-tag">
              <span>⬡ 3D Spatial View</span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="product-content">
            <div class="product-meta">
              <span class="product-cat">${product.category}</span>
              <div class="product-rating">
                <span class="star-icon">★</span>
                <span class="rating-num">${product.rating}</span>
                <span class="review-count">(${product.reviews})</span>
              </div>
            </div>

            <h3 class="product-title">
              <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>

            <p class="product-short-desc">${product.shortDesc}</p>

            <div class="product-price-row">
              <div class="price-box">
                <span class="price-current">${formatPriceINR(product.price)}</span>
                <span class="price-old">${formatPriceINR(product.oldPrice)}</span>
              </div>
            </div>

            <div class="product-card-actions">
              <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm flex-1">
                <span>View in 3D</span>
                <span class="btn-icon">→</span>
              </a>
              <button class="btn btn-outline btn-sm btn-icon-only" 
                      title="Quick Add to Cart" 
                      onclick="handleQuickAddToCart(event, '${product.id}')">
                🛒
              </button>
              <button class="btn btn-glass btn-sm btn-icon-only" 
                      title="Quick 3D Inspection Modal" 
                      onclick="handleQuick3DClick(event, '${product.id}')">
                👁
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  updateProductCountBadge(count) {
    const badge = document.getElementById('product-count-display');
    if (badge) {
      badge.textContent = `Showing ${count} product${count === 1 ? '' : 's'}`;
    }
  }

  resetFilters() {
    this.currentCategory = "All";
    this.searchQuery = "";
    this.maxPrice = 1000000;
    this.minRating = 0;
    this.sortBy = "popular";

    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) searchInput.value = "";

    const priceSlider = document.getElementById('price-range-slider');
    if (priceSlider) priceSlider.value = 1000000;

    const priceDisplay = document.getElementById('price-range-display');
    if (priceDisplay) priceDisplay.textContent = "Up to ₹10,00,000";

    const sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) sortSelect.value = "popular";

    const ratingRadios = document.querySelectorAll('input[name="rating-filter"]');
    if (ratingRadios.length > 0) ratingRadios[0].checked = true;

    this.setupCategoryFilters();
    this.applyFiltersAndSort();
  }
}

// Global Event Handlers
function handleCardWishlistClick(e, productId) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const isAdded = toggleWishlist(productId);
  if (isAdded) {
    btn.classList.add('active');
    btn.innerHTML = '♥';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '♡';
  }
}

function handleQuickAddToCart(e, productId) {
  e.stopPropagation();
  const product = getProductById(productId);
  if (product) {
    addToCart(product);
  }
}

function handleQuick3DClick(e, productId) {
  e.stopPropagation();
  openQuick3DModal(productId);
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid-container')) {
    window.visionShop = new VisionShop();
  }
});

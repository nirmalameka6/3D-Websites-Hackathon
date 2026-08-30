/**
 * VisionVerse 3D Commerce - Cart Controller
 * Manages cart item rendering, customization badges, quantity modifiers,
 * discount coupon redemption, tax & shipping calculations, and checkout transitions.
 */

class VisionCart {
  constructor() {
    this.cartItems = [];
    this.couponCode = "";
    this.discountAmount = 0;
    this.shippingThreshold = 5000;
    this.shippingFee = 199;

    this.init();
  }

  init() {
    this.loadCart();
    this.setupCouponForm();
    this.setupClearCartBtn();
    
    // Listen for storage events
    window.addEventListener('visionverse-cart-updated', () => {
      this.loadCart();
    });
  }

  loadCart() {
    this.cartItems = getCartItems();
    this.renderCartTable();
    this.calculateTotals();
  }

  renderCartTable() {
    const tableContainer = document.getElementById('cart-items-tbody');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContentWrapper = document.getElementById('cart-content-wrapper');

    if (!tableContainer) return;

    if (this.cartItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (cartContentWrapper) cartContentWrapper.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartContentWrapper) cartContentWrapper.style.display = 'grid';

    let html = "";
    this.cartItems.forEach((item, index) => {
      const product = getProductById(item.id);
      const lineSubtotal = item.unitPrice * item.quantity;
      const custom = item.customization || {};

      html += `
        <tr class="cart-item-row" data-key="${item.customKey}">
          <!-- Product Info -->
          <td class="cart-col-product">
            <div class="cart-item-media">
              <div class="cart-item-thumb">
                ${product ? generateProductSVG(product, 80, 80) : ''}
              </div>
              <div class="cart-item-details">
                <span class="cart-item-cat">${item.category || ''}</span>
                <h4 class="cart-item-title">
                  <a href="product.html?id=${item.id}">${item.name}</a>
                </h4>
                
                <!-- Customization Spec Badges -->
                <div class="cart-custom-specs">
                  ${custom.color ? `
                    <span class="custom-tag">
                      <span class="tag-color-dot" style="background-color: ${custom.colorHex || '#fff'};"></span>
                      ${custom.color}
                    </span>` : ''}
                  ${custom.material ? `<span class="custom-tag">⬡ ${custom.material}</span>` : ''}
                  ${custom.size ? `<span class="custom-tag">📐 ${custom.size}</span>` : ''}
                </div>

                <div class="cart-item-mobile-actions">
                  <button class="btn-link-action" onclick="handleMoveToWishlist('${item.id}', '${item.customKey}')">Save to Wishlist</button>
                  <span class="action-divider">|</span>
                  <button class="btn-link-action text-danger" onclick="handleRemoveCartItem('${item.customKey}')">Remove</button>
                </div>
              </div>
            </div>
          </td>

          <!-- Unit Price -->
          <td class="cart-col-price">
            <span class="price-val">${formatPriceINR(item.unitPrice)}</span>
            ${item.unitPrice > item.basePrice ? `
              <span class="price-custom-note">(incl. custom extras)</span>
            ` : ''}
          </td>

          <!-- Quantity Stepper -->
          <td class="cart-col-qty">
            <div class="qty-stepper-box">
              <button class="qty-step-btn" onclick="handleChangeQuantity('${item.customKey}', ${item.quantity - 1})" aria-label="Decrease">&minus;</button>
              <span class="qty-step-val">${item.quantity}</span>
              <button class="qty-step-btn" onclick="handleChangeQuantity('${item.customKey}', ${item.quantity + 1})" aria-label="Increase">&plus;</button>
            </div>
          </td>

          <!-- Line Subtotal -->
          <td class="cart-col-total">
            <span class="total-val">${formatPriceINR(lineSubtotal)}</span>
          </td>

          <!-- Desktop Actions -->
          <td class="cart-col-actions">
            <button class="btn-icon-del" onclick="handleRemoveCartItem('${item.customKey}')" title="Remove item">&times;</button>
          </td>
        </tr>
      `;
    });

    tableContainer.innerHTML = html;
  }

  calculateTotals() {
    const rawSubtotal = this.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    // Apply Coupon logic
    let discount = 0;
    if (this.couponCode === "VISION20") {
      discount = Math.round(rawSubtotal * 0.20);
    } else if (this.couponCode === "HACKATHON") {
      discount = Math.min(rawSubtotal, 1000);
    } else if (this.couponCode === "CYBER500") {
      discount = Math.min(rawSubtotal, 500);
    }

    this.discountAmount = discount;
    const discountedSubtotal = Math.max(0, rawSubtotal - discount);

    // Shipping logic (Free above ₹5,000)
    let shipping = 0;
    if (rawSubtotal > 0) {
      shipping = rawSubtotal >= this.shippingThreshold ? 0 : this.shippingFee;
    }

    // Tax is included or 18% GST summary
    const taxEstimated = Math.round(discountedSubtotal * 0.18);
    const finalTotal = discountedSubtotal + shipping;

    // Update UI Summary Box
    const subtotalEl = document.getElementById('summary-subtotal');
    if (subtotalEl) subtotalEl.textContent = formatPriceINR(rawSubtotal);

    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    if (discountRow && discountEl) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-${formatPriceINR(discount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    const shippingEl = document.getElementById('summary-shipping');
    if (shippingEl) {
      shippingEl.textContent = shipping === 0 ? "FREE" : formatPriceINR(shipping);
      shippingEl.className = shipping === 0 ? "text-success font-semibold" : "font-semibold";
    }

    const taxEl = document.getElementById('summary-tax');
    if (taxEl) taxEl.textContent = `${formatPriceINR(taxEstimated)} (Included)`;

    const totalEl = document.getElementById('summary-total');
    if (totalEl) totalEl.textContent = formatPriceINR(finalTotal);

    const freeShippingPrompt = document.getElementById('free-shipping-progress');
    if (freeShippingPrompt) {
      if (rawSubtotal >= this.shippingThreshold) {
        freeShippingPrompt.innerHTML = `<span class="text-success">🎉 You've unlocked FREE Express Shipping!</span>`;
      } else {
        const needed = this.shippingThreshold - rawSubtotal;
        freeShippingPrompt.innerHTML = `Add <strong>${formatPriceINR(needed)}</strong> more for <strong>FREE Shipping</strong>!`;
      }
    }
  }

  setupCouponForm() {
    const form = document.getElementById('coupon-form');
    const input = document.getElementById('coupon-input');
    const msgEl = document.getElementById('coupon-message');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = input.value.trim().toUpperCase();

        if (code === "VISION20") {
          this.couponCode = code;
          if (msgEl) {
            msgEl.className = "coupon-msg success";
            msgEl.textContent = "✓ Coupon VISION20 applied! 20% discount added.";
          }
          showToast("Promo Code <strong>VISION20</strong> applied! 20% OFF", "success");
        } else if (code === "HACKATHON") {
          this.couponCode = code;
          if (msgEl) {
            msgEl.className = "coupon-msg success";
            msgEl.textContent = "✓ Coupon HACKATHON applied! ₹1,000 instant discount.";
          }
          showToast("Promo Code <strong>HACKATHON</strong> applied! ₹1,000 OFF", "success");
        } else {
          if (msgEl) {
            msgEl.className = "coupon-msg error";
            msgEl.textContent = "✕ Invalid promo code. Try 'VISION20' or 'HACKATHON'.";
          }
          showToast("Invalid promo code. Try 'VISION20'", "error");
        }

        this.calculateTotals();
      });
    }
  }

  setupClearCartBtn() {
    const clearBtn = document.getElementById('btn-clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all items from your cart?")) {
          saveCartItems([]);
          showToast("Cart has been cleared", "info");
        }
      });
    }
  }
}

// Global actions called from HTML table onclick
function handleChangeQuantity(customKey, newQty) {
  updateCartQuantity(customKey, newQty);
}

function handleRemoveCartItem(customKey) {
  removeFromCart(customKey);
}

function handleMoveToWishlist(productId, customKey) {
  toggleWishlist(productId);
  removeFromCart(customKey);
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items-tbody')) {
    window.visionCart = new VisionCart();
  }
});

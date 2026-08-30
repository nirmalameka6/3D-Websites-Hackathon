/**
 * VisionVerse 3D Commerce - Checkout & Order Processing Controller
 * Manages checkout steps, address validation, demo payment selection,
 * order placement, receipt generation, and confirmation modal.
 */

class VisionCheckout {
  constructor() {
    this.cartItems = [];
    this.selectedPayment = "upi";
    this.orderPlaced = null;

    this.init();
  }

  init() {
    this.cartItems = getCartItems();
    this.checkCartNotEmpty();
    this.renderOrderSummary();
    this.setupPaymentTabs();
    this.setupCardInputs();
    this.setupCheckoutForm();
  }

  checkCartNotEmpty() {
    if (this.cartItems.length === 0) {
      const checkoutForm = document.getElementById('checkout-main-grid');
      if (checkoutForm) {
        checkoutForm.innerHTML = `
          <div class="empty-checkout-notice glass-panel">
            <div class="empty-icon">🛒</div>
            <h3>Your Cart is Currently Empty</h3>
            <p>Please add products to your cart before proceeding to checkout.</p>
            <a href="shop.html" class="btn btn-primary">Browse 3D Catalog →</a>
          </div>
        `;
      }
    }
  }

  renderOrderSummary() {
    const listContainer = document.getElementById('checkout-items-list');
    if (!listContainer) return;

    if (this.cartItems.length === 0) {
      listContainer.innerHTML = `<p class="text-muted">No items in cart.</p>`;
      return;
    }

    let subtotal = 0;
    let html = "";

    this.cartItems.forEach(item => {
      const product = getProductById(item.id);
      const linePrice = item.unitPrice * item.quantity;
      subtotal += linePrice;
      const custom = item.customization || {};

      html += `
        <div class="checkout-item-row">
          <div class="checkout-item-thumb">
            ${product ? generateProductSVG(product, 50, 50) : ''}
            <span class="checkout-qty-badge">${item.quantity}</span>
          </div>
          <div class="checkout-item-info">
            <h5>${item.name}</h5>
            <div class="checkout-custom-note">
              ${custom.color ? `<span class="c-dot" style="background:${custom.colorHex}"></span>${custom.color}` : ''}
              ${custom.material ? ` · ${custom.material}` : ''}
              ${custom.size ? ` · ${custom.size}` : ''}
            </div>
          </div>
          <div class="checkout-item-price">
            ${formatPriceINR(linePrice)}
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Shipping & Total
    const shipping = subtotal >= 5000 ? 0 : 199;
    const finalTotal = subtotal + shipping;

    const subEl = document.getElementById('checkout-subtotal');
    if (subEl) subEl.textContent = formatPriceINR(subtotal);

    const shipEl = document.getElementById('checkout-shipping');
    if (shipEl) shipEl.textContent = shipping === 0 ? "FREE" : formatPriceINR(shipping);

    const totalEl = document.getElementById('checkout-total');
    if (totalEl) totalEl.textContent = formatPriceINR(finalTotal);

    const payBtnTotal = document.getElementById('btn-place-order-amount');
    if (payBtnTotal) payBtnTotal.textContent = formatPriceINR(finalTotal);
  }

  setupPaymentTabs() {
    const methods = document.querySelectorAll('.payment-method-card');
    const sections = {
      upi: document.getElementById('payment-section-upi'),
      card: document.getElementById('payment-section-card'),
      cod: document.getElementById('payment-section-cod')
    };

    methods.forEach(card => {
      card.addEventListener('click', () => {
        methods.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.selectedPayment = card.dataset.payment;

        // Hide all payment sections and show target
        for (const [key, el] of Object.entries(sections)) {
          if (el) el.style.display = key === this.selectedPayment ? 'block' : 'none';
        }
      });
    });
  }

  setupCardInputs() {
    const cardNumInput = document.getElementById('card-number-input');
    const cardPreviewNum = document.getElementById('card-preview-number');
    const cardHolderInput = document.getElementById('card-name-input');
    const cardPreviewHolder = document.getElementById('card-preview-name');
    const cardExpInput = document.getElementById('card-exp-input');
    const cardPreviewExp = document.getElementById('card-preview-exp');

    if (cardNumInput && cardPreviewNum) {
      cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = val;
        cardPreviewNum.textContent = val || "•••• •••• •••• ••••";
      });
    }

    if (cardHolderInput && cardPreviewHolder) {
      cardHolderInput.addEventListener('input', (e) => {
        cardPreviewHolder.textContent = e.target.value.toUpperCase() || "YOUR NAME";
      });
    }

    if (cardExpInput && cardPreviewExp) {
      cardExpInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
        cardPreviewExp.textContent = val || "MM/YY";
      });
    }
  }

  setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processOrderPlacement();
    });
  }

  processOrderPlacement() {
    // Collect Customer details
    const fullName = document.getElementById('cust-name')?.value || "Vision Customer";
    const email = document.getElementById('cust-email')?.value || "customer@visionverse.io";
    const phone = document.getElementById('cust-phone')?.value || "+91 98765 43210";
    const address = document.getElementById('cust-address')?.value || "742 Cyberpunk Ave, Neo Bangalore";
    const city = document.getElementById('cust-city')?.value || "Bangalore";
    const pincode = document.getElementById('cust-pin')?.value || "560001";

    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 199;
    const finalTotal = subtotal + shipping;

    // Generate Order ID & Estimated Delivery
    const orderId = `VV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const deliveryStr = deliveryDate.toLocaleDateString("en-IN", {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const orderData = {
      orderId: orderId,
      date: new Date().toISOString(),
      customer: { fullName, email, phone, address, city, pincode },
      items: [...this.cartItems],
      paymentMethod: this.selectedPayment.toUpperCase(),
      subtotal: subtotal,
      shipping: shipping,
      total: finalTotal,
      estimatedDelivery: deliveryStr
    };

    // Save order & clear cart
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(orderData));
      saveCartItems([]);
    } catch (e) {}

    this.orderPlaced = orderData;
    this.showOrderConfirmationModal(orderData);
  }

  showOrderConfirmationModal(order) {
    let modal = document.getElementById('order-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'order-success-modal';
      modal.className = 'modal-backdrop active';
      modal.innerHTML = `
        <div class="modal-card glass-panel order-confirm-card">
          <div class="confirm-header">
            <div class="success-icon-anim">🎉</div>
            <h2>ORDER CONFIRMED!</h2>
            <p class="order-id-tag">Order ID: <strong>${order.orderId}</strong></p>
          </div>

          <div class="confirm-body">
            <div class="delivery-estimate-box glass-subcard">
              <span class="del-icon">🚚</span>
              <div>
                <strong>Estimated Express Delivery</strong>
                <p>${order.estimatedDelivery}</p>
              </div>
            </div>

            <!-- Receipt Summary -->
            <div class="order-receipt-box">
              <h4>Order Breakdown</h4>
              <div class="receipt-items-list" id="confirm-receipt-items"></div>
              
              <div class="receipt-totals">
                <div class="receipt-row">
                  <span>Subtotal:</span>
                  <span>${formatPriceINR(order.subtotal)}</span>
                </div>
                <div class="receipt-row">
                  <span>Express Shipping:</span>
                  <span>${order.shipping === 0 ? 'FREE' : formatPriceINR(order.shipping)}</span>
                </div>
                <div class="receipt-row total-row">
                  <span>Total Paid (${order.paymentMethod}):</span>
                  <span>${formatPriceINR(order.total)}</span>
                </div>
              </div>
            </div>

            <div class="shipping-info-preview">
              <p>📍 <strong>Delivering to:</strong> ${order.customer.fullName}, ${order.customer.address}, ${order.customer.city} (${order.customer.pincode})</p>
              <p>📧 Confirmation receipt sent to <strong>${order.customer.email}</strong></p>
            </div>
          </div>

          <div class="confirm-footer">
            <button class="btn btn-outline" onclick="window.print()">Print Receipt</button>
            <a href="shop.html" class="btn btn-primary">Continue Shopping →</a>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Populate items
    const itemsContainer = modal.querySelector('#confirm-receipt-items');
    if (itemsContainer) {
      let itemsHtml = "";
      order.items.forEach(it => {
        itemsHtml += `
          <div class="receipt-item-line">
            <span>${it.quantity}x ${it.name} <small class="text-muted">(${it.customization?.color || ''} ${it.customization?.material || ''})</small></span>
            <span>${formatPriceINR(it.unitPrice * it.quantity)}</span>
          </div>
        `;
      });
      itemsContainer.innerHTML = itemsHtml;
    }

    modal.classList.add('active');
    showToast("🎉 Order placed successfully!", "success");
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkout-form')) {
    window.visionCheckout = new VisionCheckout();
  }
});

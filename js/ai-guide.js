/**
 * Vision AI - Smart Interactive 3D Shopping Guide
 * Floating interactive assistant that answers queries, filters products,
 * executes website actions (like opening 3D models and navigating), and compares products.
 */

class VisionAIGuide {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.init();
  }

  init() {
    this.renderWidget();
    this.attachEvents();
    
    // Initial welcome message
    setTimeout(() => {
      this.addMessage(
        "bot",
        "Hello! I am **Vision AI**, your spatial shopping guide. ✦<br>I can find products from **₹19 micro-accessories** to **hyper-cars**, open 3D interactive models, switch lighting, and customize hardware live. What are you looking for today?",
        [
          "Show products under ₹100",
          "Show products from ₹10 to ₹500",
          "Show smart watches",
          "Show me the smart vehicle",
          "Show gaming controller",
          "Compare X1 vs Pro"
        ]
      );
    }, 600);
  }

  renderWidget() {
    const wrapper = document.createElement('div');
    wrapper.id = 'vision-ai-widget';
    wrapper.className = 'ai-guide-widget';
    wrapper.innerHTML = `
      <!-- Floating AI Orb Button -->
      <button class="ai-launcher-btn" id="ai-toggle-btn" aria-label="Open AI Shopping Guide" title="Vision AI Assistant">
        <div class="ai-orb-glow"></div>
        <div class="ai-orb-core">
          <span class="ai-icon">🤖</span>
        </div>
        <span class="ai-launcher-label">Vision AI</span>
        <span class="ai-online-dot"></span>
      </button>

      <!-- AI Chat Panel Window -->
      <div class="ai-chat-window glass-panel" id="ai-chat-window">
        <div class="ai-chat-header">
          <div class="ai-header-info">
            <div class="ai-avatar">✦</div>
            <div>
              <h4>Vision AI Guide</h4>
              <span class="ai-status">Spatial Intelligence Active</span>
            </div>
          </div>
          <div class="ai-header-controls">
            <button class="ai-minimize-btn" id="ai-minimize-btn" title="Close">&times;</button>
          </div>
        </div>

        <!-- Chat Messages Flow -->
        <div class="ai-chat-messages" id="ai-messages-flow"></div>

        <!-- Quick Suggestion Chips -->
        <div class="ai-suggestions-bar" id="ai-suggestions-bar"></div>

        <!-- Input Area -->
        <form class="ai-chat-input-box" id="ai-chat-form">
          <input type="text" id="ai-user-input" placeholder="Ask anything... e.g. 'Show items under ₹100'..." autocomplete="off" />
          <button type="submit" class="ai-send-btn" aria-label="Send Message">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  attachEvents() {
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const minimizeBtn = document.getElementById('ai-minimize-btn');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-user-input');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleChat());
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.toggleChat(false));
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          this.handleUserInput(text);
          input.value = "";
        }
      });
    }

    window.addEventListener('visionverse-open-ai', (e) => {
      const query = e.detail && e.detail.query ? e.detail.query : null;
      this.toggleChat(true);
      if (query) {
        setTimeout(() => this.handleUserInput(query), 300);
      }
    });
  }

  toggleChat(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    const windowEl = document.getElementById('ai-chat-window');
    const toggleBtn = document.getElementById('ai-toggle-btn');

    if (this.isOpen) {
      windowEl.classList.add('active');
      toggleBtn.classList.add('chat-open');
      const input = document.getElementById('ai-user-input');
      if (input) setTimeout(() => input.focus(), 200);
      this.scrollToBottom();
    } else {
      windowEl.classList.remove('active');
      toggleBtn.classList.remove('chat-open');
    }
  }

  handleUserInput(text) {
    this.addMessage("user", text);
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.processNLPQuery(text);
      this.addMessage("bot", response.text, response.suggestions, response.products, response.action);
    }, 450);
  }

  addMessage(sender, text, suggestions = [], products = [], action = null) {
    const flow = document.getElementById('ai-messages-flow');
    if (!flow) return;

    const msgEl = document.createElement('div');
    msgEl.className = `ai-message-row ai-msg-${sender}`;

    let html = `
      <div class="ai-msg-bubble">
        <div class="ai-msg-text">${text}</div>
    `;

    if (products && products.length > 0) {
      html += `<div class="ai-products-preview-grid">`;
      products.forEach(p => {
        html += `
          <div class="ai-product-mini-card">
            <div class="ai-p-info">
              <span class="ai-p-badge">${p.category}</span>
              <h5>${p.name}</h5>
              <div class="ai-p-price">${formatPriceINR(p.price)} <small class="text-muted" style="text-decoration:line-through;">${formatPriceINR(p.oldPrice)}</small></div>
            </div>
            <div class="ai-p-actions">
              <a href="product.html?id=${p.id}" class="btn btn-primary btn-xs">View 3D ↗</a>
              <button class="btn btn-outline btn-xs" onclick="addToCart(getProductById('${p.id}'))">+ Cart</button>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
    msgEl.innerHTML = html;
    flow.appendChild(msgEl);

    this.renderSuggestions(suggestions);

    if (action) {
      this.executeAction(action);
    }

    this.scrollToBottom();
  }

  renderSuggestions(suggestions) {
    const bar = document.getElementById('ai-suggestions-bar');
    if (!bar) return;

    if (!suggestions || suggestions.length === 0) {
      bar.innerHTML = "";
      bar.style.display = "none";
      return;
    }

    bar.style.display = "flex";
    bar.innerHTML = "";
    suggestions.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'ai-chip';
      chip.type = 'button';
      chip.textContent = s;
      chip.addEventListener('click', () => {
        this.handleUserInput(s);
      });
      bar.appendChild(chip);
    });
  }

  showTypingIndicator() {
    const flow = document.getElementById('ai-messages-flow');
    if (!flow) return;
    const typing = document.createElement('div');
    typing.id = 'ai-typing-indicator';
    typing.className = 'ai-message-row ai-msg-bot';
    typing.innerHTML = `
      <div class="ai-msg-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    flow.appendChild(typing);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    const flow = document.getElementById('ai-messages-flow');
    if (flow) {
      flow.scrollTop = flow.scrollHeight;
    }
  }

  /* =========================================================================
     Smart Rule-Based NLP Processor
     ========================================================================= */
  processNLPQuery(input) {
    const query = input.toLowerCase().trim();

    // 1. Low Price Queries (₹10 - ₹100)
    if (query.includes('10') || query.includes('under 50') || query.includes('under 100') || query.includes('under ₹100') || query.includes('micro') || query.includes('tag')) {
      const ultraLow = PRODUCTS_DATABASE.filter(p => p.price <= 100);
      return {
        text: `Here are our ultra-affordable cyber gadgets starting from just **₹19**! Complete with full 3D interactive models:`,
        products: ultraLow,
        suggestions: ["Show products under ₹500", "Show gaming controller", "Show smart watches"]
      };
    }

    // 2. Budget under ₹500
    if (query.includes('under 500') || query.includes('under ₹500') || query.includes('accessories') || query.includes('cable') || query.includes('puck') || query.includes('stylus')) {
      const under500 = PRODUCTS_DATABASE.filter(p => p.price <= 500);
      return {
        text: `Found **${under500.length} cyber accessories** under **₹500**:`,
        products: under500.slice(0, 4),
        suggestions: ["Show Braided RGB Warp Cable", "Show MagSafe Cyber Puck", "Show Cyber Stylus Pen"]
      };
    }

    // 3. Gaming Controller
    if (query.includes('game') || query.includes('controller') || query.includes('gamepad')) {
      const gamepad = getProductById('vision-gamepad');
      return {
        text: `Here is the **Vision GamePad Cyber Controller (₹1,999)** with magnetic Hall-Effect anti-drift joysticks and 1000Hz polling rate!`,
        products: [gamepad],
        suggestions: ["Open Vision GamePad in 3D", "Show products under ₹1000", "Show all audio"]
      };
    }

    // 4. "What is VisionVerse?"
    if (query.includes('what is visionverse') || query.includes('about visionverse') || query.includes('what is this website')) {
      return {
        text: "<strong>VisionVerse 3D Commerce</strong> is a spatial shopping platform. Instead of static 2D images, you experience real-time Three.js 3D models, interact with hardware hotspots, test customizable colors & materials in real-time, inspect products in Augmented Reality (AR), and checkout seamlessly!",
        suggestions: ["Show all products", "Show 3D virtual exhibition", "Show products under ₹100"]
      };
    }

    // 5. "Show me the smart vehicle" / Car
    if (query.includes('vehicle') || query.includes('car') || query.includes('visioncar')) {
      const car = getProductById('visioncar-one');
      return {
        text: `Here is the <strong>VisionCar One</strong> — our flagship autonomous hyper-electric cyber-coupe with Level 4 AI, panoramic HUD, and 950km solid-state range!`,
        products: [car],
        suggestions: ["Open VisionCar in 3D", "Show products under ₹5000", "Show VisionWatch Pro"],
        action: { type: 'HIGHLIGHT_PRODUCT', id: 'visioncar-one' }
      };
    }

    // 6. "Show smart watches" / Watches
    if (query.includes('watch') || query.includes('wearable') || query.includes('band')) {
      const watches = PRODUCTS_DATABASE.filter(p => p.category === 'Wearables');
      return {
        text: `Found <strong>${watches.length} premium wearable devices</strong> from ₹999 to ₹12,999:`,
        products: watches.slice(0, 4),
        suggestions: ["Compare VisionWatch X1 vs Pro", "Show Cyber Fitness Band", "Show products under ₹100"]
      };
    }

    // 7. "What is the cheapest product?" / Lowest price
    if (query.includes('cheap') || query.includes('lowest price') || query.includes('least expensive') || query.includes('budget')) {
      const sorted = [...PRODUCTS_DATABASE].sort((a, b) => a.price - b.price);
      const cheapest = sorted[0];
      return {
        text: `The most affordable product is the <strong>${cheapest.name}</strong> at only <strong>${formatPriceINR(cheapest.price)}</strong> (${cheapest.discount}).`,
        products: [cheapest, sorted[1], sorted[2]],
        suggestions: ["Show products under ₹100", "Show products under ₹500", "Add NFC Tag to Cart"]
      };
    }

    // 8. "Show products under ₹5000" / "under ₹10000"
    if (query.includes('under 5000') || query.includes('under ₹5000') || query.includes('under 5k')) {
      const under5k = PRODUCTS_DATABASE.filter(p => p.price <= 5000);
      return {
        text: `Here are the top products under <strong>₹5,000</strong>:`,
        products: under5k.slice(0, 4),
        suggestions: ["Show products under ₹100", "Compare VisionWatch X1 vs VisionPods", "Cheapest product"]
      };
    }

    // 9. "Which product is good for students?"
    if (query.includes('student') || query.includes('study') || query.includes('college') || query.includes('work')) {
      const studentPicks = [
        getProductById('braided-rgb-cable'),
        getProductById('smart-stylus-pen'),
        getProductById('visionpods'),
        getProductById('visionlaptop-pro')
      ].filter(Boolean);
      return {
        text: `For students and creators, I highly recommend:<br>• <strong>Braided RGB Warp Cable (₹199)</strong> for ultra-fast 240W power.<br>• <strong>Cyber Stylus Pen (₹299)</strong> for digital note-taking.<br>• <strong>VisionPods (₹3,499)</strong> for noise-cancelling study sessions!`,
        products: studentPicks,
        suggestions: ["Show Cyber Stylus Pen", "Show Braided Cable", "Get a coupon code"]
      };
    }

    // 10. "Compare VisionWatch X1 and VisionWatch Pro"
    if (query.includes('compare') || (query.includes('x1') && query.includes('pro'))) {
      const x1 = getProductById('visionwatch-x1');
      const pro = getProductById('visionwatch-pro');
      return {
        text: `<strong>Comparison: VisionWatch X1 vs VisionWatch Pro</strong><br><br>
        • <strong>VisionWatch X1 (${formatPriceINR(x1.price)}):</strong> 1.96" Curved AMOLED, 14-day battery, titanium matrix frame.<br><br>
        • <strong>VisionWatch Pro (${formatPriceINR(pro.price)}):</strong> 2.05" Solar Sapphire Glass, 45-day battery with solar charging, dual GPS, 100m dive rating.`,
        products: [x1, pro],
        suggestions: ["Open VisionWatch Pro in 3D", "Open VisionWatch X1 in 3D", "Show all wearables"]
      };
    }

    // 11. "How does customization work?"
    if (query.includes('custom') || query.includes('color') || query.includes('material') || query.includes('size')) {
      return {
        text: `🎨 <strong>3D Customizer Guide:</strong><br>
        1. Open any product in the 3D Viewer.<br>
        2. Pick your favorite <strong>Color</strong>.<br>
        3. Switch <strong>Materials</strong> (Titanium, Glass, Carbon).<br>
        4. Choose your preferred <strong>Size</strong>.<br>
        5. Watch the 3D object update live with real-time dynamic pricing!`,
        suggestions: ["Show smart watches", "Show me the smart vehicle", "Show products under ₹100"]
      };
    }

    // 12. Discount / Promo codes
    if (query.includes('coupon') || query.includes('discount') || query.includes('code') || query.includes('offer')) {
      return {
        text: `🎉 Exclusive Hackathon Promo Codes:<br>• Use code <strong>VISION20</strong> for <strong>20% OFF</strong> your entire order!<br>• Use code <strong>HACKATHON</strong> for instant <strong>₹1,000 OFF</strong>.`,
        suggestions: ["Go to Cart", "Show bestsellers", "Show products under ₹100"]
      };
    }

    // Default Fallback
    const matchedProducts = PRODUCTS_DATABASE.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.shortDesc.toLowerCase().includes(query)
    );

    if (matchedProducts.length > 0) {
      return {
        text: `Found <strong>${matchedProducts.length} matching products</strong> for "<em>${input}</em>":`,
        products: matchedProducts.slice(0, 3),
        suggestions: ["What is the cheapest product?", "Show products under ₹100", "How does 3D customization work?"]
      };
    }

    return {
      text: `I'm here to guide you through VisionVerse! You can ask me to find products from **₹19** to **₹8,99,999**, compare models, or explain our live 3D customizer.`,
      suggestions: [
        "Show products under ₹100",
        "Show products from ₹10 to ₹500",
        "Show smart watches",
        "Show me the smart vehicle",
        "Compare X1 vs Pro"
      ]
    };
  }

  executeAction(action) {
    if (!action) return;

    if (action.type === 'NAVIGATE_3D') {
      if (window.location.pathname.endsWith('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('id') !== action.id) {
          window.location.href = `product.html?id=${action.id}`;
        }
      } else {
        setTimeout(() => {
          window.location.href = `product.html?id=${action.id}`;
        }, 1200);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.visionAIGuide = new VisionAIGuide();
});

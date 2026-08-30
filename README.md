# VisionVerse 3D Commerce
> *"Shop Beyond the Screen."*

An immersive spatial e-commerce platform combining procedural **Three.js & WebGL 3D graphics**, interactive **hardware telemetry hotspots**, live **PBR materials and color customizer**, **WebXR & simulated Augmented Reality (AR)**, an intelligent **Vision AI Shopping Guide**, and a complete client-side shopping checkout pipeline with persistent **LocalStorage**.

---

## 🌟 Expanded Catalog: From ₹19 Micro-Tech to Hyper-EVs

The catalog now features **20+ procedural 3D products** spanning every price tier:

| Product | Category | Price (INR) | 3D Features & Highlights |
| :--- | :--- | :--- | :--- |
| **Cyber NFC Smart Tag** | Accessories | **₹19** *(was ₹99)* | Holographic diffractive film, micro-IC coil, real-time rotation |
| **Quantum Lens Guard** | Accessories | **₹49** *(was ₹149)* | Triple 9H sapphire optical ring assembly, AR coat reflections |
| **Cyber Beacon Keyring** | Accessories | **₹99** *(was ₹299)* | Levitating hexagonal crystal, dual counter-rotating gyro rings |
| **Acoustic Memory Foam Ear Tips** | Audio | **₹149** *(was ₹399)* | Ergonomic viscoelastic foam, soundwave core tubes |
| **Braided RGB Warp Cable** | Accessories | **₹199** *(was ₹499)* | Flowing photon waveguide, USB-C 240W zinc alloy head |
| **Cyber Stylus Pen** | Accessories | **₹299** *(was ₹699)* | Magnetic inductive strip, 4096-level POM fine nib |
| **MagSafe Cyber Puck** | Accessories | **₹499** *(was ₹999)* | 360° pulsating neon breathing halo, Qi2 copper coil |
| **Desk Hologram Prism** | Smart Home | **₹899** *(was ₹1,599)* | Levitating K9 crystal pyramid with sound-reactive RGB beams |
| **Cyber Fitness Band** | Wearables | **₹999** *(was ₹1,999)* | Curved vertical OLED screen, 24/7 PPG bio-telemetry |
| **Vision GamePad Cyber Controller** | Gaming | **₹1,999** *(was ₹3,499)* | Magnetic Hall-Effect joysticks, RGB edge grips, micro-triggers |
| **VisionPods Studio Headphones** | Audio | **₹3,499** *(was ₹5,499)* | Graphene drivers, -48dB hybrid ANC, spatial 3D audio |
| **Smart Ring** | Wearables | **₹4,499** *(was ₹6,999)* | Hypoallergenic titanium band, continuous bio-impedance |
| **VisionWatch X1** | Wearables | **₹4,999** *(was ₹7,999)* | 1.96" curved AMOLED, titanium matrix, haptic crown dial |
| **Smart Home Hub** | Smart Home | **₹5,999** *(was ₹8,499)* | 360° LiDAR presence sensor, levitating hologram sphere |
| **Smart Speaker** | Audio | **₹6,999** *(was ₹9,999)* | Downward neodymium subwoofer, 32-zone aura top ring |
| **VisionWatch Pro** | Wearables | **₹7,999** *(was ₹11,999)* | Solar sapphire glass, dual-frequency GNSS, 100m dive rating |
| **Vision Glasses (AR)** | Wearables | **₹12,999** *(was ₹17,999)* | Micro-OLED diffractive waveguides, bone conduction audio |
| **Vision Camera** | Optics | **₹24,999** *(was ₹29,999)* | Full-frame 8K raw sensor, 5-axis OIS, tactile dials |
| **Future Drone** | Drones | **₹34,999** *(was ₹42,999)* | 4K gimbal eye, omnidirectional LiDAR radar, spinning rotors |
| **VisionPhone X** | Smartphones | **₹49,999** *(was ₹59,999)* | 200MP periscope array, 3nm neural core, titanium unibody |
| **VisionLaptop Pro** | Computing | **₹79,999** *(was ₹94,999)* | 16" 4K OLED 165Hz screen, liquid gallium vapor cooling |
| **VisionCar One** | Vehicles | **₹8,99,999** *(was ₹9,99,999)* | Level 4 autonomous AI coupe, solid-state 950km battery |

---

## 🌌 Next-Level 3D Immersion Features

1. **Floating Cyber Sparks / Dust Particles**: Dynamic particle system inside every 3D viewport for cinematic spatial depth.
2. **Multi-Environment Studio Lighting**: Live switch between **Cyber Neon** (Cyan/Magenta), **Clean Studio** (White 5500K), **Sunset Amber** (Warm gold), and **Matrix Glow** (Emerald high-tech).
3. **3D Explode / Deconstruct View (💥)**: Disassembles the 3D model in real-time, allowing users to inspect internal engineering layers and sensor coils.
4. **Camera Angle Presets**: One-click camera glide to **Front**, **Top**, **3D Isometric**, or **Close-Up** perspective.
5. **Interactive Hardware Hotspots**: Clickable pulsing pins that follow 3D model rotation with screen-projected telemetry cards.
6. **Live Customizer with Dynamic Pricing**: Change base colors, switch between Titanium, Glass, and Carbon Fiber, and adjust sizes with real-time price calculation.
7. **WebXR & Holographic AR Mode**: True-to-scale augmented reality projection with mobile QR scanner.

---

## 📁 Project Structure

```
visionverse-3d-commerce/
│
├── index.html          # Homepage with 3D Hero background, Micro-Tech grid, Showcase & Exhibition
├── shop.html           # Full 3D catalog with search, price slider (from ₹10), and filters
├── product.html        # Master 3D product studio, Hotspots, Customizer, Explode view, and AR
├── cart.html           # Shopping cart with customization tags and promo code applicator
├── checkout.html       # Express checkout, interactive credit card widget, UPI QR, and receipt
│
├── css/
│   ├── style.css       # Core theme, glassmorphism, navigation, AI widget, and modals
│   ├── shop.css        # Shop grid, filter sidebar, and card hover animations
│   ├── product.css     # 3D viewport, studio lighting chips, explode button, and customizer
│   ├── cart.css        # Responsive cart table, stepper, and summary box
│   └── checkout.css    # Checkout forms, live credit card widget, and confirmation modal
│
├── js/
│   ├── products.js     # Unified database of 20+ products (₹19 to ₹8,99,999)
│   ├── three-viewer.js # Procedural Three.js 3D engine, studio lights, explode mode, and particles
│   ├── main.js         # Shared state (cart/wishlist), toasts, quick-view, hero background
│   ├── shop.js         # Search, filtering from ₹10, and catalog rendering logic
│   ├── product.js      # Product details, studio lights switch, explode mode & dynamic pricing
│   ├── cart.js         # Cart management, promo codes (VISION20 / HACKATHON), totals
│   ├── checkout.js     # Order placement, validation, and receipt generation
│   └── ai-guide.js     # Rule-based Vision AI assistant with budget query intelligence
│
└── README.md           # Documentation & Hackathon Presentation Guide
```

---

## 🚀 How to Run

1. Open [`visionverse-3d-commerce/`](file:///C:/Users/Admin/.gemini/antigravity/scratch/visionverse-3d-commerce) in **VS Code**.
2. Right click [`index.html`](file:///C:/Users/Admin/.gemini/antigravity/scratch/visionverse-3d-commerce/index.html) and select **"Open with Live Server"** (or open [`index.html`](file:///C:/Users/Admin/.gemini/antigravity/scratch/visionverse-3d-commerce/index.html) directly in any browser).

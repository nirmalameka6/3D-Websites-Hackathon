/**
 * VisionVerse 3D Commerce - Unified Product Database
 * Shared single source of truth for all products across all pages
 * Spanning affordable cyber accessories from ₹19 to flagship hyper-EVs
 */

const PRODUCTS_DATABASE = [
  // ==========================================
  // Ultra-Affordable Micro-Tech & Accessories (₹19 - ₹999)
  // ==========================================
  {
    id: "cyber-nfc-tag",
    name: "Cyber NFC Smart Tag",
    category: "Accessories",
    price: 19,
    oldPrice: 99,
    discount: "81% OFF",
    rating: 4.6,
    reviews: 890,
    badge: "Under ₹20",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "smart_tag",
    shortDesc: "Programmable holographic NFC smart micro-badge for instant touch automations.",
    description: "The ultimate micro-tech gadget. Stick this water-resistant holographic NFC tag anywhere to trigger smart home scenes, share social profiles, tap-to-pay tokens, or toggle phone focus modes with zero battery required.",
    specifications: {
      "Chipset": "NTAG216 High-Capacity Micro-IC (888 Bytes)",
      "Operating Range": "13.56 MHz (Up to 40mm read distance)",
      "Durability": "IP68 Submersible & Thermal Shielded (-20°C to 80°C)",
      "Adhesive": "3M Reusable Nano-Suction Layer",
      "Lifespan": "100,000+ Write Cycles (10-Year Data Retention)"
    },
    colors: [
      { name: "Neon Cyan", hex: "#00f0ff", emissive: "#00d2ff" },
      { name: "Cyber Violet", hex: "#8a2be2", emissive: "#a855f7" },
      { name: "Stealth Black", hex: "#111827", emissive: "#374151" }
    ],
    materials: [
      { id: "standard", name: "Holographic PET", priceMod: 0, desc: "Ultra-thin flexible refractive layer" },
      { id: "metal", name: "Aluminum Foil Inlay", priceMod: 10, desc: "Enhanced RF shielding backing (+₹10)" },
      { id: "carbon", name: "Carbon Fiber Texture", priceMod: 20, desc: "Scratch-resistant matte finish (+₹20)" }
    ],
    sizes: [
      { id: "small", name: "25mm Coin", priceMod: 0, scale: 0.8 },
      { id: "medium", name: "30mm Standard", priceMod: 0, scale: 1.0 },
      { id: "large", name: "40mm Max Range", priceMod: 10, scale: 1.25 }
    ],
    hotspots: [
      {
        id: "ic-core",
        label: "NFC Micro-IC",
        title: "NTAG216 Neural Coil",
        description: "Zero-power inductive antenna activates instantly on proximity to any smartphone.",
        pos: [0, 0, 0.15]
      },
      {
        id: "holo-film",
        label: "Diffractive Film",
        title: "Holographic Light Diffractor",
        description: "Reflects dynamic spectrum colors with laser-etched security watermarks.",
        pos: [0, 0.4, 0.1]
      }
    ]
  },
  {
    id: "quantum-lens-guard",
    name: "Quantum Lens Guard",
    category: "Accessories",
    price: 49,
    oldPrice: 149,
    discount: "67% OFF",
    rating: 4.8,
    reviews: 640,
    badge: "Under ₹50",
    featured: false,
    trending: false,
    newArrival: true,
    modelType: "lens_guard",
    shortDesc: "9H sapphire coated anti-reflective optical lens shield for smartphone & camera optics.",
    description: "Military-grade sapphire fusion glass designed to protect delicate camera lenses from keys, drops, and micro-scratches with 99.9% light transmission and zero lens flare.",
    specifications: {
      "Hardness": "9H Mohs Scale Ultra-Hard Sapphire Coat",
      "Coating": "Oleophobic Hydrophobic Nanotech Layer",
      "Clarity": "99.9% Optical Grade Light Transmission",
      "Compatibility": "Universal VisionPhone, iPhone, & Galaxy Lenses"
    },
    colors: [
      { name: "Diamond Clear", hex: "#e2e8f0", emissive: "#ffffff" },
      { name: "Cyber Titanium", hex: "#64748b", emissive: "#94a3b8" },
      { name: "Dark Chrome", hex: "#1e293b", emissive: "#334155" }
    ],
    materials: [
      { id: "standard", name: "Tempered Glass", priceMod: 0, desc: "Clear 9H glass protector" },
      { id: "glass", name: "Sapphire Crystal", priceMod: 30, desc: "Scratch-immune pure sapphire (+₹30)" }
    ],
    sizes: [
      { id: "medium", name: "Standard 3-Ring Set", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Pro Ultra Full Island", priceMod: 20, scale: 1.2 }
    ],
    hotspots: [
      {
        id: "sapphire",
        label: "9H Sapphire",
        title: "Anti-Scratch Crystal",
        description: "Resists diamond and tungsten-carbide abrasion.",
        pos: [0, 0, 0.1]
      }
    ]
  },
  {
    id: "cyber-beacon-keyring",
    name: "Cyber Beacon Keyring",
    category: "Accessories",
    price: 99,
    oldPrice: 299,
    discount: "67% OFF",
    rating: 4.7,
    reviews: 420,
    badge: "Under ₹100",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "cyber_beacon",
    shortDesc: "Floating hexagonal tritium-style luminous cyber beacon with orbital gyroscopic rings.",
    description: "An iconic cyberpunk EDC accessory. Featuring photoluminescent quantum glow cores that illuminate for 12 hours after 2 minutes in ambient light, encased in aerospace aluminum.",
    specifications: {
      "Luminescence": "SuperLumiNova Quantum Glow (Zero Electricity)",
      "Chassis": "CNC Milled 6061 Aerospace Aluminum",
      "Waterproofing": "Submersible 100m Dive Seal",
      "Weight": "12 grams Featherweight"
    },
    colors: [
      { name: "Toxic Green", hex: "#10b981", emissive: "#34d399" },
      { name: "Plasma Blue", hex: "#00f0ff", emissive: "#38bdf8" },
      { name: "Neon Violet", hex: "#8a2be2", emissive: "#a855f7" }
    ],
    materials: [
      { id: "standard", name: "Anodized Alloy", priceMod: 0, desc: "Matte sandblasted aluminum" },
      { id: "metal", name: "Polished Titanium", priceMod: 50, desc: "Heat-treated flame titanium (+₹50)" },
      { id: "carbon", name: "Forged Carbon Sleeve", priceMod: 80, desc: "Ultralight composite body (+₹80)" }
    ],
    sizes: [
      { id: "small", name: "Mini EDC (40mm)", priceMod: 0, scale: 0.85 },
      { id: "medium", name: "Standard (55mm)", priceMod: 0, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "glow-core",
        label: "Quantum Core",
        title: "Photoluminescent Chamber",
        description: "Glows with a vibrant neon aura in the dark without batteries.",
        pos: [0, 0, 0]
      },
      {
        id: "orbit-ring",
        label: "Gyro Ring",
        title: "Free-Spinning Orbital Ring",
        description: "Magnetic micro-bearing provides tactile fidget spinning.",
        pos: [0, 0.4, 0]
      }
    ]
  },
  {
    id: "memory-foam-ear-tips",
    name: "Acoustic Memory Foam Ear Tips",
    category: "Audio",
    price: 149,
    oldPrice: 399,
    discount: "62% OFF",
    rating: 4.9,
    reviews: 580,
    badge: "Audio Upgrade",
    featured: false,
    trending: false,
    newArrival: true,
    modelType: "ear_tips",
    shortDesc: "Ultra-plush body-heat activated memory foam tips for maximum bass & noise isolation.",
    description: "Transforms any in-ear earbuds into acoustic mastering monitors. Expands naturally in your ear canal for 3x better passive noise isolation, deeper sub-bass response, and all-day ergonomic comfort.",
    specifications: {
      "Core Material": "Heat-Reactive Viscoelastic Polyurethane",
      "Acoustic Wax Guard": "Laser-Cut Micro-Mesh Sound Transparent Filter",
      "Pack": "3 Pairs (Small, Medium, Large)"
    },
    colors: [
      { name: "Stealth Charcoal", hex: "#1e293b", emissive: "#334155" },
      { name: "Cyber Cyan", hex: "#06b6d4", emissive: "#22d3ee" },
      { name: "Neon Magenta", hex: "#f43f5e", emissive: "#fb7185" }
    ],
    materials: [
      { id: "standard", name: "Standard Memory Foam", priceMod: 0, desc: "Ultra-soft expanding foam" },
      { id: "glass", name: "Gel-Infused Cooling Foam", priceMod: 40, desc: "Cooling phase-change gel (+₹40)" }
    ],
    sizes: [
      { id: "medium", name: "Multi-Size Pack (S/M/L)", priceMod: 0, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "foam-core",
        label: "Visco Foam",
        title: "Adaptive Ear Canal Seal",
        description: "Locks out up to -32dB of ambient background chatter.",
        pos: [0, 0.1, 0.2]
      }
    ]
  },
  {
    id: "braided-rgb-cable",
    name: "Braided RGB Warp Cable",
    category: "Accessories",
    price: 199,
    oldPrice: 499,
    discount: "60% OFF",
    rating: 4.8,
    reviews: 940,
    badge: "240W Fast Charge",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "braided_cable",
    shortDesc: "240W USB-C 3.2 fast-charging cable with flowing neon fiber-optic speed indicator.",
    description: "Experience charging speed you can see. The Braided RGB Warp Cable features flowing photon waveguides that pulse faster when delivering 240W fast-charging, slowing down as your battery tops off.",
    specifications: {
      "Power Delivery": "USB-PD 3.1 Extended Power Range (Up to 240W 48V/5A)",
      "Data Rate": "40 Gbps Ultra-Speed Sync (8K Video Display Output)",
      "Cable Length": "1.5 Meters (5 Feet) Double-Braided Kevlar Core",
      "Bend Tested": "50,000+ 180° Flex Cycles"
    },
    colors: [
      { name: "Neon Flow Cyan", hex: "#00f0ff", emissive: "#00d2ff" },
      { name: "Cyber Purple", hex: "#8a2be2", emissive: "#a855f7" },
      { name: "Solar Amber", hex: "#ff6b00", emissive: "#f97316" }
    ],
    materials: [
      { id: "standard", name: "Braided Nylon & Zinc", priceMod: 0, desc: "Durable military weave" },
      { id: "metal", name: "Aluminum Alloy Tips", priceMod: 50, desc: "CNC milled heat sink connector caps (+₹50)" },
      { id: "carbon", name: "Kevlar Ballistic Armor", priceMod: 90, desc: "Unbreakable bulletproof sleeve (+₹90)" }
    ],
    sizes: [
      { id: "medium", name: "1.5m Standard", priceMod: 0, scale: 1.0 },
      { id: "large", name: "3.0m Extended Studio", priceMod: 80, scale: 1.2 }
    ],
    hotspots: [
      {
        id: "tip",
        label: "Zinc Alloy Head",
        title: "E-Marker Smart Controller",
        description: "Negotiates safest maximum voltage and temperature in real-time.",
        pos: [0, 0.6, 0]
      },
      {
        id: "flow",
        label: "Photon Weave",
        title: "Flowing LED Light Pipe",
        description: "Illuminates current flow direction with dynamic neon pulsations.",
        pos: [0, -0.2, 0.1]
      }
    ]
  },
  {
    id: "smart-stylus-pen",
    name: "Cyber Stylus Pen",
    category: "Accessories",
    price: 299,
    oldPrice: 699,
    discount: "57% OFF",
    rating: 4.7,
    reviews: 310,
    badge: "Precision",
    featured: false,
    trending: false,
    newArrival: true,
    modelType: "smart_stylus",
    shortDesc: "4096-level pressure capacitive stylus with magnetic wireless charging deck.",
    description: "Write and sketch with zero lag. The Cyber Stylus Pen brings sub-millimeter precision to tablets, laptops, and smart screens with palm-rejection intelligence and haptic stroke simulation.",
    specifications: {
      "Pressure Levels": "4096 Discrete Sensitivity Steps",
      "Tilt Sensitivity": "60° Dynamic Shading Angle",
      "Battery": "14 Hours Continuous Drawing, 15-min Quick-Charge",
      "Tip": "Ultra-Fine 1.2mm POM Replaceable Nibs"
    },
    colors: [
      { name: "Matte Graphite", hex: "#334155", emissive: "#475569" },
      { name: "Arctic White", hex: "#f8fafc", emissive: "#e2e8f0" },
      { name: "Cyber Violet", hex: "#7c3aed", emissive: "#a78bfa" }
    ],
    materials: [
      { id: "standard", name: "Anodized Aluminum", priceMod: 0, desc: "Matte ergonomic barrel" },
      { id: "metal", name: "Titanium Tip Collet", priceMod: 60, desc: "Wear-resistant metallic collet (+₹60)" },
      { id: "carbon", name: "Carbon Fiber Grip", priceMod: 90, desc: "Featherweight composite balance (+₹90)" }
    ],
    sizes: [
      { id: "medium", name: "Standard 160mm", priceMod: 0, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "nib",
        label: "1.2mm POM Nib",
        title: "Active Electromagnetic Digitizer",
        description: "Zero friction paper-feel drawing surface.",
        pos: [0, -0.8, 0]
      },
      {
        id: "battery",
        label: "Magnetic Snap",
        title: "Inductive Charge Strip",
        description: "Snaps magnetically to the side of laptops and tablets to recharge.",
        pos: [0, 0.4, 0]
      }
    ]
  },
  {
    id: "magsafe-cyber-puck",
    name: "MagSafe Cyber Puck",
    category: "Accessories",
    price: 499,
    oldPrice: 999,
    discount: "50% OFF",
    rating: 4.8,
    reviews: 730,
    badge: "15W Magnetic",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "magsafe_puck",
    shortDesc: "Fast 15W magnetic wireless charging pad with ambient pulsing breathing halo.",
    description: "Snap and charge effortlessly. Built with 16 neodymium magnets and a heat-dissipating aluminum unibody, the MagSafe Cyber Puck snaps firmly to phones, watches, and audio pods.",
    specifications: {
      "Output": "15W / 10W / 7.5W / 5W Smart Induction",
      "Magnets": "N52 Grade Strong Neodymium Array (1.2kg holding force)",
      "Thickness": "Ultra-Slim 5.8mm Profile",
      "Safety": "Foreign Object Detection (FOD), Over-temp & Over-voltage Shield"
    },
    colors: [
      { name: "Cyberpunk Glow", hex: "#00f0ff", emissive: "#00d2ff" },
      { name: "Obsidian Slate", hex: "#0f172a", emissive: "#334155" },
      { name: "Plasma Magenta", hex: "#f43f5e", emissive: "#fb7185" }
    ],
    materials: [
      { id: "standard", name: "Tempered Glass & Alloy", priceMod: 0, desc: "Satin glass face with metal rim" },
      { id: "metal", name: "Full Brass Base", priceMod: 120, desc: "Heavy weighted desktop brass plate (+₹120)" },
      { id: "carbon", name: "Woven Carbon Puck", priceMod: 180, desc: "Exposed carbon fiber face (+₹180)" }
    ],
    sizes: [
      { id: "medium", name: "Single Pad (56mm)", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Dual Pad (Phone + Watch)", priceMod: 250, scale: 1.25 }
    ],
    hotspots: [
      {
        id: "coil",
        label: "Qi2 Magnetic Array",
        title: "Pure Copper Induction Coil",
        description: "95% electrical efficiency with zero wasted magnetic flux.",
        pos: [0, 0.15, 0]
      },
      {
        id: "halo",
        label: "Breathing Halo",
        title: "360° Neon Glow Ring",
        description: "Softly illuminates during active charging cycles.",
        pos: [0, 0, 0.45]
      }
    ]
  },
  {
    id: "desk-prism-lamp",
    name: "Desk Hologram Prism",
    category: "Smart Home",
    price: 899,
    oldPrice: 1599,
    discount: "44% OFF",
    rating: 4.9,
    reviews: 410,
    badge: "Atmospheric",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "desk_prism",
    shortDesc: "Levitating optical pyramid prism with sound-reactive RGB spatial illumination.",
    description: "Elevate your desktop cockpit. The Desk Hologram Prism casts mesmerizing geometric auroras across your room, synchronizing its neon pulses with your ambient music or keyboard clicks.",
    specifications: {
      "Optics": "K9 Optical Crystal Glass Geometric Pyramid",
      "Lighting Modes": "16 Million Colors + 12 Reactive Ambient Scene Presets",
      "Connectivity": "Bluetooth 5.3 + VisionOS Music Sync App",
      "Power": "USB-C Powered with 8-Hour Built-In Battery"
    },
    colors: [
      { name: "Aurora Spectrum", hex: "#8a2be2", emissive: "#c084fc" },
      { name: "Glacier Blue", hex: "#00f0ff", emissive: "#38bdf8" },
      { name: "Sunset Blaze", hex: "#ea580c", emissive: "#f97316" }
    ],
    materials: [
      { id: "standard", name: "Optical Crystal & Poly", priceMod: 0, desc: "High-transparency crystal dome" },
      { id: "glass", name: "Dichroic Beam Splitter", priceMod: 200, desc: "Multi-color splitting dichroic coating (+₹200)" },
      { id: "metal", name: "Brushed Titanium Base", priceMod: 300, desc: "Weighted metallic pedestal (+₹300)" }
    ],
    sizes: [
      { id: "medium", name: "Desk Companion (80mm)", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Studio Tower (120mm)", priceMod: 400, scale: 1.3 }
    ],
    hotspots: [
      {
        id: "pyramid",
        label: "K9 Prism",
        title: "Refractive Pyramid",
        description: "Splits internal RGB beams into rainbow laser spectra.",
        pos: [0, 0.4, 0]
      },
      {
        id: "base",
        label: "Touch Base",
        title: "Acoustic Sensor Mic",
        description: "Samples room audio to match lighting ripples with your favorite tracks.",
        pos: [0, -0.2, 0.3]
      }
    ]
  },
  {
    id: "fitness-band-x",
    name: "Cyber Fitness Band",
    category: "Wearables",
    price: 999,
    oldPrice: 1999,
    discount: "50% OFF",
    rating: 4.6,
    reviews: 520,
    badge: "Fitness Pro",
    featured: false,
    trending: true,
    newArrival: true,
    modelType: "fitness_band",
    shortDesc: "Slim curved OLED fitness tracker with 24/7 SpO2, heart rate, and 20-day battery life.",
    description: "Maximum health intelligence in a featherweight band. Features continuous blood oxygen tracking, 120 sports modes, water resistance to 50 meters, and instant wrist gesture notifications.",
    specifications: {
      "Display": "1.47-inch Curved AMOLED Color Screen",
      "Battery Life": "20 Days Ultra Endurance / 12 Days Heavy Use",
      "Sensors": "6-Axis Motion Sensor, PPG Heart Rate, Pulse Oximeter",
      "Water Resistance": "5ATM Submersible (50 Meters)"
    },
    colors: [
      { name: "Neon Cyber Blue", hex: "#00f0ff", emissive: "#00d2ff" },
      { name: "Cyber Purple", hex: "#8a2be2", emissive: "#a855f7" },
      { name: "Stealth Black", hex: "#0f172a", emissive: "#1e293b" }
    ],
    materials: [
      { id: "standard", name: "Silicone & Polymer", priceMod: 0, desc: "Breathable ribbed strap" },
      { id: "metal", name: "Magnetic Milanese Loop", priceMod: 200, desc: "Stainless steel mesh strap (+₹200)" },
      { id: "carbon", name: "Carbon Weave Band", priceMod: 300, desc: "Ultralight athlete strap (+₹300)" }
    ],
    sizes: [
      { id: "medium", name: "Standard Fit (140-210mm)", priceMod: 0, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "screen",
        label: "AMOLED Curve",
        title: "Vivid Color Matrix",
        description: "Always-on display showing heart telemetry and daily calorie burns.",
        pos: [0, 0.1, 0.35]
      },
      {
        id: "sensor",
        label: "PPG Sensor",
        title: "Dual-Wavelength LED",
        description: "Measures arterial blood volume changes at 100Hz frequency.",
        pos: [0, 0, -0.3]
      }
    ]
  },
  {
    id: "vision-gamepad",
    name: "Vision GamePad Cyber Controller",
    category: "Gaming",
    price: 1999,
    oldPrice: 3499,
    discount: "43% OFF",
    rating: 4.9,
    reviews: 670,
    badge: "Zero Latency",
    featured: true,
    trending: true,
    newArrival: true,
    modelType: "gamepad",
    shortDesc: "Hall-Effect anti-drift cyber controller with mechanical micro-switches & RGB aura grips.",
    description: "Dominate competitive games with magnetic Hall-Effect joysticks that never drift. Features 1000Hz ultra-polling wireless latency, tactile mouse-click mechanical switches, and programmable rear macro paddles.",
    specifications: {
      "Thumbsticks": "Magnetic Hall-Effect Sensors (0% Deadzone, Anti-Drift)",
      "Polling Rate": "1000Hz Ultra-Low 1ms Wireless / Wired",
      "Triggers": "Dual Hall-Magnetic Impulse Triggers with Hair-Trigger Locks",
      "Compatibility": "PC, VisionOS, Steam Deck, Switch, Android, iOS, PlayStation"
    },
    colors: [
      { name: "Cyberpunk Purple", hex: "#7c3aed", emissive: "#a78bfa" },
      { name: "Glacier Cyan", hex: "#06b6d4", emissive: "#22d3ee" },
      { name: "Stealth Onyx", hex: "#111827", emissive: "#374151" },
      { name: "Hyper Red", hex: "#e11d48", emissive: "#f43f5e" }
    ],
    materials: [
      { id: "standard", name: "Textured Ergonomic Polymer", priceMod: 0, desc: "Non-slip laser micro-textured grips" },
      { id: "metal", name: "Anodized Metal D-Pad & Triggers", priceMod: 300, desc: "CNC tactile metallic controls (+₹300)" },
      { id: "carbon", name: "Forged Carbon Faceplate", priceMod: 500, desc: "Removable magnetic carbon shell (+₹500)" }
    ],
    sizes: [
      { id: "medium", name: "Standard Ergonomic", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Pro Tournament (with 4 Back Paddles)", priceMod: 400, scale: 1.05 }
    ],
    hotspots: [
      {
        id: "sticks",
        label: "Hall Sticks",
        title: "Magnetic Zero-Contact Gimbals",
        description: "Zero physical contact friction prevents joystick drift for 5+ million cycles.",
        pos: [-0.4, 0.1, 0.2]
      },
      {
        id: "dpad",
        label: "Mechanical D-Pad",
        title: "Microswitch Click Array",
        description: "Delivers crisp, instantaneous directional inputs for fighting & rhythm games.",
        pos: [-0.4, -0.2, 0.2]
      },
      {
        id: "triggers",
        label: "Impulse Triggers",
        title: "Independent Rumble Motors",
        description: "Haptic feedback right in your fingertips simulates trigger resistance.",
        pos: [0, 0.5, -0.4]
      }
    ]
  },

  // ==========================================
  // Core Flagship Hardware (₹3,499 - ₹8,99,999)
  // ==========================================
  {
    id: "visionwatch-x1",
    name: "VisionWatch X1",
    category: "Wearables",
    price: 4999,
    oldPrice: 7999,
    discount: "38% OFF",
    rating: 4.8,
    reviews: 342,
    badge: "Bestseller",
    featured: true,
    trending: true,
    newArrival: false,
    modelType: "smartwatch",
    shortDesc: "Next-gen holographic smartwatch with real-time biometric neural telemetry.",
    description: "The VisionWatch X1 redefines wearable intelligence. Featuring an aerospace-grade titanium frame and a micro-curved sapphire AMOLED screen, it monitors your vitals with medical-grade precision while projecting gesture-controlled holographic widgets directly above your wrist.",
    specifications: {
      "Display": "1.96-inch Micro-Curved AMOLED (1200 nits peak)",
      "Battery Life": "Up to 14 days ultra-power mode / 7 days typical",
      "Sensors": "Bio-Telemetry Optical Array, ECG, SpO2, Skin Temp, Gyro",
      "Connectivity": "Quantum Bluetooth 5.4, Ultra-Wideband (UWB), WiFi 6E",
      "Water Resistance": "5ATM + IP68 Submersible (up to 50m)",
      "OS Compatibility": "VisionOS, Android 11+, iOS 15+"
    },
    colors: [
      { name: "Cyber Purple", hex: "#8a2be2", emissive: "#a855f7" },
      { name: "Electric Blue", hex: "#00f0ff", emissive: "#00d2ff" },
      { name: "Neon Pink", hex: "#ff007f", emissive: "#ff1493" },
      { name: "Starlight White", hex: "#f0f4f8", emissive: "#e2e8f0" },
      { name: "Stealth Black", hex: "#12131a", emissive: "#334155" }
    ],
    materials: [
      { id: "standard", name: "Aerospace Polymer", priceMod: 0, desc: "Lightweight, ultra-durable matte finish" },
      { id: "metal", name: "Titanium Matrix", priceMod: 500, desc: "Grade 5 polished titanium chassis (+₹500)" },
      { id: "glass", name: "Sapphire Crystal", priceMod: 700, desc: "Refractive scratch-proof sapphire gloss (+₹700)" },
      { id: "carbon", name: "Forged Carbon", priceMod: 1000, desc: "Hypercar-grade woven composite (+₹1,000)" }
    ],
    sizes: [
      { id: "small", name: "40mm Compact", priceMod: 0, scale: 0.9 },
      { id: "medium", name: "44mm Standard", priceMod: 0, scale: 1.0 },
      { id: "large", name: "48mm Ultra", priceMod: 300, scale: 1.15 }
    ],
    hotspots: [
      {
        id: "display",
        label: "Holo-Display",
        title: "1.96\" Holographic AMOLED",
        description: "120Hz micro-curved glass with 1200-nit luminance for crystal clarity under direct sunlight.",
        pos: [0, 0.4, 0.45]
      },
      {
        id: "sensor",
        label: "Bio-Array",
        title: "Photoplethysmography Sensor",
        description: "9-channel optical sensor array capturing ECG, blood oxygen, pulse wave velocity, and stress in real-time.",
        pos: [0, -0.4, -0.4]
      },
      {
        id: "crown",
        label: "Haptic Crown",
        title: "Quantum Haptic Rotary Dial",
        description: "Rotary encoder with sub-millimeter magnetic resistance simulation for tactile UI navigation.",
        pos: [0.9, 0, 0]
      }
    ]
  },
  {
    id: "visionwatch-pro",
    name: "VisionWatch Pro",
    category: "Wearables",
    price: 7999,
    oldPrice: 11999,
    discount: "33% OFF",
    rating: 4.9,
    reviews: 512,
    badge: "Flagship",
    featured: true,
    trending: true,
    newArrival: true,
    modelType: "smartwatch_pro",
    shortDesc: "Rugged expedition smartwatch with dual-band satellite link and solar sapphire glass.",
    description: "Built for extreme explorers and digital nomads. The VisionWatch Pro features dual-frequency satellite navigation, military-grade MIL-STD-810H shock resistance, and an integrated photovoltaic crystal ring that continuously trickle-charges in ambient light.",
    specifications: {
      "Display": "2.05-inch Solar Sapphire AMOLED Always-On",
      "Battery Life": "24 days standard / 45 days with Solar Assist",
      "Satellite": "Dual-Band Multi-Constellation GNSS (L1+L5)",
      "Sensors": "Barometric Altimeter, 3-Axis Compass, Medical ECG, Thermometer",
      "Durability": "100m Dive Rated, Titanium Grade 5 Exoskeleton",
      "Case Size": "49mm Ruggedized"
    },
    colors: [
      { name: "Titanium Silver", hex: "#c0c0c0", emissive: "#94a3b8" },
      { name: "Solar Orange", hex: "#ff6b00", emissive: "#f97316" },
      { name: "Stealth Black", hex: "#0f1117", emissive: "#1e293b" },
      { name: "Deep Navy", hex: "#0a192f", emissive: "#0284c7" }
    ],
    materials: [
      { id: "standard", name: "Brushed Titanium", priceMod: 0, desc: "Satin-finished lightweight titanium" },
      { id: "metal", name: "Damascus Steel", priceMod: 800, desc: "Layered forged steel with distinctive grain (+₹800)" },
      { id: "carbon", name: "Aerospace Carbon", priceMod: 1200, desc: "Ultralight military composite (+₹1,200)" }
    ],
    sizes: [
      { id: "medium", name: "45mm Standard", priceMod: 0, scale: 1.0 },
      { id: "large", name: "49mm Extreme", priceMod: 400, scale: 1.15 }
    ],
    hotspots: [
      {
        id: "bezel",
        label: "Titanium Bezel",
        title: "Raised Protective Armor",
        description: "Grade 5 titanium lip protects the sapphire crystal from direct lateral impact.",
        pos: [0, 0.45, 0.45]
      },
      {
        id: "gps",
        label: "Dual-GPS",
        title: "Satellite Antenna Ring",
        description: "360-degree perimeter antenna for sub-meter positioning in dense cities and canyons.",
        pos: [0, 0.6, 0]
      },
      {
        id: "solar",
        label: "Solar Ring",
        title: "Photovoltaic Matrix",
        description: "Harvests sunlight to extend battery life up to 45 continuous days.",
        pos: [0, 0, 0.5]
      }
    ]
  },
  {
    id: "visioncar-one",
    name: "VisionCar One",
    category: "Vehicles",
    price: 899999,
    oldPrice: 999999,
    discount: "10% OFF",
    rating: 5.0,
    reviews: 89,
    badge: "Hyper-EV",
    featured: true,
    trending: true,
    newArrival: true,
    modelType: "cyber_car",
    shortDesc: "Autonomous electric cyber-coupe with holographic cockpit and solid-state power.",
    description: "The VisionCar One is the pinnacle of future mobility. Engineered with an aerodynamic monocoque carbon-fiber chassis, zero-latency Level 4 autonomous neural computing, and high-density solid-state batteries that deliver 950km on a single 15-minute ultra-charge.",
    specifications: {
      "0-100 km/h": "2.1 seconds (Dual Quad-Core Flux Motors)",
      "Range": "950 km per charge (Solid-State 120 kWh)",
      "Top Speed": "340 km/h Electronically Governed",
      "Autonomy": "VisionDrive Level 4 Autonomous Neural AI",
      "Charging": "800V Hyper-Charge (10% to 80% in 12 mins)",
      "Infotainment": "360° Wrap-Around Panoramic OLED HUD"
    },
    colors: [
      { name: "Cyberpunk Violet", hex: "#7928ca", emissive: "#a855f7" },
      { name: "Quantum Cyan", hex: "#00f0ff", emissive: "#38bdf8" },
      { name: "Liquid Mercury", hex: "#d1d5db", emissive: "#f3f4f6" },
      { name: "Obsidian Onyx", hex: "#111827", emissive: "#374151" },
      { name: "Crimson Blaze", hex: "#e11d48", emissive: "#f43f5e" }
    ],
    materials: [
      { id: "standard", name: "Matte Nanotech Paint", priceMod: 0, desc: "Self-healing ceramic matte finish" },
      { id: "metal", name: "Polished Chrome", priceMod: 15000, desc: "Mirror chrome metallic glaze (+₹15,000)" },
      { id: "glass", name: "Electrochromic Glass Canopy", priceMod: 25000, desc: "Electronically tintable smart glass (+₹25,000)" },
      { id: "carbon", name: "Exposed Twill Carbon", priceMod: 40000, desc: "Raw woven aerospace carbon bodywork (+₹40,000)" }
    ],
    sizes: [
      { id: "medium", name: "Standard 2-Seater", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Grand Tourer 2+2", priceMod: 50000, scale: 1.1 }
    ],
    hotspots: [
      {
        id: "cockpit",
        label: "AI Cockpit",
        title: "Panoramic Neural HUD",
        description: "AR windshield navigation overlays road hazards, trajectories, and points of interest in real-time 3D.",
        pos: [0, 0.4, -0.1]
      },
      {
        id: "headlights",
        label: "Cyber Laser",
        title: "Matrix Laser Luminescence",
        description: "Adaptive digital beam illuminates up to 600m without blinding oncoming traffic.",
        pos: [0.6, 0.05, 1.4]
      },
      {
        id: "wheels",
        label: "Flux Wheels",
        title: "Active Magnetic In-Wheel Motors",
        description: "Vector-thrust electric motors provide independent torque vectoring at all four corners.",
        pos: [0.8, -0.2, 0.9]
      },
      {
        id: "spoiler",
        label: "Aero Wing",
        title: "Active Morphing Carbon Wing",
        description: "Deploys automatically at high speeds to generate over 350kg of stabilizing downforce.",
        pos: [0, 0.35, -1.3]
      }
    ]
  },
  {
    id: "visionpods",
    name: "VisionPods",
    category: "Audio",
    price: 3499,
    oldPrice: 5499,
    discount: "36% OFF",
    rating: 4.7,
    reviews: 620,
    badge: "Popular",
    featured: true,
    trending: true,
    newArrival: false,
    modelType: "headphones",
    shortDesc: "Spatial audio studio headphones with graphene drivers and 48dB active noise cancellation.",
    description: "Immerse yourself in acoustic perfection. VisionPods combine beryllium-coated graphene drivers with real-time head-tracking spatial audio to place you in the center of a 3D soundstage.",
    specifications: {
      "Drivers": "40mm Beryllium & Graphene Composite",
      "Noise Cancellation": "Hybrid ANC up to -48dB with Adaptive Transparency",
      "Battery Life": "42 Hours continuous playback (ANC On)",
      "Codecs Supported": "LDAC, LHDC 5.0, AAC, aptX Lossless, Spatial-3D"
    },
    colors: [
      { name: "Cosmic Pearl", hex: "#e0e7ff", emissive: "#c7d2fe" },
      { name: "Matte Shadow", hex: "#18181b", emissive: "#3f3f46" },
      { name: "Neon Cyber", hex: "#06b6d4", emissive: "#22d3ee" },
      { name: "Rose Quartz", hex: "#f43f5e", emissive: "#fb7185" }
    ],
    materials: [
      { id: "standard", name: "Polymer & Memory Foam", priceMod: 0, desc: "Plush vegan protein leather cushions" },
      { id: "metal", name: "Anodized Aluminum", priceMod: 400, desc: "Precision CNC milled aluminum earcups (+₹400)" },
      { id: "carbon", name: "Carbon Fiber Band", priceMod: 600, desc: "Flexible ultralight carbon reinforced headband (+₹600)" }
    ],
    sizes: [
      { id: "medium", name: "Standard Fit", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Over-Ear Studio Pro", priceMod: 200, scale: 1.1 }
    ],
    hotspots: [
      {
        id: "cushions",
        label: "Acoustic Cushions",
        title: "Memory Foam Seal",
        description: "Zero-pressure ergonomic foam ensures acoustic isolation.",
        pos: [0.7, 0, 0]
      },
      {
        id: "touch",
        label: "Touch Controls",
        title: "Capacitive Gesture Surface",
        description: "Swipe to change track, tap to toggle ANC.",
        pos: [-0.7, 0, 0.2]
      }
    ]
  },
  {
    id: "visionphone-x",
    name: "VisionPhone X",
    category: "Smartphones",
    price: 49999,
    oldPrice: 59999,
    discount: "17% OFF",
    rating: 4.9,
    reviews: 780,
    badge: "Top Seller",
    featured: true,
    trending: true,
    newArrival: false,
    modelType: "smartphone",
    shortDesc: "Bezel-less holographic smartphone with liquid-metal frame and 200MP periscope array.",
    description: "The next evolution in personal computing. VisionPhone X features a borderless 6.8\" Quad-Curved Quantum OLED display, powered by the 3nm Neural Core V3.",
    specifications: {
      "Display": "6.8\" 2K Quantum OLED 144Hz LTPO 4.0",
      "Processor": "Neural Core V3 (3nm Octa-Core AI Engine)",
      "Rear Cameras": "200MP Main + 50MP Ultra-Wide + 50MP 10x Periscope",
      "Battery & Charge": "5200mAh Silicon-Carbon Battery, 120W Wired + 50W Wireless"
    },
    colors: [
      { name: "Prism Silver", hex: "#e2e8f0", emissive: "#cbd5e1" },
      { name: "Nebula Purple", hex: "#7c3aed", emissive: "#a78bfa" },
      { name: "Cyber Cyan", hex: "#06b6d4", emissive: "#67e8f9" },
      { name: "Matte Black", hex: "#0f172a", emissive: "#334155" }
    ],
    materials: [
      { id: "standard", name: "Satin AG Glass", priceMod: 0, desc: "Anti-fingerprint frosted glass back" },
      { id: "metal", name: "Polished Titanium", priceMod: 2000, desc: "Grade 5 polished titanium side rails (+₹2,000)" },
      { id: "carbon", name: "Aramid Fiber", priceMod: 2500, desc: "Bulletproof aramid fiber rear plate (+₹2,500)" }
    ],
    sizes: [
      { id: "medium", name: "256GB / 12GB RAM", priceMod: 0, scale: 1.0 },
      { id: "large", name: "512GB / 16GB RAM", priceMod: 5000, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "camera",
        label: "200MP Matrix",
        title: "Periscope Multi-Cam Array",
        description: "1-inch sensor size with variable physical aperture.",
        pos: [0.3, 0.6, -0.1]
      }
    ]
  },
  {
    id: "visionlaptop-pro",
    name: "VisionLaptop Pro",
    category: "Computing",
    price: 79999,
    oldPrice: 94999,
    discount: "16% OFF",
    rating: 4.8,
    reviews: 410,
    badge: "Pro Choice",
    featured: true,
    trending: false,
    newArrival: true,
    modelType: "laptop",
    shortDesc: "16-inch dual-screen workstation laptop with quantum vapor cooling and haptic glass deck.",
    description: "Engineered for 3D creators, developers, and power users. VisionLaptop Pro features a stunning 16-inch 4K OLED HDR master display paired with mechanical low-profile keyboard.",
    specifications: {
      "Display": "16.0\" 4K (3840x2400) OLED 165Hz 100% DCI-P3",
      "CPU/GPU": "Quantum X12 Max (16-Core CPU + 40-Core Neural GPU)",
      "Memory & Storage": "32GB Unified LPDDR5X + 1TB Gen5 NVMe SSD",
      "Cooling": "Dual MagLev Fans + Liquid Gallium Vapor Chamber"
    },
    colors: [
      { name: "Space Silver", hex: "#cbd5e1", emissive: "#94a3b8" },
      { name: "Quantum Grey", hex: "#475569", emissive: "#334155" },
      { name: "Midnight Blue", hex: "#1e1b4b", emissive: "#312e81" }
    ],
    materials: [
      { id: "standard", name: "Anodized Aluminum", priceMod: 0, desc: "Precision milled unibody chassis" },
      { id: "metal", name: "Magnesium-Lithium", priceMod: 3500, desc: "Ultralight aerospace alloy deck (+₹3,500)" },
      { id: "carbon", name: "Carbon Fiber Deck", priceMod: 5000, desc: "Cool-to-touch forged carbon palm rest (+₹5,000)" }
    ],
    sizes: [
      { id: "medium", name: "14-inch Studio", priceMod: 0, scale: 0.9 },
      { id: "large", name: "16-inch Master Pro", priceMod: 8000, scale: 1.05 }
    ],
    hotspots: [
      {
        id: "screen",
        label: "4K OLED",
        title: "165Hz Cinema Master Display",
        description: "Calibrated 100% DCI-P3 cinema grade colors.",
        pos: [0, 0.6, -0.6]
      }
    ]
  },
  {
    id: "smart-home-hub",
    name: "Smart Home Hub",
    category: "Smart Home",
    price: 5999,
    oldPrice: 8499,
    discount: "29% OFF",
    rating: 4.6,
    reviews: 190,
    badge: "Smart Life",
    featured: false,
    trending: true,
    newArrival: false,
    modelType: "home_hub",
    shortDesc: "360° LiDAR ambient smart home orchestrator with levitating holographic aura ring.",
    description: "The central intelligence of your futuristic habitat. Connects with Matter, Zigbee, Thread, and WiFi devices with localized privacy-first edge AI.",
    specifications: {
      "Protocols": "Matter, Thread, Zigbee 3.0, Z-Wave, WiFi 6, Bluetooth Mesh",
      "Display": "Rotational 3D Hologram Prism Projector",
      "Sensors": "Sub-millimeter LiDAR Presence Sensor, Temp/Humidity, Air Quality"
    },
    colors: [
      { name: "Glacier White", hex: "#f8fafc", emissive: "#e2e8f0" },
      { name: "Cyber Smoke", hex: "#334155", emissive: "#475569" },
      { name: "Neon Emerald", hex: "#10b981", emissive: "#34d399" }
    ],
    materials: [
      { id: "standard", name: "Acoustic Fabric & Polymer", priceMod: 0, desc: "Modern home decor woven cloth" },
      { id: "glass", name: "Smoked Glass Base", priceMod: 500, desc: "Weighted crystal base (+₹500)" }
    ],
    sizes: [
      { id: "medium", name: "Standard Hub", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Hub Pro with 360° Speaker", priceMod: 1500, scale: 1.2 }
    ],
    hotspots: [
      {
        id: "lidar",
        label: "360° LiDAR",
        title: "Continuous Presence Scanner",
        description: "Detects human presence without privacy cameras.",
        pos: [0, 0.45, 0]
      }
    ]
  },
  {
    id: "vision-glasses",
    name: "Vision Glasses",
    category: "Wearables",
    price: 12999,
    oldPrice: 17999,
    discount: "28% OFF",
    rating: 4.7,
    reviews: 230,
    badge: "AR Pioneer",
    featured: true,
    trending: true,
    newArrival: true,
    modelType: "smart_glasses",
    shortDesc: "Ultralight augmented reality glasses with micro-OLED waveguides and bone conduction.",
    description: "Step directly into spatial computing. Weighing only 68 grams, Vision Glasses project a floating 120\" virtual display into your field of view.",
    specifications: {
      "Optics": "Dual Micro-OLED Waveguide with 1080p Per Eye Resolution",
      "Field of View": "50° Diagonal Spatial Projection",
      "Audio": "Directional Open-Ear Acoustic Wave Transducers"
    },
    colors: [
      { name: "Onyx Black", hex: "#0f172a", emissive: "#1e293b" },
      { name: "Cyber Violet", hex: "#8b5cf6", emissive: "#a78bfa" },
      { name: "Crystal Clear", hex: "#e2e8f0", emissive: "#ffffff" }
    ],
    materials: [
      { id: "standard", name: "TR90 Memory Polymer", priceMod: 0, desc: "Flexible lightweight frame" },
      { id: "metal", name: "Beta-Titanium Temples", priceMod: 1200, desc: "Ultra-thin flexible titanium arms (+₹1,200)" }
    ],
    sizes: [
      { id: "medium", name: "Regular (142mm)", priceMod: 0, scale: 1.0 }
    ],
    hotspots: [
      {
        id: "lenses",
        label: "Waveguide Lenses",
        title: "Diffractive AR Waveguides",
        description: "Projects crisp digital pixels into your line of sight.",
        pos: [0.3, 0.1, 0.4]
      }
    ]
  },
  {
    id: "smart-ring",
    name: "Smart Ring",
    category: "Wearables",
    price: 4499,
    oldPrice: 6999,
    discount: "36% OFF",
    rating: 4.5,
    reviews: 175,
    badge: "Minimalist",
    featured: false,
    trending: false,
    newArrival: true,
    modelType: "smart_ring",
    shortDesc: "Sleek titanium smart ring tracking sleep, HRV, body temperature, and NFC gestures.",
    description: "Invisible tech that never sleeps. The Smart Ring wraps bio-impedance sensors and continuous infrared temperature telemetry into a featherweight titanium band.",
    specifications: {
      "Materials": "Medical-Grade Titanium + Resin Inner",
      "Battery": "7 Days continuous tracking, Magnetic dock 30-min charge",
      "Sensors": "Red & Green PPG, Infrared Skin Thermometer, 3D Accelerometer"
    },
    colors: [
      { name: "Cyber Silver", hex: "#e2e8f0", emissive: "#94a3b8" },
      { name: "Stealth Slate", hex: "#1e293b", emissive: "#0f172a" },
      { name: "Champagne Gold", hex: "#fbbf24", emissive: "#d97706" }
    ],
    materials: [
      { id: "standard", name: "Ceramic Coating", priceMod: 0, desc: "Smooth scratch-resistant gloss" },
      { id: "metal", name: "Solid Titanium Grade 5", priceMod: 600, desc: "Brushed aerospace metal (+₹600)" }
    ],
    sizes: [
      { id: "small", name: "US Size 7", priceMod: 0, scale: 0.9 },
      { id: "medium", name: "US Size 9", priceMod: 0, scale: 1.0 },
      { id: "large", name: "US Size 11", priceMod: 0, scale: 1.1 }
    ],
    hotspots: [
      {
        id: "sensors",
        label: "Bio-Array",
        title: "Inner Ring Micro-Sensors",
        description: "Direct contact with digital arteries for heart rate variability.",
        pos: [0, -0.3, 0]
      }
    ]
  },
  {
    id: "smart-speaker",
    name: "Smart Speaker",
    category: "Audio",
    price: 6999,
    oldPrice: 9999,
    discount: "30% OFF",
    rating: 4.8,
    reviews: 305,
    badge: "Room Filler",
    featured: false,
    trending: true,
    newArrival: false,
    modelType: "smart_speaker",
    shortDesc: "Cylindrical high-fidelity acoustic tower with 360° soundstage and interactive neon LED ring.",
    description: "Fill any room with breathtaking, distortion-free sound. The Smart Speaker pairs a downward-firing neodymium subwoofer with twin radiators.",
    specifications: {
      "Acoustic Output": "65W RMS Peak Dynamic Audio (35Hz - 22kHz)",
      "Configuration": "1x 3.5\" Woofer + 2x 1\" Dome Tweeters + Dual Radiators",
      "Lighting": "32-Zone Programmable RGB Aura Ring Top Panel"
    },
    colors: [
      { name: "Space Grey", hex: "#334155", emissive: "#475569" },
      { name: "Pure Arctic", hex: "#f8fafc", emissive: "#e2e8f0" },
      { name: "Cyberpunk Glow", hex: "#7c3aed", emissive: "#a855f7" }
    ],
    materials: [
      { id: "standard", name: "Acoustic Knit Fabric", priceMod: 0, desc: "Dense woven sound-transparent textile" },
      { id: "metal", name: "Anodized Aluminum Grill", priceMod: 700, desc: "Perforated metallic chassis (+₹700)" }
    ],
    sizes: [
      { id: "medium", name: "Studio Compact", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Max Tower 90W", priceMod: 2000, scale: 1.25 }
    ],
    hotspots: [
      {
        id: "top-ring",
        label: "Neon Halo",
        title: "32-Zone Interactive LED Ring",
        description: "Visual volume feedback and music spectrum visualizer.",
        pos: [0, 0.8, 0]
      }
    ]
  },
  {
    id: "vision-camera",
    name: "Vision Camera",
    category: "Optics",
    price: 24999,
    oldPrice: 29999,
    discount: "17% OFF",
    rating: 4.9,
    reviews: 140,
    badge: "8K Cinema",
    featured: false,
    trending: false,
    newArrival: true,
    modelType: "vision_camera",
    shortDesc: "Compact mirrorless cinema camera with 8K 60fps raw recording and AI subject tracking.",
    description: "A pocket powerhouse for visionary filmmakers. Equipped with a full-frame 8K sensor and active sensor-shift 5-axis stabilization.",
    specifications: {
      "Sensor": "45MP Full-Frame Back-Illuminated CMOS (16-Stop DR)",
      "Video Formats": "8K RAW 60p, 4K 120p Uncropped 10-bit 4:2:2",
      "Stabilization": "8.5-Stop In-Body 5-Axis Sensor Shift OIS"
    },
    colors: [
      { name: "Matte Charcoal", hex: "#1f2937", emissive: "#374151" },
      { name: "Vintage Chrome", hex: "#e5e7eb", emissive: "#9ca3af" }
    ],
    materials: [
      { id: "standard", name: "Magnesium Alloy & Grip", priceMod: 0, desc: "Weatherproof rugged textured body" },
      { id: "metal", name: "Machined Brass Top", priceMod: 1500, desc: "Classic brass accents (+₹1,500)" }
    ],
    sizes: [
      { id: "medium", name: "Body Only", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Creator Kit (+ 24-70mm Lens)", priceMod: 12000, scale: 1.15 }
    ],
    hotspots: [
      {
        id: "lens",
        label: "Cinema Optics",
        title: "Fluorite Multi-Coated Lens",
        description: "Zero chromatic aberration and silky smooth circular bokeh.",
        pos: [0, 0, 0.7]
      }
    ]
  },
  {
    id: "future-drone",
    name: "Future Drone",
    category: "Drones",
    price: 34999,
    oldPrice: 42999,
    discount: "19% OFF",
    rating: 4.9,
    reviews: 210,
    badge: "Autonomous",
    featured: true,
    trending: true,
    newArrival: false,
    modelType: "future_drone",
    shortDesc: "Foldable autonomous quadcopter with 4K HDR 3-axis gimbal and omnidirectional LiDAR radar.",
    description: "Reclaim the skies with autonomous cinematic mastery. The Future Drone features whisper-quiet carbon composite propellers and collision avoidance radar.",
    specifications: {
      "Flight Time": "48 Minutes per smart battery pack",
      "Transmission Range": "20 km Ultra-Link HD Video Stream",
      "Camera": "4/3\" Hasselblad 5.1K 50fps / 4K 120fps HDR"
    },
    colors: [
      { name: "Stealth Grey", hex: "#334155", emissive: "#475569" },
      { name: "Signal Cyber-Orange", hex: "#ea580c", emissive: "#f97316" },
      { name: "Ghost White", hex: "#f1f5f9", emissive: "#cbd5e1" },
      { name: "Neon Cyber Blue", hex: "#0284c7", emissive: "#38bdf8" }
    ],
    materials: [
      { id: "standard", name: "High-Impact Polymer", priceMod: 0, desc: "Flexible aerodynamic shell" },
      { id: "carbon", name: "Forged Carbon Propeller Arms", priceMod: 1800, desc: "Rigid carbon arms (+₹1,800)" }
    ],
    sizes: [
      { id: "medium", name: "Fly More Combo", priceMod: 0, scale: 1.0 },
      { id: "large", name: "Cinema Pro (+ Smart Controller)", priceMod: 8500, scale: 1.1 }
    ],
    hotspots: [
      {
        id: "gimbal",
        label: "3-Axis Gimbal",
        title: "Active Mechanical Stabilizer",
        description: "Keeps 4K video buttery smooth even at high speeds.",
        pos: [0, -0.25, 0.45]
      }
    ]
  }
];

// Product Category List
const PRODUCT_CATEGORIES = [
  "All",
  "Accessories",
  "Gaming",
  "Wearables",
  "Vehicles",
  "Audio",
  "Smartphones",
  "Computing",
  "Smart Home",
  "Optics",
  "Drones"
];

// Helper Functions
function getProductById(id) {
  if (!id) return null;
  const cleanId = String(id).trim().toLowerCase();
  return PRODUCTS_DATABASE.find(p => p.id.toLowerCase() === cleanId) || null;
}

function getProductsByCategory(category) {
  if (!category || category === "All") return PRODUCTS_DATABASE;
  return PRODUCTS_DATABASE.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

function getFeaturedProducts() {
  return PRODUCTS_DATABASE.filter(p => p.featured);
}

function getTrendingProducts() {
  return PRODUCTS_DATABASE.filter(p => p.trending);
}

function getNewArrivals() {
  return PRODUCTS_DATABASE.filter(p => p.newArrival);
}

function formatPriceINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Generate dynamic 3D Hologram SVG preview for cards
function generateProductSVG(product, width = 300, height = 300) {
  const primaryColor = product.colors && product.colors[0] ? product.colors[0].hex : "#8a2be2";
  const glowColor = product.colors && product.colors[1] ? product.colors[1].hex : "#00f0ff";
  
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" class="product-preview-svg">
    <defs>
      <linearGradient id="grad-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="${glowColor}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0.9"/>
      </linearGradient>
      <filter id="glow-${product.id}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="${width}" height="${height}" rx="16" fill="#080c18"/>
    <circle cx="${width/2}" cy="${height/2}" r="${width*0.35}" fill="url(#grad-${product.id})" opacity="0.35" filter="url(#glow-${product.id})"/>
    <circle cx="${width/2}" cy="${height/2}" r="${width*0.28}" fill="none" stroke="${glowColor}" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.6"/>
    
    <!-- 3D Geometric Wireframe Icon -->
    <g transform="translate(${width/2}, ${height/2}) scale(${width/300})">
      <polygon points="0,-45 40,-20 40,30 0,55 -40,30 -40,-20" fill="none" stroke="${primaryColor}" stroke-width="2.5" />
      <polyline points="-40,-20 0,5 40,-20" fill="none" stroke="${glowColor}" stroke-width="1.8" />
      <line x1="0" y1="5" x2="0" y2="55" stroke="${glowColor}" stroke-width="1.8" />
      
      <ellipse cx="0" cy="0" rx="60" ry="22" fill="none" stroke="${glowColor}" stroke-width="1" stroke-opacity="0.7" stroke-dasharray="6,4"/>
      <circle cx="0" cy="0" r="12" fill="${primaryColor}" opacity="0.8" filter="url(#glow-${product.id})"/>
      <circle cx="0" cy="0" r="5" fill="#ffffff"/>
    </g>
    
    <text x="${width/2}" y="${height - 20}" text-anchor="middle" fill="#00f0ff" font-family="monospace" font-size="11" font-weight="700" letter-spacing="2">
      [ 3D SPATIAL MODEL ]
    </text>
  </svg>`;
}

// Export globally
if (typeof window !== 'undefined') {
  window.PRODUCTS_DATABASE = PRODUCTS_DATABASE;
  window.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
  window.getProductById = getProductById;
  window.getProductsByCategory = getProductsByCategory;
  window.getFeaturedProducts = getFeaturedProducts;
  window.getTrendingProducts = getTrendingProducts;
  window.getNewArrivals = getNewArrivals;
  window.formatPriceINR = formatPriceINR;
  window.generateProductSVG = generateProductSVG;
}

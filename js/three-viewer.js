/**
 * VisionVerse 3D Engine & Procedural Models
 * Built with Three.js (r128 compatible)
 * Massive 3D Features: 20+ Procedural Models, Floating Sparks Particles,
 * Studio Light Environments, 3D Explode/Disassembly View, and Hotspots.
 */

// Global 3D Viewer Controller
class VisionThreeViewer {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.options = Object.assign({
      autoRotate: true,
      autoRotateSpeed: 1.2,
      enableZoom: true,
      enablePan: false,
      cameraFov: 45,
      cameraZ: 4.5,
      showGrid: true,
      enableHotspots: true,
      isExhibition: false,
      interactive: true,
      enableParticles: true
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.currentModelGroup = null;
    this.activeHotspots = [];
    this.hotspotElements = [];
    this.animationFrameId = null;
    this.clock = new THREE.Clock();
    this.isDisposed = false;
    this.wireframeMode = false;
    this.isExploded = false;
    this.studioLights = [];
    this.particleField = null;

    // Customization state
    this.customState = {
      colorHex: "#8a2be2",
      materialType: "standard",
      sizeScale: 1.0,
      customDesign: "none",
      lightEnv: "cyber_neon"
    };

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060814, 0.045);

    // 2. Camera
    const aspect = (this.container.clientWidth || 600) / (this.container.clientHeight || 450);
    this.camera = new THREE.PerspectiveCamera(this.options.cameraFov, aspect, 0.1, 100);
    this.camera.position.set(0, 1.2, this.options.cameraZ);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.container.clientWidth || 600, this.container.clientHeight || 450);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Append canvas
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.borderRadius = "inherit";

    // 4. Lighting Rig
    this.setupLighting("cyber_neon");

    // 5. Environment Floor Grid & Floating Sparks
    this.setupEnvironment();

    // 6. OrbitControls
    this.setupControls();

    // 7. Event Listeners
    this.handleResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this.handleResize);

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  setupLighting(env = "cyber_neon") {
    // Clear existing lights
    this.studioLights.forEach(l => this.scene.remove(l));
    this.studioLights = [];

    let keyColor = 0x00f0ff;
    let rimColor = 0xa855f7;
    let ambientIntensity = 0.9;

    switch (env) {
      case "studio_white":
        keyColor = 0xffffff;
        rimColor = 0xe2e8f0;
        ambientIntensity = 1.2;
        break;
      case "sunset_amber":
        keyColor = 0xf97316;
        rimColor = 0xfbbf24;
        ambientIntensity = 0.85;
        break;
      case "matrix_emerald":
        keyColor = 0x10b981;
        rimColor = 0x06b6d4;
        ambientIntensity = 0.9;
        break;
      case "cyber_neon":
      default:
        keyColor = 0x00f0ff;
        rimColor = 0xa855f7;
        ambientIntensity = 0.9;
        break;
    }

    // Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    this.scene.add(ambientLight);
    this.studioLights.push(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(keyColor, 2.4);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    this.scene.add(keyLight);
    this.studioLights.push(keyLight);

    // Rim Light
    const rimLight = new THREE.DirectionalLight(rimColor, 2.8);
    rimLight.position.set(-6, 5, -5);
    this.scene.add(rimLight);
    this.studioLights.push(rimLight);

    // Top Down Spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 2.5);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    this.scene.add(spotLight);
    this.studioLights.push(spotLight);

    // Bottom Underglow
    const underLight = new THREE.PointLight(keyColor, 1.4, 10);
    underLight.position.set(0, -2, 0);
    this.scene.add(underLight);
    this.studioLights.push(underLight);
  }

  setLightEnvironment(envName) {
    this.customState.lightEnv = envName;
    this.setupLighting(envName);
  }

  setupEnvironment() {
    // 1. Holographic Floor Plane
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x060916,
      roughness: 0.18,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.4;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Animated Circular Neon Rings on Floor
    const ringGeo = new THREE.RingGeometry(1.8, 1.84, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -1.39;
    this.scene.add(floorRing);

    const outerRingGeo = new THREE.RingGeometry(2.5, 2.52, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const floorOuterRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    floorOuterRing.rotation.x = -Math.PI / 2;
    floorOuterRing.position.y = -1.39;
    this.scene.add(floorOuterRing);

    // 3. Floating 3D Cyber Sparks / Dust Particles inside Viewport
    if (this.options.enableParticles) {
      const particleCount = 160;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 8;
        pPos[i + 1] = Math.random() * 4 - 1.2;
        pPos[i + 2] = (Math.random() - 0.5) * 8;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.04,
        transparent: true,
        opacity: 0.65
      });
      this.particleField = new THREE.Points(pGeo, pMat);
      this.scene.add(this.particleField);
    }
  }

  setupControls() {
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = this.options.autoRotateSpeed;
      this.controls.enableZoom = this.options.enableZoom;
      this.controls.enablePan = this.options.enablePan;
      this.controls.minDistance = 1.2;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.15;
    } else {
      this.setupFallbackMouseControls();
    }
  }

  setupFallbackMouseControls() {
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointerup', () => { isDragging = false; });

    dom.addEventListener('pointermove', (e) => {
      if (!isDragging || !this.currentModelGroup) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      this.currentModelGroup.rotation.y += dx * 0.008;
      this.currentModelGroup.rotation.x += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    dom.addEventListener('wheel', (e) => {
      if (!this.options.enableZoom) return;
      e.preventDefault();
      this.camera.position.z = Math.max(1.5, Math.min(8, this.camera.position.z + e.deltaY * 0.003));
    }, { passive: false });
  }

  onWindowResize() {
    if (!this.container || this.isDisposed) return;
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  loadProductModel(product) {
    if (!product) return;

    // Clear previous model
    if (this.currentModelGroup) {
      this.scene.remove(this.currentModelGroup);
      this.disposeObject(this.currentModelGroup);
      this.currentModelGroup = null;
    }

    // Clear previous hotspots
    this.clearHotspots();

    // Create Procedural 3D Model
    const modelType = product.modelType || "smartwatch";
    const initialColor = product.colors && product.colors[0] ? product.colors[0].hex : "#8a2be2";
    
    this.customState.colorHex = initialColor;
    this.customState.materialType = "standard";
    this.customState.sizeScale = 1.0;
    this.isExploded = false;

    const group = VisionModelFactory.createModel(modelType, {
      color: initialColor,
      material: "standard"
    });

    this.currentModelGroup = group;
    this.currentModelGroup.position.set(0, 0, 0);
    this.scene.add(this.currentModelGroup);

    // Setup Hotspots if provided
    if (this.options.enableHotspots && product.hotspots && product.hotspots.length > 0) {
      this.setupHotspots(product.hotspots);
    }

    this.resetCamera();
  }

  /* Hotspot System */
  setupHotspots(hotspotsData) {
    this.activeHotspots = hotspotsData;
    
    let markerLayer = this.container.querySelector('.hotspot-layer');
    if (!markerLayer) {
      markerLayer = document.createElement('div');
      markerLayer.className = 'hotspot-layer';
      this.container.appendChild(markerLayer);
    }
    markerLayer.innerHTML = "";
    this.hotspotElements = [];

    hotspotsData.forEach((spot) => {
      const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(spot.pos[0], spot.pos[1], spot.pos[2]);
      
      const pulseGeo = new THREE.RingGeometry(0.05, 0.08, 24);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(pinMesh.position);
      pulseMesh.lookAt(this.camera.position);

      this.currentModelGroup.add(pinMesh);
      this.currentModelGroup.add(pulseMesh);

      const el = document.createElement('div');
      el.className = 'hotspot-marker';
      el.dataset.id = spot.id;
      el.innerHTML = `
        <div class="hotspot-pulse"></div>
        <div class="hotspot-dot">+</div>
        <div class="hotspot-card">
          <div class="hotspot-header">
            <span class="hotspot-tag">${spot.label}</span>
            <span class="hotspot-title">${spot.title}</span>
          </div>
          <p class="hotspot-desc">${spot.description}</p>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.focusHotspot(spot, el);
      });

      markerLayer.appendChild(el);
      this.hotspotElements.push({ el, spot, mesh: pinMesh, pulseMesh });
    });
  }

  focusHotspot(spot, el) {
    this.hotspotElements.forEach(item => item.el.classList.remove('active'));
    el.classList.add('active');

    const event = new CustomEvent('visionverse-hotspot-click', { detail: spot });
    window.dispatchEvent(event);
  }

  updateHotspotPositions() {
    if (!this.hotspotElements || this.hotspotElements.length === 0 || !this.currentModelGroup) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const tempV = new THREE.Vector3();

    this.hotspotElements.forEach(item => {
      item.mesh.getWorldPosition(tempV);

      if (item.pulseMesh) {
        item.pulseMesh.lookAt(this.camera.position);
      }

      const dot = tempV.clone().sub(this.camera.position).dot(this.camera.getWorldDirection(new THREE.Vector3()));
      if (dot < 0) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        return;
      }

      tempV.project(this.camera);

      const x = (tempV.x * widthHalf) + widthHalf;
      const y = -(tempV.y * heightHalf) + heightHalf;

      item.el.style.left = `${x}px`;
      item.el.style.top = `${y}px`;
      item.el.style.opacity = '1';
      item.el.style.pointerEvents = 'auto';
    });
  }

  clearHotspots() {
    const markerLayer = this.container.querySelector('.hotspot-layer');
    if (markerLayer) markerLayer.innerHTML = "";
    this.hotspotElements = [];
    this.activeHotspots = [];
  }

  /* Live Customizer Modifiers */
  updateCustomization(colorHex, materialType, sizeScale, customDesign) {
    if (colorHex) this.customState.colorHex = colorHex;
    if (materialType) this.customState.materialType = materialType;
    if (sizeScale !== undefined) this.customState.sizeScale = sizeScale;
    if (customDesign) this.customState.customDesign = customDesign;

    if (!this.currentModelGroup) return;

    this.currentModelGroup.scale.set(
      this.customState.sizeScale,
      this.customState.sizeScale,
      this.customState.sizeScale
    );

    this.currentModelGroup.traverse((child) => {
      if (child.isMesh && child.userData && child.userData.customizable) {
        VisionModelFactory.applyMaterial(
          child,
          this.customState.colorHex,
          this.customState.materialType,
          this.customState.customDesign
        );
      }
    });
  }

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    if (!this.currentModelGroup) return;
    this.currentModelGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = this.wireframeMode;
      }
    });
    return this.wireframeMode;
  }

  toggleExplodeView() {
    this.isExploded = !this.isExploded;
    if (!this.currentModelGroup) return this.isExploded;

    const factor = this.isExploded ? 1.8 : 1.0;
    this.currentModelGroup.traverse((child) => {
      if (child.isMesh && child.userData && child.userData.origPos) {
        const orig = child.userData.origPos;
        child.position.set(orig.x * factor, orig.y * factor, orig.z * factor);
      }
    });
    return this.isExploded;
  }

  setCameraPreset(angle) {
    if (!this.camera) return;
    switch (angle) {
      case "front":
        this.camera.position.set(0, 0, this.options.cameraZ);
        break;
      case "top":
        this.camera.position.set(0, this.options.cameraZ, 0.1);
        break;
      case "isometric":
        this.camera.position.set(3, 3, 3);
        break;
      case "close":
        this.camera.position.set(0, 0.5, 2.2);
        break;
      default:
        this.resetCamera();
        break;
    }
    if (this.controls) this.controls.target.set(0, 0, 0);
  }

  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate;
      return this.controls.autoRotate;
    }
    return false;
  }

  resetCamera() {
    if (this.controls) {
      this.controls.reset();
    }
    this.camera.position.set(0, 1.2, this.options.cameraZ);
    if (this.currentModelGroup) {
      this.currentModelGroup.rotation.set(0, 0, 0);
    }
  }

  animate() {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    if (this.controls) {
      this.controls.update();
    } else if (this.options.autoRotate && this.currentModelGroup) {
      this.currentModelGroup.rotation.y += 0.008;
    }

    // Dynamic procedural animations
    if (this.currentModelGroup && this.currentModelGroup.userData.onUpdate) {
      this.currentModelGroup.userData.onUpdate(elapsed, delta);
    }

    // Slowly rotate floating spark particle field
    if (this.particleField) {
      this.particleField.rotation.y = elapsed * 0.05;
    }

    // Pulse Hotspot Rings
    this.hotspotElements.forEach((item, idx) => {
      if (item.pulseMesh) {
        const s = 1 + 0.25 * Math.sin(elapsed * 4 + idx);
        item.pulseMesh.scale.set(s, s, s);
      }
    });

    if (this.options.enableHotspots) {
      this.updateHotspotPositions();
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("resize", this.handleResize);
    if (this.controls && this.controls.dispose) {
      this.controls.dispose();
    }
    if (this.currentModelGroup) {
      this.disposeObject(this.currentModelGroup);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  disposeObject(obj) {
    obj.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}


/* =========================================================================
   Procedural 3D Model Factory for All Products
   ========================================================================= */
const VisionModelFactory = {

  applyMaterial(mesh, colorHex, materialType) {
    const col = new THREE.Color(colorHex);
    let roughness = 0.35;
    let metalness = 0.2;

    switch (materialType) {
      case "metal":
        roughness = 0.18;
        metalness = 0.95;
        break;
      case "glass":
        roughness = 0.05;
        metalness = 0.1;
        mesh.material.transparent = true;
        mesh.material.opacity = 0.65;
        break;
      case "carbon":
        roughness = 0.45;
        metalness = 0.3;
        col.lerp(new THREE.Color(0x1a1a24), 0.5);
        break;
      default:
        roughness = 0.35;
        metalness = 0.25;
        break;
    }

    mesh.material.color = col;
    mesh.material.roughness = roughness;
    mesh.material.metalness = metalness;
    mesh.material.needsUpdate = true;
  },

  createModel(type, config = {}) {
    const group = new THREE.Group();
    const primaryColor = config.color || "#8a2be2";
    const materialType = config.material || "standard";

    switch (type) {
      // Affordable Micro-Tech & Accessories
      case "smart_tag":
        this.buildSmartTag(group, primaryColor, materialType);
        break;
      case "lens_guard":
        this.buildLensGuard(group, primaryColor, materialType);
        break;
      case "cyber_beacon":
        this.buildCyberBeacon(group, primaryColor, materialType);
        break;
      case "ear_tips":
        this.buildEarTips(group, primaryColor, materialType);
        break;
      case "braided_cable":
        this.buildBraidedCable(group, primaryColor, materialType);
        break;
      case "smart_stylus":
        this.buildSmartStylus(group, primaryColor, materialType);
        break;
      case "magsafe_puck":
        this.buildMagSafePuck(group, primaryColor, materialType);
        break;
      case "desk_prism":
        this.buildDeskPrism(group, primaryColor, materialType);
        break;
      case "fitness_band":
        this.buildFitnessBand(group, primaryColor, materialType);
        break;
      case "gamepad":
        this.buildGamepad(group, primaryColor, materialType);
        break;

      // Flagships
      case "smartwatch":
      case "smartwatch_pro":
        this.buildSmartwatch(group, primaryColor, materialType, type === "smartwatch_pro");
        break;
      case "cyber_car":
        this.buildCyberCar(group, primaryColor, materialType);
        break;
      case "headphones":
        this.buildHeadphones(group, primaryColor, materialType);
        break;
      case "smartphone":
        this.buildSmartphone(group, primaryColor, materialType);
        break;
      case "laptop":
        this.buildLaptop(group, primaryColor, materialType);
        break;
      case "home_hub":
        this.buildHomeHub(group, primaryColor, materialType);
        break;
      case "smart_glasses":
        this.buildSmartGlasses(group, primaryColor, materialType);
        break;
      case "smart_ring":
        this.buildSmartRing(group, primaryColor, materialType);
        break;
      case "smart_speaker":
        this.buildSmartSpeaker(group, primaryColor, materialType);
        break;
      case "vision_camera":
        this.buildVisionCamera(group, primaryColor, materialType);
        break;
      case "future_drone":
        this.buildFutureDrone(group, primaryColor, materialType);
        break;
      default:
        this.buildSmartwatch(group, primaryColor, materialType, false);
    }

    // Store original child positions for explode view
    group.traverse((c) => {
      if (c.isMesh) {
        c.userData.origPos = c.position.clone();
      }
    });

    return group;
  },

  /* 1. Cyber NFC Smart Tag (₹19) */
  buildSmartTag(group, colorHex, matType) {
    const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.8,
      roughness: 0.2
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.userData.customizable = true;
    disc.castShadow = true;
    group.add(disc);

    // Glowing Holographic Center Ring
    const ringGeo = new THREE.TorusGeometry(0.7, 0.04, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.045;
    group.add(ring);

    // NFC Micro-IC in center
    const icGeo = new THREE.BoxGeometry(0.35, 0.04, 0.35);
    const icMat = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.9 });
    const ic = new THREE.Mesh(icGeo, icMat);
    ic.position.y = 0.05;
    group.add(ic);

    group.userData.onUpdate = (time) => {
      ring.rotation.z = time * 2;
    };
  },

  /* 2. Quantum Lens Guard (₹49) */
  buildLensGuard(group, colorHex, matType) {
    const frameGeo = new THREE.BoxGeometry(1.2, 1.5, 0.12);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.9,
      roughness: 0.15
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.userData.customizable = true;
    group.add(frame);

    // 3 Sapphire Lenses
    for (let i = 0; i < 3; i++) {
      const lensGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32);
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.95,
        roughness: 0.05
      });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(0, 0.45 - i * 0.45, 0.02);
      group.add(lens);
    }
  },

  /* 3. Cyber Beacon Keyring (₹99) */
  buildCyberBeacon(group, colorHex, matType) {
    // Hexagonal crystal body
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.6, 6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.userData.customizable = true;
    group.add(body);

    // Rotating Gyro Rings
    const gyroGeo = new THREE.TorusGeometry(0.75, 0.04, 16, 48);
    const gyroMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const gyro1 = new THREE.Mesh(gyroGeo, gyroMat);
    group.add(gyro1);

    const gyro2 = new THREE.Mesh(gyroGeo, new THREE.MeshBasicMaterial({ color: 0xa855f7 }));
    gyro2.rotation.x = Math.PI / 2;
    group.add(gyro2);

    group.userData.onUpdate = (time) => {
      gyro1.rotation.x = time * 2;
      gyro1.rotation.y = time * 1.5;
      gyro2.rotation.y = -time * 2.5;
      body.position.y = Math.sin(time * 3) * 0.1;
    };
  },

  /* 4. Acoustic Memory Foam Ear Tips (₹149) */
  buildEarTips(group, colorHex, matType) {
    const tipGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const tipMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.9,
      metalness: 0.1
    });

    const leftTip = new THREE.Mesh(tipGeo, tipMat);
    leftTip.scale.set(0.9, 1.2, 0.9);
    leftTip.position.set(-0.7, 0, 0);
    leftTip.userData.customizable = true;
    group.add(leftTip);

    const rightTip = new THREE.Mesh(tipGeo, tipMat.clone());
    rightTip.scale.set(0.9, 1.2, 0.9);
    rightTip.position.set(0.7, 0, 0);
    rightTip.userData.customizable = true;
    group.add(rightTip);

    // Center Core Stems
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 24);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.8 });
    const stem1 = new THREE.Mesh(stemGeo, stemMat);
    stem1.position.set(-0.7, 0, 0);
    group.add(stem1);

    const stem2 = new THREE.Mesh(stemGeo, stemMat);
    stem2.position.set(0.7, 0, 0);
    group.add(stem2);
  },

  /* 5. Braided RGB Warp Cable (₹199) */
  buildBraidedCable(group, colorHex, matType) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, -0.6, 0),
      new THREE.Vector3(-0.6, 0.6, 0.4),
      new THREE.Vector3(0.4, -0.4, -0.2),
      new THREE.Vector3(1.2, 0.4, 0)
    ]);
    const cableGeo = new THREE.TubeGeometry(curve, 64, 0.09, 16, false);
    const cableMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: 0.6,
      metalness: 0.3
    });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.userData.customizable = true;
    group.add(cable);

    // Glowing USB-C Head
    const headGeo = new THREE.BoxGeometry(0.35, 0.16, 0.7);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(1.4, 0.45, 0);
    group.add(head);

    const tipGeo = new THREE.BoxGeometry(0.25, 0.08, 0.3);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(1.8, 0.45, 0);
    group.add(tip);
  },

  /* 6. Cyber Stylus Pen (₹299) */
  buildSmartStylus(group, colorHex, matType) {
    const bodyGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.8,
      roughness: 0.25
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.userData.customizable = true;
    body.rotation.z = Math.PI / 4;
    group.add(body);

    // Nib Cone
    const nibGeo = new THREE.ConeGeometry(0.08, 0.3, 32);
    const nibMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });
    const nib = new THREE.Mesh(nibGeo, nibMat);
    nib.rotation.z = -Math.PI / 4 * 3;
    nib.position.set(-1.0, -1.0, 0);
    group.add(nib);

    // Top LED Beacon Ring
    const ringGeo = new THREE.TorusGeometry(0.09, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.z = Math.PI / 4;
    ring.position.set(0.8, 0.8, 0);
    group.add(ring);
  },

  /* 7. MagSafe Cyber Puck (₹499) */
  buildMagSafePuck(group, colorHex, matType) {
    const puckGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.16, 48);
    const puckMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.9,
      roughness: 0.2
    });
    const puck = new THREE.Mesh(puckGeo, puckMat);
    puck.userData.customizable = true;
    puck.castShadow = true;
    group.add(puck);

    // Glowing Neon Breathing Ring
    const haloGeo = new THREE.TorusGeometry(0.85, 0.04, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.085;
    group.add(halo);

    group.userData.onUpdate = (time) => {
      const s = 1 + 0.08 * Math.sin(time * 3);
      halo.scale.set(s, s, s);
    };
  },

  /* 8. Desk Hologram Prism (₹899) */
  buildDeskPrism(group, colorHex, matType) {
    // Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.25, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.7,
      roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    base.userData.customizable = true;
    group.add(base);

    // Levitating Crystal Pyramid
    const pyrGeo = new THREE.ConeGeometry(0.85, 1.2, 4);
    const pyrMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x8a2be2,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.75,
      roughness: 0.05,
      metalness: 0.95
    });
    const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
    pyramid.position.y = 0.4;
    group.add(pyramid);

    group.userData.onUpdate = (time) => {
      pyramid.rotation.y = time * 1.5;
      pyramid.position.y = 0.4 + Math.sin(time * 2.5) * 0.08;
    };
  },

  /* 9. Cyber Fitness Band (₹999) */
  buildFitnessBand(group, colorHex, matType) {
    const strapGeo = new THREE.TorusGeometry(0.9, 0.18, 16, 64);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8
    });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    group.add(strap);

    // Slim Vertical OLED Screen Capsule
    const capGeo = new THREE.BoxGeometry(0.4, 1.4, 0.25);
    const capMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.8,
      roughness: 0.2
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0, 0.92);
    cap.userData.customizable = true;
    group.add(cap);

    const screenGeo = new THREE.PlaneGeometry(0.32, 1.2);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 1.05);
    group.add(screen);
  },

  /* 10. Vision GamePad Cyber Controller (₹1,999) */
  buildGamepad(group, colorHex, matType) {
    // Body Chassis
    const bodyGeo = new THREE.BoxGeometry(2.0, 1.1, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      metalness: 0.7,
      roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.userData.customizable = true;
    body.castShadow = true;
    group.add(body);

    // Left and Right Ergonomic Handles
    const handleGeo = new THREE.CylinderGeometry(0.3, 0.38, 1.2, 24);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });

    const leftHandle = new THREE.Mesh(handleGeo, handleMat);
    leftHandle.rotation.z = -0.4;
    leftHandle.position.set(-1.0, -0.3, 0);
    group.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, handleMat);
    rightHandle.rotation.z = 0.4;
    rightHandle.position.set(1.0, -0.3, 0);
    group.add(rightHandle);

    // Thumbsticks
    const stickGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 24);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.5 });

    const leftStick = new THREE.Mesh(stickGeo, stickMat);
    leftStick.position.set(-0.5, 0.1, 0.3);
    group.add(leftStick);

    const rightStick = new THREE.Mesh(stickGeo, stickMat);
    rightStick.position.set(0.3, -0.15, 0.3);
    group.add(rightStick);

    // Glowing Neon Action Buttons (A,B,X,Y)
    for (let i = 0; i < 4; i++) {
      const btnGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const btnMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      const angle = (i * Math.PI) / 2;
      btn.position.set(0.65 + Math.cos(angle) * 0.15, 0.2 + Math.sin(angle) * 0.15, 0.3);
      group.add(btn);
    }
  },

  /* 11. Smartwatch / Smartwatch Pro */
  buildSmartwatch(group, colorHex, matType, isPro = false) {
    const caseGeo = new THREE.BoxGeometry(1.2, 1.45, 0.35);
    const caseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: isPro ? 0.2 : 0.3,
      metalness: isPro ? 0.85 : 0.4
    });
    const caseMesh = new THREE.Mesh(caseGeo, caseMat);
    caseMesh.castShadow = true;
    caseMesh.userData.customizable = true;
    group.add(caseMesh);

    const bezelGeo = new THREE.BoxGeometry(1.25, 1.5, 0.1);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: isPro ? 0xe2e8f0 : 0x222233,
      metalness: 0.9,
      roughness: 0.15
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.z = 0.15;
    group.add(bezelMesh);

    const screenGeo = new THREE.PlaneGeometry(1.05, 1.3);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050714';
    ctx.fillRect(0, 0, 512, 640);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 90px monospace';
    ctx.fillText('10:42', 130, 200);
    ctx.fillStyle = '#8a2be2';
    ctx.font = '36px sans-serif';
    ctx.fillText('VISION OS 4.0', 135, 260);
    ctx.fillStyle = '#10b981';
    ctx.font = '40px monospace';
    ctx.fillText('♥ 74 BPM', 160, 360);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(256, 480, 70, 0, Math.PI * 1.6);
    ctx.stroke();

    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.21;
    group.add(screenMesh);

    const strapMat = new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.7, metalness: 0.1 });
    const strapTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.15), strapMat);
    strapTop.position.set(0, 1.25, -0.05);
    strapTop.rotation.x = 0.2;
    group.add(strapTop);

    const strapBot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.15), strapMat);
    strapBot.position.set(0, -1.25, -0.05);
    strapBot.rotation.x = -0.2;
    group.add(strapBot);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.9, roughness: 0.2 }));
    crown.rotation.z = Math.PI / 2;
    crown.position.set(0.68, 0.2, 0);
    group.add(crown);
  },

  /* 12. Cyber Car */
  buildCyberCar(group, colorHex, matType) {
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.5, 3.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.2;
    body.castShadow = true;
    body.userData.customizable = true;
    group.add(body);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 4), new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.85 }));
    canopy.rotation.y = Math.PI / 4;
    canopy.rotation.x = Math.PI / 2.3;
    canopy.position.set(0, 0.55, -0.2);
    canopy.scale.set(0.9, 1.4, 0.6);
    group.add(canopy);

    const lightFront = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.1), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    lightFront.position.set(0, 0.2, 1.62);
    group.add(lightFront);

    const lightRear = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0055 }));
    lightRear.position.set(0, 0.3, -1.62);
    group.add(lightRear);

    const wheelPositions = [[-0.85, 0, 0.9], [0.85, 0, 0.9], [-0.85, 0, -0.9], [0.85, 0, -0.9]];
    wheelPositions.forEach(pos => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 }));
      tire.rotation.z = Math.PI / 2;
      tire.position.set(pos[0], pos[1], pos[2]);
      group.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.32, 16), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00d2ff, emissiveIntensity: 0.5 }));
      rim.rotation.z = Math.PI / 2;
      rim.position.set(pos[0], pos[1], pos[2]);
      group.add(rim);
    });

    group.scale.set(0.9, 0.9, 0.9);
  },

  /* 13. Headphones */
  buildHeadphones(group, colorHex, matType) {
    const bandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, 0.2, 0),
      new THREE.Vector3(-0.9, 1.2, 0),
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0.9, 1.2, 0),
      new THREE.Vector3(1.1, 0.2, 0)
    ]);
    const bandMesh = new THREE.Mesh(new THREE.TubeGeometry(bandCurve, 64, 0.08, 16, false), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 }));
    group.add(bandMesh);

    const cupGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.3, 32);
    const cupMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.6, roughness: 0.25 });

    const leftCup = new THREE.Mesh(cupGeo, cupMat);
    leftCup.rotation.z = Math.PI / 2;
    leftCup.position.set(-1.15, 0, 0);
    leftCup.userData.customizable = true;
    group.add(leftCup);

    const rightCup = new THREE.Mesh(cupGeo, cupMat.clone());
    rightCup.rotation.z = Math.PI / 2;
    rightCup.position.set(1.15, 0, 0);
    rightCup.userData.customizable = true;
    group.add(rightCup);
  },

  /* 14. Smartphone */
  buildSmartphone(group, colorHex, matType) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.1), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.9, roughness: 0.15 }));
    body.userData.customizable = true;
    group.add(body);

    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 2.1), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    screenMesh.position.z = 0.052;
    group.add(screenMesh);
  },

  /* 15. Laptop */
  buildLaptop(group, colorHex, matType) {
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.7), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.85, roughness: 0.25 }));
    baseMesh.position.set(0, -0.2, 0.4);
    baseMesh.userData.customizable = true;
    group.add(baseMesh);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, -0.15, -0.45);
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.06), baseMesh.material.clone());
    lidMesh.position.set(0, 0.8, 0);
    lidMesh.userData.customizable = true;
    lidGroup.add(lidMesh);

    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 1.45), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    screenMesh.position.set(0, 0.8, 0.035);
    lidGroup.add(screenMesh);
    lidGroup.rotation.x = -0.35;
    group.add(lidGroup);
  },

  /* 16. Smart Home Hub */
  buildHomeHub(group, colorHex, matType) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.95, 0.5, 32), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.4, metalness: 0.3 }));
    base.position.y = -0.25;
    base.userData.customizable = true;
    group.add(base);

    const holoSphere = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 }));
    holoSphere.position.y = 0.45;
    group.add(holoSphere);

    group.userData.onUpdate = (time) => {
      holoSphere.position.y = 0.45 + Math.sin(time * 3) * 0.08;
    };
  },

  /* 17. Vision Glasses */
  buildSmartGlasses(group, colorHex, matType) {
    const frameMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.7, roughness: 0.2 });
    const leftRim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.04, 16, 32), frameMat);
    leftRim.position.set(-0.45, 0, 0);
    leftRim.userData.customizable = true;
    group.add(leftRim);

    const rightRim = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.04, 16, 32), frameMat.clone());
    rightRim.position.set(0.45, 0, 0);
    rightRim.userData.customizable = true;
    group.add(rightRim);
  },

  /* 18. Smart Ring */
  buildSmartRing(group, colorHex, matType) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.22, 32, 64), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.95, roughness: 0.15 }));
    ring.userData.customizable = true;
    group.add(ring);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.04, 16, 64), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    group.add(innerRing);
  },

  /* 19. Smart Speaker */
  buildSmartSpeaker(group, colorHex, matType) {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.7, 1.8, 32), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), roughness: 0.6, metalness: 0.2 }));
    body.userData.customizable = true;
    group.add(body);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 16, 32), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.91;
    group.add(halo);
  },

  /* 20. Vision Camera */
  buildVisionCamera(group, colorHex, matType) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.6, roughness: 0.3 }));
    body.userData.customizable = true;
    group.add(body);

    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.52, 0.9, 32), new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.9, roughness: 0.2 }));
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.set(-0.15, 0, 0.6);
    group.add(lensBarrel);
  },

  /* 21. Future Drone */
  buildFutureDrone(group, colorHex, matType) {
    const pod = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 6), new THREE.MeshStandardMaterial({ color: new THREE.Color(colorHex), metalness: 0.7, roughness: 0.25 }));
    pod.rotation.x = Math.PI / 2;
    pod.scale.set(1.0, 1.0, 0.4);
    pod.userData.customizable = true;
    group.add(pod);

    const armMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), armMat);
    arm1.rotation.y = Math.PI / 4;
    group.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.4), armMat);
    arm2.rotation.y = -Math.PI / 4;
    group.add(arm2);

    const propGeo = new THREE.BoxGeometry(0.65, 0.015, 0.08);
    const propMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 });
    const props = [];

    [[-0.7, 0.08, 0.7], [0.7, 0.08, 0.7], [-0.7, 0.08, -0.7], [0.7, 0.08, -0.7]].forEach(pos => {
      const prop = new THREE.Mesh(propGeo, propMat);
      prop.position.set(pos[0], pos[1] + 0.06, pos[2]);
      group.add(prop);
      props.push(prop);
    });

    group.userData.onUpdate = (time, delta) => {
      props.forEach((p, idx) => {
        p.rotation.y += (idx % 2 === 0 ? 25 : -25) * delta;
      });
      group.position.y = Math.sin(time * 2.5) * 0.08;
    };
  }
};


/* =========================================================================
   3D Virtual Exhibition Gallery Controller
   ========================================================================= */
class VisionExhibitionGallery {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.pedestals = [];
    this.currentExhibitIndex = 0;
    this.animationId = null;

    this.exhibitProducts = [
      { id: "visionwatch-x1", title: "VisionWatch X1", type: "smartwatch", pos: [-6, 0, 0] },
      { id: "visioncar-one", title: "VisionCar One", type: "cyber_car", pos: [-3, 0, -3] },
      { id: "vision-gamepad", title: "Vision GamePad", type: "gamepad", pos: [0, 0, -5] },
      { id: "future-drone", title: "Future Drone", type: "future_drone", pos: [3, 0, -3] },
      { id: "smart-speaker", title: "Smart Speaker", type: "smart_speaker", pos: [6, 0, 0] }
    ];

    this.init();
  }

  init() {
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050714, 0.04);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 2.5, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0x0a1026, 1.5);
    this.scene.add(ambient);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.MeshStandardMaterial({ color: 0x050714, roughness: 0.15, metalness: 0.85 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.0;
    this.scene.add(floor);

    this.buildExhibits();

    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.maxDistance = 14;
      this.controls.minDistance = 2;
    }

    this.animate = this.animate.bind(this);
    this.animate();
  }

  buildExhibits() {
    this.exhibitProducts.forEach((item, idx) => {
      const group = new THREE.Group();
      group.position.set(item.pos[0], item.pos[1], item.pos[2]);

      const pedMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 1.0, 32), new THREE.MeshStandardMaterial({ color: 0x0e1322, roughness: 0.2, metalness: 0.8 }));
      pedMesh.position.y = -0.5;
      group.add(pedMesh);

      const rim = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.02, 32), new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x00f0ff : 0xa855f7, side: THREE.DoubleSide }));
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = 0.01;
      group.add(rim);

      const model = VisionModelFactory.createModel(item.type, {
        color: idx % 2 === 0 ? "#00f0ff" : "#8a2be2"
      });
      model.position.y = 0.6;
      group.add(model);

      const spot = new THREE.SpotLight(idx % 2 === 0 ? 0x38bdf8 : 0xc084fc, 3.5, 10, Math.PI/4, 0.5);
      spot.position.set(item.pos[0], 5, item.pos[2]);
      spot.target = model;
      this.scene.add(spot);
      this.scene.add(spot.target);

      this.scene.add(group);
      this.pedestals.push({ group, model, item });
    });
  }

  focusExhibit(index) {
    if (index < 0 || index >= this.exhibitProducts.length) return;
    this.currentExhibitIndex = index;
    const targetExhibit = this.exhibitProducts[index];
    const targetPos = new THREE.Vector3(targetExhibit.pos[0], targetExhibit.pos[1] + 1.2, targetExhibit.pos[2] + 3.2);
    
    const startPos = this.camera.position.clone();
    const startTime = performance.now();
    const duration = 1200;

    const animateCam = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      if (this.controls) {
        this.controls.target.set(targetExhibit.pos[0], targetExhibit.pos[1] + 0.5, targetExhibit.pos[2]);
      }

      if (progress < 1.0) {
        requestAnimationFrame(animateCam);
      }
    };
    requestAnimationFrame(animateCam);
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    const time = performance.now() * 0.001;

    this.pedestals.forEach((p, idx) => {
      p.model.rotation.y = time * 0.5 + idx;
      if (p.model.userData.onUpdate) {
        p.model.userData.onUpdate(time, 0.016);
      }
    });

    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Export Globally
if (typeof window !== 'undefined') {
  window.VisionThreeViewer = VisionThreeViewer;
  window.VisionModelFactory = VisionModelFactory;
  window.VisionExhibitionGallery = VisionExhibitionGallery;
}

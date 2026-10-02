/**
 * ==============================================================================
 * SOLECRAFT — CUSTOM SNEAKER E-COMMERCE PLATFORM
 * Academic IBM Project Submission
 * 
 * Core Functional Modules:
 * 1. Sneaker Customizer State Machine & Interactive SVG DOM Renderer
 * 2. Dynamic Reactive Price Calculator
 * 3. Shopping Cart Management & LocalStorage Persistence
 * 4. Checkout Form Validation & Mock Order Generation
 * 5. Academic Presentation Support & Navigation Handlers
 * ==============================================================================
 */

// Strict Mode for Clean Code & Robust Execution
'use strict';

/* ==============================================================================
   MODULE 1: GLOBAL STATE & CONFIGURATION DATA
   ============================================================================== */

/**
 * Default Customization Configuration State
 * Centralized Single Source of Truth for the sneaker studio.
 */
const currentCustomization = {
  modelId: 'classic',
  modelName: 'SoleCraft Classic',
  basePrice: 2499,
  
  // Upper Color
  upperColor: '#FFFFFF',
  upperColorName: 'White',
  upperPrice: 0,
  
  // Accent / Swoosh Color
  accentColor: '#FF5400',
  accentColorName: 'Solar Orange',
  
  // Sole Configuration
  soleType: 'gum',
  soleName: 'Natural Gum',
  soleHex: '#D4B996',
  solePrice: 250,
  
  // Laces Configuration
  laceColor: 'white',
  laceName: 'White',
  laceHex: '#FFFFFF',
  lacePrice: 0,
  
  // Pattern / Decals
  patternType: 'none',
  patternName: 'Minimal',
  patternPrice: 0,
  
  // Custom Monogram Text
  customText: 'CRAFT-01',
  textPrice: 150,
  
  // Calculated Grand Total
  totalPrice: 2899
};

/**
 * Model Presets with Silhouette Coordinates & Features
 */
const MODEL_CONFIGS = {
  classic: {
    name: 'SoleCraft Classic',
    basePrice: 2499,
    category: 'court',
    hasAirUnit: false,
    collarStyle: 'low',
    upperPath: 'M 148,296 C 130,265 140,245 175,235 C 215,225 250,220 300,210 C 340,155 365,130 420,118 C 450,112 470,122 485,150 C 510,165 540,175 580,180 C 625,188 640,215 650,250 C 660,285 645,296 620,298 C 540,296 350,296 148,296 Z',
    midsolePath: 'M 112,336 C 105,310 120,298 150,294 C 230,296 350,298 480,296 C 560,296 630,300 662,310 C 672,320 668,335 658,340 C 600,342 460,342 350,342 C 230,342 145,340 112,336 Z'
  },
  street: {
    name: 'StreetFlex',
    basePrice: 2799,
    category: 'techwear',
    hasAirUnit: false,
    collarStyle: 'mid-high',
    upperPath: 'M 148,296 C 125,260 135,240 170,230 C 210,215 250,210 295,195 C 330,140 355,105 405,95 C 445,90 475,100 495,125 C 525,140 550,150 590,155 C 635,160 655,190 665,230 C 670,270 655,296 620,298 C 540,296 350,296 148,296 Z',
    midsolePath: 'M 110,338 C 100,305 118,295 150,292 C 230,294 350,298 480,295 C 560,294 635,298 668,312 C 678,324 672,338 658,342 C 600,344 460,344 350,344 C 230,344 140,342 110,338 Z'
  },
  runner: {
    name: 'Urban Runner',
    basePrice: 2999,
    category: 'running',
    hasAirUnit: true,
    collarStyle: 'aerodynamic',
    upperPath: 'M 148,296 C 132,270 142,248 178,238 C 220,225 255,220 305,212 C 342,160 368,135 422,122 C 452,116 472,125 488,152 C 512,168 542,176 582,182 C 628,190 642,216 652,252 C 662,286 646,296 622,298 C 540,296 350,296 148,296 Z',
    midsolePath: 'M 112,336 C 105,310 120,298 150,294 C 230,296 350,298 480,296 C 560,296 630,300 662,310 C 672,320 668,335 658,340 C 600,342 460,342 350,342 C 230,342 145,340 112,336 Z'
  }
};

/**
 * LocalStorage Cart Management Key
 */
const STORAGE_KEY_CART = 'solecraft_cart_items';

// Global In-Memory Cart State
let shoppingCart = [];


/* ==============================================================================
   MODULE 2: DOM INITIALIZATION & EVENT DISPATCHING
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sticky Header & Academic Top Banner
  initHeaderAndBanner();

  // 2. Initialize Sneaker Customizer Studio
  initSneakerCustomizer();

  // 3. Initialize Product Grid & Quick-Customize Buttons
  initProductsSection();

  // 4. Initialize Shopping Cart & LocalStorage Sync
  initShoppingCart();

  // 5. Initialize Checkout Modal & Form Validation
  initCheckoutFlow();

  // 6. Initialize Academic Viva Presentation Modal
  initAcademicModal();

  // 7. Initial Customizer Visual & Price Render
  updateCustomizerUI();
});


/* ==============================================================================
   MODULE 3: STICKY HEADER & ACADEMIC BANNER
   ============================================================================== */

function initHeaderAndBanner() {
  const header = document.getElementById('site-header');
  const banner = document.getElementById('academic-banner');
  const closeBannerBtn = document.getElementById('close-academic-banner');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header Scroll Listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Academic Banner Close Toggle
  if (closeBannerBtn && banner) {
    closeBannerBtn.addEventListener('click', () => {
      banner.classList.add('collapsed');
    });
  }

  // Mobile Menu Toggle
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
    });
  }

  // Smooth Scroll & Auto-Close Mobile Nav
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('mobile-open')) {
        mainNav.classList.remove('mobile-open');
      }
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}


/* ==============================================================================
   MODULE 4: SNEAKER CUSTOMIZER STUDIO (REQUIREMENT 3: PROPOSED SOLUTION)
   ============================================================================== */

/**
 * Initializes all event listeners for the 7 interactive customization parameters.
 */
function initSneakerCustomizer() {
  // Parameter 1: Base Sneaker Silhouette Models
  const modelButtons = document.querySelectorAll('.model-btn');
  modelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modelButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const modelKey = btn.dataset.model;
      const basePrice = parseInt(btn.dataset.basePrice, 10);
      const modelName = btn.dataset.name;

      currentCustomization.modelId = modelKey;
      currentCustomization.modelName = modelName;
      currentCustomization.basePrice = basePrice;

      updateCustomizerUI();
    });
  });

  // Parameter 2: Upper Colour Swatches
  const upperSwatches = document.querySelectorAll('#upper-color-swatches .swatch-btn');
  upperSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      upperSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      currentCustomization.upperColor = swatch.dataset.color;
      currentCustomization.upperColorName = swatch.dataset.name;
      currentCustomization.upperPrice = parseInt(swatch.dataset.price || '0', 10);

      updateCustomizerUI();
    });
  });

  // Parameter 3: Accent / Swoosh Wing Swatches
  const accentSwatches = document.querySelectorAll('#accent-color-swatches .swatch-btn');
  accentSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      accentSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      currentCustomization.accentColor = swatch.dataset.color;
      currentCustomization.accentColorName = swatch.dataset.name;

      updateCustomizerUI();
    });
  });

  // Parameter 4: Sole Type & Materials
  const soleOptions = document.querySelectorAll('#sole-options .option-pill');
  soleOptions.forEach(pill => {
    pill.addEventListener('click', () => {
      soleOptions.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentCustomization.soleType = pill.dataset.sole;
      currentCustomization.soleHex = pill.dataset.hex;
      currentCustomization.solePrice = parseInt(pill.dataset.price, 10);

      if (pill.dataset.sole === 'gum') {
        currentCustomization.soleName = 'Natural Gum';
      } else if (pill.dataset.sole === 'black') {
        currentCustomization.soleName = 'Black Stealth';
      } else {
        currentCustomization.soleName = 'White Classic';
      }

      updateCustomizerUI();
    });
  });

  // Parameter 5: Laces Configuration
  const lacesOptions = document.querySelectorAll('#laces-options .option-pill');
  lacesOptions.forEach(pill => {
    pill.addEventListener('click', () => {
      lacesOptions.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentCustomization.laceColor = pill.dataset.lace;
      currentCustomization.laceHex = pill.dataset.hex;
      currentCustomization.lacePrice = parseInt(pill.dataset.price, 10);
      currentCustomization.laceName = pill.querySelector('.pill-name').textContent.trim();

      updateCustomizerUI();
    });
  });

  // Parameter 6: Design Patterns & Decals
  const patternButtons = document.querySelectorAll('#pattern-options .pattern-btn');
  patternButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      patternButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCustomization.patternType = btn.dataset.pattern;
      currentCustomization.patternName = btn.dataset.name;
      currentCustomization.patternPrice = parseInt(btn.dataset.price, 10);

      updateCustomizerUI();
    });
  });

  // Parameter 7: Custom Text / Monogram Input Listener
  const textInput = document.getElementById('custom-text-input');
  const charCounter = document.getElementById('char-count');

  if (textInput) {
    textInput.addEventListener('input', (e) => {
      // Auto-uppercase & filter alphanumeric/dashes
      let rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9 -]/g, '');
      if (rawVal.length > 10) rawVal = rawVal.slice(0, 10);
      e.target.value = rawVal;

      if (charCounter) {
        charCounter.textContent = rawVal.length;
      }

      currentCustomization.customText = rawVal;
      // If user clears the text entirely, cost is 0; otherwise +150
      currentCustomization.textPrice = rawVal.trim().length > 0 ? 150 : 0;

      updateCustomizerUI();
    });
  }

  // Studio Tools: Flip Angle
  const flipBtn = document.getElementById('flip-view-btn');
  const sneakerSvg = document.getElementById('sneaker-svg');
  if (flipBtn && sneakerSvg) {
    flipBtn.addEventListener('click', () => {
      sneakerSvg.classList.toggle('flipped');
    });
  }

  // Studio Tools: Randomize (Surprise Me)
  const randomizeBtn = document.getElementById('randomize-design-btn');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', () => {
      randomizeDesign();
    });
  }

  // Studio Tools: Reset to Default
  const resetBtn = document.getElementById('reset-design-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetCustomizerDefaults();
    });
  }

  // Toggle Price Breakdown Accordion
  const toggleBreakdownBtn = document.getElementById('toggle-breakdown-btn');
  const breakdownList = document.getElementById('price-breakdown-list');
  if (toggleBreakdownBtn && breakdownList) {
    toggleBreakdownBtn.addEventListener('click', () => {
      const isVisible = breakdownList.style.display !== 'none';
      breakdownList.style.display = isVisible ? 'none' : 'flex';
      toggleBreakdownBtn.innerHTML = isVisible
        ? '<span>View Breakdown</span> <i class="fa-solid fa-chevron-down"></i>'
        : '<span>Hide Breakdown</span> <i class="fa-solid fa-chevron-up"></i>';
    });
  }

  // Add to Cart Button from Customizer
  const addCustomBtn = document.getElementById('add-custom-to-cart-btn');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      addCustomSneakerToCart();
    });
  }
}

/**
 * Updates both the SVG Vector Artboard and the Price Calculator
 * according to currentCustomization state.
 */
function updateCustomizerUI() {
  // 1. Recalculate Total Price
  calculateTotalPrice();

  // 2. Update SVG Vector Graphics DOM Nodes
  renderSneakerSvg();

  // 3. Update Text Labels in Controls
  updateControlLabels();

  // 4. Update Price Calculator Breakdown Display
  renderPriceBreakdown();

  // 5. Update Live Summary Spec Pills
  updateSpecSummaryPills();
}

/**
 * Recalculates total price dynamically based on all selections.
 */
function calculateTotalPrice() {
  currentCustomization.totalPrice =
    currentCustomization.basePrice +
    currentCustomization.upperPrice +
    currentCustomization.solePrice +
    currentCustomization.lacePrice +
    currentCustomization.patternPrice +
    currentCustomization.textPrice;
}

/**
 * Manipulates the SVG DOM nodes directly to reflect colors, shapes, patterns, and text.
 */
function renderSneakerSvg() {
  const svgUpper = document.getElementById('svg-upper');
  const svgOutsole = document.getElementById('svg-outsole');
  const svgMidsole = document.getElementById('svg-midsole');
  const svgAccent = document.getElementById('svg-accent-swoosh');
  const svgBadgeBg = document.getElementById('svg-badge-bg');
  const svgCustomText = document.getElementById('svg-custom-text');
  const svgAirUnit = document.getElementById('svg-air-unit');
  const svgPatternOverlay = document.getElementById('svg-pattern-overlay');
  const svgHeelTab = document.getElementById('svg-heel-tab');

  // Laces elements
  const laceElements = [
    document.getElementById('svg-lace-1'),
    document.getElementById('svg-lace-2'),
    document.getElementById('svg-lace-3'),
    document.getElementById('svg-lace-4'),
    document.getElementById('svg-lace-bow1'),
    document.getElementById('svg-lace-bow2')
  ];

  // A. Model Silhouette Morphs
  const config = MODEL_CONFIGS[currentCustomization.modelId] || MODEL_CONFIGS.classic;
  if (svgUpper && config.upperPath) {
    svgUpper.setAttribute('d', config.upperPath);
  }
  if (svgMidsole && config.midsolePath) {
    svgMidsole.setAttribute('d', config.midsolePath);
  }

  // Toggle Air Cushion Unit for Runner model
  if (svgAirUnit) {
    svgAirUnit.style.display = config.hasAirUnit ? 'block' : 'none';
  }

  // B. Upper Color
  if (svgUpper) {
    svgUpper.setAttribute('fill', currentCustomization.upperColor);
    // Dynamic border contrast
    if (currentCustomization.upperColor === '#FFFFFF') {
      svgUpper.setAttribute('stroke', '#CBD5E1');
    } else if (currentCustomization.upperColor === '#18181B') {
      svgUpper.setAttribute('stroke', '#27272A');
    } else {
      svgUpper.setAttribute('stroke', 'rgba(0,0,0,0.25)');
    }
  }

  // C. Accent & Swoosh Wing Color
  if (svgAccent) {
    svgAccent.setAttribute('fill', currentCustomization.accentColor);
  }
  if (svgBadgeBg) {
    svgBadgeBg.setAttribute('stroke', currentCustomization.accentColor);
  }
  if (svgHeelTab) {
    svgHeelTab.setAttribute('fill', currentCustomization.accentColor);
  }

  // D. Sole Color
  if (svgOutsole) {
    svgOutsole.setAttribute('fill', currentCustomization.soleHex);
    if (currentCustomization.soleType === 'gum') {
      svgOutsole.setAttribute('stroke', '#A88258');
    } else if (currentCustomization.soleType === 'black') {
      svgOutsole.setAttribute('stroke', '#090A0D');
    } else {
      svgOutsole.setAttribute('stroke', '#E2E8F0');
    }
  }

  // E. Laces Colors
  laceElements.forEach(el => {
    if (el) {
      el.setAttribute('stroke', currentCustomization.laceHex);
    }
  });

  // F. Pattern Decal
  if (svgPatternOverlay) {
    if (currentCustomization.patternType === 'street') {
      svgPatternOverlay.setAttribute('fill', 'url(#streetPattern)');
      svgPatternOverlay.style.display = 'block';
    } else if (currentCustomization.patternType === 'sport') {
      svgPatternOverlay.setAttribute('fill', 'url(#sportPattern)');
      svgPatternOverlay.style.display = 'block';
    } else if (currentCustomization.patternType === 'contrast') {
      svgPatternOverlay.setAttribute('fill', 'url(#contrastPattern)');
      svgPatternOverlay.style.display = 'block';
    } else {
      svgPatternOverlay.style.display = 'none';
    }
  }

  // G. Personalized Monogram Text
  if (svgCustomText) {
    if (currentCustomization.customText.trim().length > 0) {
      svgCustomText.textContent = currentCustomization.customText.trim();
      svgCustomText.style.display = 'block';
      if (svgBadgeBg) svgBadgeBg.style.display = 'block';
    } else {
      // If no text, hide badge
      svgCustomText.textContent = '';
      if (svgBadgeBg) svgBadgeBg.style.display = 'none';
    }
  }
}

/**
 * Updates text labels in the right configurator panel
 */
function updateControlLabels() {
  const lblUpper = document.getElementById('label-upper-color');
  const lblAccent = document.getElementById('label-accent-color');
  const lblSole = document.getElementById('label-sole-type');
  const lblLaces = document.getElementById('label-laces-color');
  const lblPattern = document.getElementById('label-pattern-name');

  if (lblUpper) {
    lblUpper.textContent = `${currentCustomization.upperColorName} (${currentCustomization.upperPrice > 0 ? '+₹' + currentCustomization.upperPrice : 'Standard'})`;
  }
  if (lblAccent) {
    lblAccent.textContent = currentCustomization.accentColorName;
  }
  if (lblSole) {
    lblSole.textContent = `${currentCustomization.soleName} (+₹${currentCustomization.solePrice})`;
  }
  if (lblLaces) {
    lblLaces.textContent = `${currentCustomization.laceName} (+₹${currentCustomization.lacePrice})`;
  }
  if (lblPattern) {
    lblPattern.textContent = `${currentCustomization.patternName} (+₹${currentCustomization.patternPrice})`;
  }
}

/**
 * Renders the itemized price breakdown list and grand total.
 */
function renderPriceBreakdown() {
  const rowBaseLabel = document.getElementById('price-row-base-label');
  const rowBase = document.getElementById('price-row-base');
  const rowColor = document.getElementById('price-row-color');
  const rowSole = document.getElementById('price-row-sole');
  const rowLaces = document.getElementById('price-row-laces');
  const rowPattern = document.getElementById('price-row-pattern');
  const rowTextLabel = document.getElementById('price-row-text-label');
  const rowText = document.getElementById('price-row-text');
  const totalDisplay = document.getElementById('calculated-total-price');

  if (rowBaseLabel) rowBaseLabel.textContent = `Base Sneaker (${currentCustomization.modelName})`;
  if (rowBase) rowBase.textContent = `₹${currentCustomization.basePrice.toLocaleString('en-IN')}`;
  
  if (rowColor) {
    rowColor.textContent = currentCustomization.upperPrice > 0
      ? `+₹${currentCustomization.upperPrice}`
      : '₹0';
  }

  if (rowSole) {
    rowSole.textContent = currentCustomization.solePrice > 0
      ? `+₹${currentCustomization.solePrice}`
      : '₹0';
  }

  if (rowLaces) {
    rowLaces.textContent = currentCustomization.lacePrice > 0
      ? `+₹${currentCustomization.lacePrice}`
      : '₹0';
  }

  if (rowPattern) {
    rowPattern.textContent = currentCustomization.patternPrice > 0
      ? `+₹${currentCustomization.patternPrice}`
      : '₹0';
  }

  if (rowTextLabel && rowText) {
    if (currentCustomization.customText.trim().length > 0) {
      rowTextLabel.textContent = `Custom Monogram ("${currentCustomization.customText}")`;
      rowText.textContent = `+₹${currentCustomization.textPrice}`;
    } else {
      rowTextLabel.textContent = 'Custom Monogram (None)';
      rowText.textContent = '₹0';
    }
  }

  if (totalDisplay) {
    totalDisplay.textContent = `₹${currentCustomization.totalPrice.toLocaleString('en-IN')}`;
  }
}

/**
 * Updates summary chips under the sneaker stage preview
 */
function updateSpecSummaryPills() {
  const stageModel = document.getElementById('stage-model-name');
  const sumModel = document.getElementById('summary-model');
  const sumUpper = document.getElementById('summary-upper');
  const sumUpperDot = document.getElementById('summary-upper-dot');
  const sumAccent = document.getElementById('summary-accent');
  const sumAccentDot = document.getElementById('summary-accent-dot');
  const sumSole = document.getElementById('summary-sole');
  const sumLaces = document.getElementById('summary-laces');
  const sumText = document.getElementById('summary-text');

  if (stageModel) stageModel.textContent = currentCustomization.modelName;
  if (sumModel) sumModel.textContent = currentCustomization.modelName;
  if (sumUpper) sumUpper.textContent = currentCustomization.upperColorName;
  if (sumUpperDot) sumUpperDot.style.background = currentCustomization.upperColor;
  if (sumAccent) sumAccent.textContent = currentCustomization.accentColorName;
  if (sumAccentDot) sumAccentDot.style.background = currentCustomization.accentColor;
  if (sumSole) sumSole.textContent = currentCustomization.soleName;
  if (sumLaces) sumLaces.textContent = currentCustomization.laceName;
  if (sumText) {
    sumText.textContent = currentCustomization.customText.trim()
      ? `"${currentCustomization.customText.trim()}"`
      : 'None';
  }
}

/**
 * Randomize Design Tool: Picks random attributes for demo presentations.
 */
function randomizeDesign() {
  const models = ['classic', 'street', 'runner'];
  const colors = [
    { hex: '#FFFFFF', name: 'White', price: 0 },
    { hex: '#18181B', name: 'Black', price: 0 },
    { hex: '#E11D48', name: 'Red', price: 200 },
    { hex: '#2563EB', name: 'Blue', price: 200 },
    { hex: '#059669', name: 'Green', price: 200 },
    { hex: '#D4B996', name: 'Beige', price: 200 }
  ];
  const accents = [
    { hex: '#FF5400', name: 'Solar Orange' },
    { hex: '#00F0FF', name: 'Cyber Volt' },
    { hex: '#FFFFFF', name: 'Pure White' },
    { hex: '#18181B', name: 'Stealth Black' },
    { hex: '#E11D48', name: 'Crimson Red' },
    { hex: '#2563EB', name: 'Royal Blue' }
  ];
  const soles = [
    { type: 'white', name: 'White Classic', hex: '#FFFFFF', price: 0 },
    { type: 'black', name: 'Black Stealth', hex: '#18181B', price: 100 },
    { type: 'gum', name: 'Natural Gum', hex: '#D4B996', price: 250 }
  ];
  const laces = [
    { color: 'white', name: 'White', hex: '#FFFFFF', price: 0 },
    { color: 'black', name: 'Black', hex: '#18181B', price: 0 },
    { color: 'red', name: 'Red', hex: '#E11D48', price: 100 },
    { color: 'blue', name: 'Blue', hex: '#2563EB', price: 100 }
  ];
  const patterns = [
    { type: 'none', name: 'Minimal', price: 0 },
    { type: 'contrast', name: 'Contrast', price: 0 },
    { type: 'street', name: 'Street', price: 150 },
    { type: 'sport', name: 'Sport', price: 150 }
  ];
  const randomTags = ['BOLT-99', 'NEO-X', 'SC-PRIME', 'HYPER', 'VIPER', 'PULSE', 'MATRIX', 'VELO'];

  // Random selections
  const randModel = models[Math.floor(Math.random() * models.length)];
  const randColor = colors[Math.floor(Math.random() * colors.length)];
  const randAccent = accents[Math.floor(Math.random() * accents.length)];
  const randSole = soles[Math.floor(Math.random() * soles.length)];
  const randLace = laces[Math.floor(Math.random() * laces.length)];
  const randPattern = patterns[Math.floor(Math.random() * patterns.length)];
  const randText = randomTags[Math.floor(Math.random() * randomTags.length)];

  // Update internal state
  const modelConfig = MODEL_CONFIGS[randModel];
  currentCustomization.modelId = randModel;
  currentCustomization.modelName = modelConfig.name;
  currentCustomization.basePrice = modelConfig.basePrice;

  currentCustomization.upperColor = randColor.hex;
  currentCustomization.upperColorName = randColor.name;
  currentCustomization.upperPrice = randColor.price;

  currentCustomization.accentColor = randAccent.hex;
  currentCustomization.accentColorName = randAccent.name;

  currentCustomization.soleType = randSole.type;
  currentCustomization.soleName = randSole.name;
  currentCustomization.soleHex = randSole.hex;
  currentCustomization.solePrice = randSole.price;

  currentCustomization.laceColor = randLace.color;
  currentCustomization.laceName = randLace.name;
  currentCustomization.laceHex = randLace.hex;
  currentCustomization.lacePrice = randLace.price;

  currentCustomization.patternType = randPattern.type;
  currentCustomization.patternName = randPattern.name;
  currentCustomization.patternPrice = randPattern.price;

  currentCustomization.customText = randText;
  currentCustomization.textPrice = 150;

  // Sync UI controls
  syncActiveStateInUI();
  updateCustomizerUI();
}

/**
 * Resets customizer back to standard defaults.
 */
function resetCustomizerDefaults() {
  currentCustomization.modelId = 'classic';
  currentCustomization.modelName = 'SoleCraft Classic';
  currentCustomization.basePrice = 2499;
  currentCustomization.upperColor = '#FFFFFF';
  currentCustomization.upperColorName = 'White';
  currentCustomization.upperPrice = 0;
  currentCustomization.accentColor = '#FF5400';
  currentCustomization.accentColorName = 'Solar Orange';
  currentCustomization.soleType = 'gum';
  currentCustomization.soleName = 'Natural Gum';
  currentCustomization.soleHex = '#D4B996';
  currentCustomization.solePrice = 250;
  currentCustomization.laceColor = 'white';
  currentCustomization.laceName = 'White';
  currentCustomization.laceHex = '#FFFFFF';
  currentCustomization.lacePrice = 0;
  currentCustomization.patternType = 'none';
  currentCustomization.patternName = 'Minimal';
  currentCustomization.patternPrice = 0;
  currentCustomization.customText = 'CRAFT-01';
  currentCustomization.textPrice = 150;

  syncActiveStateInUI();
  updateCustomizerUI();
}

/**
 * Synchronizes active class on all buttons and inputs to reflect currentCustomization
 */
function syncActiveStateInUI() {
  // Model Buttons
  document.querySelectorAll('.model-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.model === currentCustomization.modelId);
  });

  // Upper Swatches
  document.querySelectorAll('#upper-color-swatches .swatch-btn').forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color.toLowerCase() === currentCustomization.upperColor.toLowerCase());
  });

  // Accent Swatches
  document.querySelectorAll('#accent-color-swatches .swatch-btn').forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color.toLowerCase() === currentCustomization.accentColor.toLowerCase());
  });

  // Sole Options
  document.querySelectorAll('#sole-options .option-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.sole === currentCustomization.soleType);
  });

  // Laces Options
  document.querySelectorAll('#laces-options .option-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.lace === currentCustomization.laceColor);
  });

  // Pattern Options
  document.querySelectorAll('#pattern-options .pattern-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pattern === currentCustomization.patternType);
  });

  // Text Input
  const textInput = document.getElementById('custom-text-input');
  const charCounter = document.getElementById('char-count');
  if (textInput) {
    textInput.value = currentCustomization.customText;
  }
  if (charCounter) {
    charCounter.textContent = currentCustomization.customText.length;
  }
}


/* ==============================================================================
   MODULE 5: FEATURED PRODUCTS SECTION & QUICK CUSTOMIZE
   ============================================================================== */

function initProductsSection() {
  // Category Filter Buttons
  const filterBtns = document.querySelectorAll('#category-filter-buttons .filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      productCards.forEach(card => {
        if (filterVal === 'all' || card.dataset.category === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // "Customize This Model" Buttons on Product Cards
  const customizeModelBtns = document.querySelectorAll('.customize-model-btn');
  customizeModelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetModel = btn.dataset.model;
      const modelName = btn.dataset.modelName;
      const basePrice = parseInt(btn.dataset.basePrice, 10);

      // Load model into customizer
      currentCustomization.modelId = targetModel;
      currentCustomization.modelName = modelName;
      currentCustomization.basePrice = basePrice;

      syncActiveStateInUI();
      updateCustomizerUI();

      // Smooth scroll down to customizer section
      const customizerSec = document.getElementById('customize');
      if (customizerSec) {
        customizerSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Footer Silhouette Links
  const footerModelLinks = document.querySelectorAll('.footer-model-link');
  footerModelLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modelId = link.dataset.model;
      const config = MODEL_CONFIGS[modelId] || MODEL_CONFIGS.classic;
      
      currentCustomization.modelId = modelId;
      currentCustomization.modelName = config.name;
      currentCustomization.basePrice = config.basePrice;

      syncActiveStateInUI();
      updateCustomizerUI();

      const customizerSec = document.getElementById('customize');
      if (customizerSec) {
        customizerSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


/* ==============================================================================
   MODULE 6: SHOPPING CART MANAGEMENT (REQUIREMENT 4: FUNCTIONAL DEMO CART)
   ============================================================================== */

function initShoppingCart() {
  // Load Cart from LocalStorage
  loadCartFromStorage();

  // Cart Drawer Elements
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const emptyCartCustomizeBtn = document.getElementById('empty-cart-customize-btn');

  // Open Cart Drawer
  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
      openCartDrawer();
    });
  }

  // Close Cart Drawer
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      closeCartDrawer();
    });
  }

  // Clear Cart Button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove all items from your cart?')) {
        shoppingCart = [];
        saveCartToStorage();
        renderCartUI();
      }
    });
  }

  // Empty Cart Customize Link
  if (emptyCartCustomizeBtn) {
    emptyCartCustomizeBtn.addEventListener('click', () => {
      closeCartDrawer();
    });
  }
}

/**
 * Adds the currently customized sneaker into the shopping cart.
 */
function addCustomSneakerToCart() {
  const item = {
    id: 'SC-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4),
    modelId: currentCustomization.modelId,
    name: currentCustomization.modelName,
    specs: {
      upperColor: currentCustomization.upperColorName,
      accentColor: currentCustomization.accentColorName,
      sole: currentCustomization.soleName,
      laces: currentCustomization.laceName,
      pattern: currentCustomization.patternName,
      monogram: currentCustomization.customText.trim() || 'None'
    },
    thumbColors: {
      upper: currentCustomization.upperColor,
      accent: currentCustomization.accentColor,
      sole: currentCustomization.soleHex
    },
    unitPrice: currentCustomization.totalPrice,
    quantity: 1,
    createdAt: new Date().toISOString()
  };

  shoppingCart.push(item);
  saveCartToStorage();
  renderCartUI();

  // Show Animated Success Toast
  const toast = document.getElementById('added-toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Auto Open Cart Drawer to show user their addition
  setTimeout(() => {
    openCartDrawer();
  }, 400);
}

/**
 * Saves in-memory cart items to LocalStorage for persistence.
 */
function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(shoppingCart));
  } catch (err) {
    console.warn('LocalStorage unavailable or quota exceeded:', err);
  }
}

/**
 * Reads persisted cart data from LocalStorage on page load.
 */
function loadCartFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY_CART);
    if (rawData) {
      shoppingCart = JSON.parse(rawData);
    }
  } catch (err) {
    console.warn('Failed to parse cart items from LocalStorage:', err);
    shoppingCart = [];
  }
  renderCartUI();
}

/**
 * Renders the cart drawer list, updates item counts and financial summaries.
 */
function renderCartUI() {
  const navCartCount = document.getElementById('nav-cart-count');
  const drawerItemCount = document.getElementById('drawer-item-count');
  const cartContainer = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('empty-cart-view');
  const cartFooter = document.getElementById('cart-footer-panel');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartTaxVal = document.getElementById('cart-tax-val');
  const cartGrandTotal = document.getElementById('cart-grand-total');

  const totalQuantity = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = shoppingCart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Update Nav & Drawer Counters
  if (navCartCount) navCartCount.textContent = totalQuantity;
  if (drawerItemCount) drawerItemCount.textContent = `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`;

  // If Cart is Empty
  if (shoppingCart.length === 0) {
    if (emptyView) emptyView.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'none';

    // Clear dynamic item cards
    const existingCards = cartContainer.querySelectorAll('.cart-item-card');
    existingCards.forEach(c => c.remove());
    return;
  }

  // Cart Has Items
  if (emptyView) emptyView.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'block';

  // Calculate Demo Tax (GST 18% included demonstration)
  const grandTotal = subtotal;
  const estimatedTax = Math.round(grandTotal * 0.18 / 1.18);

  if (cartSubtotalVal) cartSubtotalVal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
  if (cartTaxVal) cartTaxVal.textContent = `₹${estimatedTax.toLocaleString('en-IN')}`;
  if (cartGrandTotal) cartGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

  // Clear existing items and re-render
  const existingCards = cartContainer.querySelectorAll('.cart-item-card');
  existingCards.forEach(c => c.remove());

  shoppingCart.forEach(item => {
    const card = document.createElement('div');
    card.className = 'cart-item-card';
    card.dataset.itemId = item.id;

    card.innerHTML = `
      <div class="cart-item-thumb">
        <svg viewBox="0 0 100 60" width="70" height="42">
          <!-- Mini Dynamic Silhouette Thumbnail -->
          <ellipse cx="50" cy="54" rx="42" ry="4" fill="rgba(0,0,0,0.3)"/>
          <path d="M 12,48 C 25,50 45,50 75,50 C 85,50 90,47 88,44 C 70,44 40,44 12,48 Z" fill="${item.thumbColors.sole}"/>
          <path d="M 15,44 C 18,34 32,32 45,30 C 52,22 58,16 68,14 C 74,14 78,18 80,24 C 84,28 86,38 88,44 C 65,44 35,44 15,44 Z" fill="${item.thumbColors.upper}" stroke="rgba(255,255,255,0.2)"/>
          <path d="M 30,38 C 45,38 60,32 78,24 C 68,30 52,34 35,36 Z" fill="${item.thumbColors.accent}"/>
        </svg>
      </div>

      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-specs">
          <span><strong>Color:</strong> ${item.specs.upperColor}</span>
          <span><strong>Accent:</strong> ${item.specs.accentColor}</span>
          <span><strong>Sole:</strong> ${item.specs.sole}</span>
          <span><strong>Laces:</strong> ${item.specs.laces}</span>
          <span><strong>Text:</strong> "${item.specs.monogram}"</span>
        </div>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button class="qty-btn qty-decrease-btn" data-id="${item.id}" aria-label="Decrease quantity">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn qty-increase-btn" data-id="${item.id}" aria-label="Increase quantity">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-price">₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <button class="remove-item-btn" data-id="${item.id}" aria-label="Remove item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    cartContainer.appendChild(card);
  });

  // Attach Quantity & Remove Listeners
  attachCartItemListeners();
}

/**
 * Attaches quantity increment/decrement and removal event handlers
 */
function attachCartItemListeners() {
  // Quantity Increase
  document.querySelectorAll('.qty-increase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const targetItem = shoppingCart.find(i => i.id === id);
      if (targetItem) {
        targetItem.quantity += 1;
        saveCartToStorage();
        renderCartUI();
      }
    });
  });

  // Quantity Decrease
  document.querySelectorAll('.qty-decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const targetIndex = shoppingCart.findIndex(i => i.id === id);
      if (targetIndex > -1) {
        if (shoppingCart[targetIndex].quantity > 1) {
          shoppingCart[targetIndex].quantity -= 1;
        } else {
          shoppingCart.splice(targetIndex, 1);
        }
        saveCartToStorage();
        renderCartUI();
      }
    });
  });

  // Remove Item
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      shoppingCart = shoppingCart.filter(i => i.id !== id);
      saveCartToStorage();
      renderCartUI();
    });
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }
}


/* ==============================================================================
   MODULE 7: CHECKOUT FLOW & ORDER CONFIRMATION (REQUIREMENT 4)
   ============================================================================== */

function initCheckoutFlow() {
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');
  const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');

  // Confirmation Modal Elements
  const confBackdrop = document.getElementById('confirmation-modal-backdrop');
  const continueShoppingBtn = document.getElementById('continue-shopping-btn');
  const printReceiptBtn = document.getElementById('print-receipt-btn');

  // Open Checkout Modal
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (shoppingCart.length === 0) {
        alert('Your cart is empty. Please customize a sneaker first!');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  // Close Checkout Modal
  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener('click', () => {
      closeCheckoutModal();
    });
  }
  if (cancelCheckoutBtn) {
    cancelCheckoutBtn.addEventListener('click', () => {
      closeCheckoutModal();
    });
  }

  // Handle Form Submission with Validation
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCheckoutSubmission();
    });
  }

  // Continue Shopping Action
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
      if (confBackdrop) {
        confBackdrop.classList.remove('open');
        confBackdrop.setAttribute('aria-hidden', 'true');
      }
      // Scroll to customizer
      const customizerSec = document.getElementById('customize');
      if (customizerSec) {
        customizerSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Print Receipt Action
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal-backdrop');
  const totalPayable = document.getElementById('checkout-total-payable');
  const itemCountBadge = document.getElementById('checkout-item-count-badge');

  const totalQty = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = shoppingCart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  if (totalPayable) totalPayable.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  if (itemCountBadge) itemCountBadge.textContent = `${totalQty} sneaker${totalQty === 1 ? '' : 's'}`;

  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal-backdrop');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Validates the checkout form fields and processes demo order placement
 */
function handleCheckoutSubmission() {
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const cityInput = document.getElementById('checkout-city');
  const addressInput = document.getElementById('checkout-address');
  const pincodeInput = document.getElementById('checkout-pincode');
  const paymentInputs = document.querySelectorAll('input[name="paymentMethod"]');

  let isValid = true;

  // 1. Validate Full Name
  if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
    showInputError(nameInput, 'error-name');
    isValid = false;
  } else {
    clearInputError(nameInput, 'error-name');
  }

  // 2. Validate Email (Standard Regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    showInputError(emailInput, 'error-email');
    isValid = false;
  } else {
    clearInputError(emailInput, 'error-email');
  }

  // 3. Validate Phone Number (10 digits starting with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    showInputError(phoneInput, 'error-phone');
    isValid = false;
  } else {
    clearInputError(phoneInput, 'error-phone');
  }

  // 4. Validate City
  if (!cityInput.value.trim() || cityInput.value.trim().length < 2) {
    showInputError(cityInput, 'error-city');
    isValid = false;
  } else {
    clearInputError(cityInput, 'error-city');
  }

  // 5. Validate Address
  if (!addressInput.value.trim() || addressInput.value.trim().length < 5) {
    showInputError(addressInput, 'error-address');
    isValid = false;
  } else {
    clearInputError(addressInput, 'error-address');
  }

  // 6. Validate 6-digit Pincode
  const pinRegex = /^\d{6}$/;
  if (!pinRegex.test(pincodeInput.value.trim())) {
    showInputError(pincodeInput, 'error-pincode');
    isValid = false;
  } else {
    clearInputError(pincodeInput, 'error-pincode');
  }

  if (!isValid) return;

  // Selected Payment Method
  let selectedPayment = 'Cash on Delivery (Demo)';
  paymentInputs.forEach(radio => {
    if (radio.checked) {
      if (radio.value === 'upi') selectedPayment = 'UPI / QR (Demo)';
      if (radio.value === 'card') selectedPayment = 'Credit / Debit Card (Demo)';
    }
  });

  // Generate Sample Order ID (e.g. SC-IBM-2026-89412)
  const currentYear = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const sampleOrderId = `SC-IBM-${currentYear}-${randomSuffix}`;

  // Calculate Order Grand Total
  const grandTotal = shoppingCart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Snapshot ordered items for confirmation ticket
  const orderedItemsCopy = [...shoppingCart];

  // Populate Order Confirmation Modal
  const confOrderId = document.getElementById('confirmed-order-id');
  const confCustomerName = document.getElementById('confirmed-customer-name');
  const confPaymentMethod = document.getElementById('confirmed-payment-method');
  const confTotalAmount = document.getElementById('confirmed-total-amount');
  const confItemsSummary = document.getElementById('confirmed-items-summary');

  if (confOrderId) confOrderId.textContent = sampleOrderId;
  if (confCustomerName) confCustomerName.textContent = nameInput.value.trim();
  if (confPaymentMethod) confPaymentMethod.textContent = selectedPayment;
  if (confTotalAmount) confTotalAmount.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

  // Populate Itemized Specs in Confirmation
  if (confItemsSummary) {
    confItemsSummary.innerHTML = orderedItemsCopy.map(item => `
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.85rem;">
        <strong>${item.quantity}x ${item.name}</strong> — ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}<br>
        <span style="color: #94A3B8; font-size: 0.78rem;">
          Color: ${item.specs.upperColor} | Accent: ${item.specs.accentColor} | Sole: ${item.specs.sole} | Monogram: "${item.specs.monogram}"
        </span>
      </div>
    `).join('');
  }

  // Clear In-Memory Cart and LocalStorage
  shoppingCart = [];
  saveCartToStorage();
  renderCartUI();

  // Close Checkout Modal & Open Confirmation Modal
  closeCheckoutModal();
  const confBackdrop = document.getElementById('confirmation-modal-backdrop');
  if (confBackdrop) {
    confBackdrop.classList.add('open');
    confBackdrop.setAttribute('aria-hidden', 'false');
  }
}

function showInputError(inputEl, errorId) {
  const group = inputEl.closest('.form-group');
  if (group) group.classList.add('has-error');
}

function clearInputError(inputEl, errorId) {
  const group = inputEl.closest('.form-group');
  if (group) group.classList.remove('has-error');
}


/* ==============================================================================
   MODULE 8: ACADEMIC VIVA & PRESENTATION DEFENSE MODAL
   ============================================================================== */

function initAcademicModal() {
  const openBannerBtn = document.getElementById('open-academic-modal-btn');
  const openVivaBtn = document.getElementById('open-viva-modal-btn');
  const closeBtn = document.getElementById('academic-modal-close-btn');
  const gotItBtn = document.getElementById('academic-modal-gotit-btn');
  const modalBackdrop = document.getElementById('academic-modal-backdrop');

  const openModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    }
  };

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  };

  if (openBannerBtn) openBannerBtn.addEventListener('click', openModal);
  if (openVivaBtn) openVivaBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (gotItBtn) gotItBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
}

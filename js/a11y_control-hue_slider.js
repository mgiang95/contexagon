// a11y-hue-slider.js
// Handles hue slider control and color updates

const HueSliderControl = {
  // State variables
  currentHue: 176.2,
  darkAccentHue: 176.2,
  lightAccentHue: 319.7,
  isUpdating: false,
  isDragging: false,

  // Elements
  hueSlider: null,
  statusEl: null,

  // Initialize
  init() {
    console.log("Initializing hue slider...");

    // Load saved values first
    try {
      const savedHue = localStorage.getItem("a11y-hue");
      if (savedHue) {
        this.currentHue = parseFloat(savedHue);
      }
      const savedDarkAccent = localStorage.getItem("a11y-dark-accent-hue");
      if (savedDarkAccent) {
        this.darkAccentHue = parseFloat(savedDarkAccent);
      }
      const savedLightAccent = localStorage.getItem("a11y-light-accent-hue");
      if (savedLightAccent) {
        this.lightAccentHue = parseFloat(savedLightAccent);
      }
    } catch (e) {
      console.warn("Could not load saved hue values:", e);
    }

    console.log(
      "Starting with hue:",
      this.currentHue,
      "darkAccentHue:",
      this.darkAccentHue,
      "lightAccentHue:",
      this.lightAccentHue
    );

    // Get elements
    this.hueSlider = document.getElementById("hue-slider");
    this.statusEl = document.getElementById("a11y-status");

    // Run compatibility check
    if (window.Utils && Utils.browserCompatibilityCheck) {
      const compatIssues = Utils.browserCompatibilityCheck();
      if (compatIssues.length > 0) {
        console.warn("Browser compatibility issues detected:", compatIssues);
      }
    }

    // Set slider value
    if (this.hueSlider) {
      this.hueSlider.value = this.currentHue;
      console.log("Slider value set to:", this.currentHue);
      this.attachEventListeners();
    } else {
      console.error("Hue slider element not found!");
    }

    // Initial color update
    setTimeout(() => {
      console.log("Force updating colors on initialization");
      this.updateAllColors();
      this.updateHueDisplay(this.currentHue);
    }, 100);

    // Setup observers
    this.setupObservers();

    console.log("Hue slider initialization complete");
  },

  // Update hue display
  updateHueDisplay(hue) {
    // Update preview sample
    const previewSample = document.querySelector(".hue-preview-sample");
    if (previewSample) {
      previewSample.style.background = `hsl(${hue}, 70%, 60%)`;
    }

    // Update slider thumb color
    const hueColor = `hsl(${hue}, 70%, 60%)`;
    document.documentElement.style.setProperty("--current-hue-color", hueColor);
  },

  // Main update function - WITH HIGH CONTRAST SUPPORT
  updateAllColors() {
    const theme = window.ThemeSwitcher
      ? ThemeSwitcher.getCurrentTheme()
      : "light";
    console.log(
      "Updating colors for theme:",
      theme,
      "brandHue:",
      this.currentHue,
      "darkAccentHue:",
      this.darkAccentHue,
      "lightAccentHue:",
      this.lightAccentHue
    );

    // Check if ColorSystem exists
    if (!window.ColorSystem) {
      console.error("ColorSystem not found!");
      return;
    }

    // Check current contrast mode
    const currentContrast =
      window.ContrastControl?.getCurrentContrast() || "normal";

    if (currentContrast === "normal" || currentContrast === "maximum") {
      // Normal or Maximum Mode: Use standard ColorSystem
      const primaryColors = ColorSystem.calculatePrimaryColors(
        this.currentHue,
        theme
      );
      const secondaryColors = ColorSystem.calculateSecondaryColors(
        this.currentHue,
        theme
      );
      const neutralColors = ColorSystem.calculateNeutralColors(
        this.currentHue,
        theme
      );

      // Pass both darkAccentHue and lightAccentHue so ColorSystem can decide which to use
      const accentColors = ColorSystem.calculateAccentColors(
        this.currentHue,
        theme,
        this.darkAccentHue,
        this.lightAccentHue
      );

      // Set all color variables
      this.setColorVariables("primary", primaryColors);
      this.setColorVariables("secondary", secondaryColors);
      this.setColorVariables("neutral", neutralColors);
      this.setColorVariables("accent", accentColors);
    }

    // High Contrast Mode: Override with special colors
    if (currentContrast === "high" && window.ContrastColorCalculator) {
      console.log("Applying high contrast colors for hue:", this.currentHue);

      // Nutze die Methode die lightAccentHue berücksichtigt
      const highContrastColors =
        ContrastColorCalculator.calculateHighContrastColorsWithAccents(
          this.currentHue,
          theme,
          this.lightAccentHue // Übergibt den gespeicherten lightAccentHue
        );

      ContrastColorCalculator.applyHighContrastColors(highContrastColors);
    }

    // Brand Color CSS Variables (always set)
    document.documentElement.style.setProperty("--brand-hue", this.currentHue);
    document.documentElement.style.setProperty(
      "--brand-color",
      ColorSystem.getColorWithFallback(
        `oklch(87.76% 0.1637 ${this.currentHue})`,
        `hsl(${this.currentHue}, 70%, 60%)`
      )
    );
    document.documentElement.style.setProperty(
      "--teal",
      ColorSystem.getColorWithFallback(
        `oklch(87.76% 0.1637 ${this.currentHue})`,
        `hsl(${this.currentHue}, 70%, 60%)`
      )
    );

    // Update Accent Hue for external use
    const currentAccentHue =
      theme === "dark" ? this.darkAccentHue : this.lightAccentHue;
    document.documentElement.style.setProperty(
      "--p-accent-hue",
      currentAccentHue
    );
    document.documentElement.style.setProperty(
      "--accent-hue",
      currentAccentHue
    );
    document.documentElement.style.setProperty(
      "--accent-hue-dark",
      this.darkAccentHue
    );
    document.documentElement.style.setProperty(
      "--accent-hue-light",
      this.lightAccentHue
    );

    console.log("All color scales updated successfully");

    // Trigger event for other modules
    window.dispatchEvent(
      new CustomEvent("colorsUpdated", {
        detail: {
          hue: this.currentHue,
          theme: theme,
          contrast: currentContrast,
          darkAccentHue: this.darkAccentHue,
          lightAccentHue: this.lightAccentHue,
        },
      })
    );
  },

  // Helper to set color variables
  setColorVariables(prefix, colors) {
    Object.entries(colors).forEach(([shade, color]) => {
      document.documentElement.style.setProperty(
        `--p-${prefix}-${shade}`,
        color
      );
    });
  },

  // Update hue value
  updateHue(newHue, skipTransition = false) {
    if (this.isUpdating) return;
    this.isUpdating = true;

    const prevHue = this.currentHue;
    console.log("Updating hue from", prevHue, "to", newHue);
    this.currentHue = newHue;

    // Update the light accent hue when brand hue changes
    if (window.ColorSystem && ColorSystem.adjustLightAccentHue) {
      this.lightAccentHue = ColorSystem.adjustLightAccentHue(this.currentHue);
    } else {
      // Fallback calculation
      this.lightAccentHue = (this.currentHue + 180) % 360;
    }

    // Update darkAccentHue intelligently:
    // - If the darkAccentHue was exactly equal to the previous brand hue (i.e. it followed the slider),
    //   we update it to the new brand hue (so dark-mode accent follows the slider).
    // - If the user had previously set a custom darkAccentHue (different from prevHue), we leave it alone.
    if (this.darkAccentHue === prevHue) {
      this.darkAccentHue = this.currentHue;
    }

    if (skipTransition && window.Utils) {
      Utils.disableTransitions();
    }

    // Update all calculated colors
    this.updateAllColors();

    // Update display elements
    this.updateHueDisplay(this.currentHue);

    // Update form elements (avoid infinite loops)
    if (
      this.hueSlider &&
      Math.abs(parseFloat(this.hueSlider.value) - this.currentHue) > 0.01
    ) {
      this.hueSlider.value = this.currentHue;
    }

    // Save to localStorage (also save darkAccentHue now)
    try {
      if (window.Utils && Utils.safeSetItem) {
        Utils.safeSetItem("a11y-hue", this.currentHue.toString());
        Utils.safeSetItem(
          "a11y-light-accent-hue",
          this.lightAccentHue.toString()
        );
        Utils.safeSetItem(
          "a11y-dark-accent-hue",
          this.darkAccentHue.toString()
        );
      } else {
        localStorage.setItem("a11y-hue", this.currentHue.toString());
        localStorage.setItem(
          "a11y-light-accent-hue",
          this.lightAccentHue.toString()
        );
        localStorage.setItem(
          "a11y-dark-accent-hue",
          this.darkAccentHue.toString()
        );
      }
      console.log(
        "Hue & accent values saved:",
        this.currentHue,
        this.lightAccentHue,
        this.darkAccentHue
      );
    } catch (err) {
      console.warn("Failed to save hue:", err);
    }

    // Announce to screen readers (debounced)
    if (this.statusEl && !this.isDragging) {
      clearTimeout(window.hueAnnounceTimeout);
      window.hueAnnounceTimeout = setTimeout(() => {
        if (this.statusEl) {
          this.statusEl.textContent = `Akzentfarbe wurde angepasst`;
          setTimeout(() => {
            if (this.statusEl) {
              this.statusEl.textContent = "";
            }
          }, 2000);
        }
      }, 300);
    }

    if (skipTransition && window.Utils) {
      Utils.enableTransitions();
    }

    // Dispatch event for other modules
    window.dispatchEvent(
      new CustomEvent("hueChanged", {
        detail: {
          hue: this.currentHue,
          lightAccentHue: this.lightAccentHue,
          darkAccentHue: this.darkAccentHue,
        },
      })
    );

    this.isUpdating = false;
  },

  // Attach event listeners
  attachEventListeners() {
    if (!this.hueSlider) return;

    // Input handling for smoothness
    this.hueSlider.addEventListener("input", (e) => {
      this.isDragging = true;
      const newHue = parseFloat(e.target.value);
      if (!isNaN(newHue) && !this.isUpdating) {
        this.updateHue(newHue, true);
      }
    });

    // When user releases slider
    this.hueSlider.addEventListener("change", (e) => {
      this.isDragging = false;
      const newHue = parseFloat(e.target.value);
      if (!isNaN(newHue)) {
        this.updateHue(newHue, false);
      }
    });

    // Mouse events
    this.hueSlider.addEventListener(
      "mousedown",
      () => (this.isDragging = true)
    );
    this.hueSlider.addEventListener("mouseup", () => (this.isDragging = false));
    this.hueSlider.addEventListener(
      "mouseleave",
      () => (this.isDragging = false)
    );

    // Touch events
    this.hueSlider.addEventListener(
      "touchstart",
      () => (this.isDragging = true)
    );
    this.hueSlider.addEventListener(
      "touchend",
      () => (this.isDragging = false)
    );

    // Keyboard navigation
    this.hueSlider.addEventListener("keydown", (e) => {
      let step = 1;
      if (e.shiftKey) step = 10;
      if (e.ctrlKey || e.metaKey) step = 0.1;

      let newHue = this.currentHue;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newHue = Math.min(360, this.currentHue + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newHue = Math.max(0, this.currentHue - step);
          break;
        case "Home":
          e.preventDefault();
          newHue = 0;
          break;
        case "End":
          e.preventDefault();
          newHue = 360;
          break;
        case "PageUp":
          e.preventDefault();
          newHue = Math.min(360, this.currentHue + 30);
          break;
        case "PageDown":
          e.preventDefault();
          newHue = Math.max(0, this.currentHue - 30);
          break;
      }

      if (newHue !== this.currentHue) {
        this.updateHue(newHue, true);
      }
    });

    console.log("Hue slider event listeners attached");
  },

  // Setup observers
  setupObservers() {
    // Theme change observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "class" ||
            mutation.attributeName === "data-theme")
        ) {
          setTimeout(() => {
            console.log("Theme change detected, recalculating colors");
            this.updateAllColors();
          }, 10);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    // Preset color shortcuts
    document.addEventListener("keydown", (e) => {
      const modalOpen = document.querySelector(".a11y-modal-overlay.open");
      if (!e.altKey || !modalOpen) return;

      const presets = {
        r: 0,
        o: 30,
        y: 60,
        g: 120,
        c: 180,
        b: 240,
        p: 300,
        t: 176.2,
      };

      const key = e.key.toLowerCase();
      if (presets.hasOwnProperty(key)) {
        e.preventDefault();
        this.updateHue(presets[key], false);

        if (this.statusEl) {
          const colorNames = {
            0: "Rot",
            30: "Orange",
            60: "Gelb",
            120: "Grün",
            180: "Cyan",
            240: "Blau",
            300: "Magenta",
            176.2: "Türkis",
          };
          this.statusEl.textContent = `Farbvoreinstellung: ${
            colorNames[presets[key]]
          }`;
        }
      }
    });
  },

  // Reset function
  resetHue() {
    this.updateHue(176.2, false);
  },
};

// Export public functions
window.HueSliderControl = HueSliderControl;
window.updateCurrentHue = (hue, skipTransition) =>
  HueSliderControl.updateHue(hue, skipTransition);
window.getCurrentHue = () => HueSliderControl.currentHue;
window.updateAllColorSchemes = () => HueSliderControl.updateAllColors();
window.resetHue = () => HueSliderControl.resetHue();

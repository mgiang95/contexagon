// a11y-density-control.js
// Handles layout density adjustments for better spacing

const DensityControl = {
  // State
  currentDensity: "cozy",
  densityButtons: null,
  statusEl: null,
  isChanging: false,

  // Density scale values mapping
  densityScaleValues: {
    compact: 0.75,
    cozy: 1.0,
    roomy: 1.25,
  },

  // Initialize
  init() {
    console.log("Initializing density control...");

    this.densityButtons = document.querySelectorAll(".density-toggle");
    this.statusEl = document.getElementById("a11y-status");

    if (this.densityButtons.length === 0) {
      console.warn("No density toggle buttons found");
      return;
    }

    // Set initial density multiplier
    document.documentElement.style.setProperty("--_density-multiplier", "1");

    this.attachEventListeners();
    this.loadSavedDensity();

    console.log("Density control initialized");
  },

  // Attach event listeners
  attachEventListeners() {
    this.densityButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const density = button.dataset.density;
        if (density) {
          this.setDensity(density, false);
        }
      });

      // Keyboard support
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const density = button.dataset.density;
          if (density) {
            this.setDensity(density, false);
          }
        }
      });
    });
  },

  // Set density
  setDensity(density, skipAnimation = false) {
    if (this.isChanging && !skipAnimation) return;
    if (this.currentDensity === density && !skipAnimation) return;

    console.log(`Setting density to: ${density}`);

    try {
      if (!skipAnimation) {
        this.isChanging = true;
        document.documentElement.classList.add("density-scaling-active");
      }

      this.currentDensity = density;
      const root = document.documentElement;

      // Remove all density classes
      if (root) {
        root.classList.remove("a11y-density-compact", "a11y-density-roomy");

        // Add new class if not cozy (default)
        if (density !== "cozy") {
          root.classList.add(`a11y-density-${density}`);
        }
      }

      // Update CSS custom property
      if (root && this.densityScaleValues[density]) {
        root.style.setProperty(
          "--_density-multiplier",
          this.densityScaleValues[density]
        );
      }

      // Update button states
      this.updateButtonStates(density);

      // Announce change
      if (!skipAnimation) {
        this.announceChange(density);
      }

      // Save preference
      Utils.safeSetItem("a11y-density", density);

      // Trigger custom event
      window.dispatchEvent(
        new CustomEvent("densityChanged", {
          detail: { density, scale: this.densityScaleValues[density] },
        })
      );

      // Remove transition class
      if (!skipAnimation) {
        setTimeout(() => {
          document.documentElement.classList.remove("density-scaling-active");
          this.isChanging = false;
        }, 350);
      }
    } catch (error) {
      console.error("Error changing density:", error);
      this.isChanging = false;
    }
  },

  // Update button states
  updateButtonStates(activeDensity) {
    this.densityButtons.forEach((btn) => {
      const isActive = btn.dataset.density === activeDensity;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");

      // Update aria-label
      const densityNames = {
        compact: "Kompakt",
        cozy: "Normal",
        roomy: "Luftig",
      };
      btn.setAttribute(
        "aria-label",
        `Layout-Dichte ${densityNames[btn.dataset.density]} ${
          isActive ? "(aktiv)" : ""
        }`
      );
    });
  },

  // Announce change
  announceChange(density) {
    const densityNames = {
      compact: "kompakte",
      cozy: "normale",
      roomy: "luftige",
    };

    if (this.statusEl) {
      clearTimeout(window.densityAnnounceTimeout);
      window.densityAnnounceTimeout = setTimeout(() => {
        this.statusEl.textContent = `Layout-Dichte geändert zu: ${densityNames[density]} Ansicht`;
      }, 100);
    }
  },

  // Load saved preference
  loadSavedDensity() {
    const savedDensity = localStorage.getItem("a11y-density") || "cozy";
    console.log(`Loading saved density: ${savedDensity}`);

    if (this.densityScaleValues.hasOwnProperty(savedDensity)) {
      this.setDensity(savedDensity, true);
    } else {
      console.warn("Invalid saved density:", savedDensity);
      this.setDensity("cozy", true);
    }
  },

  // Get current density
  getCurrentDensity() {
    return this.currentDensity;
  },

  // Reset to default
  reset() {
    this.setDensity("cozy", false);
  },
};

// Export for use
window.DensityControl = DensityControl;
window.resetDensity = () => DensityControl.reset();

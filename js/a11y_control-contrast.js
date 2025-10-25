// a11y-contrast-control.js

const ContrastControl = {
  // State
  currentContrast: "normal",
  contrastButtons: null,
  statusEl: null,

  // Initialize
  init() {
    console.log("Initializing contrast control...");

    // Suche nach Buttons mit der contrast-toggle Klasse
    this.contrastButtons = document.querySelectorAll(".contrast-toggle");
    this.statusEl = document.getElementById("a11y-status");

    if (this.contrastButtons.length === 0) {
      console.warn("No contrast toggle buttons found");
      return;
    }

    this.attachEventListeners();
    this.loadSavedContrast();

    console.log("Contrast control initialized");
  },

  // Attach event listeners
  attachEventListeners() {
    this.contrastButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.setContrast(button.dataset.contrast);
      });

      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.setContrast(button.dataset.contrast);
        }
      });
    });
  },

  // Set contrast level
  setContrast(contrast) {
    if (this.currentContrast === contrast) return;

    console.log(`Setting contrast to: ${contrast}`);
    this.currentContrast = contrast;

    const root = document.documentElement;

    // Remove all contrast classes
    root.classList.remove("a11y-contrast-maximum");

    // Add new class if not normal
    if (contrast === "maximum") {
      root.classList.add("a11y-contrast-maximum");
    }

    // Update button states using the standard toggle classes
    this.updateButtonStates(contrast);

    // Announce change
    this.announceChange(contrast);

    // Save preference
    if (window.Utils && Utils.safeSetItem) {
      Utils.safeSetItem("a11y-contrast", contrast);
    } else {
      localStorage.setItem("a11y-contrast", contrast);
    }

    // Trigger custom event
    window.dispatchEvent(
      new CustomEvent("contrastChanged", {
        detail: { contrast },
      })
    );
  },

  // Update button states - angepasst für button--toggle
  updateButtonStates(activeContrast) {
    this.contrastButtons.forEach((btn) => {
      const isActive = btn.dataset.contrast === activeContrast;

      // Verwende die Standard-Toggle-Klassen
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");

      const contrastNames = {
        normal: "Normal",
        maximum: "Maximum",
      };

      // Update aria-label
      btn.setAttribute(
        "aria-label",
        `Kontrast ${contrastNames[btn.dataset.contrast]} ${
          isActive ? "(aktiv)" : ""
        }`
      );
    });
  },

  // Announce change
  announceChange(contrast) {
    const contrastNames = {
      normal: "normaler",
      maximum: "maximaler",
    };

    if (this.statusEl) {
      this.statusEl.textContent = `Kontrast geändert zu: ${contrastNames[contrast]} Kontrast`;
      setTimeout(() => {
        if (this.statusEl) {
          this.statusEl.textContent = "";
        }
      }, 2000);
    }
  },

  // Load saved preference
  loadSavedContrast() {
    let savedContrast = "normal";

    if (window.Utils && Utils.safeGetItem) {
      savedContrast = Utils.safeGetItem("a11y-contrast") || "normal";
    } else {
      try {
        savedContrast = localStorage.getItem("a11y-contrast") || "normal";
      } catch (e) {
        console.warn("Could not load saved contrast:", e);
      }
    }

    console.log(`Loading saved contrast: ${savedContrast}`);

    // Nur noch normal und maximum erlaubt
    if (!["normal", "maximum"].includes(savedContrast)) {
      savedContrast = "normal";
    }

    this.setContrast(savedContrast);
  },

  // Get current contrast
  getCurrentContrast() {
    return this.currentContrast;
  },

  // Reset to normal
  reset() {
    this.setContrast("normal");
  },
};

// Export for use
window.ContrastControl = ContrastControl;
window.resetContrast = () => ContrastControl.reset();

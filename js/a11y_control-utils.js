// a11y-utils.js
// Shared utility functions and helpers for accessibility features

const Utils = {
  // Browser compatibility check
  browserCompatibilityCheck() {
    const issues = [];

    // OKLCH Support
    if (!CSS.supports("color", "oklch(50% 0.1 180)")) {
      issues.push("OKLCH colors not supported");
      console.warn("Browser unterstützt OKLCH nicht - verwende HSL Fallbacks");
    }

    // LocalStorage
    if (!this.isLocalStorageAvailable()) {
      issues.push("LocalStorage blocked");
    }

    // CSS Custom Properties
    if (!CSS.supports("color", "var(--test-color)")) {
      issues.push("CSS Custom Properties not supported");
    }

    return issues;
  },

  // Check if localStorage is available
  isLocalStorageAvailable() {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("LocalStorage nicht verfügbar:", e);
      return false;
    }
  },

  // Safe localStorage getter
  safeGetItem(key) {
    if (this.isLocalStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("LocalStorage Lesefehler:", e);
        return null;
      }
    }
    return null;
  },

  // Safe localStorage setter
  safeSetItem(key, value) {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn("LocalStorage Schreibfehler:", e);
        return false;
      }
    }
    return false;
  },

  // Safe localStorage remover
  safeRemoveItem(key) {
    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn("LocalStorage Löschfehler:", e);
        return false;
      }
    }
    return false;
  },

  // Transition helpers
  disableTransitions() {
    document.documentElement.classList.add("hue-changing");
  },

  enableTransitions() {
    setTimeout(() => {
      document.documentElement.classList.remove("hue-changing");
    }, 30);
  },

  // Screen Reader Announcements
  announceA11yChange(message) {
    const statusEl = document.getElementById("a11y-status");
    if (statusEl && message) {
      statusEl.textContent = message;
      // Clear after announcement to prepare for next
      setTimeout(() => {
        statusEl.textContent = "";
      }, 1000);
    }
  },

  // Button State Management
  updateButtonStates(buttons, activeButton) {
    buttons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });

    if (activeButton) {
      activeButton.classList.add("active");
      activeButton.setAttribute("aria-pressed", "true");
    }
  },

  // System Preferences Detection
  detectSystemPreferences() {
    return {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      highContrast: window.matchMedia("(prefers-contrast: high)").matches,
      darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    };
  },

  // Apply CSS class to documentElement
  applyA11yClass(className, shouldAdd = true) {
    if (shouldAdd) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  },

  // Remove all a11y classes from a category
  removeA11yClasses(prefix) {
    const classes = this.getA11yCssClasses();
    const relevantClasses = classes.filter((cls) => cls.startsWith(prefix));
    relevantClasses.forEach((cls) => {
      document.documentElement.classList.remove(cls);
    });
  },

  // Get all a11y settings keys
  getA11ySettingsKeys() {
    return [
      "a11y-font-size",
      "a11y-density",
      "a11y-contrast",
      "a11y-theme",
      "a11y-hue",
      "a11y-dark-accent-hue",
      "a11y-light-accent-hue",
    ];
  },

  // Get all a11y CSS classes
  getA11yCssClasses() {
    return [
      // Font size
      "a11y-font-size-large",
      "a11y-font-size-xlarge",
      // Density
      "a11y-density-compact",
      "a11y-density-roomy",
      // Contrast
      "a11y-contrast-high",
      "a11y-contrast-maximum",
      // Theme
      "a11y-theme-dark",
      "a11y-theme-light",
      "a11y-theme-auto",
      // Hue variations
      "a11y-hue-blue",
      "a11y-hue-green",
      "a11y-hue-purple",
      "a11y-hue-orange",
      "a11y-hue-teal",
    ];
  },

  // Reset all a11y settings
  resetA11ySettings() {
    // Remove all localStorage entries
    this.getA11ySettingsKeys().forEach((key) => {
      this.safeRemoveItem(key);
    });

    // Remove all CSS classes
    this.getA11yCssClasses().forEach((className) => {
      document.documentElement.classList.remove(className);
    });

    // Reset CSS custom properties
    document.documentElement.style.removeProperty("--_font-scale-multiplier");
    document.documentElement.style.removeProperty("--hue-accent");

    // Announce change
    this.announceA11yChange(
      "Alle Barrierefreiheitseinstellungen wurden zurückgesetzt"
    );
  },

  // Get current a11y state
  getCurrentA11yState() {
    const state = {};

    this.getA11ySettingsKeys().forEach((key) => {
      state[key] = this.safeGetItem(key);
    });

    // Add system preferences
    state.systemPreferences = this.detectSystemPreferences();

    return state;
  },

  // Debug helper
  logA11yState() {
    console.group("Current A11y State");
    console.log("Settings:", this.getCurrentA11yState());
    console.log(
      "Active Classes:",
      this.getA11yCssClasses().filter((cls) =>
        document.documentElement.classList.contains(cls)
      )
    );
    console.log("Browser Support:", this.browserCompatibilityCheck());
    console.groupEnd();
  },
};

// Export for use in other modules
window.Utils = Utils;

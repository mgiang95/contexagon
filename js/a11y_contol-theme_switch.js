// a11y-theme-switcher.js
// Handles theme switching, toggle functionality, and logo management

const ThemeSwitcher = {
  // Initialize variables
  transitionTimeout: null,

  // Get current theme
  getCurrentTheme() {
    const rootElement = document.documentElement;

    // Prioritize data-theme attribute
    const dataTheme = rootElement.getAttribute("data-theme");
    if (dataTheme === "dark" || dataTheme === "light") {
      return dataTheme;
    }

    // Then check theme classes
    const hasExplicitDark = rootElement.classList.contains("a11y-theme-dark");
    const hasExplicitLight = rootElement.classList.contains("a11y-theme-light");

    if (hasExplicitDark) return "dark";
    if (hasExplicitLight) return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },

  // Update theme labels based on current theme
  updateThemeLabels(theme) {
    const lightLabel = document.querySelector(".theme-label-light");
    const darkLabel = document.querySelector(".theme-label-dark");

    if (lightLabel && darkLabel) {
      if (theme === "dark") {
        lightLabel.classList.remove("active");
        darkLabel.classList.add("active");
      } else {
        lightLabel.classList.add("active");
        darkLabel.classList.remove("active");
      }
    }
  },

  // Update logos based on theme
  updateThemeLogos(theme) {
    const navLogo = document.querySelector(".header-image");
    const footerLogo = document.querySelector("figure.footer-logo img");

    if (navLogo) {
      if (theme === "dark") {
        navLogo.src =
          "https://contexagon.com/wp-content/uploads/2025/09/logo-on-dark.png";
        navLogo.srcset =
          "https://contexagon.com/wp-content/uploads/2025/09/logo-on-dark@4x.png 1x, https://contexagon.com/wp-content/uploads/2025/09/logo-on-dark@4x.png 2x";
      } else {
        navLogo.src =
          "https://contexagon.com/wp-content/uploads/2025/09/logo-on-light.png";
        navLogo.srcset =
          "https://contexagon.com/wp-content/uploads/2025/09/logo-on-light@4x.png 1x, https://contexagon.com/wp-content/uploads/2025/09/logo-on-light@4x.png 2x";
      }
    }

    if (footerLogo) {
      if (theme === "dark") {
        footerLogo.src =
          "https://contexagon.com/wp-content/uploads/2025/02/logo_claim-on_dark.png";
        footerLogo.srcset =
          "https://contexagon.com/wp-content/uploads/2025/02/logo_claim-on_dark.png";
      } else {
        footerLogo.src =
          "https://contexagon.com/wp-content/uploads/2025/02/logo_claim-on_light.png";
        footerLogo.srcset =
          "https://contexagon.com/wp-content/uploads/2025/02/logo_claim-on_light.png";
      }
    }
    console.log("Logos updated for theme:", theme);
  },

  // Clean up old theme settings
  cleanupOldThemeSettings() {
    const keysToRemove = [
      "theme-mode",
      "auto-theme",
      "system-theme",
      "follow-system",
      "theme-auto",
      "auto-mode",
      "system-follows",
    ];

    keysToRemove.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log("Removed old theme key:", key);
      }
    });
  },

  // Force remove auto theme logic
  forceRemoveAutoTheme() {
    const rootElement = document.documentElement;

    const classesToRemove = [
      "auto-theme",
      "theme-auto",
      "theme-auto-active", // Added this
      "system-theme",
      "follow-system",
      "auto-mode",
      "theme-system",
    ];

    classesToRemove.forEach((cls) => {
      rootElement.classList.remove(cls);
      document.body.classList.remove(cls); // Also check body
    });

    // Remove from all elements
    document.querySelectorAll(".theme-auto-active").forEach((el) => {
      el.classList.remove("theme-auto-active");
    });

    ["auto-theme", "theme-auto", "system-follows", "follow-system"].forEach(
      (key) => {
        localStorage.removeItem(key);
      }
    );

    console.log("Auto-theme logic forcefully removed");
  },

  // Force enable toggle
  forceEnableToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      // Remove all disabling attributes
      toggle.disabled = false;
      toggle.removeAttribute("disabled");

      // Force styles inline with highest priority
      toggle.style.cssText = `
        opacity: 1 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        display: inline-block !important;
        visibility: visible !important;
      `;

      const container = toggle.closest(".toggle-switch");
      if (container) {
        container.style.cssText = `
          opacity: 1 !important;
          pointer-events: auto !important;
          cursor: pointer !important;
        `;
        container.classList.remove("disabled", "auto-mode", "system-follows");
        container.removeAttribute("disabled");
      }

      // Check for parent elements that might be blocking
      let parent = toggle.parentElement;
      while (parent && parent !== document.body) {
        if (getComputedStyle(parent).pointerEvents === "none") {
          console.warn("Parent element blocking pointer events:", parent);
          parent.style.pointerEvents = "auto";
        }
        parent = parent.parentElement;
      }

      console.log("Toggle force-enabled with inline styles");
    }
  },

  // Initialize theme toggle
  initializeThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) {
      console.warn("Theme toggle not found");
      return;
    }

    console.log("=== THEME TOGGLE INITIALIZATION ===");

    // Force remove auto theme logic
    this.forceRemoveAutoTheme();

    // Force enable the toggle
    this.forceEnableToggle();

    // Remove old event listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    // Add enhanced event listeners
    newToggle.addEventListener("change", (e) => {
      console.log("=== TOGGLE CHANGE EVENT ===");
      console.log("Toggle changed:", newToggle.checked);

      // Add transition class for smooth theme switch
      document.documentElement.classList.add("theme-transition");
      document.body.classList.add("theme-transition");

      // Clear any existing timeout
      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
      }

      // Set timeout to remove transition class
      this.transitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
        document.body.classList.remove("theme-transition");
        this.transitionTimeout = null;
      }, 300);

      const rootElement = document.documentElement;

      // Force remove any auto-theme classes first
      const autoClasses = [
        "auto-theme",
        "theme-auto",
        "system-theme",
        "follow-system",
        "auto-mode",
      ];
      autoClasses.forEach((cls) => rootElement.classList.remove(cls));

      // Remove existing theme classes and attributes
      rootElement.classList.remove("a11y-theme-dark", "a11y-theme-light");
      rootElement.removeAttribute("data-theme");

      const newTheme = newToggle.checked ? "dark" : "light";

      if (newToggle.checked) {
        // Dark mode
        rootElement.classList.add("a11y-theme-dark");
        rootElement.setAttribute("data-theme", "dark");
        Utils.safeSetItem("a11y-theme", "dark");
        console.log("Switched to DARK mode");
      } else {
        // Light mode
        rootElement.classList.add("a11y-theme-light");
        rootElement.setAttribute("data-theme", "light");
        Utils.safeSetItem("a11y-theme", "light");
        console.log("Switched to LIGHT mode");
      }

      // Update theme-specific logos and labels
      this.updateThemeLogos(newTheme);
      this.updateThemeLabels(newTheme);

      // Update colors after theme change
      setTimeout(() => {
        if (window.HueSliderControl) {
          window.HueSliderControl.updateAllColors();
        }
        console.log("Colors updated after theme change");
      }, 50);
    });

    // Add click event as backup
    newToggle.addEventListener("click", function (e) {
      console.log("Toggle clicked - ensuring not disabled");

      if (this.disabled) {
        console.warn("Toggle was disabled, forcing enable");
        this.disabled = false;
      }

      this.style.pointerEvents = "auto";
      this.style.opacity = "1";
    });

    // Set initial state based on saved preference or system
    const savedTheme = localStorage.getItem("a11y-theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let isDark = false;
    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
      isDark = true;
    }

    const initialTheme = isDark ? "dark" : "light";

    newToggle.checked = isDark;
    const rootElement = document.documentElement;

    // Clean up classes first
    rootElement.classList.remove("a11y-theme-dark", "a11y-theme-light");
    rootElement.setAttribute("data-theme", initialTheme);
    rootElement.classList.toggle("a11y-theme-dark", isDark);
    rootElement.classList.toggle("a11y-theme-light", !isDark);

    // Update theme-specific logos and labels
    this.updateThemeLogos(initialTheme);
    this.updateThemeLabels(initialTheme);

    console.log("Theme toggle initialized. Dark mode:", isDark);
    console.log("Root element classes:", rootElement.className);
  },

  // Debug toggle state
  debugToggleState() {
    const toggle = document.getElementById("theme-toggle");
    console.log("=== TOGGLE DEBUG ===");
    console.log("Element exists:", !!toggle);
    console.log("Disabled:", toggle?.disabled);
    console.log("Checked:", toggle?.checked);
    console.log("Value:", toggle?.value);
    console.log("CSS disabled:", toggle?.matches(":disabled"));
    console.log(
      "Computed styles:",
      toggle
        ? {
            opacity: getComputedStyle(toggle).opacity,
            pointerEvents: getComputedStyle(toggle).pointerEvents,
            cursor: getComputedStyle(toggle).cursor,
            display: getComputedStyle(toggle).display,
            visibility: getComputedStyle(toggle).visibility,
          }
        : "Toggle not found"
    );

    const container = toggle?.closest(".toggle-switch");
    console.log("Container classes:", container?.className);
    console.log("Container disabled:", container?.hasAttribute("disabled"));
    console.log(
      "Container styles:",
      container
        ? {
            opacity: getComputedStyle(container).opacity,
            pointerEvents: getComputedStyle(container).pointerEvents,
          }
        : "Container not found"
    );

    // Check for interfering styles
    const allStyles = toggle ? window.getComputedStyle(toggle, null) : null;
    if (allStyles) {
      console.log("All applied styles:", allStyles);
    }

    return toggle;
  },

  // Initialize
  init() {
    // Clean up old theme settings
    this.cleanupOldThemeSettings();
    this.forceRemoveAutoTheme();

    // Initialize toggle with multiple attempts for reliability
    setTimeout(() => {
      console.log("First toggle initialization attempt");
      this.initializeThemeToggle();
    }, 50);

    setTimeout(() => {
      console.log("Second toggle initialization attempt (backup)");
      const toggle = document.getElementById("theme-toggle");
      if (toggle && toggle.disabled) {
        console.log("Toggle still disabled, forcing fix");
        this.initializeThemeToggle();
      }
    }, 200);

    // Final check and force-enable
    setTimeout(() => {
      const toggle = document.getElementById("theme-toggle");
      if (toggle) {
        this.forceEnableToggle();
        console.log("Final toggle state check completed");
        this.debugToggleState();
      }
    }, 500);

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addListener((e) => {
      setTimeout(() => {
        console.log("System theme change detected");
        // Update logos if following system theme
        if (!localStorage.getItem("a11y-theme")) {
          this.updateThemeLogos(e.matches ? "dark" : "light");
        }
        if (window.HueSliderControl) {
          window.HueSliderControl.updateAllColors();
        }
      }, 10);
    });
  },
};

// Export for debugging
window.ThemeSwitcher = ThemeSwitcher;

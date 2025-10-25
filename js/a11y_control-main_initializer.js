// a11y-main.js
// Main initialization file that loads all modules in correct order

document.addEventListener("DOMContentLoaded", function () {
  console.log("=== A11Y System Initialization ===");

  // Initialize utilities first (needed by other modules)
  if (window.Utils) {
    console.log("✓ Utils loaded");
  } else {
    console.error("✗ Utils module not loaded!");
  }

  // Initialize color system
  if (window.ColorSystem) {
    console.log("✓ ColorSystem loaded");
  } else {
    console.error("✗ ColorSystem module not loaded!");
  }

  // Initialize theme switcher
  if (window.ThemeSwitcher) {
    console.log("✓ ThemeSwitcher loaded");
    ThemeSwitcher.init();
  } else {
    console.error("✗ ThemeSwitcher module not loaded!");
  }

  // Initialize hue slider control
  if (window.HueSliderControl) {
    console.log("✓ HueSliderControl loaded");
    HueSliderControl.init();
  } else {
    console.error("✗ HueSliderControl module not loaded!");
  }

  // Initialize font control
  if (window.FontControl) {
    console.log("✓ FontControl loaded");
    FontControl.init();
  } else {
    console.error("✗ FontControl module not loaded!");
  }

  // Initialize density control
  if (window.DensityControl) {
    console.log("✓ DensityControl loaded");
    DensityControl.init();
  } else {
    console.error("✗ DensityControl module not loaded!");
  }

  // Initialize contrast control
  if (window.ContrastControl) {
    console.log("✓ ContrastControl loaded");
    ContrastControl.init();
  } else {
    console.error("✗ ContrastControl module not loaded!");
  }

  // Global debug functions
  window.fixThemeToggle = function () {
    console.log("=== MANUAL TOGGLE FIX ===");
    if (window.ThemeSwitcher) {
      ThemeSwitcher.debugToggleState();
      ThemeSwitcher.forceRemoveAutoTheme();
      ThemeSwitcher.forceEnableToggle();
      ThemeSwitcher.initializeThemeToggle();
      console.log("Toggle manually fixed");
    }
  };

  window.debugToggleState = function () {
    if (window.ThemeSwitcher) {
      return ThemeSwitcher.debugToggleState();
    }
  };

  window.forceEnableToggle = function () {
    if (window.ThemeSwitcher) {
      ThemeSwitcher.forceEnableToggle();
    }
  };

  window.cleanupOldThemeSettings = function () {
    if (window.ThemeSwitcher) {
      ThemeSwitcher.cleanupOldThemeSettings();
    }
  };

  window.forceRemoveAutoTheme = function () {
    if (window.ThemeSwitcher) {
      ThemeSwitcher.forceRemoveAutoTheme();
    }
  };

  window.updateThemeLogos = function (theme) {
    if (window.ThemeSwitcher) {
      ThemeSwitcher.updateThemeLogos(theme);
    }
  };

  console.log("=== A11Y System Ready ===");
});

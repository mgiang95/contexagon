// a11y-color-system.js
// Handles all color scale calculations and mathematical functions
// Bereinigt: Template-Strings, Hue-Modulo, kleinere Robustheits-Checks
// + Accent-Generation in Light-Mode jetzt dynamisch vom brandHue ableitbar

const ColorSystem = {
  // Configuration constants
  CONFIG: {
    baseChroma: 0.1637,
    neutralChroma: 0.02,
    primitiveChromaBase: 0.01,
  },

  // Mathematical helper
  pow(base, exponent) {
    return Math.pow(base, exponent);
  },

  // Color utility functions
  calculateComplementaryHue(hue, offset = 0) {
    // standard offset-based complementary-ish calculation; modulo 360
    const h = Number(hue) || 0;
    return (h + 30 + Number(offset || 0)) % 360;
  },

  adjustLightAccentHue(brandHue) {
    // convenience: returns an accent hue derived from the brand hue
    return this.calculateComplementaryHue(brandHue, 30);
  },

  // Fallback support
  getColorWithFallback(oklchColor, fallbackHsl) {
    try {
      if (CSS && CSS.supports && CSS.supports("color", "oklch(50% 0.1 180)")) {
        return oklchColor;
      }
    } catch (e) {
      // ignore and fall back
    }
    return fallbackHsl;
  },

  // Primary colors (Brand-based)
  calculatePrimaryColors(hue, theme) {
    const baseHue = Number(hue) || 0;
    const { baseChroma, primitiveChromaBase } = this.CONFIG;

    if (theme === "dark") {
      return {
        50: this.getColorWithFallback(
          `oklch(${99 + 2 * this.pow(0.6, 2)}% ${
            primitiveChromaBase + 0.1 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 15%, 99%)`
        ),
        100: this.getColorWithFallback(
          `oklch(${92 + 3 * this.pow(0.55, 2)}% ${
            primitiveChromaBase + 0.2 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 25%, 92%)`
        ),
        200: this.getColorWithFallback(
          `oklch(${85 + 5 * this.pow(0.5, 2)}% ${
            primitiveChromaBase + 0.3 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 35%, 85%)`
        ),
        300: this.getColorWithFallback(
          `oklch(${75 + 5 * this.pow(0.45, 2)}% ${
            primitiveChromaBase + 0.4 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 45%, 75%)`
        ),
        400: this.getColorWithFallback(
          `oklch(${65 + 5 * this.pow(0.4, 2)}% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 55%, 65%)`
        ),
        500: this.getColorWithFallback(
          `oklch(${55 + 5 * this.pow(0.35, 2)}% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 65%, 55%)`
        ),
        600: this.getColorWithFallback(
          `oklch(${45 - 5 * this.pow(0.3, 2)}% ${
            primitiveChromaBase + 0.8 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 75%, 45%)`
        ),
        700: this.getColorWithFallback(
          `oklch(${35 - 5 * this.pow(0.25, 2)}% ${
            primitiveChromaBase + 0.7 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 70%, 35%)`
        ),
        800: this.getColorWithFallback(
          `oklch(${25 - 5 * this.pow(0.2, 2)}% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 65%, 25%)`
        ),
        900: this.getColorWithFallback(
          `oklch(${20 - 5 * this.pow(0.15, 2)}% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 60%, 20%)`
        ),
        950: this.getColorWithFallback(
          `oklch(${15 - 5 * this.pow(0.1, 2)}% ${
            primitiveChromaBase + 0.4 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 55%, 15%)`
        ),
      };
    } else {
      // Light Mode
      return {
        50: this.getColorWithFallback(
          `oklch(${99 + 1 * this.pow(0.025, 2)}% ${
            primitiveChromaBase + 0.08 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 8%, 99%)`
        ),
        100: this.getColorWithFallback(
          `oklch(${95 + 5 * this.pow(0.1, 2)}% ${
            primitiveChromaBase + 0.15 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 15%, 95%)`
        ),
        200: this.getColorWithFallback(
          `oklch(${85 + 15 * this.pow(0.2, 2)}% ${
            primitiveChromaBase + 0.35 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 35%, 85%)`
        ),
        300: this.getColorWithFallback(
          `oklch(${75 + 25 * this.pow(0.3, 2)}% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 60%, 75%)`
        ),
        400: this.getColorWithFallback(
          `oklch(${65 + 35 * this.pow(0.4, 2)}% ${
            primitiveChromaBase + 0.8 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 80%, 65%)`
        ),
        500: this.getColorWithFallback(
          `oklch(${55 + 45 * this.pow(0.5, 2)}% ${
            primitiveChromaBase + 1.1 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 90%, 55%)`
        ),
        600: this.getColorWithFallback(
          `oklch(${45 - 45 * this.pow(0.5, 2)}% ${
            primitiveChromaBase + 1.3 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 95%, 45%)`
        ),
        700: this.getColorWithFallback(
          `oklch(${35 - 35 * this.pow(0.4, 2)}% ${
            primitiveChromaBase + 1.5 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 90%, 35%)`
        ),
        800: this.getColorWithFallback(
          `oklch(${25 - 25 * this.pow(0.3, 2)}% ${
            primitiveChromaBase + 1.7 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 85%, 25%)`
        ),
        900: this.getColorWithFallback(
          `oklch(${15 - 15 * this.pow(0.2, 2)}% ${
            primitiveChromaBase + 1.9 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 80%, 15%)`
        ),
        950: this.getColorWithFallback(
          `oklch(${10 - 10 * this.pow(0.1, 2)}% ${
            primitiveChromaBase + 2.3 * baseChroma
          } ${baseHue})`,
          `hsl(${baseHue}, 75%, 10%)`
        ),
      };
    }
  },

  // Secondary colors (Complementary)
  calculateSecondaryColors(brandHue, theme) {
    const complementaryHue = this.calculateComplementaryHue(brandHue);
    const baseHue = Number(brandHue) || 0;
    const { baseChroma, primitiveChromaBase } = this.CONFIG;

    if (theme === "dark") {
      return {
        50: this.getColorWithFallback(
          `oklch(97% ${
            primitiveChromaBase + 0.1 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 15%, 97%)`
        ),
        100: this.getColorWithFallback(
          `oklch(90% ${
            primitiveChromaBase + 0.2 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 25%, 90%)`
        ),
        200: this.getColorWithFallback(
          `oklch(82% ${
            primitiveChromaBase + 0.3 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 35%, 82%)`
        ),
        300: this.getColorWithFallback(
          `oklch(74% ${
            primitiveChromaBase + 0.4 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 45%, 74%)`
        ),
        400: this.getColorWithFallback(
          `oklch(66% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 55%, 66%)`
        ),
        500: this.getColorWithFallback(
          `oklch(58% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 65%, 58%)`
        ),
        600: this.getColorWithFallback(
          `oklch(50% ${
            primitiveChromaBase + 0.7 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 75%, 50%)`
        ),
        700: this.getColorWithFallback(
          `oklch(42% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 70%, 42%)`
        ),
        800: this.getColorWithFallback(
          `oklch(34% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 65%, 34%)`
        ),
        900: this.getColorWithFallback(
          `oklch(26% ${
            primitiveChromaBase + 0.4 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 60%, 26%)`
        ),
        950: this.getColorWithFallback(
          `oklch(18% ${
            primitiveChromaBase + 0.3 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 55%, 18%)`
        ),
      };
    } else {
      return {
        50: this.getColorWithFallback(
          `oklch(98% ${
            primitiveChromaBase + 0.05 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 10%, 98%)`
        ),
        100: this.getColorWithFallback(
          `oklch(94% ${
            primitiveChromaBase + 0.1 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 20%, 94%)`
        ),
        200: this.getColorWithFallback(
          `oklch(88% ${
            primitiveChromaBase + 0.2 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 30%, 88%)`
        ),
        300: this.getColorWithFallback(
          `oklch(82% ${
            primitiveChromaBase + 0.35 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 40%, 82%)`
        ),
        400: this.getColorWithFallback(
          `oklch(76% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 50%, 76%)`
        ),
        500: this.getColorWithFallback(
          `oklch(70% ${
            primitiveChromaBase + 0.7 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 60%, 70%)`
        ),
        600: this.getColorWithFallback(
          `oklch(58% ${
            primitiveChromaBase + 0.9 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 70%, 58%)`
        ),
        700: this.getColorWithFallback(
          `oklch(48% ${
            primitiveChromaBase + 0.8 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 75%, 48%)`
        ),
        800: this.getColorWithFallback(
          `oklch(38% ${
            primitiveChromaBase + 0.7 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 80%, 38%)`
        ),
        900: this.getColorWithFallback(
          `oklch(28% ${
            primitiveChromaBase + 0.6 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 75%, 28%)`
        ),
        950: this.getColorWithFallback(
          `oklch(18% ${
            primitiveChromaBase + 0.5 * baseChroma
          } ${complementaryHue})`,
          `hsl(${complementaryHue}, 70%, 18%)`
        ),
      };
    }
  },

  // Neutral colors (Brand-tinted)
  calculateNeutralColors(brandHue, theme) {
    const baseHue = Number(brandHue) || 0;
    const { neutralChroma } = this.CONFIG;
    const hueOffset = (theme === "dark" ? baseHue + 5 : baseHue - 3) % 360;

    if (theme === "dark") {
      return {
        50: this.getColorWithFallback(
          `oklch(95% ${neutralChroma * 0.3} ${hueOffset})`,
          `hsl(${hueOffset}, 5%, 95%)`
        ),
        100: this.getColorWithFallback(
          `oklch(90% ${neutralChroma * 0.4} ${hueOffset})`,
          `hsl(${hueOffset}, 6%, 90%)`
        ),
        200: this.getColorWithFallback(
          `oklch(80% ${neutralChroma * 0.5} ${hueOffset})`,
          `hsl(${hueOffset}, 7%, 80%)`
        ),
        300: this.getColorWithFallback(
          `oklch(70% ${neutralChroma * 0.6} ${hueOffset})`,
          `hsl(${hueOffset}, 8%, 70%)`
        ),
        400: this.getColorWithFallback(
          `oklch(60% ${neutralChroma * 0.7} ${hueOffset})`,
          `hsl(${hueOffset}, 9%, 60%)`
        ),
        500: this.getColorWithFallback(
          `oklch(50% ${neutralChroma * 0.8} ${hueOffset})`,
          `hsl(${hueOffset}, 10%, 50%)`
        ),
        600: this.getColorWithFallback(
          `oklch(40% ${neutralChroma * 0.9} ${hueOffset})`,
          `hsl(${hueOffset}, 11%, 40%)`
        ),
        700: this.getColorWithFallback(
          `oklch(30% ${neutralChroma} ${hueOffset})`,
          `hsl(${hueOffset}, 12%, 30%)`
        ),
        800: this.getColorWithFallback(
          `oklch(20% ${neutralChroma * 0.9} ${hueOffset})`,
          `hsl(${hueOffset}, 11%, 20%)`
        ),
        900: this.getColorWithFallback(
          `oklch(15% ${neutralChroma * 0.8} ${hueOffset})`,
          `hsl(${hueOffset}, 10%, 15%)`
        ),
        950: this.getColorWithFallback(
          `oklch(10% ${neutralChroma * 0.7} ${hueOffset})`,
          `hsl(${hueOffset}, 9%, 10%)`
        ),
      };
    } else {
      // Light Mode
      return {
        50: this.getColorWithFallback(
          `oklch(99% ${neutralChroma * 0.2} ${hueOffset})`,
          `hsl(${hueOffset}, 4%, 99%)`
        ),
        100: this.getColorWithFallback(
          `oklch(96% ${neutralChroma * 0.3} ${hueOffset})`,
          `hsl(${hueOffset}, 5%, 96%)`
        ),
        200: this.getColorWithFallback(
          `oklch(90% ${neutralChroma * 0.4} ${hueOffset})`,
          `hsl(${hueOffset}, 6%, 90%)`
        ),
        300: this.getColorWithFallback(
          `oklch(82% ${neutralChroma * 0.5} ${hueOffset})`,
          `hsl(${hueOffset}, 7%, 82%)`
        ),
        400: this.getColorWithFallback(
          `oklch(74% ${neutralChroma * 0.6} ${hueOffset})`,
          `hsl(${hueOffset}, 8%, 74%)`
        ),
        500: this.getColorWithFallback(
          `oklch(66% ${neutralChroma * 0.7} ${hueOffset})`,
          `hsl(${hueOffset}, 9%, 66%)`
        ),
        600: this.getColorWithFallback(
          `oklch(58% ${neutralChroma * 0.8} ${hueOffset})`,
          `hsl(${hueOffset}, 10%, 58%)`
        ),
        700: this.getColorWithFallback(
          `oklch(45% ${neutralChroma * 0.9} ${hueOffset})`,
          `hsl(${hueOffset}, 11%, 45%)`
        ),
        800: this.getColorWithFallback(
          `oklch(35% ${neutralChroma * 0.8} ${hueOffset})`,
          `hsl(${hueOffset}, 10%, 35%)`
        ),
        900: this.getColorWithFallback(
          `oklch(25% ${neutralChroma * 0.7} ${hueOffset})`,
          `hsl(${hueOffset}, 9%, 25%)`
        ),
        950: this.getColorWithFallback(
          `oklch(15% ${neutralChroma * 0.6} ${hueOffset})`,
          `hsl(${hueOffset}, 8%, 15%)`
        ),
      };
    }
  },

  // Accent colors (Theme-dependent) — LIGHT MODE now dynamic (no fixed magenta)
  calculateAccentColors(brandHue, theme, darkAccentHue, lightAccentHue) {
    const baseHue = Number(brandHue) || 0;
    const { baseChroma } = this.CONFIG;

    if (theme === "dark") {
      // Dark Mode: prefer provided darkAccentHue else fall back to brandHue
      const accentHue =
        Number(typeof darkAccentHue !== "undefined" ? darkAccentHue : baseHue) %
        360;
      const baseLightness = 87.76;

      return {
        50: this.getColorWithFallback(
          `oklch(96% ${baseChroma * 0.15} ${accentHue})`,
          `hsl(${accentHue}, 15%, 96%)`
        ),
        100: this.getColorWithFallback(
          `oklch(92% ${baseChroma * 0.3} ${accentHue})`,
          `hsl(${accentHue}, 30%, 92%)`
        ),
        200: this.getColorWithFallback(
          `oklch(88% ${baseChroma * 0.5} ${accentHue})`,
          `hsl(${accentHue}, 50%, 88%)`
        ),
        300: this.getColorWithFallback(
          `oklch(84% ${baseChroma * 0.75} ${accentHue})`,
          `hsl(${accentHue}, 70%, 84%)`
        ),
        400: this.getColorWithFallback(
          `oklch(82% ${baseChroma * 0.9} ${accentHue})`,
          `hsl(${accentHue}, 75%, 82%)`
        ),
        500: this.getColorWithFallback(
          `oklch(${baseLightness}% ${baseChroma} ${accentHue})`,
          `hsl(${accentHue}, 80%, ${baseLightness}%)`
        ),
        600: this.getColorWithFallback(
          `oklch(80% ${baseChroma * 1.05} ${accentHue})`,
          `hsl(${accentHue}, 85%, 80%)`
        ),
        700: this.getColorWithFallback(
          `oklch(72% ${baseChroma * 0.95} ${accentHue})`,
          `hsl(${accentHue}, 80%, 72%)`
        ),
        800: this.getColorWithFallback(
          `oklch(64% ${baseChroma * 0.85} ${accentHue})`,
          `hsl(${accentHue}, 75%, 64%)`
        ),
        900: this.getColorWithFallback(
          `oklch(56% ${baseChroma * 0.75} ${accentHue})`,
          `hsl(${accentHue}, 70%, 56%)`
        ),
        950: this.getColorWithFallback(
          `oklch(48% ${baseChroma * 0.65} ${accentHue})`,
          `hsl(${accentHue}, 65%, 48%)`
        ),
      };
    } else {
      // Light Mode: dynamic accent hue
      // if lightAccentHue provided -> use it (explicit override)
      // else -> derive from brandHue using calculateComplementaryHue(baseHue, 0) (you can change offset)
      const accentHue =
        Number(
          typeof lightAccentHue !== "undefined"
            ? lightAccentHue
            : this.calculateComplementaryHue(baseHue, 0)
        ) % 360;
      // derive accent chroma from baseChroma so accents are proportional to brand saturation
      const accentChroma = baseChroma * 1.85; // tweak multiplier if you want stronger/weaker accents
      const baseLightness = 63.45;

      return {
        50: this.getColorWithFallback(
          `oklch(97% ${accentChroma * 0.1} ${accentHue})`,
          `hsl(${accentHue}, 10%, 97%)`
        ),
        100: this.getColorWithFallback(
          `oklch(93% ${accentChroma * 0.2} ${accentHue})`,
          `hsl(${accentHue}, 20%, 93%)`
        ),
        200: this.getColorWithFallback(
          `oklch(87% ${accentChroma * 0.35} ${accentHue})`,
          `hsl(${accentHue}, 35%, 87%)`
        ),
        300: this.getColorWithFallback(
          `oklch(81% ${accentChroma * 0.5} ${accentHue})`,
          `hsl(${accentHue}, 50%, 81%)`
        ),
        400: this.getColorWithFallback(
          `oklch(75% ${accentChroma * 0.7} ${accentHue})`,
          `hsl(${accentHue}, 70%, 75%)`
        ),
        500: this.getColorWithFallback(
          `oklch(${baseLightness}% ${accentChroma} ${accentHue})`,
          `hsl(${accentHue}, 80%, ${baseLightness}%)`
        ),
        600: this.getColorWithFallback(
          `oklch(72% ${accentChroma * 1.1} ${accentHue})`,
          `hsl(${accentHue}, 85%, 72%)`
        ),
        700: this.getColorWithFallback(
          `oklch(64% ${accentChroma * 1.05} ${accentHue})`,
          `hsl(${accentHue}, 90%, 64%)`
        ),
        800: this.getColorWithFallback(
          `oklch(56% ${accentChroma * 0.95} ${accentHue})`,
          `hsl(${accentHue}, 85%, 56%)`
        ),
        900: this.getColorWithFallback(
          `oklch(48% ${accentChroma * 0.85} ${accentHue})`,
          `hsl(${accentHue}, 80%, 48%)`
        ),
        950: this.getColorWithFallback(
          `oklch(40% ${accentChroma * 0.75} ${accentHue})`,
          `hsl(${accentHue}, 75%, 40%)`
        ),
      };
    }
  },
};

// Export for use in other modules
window.ColorSystem = ColorSystem;

# CSS Token System Reference

## Overview

This document serves as a comprehensive reference for the CSS design token system used in WordPress projects with GeneratePress theme. The system follows a structured approach with primitives and semantics to ensure consistency and maintainability.

## Token System Architecture

### Naming Convention

- **Primitives**: `--p-` prefix (e.g., `--p-spacing-s`)
- **Semantics**: `--s-` prefix (e.g., `--s-font-weight-subheading`)

### File Structure

```
/wp-content/uploads/custom-css-js/
├── 17.css (main token definitions)
├── tokens-primitives-typography.css
├── tokens-primitives-spacing.css
├── tokens-semantics-typography.css
└── base-typography.css
```

You can access the files through the following credentials:

- username: Michael
- password: s8oSBVODY1Z3c1VB

## Color Token System

Based on the provided diagram, the color system follows this hierarchy:

### Light/Dark Mode Architecture

The system supports automatic light/dark mode switching with a single brand color that generates:

- **Primary Colors**: Main brand color variations
- **Secondary Colors**: Supporting color palette
- **Neutrals**: Grayscale system for text, backgrounds, borders
- **Accent Colors**: Highlight and interaction colors

### Primitive Color Tokens (-p-)

```css
/* Primary Color Scale */
--p-primary-50: /* Lightest */
--p-primary-100:
--p-primary-200:
--p-primary-300:
--p-primary-400:
--p-primary-500: /* Base brand color */
--p-primary-600:
--p-primary-700:
--p-primary-800:
--p-primary-900:
--p-primary-950: /* Darkest */

/* Neutral Scale */
--p-neutral-50: /* Pure white */
--p-neutral-100:
--p-neutral-200:
--p-neutral-300:
--p-neutral-400:
--p-neutral-500: /* Mid gray */
--p-neutral-600:
--p-neutral-700:
--p-neutral-800:
--p-neutral-900:
--p-neutral-950: /* Pure black */

/* Secondary Color Scale */
--p-secondary-50:
--p-secondary-100:
--p-secondary-200:
--p-secondary-300:
--p-secondary-400:
--p-secondary-500: /* Base secondary */
--p-secondary-600:
--p-secondary-700:
--p-secondary-800:
--p-secondary-900:
--p-secondary-950:

/* Accent Colors */
--p-accent-50:
--p-accent-100:
--p-accent-200:
--p-accent-300:
--p-accent-400:
--p-accent-500: /* Base secondary */
--p-accent-600:
--p-accent-700:
--p-accent-800:
--p-accent-900:
--p-accent-950:

```

### Semantic Color Tokens (-s-)

```css
/* Theme Colors */
--s-color-background: var(--p-color-neutral-000);
--s-color-surface: var(--p-color-neutral-050);
--s-color-surface-secondary: var(--p-color-neutral-100);

/* Text Colors */
--s-color-text-primary: var(--p-color-neutral-900);
--s-color-text-secondary: var(--p-color-neutral-700);
--s-color-text-tertiary: var(--p-color-neutral-500);
--s-color-text-inverse: var(--p-color-neutral-000);

/* Interactive Colors */
--s-color-interactive-primary: var(--p-color-primary-500);
--s-color-interactive-primary-hover: var(--p-color-primary-600);
--s-color-interactive-primary-active: var(--p-color-primary-700);

--s-color-interactive-secondary: var(--p-color-secondary-500);
--s-color-interactive-secondary-hover: var(--p-color-secondary-600);

/* Border Colors */
--s-color-border-primary: var(--p-color-neutral-200);
--s-color-border-secondary: var(--p-color-neutral-100);
--s-color-border-focus: var(--p-color-primary-500);

/* Status Colors */
--s-color-success: var(--p-color-success-500);
--s-color-warning: var(--p-color-warning-500);
--s-color-error: var(--p-color-error-500);
--s-color-info: var(--p-color-info-500);
```

## Typography Token System

### Primitive Typography Tokens (-p-)

```css
/* Font Families */
--p-font-family-primary: "Inter", system-ui, sans-serif;
--p-font-family-secondary: "Georgia", serif;
--p-font-family-mono: "Fira Code", monospace;

/* Font Weights */
--p-font-weight-thin: 100;
--p-font-weight-light: 300;
--p-font-weight-regular: 400;
--p-font-weight-medium: 500;
--p-font-weight-semibold: 600;
--p-font-weight-bold: 700;
--p-font-weight-extrabold: 800;
--p-font-weight-black: 900;

/* Font Sizes (using modular scale) */
--p-font-size-2xs: 0.75rem; /* 12px */
--p-font-size-xs: 0.875rem; /* 14px */
--p-font-size-sm: 1rem; /* 16px */
--p-font-size-md: 1.125rem; /* 18px */
--p-font-size-lg: 1.25rem; /* 20px */
--p-font-size-xl: 1.5rem; /* 24px */
--p-font-size-2xl: 1.875rem; /* 30px */
--p-font-size-3xl: 2.25rem; /* 36px */
--p-font-size-4xl: 3rem; /* 48px */
--p-font-size-5xl: 3.75rem; /* 60px */
--p-font-size-6xl: 4.5rem; /* 72px */

/* Line Heights */
--p-line-height-none: 1;
--p-line-height-tight: 1.25;
--p-line-height-normal: 1.5;
--p-line-height-relaxed: 1.75;
--p-line-height-loose: 2;

/* Letter Spacing */
--p-letter-spacing-tighter: -0.05em;
--p-letter-spacing-tight: -0.025em;
--p-letter-spacing-normal: 0;
--p-letter-spacing-wide: 0.025em;
--p-letter-spacing-wider: 0.05em;
--p-letter-spacing-widest: 0.1em;
```

### Semantic Typography Tokens (-s-)

```css
/* Headings */
--s-font-h1-size: var(--p-font-size-4xl);
--s-font-h1-weight: var(--p-font-weight-bold);
--s-font-h1-line-height: var(--p-line-height-tight);
--s-font-h1-letter-spacing: var(--p-letter-spacing-tight);

--s-font-h2-size: var(--p-font-size-3xl);
--s-font-h2-weight: var(--p-font-weight-semibold);
--s-font-h2-line-height: var(--p-line-height-tight);

--s-font-h3-size: var(--p-font-size-2xl);
--s-font-h3-weight: var(--p-font-weight-semibold);
--s-font-h3-line-height: var(--p-line-height-normal);

--s-font-h4-size: var(--p-font-size-xl);
--s-font-h4-weight: var(--p-font-weight-medium);
--s-font-h4-line-height: var(--p-line-height-normal);

--s-font-h5-size: var(--p-font-size-lg);
--s-font-h5-weight: var(--p-font-weight-medium);

--s-font-h6-size: var(--p-font-size-md);
--s-font-h6-weight: var(--p-font-weight-medium);

/* Body Text */
--s-font-body-size: var(--p-font-size-sm);
--s-font-body-weight: var(--p-font-weight-regular);
--s-font-body-line-height: var(--p-line-height-relaxed);

--s-font-body-large-size: var(--p-font-size-md);
--s-font-body-large-line-height: var(--p-line-height-relaxed);

--s-font-body-small-size: var(--p-font-size-xs);
--s-font-body-small-line-height: var(--p-line-height-normal);

/* UI Text */
--s-font-button-size: var(--p-font-size-sm);
--s-font-button-weight: var(--p-font-weight-medium);
--s-font-button-line-height: var(--p-line-height-none);

--s-font-label-size: var(--p-font-size-sm);
--s-font-label-weight: var(--p-font-weight-medium);

--s-font-caption-size: var(--p-font-size-xs);
--s-font-caption-weight: var(--p-font-weight-regular);
--s-font-caption-line-height: var(--p-line-height-normal);
```

## Spacing Token System

### Primitive Spacing Tokens (-p-)

```css
/* Spacing Scale (based on 4px grid) */
--p-space-0: 0;
--p-space-1: 0.25rem; /* 4px */
--p-space-2: 0.5rem; /* 8px */
--p-space-3: 0.75rem; /* 12px */
--p-space-4: 1rem; /* 16px */
--p-space-5: 1.25rem; /* 20px */
--p-space-6: 1.5rem; /* 24px */
--p-space-8: 2rem; /* 32px */
--p-space-10: 2.5rem; /* 40px */
--p-space-12: 3rem; /* 48px */
--p-space-16: 4rem; /* 64px */
--p-space-20: 5rem; /* 80px */
--p-space-24: 6rem; /* 96px */
--p-space-32: 8rem; /* 128px */
--p-space-40: 10rem; /* 160px */
--p-space-48: 12rem; /* 192px */
--p-space-56: 14rem; /* 224px */
--p-space-64: 16rem; /* 256px */

/* Negative Spacing */
--p-space-n-1: -0.25rem;
--p-space-n-2: -0.5rem;
--p-space-n-3: -0.75rem;
--p-space-n-4: -1rem;
--p-space-n-6: -1.5rem;
--p-space-n-8: -2rem;
```

### Semantic Spacing Tokens (-s-)

```css
/* Layout Spacing */
--s-space-section-padding: var(--p-space-16);
--s-space-container-padding: var(--p-space-6);
--s-space-content-gap: var(--p-space-8);

/* Component Spacing */
--s-space-button-padding-y: var(--p-space-3);
--s-space-button-padding-x: var(--p-space-6);
--s-space-button-gap: var(--p-space-2);

--s-space-input-padding-y: var(--p-space-3);
--s-space-input-padding-x: var(--p-space-4);

--s-space-card-padding: var(--p-space-6);
--s-space-card-gap: var(--p-space-4);

/* Typography Spacing */
--s-space-text-stack: var(--p-space-4);
--s-space-heading-stack: var(--p-space-6);
--s-space-paragraph-stack: var(--p-space-4);
```

## Dark Mode Implementation

### CSS Structure for Theme Switching

```css
/* Light Mode (default) */
:root {
  --s-color-background: var(--p-color-neutral-000);
  --s-color-text-primary: var(--p-color-neutral-900);
  /* ... other light mode tokens ... */
}

/* Dark Mode */
[data-theme="dark"] {
  --s-color-background: var(--p-color-neutral-900);
  --s-color-text-primary: var(--p-color-neutral-100);
  /* ... other dark mode tokens ... */
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --s-color-background: var(--p-color-neutral-900);
    --s-color-text-primary: var(--p-color-neutral-100);
    /* ... other dark mode tokens ... */
  }
}
```

## Usage Guidelines

### Component Development

1. **Always use semantic tokens** in components, never primitives directly
2. **Semantic tokens reference primitives** for consistency
3. **Primitives are the single source of truth** for values

### Example Component Usage

```css
.button {
  background-color: var(--s-color-interactive-primary);
  color: var(--s-color-text-inverse);
  padding: var(--s-space-button-padding-y) var(--s-space-button-padding-x);
  font-size: var(--s-font-button-size);
  font-weight: var(--s-font-button-weight);
  border-radius: var(--s-border-radius-medium);
}

.button:hover {
  background-color: var(--s-color-interactive-primary-hover);
}
```

## File References

- **Main Tokens**: `/custom-css-js/17.css`
- **Typography Primitives**: `/custom-css-js/tokens-primitives-typography.css`
- **Spacing Primitives**: `/custom-css-js/tokens-primitives-spacing.css`
- **Typography Semantics**: `/custom-css-js/tokens-semantics-typography.css`
- **Base Typography**: `/custom-css-js/base-typography.css`

## Benefits of This System

1. **Consistency**: All values come from a single source
2. **Maintainability**: Changes to primitives cascade through semantics
3. **Theming**: Easy light/dark mode and brand customization
4. **Scalability**: New components inherit the design system automatically
5. **Accessibility**: Built-in contrast and spacing standards

## Recommendations for Improvement

### Missing Primitive Categories

Consider adding these primitive token categories:

- **Border radius**: `--p-border-radius-none`, `--p-border-radius-sm`, etc.
- **Shadows**: `--p-shadow-sm`, `--p-shadow-md`, `--p-shadow-lg`
- **Transitions**: `--p-transition-fast`, `--p-transition-normal`
- **Z-index**: `--p-z-dropdown`, `--p-z-modal`, `--p-z-tooltip`

### Additional Semantic Tokens

- **Focus states**: Better focus ring definitions
- **Loading states**: Skeleton and loading animations
- **Micro-interactions**: Hover and active state transitions

This reference should be updated as the token system evolves and new patterns emerge.

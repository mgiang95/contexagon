# Contexagon Design System Snippets

This repository is a **knowledge base and extract collection**, not the full production codebase.
It focuses on selected implementation snippets, especially the CSS token architecture used across components.

## Scope

- Documents and demonstrates the token system and styling patterns
- Contains reusable snippet files (CSS, HTML, JS)
- Mirrors key patterns from the real project in isolated form
- Does **not** represent the complete app/site source code

## Token Architecture

The token model follows three layers:

1. `--p-*` Primitives
2. `--s-*` Semantics
3. `--c-*` Component tokens

### 1) Primitives (`--p-*`)

Raw, context-free design decisions such as color scales, spacing, typography, transitions.

Examples:

- `--p-accent-500`
- `--p-spacing-xl`
- `--p-font-family-heading`
- `--p-transition-duration-fast`

### 2) Semantics (`--s-*`)

Meaning-based aliases mapped from primitives.  
These describe usage intent (text, surface, interaction), not raw values.

Examples:

- `--s-text-primary`
- `--s-text-link`
- `--s-interactive-primary`

### 3) Component Tokens (`--c-*`)

Component-scoped API tokens that define the final behavior of UI parts.

Examples:

- `--c-button-padding-block`
- `--c-button-primary-bg`
- `--c-button-primary-text`
- `--c-section-primary-subtle`

## Practical Token Flow

Typical dependency direction:

`--p-*` -> `--s-*` -> `--c-*` -> component styles

Example from this repo:

- Primitives are used directly in `css/component-hero_marquee.css`
- Semantic tokens appear in files such as `css/component-footer.css` and `css/component-form.css`
- Component tokens are consumed by component styles, e.g. button rules in `css/component-form.css`

## Repository Structure

```text
css/
  token-primitives-*.css
  token-semantics-*.css
  component-*.css
  pattern-*.css
  utility-*.css
  pages-*.css
  index.css
html/
  component-*.html
  pattern-*.html
js/
  component/pattern behavior and a11y controls
css-token-system-reference.md
```

## CSS Layers and Loading

The stylesheet organization follows layered loading (see `css/index.css`):

1. `reset`
2. `primitives`
3. `semantics`
4. `base`
5. `components`
6. `pages`
7. `utilities`
8. `overrides`

This keeps token resolution predictable and reduces style collisions.

## Selected Files to Start With

- `css/token-primitives-color.css`
- `css/token-primitives-spacing.css`
- `css/token-primitives-typography.css`
- `css/token-semantics-global_ui.css`
- `css/token-semantics-typography.css`
- `css/component-form.css`
- `css/component-hero_marquee.css`
- `css/component-footer.css`

## Conventions

- Prefer semantic and component tokens in component CSS
- Use primitive tokens directly only when building foundational/token files
- Keep naming stable and explicit (`--p-*`, `--s-*`, `--c-*`)
- Favor composition over one-off hardcoded values

## Notes

- Some files are exported/mirrored from a CMS-hosted setup
- This repo is intended for documentation, iteration, and reuse of system patterns

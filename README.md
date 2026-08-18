# Spring Health - Webflow Native Custom Code Bundles

This repository contains the source code, component scripts, and native Webflow embed generators for the **Spring Health** Webflow project.

It provides automated build tooling to compile modular JavaScript and CSS into optimized, minified custom code embed snippets that can be pasted directly into Webflow pages or component custom code fields while staying well within Webflow's **50,000 character limit** per embed.

---

## 📁 Repository Structure

```text
├── assets/
│   └── scripts/             # Compiled asset chunks (classes, breakpoints, swiper, scroll-lock, accordion, etc.)
├── components/              # Source code for individual UI components (header, footer, faq, swipers, etc.)
├── dist/                    # Generated output folder for Webflow custom code embeds
│   ├── assets/              # Shared helper asset embeds (asset-scroll-lock.html, asset-classes.html, etc.)
│   ├── components/          # Component-specific embed snippets (header.html, footer.html, etc.)
│   └── core/                # Core global stylesheet & animation controller bundle (main-core.html)
├── main.css                 # Master global CSS stylesheet
├── main.js                  # Master animation controller logic
└── scripts/                 # Node.js build and audit utilities
    ├── audit-imports.js     # Audits component dependencies against dist asset embeds
    └── build-native-embeds.js # Main builder script generating HTML embed snippets in dist/
```

---

## ⚙️ Build Commands

### 1. Generate All Webflow Native Embeds
Compiles and minifies CSS/JS into HTML embed snippets in `dist/`:
```bash
node scripts/build-native-embeds.js
```
**Output Locations:**
- Core Embed: `dist/core/main-core.html`
- Asset Embeds: `dist/assets/asset-*.html`
- Component Embeds: `dist/components/*.html`

### 2. Audit Component Dependencies
Audits all components in `components/` and prints a dependency matrix of required asset embeds:
```bash
node scripts/audit-imports.js
```

---

## 🚀 Webflow Integration Guide

Follow these steps to integrate the compiled embeds into Webflow:

### Step 1: Add Core Embed (Global Site Settings)
Paste the contents of `dist/core/main-core.html` into **Site Settings > Custom Code > Footer Code** (or inside a global Page Settings Footer Code).

`main-core.html` provides:
- Global design system CSS styles (`main.css`)
- `window.SH` global registry & style inserter (`window.SH.insertStyles`)
- Animation controller engine (`ot.init()`)
- DOMContentLoaded event runner for component initialization

### Step 2: Add Required Shared Asset Embeds
Before placing a component embed on a page, ensure the required asset embeds for that component are added to the page or global header/footer (see [AUDIT.md](./AUDIT.md) for exact requirements per component):
- `dist/assets/asset-classes.html` (DOM class names map: `window.SH.Classes`)
- `dist/assets/asset-breakpoints.html` (Breakpoint constants: `window.SH.Breakpoints`)
- `dist/assets/asset-scroll-lock.html` (Body scroll locking helpers: `window.SH.lockScroll`, `window.SH.unlockScroll`)
- `dist/assets/asset-accordion.html` (Accordion widget logic: `window.SH.Accordion`)
- `dist/assets/asset-swiper.html` (Swiper.js slider engine & modules: `window.SH.Swiper`)

### Step 3: Add Component Embed Snippets
Paste the minified component embed snippet (e.g., `dist/components/header.html`) into the Webflow page or component custom code embed block.

Component scripts automatically register themselves with `window.SH.register(id, fn)` and execute cleanly when the DOM is ready.

---

## 📊 Component & Asset Audit

For a complete breakdown of every component and its exact asset dependencies, refer to [AUDIT.md](./AUDIT.md).

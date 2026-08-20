# Webflow Component & Asset Dependency Audit

This document provides a comprehensive audit of all UI components in `components/`, detailing their source JavaScript import dependencies and the required asset embed files from `dist/` needed for Webflow deployment.

---

## 📌 Shared Asset Embeds Reference

All shared asset embed scripts are compiled into `dist/assets/`. When a component depends on an asset embed, that asset embed script must be included on the Webflow page (or globally in Site Settings) prior to running the component snippet.

| Asset Embed File | Exposed Global Properties on `window.SH` | Purpose & Description |
|---|---|---|
| **`dist/core/main-core.html`** | `window.SH.registry`, `window.SH.register`, `window.SH.insertStyles`, `window.SH._initialized` | **Core Bundle**: Global stylesheet (`main.css`), animation controller, style inserter helper, and component lifecycle runner. **Required by all components.** |
| **`dist/assets/asset-classes.html`** | `window.SH.Classes` | Mappings for standard CSS state/utility classes (e.g. `ACTIVE`, `DISABLED`, `LOCKED`, `HIDDEN`). |
| **`dist/assets/asset-breakpoints.html`** | `window.SH.Breakpoints` | Media query breakpoint constants matching CSS responsive design rules. |
| **`dist/assets/asset-scroll-lock.html`** | `window.SH.lockScroll`, `window.SH.unlockScroll`, `window.SH.toggleScroll` | Utilities for locking and unlocking body scroll (used by header menu/dialogs). |
| **`dist/assets/asset-accordion.html`** | `window.SH.Accordion` | Accordion widget constructor and event handler logic. |
| **`dist/assets/asset-tabs.html`** | `window.SH.Tabs` | Accessible tab navigation widget constructor class (used by tab components). |
| **`dist/assets/asset-swiper.html`** | `window.SH.Swiper`, `window.SH.SwiperAutoplay`, `window.SH.SwiperPagination`, `window.SH.SwiperNavigation`, `window.SH.SwiperEffectFade` | Swiper.js engine and modular plugin bindings. |

---

## 📋 Component Dependency Matrix

Below is the complete audit matrix for all active components:

| Component Name | Source Import Chunks | Required Asset Embeds in `dist/assets/` | Webflow Embed Status |
|---|---|---|---|
| **`header`** | `insert-styles`, `scroll-lock`, `breakpoints`, `classes` | `asset-scroll-lock.html`, `asset-breakpoints.html`, `asset-classes.html` | ✅ OK (15.2 KB) |
| **`article-anchors`** | `index-a83eb4d7` (Accordion), `insert-styles` | `asset-accordion.html` | ✅ OK (3.7 KB) |
| **`article-rich-link-new-tab`** | *(None)* | *(None - Core only)* | ✅ OK (0.3 KB) |
| **`copy-link`** | `classes`, `insert-styles` | `asset-classes.html` | ✅ OK (2.4 KB) |
| **`disclaimer`** | `classes`, `insert-styles` | `asset-classes.html` | ✅ OK (3.3 KB) |
| **`faq`** | `index-a83eb4d7` (Accordion), `insert-styles` | `asset-accordion.html` | ✅ OK (0.8 KB) |
| **`footer`** | `index-a83eb4d7` (Accordion), `insert-styles` | `asset-accordion.html` | ✅ OK (0.9 KB) |
| **`hubspot-form`** | `classes`, `insert-styles` | `asset-classes.html` | ✅ OK (3.4 KB) |
| **`mham`** | `insert-styles` | *(None - Core only)* | ✅ OK (0.6 KB) |
| **`open-roles`** | `classes`, `insert-styles` | `asset-classes.html` | ✅ OK (7.5 KB) |
| **`running-line`** | `classes`, `insert-styles` | `asset-classes.html` | ✅ OK (3.3 KB) |
| **`share-page`** | *(None)* | *(None - Core only)* | ✅ OK (1.1 KB) |
| **`skip-navigation`** | `insert-styles` | *(None - Core only)* | ✅ OK (0.5 KB) |
| **`solution-accordion`** | `index-a83eb4d7` (Accordion), `insert-styles` | `asset-accordion.html` | ✅ OK (10.9 KB) |
| **`swiper-cases`** | Swiper core, pagination, autoplay, effect-fade | `asset-swiper.html` | ✅ OK (7.6 KB) |
| **`swiper-iphone-mockup`** | Swiper core, autoplay | `asset-swiper.html` | ✅ OK (5.7 KB) |
| **`swiper-posts`** | Swiper core, pagination, autoplay, breakpoints | `asset-swiper.html`, `asset-breakpoints.html` | ✅ OK (7.2 KB) |
| **`swiper-section`** | Swiper core, pagination, autoplay, effect-fade | `asset-swiper.html` | ✅ OK (7.2 KB) |
| **`tabs`** | `SmoothScroll-d802c8a1` (Tabs), `insert-styles` | `asset-tabs.html` | ✅ OK (3.7 KB) |
| **`tabs-privacy`** | `SmoothScroll-d802c8a1` (Tabs), `insert-styles` | `asset-tabs.html` | ✅ OK (0.6 KB) |
| **`tabs-review`** | `SmoothScroll-d802c8a1` (Tabs), `insert-styles` | `asset-tabs.html` | ✅ OK (1.6 KB) |
| **`wistia`** | `insert-styles` | *(None - Core only)* | ✅ OK (0.3 KB) |

> **Note**: SmoothScroll polyfill code has been completely removed in favor of native browser CSS (`scroll-behavior: smooth`). The `Tabs` component class extracted from `SmoothScroll-d802c8a1.js` is bundled into `asset-tabs.html` for tab navigation components.

---

## 🛠 Maintenance & Re-auditing

To refresh this audit table automatically when component imports or source files change, run:
```bash
node scripts/audit-imports.js
```

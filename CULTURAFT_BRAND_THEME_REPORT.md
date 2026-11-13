# CULTURAFT Brand Theme Report

**Date:** 2026-11-13

## Brand palette

The official logo remains unchanged. Its existing PNG is 2048 × 366 RGBA with
fully and partially transparent pixels; the image was not modified.

| Semantic token | Value |
|---|---|
| `brand-primary` | `#CB8832` |
| `brand-primary-hover` | `#C27F2D` |
| `brand-light` | `#E5B66F` |
| `brand-soft` | `#F2E3CB` |
| `background` | `#F8F5EE` |
| `background-secondary` | `#F2E3CB` |
| `foreground` | `#252522` |
| `foreground-secondary` | `#554535` |
| `surface` | `#FFFFFF` |
| `border` | `#E4D8C5` |
| `accent` | `#E5B66F` |
| `button-primary` | `#CB8832` |
| `button-secondary` | `#252522` |
| `navigation-active` | `#C27F2D` |
| `focus-ring` | `#A06419` |

The palette is centralized in Tailwind CSS 4's `@theme`. Existing utility names
remain aliases to these semantic tokens so the current components inherit the
new palette without a broad markup rewrite or duplicate color values.

## Updated surfaces

- **Global theme:** warm ivory page background, champagne secondary surfaces,
  white raised surfaces, deep-charcoal foreground, espresso secondary text,
  warm borders, and token-driven focus and selection styles.
- **Buttons and inputs:** gold primary/enquiry buttons use deep-charcoal text;
  secondary buttons remain charcoal with white text; outlines, fields, hover,
  and focus states use the new palette.
- **Header and navigation:** light navigation surfaces and dark text remain;
  active category underline and mobile drawer selection are gold. Mega-menu
  submenu hover/focus uses soft champagne.
- **Homepage:** hero and collection image scrims now derive from the shared
  foreground token; CTAs use the new button colors.
- **Shop and category pages:** selected category/subcategory controls use gold
  with charcoal text; search, sorting, breadcrumbs, and product grids inherit
  the shared tokens.
- **Product cards and details:** imagery remains the focus; names/prices retain
  dark text; request-only pricing and active gallery thumbnails use the updated
  palette; WhatsApp enquiry CTAs use accessible gold/charcoal contrast.
- **About, contact, and not-found pages:** existing layouts and copy inherit the
  updated theme; contact actions use the gold primary button.
- **Footer:** deep charcoal surface, ivory/champagne text, light-gold icon and
  hover accents, and the original transparent gold logo.
- **PWA metadata:** manifest background color updated to warm ivory. The browser
  theme color remains deep charcoal for status-bar contrast.
- **Typography:** existing Manrope headings and DM Sans body text are retained.

Product data, product prices, copy, route behavior, the WhatsApp number/message
generation, and the original logo artwork were not changed.

## Accessibility checks

- Deep charcoal text on signature gold: **5.20:1**.
- Deep charcoal text on the darker gold hover shade: **4.66:1**.
- Espresso text on warm ivory: **8.43:1**.
- Light gold on deep charcoal: **8.24:1**.
- Signature gold is not used as small text on ivory/white; its contrast there is
  below 3:1. Primary button text remains deep charcoal.
- Footer links were checked in the browser after correcting their contrast on
  the dark surface.
- Keyboard focus remains visible, uses a dedicated focus token, and the
  existing reduced-motion preference is preserved.

## Browser review

Screenshots were captured and visually inspected in the integrated browser for:

- Homepage and desktop navbar at 1440px.
- Desktop mega menu at 1440px.
- Shop filters and product grid at 1440px.
- Benches category page at 1440px.
- Product detail and product-specific WhatsApp CTA at 1440px.
- Contact page and WhatsApp CTA.
- Mobile navigation drawer at 390px.
- Footer on the deep-charcoal background.
- Homepage at 1024px, 768px, and 390px.

Responsive checks at **1440, 1280, 1024, 768, 390, and 360px** found no
horizontal overflow. Header and drawer logo images retained `object-fit:
contain`; their computed backgrounds and their link backgrounds were
transparent. Route smoke checks passed for `/`, `/shop`, `/category/benches`,
`/product/aaranya-handwoven-rope-bench`, `/about`, `/contact`, and the not-found
route. The browser console reported no errors.

## Data and verification results

- Products: **36**.
- Products with no listed price: **9** (`Price on Request` behavior retained).
- Product image references: **173**; missing local image files: **0**.
- `npm test`: **passed**, 3 test files and 38 tests.
- `npm run build`: **passed**, including TypeScript project checks and Vite
  production build.
- `npm run lint`: exited successfully with three existing warnings:
  `react(set-state-in-effect)` in `Header.tsx` and `ImageGallery.tsx`, and
  `eslint(no-unused-vars)` in `categoryNavigation.test.ts`.
- Impeccable detector: returned no findings using its regex fallback. Its HTML
  parser dependencies (`htmlparser2`, `css-select`, `css-tree`, `domutils`) were
  unavailable, so computed custom-property and contrast analysis was not
  covered by that detector; browser and contrast checks above were performed
  separately.

## Remaining issues

No brand-theme-specific visual or route issue was observed. The three lint
warnings listed above are outside this palette change and remain for a separate
cleanup.

# CULTURAFT — Redesign Audit (Phase 2)

Date: 2026-11-13 · Baseline verified in Chrome (Playwright) at 1440px and 390px.
Screenshots: `redesign-artifacts/before/` (home, shop, category, product, about,
contact, 404, desktop + mobile).

## 1. What exists and works (preserve)

- **Routing is already correct**: `App.tsx` renders one route at a time inside
  `MainLayout` (Header + Outlet + Footer). `/`, `/shop`, `/category/:slug`,
  `/product/:slug`, `/about`, `/contact`, `*` → 404. Unknown category/product
  slugs get honest 404 states.
- **Product data is clean**: 36 verified products in `src/data/products.json`
  — Benches 6, Dining chair 11, lounge Chair 5, SOFAS 4, stool 5, Table 5.
  Prices are real INR values or `null` ("Price on Request"). Two string prices
  exist (`"₹15,999 per piece"`, `"₹26,000 (2-Piece Set)"`) with `priceUnit`.
  Descriptions/specs are mostly `null` — the UI must not invent them.
- **WhatsApp enquiry is env-driven** (`VITE_WHATSAPP_NUMBER` via `.env.local`),
  validated + normalized in `src/lib/whatsapp.ts`, with 23 passing unit tests.
- **198 image files** under `public/images/products/` (~103 MB total, several
  PNGs are 1–4 MB). All resolve over HTTP when the URL is correct.
- Tests: 23 pass. Build: passes (tsc + vite).

## 2. Functional defects (must fix)

| # | Where | Defect |
|---|-------|--------|
| 1 | `CategoryShowcase.tsx`, `FeaturedCollection.tsx` | Filter with `p.category === category.slug` instead of `category.productCategory` → every category card shows **"0 products"** and the featured selection degrades to a fallback list. |
| 2 | `CategoryShowcase.tsx`, `CraftsmanshipSection.tsx` | Image URLs contain a **literal backslash** (`"/images/products/lounge\ Chair/…"` in JSX) → `%5C` in the request → **broken images** on the homepage (dining chairs, lounge chairs, craftsmanship section). |
| 3 | `Header.tsx` / mobile | There is **no navigation on mobile at all**: the desktop nav is `hidden md:flex` and no hamburger/drawer exists. Mobile users cannot reach Shop, About or Contact (only the stray "Shop All" button). No category navigation, no search. |
| 4 | `Header.tsx` | Desktop nav has only Home/Shop/About/Contact — none of the six product categories; the "most important requirement" (category mega menu) does not exist. |
| 5 | `ProductDetailsPage.tsx` | Gallery is `lg:col-span-2` inside a `lg:grid-cols-2` layout → gallery takes the full row, title/price/materials land **below** the fold in a narrow column; Related Products are nested inside the info column. Not a shopping layout. |
| 6 | `ImageGallery.tsx` | `className="h-[400] lg:h-[500]"` — invalid Tailwind (missing units) → main image renders at natural size (huge). Lightbox is a `div onClick` (no keyboard, no focus management). `import { use } from 'react'` unused. Thumbnails use `aria-selected` with no tablist semantics. |
| 7 | `ProductInformation.tsx` | String prices render raw text outside a `<p>` (and duplicate the unit: "₹15,999 per piece (per piece)"). Category shows the raw data value ("Dining chair", "BENCHES"). |
| 8 | `Footer.tsx` | **Fake contact links**: `mailto:info@culturaft.com` and `href="#"` Twitter/Instagram icons — explicitly forbidden (no fake email/social). |
| 9 | `CategoryNavigation.tsx` | Dead/broken component: decorative button that does nothing, full-page-reload `<a href>` links, duplicated `Category` type. |
| 10 | 6 home components | `className="py-16 … ${className || ''}"` — not a template literal, so the literal string `${className || ''}` ships to the DOM as a class. Also `px-4 px-6` duplicates, `group-hover:scale-103`, `max-w-[500]`, `h-[480]`, `h-[280]` — all invalid/no-effect. |
| 11 | Dead code | `pages/*/{Home,Shop,Category,ProductDetails}.tsx` (old versions, unimported), `App.css` (unimported Vite template CSS), `tailwind.config.js`/`tailwind.config.cjs` (v3-style configs referencing `hsl(var(--…))` vars that don't exist — project uses Tailwind v4 `@theme`). |

## 3. Design defects (why it looks weak/generic)

- **Editorial serif identity** (Cormorant Garamond on every heading) reads as a
  blog, not a furniture store; the brief explicitly asks for a contemporary
  sans-serif system (Manrope + DM Sans).
- **Header is invisible**: tiny logo + 4 small links; no categories, no search,
  no hierarchy. The storefront's main merchandising tool (navigation) is absent.
- **Hero duplicates the same photo** twice (background + inset card) and the
  heading collides with the header at 390px (verified in
  `before/home-mobile.png`).
- **Featured grid ships broken**: empty gray boxes where product photos should
  be (backslash-path bug), names/prices floating in space.
- **Buttons reference undefined classes** (`btn btn-outline`, `btn-primary`,
  `btn-white`) → browsers render them as unstyled gray rectangles.
- **Focus style shifts layout**: `a:focus-visible` adds padding + background on
  focus (index.css) → page jumps when tabbing.
- **Category page has no search/sort/subcategory** affordances; shop filters are
  three large vertical columns of pill buttons that push the product grid far
  below the fold.
- **Product cards are bland**: `bg-background/10 rounded-xl` (invisible),
  4/3 crop, no category label, inconsistent price typography.
- Footer repeats the "since establishment" boilerplate; social icons are fake.

## 4. Verified category/subcategory taxonomy (from product data only)

Derived from product names and `sourceTextFile` values in products.json.
Nothing invented; products not confidently matching a subcategory stay under
their category's "All Products".

- **Benches (6)**: Handwoven Benches (5), Wooden Benches (4), Rope Benches (3)
- **Dining Chairs (11)**: Outdoor Dining Chairs (5), Rope Armchairs (7),
  Folding Chairs (1)
- **Lounge Chairs (5)**: Woven Rope Lounge Chairs (3), Motion Lounge Chairs (1)
- **Sofas (4)**: Outdoor Sofas (2), Conversation Sets (1)
- **Stools (5)**: Bar Stools (3), Handwoven Stools (2)
- **Tables (5)**: Coffee Tables (3), End Tables (1), Accent Tables (2)

Notes: `artisan-rope-weave-x-frame-bench` is named "Bench" but categorized
`stool` — stays in Stools → All Products only. `2-piece-outdoor-rope-sofa`
("Single Seater Sofa") lives in lounge Chair — stays under All Products.
`multi-colour-rope-bench`'s source file is "Handwoven Jute Bench.txt" → counts
as Handwoven; its name is lowercase "multi colour rope bench" (data preserved).

## 5. Redesign direction (decided)

- **Direction**: "Modern Architectural Gallery" — chalk-white field, sand
  panels, ink typography, square corners, hairline rules, photography as the
  only ornament. Shopping-first: categories everywhere, products prominent.
- **Type**: Manrope (headings/nav/prices) + DM Sans (body). Scale 1.25.
- **Palette**: Chalk `#F8F7F3`, Sand `#E9E3D9`, Ink `#252522`,
  Charcoal `#45433E`, Terracotta `#A66C52` (accent, sparse), Olive `#6F765E`.
- **No**: gradients (except one hero scrim), glassmorphism, floating shapes,
  fake reviews/social/badges, heavy shadows, over-rounded cards.
- **Header**: full category mega menu (hover/click/keyboard/Escape/outside
  click) with real product photography; mobile slide-in drawer with
  accordions; search → `/shop?q=`; no cart/login icons.
- **Subcategories** via `/category/:slug?subcategory=<id>` with chips, counts,
  back/forward and refresh support.

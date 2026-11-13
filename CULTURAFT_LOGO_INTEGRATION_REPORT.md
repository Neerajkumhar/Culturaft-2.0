# CULTURAFT — Logo Integration Report

Date: 2026-11-13  
Project: `/home/tony/culturaft-frontend`

## 1. Source asset (inspected, not modified)

- **File:** `public/culturaft-logo.png` (unchanged)
- **Dimensions:** 6190 × 1109 px (wide horizontal wordmark)
- **Aspect ratio:** ~5.582:1
- **Format/channels:** PNG, 8-bit sRGB, `srgba` (transparent background, `opaque=False`)
- **Corner sample:** fully transparent (`#00000000`)

The image is used as-is (no edits, filters, backgrounds, shadows, or effects). Aspect ratio preserved everywhere via `h-auto` + `object-contain` (no crop/stretch).

## 2. Integration changes

### Header / Navbar (`src/components/layout/Header.tsx`)
- Replaced the text-based CULTURAFT wordmark (and decorative square mark) with the official logo image:
  - `src="/culturaft-logo.png"`
  - `alt="Culturaft - Furniture & Living"`
  - `className="h-auto w-[130px] object-contain sm:w-[145px] md:w-[155px] lg:w-[170px]"`
  - `loading="eager" decoding="async"`
- Wrapped in `<Link to="/">` (clickable home), retains `aria-label="CULTURAFT — home"` and `min-h-11` tap target; no duplicated text wordmark.

### Mobile navigation drawer (`src/components/navigation/MobileDrawer.tsx`)
- Replaced drawer header text wordmark with the same official logo image:
  - `src="/culturaft-logo.png"`, `alt="Culturaft - Furniture & Living"`
  - `className="h-auto w-[135px] object-contain"`
  - `loading="eager" decoding="async"`
- Logo is a `<Link to="/" onClick={onClose}>` (navigates home and closes drawer).
- Consistent alignment with close button; no duplicated text wordmark.

### Footer (`src/components/layout/Footer.tsx`)
- Replaced footer text wordmark/mark with the official logo image:
  - `src="/culturaft-logo.png"`, `alt="Culturaft - Furniture & Living"`
  - `className="h-auto w-[145px] object-contain md:w-[160px]"`
  - `loading="lazy" decoding="async"`
- Wrapped in `<Link to="/" className="inline-flex min-h-11 items-center">`.

### Other brand-logo locations
- Searched `src/` and `index.html` for `CULTURAFT` usages. Replaced only actual visual brand wordmark/logo placements (header, mobile drawer, footer). **Ordinary brand-name references left unchanged** (e.g. page/content copy like “About CULTURAFT”, hero/section labels/aria text, copyright line, comments, lib/data descriptions, document title/metadata).

## 3. Responsive sizing (as implemented)

| Context | Width classes | Verified rendered size (Playwright) |
|---|---|---|
| Header mobile | `w-[130px]` | ~130 × 23 px |
| Header tablet | `sm/md w-[145px]/w-[155px]` | (responsive tiers) |
| Header desktop | `lg w-[170px]` | ~170 × 30.45 px |
| Mobile drawer | `w-[135px]` | ~135 px (link `href="/"`) |
| Footer | `w-[145px] md:w-[160px]` | ~160 px (desktop) |

All preserve original aspect ratio (`object-contain`, `h-auto`).

## 4. Favicon/icon distinction (preserved)

- `public/culturaft-logo.png` is used as the **primary website logo** (header/drawer/footer) only.
- `public/icon.svg` remains the **brand icon** for favicons/app icons; favicon system, manifest, and icon assets were **not** replaced with the horizontal logo PNG.
- Existing: `icon.svg`, `favicon.svg`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`, and `index.html` icon/manifest/theme references remain intact.

## 5. Verification

Automated browser checks (Playwright + system Chrome, dev server `http://localhost:5173`):

- **Desktop (1440):** header logo present, loaded (`complete`, `naturalWidth=6190`, `naturalHeight=1109`), rendered ~170×30.45 px on Home, Shop, and Product pages.
- **Footer:** logo present/loaded, rendered ~160 px width.
- **Mobile (390):** header logo loaded/rendered ~130×23 px; drawer logo loaded/rendered ~135 px with home link (`href="/"`).
- **Paths:** `/culturaft-logo.png` resolves from `public/`.
- **No layout-shift symptoms observed** in checks (explicit width/auto-height with preserved ratio); responsive sizing applied per breakpoint.
- **Evidence screenshots:** `redesign-artifacts/logo-home-desktop.png`, `redesign-artifacts/logo-shop-desktop.png`, `redesign-artifacts/logo-product-desktop.png`, `redesign-artifacts/logo-footer-desktop.png`, `redesign-artifacts/logo-home-mobile.png`, `redesign-artifacts/logo-drawer-mobile.png`.

## 6. Build

- `npm run build` (`tsc -b && vite build`): **PASS** (Vite v8.3.8, 58 modules transformed; production assets emitted successfully).

## 7. Notes / limitations

- Visual review of the rendered logo (sharpness/contrast against backgrounds) was validated programmatically and via captured screenshots; a quick human check on real devices is recommended for final polish.
- No unrelated components redesigned; original `public/culturaft-logo.png` not modified.

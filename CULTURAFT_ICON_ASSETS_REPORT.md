# CULTURAFT — Icon & Favicon Assets Report

Date: 2026-11-13  
Project: `/home/tony/culturaft-frontend` (React + Vite + TypeScript)

## 1. Master source inspection

- **Master file (unchanged by this task):** `public/icon.svg` (1,649,378 bytes)
- **SVG root:** `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2000" zoomAndPan="magnify" viewBox="0 0 1500 1499.999933" height="2000" preserveAspectRatio="xMidYMid meet" version="1.0">`
- **ViewBox:** `0 0 1500 1499.999933` (square canvas) · **Aspect ratio:** `xMidYMid meet`
- **Content:** complex artwork including embedded raster data (`xlink:href="data:image/png;base64,...`), filters, masks, clip paths and paths; artwork fills/centers within the viewBox.
- **Policy followed:** exact existing logo artwork used as source; not redrawn/replaced; shape, proportions and identity preserved; original brand colors not altered; `public/icon.svg` **not overwritten**.

## 2. Generated files

| File | Type | Dimensions / details | Notes |
|---|---|---|---|
| `public/favicon.svg` | SVG (vector) | 1,649,378 bytes | Faithful copy of master `icon.svg` (clean scalable vector, exact artwork preserved). |
| `public/favicon-16x16.png` | PNG | 16×16 | Rendered from master, centered, ~8% padding, transparent outer canvas, not cropped. |
| `public/favicon-32x32.png` | PNG | 32×32 | Same treatment. |
| `public/favicon-48x48.png` | PNG | 48×48 | Same treatment. |
| `public/favicon.ico` | ICO | 3 frames: 16×16, 32×32, 48×48 | Combined from PNG favicons. |
| `public/apple-touch-icon.png` | PNG | 180×180 | Centered, ~12% padding, solid background `#F8F7F3` (chalk). |
| `public/icon-192.png` | PNG | 192×192 | Centered, ~10% padding, transparent outer background. |
| `public/icon-512.png` | PNG | 512×512 | Centered, ~10% padding, transparent outer background. |
| `public/icon-maskable-512.png` | PNG | 512×512 | Centered, ~20% padding (generous maskable safe zone), solid background `#F8F7F3`; full important artwork kept inside safe area. |
| `public/site.webmanifest` | JSON | valid | Web app manifest (see below). |
| `public/icons.svg` | — | not present | Inspected previously as an unrelated UI/social sprite and not referenced; no valid brand-favicon purpose identified, so not retained/created (per spec). |

## 3. HTML head (`index.html`)

- **Title:** `CULTURAFT — Furniture & Living`
- **Theme color:** `<meta name="theme-color" content="#252522" />` (ink, CULTURAFT palette)
- **Icon/manifest links (no duplicate/conflicting favicon declarations):**
  - `<link rel="icon" href="/favicon.ico" sizes="48x48" />`
  - `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`
  - `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />`
  - `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />`
  - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`
  - `<link rel="manifest" href="/site.webmanifest" />`
- Existing viewport/fonts/stylesheet/bootstrap and other metadata preserved.

## 4. Web app manifest (`public/site.webmanifest`)

```json
{
  "name": "CULTURAFT",
  "short_name": "CULTURAFT",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#252522",
  "background_color": "#F8F7F3",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Valid JSON; all referenced icon files exist.

## 5. Generation tools & method

- **Available tools:** ImageMagick (`magick`/`convert`/`identify`), Node, npm, Python 3. No Inkscape/rsvg-convert/Sharp CLI available.
- **Method:** The master SVG includes embedded raster data with filters/masks/clips; direct ImageMagick SVG rasterization produced incorrect output. Raster PNGs were rendered reliably via **headless Chromium/Playwright** (system Chrome) from `public/icon.svg` at exact target sizes with centered `object-fit: contain` layout and explicit padding/backgrounds. `favicon.ico` assembled from 16/32/48 PNGs via ImageMagick. `favicon.svg` copied directly from master to preserve exact vector artwork. No online generators, no large package installs.
- **Backgrounds:** `#F8F7F3` (chalk) for apple-touch and maskable icons; transparent outer canvas for favicons and 192/512 icons.

## 6. Validation results

**ALL_OK (programmatic checks)**

1. **SVG valid/preserved:** `icon.svg` and `favicon.svg` are valid SVG markup; `icon.svg` left untouched by this task.
2. **PNG dimensions:** favicon 16×16, 32×32, 48×48; apple-touch 180×180; icon 192×192; icon 512×512; maskable 512×512.
3. **ICO:** valid, 3 frames (16×16, 32×32, 48×48).
4. **Centering/cropping/stretch:** rendered centered with padding; `object-fit: contain` prevents distortion/cropping.
5. **Transparency:** preserved for favicon PNGs and 192/512 icons; solid backgrounds only where required (apple-touch/maskable).
6. **Maskable safe area:** 20% padding applied to keep important artwork within safe zone.
7. **Manifest:** valid JSON, correct fields and icon purposes; referenced files exist.
8. **HTML head:** correct title/theme-color and favicon/apple-touch/manifest references without duplicates/conflicts.
9. **All referenced files exist.**
10. **Preview artifact:** `redesign-artifacts/icon-assets-preview.png` generated earlier as a visual sheet of assets.

## 7. Build

- `npm run build` (`tsc -b && vite build`): **PASS** (Vite v8.3.8, 58 modules; `dist/index.html`, `index-CUngxl7Q.css`, `index-CjnyP0jl.js`).

## 8. Limitations

1. **Visual inspection:** Programmatic validation and a preview screenshot were produced, but this session could not render PNGs for subjective pixel-level review. A quick human check of favicons at 16/32 px and the app/maskable icons in a browser/device context is recommended.
2. **SVG size:** `favicon.svg`/`icon.svg` are ~1.65 MB due to embedded image data in the master; artwork preserved exactly (no lossy/minifying edits that could alter it).
3. **`icons.svg`:** not present and not referenced; omitted as it has no identified valid brand-favicon purpose (unrelated sprite not retained unnecessarily). Only unrelated-site components were not modified.

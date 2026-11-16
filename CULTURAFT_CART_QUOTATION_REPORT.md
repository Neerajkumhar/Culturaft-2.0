# CULTURAFT Cart & WhatsApp Quotation Report

## Summary

Implemented a browser-only quotation cart for the existing 36-product CULTURAFT
catalogue. Customers can add products from product cards or detail pages, adjust
quantities, review price calculations, and open a prefilled WhatsApp quotation.
No backend, database, authentication, payment, or order-processing code was
added.

## Architecture

- `CartProvider` owns shared cart state and is mounted above the application
  routes.
- Cart state stores product IDs and quantities; product names, images, prices,
  categories, and slugs are resolved from `products.json`.
- Reducer operations cover add/increment, quantity updates, remove, and clear.
- `useCart` exposes the same state to the header, product cards, product detail
  pages, notifications, and the cart page.
- `CartToast` gives a brief confirmation after additions. A drawer was not
  added; the optional non-blocking notification approach is used instead.

## Product and Pricing Audit

Verified the current catalogue structure without changing product data:

- 36 products with unique IDs and slugs.
- 27 numeric prices and 9 null prices.
- 173 product image references.
- Numeric price and `priceUnit` values are preserved as supplied.
- Null prices remain non-calculable. Where a source `priceRaw` value exists,
  its original wording is retained alongside the “Price on Request” label.
- Ambiguous string prices are displayed verbatim and are not multiplied.
- Set prices multiply by the number of sets, not by the number of pieces in a
  set.
- When all products are unpriced, the summary says “No prices confirmed” rather
  than implying a zero-price quotation.

## Implemented Features

- Added `AddToCartButton` to every use of `ProductCard` and to product detail
  pages. Card interactions do not trigger product navigation.
- Added an accessible quantity selector on product pages and cart rows.
- Added the header shopping-bag link and total-unit badge.
- Added the `/cart` route with empty state, editorial item rows, remove/clear
  controls, subtotals, and responsive quotation summary.
- Persisted only product IDs and quantities under `culturaft_cart_v1`.
- Validated persisted IDs and quantities; corrupted or invalid entries are
  ignored. Storage failures do not crash the storefront and are logged.
- Built one encoded WhatsApp message from the current resolved cart. The
  existing `VITE_WHATSAPP_NUMBER` configuration and URL validation utility are
  reused; the customer must manually send the prefilled message.
- Preserved single-product WhatsApp enquiries alongside multi-product
  quotations.
- Added focused cart styling using the existing CULTURAFT palette and reduced
  motion support.

## Accessibility and Responsive Review

- Cart icon labels announce the current total quantity.
- Quantity controls have accessible names, disabled boundaries, and a live
  quantity value.
- Add-to-cart feedback uses a polite live region.
- Focus styling uses the existing global focus ring.
- Reviewed rendered screenshots at 1440px, 768px, 390px, and 360px.
- Measured shop, product detail, and cart layouts at 1440px, 1280px, 1024px,
  768px, 390px, and 360px; no horizontal overflow was detected.
- Verified the shop renders all 36 product cards with Add to Cart controls.

## Verification

- `npm test`: **111 tests passed** across 10 test files.
- `npm run build`: **passed** (TypeScript and Vite production build).
- `npm run lint`: completed with existing warnings in unrelated product import,
  category test, image gallery, header, and cart context code.
- Browser-tested add from a product card, duplicate addition/increment, header
  badge totals, selected product-page quantity, cart reload persistence,
  quantity display, clear/empty state, mixed priced and unpriced summaries,
  and a valid `wa.me` quotation link. No message was sent.
- Browser reload check reported no console errors or warnings.
- The production build reports the existing advisory that the main JavaScript
  chunk is slightly above 500 kB.

## Remaining Limitations

- The cart is local to the current browser profile and does not sync across
  devices.
- A cart drawer is intentionally omitted; the add confirmation toast and cart
  page provide the interaction.
- If browser storage is blocked, the cart remains usable for the current tab
  only and a console warning is emitted.
- WhatsApp remains unavailable when `VITE_WHATSAPP_NUMBER` is missing or
  invalid; in that case the quotation action is disabled and the cart remains
  intact.

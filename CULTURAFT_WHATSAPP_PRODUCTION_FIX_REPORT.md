# CULTURAFT WhatsApp Cart Production Fix

## Root Cause

The production cart has no usable WhatsApp quotation URL because the
production-built app resolves `VITE_WHATSAPP_NUMBER` to an invalid/unset value.
On the live site, I added three different products and observed the quotation
control disabled with the app's “no business number is configured” alert. The
cart itself, product resolution, categories, quantities, and price summary
worked.

The browser evidence establishes that the production bundle has no valid
WhatsApp number. The Vercel project settings are not accessible from this
workspace, so I cannot distinguish a missing variable from a malformed value
or change the Vercel setting directly.

Popup blocking was not the cause. The successful path already uses a regular
anchor with a fully-built URL, opened directly by the user's click; it does not
wait on a Promise or call `window.open`.

## Files Inspected

- `src/lib/whatsapp.ts`
- `src/lib/quotation.ts`
- `src/lib/cartPricing.ts`
- `src/context/CartContext.tsx`
- `src/hooks/useCart.ts`
- `src/pages/Cart/CartPage.tsx`
- `src/vite-env.d.ts`
- `.env.example`
- `vite.config.ts`
- `package.json`
- `src/data/products.json`

`src/config/site.ts` does not exist. The existing central WhatsApp configuration
is `VITE_WHATSAPP_NUMBER`, read by `getWhatsAppNumber()` in
`src/lib/whatsapp.ts`.

## Click Flow

1. The cart page reads shared `CartContext` lines through `useCart()`.
2. Each product ID is resolved against `products.json`; unavailable saved
   products are detected rather than silently omitted from a quotation.
3. `resolveLinePricing()` and `summariseCart()` calculate totals without
   converting null or ambiguous prices to zero.
4. The cart page builds each product URL from `window.location.origin`, keeping
   links on the deployed custom domain.
5. `buildCartQuotationUrl()` validates non-empty items, absolute HTTP(S)
   product links, and the configured number, then URL-encodes the complete
   message.
6. With a valid URL, a native user-activated anchor opens `https://wa.me/...`
   in a new tab. No asynchronous work or popup workaround occurs.
7. With invalid/missing configuration, unavailable products, or URL generation
   errors, the action is disabled and a visible explanation is shown. The cart
   is not cleared.

The message includes item names, category/subcategory, quantity, unit price
(including `priceUnit` when present), subtotal or “To Be Confirmed”, absolute
product link, unique product count, total quantity, known subtotal, and the
price-confirmation note when needed.

## Changes Made

- Tightened WhatsApp number normalization: formatted digits and a leading `+`
  are accepted, alphabetic garbage and invalid country-code lengths are
  rejected, and the returned number is digits-only.
- Reject empty messages, empty quotation carts, and non-absolute product URLs.
- Added visible production configuration guidance when the number is invalid
  or missing.
- Added development-only, redacted diagnostics for missing/invalid config and
  quotation URL generation errors.
- Prevented quoting when a saved cart item no longer resolves to a current
  product.
- Added regression tests for number validation, empty messages/carts,
  absolute links, special characters, currency, and multiline text.
- No number was hardcoded. `.env.local` is ignored by Git and was not staged.

## Environment Status

- Local `.env.local`: `VITE_WHATSAPP_NUMBER` is set (value intentionally not
  included in this report or source control).
- Local production build: verified that the configured value is injected into
  the generated JS bundle without printing it.
- Live production site: the cart reports that the number is not configured;
  therefore the deployed bundle has no valid value.
- A new Vercel deployment alone will not correct this until the variable is
  configured in the project environment.

## Validation and Browser Evidence

- `npm test`: **116 tests passed** across 10 test files.
- `npm run build`: passed TypeScript and Vite production build.
- `npm run lint`: no errors in the changed files; pre-existing warnings remain
  in the import script, category test, header, image gallery, and cart context.
- Production browser test on `https://www.culturaft.com`: added three distinct
  products, including a Price on Request item. Verified cart rows, categories,
  quantities, subtotal, and that the quotation action is disabled by the
  invalid/unset production configuration. No WhatsApp message was sent.
- Production WhatsApp opening and prefilled-message verification could not be
  completed because the live button is disabled by the missing valid config.
- The production link generation path is tested locally through unit tests;
  local build output uses the configured local number, which is not disclosed.
- Build retains a Vite advisory that the main JS chunk is slightly over 500 kB.

## Vercel Action Required

1. Open **Vercel Dashboard → CULTURAFT Project → Settings → Environment
   Variables**.
2. Add `VITE_WHATSAPP_NUMBER`.
3. Set its value to the existing CULTURAFT business number in international
   digits-only format, copied from the private local configuration. Do not put
   the number in source code or commit `.env.local`.
4. Select **Production**. Also select **Preview** if preview deployments
   should support WhatsApp enquiries.
5. Save the setting and redeploy the latest production deployment so Vite
   rebuilds with the variable.
6. Re-test a multi-product cart on the production domain. Verify the WhatsApp
   draft contains all items, quantities, prices, and production-domain product
   links. Do not send the message during testing.

## Production Verification Status

The production failure is reproduced and its configuration cause is
identified. The code fix is ready, but the live WhatsApp launch cannot be
verified until the Vercel environment variable is corrected and the new
deployment is live.

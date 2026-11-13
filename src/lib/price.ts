/**
 * Price display formatting for the CULTURAFT storefront.
 *
 * Prices come from products.json in three shapes:
 *  - number         → ₹23,000 (+ optional unit: "₹22,500 1 piece")
 *  - string         → pre-verified, used as-is ("₹15,999 per piece")
 *  - null/undefined → "Price on Request" (never fabricated)
 */

export function formatPrice(
  price: number | string | null | undefined,
  priceUnit?: string | null
): string {
  if (price === null || price === undefined) return 'Price on Request'
  if (typeof price === 'number') {
    const formatted = '₹' + price.toLocaleString('en-IN')
    return priceUnit ? `${formatted} ${priceUnit}` : formatted
  }
  return price
}

/** True when the catalogue has no explicit price for a product. */
export function isPriceOnRequest(
  price: number | string | null | undefined
): boolean {
  return price === null || price === undefined
}

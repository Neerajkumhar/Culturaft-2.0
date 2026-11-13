import {
  buildProductEnquiryUrl,
  type ProductEnquiry,
} from '../lib/whatsapp'

/**
 * Builds a WhatsApp enquiry URL for a product.
 *
 * The business number comes from VITE_WHATSAPP_NUMBER (via import.meta.env,
 * never hardcoded here) and is validated/normalized before the wa.me link is
 * generated. Returns null when the number is not configured or invalid.
 */
export function useWhatsAppUrl({
  productName,
  productSlug,
  category,
  productPrice,
  priceUnit,
}: {
  productName: string
  productSlug: string
  category?: string | null
  productPrice?: number | string | null
  priceUnit?: string | null
}): string | null {
  // The enquiry links back to the product page on the current origin
  // (/product/:slug). Computed here so the pure lib stays browser-agnostic.
  const productUrl =
    typeof window !== 'undefined'
      ? window.location.origin + '/product/' + productSlug
      : null

  return buildProductEnquiryUrl({
    productName,
    productSlug,
    category: category ?? null,
    price: productPrice ?? null,
    priceUnit: priceUnit ?? null,
    productUrl,
  } satisfies ProductEnquiry)
}

/**
 * WhatsApp enquiry utilities for CULTURAFT.
 *
 * The business contact number is configured once via the VITE_WHATSAPP_NUMBER
 * environment variable (digits only, see .env.example) and read through
 * import.meta.env. It is never hardcoded in React components.
 */

/** E.164 allows up to 15 digits; anything shorter than 10 is not callable. */
const MIN_DIGITS = 10
const MAX_DIGITS = 15

/** Product details used to prefill a WhatsApp enquiry message. */
export type ProductEnquiry = {
  productName: string
  productSlug: string
  category?: string | null
  price?: number | string | null
  priceUnit?: string | null
  productUrl?: string | null
}

/**
 * Validate and normalize a WhatsApp number to digits-only.
 * Returns null when the value is missing or not a plausible phone number.
 */
export function normalizeWhatsAppNumber(
  raw: string | null | undefined
): string | null {
  if (raw === null || raw === undefined) return null
  const value = String(raw).trim()
  const compact = value.replace(/[\s().-]/g, '')
  if (!/^\+?\d+$/.test(compact)) return null
  const digits = compact.replace(/\D/g, '')
  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) return null
  if (digits.startsWith('0')) return null
  return digits
}

/**
 * Read and normalize VITE_WHATSAPP_NUMBER from the Vite environment.
 * Returns null when unset or invalid, so callers can skip WhatsApp links.
 */
export function getWhatsAppNumber(): string | null {
  return normalizeWhatsAppNumber(import.meta.env.VITE_WHATSAPP_NUMBER)
}

/**
 * Price line for the enquiry message.
 * Numeric prices are formatted in INR; pre-formatted strings are used as-is;
 * null pricing becomes "Price on Request" (never fabricated).
 */
export function formatEnquiryPrice(
  price: number | string | null | undefined,
  priceUnit?: string | null
): string {
  if (price === null || price === undefined) return 'Price on Request'
  if (typeof price === 'number') {
    const formatted = '₹' + price.toLocaleString('en-IN')
    return priceUnit ? formatted + ' ' + priceUnit : formatted
  }
  return price
}

/** Build the prefilled enquiry message from product details. */
export function buildEnquiryMessage(enquiry: ProductEnquiry): string {
  const lines = [
    "Hi Culturaft! I'm interested in the " + enquiry.productName + '.',
  ]
  if (enquiry.category) {
    lines.push('Category: ' + enquiry.category)
  }
  lines.push('Price: ' + formatEnquiryPrice(enquiry.price, enquiry.priceUnit))
  if (enquiry.productUrl) {
    lines.push('View product: ' + enquiry.productUrl)
  }
  lines.push('Could you please share availability and more details?')
  return lines.join('\n')
}

/**
 * Build a wa.me deep link: https://wa.me/<digits>?text=<encoded message>.
 * Returns null when the number cannot be validated.
 */
export function buildWhatsAppUrl(
  rawNumber: string | null | undefined,
  message: string
): string | null {
  const number = normalizeWhatsAppNumber(rawNumber)
  if (!number || !message.trim()) return null
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message)
}

/**
 * Build a product enquiry URL. Reads VITE_WHATSAPP_NUMBER when no explicit
 * number is passed. Returns null when the number is not configured/valid.
 */
export function buildProductEnquiryUrl(
  enquiry: ProductEnquiry,
  rawNumber?: string | null
): string | null {
  const number = rawNumber !== undefined ? rawNumber : getWhatsAppNumber()
  return buildWhatsAppUrl(number, buildEnquiryMessage(enquiry))
}

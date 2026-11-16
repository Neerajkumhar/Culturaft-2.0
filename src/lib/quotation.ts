/**
 * Multi-product WhatsApp quotation message.
 *
 * The message is built from already-resolved line data (no catalogue lookup
 * here) so it stays pure and DOM-free. The business number is read through the
 * existing whatsapp utility and never hardcoded.
 */
import type { CartSummary } from './cartPricing'
import { buildWhatsAppUrl, getWhatsAppNumber } from './whatsapp'

export type QuotationItem = {
  name: string
  category: string
  subcategory: string | null
  quantity: number
  unitPriceText: string
  lineSubtotalText: string
  calculable: boolean
  productUrl: string
}

const SEPARATOR = '--------------------------------'

/** Build the complete prefilled quotation message for the whole cart. */
export function buildCartQuotationMessage(
  items: QuotationItem[],
  summary: CartSummary
): string {
  const lines: string[] = [
    'Hi CULTURAFT!',
    '',
    'I would like to request a quotation for the following furniture products:',
    '',
  ]

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`)
    lines.push('')
    lines.push(`Category: ${item.category}`)
    if (item.subcategory) lines.push(`Subcategory: ${item.subcategory}`)
    lines.push(`Quantity: ${item.quantity}`)
    lines.push(`Price: ${item.unitPriceText}`)
    lines.push(`Line Subtotal: ${item.lineSubtotalText}`)
    lines.push(`Product Link: ${item.productUrl}`)
    lines.push('')
  })

  lines.push(SEPARATOR)
  lines.push('')
  lines.push(`Total Unique Products: ${summary.uniqueCount}`)
  lines.push(`Total Quantity: ${summary.totalQuantity}`)
  lines.push('')
  lines.push(`${summary.totalLabel}: ${summary.knownSubtotalText}`)
  lines.push('')

  if (summary.onRequestCount > 0) {
    lines.push('Some selected products require price confirmation.')
    lines.push('The above subtotal excludes those products.')
    lines.push('')
  }

  lines.push(
    'Please share the complete quotation, product availability and delivery details.'
  )
  lines.push('')
  lines.push('Thank you!')
  lines.push('')
  lines.push('CULTURAFT')

  return lines.join('\n')
}

/**
 * Build the wa.me click-to-chat URL for the cart quotation.
 * Returns null when the configured number is missing or invalid, so the caller
 * can show an error instead of opening a broken link.
 */
export function buildCartQuotationUrl(
  items: QuotationItem[],
  summary: CartSummary,
  rawNumber?: string | null
): string | null {
  const number = rawNumber !== undefined ? rawNumber : getWhatsAppNumber()
  return buildWhatsAppUrl(number, buildCartQuotationMessage(items, summary))
}

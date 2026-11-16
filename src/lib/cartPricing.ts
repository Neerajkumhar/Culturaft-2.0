/**
 * Price calculation for the cart.
 *
 * products.json stores `price` as a number or null (no string prices exist),
 * plus an optional `priceUnit` ("per piece", "2-Piece Set", "1 Piece").
 * A null price is "Price on Request" and is NEVER treated as zero. Any string
 * price is preserved verbatim and left non-calculable, since its semantics
 * cannot be interpreted unambiguously.
 */
import type { Product } from '@/types/product'
import { formatPrice } from './price'

export type ResolvedCartLine = {
  product: Product
  quantity: number
}

export type LinePricing = {
  /** Unit price as displayed, e.g. "₹15,999 per piece" or "Price on Request". */
  unitPriceText: string
  /** Line subtotal as displayed, e.g. "₹31,998" or "To Be Confirmed". */
  lineSubtotalText: string
  /** Whether the line contributes a real number to the known subtotal. */
  calculable: boolean
  /** The numeric subtotal, or null when not calculable. */
  lineSubtotalNumber: number | null
}

export type CartSummary = {
  uniqueCount: number
  totalQuantity: number
  knownSubtotal: number
  knownSubtotalText: string
  /** Number of product types whose price must be confirmed. */
  onRequestCount: number
  allCalculable: boolean
  totalLabel: 'Estimated Total' | 'Known Subtotal'
}

/** Format a number as Indian rupees, e.g. 31998 -> "₹31,998". */
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}

/** Resolve the display strings and calculability for one cart line. */
export function resolveLinePricing(product: Product, quantity: number): LinePricing {
  const { price, priceUnit } = product

  if (typeof price === 'number' && Number.isFinite(price)) {
    const subtotal = price * quantity
    return {
      unitPriceText: formatPrice(price, priceUnit),
      lineSubtotalText: formatINR(subtotal),
      calculable: true,
      lineSubtotalNumber: subtotal,
    }
  }

  if (typeof price === 'string' && price.trim().length > 0) {
    return {
      unitPriceText: price,
      lineSubtotalText: 'To Be Confirmed',
      calculable: false,
      lineSubtotalNumber: null,
    }
  }

  return {
    unitPriceText: 'Price on Request',
    lineSubtotalText: 'To Be Confirmed',
    calculable: false,
    lineSubtotalNumber: null,
  }
}

/** Aggregate a resolved cart into the numbers and labels the summary shows. */
export function summariseCart(lines: ResolvedCartLine[]): CartSummary {
  let knownSubtotal = 0
  let onRequestCount = 0
  let totalQuantity = 0

  for (const line of lines) {
    totalQuantity += line.quantity
    const pricing = resolveLinePricing(line.product, line.quantity)
    if (pricing.calculable && pricing.lineSubtotalNumber !== null) {
      knownSubtotal += pricing.lineSubtotalNumber
    } else {
      onRequestCount += 1
    }
  }

  const allCalculable = onRequestCount === 0
  return {
    uniqueCount: lines.length,
    totalQuantity,
    knownSubtotal,
    knownSubtotalText: formatINR(knownSubtotal),
    onRequestCount,
    allCalculable,
    totalLabel: allCalculable ? 'Estimated Total' : 'Known Subtotal',
  }
}

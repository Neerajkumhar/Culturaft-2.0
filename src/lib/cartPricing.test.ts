import { describe, it, expect } from 'vitest'
import type { Product } from '@/types/product'
import { formatINR, resolveLinePricing, summariseCart } from './cartPricing'

/** Build a minimal Product with only the fields pricing reads. */
function product(price: number | string | null, priceUnit: string | null = null): Product {
  return { id: 'p', slug: 'p', name: 'Piece', price, priceUnit } as unknown as Product
}

describe('resolveLinePricing', () => {
  it('multiplies a numeric price by the quantity', () => {
    const result = resolveLinePricing(product(18000), 2)
    expect(result.calculable).toBe(true)
    expect(result.lineSubtotalNumber).toBe(36000)
    expect(result.lineSubtotalText).toBe('₹36,000')
    expect(result.unitPriceText).toBe('₹18,000')
  })

  it('keeps a per-piece unit in the unit price text', () => {
    const result = resolveLinePricing(product(15999, 'per piece'), 2)
    expect(result.unitPriceText).toBe('₹15,999 per piece')
    expect(result.lineSubtotalNumber).toBe(31998)
    expect(result.lineSubtotalText).toBe('₹31,998')
  })

  it('calculates a set price by the number of sets', () => {
    const result = resolveLinePricing(product(26000, '2-Piece Set'), 2)
    expect(result.unitPriceText).toBe('₹26,000 2-Piece Set')
    expect(result.lineSubtotalNumber).toBe(52000)
    expect(result.lineSubtotalText).toBe('₹52,000')
  })

  it('treats a null price as Price on Request, never as zero', () => {
    const result = resolveLinePricing(product(null), 3)
    expect(result.calculable).toBe(false)
    expect(result.lineSubtotalNumber).toBeNull()
    expect(result.unitPriceText).toBe('Price on Request')
    expect(result.lineSubtotalText).toBe('To Be Confirmed')
  })

  it('preserves an ambiguous string price without calculating it', () => {
    const result = resolveLinePricing(product('₹26,000 (2-Piece Set)'), 2)
    expect(result.calculable).toBe(false)
    expect(result.lineSubtotalNumber).toBeNull()
    expect(result.unitPriceText).toBe('₹26,000 (2-Piece Set)')
    expect(result.lineSubtotalText).toBe('To Be Confirmed')
  })
})

describe('summariseCart', () => {
  it('sums a fully calculable cart and labels it Estimated Total', () => {
    const summary = summariseCart([
      { product: product(18000), quantity: 2 },
      { product: product(26000, '2-Piece Set'), quantity: 1 },
    ])
    expect(summary.uniqueCount).toBe(2)
    expect(summary.totalQuantity).toBe(3)
    expect(summary.knownSubtotal).toBe(62000)
    expect(summary.knownSubtotalText).toBe('₹62,000')
    expect(summary.onRequestCount).toBe(0)
    expect(summary.allCalculable).toBe(true)
    expect(summary.totalLabel).toBe('Estimated Total')
  })

  it('excludes on-request lines from the known subtotal and labels it Known Subtotal', () => {
    const summary = summariseCart([
      { product: product(18000), quantity: 2 },
      { product: product(null), quantity: 1 },
    ])
    expect(summary.knownSubtotal).toBe(36000)
    expect(summary.onRequestCount).toBe(1)
    expect(summary.allCalculable).toBe(false)
    expect(summary.totalLabel).toBe('Known Subtotal')
  })

  it('reports an empty cart as zero with nothing on request', () => {
    const summary = summariseCart([])
    expect(summary.uniqueCount).toBe(0)
    expect(summary.totalQuantity).toBe(0)
    expect(summary.knownSubtotal).toBe(0)
    expect(summary.onRequestCount).toBe(0)
    expect(summary.allCalculable).toBe(true)
  })
})

describe('formatINR', () => {
  it('formats with Indian digit grouping', () => {
    expect(formatINR(1234567)).toBe('₹12,34,567')
  })
})

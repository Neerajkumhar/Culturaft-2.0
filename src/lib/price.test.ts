import { describe, it, expect } from 'vitest'
import { formatPrice, isPriceOnRequest } from './price'

describe('formatPrice', () => {
  it('formats numeric prices with Indian digit grouping', () => {
    expect(formatPrice(23000)).toBe('₹23,000')
    expect(formatPrice(17599)).toBe('₹17,599')
    expect(formatPrice(10500)).toBe('₹10,500')
  })

  it('appends a price unit when provided', () => {
    expect(formatPrice(22500, '1 piece')).toBe('₹22,500 1 piece')
    expect(formatPrice(12500, null)).toBe('₹12,500')
  })

  it('uses pre-verified string prices verbatim (no double unit)', () => {
    expect(formatPrice('₹15,999 per piece', 'per piece')).toBe('₹15,999 per piece')
    expect(formatPrice('₹26,000 (2-Piece Set)')).toBe('₹26,000 (2-Piece Set)')
  })

  it('falls back to Price on Request for missing prices', () => {
    expect(formatPrice(null)).toBe('Price on Request')
    expect(formatPrice(undefined)).toBe('Price on Request')
  })
})

describe('isPriceOnRequest', () => {
  it('is true only when the price is absent', () => {
    expect(isPriceOnRequest(null)).toBe(true)
    expect(isPriceOnRequest(undefined)).toBe(true)
    expect(isPriceOnRequest(0)).toBe(false)
    expect(isPriceOnRequest('₹15,999 per piece')).toBe(false)
  })
})

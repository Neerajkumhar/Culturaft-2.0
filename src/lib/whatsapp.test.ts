import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  normalizeWhatsAppNumber,
  formatEnquiryPrice,
  buildEnquiryMessage,
  buildWhatsAppUrl,
  getWhatsAppNumber,
  buildProductEnquiryUrl,
} from './whatsapp'

const ENV_KEY = 'VITE_WHATSAPP_NUMBER'

// Widen to a plain record so tests can set/delete the env var without
// fighting the readonly typing on the declared ImportMetaEnv property.
const env = import.meta.env as Record<string, string | undefined>

const envBefore = env[ENV_KEY]

afterEach(() => {
  if (envBefore === undefined) {
    delete env[ENV_KEY]
  } else {
    env[ENV_KEY] = envBefore
  }
})

describe('normalizeWhatsAppNumber', () => {
  it('strips non-digit characters from a formatted number', () => {
    expect(normalizeWhatsAppNumber('+91 93586 94180')).toBe('919358694180')
  })

  it('strips parentheses and dashes', () => {
    expect(normalizeWhatsAppNumber('(+91)-93586-94180')).toBe('919358694180')
  })

  it('returns digits unchanged when already digits-only', () => {
    expect(normalizeWhatsAppNumber('919358694180')).toBe('919358694180')
  })

  it('returns null for an empty string', () => {
    expect(normalizeWhatsAppNumber('')).toBeNull()
  })

  it('returns null for undefined or null input', () => {
    expect(normalizeWhatsAppNumber(undefined)).toBeNull()
    expect(normalizeWhatsAppNumber(null)).toBeNull()
  })

  it('returns null when nothing but non-digits remain', () => {
    expect(normalizeWhatsAppNumber('whatsapp')).toBeNull()
  })

  it('returns null when too few digits remain', () => {
    expect(normalizeWhatsAppNumber('12345')).toBeNull()
  })

  it('returns null when more than 15 digits remain', () => {
    expect(normalizeWhatsAppNumber('1234567890123456')).toBeNull()
  })
})

describe('formatEnquiryPrice', () => {
  it('formats a numeric price in INR with the price unit', () => {
    expect(formatEnquiryPrice(23000, 'per piece')).toBe('₹23,000 per piece')
  })

  it('formats a numeric price without a unit', () => {
    expect(formatEnquiryPrice(23000, null)).toBe('₹23,000')
  })

  it('uses a pre-formatted string price as-is', () => {
    expect(formatEnquiryPrice('₹15,999 per piece', 'per piece')).toBe(
      '₹15,999 per piece'
    )
  })

  it('returns Price on Request for null pricing', () => {
    expect(formatEnquiryPrice(null)).toBe('Price on Request')
    expect(formatEnquiryPrice(null, 'per piece')).toBe('Price on Request')
  })
})

describe('buildEnquiryMessage', () => {
  it('includes the product name, category, price with unit and product URL', () => {
    const message = buildEnquiryMessage({
      productName: 'Aaranya Handwoven Rope Bench',
      productSlug: 'aaranya-handwoven-rope-bench',
      category: 'BENCHES',
      price: 23000,
      priceUnit: 'per piece',
      productUrl: 'https://culturaft.in/product/aaranya-handwoven-rope-bench',
    })

    expect(message).toContain('Aaranya Handwoven Rope Bench')
    expect(message).toContain('Category: BENCHES')
    expect(message).toContain('Price: ₹23,000 per piece')
    expect(message).toContain(
      'View product: https://culturaft.in/product/aaranya-handwoven-rope-bench'
    )
  })

  it('uses the string price as-is for a string price', () => {
    const message = buildEnquiryMessage({
      productName: 'Rope Dining Armchair',
      productSlug: 'rope-dining-armchair',
      category: 'Dining chair',
      price: '₹15,999 per piece',
      priceUnit: 'per piece',
    })

    expect(message).toContain('Price: ₹15,999 per piece')
  })

  it('says Price on Request when the price is null', () => {
    const message = buildEnquiryMessage({
      productName: 'Culturaft Legacy Handwoven Wooden Bench',
      productSlug: 'culturaft-legacy-handwoven-bench',
      category: 'BENCHES',
      price: null,
      priceUnit: null,
      productUrl: 'https://culturaft.in/product/culturaft-legacy-handwoven-bench',
    })

    expect(message).toContain('Price: Price on Request')
  })
})

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me URL with the normalized number and encoded message', () => {
    const message = buildEnquiryMessage({
      productName: 'Aaranya Handwoven Rope Bench',
      productSlug: 'aaranya-handwoven-rope-bench',
    })

    expect(buildWhatsAppUrl('+91 93586 94180', message)).toBe(
      'https://wa.me/919358694180?text=' + encodeURIComponent(message)
    )
  })

  it('returns null when the number is invalid', () => {
    expect(buildWhatsAppUrl('', 'hello')).toBeNull()
    expect(buildWhatsAppNumber_missing())
  })
})

// Helper that always returns null — documents the invalid-number case without
// tripping the type checker on buildWhatsAppUrl(null).
function buildWhatsAppNumber_missing(): boolean {
  expect(buildWhatsAppUrl(undefined, 'hello')).toBeNull()
  return true
}

describe('getWhatsAppNumber', () => {
  beforeEach(() => {
    delete env[ENV_KEY]
  })

  it('reads and normalizes the number from import.meta.env', () => {
    env[ENV_KEY] = '919358694180'
    expect(getWhatsAppNumber()).toBe('919358694180')
  })

  it('normalizes a formatted env value', () => {
    env[ENV_KEY] = '+91 93586 94180'
    expect(getWhatsAppNumber()).toBe('919358694180')
  })

  it('returns null when the env var is not set', () => {
    expect(getWhatsAppNumber()).toBeNull()
  })

  it('returns null when the env var is invalid', () => {
    env[ENV_KEY] = 'not-a-number'
    expect(getWhatsAppNumber()).toBeNull()
  })
})

describe('buildProductEnquiryUrl', () => {
  beforeEach(() => {
    env[ENV_KEY] = '919358694180'
  })

  it('builds a full wa.me enquiry URL from product info', () => {
    const url = buildProductEnquiryUrl({
      productName: 'Aaranya Handwoven Rope Bench',
      productSlug: 'aaranya-handwoven-rope-bench',
      category: 'BENCHES',
      price: 23000,
      priceUnit: 'per piece',
      productUrl: 'https://culturaft.in/product/aaranya-handwoven-rope-bench',
    })

    expect(url).toMatch(/^https:\/\/wa\.me\/919358694180\?text=/)
    const decoded = decodeURIComponent(url!.split('?text=')[1])
    expect(decoded).toContain('Aaranya Handwoven Rope Bench')
    expect(decoded).toContain('Category: BENCHES')
    expect(decoded).toContain('Price: ₹23,000 per piece')
    expect(decoded).toContain('View product: https://culturaft.in/product/aaranya-handwoven-rope-bench')
  })

  it('returns null when the number is not configured', () => {
    delete env[ENV_KEY]
    expect(
      buildProductEnquiryUrl({
        productName: 'Test Product',
        productSlug: 'test-product',
      })
    ).toBeNull()
  })
})

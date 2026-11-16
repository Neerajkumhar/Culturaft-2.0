import { describe, it, expect, afterEach } from 'vitest'
import type { CartSummary } from './cartPricing'
import { buildCartQuotationMessage, buildCartQuotationUrl, type QuotationItem } from './quotation'

const ENV_KEY = 'VITE_WHATSAPP_NUMBER'
const env = import.meta.env as Record<string, string | undefined>
const envBefore = env[ENV_KEY]

afterEach(() => {
  if (envBefore === undefined) delete env[ENV_KEY]
  else env[ENV_KEY] = envBefore
})

const pricedItem: QuotationItem = {
  name: 'Aaranya Handwoven Rope Bench',
  category: 'Benches',
  subcategory: 'Rope Benches',
  quantity: 2,
  unitPriceText: '₹23,000',
  lineSubtotalText: '₹46,000',
  calculable: true,
  productUrl: 'https://culturaft.example/product/aaranya-handwoven-rope-bench',
}

const onRequestItem: QuotationItem = {
  name: 'Culturaft Legacy Handwoven Bench',
  category: 'Benches',
  subcategory: null,
  quantity: 1,
  unitPriceText: 'Price on Request',
  lineSubtotalText: 'To Be Confirmed',
  calculable: false,
  productUrl: 'https://culturaft.example/product/culturaft-legacy-handwoven-bench',
}

const summaryAllPriced: CartSummary = {
  uniqueCount: 1,
  totalQuantity: 2,
  knownSubtotal: 46000,
  knownSubtotalText: '₹46,000',
  onRequestCount: 0,
  allCalculable: true,
  totalLabel: 'Estimated Total',
}

const summaryMixed: CartSummary = {
  uniqueCount: 2,
  totalQuantity: 3,
  knownSubtotal: 46000,
  knownSubtotalText: '₹46,000',
  onRequestCount: 1,
  allCalculable: false,
  totalLabel: 'Known Subtotal',
}

describe('buildCartQuotationMessage', () => {
  it('opens with the CULTURAFT greeting', () => {
    const message = buildCartQuotationMessage([pricedItem], summaryAllPriced)
    expect(message.startsWith('Hi CULTURAFT!')).toBe(true)
  })

  it('includes every item with its name, category and subcategory', () => {
    const message = buildCartQuotationMessage([pricedItem, onRequestItem], summaryMixed)
    expect(message).toContain('1. Aaranya Handwoven Rope Bench')
    expect(message).toContain('2. Culturaft Legacy Handwoven Bench')
    expect(message).toContain('Category: Benches')
    expect(message).toContain('Subcategory: Rope Benches')
  })

  it('omits the subcategory line when there is none', () => {
    const message = buildCartQuotationMessage([onRequestItem], summaryMixed)
    expect(message).not.toContain('Subcategory:')
  })

  it('includes quantity, price, subtotal and product link for each item', () => {
    const message = buildCartQuotationMessage([pricedItem], summaryAllPriced)
    expect(message).toContain('Quantity: 2')
    expect(message).toContain('Price: ₹23,000')
    expect(message).toContain('Line Subtotal: ₹46,000')
    expect(message).toContain(`Product Link: ${pricedItem.productUrl}`)
  })

  it('marks an on-request item as Price on Request / To Be Confirmed', () => {
    const message = buildCartQuotationMessage([onRequestItem], summaryMixed)
    expect(message).toContain('Price: Price on Request')
    expect(message).toContain('Line Subtotal: To Be Confirmed')
  })

  it('includes the totals block', () => {
    const message = buildCartQuotationMessage([pricedItem, onRequestItem], summaryMixed)
    expect(message).toContain('Total Unique Products: 2')
    expect(message).toContain('Total Quantity: 3')
    expect(message).toContain('Known Subtotal: ₹46,000')
  })

  it('uses Estimated Total when every line is calculable', () => {
    const message = buildCartQuotationMessage([pricedItem], summaryAllPriced)
    expect(message).toContain('Estimated Total: ₹46,000')
    expect(message).not.toContain('Some selected products require price confirmation.')
  })

  it('adds the price-confirmation note only when something is on request', () => {
    const message = buildCartQuotationMessage([pricedItem, onRequestItem], summaryMixed)
    expect(message).toContain('Some selected products require price confirmation.')
    expect(message).toContain('The above subtotal excludes those products.')
  })

  it('closes with the request, thanks and the brand name', () => {
    const message = buildCartQuotationMessage([pricedItem], summaryAllPriced)
    expect(message).toContain(
      'Please share the complete quotation, product availability and delivery details.'
    )
    expect(message).toContain('Thank you!')
    expect(message.trimEnd().endsWith('CULTURAFT')).toBe(true)
  })
})

describe('buildCartQuotationUrl', () => {
  it('builds a wa.me URL with the encoded message', () => {
    const url = buildCartQuotationUrl([pricedItem], summaryAllPriced, '919358694180')
    expect(url).toMatch(/^https:\/\/wa\.me\/919358694180\?text=/)
    const decoded = decodeURIComponent(url!.split('?text=')[1])
    expect(decoded).toContain('Aaranya Handwoven Rope Bench')
    expect(decoded).toContain('Total Unique Products: 1')
  })

  it('returns null when no number is configured', () => {
    delete env[ENV_KEY]
    expect(buildCartQuotationUrl([pricedItem], summaryAllPriced)).toBeNull()
  })

  it('returns null when the number is invalid', () => {
    expect(buildCartQuotationUrl([pricedItem], summaryAllPriced, 'nope')).toBeNull()
  })

  it('does not build a quotation URL for an empty cart', () => {
    expect(buildCartQuotationUrl([], summaryAllPriced, '919358694180')).toBeNull()
  })

  it('rejects product links that are not absolute HTTP URLs', () => {
    const item = { ...pricedItem, productUrl: '/product/bench' }
    expect(buildCartQuotationUrl([item], summaryAllPriced, '919358694180')).toBeNull()
  })

  it('preserves special characters, currency, and line breaks through URL encoding', () => {
    const item = {
      ...pricedItem,
      name: 'Rope & Wood Bench — "Aaranya" ❤️',
      subcategory: 'Handwoven\nBenches',
    }
    const url = buildCartQuotationUrl([item], summaryAllPriced, '919358694180')
    const message = decodeURIComponent(url!.split('?text=')[1])
    expect(message).toContain(item.name)
    expect(message).toContain('₹23,000')
    expect(message).toContain('Subcategory: Handwoven\nBenches')
    expect(message).toContain(`Product Link: ${item.productUrl}`)
  })
})

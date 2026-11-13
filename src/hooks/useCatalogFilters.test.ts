import { describe, it, expect } from 'vitest'
import { priceValue } from './useCatalogFilters'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'

const products = productsData as unknown as Product[]

describe('Catalog Filter Utilities', () => {
  it('extracts numeric prices accurately for sorting', () => {
    const pricedProd = products.find((p) => p.priceStatus === 'available')!
    expect(priceValue(pricedProd)).toBe(pricedProd.price)

    const requestProd = products.find((p) => p.priceStatus === 'on-request')!
    expect(priceValue(requestProd)).toBeNull()
  })

  it('searches across multiple product fields', () => {
    // Search by specific keyword
    const sunbrellaResults = products.filter((p) => {
      const searchLower = 'sunbrella'
      const inSpec = Object.values(p.specifications || {}).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(searchLower)
      )
      const inDesc = p.description?.toLowerCase().includes(searchLower)
      const inKeywords = p.searchKeywords?.some((k) => k.toLowerCase().includes(searchLower))
      return inSpec || inDesc || inKeywords
    })
    expect(sunbrellaResults.length).toBeGreaterThan(0)
    expect(sunbrellaResults.some((p) => p.id === 'black-outdoor-rope-armchair')).toBe(true)

    // Search by dimension text
    const dimResults = products.filter((p) => p.dimensions?.includes('110 cm'))
    expect(dimResults.some((p) => p.id === 'aaranya-handwoven-rope-bench')).toBe(true)
  })

  it('filters by usage classification', () => {
    const outdoorProducts = products.filter((p) =>
      p.usageClassification?.toLowerCase().includes('outdoor')
    )
    const indoorProducts = products.filter((p) =>
      p.usageClassification?.toLowerCase().includes('indoor')
    )

    expect(outdoorProducts.length).toBeGreaterThan(0)
    expect(indoorProducts.length).toBeGreaterThan(0)
  })
})

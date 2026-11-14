import { describe, it, expect } from 'vitest'
import { deriveCatalogFacets, matchesEnvironment, matchesMaterial } from './catalogFacets'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'

const products = productsData as unknown as Product[]

describe('catalogFacets', () => {
  it('derives environment options only for values present in the data', () => {
    const { environments } = deriveCatalogFacets(products)
    expect(environments.map((option) => option.value)).toEqual(['indoor', 'outdoor'])
    environments.forEach((option) => expect(option.count).toBeGreaterThan(0))
  })

  it('environment counts match a direct scan of the products', () => {
    const { environments } = deriveCatalogFacets(products)
    const indoor = environments.find((option) => option.value === 'indoor')!
    expect(indoor.count).toBe(products.filter((p) => matchesEnvironment(p, 'indoor')).length)
  })

  it('never emits a material facet that would return no products', () => {
    const { materials } = deriveCatalogFacets(products)
    expect(materials.length).toBeGreaterThan(0)
    materials.forEach((option) => expect(option.count).toBeGreaterThan(0))
  })

  it('mirrors the substring matching of the filter hook ("upholster")', () => {
    // "upholster" must match both "upholstery" and "upholstered" entries.
    const direct = products.filter((p) => matchesMaterial(p, 'upholster')).length
    const { materials } = deriveCatalogFacets(products)
    expect(direct).toBeGreaterThan(0)
    expect(materials.find((option) => option.value === 'upholster')?.count).toBe(direct)
  })

  it('material counts are consistent with the hook predicate', () => {
    const { materials } = deriveCatalogFacets(products)
    materials.forEach((option) => {
      const direct = products.filter((p) => matchesMaterial(p, option.value)).length
      expect(option.count).toBe(direct)
    })
  })
})

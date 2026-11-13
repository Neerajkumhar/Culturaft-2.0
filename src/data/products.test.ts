import { describe, it, expect } from 'vitest'
import productsData from './products.json'
import type { Product } from '@/types/product'

const products = productsData as unknown as Product[]

describe('Product Catalogue Data Integrity', () => {
  it('contains exactly 36 discovered products', () => {
    expect(products).toHaveLength(36)
  })

  it('every product has unique id and slug', () => {
    const ids = products.map((p) => p.id)
    const slugs = products.map((p) => p.slug)
    expect(new Set(ids).size).toBe(36)
    expect(new Set(slugs).size).toBe(36)
  })

  it('exactly 27 products have numeric prices and 9 have price on-request', () => {
    const priced = products.filter((p) => p.priceStatus === 'available')
    const onRequest = products.filter((p) => p.priceStatus === 'on-request')

    expect(priced).toHaveLength(27)
    expect(onRequest).toHaveLength(9)

    for (const p of priced) {
      expect(typeof p.price).toBe('number')
      expect(p.price).toBeGreaterThan(0)
      expect(p.priceDisplay).toMatch(/^₹[0-9,]+/)
      expect(p.priceRaw).toBeTruthy()
    }

    for (const p of onRequest) {
      expect(p.price).toBeNull()
      expect(p.priceDisplay).toBe('Price on Request')
    }
  })

  it('price units are properly extracted for special cases', () => {
    const singleDining = products.find((p) => p.id === 'rope-dining-armchair')
    expect(singleDining?.priceUnit).toBe('per piece')
    expect(singleDining?.price).toBe(15999)

    const twoPiece = products.find((p) => p.id === '2-piece-outdoor-rope-sofa')
    expect(twoPiece?.priceUnit).toBe('2-Piece Set')
    expect(twoPiece?.price).toBe(26000)

    const barStoolSet = products.find((p) => p.id === 'handwoven-rope-bar-stool-set')
    expect(barStoolSet?.priceUnit).toBe('1 Piece')
    expect(barStoolSet?.price).toBe(22500)
  })

  it('every product has verified image paths in valid public format', () => {
    let totalImages = 0

    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0)
      totalImages += product.images.length

      for (const imgPath of product.images) {
        expect(imgPath.startsWith('/images/products/')).toBe(true)
        expect(/\.(jpg|jpeg|png|webp)$/i.test(imgPath)).toBe(true)
      }
    }

    expect(totalImages).toBe(173)
  })

  it('all 31 products with non-empty source files have descriptions, features, and specs', () => {
    const populated = products.filter(
      (p) => !p.dataCompleteness.warnings.some((w) => w.includes('empty (0 bytes)'))
    )

    expect(populated).toHaveLength(31)

    for (const p of populated) {
      expect(p.shortDescription).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.keyFeatures.length).toBeGreaterThan(0)
      expect(Object.keys(p.specifications).length).toBeGreaterThan(0)
      expect(p.dimensions).toBeTruthy()
      expect(p.idealFor.length).toBeGreaterThan(0)
      expect(p.careInstructions.length).toBeGreaterThan(0)
      expect(p.searchKeywords.length).toBeGreaterThan(0)
      expect(p.seoTags.length).toBeGreaterThan(0)
    }
  })

  it('global selling and contact information is preserved on products that define it', () => {
    const blackArmchair = products.find((p) => p.id === 'black-outdoor-rope-armchair')
    expect(blackArmchair?.globalSellingExport).toContain('CULTURAFT is a furniture and home décor manufacturer')
    expect(blackArmchair?.website).toBe('www.culturaft.com')
    expect(blackArmchair?.email).toBe('infoculturaft@gmail.com')

    const beigeArmchair = products.find((p) => p.id === 'beige-rope-metal-armchair')
    expect(beigeArmchair?.globalSellingExport).toContain('Globally Inspired Furniture by CULTURAFT')
    expect(beigeArmchair?.website).toBe('www.culturaft.com')
    expect(beigeArmchair?.email).toBe('infoculturaft@gmail.com')
  })

  it('category and subcategory taxonomy is present on every product', () => {
    for (const p of products) {
      expect(p.category).toBeTruthy()
      expect(p.inventoryCategory).toBeTruthy()
      expect(p.websiteCategory).toBeDefined()
      expect(p.websiteCategory?.parent).toBeTruthy()
      expect(p.websiteCategory?.subcategory).toBeTruthy()
      expect(p.websiteCategory?.slug).toBeTruthy()
    }
  })
})

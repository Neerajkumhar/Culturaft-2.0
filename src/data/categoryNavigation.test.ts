import { describe, it, expect } from 'vitest'
import {
  MAIN_CATEGORIES,
  ALL_SUBCATEGORIES,
  getCategoryProducts,
  getSubcategoryProducts,
  getCategoryBySlug,
  getSubcategory,
  listCategoryProducts,
  categoryCover,
  subcategoryCover,
} from './categoryNavigation'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'

const products = productsData as unknown as Product[]

/** Count of products.json items whose category value maps to each main id. */
const EXPECTED_CATEGORY_COUNTS: Record<string, number> = {
  benches: 6,
  'dining-chairs': 11,
  lounges: 5,
  sofas: 4,
  stools: 5,
  tables: 5,
}

describe('categoryNavigation — taxonomy integrity', () => {
  it('exposes exactly the 6 main categories with verified slugs', () => {
    expect(MAIN_CATEGORIES.map((c) => c.slug)).toEqual([
      'benches',
      'dining-chairs',
      'lounges',
      'sofas',
      'stools',
      'tables',
    ])
  })

  it('counts every one of the 36 products exactly once per category', () => {
    const total = MAIN_CATEGORIES.reduce((sum, c) => sum + c.productCount, 0)
    expect(total).toBe(36)
    for (const category of MAIN_CATEGORIES) {
      expect(category.productCount).toBe(EXPECTED_CATEGORY_COUNTS[category.slug])
    }
  })

  it('computes counts from real products (no phantom ids)', () => {
    const validIds = new Set(products.map((p) => p.id))
    for (const sub of ALL_SUBCATEGORIES) {
      for (const id of sub.productIds) {
        expect(validIds.has(id)).toBe(true)
      }
      expect(sub.productCount).toBe(sub.productIds.length)
    }
  })

  it('subcategory products actually belong to the parent category value', () => {
    for (const sub of ALL_SUBCATEGORIES) {
      const parent = MAIN_CATEGORIES.find((c) => c.id === sub.parentCategory)
      expect(parent).toBeDefined()
      for (const product of getSubcategoryProducts(sub.id)) {
        expect(product.category).toBe(parent!.productCategory)
      }
    }
  })

  it('every subcategory id is unique and slug-safe', () => {
    const ids = ALL_SUBCATEGORIES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

describe('categoryNavigation — lookups', () => {
  it('resolves categories by slug and ignores unknown slugs', () => {
    expect(getCategoryBySlug('benches')?.name).toBe('Benches')
    expect(getCategoryBySlug('nope')).toBeUndefined()
    expect(getCategoryBySlug(undefined)).toBeUndefined()
  })

  it('resolves subcategories and guards against wrong parent', () => {
    expect(getSubcategory('bar-stools')?.label).toBe('Bar Stools')
    expect(getSubcategory('bar-stools', 'stools')).toBeDefined()
    expect(getSubcategory('bar-stools', 'benches')).toBeUndefined()
    expect(getSubcategory(undefined)).toBeUndefined()
  })

  it('listCategoryProducts narrows to a subcategory and defaults to all', () => {
    const all = listCategoryProducts('stools')
    expect(all).toHaveLength(5)
    const narrowed = listCategoryProducts('stools', 'bar-stools')
    expect(narrowed).toHaveLength(3)
    expect(narrowed.every((p) => p.name.includes('Bar Stool'))).toBe(true)
  })

  it('returns real Product objects in data order for every subcategory', () => {
    for (const sub of ALL_SUBCATEGORIES) {
      const subProducts = getSubcategoryProducts(sub.id)
      expect(subProducts).toHaveLength(sub.productCount)
      const dataOrder = products.map((p) => p.id)
      const indexes = subProducts.map((p) => dataOrder.indexOf(p.id))
      expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
    }
  })

  it('covers exist for every category and subcategory (real image paths)', () => {
    for (const category of MAIN_CATEGORIES) {
      expect(categoryCover(category.slug)).toMatch(/^\/images\/products\//)
    }
    for (const sub of ALL_SUBCATEGORIES) {
      expect(subcategoryCover(sub.id)).toMatch(/^\/images\/products\//)
    }
  })
})

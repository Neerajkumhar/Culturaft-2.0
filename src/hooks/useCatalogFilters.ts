import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '@/types/product'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/** Sort options for catalogue listings. */
export type SortKey = 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'

/** Price availability filter. */
export type PriceKey = 'all' | 'priced' | 'request'

const SORT_KEYS: SortKey[] = ['featured', 'name-asc', 'name-desc', 'price-asc', 'price-desc']
const PRICE_KEYS: PriceKey[] = ['all', 'priced', 'request']

/**
 * Numeric value of a product's price for sorting. Numbers as-is; string
 * prices like "₹15,999 per piece" are parsed from the first ₹ amount;
 * null pricing has no value (always sorted last).
 */
export function priceValue(product: Product): number | null {
  const { price } = product
  if (price === null || price === undefined) return null
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    const match = (price as string).match(/₹\s*([\d,]+)/)
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  }
  return null
}

export interface CatalogFilterState {
  query: string
  categorySlug: string | null
  subcategoryId: string | null
  price: PriceKey
  usage: string | null
  material: string | null
  sort: SortKey
}

/**
 * URL-driven catalogue filters so back/forward, refresh and deep links
 * keep the full listing state (`?q=`, `?category=`, `?subcategory=`, `?price=`, `?usage=`, `?material=`, `?sort=`).
 */
export function useCatalogFilters(
  lockedCategorySlug?: string
): CatalogFilterState & {
  setQuery: (value: string) => void
  setCategorySlug: (value: string | null) => void
  setSubcategoryId: (value: string | null) => void
  setPrice: (value: PriceKey) => void
  setUsage: (value: string | null) => void
  setMaterial: (value: string | null) => void
  setSort: (value: SortKey) => void
  clearAll: () => void
  /**
   * Clears the *filters* (search, price, usage, material, sort) but keeps
   * the category and subcategory selection — used by the listing filter
   * bar's "Clear all", which must not reset the category navigation above it.
   */
  clearFilters: () => void
  apply: (products: Product[]) => Product[]
  hasActiveFilters: boolean
} {
  const [params, setParams] = useSearchParams()

  const readParam = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
    const raw = params.get(key)
    return raw && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback
  }

  const query = params.get('q') ?? ''
  const categorySlug = lockedCategorySlug ?? params.get('category')
  const subcategoryId = params.get('subcategory')
  const price = readParam<PriceKey>('price', PRICE_KEYS, 'all')
  const usage = params.get('usage')
  const material = params.get('material')
  const sort = readParam<SortKey>('sort', SORT_KEYS, 'featured')

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params)
      if (value && value !== '' && !(key === 'sort' && value === 'featured')) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      setParams(next, { replace: false })
    },
    [params, setParams]
  )

  const setQuery = (value: string) => setParam('q', value.trim() || null)
  const setCategorySlug = (value: string | null) => {
    if (lockedCategorySlug) return
    const next = new URLSearchParams(params)
    if (value) {
      next.set('category', value)
    } else {
      next.delete('category')
    }
    // Clear subcategory when category changes
    next.delete('subcategory')
    setParams(next, { replace: false })
  }
  const setSubcategoryId = (value: string | null) => setParam('subcategory', value)
  const setPrice = (value: PriceKey) => setParam('price', value === 'all' ? null : value)
  const setUsage = (value: string | null) => setParam('usage', value)
  const setMaterial = (value: string | null) => setParam('material', value)
  const setSort = (value: SortKey) => setParam('sort', value)

  const clearAll = () => {
    const next = new URLSearchParams()
    if (lockedCategorySlug) {
      next.set('category', lockedCategorySlug)
    }
    setParams(next)
  }

  // Same as clearAll, but preserves the current category / subcategory.
  const clearFilters = () => {
    const next = new URLSearchParams()
    const category = lockedCategorySlug ?? params.get('category')
    if (category) next.set('category', category)
    const subcategory = params.get('subcategory')
    if (subcategory) next.set('subcategory', subcategory)
    setParams(next)
  }

  const apply = useCallback(
    (products: Product[]): Product[] => {
      let result = products

      // Category filter (Shop page allows dynamic category selection)
      const activeCategorySlug = lockedCategorySlug ?? categorySlug
      if (activeCategorySlug) {
        const category = MAIN_CATEGORIES.find((c) => c.slug === activeCategorySlug)
        if (category) {
          result = result.filter((p) => p.category === category.productCategory)
        }
      }

      // Subcategory filter
      if (subcategoryId) {
        result = result.filter(
          (p) =>
            p.websiteCategory?.slug === subcategoryId ||
            p.websiteCategory?.subcategory?.toLowerCase().includes(subcategoryId.replace(/-/g, ' '))
        )
      }

      // Price availability
      if (price === 'priced') result = result.filter((p) => p.price !== null)
      if (price === 'request') result = result.filter((p) => p.price === null)

      // Usage classification filter (outdoor / indoor)
      if (usage) {
        const usageLower = usage.toLowerCase()
        result = result.filter((p) => {
          if (!p.usageClassification) return false
          const pUsage = p.usageClassification.toLowerCase()
          return pUsage.includes(usageLower)
        })
      }

      // Material filter
      if (material) {
        const matLower = material.toLowerCase()
        result = result.filter((p) => {
          const specMat = p.specifications?.['Material']
          const matchArray = p.materials?.some((m) => m.toLowerCase().includes(matLower))
          const matchSpec = typeof specMat === 'string' && specMat.toLowerCase().includes(matLower)
          return matchArray || matchSpec
        })
      }

      // Search across ALL Phase 11 required fields:
      // Product name, short description, full description, category, subcategory,
      // materials, specifications, dimensions, key features, ideal for, search keywords,
      // SEO tags, usage classification
      const searchLower = query.toLowerCase().trim()
      if (searchLower) {
        result = result.filter((product) => {
          // 1. Name
          if (product.name.toLowerCase().includes(searchLower)) return true

          // 2. Short description
          if (product.shortDescription && product.shortDescription.toLowerCase().includes(searchLower)) return true

          // 3. Full description
          if (product.description && product.description.toLowerCase().includes(searchLower)) return true

          // 4. Category
          if (product.category.toLowerCase().includes(searchLower)) return true
          if (product.websiteCategory?.parent.toLowerCase().includes(searchLower)) return true

          // 5. Subcategory
          if (product.websiteCategory?.subcategory?.toLowerCase().includes(searchLower)) return true

          // 6. Materials
          if (product.materials?.some((m) => m.toLowerCase().includes(searchLower))) return true

          // 7. Specifications (both keys and values)
          if (product.specifications) {
            for (const [k, v] of Object.entries(product.specifications)) {
              if (k.toLowerCase().includes(searchLower)) return true
              if (typeof v === 'string' && v.toLowerCase().includes(searchLower)) return true
            }
          }

          // 8. Dimensions
          if (product.dimensions && product.dimensions.toLowerCase().includes(searchLower)) return true

          // 9. Key features
          if (product.keyFeatures?.some((f) => f.toLowerCase().includes(searchLower))) return true

          // 10. Ideal For
          if (product.idealFor?.some((u) => u.toLowerCase().includes(searchLower))) return true

          // 11. Search keywords
          if (product.searchKeywords?.some((k) => k.toLowerCase().includes(searchLower))) return true

          // 12. SEO tags
          if (product.seoTags?.some((t) => t.toLowerCase().includes(searchLower))) return true

          // 13. Usage classification
          if (product.usageClassification && product.usageClassification.toLowerCase().includes(searchLower)) return true

          return false
        })
      }

      // Sorting — null pricing always last
      if (sort !== 'featured') {
        result = [...result].sort((a, b) => {
          if (sort === 'name-asc') return a.name.localeCompare(b.name)
          if (sort === 'name-desc') return b.name.localeCompare(a.name)
          const valueA = priceValue(a)
          const valueB = priceValue(b)
          if (valueA === null && valueB === null) return 0
          if (valueA === null) return 1
          if (valueB === null) return -1
          return sort === 'price-asc' ? valueA - valueB : valueB - valueA
        })
      }

      return result
    },
    [lockedCategorySlug, categorySlug, subcategoryId, price, usage, material, query, sort]
  )

  const hasActiveFilters =
    query.trim() !== '' ||
    price !== 'all' ||
    (!lockedCategorySlug && categorySlug !== null) ||
    subcategoryId !== null ||
    usage !== null ||
    material !== null ||
    sort !== 'featured'

  return {
    query,
    categorySlug,
    subcategoryId,
    price,
    usage,
    material,
    sort,
    setQuery,
    setCategorySlug,
    setSubcategoryId,
    setPrice,
    setUsage,
    setMaterial,
    setSort,
    clearAll,
    clearFilters,
    apply,
    hasActiveFilters,
  }
}

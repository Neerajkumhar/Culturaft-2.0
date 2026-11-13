/**
 * CULTURAFT category & subcategory navigation taxonomy.
 *
 * Every subcategory is derived ONLY from verified product names or
 * source-file titles in products.json — nothing is invented. Products that
 * cannot be confidently assigned stay reachable under their category's
 * "All Products" listing. Counts are computed from the real catalogue.
 */
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'

export type MainCategoryId =
  | 'benches'
  | 'dining-chairs'
  | 'lounges'
  | 'sofas'
  | 'stools'
  | 'tables'

export interface Subcategory {
  /** Stable identifier used in URLs: /category/:slug?subcategory=:id */
  id: string
  /** Subcategory display name */
  name: string
  /** URL slug */
  slug: string
  /** Display label (backward compatibility) */
  label: string
  /** Short description shown in mega menu (verified phrasing only) */
  blurb: string
  /** Parent main category id */
  parentCategory: MainCategoryId
  /** Verified product ids belonging to this subcategory */
  productIds: string[]
  /** Computed from products.json */
  productCount: number
  /** Representative image path */
  representativeImage?: string
}

export interface MainCategory {
  id: MainCategoryId
  /** URL slug used in /category/:slug (matches existing routes) */
  slug: MainCategoryId
  name: string
  /** Exact category value stored on products in products.json */
  productCategory: string
  /** One-line merchandising line for the mega menu (factual) */
  blurb: string
  subcategories: Subcategory[]
  /** Computed from products.json */
  productCount: number
  /** Verified product ids */
  productIds: string[]
  /** Representative image path */
  representativeImage?: string
}

const products = productsData as unknown as Product[]

const byId = new Map(products.map((p) => [p.id, p]))

/** Helper: assert the ids actually exist so typos fail loudly at import time. */
function pick(...ids: string[]): string[] {
  for (const id of ids) {
    if (!byId.has(id)) {
      throw new Error(`categoryNavigation: unknown product id "${id}"`)
    }
  }
  return ids
}

/* ---------------------------------------------------------------
   Verified product ids per main category (mirror of products.json)
   --------------------------------------------------------------- */
const CATEGORY_PRODUCT_IDS: Record<MainCategoryId, string[]> = {
  benches: pick(
    'aaranya-handwoven-rope-bench',
    'brenna-hand-woven-paper-cord-bench',
    'culturaft-handwoven-jute-bench',
    'culturaft-legacy-handwoven-bench',
    'natural-rope-wooden-bench',
    'multi-colour-rope-bench'
  ),
  'dining-chairs': pick(
    'beige-rope-metal-armchair',
    'black-outdoor-rope-armchair',
    'black-rope-outdoor-dining-chair',
    'charcoal-braided-rope-armchair',
    'fala-acacia-rope-garden-chair',
    'grey-woven-rope-dining-armchair',
    'rope-metal-dining-armchair',
    'rope-back-dining-chair-cushion',
    'rope-dining-armchair',
    'sage-grey-rope-armchair',
    'wooden-rope-folding-armchair'
  ),
  lounges: pick(
    '2-piece-outdoor-rope-sofa',
    'grey-woven-rope-lounge-chair',
    'haven-taupe-motion-lounge-chair',
    'ocean-blue-woven-rope-lounge-chair',
    'wooden-rope-lounge-chair'
  ),
  sofas: pick(
    'artisan-rope-lounge-sofa',
    'culturaft-5-piece-acacia-set',
    'culturaft-aria-wooden-sofa',
    'luma-outdoor-lounge-sofa'
  ),
  stools: pick(
    'artisan-rope-weave-x-frame-bench',
    'artisan-weave-bar-stool',
    'handwoven-rope-bar-stool-set',
    'handwoven-rope-wooden-stool',
    'indus-rope-bar-stool'
  ),
  tables: pick(
    'amberstone-coffee-table',
    'culturaft-cove-round-end-table',
    'culturaft-malabar-oval-coffee-table',
    'culturaft-orion-coffee-table',
    'culturaft-tripod-accent-table'
  ),
}

/** Exact products.json `category` values, verified from the data audit. */
const PRODUCT_CATEGORY_VALUES: Record<MainCategoryId, string> = {
  benches: 'BENCHES',
  'dining-chairs': 'Dining chair',
  lounges: 'lounge Chair',
  sofas: 'SOFAS',
  stools: 'stool',
  tables: 'Table',
}

/* ---------------------------------------------------------------
   Subcategory definitions — ids are products.json ids, verified
   against product names / source txt titles.
   --------------------------------------------------------------- */
function subcategory(
  parent: MainCategoryId,
  id: string,
  label: string,
  blurb: string,
  ids: string[]
): Subcategory {
  const verifiedIds = pick(...ids)
  const firstProd = byId.get(verifiedIds[0])
  return {
    id,
    name: label,
    slug: id,
    label,
    blurb,
    parentCategory: parent,
    productIds: verifiedIds,
    productCount: verifiedIds.length,
    representativeImage: firstProd?.images[0],
  }
}

const SUBCATEGORIES: Subcategory[] = [
  // Benches — names contain "Handwoven"/"Hand-Woven", "Wooden", "Rope"
  subcategory('benches', 'handwoven-benches', 'Handwoven Benches',
    'Jute, rope and paper-cord weaves worked by hand',
    ['aaranya-handwoven-rope-bench', 'brenna-hand-woven-paper-cord-bench',
      'culturaft-handwoven-jute-bench', 'culturaft-legacy-handwoven-bench',
      'multi-colour-rope-bench']),
  subcategory('benches', 'wooden-benches', 'Wooden Benches',
    'Solid wood frames with woven seats',
    ['brenna-hand-woven-paper-cord-bench', 'culturaft-handwoven-jute-bench',
      'culturaft-legacy-handwoven-bench', 'natural-rope-wooden-bench']),
  subcategory('benches', 'rope-benches', 'Rope Benches',
    'Woven rope in natural and two-tone colourways',
    ['aaranya-handwoven-rope-bench', 'natural-rope-wooden-bench',
      'multi-colour-rope-bench']),

  // Dining Chairs — "Outdoor"/"Garden" in names; "Armchair" in names; "Folding"
  subcategory('dining-chairs', 'outdoor-dining-chairs', 'Outdoor Dining Chairs',
    'Rope and acacia pieces made for terraces and gardens',
    ['black-outdoor-rope-armchair', 'black-rope-outdoor-dining-chair',
      'grey-woven-rope-dining-armchair', 'sage-grey-rope-armchair',
      'fala-acacia-rope-garden-chair']),
  subcategory('dining-chairs', 'rope-armchairs', 'Rope Armchairs',
    'Sculptural rope-woven backs with armrests',
    ['beige-rope-metal-armchair', 'black-outdoor-rope-armchair',
      'charcoal-braided-rope-armchair', 'grey-woven-rope-dining-armchair',
      'rope-dining-armchair', 'rope-metal-dining-armchair',
      'sage-grey-rope-armchair']),
  subcategory('dining-chairs', 'folding-chairs', 'Folding Chairs',
    'Wood-and-rope armchairs that fold away',
    ['wooden-rope-folding-armchair']),

  // Lounge Chairs — "Woven Rope Lounge Chair" names; "Motion" in Haven Taupe
  subcategory('lounges', 'woven-rope-lounge-chairs', 'Woven Rope Lounge Chairs',
    'Deep, relaxed seating woven in rope',
    ['grey-woven-rope-lounge-chair', 'ocean-blue-woven-rope-lounge-chair',
      'wooden-rope-lounge-chair']),
  subcategory('lounges', 'motion-lounge-chairs', 'Motion Lounge Chairs',
    'Reclining comfort with a padded backrest',
    ['haven-taupe-motion-lounge-chair']),

  // Sofas — "Outdoor" in Luma and the 5-Piece Acacia name; "Conversation Set"
  subcategory('sofas', 'outdoor-sofas', 'Outdoor Sofas',
    'Cushioned lounge seating for open air',
    ['luma-outdoor-lounge-sofa', 'culturaft-5-piece-acacia-set']),
  subcategory('sofas', 'conversation-sets', 'Conversation Sets',
    'Complete outdoor arrangements, ready to style',
    ['culturaft-5-piece-acacia-set']),

  // Stools — "Bar Stool" in names; "Handwoven" in names
  subcategory('stools', 'bar-stools', 'Bar Stools',
    'Counter-height seating with woven seats',
    ['artisan-weave-bar-stool', 'handwoven-rope-bar-stool-set',
      'indus-rope-bar-stool']),
  subcategory('stools', 'handwoven-stools', 'Handwoven Stools',
    'Compact handwoven pieces, indoors or out',
    ['handwoven-rope-wooden-stool', 'handwoven-rope-bar-stool-set']),

  // Tables — "Coffee Table", "End Table", "Accent Table" in names
  subcategory('tables', 'coffee-tables', 'Coffee Tables',
    'Statement centres for the living room',
    ['amberstone-coffee-table', 'culturaft-malabar-oval-coffee-table',
      'culturaft-orion-coffee-table']),
  subcategory('tables', 'end-tables', 'End Tables',
    'Round rope-woven side tables with wood tops',
    ['culturaft-cove-round-end-table']),
  subcategory('tables', 'accent-tables', 'Accent Tables',
    'Small woven tables that finish a corner',
    ['culturaft-tripod-accent-table', 'culturaft-orion-coffee-table']),
]

/* ---------------------------------------------------------------
   Public catalogue
   --------------------------------------------------------------- */
export const MAIN_CATEGORIES: MainCategory[] = (
  Object.keys(PRODUCT_CATEGORY_VALUES) as MainCategoryId[]
).map((id) => {
  const pIds = CATEGORY_PRODUCT_IDS[id]
  const firstProd = byId.get(pIds[0])
  return {
    id,
    slug: id,
    name:
      id === 'benches' ? 'Benches'
        : id === 'dining-chairs' ? 'Dining Chairs'
          : id === 'lounges' ? 'Lounge Chairs'
            : id === 'sofas' ? 'Sofas'
              : id === 'stools' ? 'Stools'
                : 'Tables',
    productCategory: PRODUCT_CATEGORY_VALUES[id],
    blurb:
      id === 'benches' ? 'Handwoven benches for entries, bedsides and living rooms'
        : id === 'dining-chairs' ? 'Rope-woven chairs for the table and the terrace'
          : id === 'lounges' ? 'Deep-woven seating for slow evenings'
            : id === 'sofas' ? 'Cushioned lounge sofas and outdoor arrangements'
              : id === 'stools' ? 'Woven stools and counter-height bar seating'
                : 'Woven-rope and wood tables for every corner',
    subcategories: SUBCATEGORIES.filter((s) => s.parentCategory === id),
    productCount: pIds.length,
    productIds: pIds,
    representativeImage: firstProd?.images[0],
  }
})

/** Flat subcategory list. */
export const ALL_SUBCATEGORIES: Subcategory[] = SUBCATEGORIES

/** Products of a main category (real Product objects, data order preserved). */
export function getCategoryProducts(categoryId: MainCategoryId): Product[] {
  const ids = new Set(CATEGORY_PRODUCT_IDS[categoryId])
  return products.filter((p) => ids.has(p.id))
}

/** Products of a subcategory (real Product objects, data order preserved). */
export function getSubcategoryProducts(subId: string): Product[] {
  const sub = SUBCATEGORIES.find((s) => s.id === subId)
  if (!sub) return []
  const ids = new Set(sub.productIds)
  return products.filter((p) => ids.has(p.id))
}

/** Resolve a main category by slug. */
export function getCategoryBySlug(slug: string | undefined): MainCategory | undefined {
  return MAIN_CATEGORIES.find((c) => c.slug === slug)
}

/** Resolve a subcategory by id, optionally guarding the parent. */
export function getSubcategory(
  subId: string | undefined,
  parentId?: MainCategoryId
): Subcategory | undefined {
  if (!subId) return undefined
  return SUBCATEGORIES.find(
    (s) => s.id === subId && (parentId === undefined || s.parentCategory === parentId)
  )
}

/** Products for a category, optionally narrowed to a subcategory id. */
export function listCategoryProducts(
  categoryId: MainCategoryId,
  subcategoryId?: string
): Product[] {
  return subcategoryId
    ? getSubcategoryProducts(subcategoryId)
    : getCategoryProducts(categoryId)
}

/** First image of a product, or undefined. */
export function productCover(product: Product | undefined): string | undefined {
  return product?.images[0]
}

/** Cover image for a main category (used in mega menu / category tiles). */
export function categoryCover(categoryId: MainCategoryId): string | undefined {
  return productCover(getCategoryProducts(categoryId)[0])
}

/** Cover image for a subcategory. */
export function subcategoryCover(subId: string): string | undefined {
  return productCover(getSubcategoryProducts(subId)[0])
}

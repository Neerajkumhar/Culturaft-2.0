import type { Product } from '@/types/product'

/**
 * Catalogue facets — the option lists for the environment and material
 * dropdowns, derived from the live product data rather than a fixed list.
 *
 * The raw data is messy: `materials` holds 38 free-text strings
 * ("Acacia Wood & Woven Rope", "woven rope", "metal frame", …) and
 * `usageClassification` holds full sentences. Presenting those verbatim
 * would produce an unusable dropdown, so each product is mapped to a small
 * vocabulary of material families. The families are only *candidates* —
 * an option is shown (with a live count) only when at least one product
 * matches it, so the lists always reflect what is actually in the catalogue.
 *
 * IMPORTANT: the matching predicates below mirror the filtering performed by
 * `useCatalogFilters.apply()` (which is intentionally left untouched). Keep
 * them in sync so the counts shown never disagree with the filter result.
 */

export interface FacetOption {
  /** Value passed to the filter hook — a substring of the product's data. */
  value: string
  /** Human label shown in the UI. */
  label: string
  /** Number of products this option would select. */
  count: number
}

/**
 * Material families, in display order. `value` must be a substring of the
 * product's `materials` entries or `specifications.Material` so that the
 * existing substring filter selects the same set. `upholster` intentionally
 * matches both "upholstery" and "upholstered".
 */
const MATERIAL_FAMILIES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'wood', label: 'Wood' },
  { value: 'rope', label: 'Rope' },
  { value: 'jute', label: 'Jute' },
  { value: 'paper cord', label: 'Paper Cord' },
  { value: 'metal', label: 'Metal' },
  { value: 'upholster', label: 'Upholstery' },
]

/** Environment families, in display order. */
const ENVIRONMENT_FAMILIES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
]

/** Mirrors the usage branch of `useCatalogFilters.apply()`. */
export function matchesEnvironment(product: Product, value: string): boolean {
  if (!product.usageClassification) return false
  return product.usageClassification.toLowerCase().includes(value.toLowerCase())
}

/** Mirrors the material branch of `useCatalogFilters.apply()`. */
export function matchesMaterial(product: Product, value: string): boolean {
  const needle = value.toLowerCase()
  const specMaterial = product.specifications?.['Material']
  const inMaterials = product.materials?.some((m) => m.toLowerCase().includes(needle)) ?? false
  const inSpec = typeof specMaterial === 'string' && specMaterial.toLowerCase().includes(needle)
  return inMaterials || inSpec
}

/**
 * Derives the dropdown options from the product data: every family that at
 * least one product matches, with its live count. Families with no matches
 * are omitted, so the UI never offers an empty result.
 */
export function deriveCatalogFacets(products: Product[]): {
  environments: FacetOption[]
  materials: FacetOption[]
} {
  const environments = ENVIRONMENT_FAMILIES.map((family) => ({
    ...family,
    count: products.filter((p) => matchesEnvironment(p, family.value)).length,
  })).filter((option) => option.count > 0)

  const materials = MATERIAL_FAMILIES.map((family) => ({
    ...family,
    count: products.filter((p) => matchesMaterial(p, family.value)).length,
  })).filter((option) => option.count > 0)

  return { environments, materials }
}

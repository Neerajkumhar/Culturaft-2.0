import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { useCatalogFilters } from '@/hooks/useCatalogFilters'
import {
  Breadcrumb,
  CatalogGrid,
  CatalogToolbar,
  SubcategoryChips,
} from '@/components/catalog/CatalogChrome'
import {
  MAIN_CATEGORIES,
  getCategoryBySlug,
  getSubcategory,
  listCategoryProducts,
} from '@/data/categoryNavigation'

/**
 * Category listing — one of the six verified collections, optionally
 * narrowed to a subcategory via ?subcategory=<id>.
 * Route: /category/:slug
 */
export default function CategoryPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const products = useProducts()

  const category = getCategoryBySlug(slug)

  // Unknown slug — useful 404 state, never a silent redirect.
  if (!category) {
    return (
      <div className="wrap py-20 text-center lg:py-28">
        <p className="eyebrow text-fog">Error 404</p>
        <h1 className="mt-3 text-h1">Collection Not Found</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-charcoal">
          We couldn't find a collection matching
          {slug ? ` “${slug}”` : ' that link'}. Browse a collection instead.
        </p>
        <nav aria-label="Available collections" className="mt-10 flex flex-wrap justify-center gap-2">
          {MAIN_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="inline-flex min-h-11 items-center border border-line-strong bg-paper px-4 text-sm text-charcoal transition-colors hover:border-ink hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <Link to="/shop" className="btn btn-primary">
            Browse All Furniture
          </Link>
        </div>
      </div>
    )
  }

  const subcategory = getSubcategory(params.get('subcategory') ?? undefined, category.slug)

  return (
    <CategoryListing
      key={category.slug}
      categorySlug={category.slug}
      categoryName={category.name}
      categoryBlurb={category.blurb}
      productCategory={category.productCategory}
      subcategoryId={subcategory?.id ?? null}
      subcategoryLabel={subcategory?.label ?? null}
      products={products}
      setParams={setParams}
    />
  )
}

/**
 * Inner component keeps hook order stable across the 404 branch above.
 * The `key` on the outer call resets state when switching categories.
 */
function CategoryListing({
  categorySlug,
  categoryName,
  categoryBlurb,
  productCategory,
  subcategoryId,
  subcategoryLabel,
  products,
  setParams,
}: {
  categorySlug: string
  categoryName: string
  categoryBlurb: string
  productCategory: string
  subcategoryId: string | null
  subcategoryLabel: string | null
  products: ReturnType<typeof useProducts>
  setParams: (next: URLSearchParams) => void
}) {
  const categoryData = MAIN_CATEGORIES.find((c) => c.slug === categorySlug)!
  const allInCategory = useMemo(
    () => products.filter((p) => p.category === productCategory),
    [products, productCategory]
  )
  // Category is locked to this listing; only search/price/sort are user filters.
  const filters = useCatalogFilters(categoryData.slug)
  const visible = useMemo(
    () => filters.apply(listCategoryProducts(categoryData.slug, subcategoryId ?? undefined)),
    [filters, categoryData.slug, subcategoryId]
  )

  const clearSubcategory = () => {
    const next = new URLSearchParams()
    const q = filters.query.trim()
    if (q) next.set('q', q)
    if (filters.price !== 'all') next.set('price', filters.price)
    if (filters.sort !== 'featured') next.set('sort', filters.sort)
    setParams(next)
  }

  /** Clears search/price/sort but keeps the active subcategory context. */
  const clearToolbarKeepSubcategory = () => {
    const next = new URLSearchParams()
    if (subcategoryId) next.set('subcategory', subcategoryId)
    setParams(next)
  }

  return (
    <div className="wrap">
      <Breadcrumb
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: categoryName },
        ]}
      />

      {/* Page heading — category or subcategory */}
      <header className="border-t border-line py-10 lg:py-14">
        <p className="eyebrow text-fog">
          {subcategoryId ? 'Subcollection' : 'Collection'}
        </p>
        <h1 className="mt-2 text-h1">{subcategoryId ? subcategoryLabel : categoryName}</h1>
        <p className="mt-4 max-w-xl text-lead text-charcoal">
          {subcategoryId
            ? `${visible.length} of ${allInCategory.length} ${categoryName.toLowerCase()} — ${categoryBlurb.toLowerCase()}`
            : categoryBlurb}
        </p>
        <p className="mt-2 text-sm text-fog">
          {allInCategory.length} {allInCategory.length === 1 ? 'piece' : 'pieces'} in{' '}
          {categoryName}
        </p>
      </header>

      {/* Subcategory chips — verified groupings with real counts */}
      <div className="pb-6">
        <SubcategoryChips
          basePath={`/category/${categorySlug}`}
          options={categoryData.subcategories.map((s) => ({
            id: s.id,
            label: s.label,
            productCount: s.productCount,
          }))}
          activeId={subcategoryId}
          onClear={clearSubcategory}
          clearLabel={`All ${categoryName}`}
        />
      </div>

      <CatalogToolbar
        searchValue={filters.query}
        onSearch={filters.setQuery}
        searchPlaceholder={`Search ${categoryName.toLowerCase()}…`}
        price={filters.price}
        onPrice={filters.setPrice}
        usage={filters.usage}
        onUsage={filters.setUsage}
        material={filters.material}
        onMaterial={filters.setMaterial}
        sort={filters.sort}
        onSort={filters.setSort}
        action={
          filters.hasActiveFilters ? (
            <button
              type="button"
              onClick={clearToolbarKeepSubcategory}
              className="btn btn-outline px-4 py-2 text-xs"
            >
              Clear filters
            </button>
          ) : undefined
        }
      />

      <section aria-label={`${categoryName} products`} className="py-12">
        <CatalogGrid
          products={visible}
          emptyTitle={
            filters.query
              ? `No ${categoryName.toLowerCase()} match “${filters.query}”`
              : `No ${categoryName.toLowerCase()} match these filters`
          }
          emptyBody="Try a different search term, or clear the filters to see every piece in this collection."
          onClear={clearToolbarKeepSubcategory}
        />
      </section>
    </div>
  )
}

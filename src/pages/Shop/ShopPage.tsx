import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCatalogFilters } from '@/hooks/useCatalogFilters'
import { Breadcrumb, CatalogGrid } from '@/components/catalog/CatalogChrome'
import { CategoryNav } from '@/components/catalog/CategoryNav'
import { ProductFilters } from '@/components/product/ProductFilters'
import { deriveCatalogFacets } from '@/lib/catalogFacets'

/**
 * Shop — all 36 verified pieces with URL-driven search, category,
 * environment, material, price availability and sort. Route: /shop
 *
 * The category navigation (state-driven tabs) sits above a compact
 * filter bar; the filter options are derived from the live product data so
 * they never drift from the catalogue.
 */
export default function ShopPage() {
  const products = useProducts()
  const filters = useCatalogFilters()

  const visible = useMemo(() => filters.apply(products), [filters, products])
  const facets = useMemo(() => deriveCatalogFacets(products), [products])

  return (
    <>
      <div className="wrap">
        <Breadcrumb
          trail={[
            { label: 'Home', to: '/' },
            { label: 'Shop' },
          ]}
        />

        {/* Page heading */}
        <header className="border-t border-line py-10 lg:py-14">
          <p className="eyebrow text-fog">The Collection</p>
          <h1 className="mt-2 max-w-2xl text-h1">Shop All Furniture</h1>
          <p className="mt-4 max-w-xl text-lead text-charcoal">
            {products.length} handwoven pieces in rope, jute, paper cord and
            solid wood. Priced in INR; enquire on WhatsApp.
          </p>
        </header>

        {/* Category + subcategory navigation */}
        <CategoryNav
          activeSlug={filters.categorySlug}
          onSelectCategory={filters.setCategorySlug}
          activeSubcategoryId={filters.subcategoryId}
          onSelectSubcategory={filters.setSubcategoryId}
          totalCount={products.length}
        />

        {/* Compact filter toolbar */}
        <ProductFilters
          searchValue={filters.query}
          onSearch={filters.setQuery}
          searchPlaceholder="Search furniture, materials or keywords…"
          price={filters.price}
          onPrice={filters.setPrice}
          usage={filters.usage}
          onUsage={filters.setUsage}
          material={filters.material}
          onMaterial={filters.setMaterial}
          sort={filters.sort}
          onSort={filters.setSort}
          environments={facets.environments}
          materials={facets.materials}
          visibleCount={visible.length}
          totalCount={products.length}
          onClear={filters.clearFilters}
        />

        <section aria-label="Products" className="py-12">
          <CatalogGrid
            products={visible}
            emptyTitle={
              filters.query ? `No pieces match “${filters.query}”` : 'No pieces match these filters'
            }
            emptyBody="Try a different search term, or clear the filters to browse the full collection of handwoven furniture."
            onClear={filters.clearFilters}
          />
        </section>
      </div>
    </>
  )
}

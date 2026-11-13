import { useMemo } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useCatalogFilters } from '@/hooks/useCatalogFilters'
import {
  Breadcrumb,
  CatalogGrid,
  CatalogToolbar,
} from '@/components/catalog/CatalogChrome'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * Shop — all 36 verified pieces with URL-driven search, category,
 * price availability and sort. Route: /shop
 */
export default function ShopPage() {
  const products = useProducts()
  const filters = useCatalogFilters()

  const visible = useMemo(() => filters.apply(products), [filters, products])

  const clearAll = () => filters.clearAll()

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

        {/* Category quick filter — pills with real counts */}
        <div className="flex flex-wrap gap-2 pb-4" role="group" aria-label="Filter by category">
          <button
            type="button"
            onClick={() => filters.setCategorySlug(null)}
            aria-pressed={filters.categorySlug === null}
            className={`inline-flex min-h-11 items-center border px-4 text-sm transition-colors ${
              filters.categorySlug === null
              ? 'border-brand-primary bg-brand-primary text-foreground font-medium'
              : 'border-line-strong bg-paper text-charcoal hover:border-brand-primary hover:text-ink'
            }`}
          >
            All Categories
            <span className={`ml-2 text-xs ${filters.categorySlug === null ? 'text-foreground' : 'text-fog'}`}>
              {products.length}
            </span>
          </button>
          {MAIN_CATEGORIES.map((category) => {
            const isActive = filters.categorySlug === category.slug
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => filters.setCategorySlug(category.slug)}
                aria-pressed={isActive}
                className={`inline-flex min-h-11 items-center border px-4 text-sm transition-colors ${
                  isActive
                      ? 'border-brand-primary bg-brand-primary text-foreground font-medium'
                      : 'border-line-strong bg-paper text-charcoal hover:border-brand-primary hover:text-ink'
                }`}
              >
                {category.name}
                  <span className={`ml-2 text-xs ${isActive ? 'text-foreground' : 'text-fog'}`}>
                  {category.productCount}
                </span>
              </button>
            )
          })}
        </div>

        {/* Subcategory pills when a category is selected */}
        {filters.categorySlug && (() => {
          const activeCat = MAIN_CATEGORIES.find((c) => c.slug === filters.categorySlug)
          if (!activeCat || activeCat.subcategories.length === 0) return null
          return (
            <div className="flex flex-wrap items-center gap-2 pb-5 pt-1" role="group" aria-label="Filter by subcategory">
              <span className="text-xs text-fog uppercase tracking-wider font-mono mr-1">Subcategories:</span>
              <button
                type="button"
                onClick={() => filters.setSubcategoryId(null)}
                aria-pressed={filters.subcategoryId === null}
                className={`inline-flex min-h-8 items-center border px-3 text-xs transition-colors ${
                  filters.subcategoryId === null
                    ? 'border-brand-primary bg-brand-primary text-foreground font-medium'
                    : 'border-line bg-paper text-charcoal hover:border-brand-primary'
                }`}
              >
                All {activeCat.name}
              </button>
              {activeCat.subcategories.map((sub) => {
                const isSubActive = filters.subcategoryId === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => filters.setSubcategoryId(sub.id)}
                    aria-pressed={isSubActive}
                    className={`inline-flex min-h-8 items-center border px-3 text-xs transition-colors ${
                      isSubActive
                        ? 'border-brand-primary bg-brand-primary text-foreground font-medium'
                        : 'border-line bg-paper text-charcoal hover:border-brand-primary'
                    }`}
                  >
                    {sub.name}
                    <span className={`ml-1.5 ${isSubActive ? 'text-foreground' : 'text-fog'}`}>
                      {sub.productCount}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })()}

        <CatalogToolbar
          searchValue={filters.query}
          onSearch={filters.setQuery}
          searchPlaceholder="Search by name, material, specs or keyword…"
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
                onClick={clearAll}
                className="btn btn-outline px-4 py-2 text-xs"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />

        <section aria-label="Products" className="py-12">
          <CatalogGrid
            products={visible}
            emptyTitle={
              filters.query ? `No pieces match “${filters.query}”` : 'No pieces match these filters'
            }
            emptyBody="Try a different search term, or clear the filters to browse the full collection of handwoven furniture."
            onClear={clearAll}
          />
        </section>
      </div>
    </>
  )
}

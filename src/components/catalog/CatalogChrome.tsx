import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Product } from '@/types/product'
import type { PriceKey, SortKey } from '@/hooks/useCatalogFilters'
import ProductCard from '@/components/product/ProductCard'

/**
 * Shared catalogue chrome for /shop and /category/:slug:
 * breadcrumb, page heading, subcategory chips, toolbar (search, price
 * availability, sort) and the responsive product grid with a real
 * empty state. One visual system for both listing pages.
 */
export function Breadcrumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-5">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-fog">
        {trail.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
            )}
            {item.to && index < trail.length - 1 ? (
              <Link to={item.to} className="underline-offset-4 hover:text-ink hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-charcoal">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Subcategory chips — square, hairline, active state uses the brand gold. */
export function SubcategoryChips({
  basePath,
  options,
  activeId,
  onClear,
  clearLabel,
}: {
  basePath: string
  options: { id: string; label: string; productCount: number }[]
  activeId: string | null
  onClear: () => void
  clearLabel: string
}) {
  const chip =
    'inline-flex min-h-11 items-center gap-2 border px-4 text-sm transition-colors'
  const idle = 'border-line-strong bg-paper text-charcoal hover:border-brand-primary hover:text-ink'
  const active = 'border-brand-primary bg-brand-primary text-foreground'

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by subcategory">
      <Link
        to={basePath}
        onClick={activeId === null ? undefined : onClear}
        aria-current={activeId === null ? 'true' : undefined}
        className={`${chip} ${activeId === null ? active : idle}`}
      >
        {clearLabel}
      </Link>
      {options.map((option) => {
        const isActive = activeId === option.id
        return (
          <Link
            key={option.id}
            to={`${basePath}?subcategory=${option.id}`}
            aria-current={isActive ? 'true' : undefined}
            className={`${chip} ${isActive ? active : idle}`}
          >
            {option.label}
            <span className={`text-xs ${isActive ? 'text-foreground' : 'text-fog'}`}>
              {option.productCount}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

/** Toolbar row: search field, price availability, usage, material, sort. */
export function CatalogToolbar({
  searchValue,
  onSearch,
  searchPlaceholder,
  price,
  onPrice,
  usage,
  onUsage,
  material,
  onMaterial,
  sort,
  onSort,
  action,
}: {
  searchValue: string
  onSearch: (value: string) => void
  searchPlaceholder: string
  price: PriceKey
  onPrice: (value: PriceKey) => void
  usage?: string | null
  onUsage?: (value: string | null) => void
  material?: string | null
  onMaterial?: (value: string | null) => void
  sort: SortKey
  onSort: (value: SortKey) => void
  action?: ReactNode
}) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(new FormData(event.currentTarget).get('q')?.toString() ?? '')
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-line bg-paper py-3">
      <form role="search" onSubmit={submit} className="min-w-0 flex-1 basis-56">
        <label htmlFor="catalog-search" className="sr-only">
          Search furniture
        </label>
        <input
          id="catalog-search"
          name="q"
          type="search"
          defaultValue={searchValue}
          placeholder={searchPlaceholder}
          className="field"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {/* Usage classification filter */}
        {onUsage && (
          <>
            <label htmlFor="catalog-usage" className="sr-only">
              Usage classification
            </label>
            <select
              id="catalog-usage"
              value={usage || ''}
              onChange={(e) => onUsage(e.target.value || null)}
              className="field w-auto cursor-pointer pr-8 text-xs"
            >
              <option value="">All environments</option>
              <option value="outdoor">Outdoor / Covered</option>
              <option value="indoor">Indoor</option>
            </select>
          </>
        )}

        {/* Material filter */}
        {onMaterial && (
          <>
            <label htmlFor="catalog-material" className="sr-only">
              Material filter
            </label>
            <select
              id="catalog-material"
              value={material || ''}
              onChange={(e) => onMaterial(e.target.value || null)}
              className="field w-auto cursor-pointer pr-8 text-xs"
            >
              <option value="">All materials</option>
              <option value="wood">Wood</option>
              <option value="rope">Rope</option>
              <option value="metal">Metal</option>
              <option value="jute">Jute</option>
              <option value="paper cord">Paper Cord</option>
            </select>
          </>
        )}

        <label htmlFor="catalog-price" className="sr-only">
          Price availability
        </label>
        <select
          id="catalog-price"
          value={price}
          onChange={(event) => onPrice(event.target.value as PriceKey)}
          className="field w-auto cursor-pointer pr-8 text-xs"
        >
          <option value="all">All prices</option>
          <option value="priced">Priced</option>
          <option value="request">Price on Request</option>
        </select>

        <label htmlFor="catalog-sort" className="sr-only">
          Sort products
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortKey)}
          className="field w-auto cursor-pointer pr-8 text-xs"
        >
          <option value="featured">Featured</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="price-asc">Price low–high</option>
          <option value="price-desc">Price high–low</option>
        </select>
        {action}
      </div>
    </div>
  )
}

/** Product grid with honest count and empty state. */
export function CatalogGrid({
  products,
  emptyTitle,
  emptyBody,
  onClear,
}: {
  products: Product[]
  emptyTitle: string
  emptyBody: string
  onClear: () => void
}) {
  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {products.length} {products.length === 1 ? 'piece' : 'pieces'} shown
      </p>
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-h3">{emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal">{emptyBody}</p>
          <button type="button" onClick={onClear} className="btn btn-outline mt-8">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} squareImage />
          ))}
        </div>
      )}
    </>
  )
}

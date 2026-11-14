import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import ProductCard from '@/components/product/ProductCard'

/**
 * Shared catalogue chrome for /shop and /category/:slug:
 * breadcrumb, subcategory chips and the responsive product grid with a real
 * empty state. The filter toolbar itself lives in
 * `@/components/product/ProductFilters` so both listing pages share one
 * implementation.
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

import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import type { PriceKey, SortKey } from '@/hooks/useCatalogFilters'
import type { FacetOption } from '@/lib/catalogFacets'

/**
 * Product filter bar — the single, shared filter instrument for every
 * listing page (/shop and /category/:slug). One hairline toolbar that sits
 * directly on the ivory page: a search field plus environment, material,
 * price and sort controls, with active filters resurfacing as removable
 * chips beneath and a live “Showing N of M” count.
 *
 * Layout is driven entirely by `.filter-*` in `index.css`:
 *  - desktop (≥1024): the five controls sit on one row (search ≈37%);
 *  - tablet (768–1023): search full-width, then the four facets in a 2×2;
 *  - phone (<768): full-width search, a Filters button and the sort control,
 *    with the facets moved into an accessible native-<dialog> sheet.
 *
 * All filter state is owned by `useCatalogFilters` (URL-driven). This
 * component is presentational and calls the setters it is given — it never
 * duplicates filter state. The only local state is the search field's draft
 * text, which keeps the clear affordance in sync while the user types, and
 * the sheet's open flag.
 */

const PRICE_OPTIONS = [
  { value: 'all', label: 'All prices' },
  { value: 'priced', label: 'Priced' },
  { value: 'request', label: 'Price on Request' },
] as const

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price low–high' },
  { value: 'price-desc', label: 'Price high–low' },
] as const

export interface ProductFiltersProps {
  searchValue: string
  onSearch: (value: string) => void
  searchPlaceholder: string
  price: PriceKey
  onPrice: (value: PriceKey) => void
  usage: string | null
  onUsage: (value: string | null) => void
  material: string | null
  onMaterial: (value: string | null) => void
  sort: SortKey
  onSort: (value: SortKey) => void
  /** Environment options derived from the product data in scope. */
  environments: FacetOption[]
  /** Material options derived from the product data in scope. */
  materials: FacetOption[]
  /** Number of products currently shown. */
  visibleCount: number
  /** Number of products in scope before filtering. */
  totalCount: number
  /** Resets every filter (search, environment, material, price and sort). */
  onClear: () => void
  /** Noun for the result count — defaults to “products”. */
  resultNoun?: string
}

export function ProductFilters({
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
  environments,
  materials,
  visibleCount,
  totalCount,
  onClear,
  resultNoun = 'products',
}: ProductFiltersProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const usageOptions = [
    { value: '', label: 'All environments' },
    ...environments.map((o) => ({ value: o.value, label: o.label, count: o.count })),
  ]
  const materialOptions = [
    { value: '', label: 'All materials' },
    ...materials.map((o) => ({ value: o.value, label: o.label, count: o.count })),
  ]

  const chips: { key: string; label: string; onRemove: () => void }[] = []
  if (searchValue.trim()) {
    chips.push({ key: 'q', label: `“${searchValue.trim()}”`, onRemove: () => onSearch('') })
  }
  if (usage) {
    const option = environments.find((o) => o.value === usage)
    chips.push({ key: 'usage', label: option?.label ?? usage, onRemove: () => onUsage(null) })
  }
  if (material) {
    const option = materials.find((o) => o.value === material)
    chips.push({ key: 'material', label: option?.label ?? material, onRemove: () => onMaterial(null) })
  }
  if (price !== 'all') {
    chips.push({
      key: 'price',
      label: price === 'priced' ? 'Priced' : 'Price on Request',
      onRemove: () => onPrice('all'),
    })
  }

  const showClear = chips.length > 0 || sort !== 'featured'
  const sheetActiveCount = (usage ? 1 : 0) + (material ? 1 : 0) + (price !== 'all' ? 1 : 0)

  const resetSheet = () => {
    onUsage(null)
    onMaterial(null)
    onPrice('all')
  }

  return (
    <section aria-label="Filter products" className="filter-bar">
      <div className="filter-bar__grid">
        <div className="filter-bar__search">
          <SearchField value={searchValue} onSearch={onSearch} placeholder={searchPlaceholder} />
        </div>

        {/* Phone: opens the facet sheet */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="filter-bar__filters filter-mobile-filters"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
        >
          <SlidersHorizontal className="filter-mobile-filters__icon" aria-hidden="true" />
          Filters
          {sheetActiveCount > 0 && (
            <span className="filter-mobile-filters__badge" aria-hidden="true">
              {sheetActiveCount}
            </span>
          )}
        </button>

        <div className="filter-bar__env">
          <FilterSelect
            id="catalog-usage"
            label="Environment"
            value={usage ?? ''}
            defaultValue=""
            options={usageOptions}
            onChange={(value) => onUsage(value || null)}
          />
        </div>

        <div className="filter-bar__material">
          <FilterSelect
            id="catalog-material"
            label="Material"
            value={material ?? ''}
            defaultValue=""
            options={materialOptions}
            onChange={(value) => onMaterial(value || null)}
          />
        </div>

        <div className="filter-bar__price">
          <FilterSelect
            id="catalog-price"
            label="Price availability"
            value={price}
            defaultValue="all"
            options={PRICE_OPTIONS}
            onChange={(value) => onPrice(value as PriceKey)}
          />
        </div>

        <div className="filter-bar__sort">
          <FilterSelect
            id="catalog-sort"
            label="Sort products"
            value={sort}
            defaultValue="featured"
            options={SORT_OPTIONS}
            onChange={(value) => onSort(value as SortKey)}
          />
        </div>
      </div>

      {/* Second row — active chips, clear, live count */}
      <div className="filter-bar__meta">
        <div className="filter-bar__chips">
          {chips.map((chip) => (
            <span key={chip.key} className="filter-chip">
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                className="filter-chip__remove"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="filter-chip__remove-icon" aria-hidden="true" />
              </button>
            </span>
          ))}
          {showClear && (
            <button type="button" onClick={onClear} className="filter-clear">
              Clear filters
            </button>
          )}
        </div>

        <p className="filter-count">
          Showing <span className="filter-count__num">{visibleCount}</span> of {totalCount} {resultNoun}
        </p>
      </div>

      <MobileFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        environments={environments}
        materials={materials}
        usage={usage}
        onUsage={onUsage}
        material={material}
        onMaterial={onMaterial}
        price={price}
        onPrice={onPrice}
        onReset={resetSheet}
        activeCount={sheetActiveCount}
        resultCount={visibleCount}
        resultNoun={resultNoun}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

function SearchField({
  value,
  onSearch,
  placeholder,
}: {
  value: string
  onSearch: (value: string) => void
  placeholder: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(value)

  // Keep the draft in sync when the filter changes elsewhere (chip removal,
  // Clear filters, back/forward). "Adjust state during render" — the pattern
  // React documents for state derived from a prop — avoids an extra commit
  // and the cascading-render warning that an effect would raise.
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setDraft(value)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(draft.trim())
  }

  const clear = () => {
    setDraft('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form role="search" onSubmit={submit} className="filter-search">
      <label htmlFor="catalog-search" className="sr-only">
        Search furniture, materials or keywords
      </label>
      <Search className="filter-search__icon" aria-hidden="true" />
      <input
        ref={inputRef}
        id="catalog-search"
        name="q"
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="filter-search__input"
      />
      {draft.length > 0 && (
        <button type="button" onClick={clear} className="filter-search__clear" aria-label="Clear search">
          <X className="filter-search__clear-icon" aria-hidden="true" />
        </button>
      )}
    </form>
  )
}

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

function FilterSelect({
  id,
  label,
  value,
  defaultValue,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  defaultValue: string
  options: readonly { value: string; label: string; count?: number }[]
  onChange: (value: string) => void
}) {
  const active = value !== defaultValue
  return (
    <div className="filter-select">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`filter-select__control${active ? ' is-active' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
      <ChevronDown className="filter-select__chevron" aria-hidden="true" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile facet sheet                                                  */
/* ------------------------------------------------------------------ */

function MobileFilterSheet({
  open,
  onClose,
  environments,
  materials,
  usage,
  onUsage,
  material,
  onMaterial,
  price,
  onPrice,
  onReset,
  activeCount,
  resultCount,
  resultNoun,
}: {
  open: boolean
  onClose: () => void
  environments: FacetOption[]
  materials: FacetOption[]
  usage: string | null
  onUsage: (value: string | null) => void
  material: string | null
  onMaterial: (value: string | null) => void
  price: PriceKey
  onPrice: (value: PriceKey) => void
  onReset: () => void
  activeCount: number
  resultCount: number
  resultNoun: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const idPrefix = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
      document.documentElement.style.overflow = ''
    }
    return () => {
      if (dialog.open) dialog.close()
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label="Filter products"
      className="drawer-right fixed inset-y-0 right-0 m-0 h-dvh max-h-dvh w-[22rem] max-w-[90vw] overflow-hidden bg-chalk p-0"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-title">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center text-charcoal hover:text-ink"
            aria-label="Close filters"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          <FacetGroup
            legend="Environment"
            name={`${idPrefix}-usage`}
            value={usage ?? ''}
            options={[
              { value: '', label: 'All environments' },
              ...environments.map((o) => ({ value: o.value, label: o.label, count: o.count })),
            ]}
            onChange={(value) => onUsage(value || null)}
          />
          <FacetGroup
            legend="Material"
            name={`${idPrefix}-material`}
            value={material ?? ''}
            options={[
              { value: '', label: 'All materials' },
              ...materials.map((o) => ({ value: o.value, label: o.label, count: o.count })),
            ]}
            onChange={(value) => onMaterial(value || null)}
          />
          <FacetGroup
            legend="Price availability"
            name={`${idPrefix}-price`}
            value={price}
            options={PRICE_OPTIONS}
            onChange={(value) => onPrice(value as PriceKey)}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className="btn btn-outline flex-1 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
          <button type="button" onClick={onClose} className="btn btn-primary flex-1 py-3 text-xs">
            Show {resultCount} {resultNoun}
          </button>
        </div>
      </div>
    </dialog>
  )
}

function FacetGroup({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string
  name: string
  value: string
  options: readonly { value: string; label: string; count?: number }[]
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__legend">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="filter-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span className="filter-option__mark" aria-hidden="true" />
          <span className="filter-option__label">{option.label}</span>
          {typeof option.count === 'number' && (
            <span className="filter-option__count">{option.count}</span>
          )}
        </label>
      ))}
    </fieldset>
  )
}

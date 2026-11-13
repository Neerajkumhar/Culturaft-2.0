import { Link } from 'react-router-dom'
import type { MainCategory } from '@/data/categoryNavigation'
import { categoryCover } from '@/data/categoryNavigation'

/**
 * Mega menu panel — full-width band under the header.
 *
 * Column 1: category title, blurb, View All link.
 * Column 2: verified subcategories (+ real product shortlist).
 * Column 3: actual product photograph from the category + collection link.
 *
 * Opened by hover or keyboard focus on the category link; closed on Escape,
 * outside click, or focus leaving trigger + panel.
 */
export function MegaMenuPanel({ category }: { category: MainCategory }) {
  const cover = categoryCover(category.slug)
  const highlights = category.subcategories.slice(0, 1)

  return (
    <div
      id="mega-panel"
      className="border-b border-line bg-paper"
      data-testid={`mega-${category.slug}`}
    >
      <div className="wrap grid gap-x-10 gap-y-6 py-8 md:grid-cols-[1fr_1fr_260px] lg:grid-cols-[1fr_1fr_320px]">
        {/* Column 1 — category overview */}
        <div>
          <p className="eyebrow text-fog">Collection</p>
          <h2 className="mt-1 text-h3">{category.name}</h2>
          <p className="mt-2 max-w-sm text-sm text-charcoal">{category.blurb}</p>
          <Link
            to={`/category/${category.slug}`}
            className="btn btn-primary mt-5"
            onClick={() => undefined}
          >
            View All {category.name}
            <span aria-hidden="true" className="text-base leading-none">
              →
            </span>
          </Link>
          <p className="mt-4 text-xs text-fog">
            {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}{' '}
            in this collection
          </p>
        </div>

        {/* Column 2 — verified subcategories */}
        <div>
          <p className="eyebrow text-fog">Shop by type</p>
          <ul className="mt-3 grid gap-1">
            {category.subcategories.map((sub) => (
              <li key={sub.id}>
                <Link
                  to={`/category/${category.slug}?subcategory=${sub.id}`}
                  className="group flex items-baseline justify-between gap-4 px-2 py-2.5 text-sm transition-colors hover:bg-brand-soft focus-visible:bg-brand-soft"
                >
                  <span>
                    <span className="font-display font-semibold text-ink group-hover:underline group-hover:underline-offset-4">
                      {sub.label}
                    </span>
                    <span className="ml-2 text-xs text-fog">{sub.blurb}</span>
                  </span>
                  <span className="shrink-0 text-xs text-fog">{sub.productCount}</span>
                </Link>
              </li>
            ))}
            {category.subcategories.length === 0 && (
              <li className="px-2 py-2 text-sm text-fog">
                All {category.name.toLowerCase()} are listed in the collection.
              </li>
            )}
          </ul>
          {highlights.length > 0 && (
            <p className="mt-4 border-t border-line pt-3 text-xs text-fog">
              Pieces without a type grouping remain under{' '}
              <Link
                to={`/category/${category.slug}`}
                className="underline underline-offset-2 hover:text-ink"
              >
                View All {category.name}
              </Link>
              .
            </p>
          )}
        </div>

        {/* Column 3 — real product photograph */}
        <div className="hidden md:block">
          {cover && (
            <Link
              to={`/category/${category.slug}`}
              className="group block"
              aria-label={`Shop ${category.name} — view the collection`}
            >
              <div className="aspect-[4/5] overflow-hidden bg-sand">
                <img
                  src={cover}
                  alt={`${category.name} — featured handwoven furniture by Culturaft`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 font-display text-sm font-semibold text-ink group-hover:underline group-hover:underline-offset-4">
                Shop {category.name}
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

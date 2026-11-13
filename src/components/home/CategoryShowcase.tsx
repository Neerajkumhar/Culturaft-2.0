import { Link } from 'react-router-dom'
import { MAIN_CATEGORIES, categoryCover } from '@/data/categoryNavigation'

/**
 * Shop-by-collection — all six main categories as photographic tiles.
 * Real cover photographs and real counts from categoryNavigation;
 * tiles link to /category/:slug. The grid alternates column spans for
 * an architectural rhythm instead of a uniform card row.
 */
const SPANS = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-7',
  'lg:col-span-5',
]
const ASPECTS = [
  'aspect-[16/11]',
  'aspect-[16/11] lg:aspect-[16/15]',
  'aspect-[16/11] lg:aspect-[16/15]',
  'aspect-[16/11]',
  'aspect-[16/11]',
  'aspect-[16/11] lg:aspect-[16/15]',
]

export function CategoryShowcase() {
  return (
    <section aria-labelledby="collections-heading" className="border-t border-line bg-chalk">
      <div className="wrap py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-fog">Shop by collection</p>
            <h2 id="collections-heading" className="mt-4 text-h2 lg:text-h2-lg">
              Six collections, one material language
            </h2>
          </div>
          <Link to="/shop" className="link-quiet text-sm">
            View all furniture →
          </Link>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          {MAIN_CATEGORIES.map((category, index) => {
            const cover = categoryCover(category.id)
            return (
              <article key={category.id} className={`${SPANS[index]} group`}>
                <Link
                  to={`/category/${category.slug}`}
                  className="block overflow-hidden bg-sand"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`${ASPECTS[index]} w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]`}
                    />
                  ) : (
                    <div className={ASPECTS[index]} aria-hidden="true" />
                  )}
                </Link>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-title">
                    <Link
                      to={`/category/${category.slug}`}
                      className="font-display font-bold text-ink underline-offset-4 hover:underline"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="shrink-0 text-xs text-fog">
                    {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>
                <p className="mt-1 text-sm text-charcoal">{category.blurb}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'

/**
 * Collection spotlight — full-bleed photographic banner with a charcoal
 * scrim and a single quiet CTA. The photograph is a real catalogue
 * image; no gradients or invented claims.
 */
export function CollectionSpotlight() {
  const products = useProducts()
  const spotlight =
    products.find((p) => p.id === 'culturaft-orion-coffee-table') ??
    products.find((p) => p.images.length > 0)
  const spotlightImage = spotlight?.images[0]

  return (
    <section aria-labelledby="spotlight-heading" className="relative overflow-hidden bg-ink">
      {spotlightImage && (
        <img
          src={spotlightImage}
          alt={spotlight?.name ? `${spotlight.name} in a styled interior` : 'Woven table in a styled interior'}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover opacity-90"
        />
      )}
      <div
        aria-hidden="true"
        className="collection-image-scrim absolute inset-0"
      />

      <div className="wrap relative py-20 lg:py-28">
        <div className="max-w-xl">
          <p className="eyebrow text-chalk/70">Tables collection</p>
          <h2 id="spotlight-heading" className="mt-4 text-h2 text-chalk lg:text-h2-lg">
            Woven tops, quiet centres
          </h2>
          <p className="mt-4 text-lead text-chalk/85">
            Coffee, end and accent tables that pair rope weave with solid wood —
            sized for real living rooms.
          </p>
          <div className="mt-8">
            <Link to="/category/tables" className="btn btn-onlight">
              Explore tables
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

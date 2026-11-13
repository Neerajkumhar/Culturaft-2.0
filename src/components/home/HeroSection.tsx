import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'

/**
 * Homepage hero — one full-bleed product photograph with an ink
 * gradient for text legibility, headline bottom-left, two CTAs.
 * The image is a real catalogue photograph (verified product id).
 */
export function HeroSection() {
  const products = useProducts()
  const hero =
    products.find((p) => p.id === 'grey-woven-rope-lounge-chair') ??
    products.find((p) => p.images.length > 0)
  const heroImage = hero?.images[0]

  return (
    <section aria-label="CULTURAFT — handwoven rope furniture" className="relative">
      <div className="relative min-h-[72svh] overflow-hidden bg-sand lg:min-h-[86svh]">
        {heroImage && (
          <img
            src={heroImage}
            alt={hero?.name ? `${hero.name} — woven rope lounge chair` : 'Woven rope lounge chair'}
            className="absolute inset-0 size-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        )}
        {/* Legibility scrim — solid ink fade, no colour gradient */}
        <div
          aria-hidden="true"
          className="hero-image-scrim absolute inset-0"
        />

        <div className="wrap relative flex min-h-[72svh] flex-col justify-end pb-14 pt-24 text-chalk lg:min-h-[86svh] lg:pb-20">
          <p className="eyebrow text-chalk/70">Handwoven rope furniture</p>
          <h1 className="mt-4 max-w-3xl text-hero font-extrabold tracking-tight text-chalk lg:text-hero-lg">
            Furniture woven by hand, made for the everyday.
          </h1>
          <p className="mt-5 max-w-xl text-lead text-chalk/85">
            Benches, chairs, sofas and tables in jute, paper cord and rope —
            crafted in natural materials and finished with quiet, architectural lines.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-accent">
              Shop the collection
            </Link>
            <Link to="/about" className="btn btn-outline-light">
              Our craft
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'

/**
 * Brand introduction — quiet editorial statement with three factual
 * figures drawn from the catalogue itself (piece count, collection
 * count, materials). Nothing invented.
 */
export function BrandIntroduction() {
  const products = useProducts()
  const priced = products.filter((p) => p.price !== null)

  const figures = [
    { value: String(products.length), label: 'Handwoven pieces' },
    { value: '6', label: 'Collections' },
    { value: '3', label: 'Natural weave materials' },
  ]

  return (
    <section aria-labelledby="brand-intro-heading" className="bg-chalk">
      <div className="wrap grid gap-x-16 gap-y-10 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-24">
        <div>
          <p className="eyebrow text-fog">The collection</p>
          <h2
            id="brand-intro-heading"
            className="mt-4 max-w-2xl text-h2 lg:text-h2-lg"
          >
            Traditional weaving, contemporary lines — furniture that earns its place.
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-charcoal">
            CULTURAFT works in rope, jute and paper cord, woven over solid wood
            frames. Each piece in this collection is made to be used daily —
            seating that gives gently under hand and back, tables with woven
            tops and honest proportions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-primary">
              Browse all furniture
            </Link>
            <Link to="/about" className="btn btn-outline">
              About CULTURAFT
            </Link>
          </div>
          <p className="mt-4 text-xs text-fog">
            {priced.length} pieces priced in INR · the remaining{' '}
            {products.length - priced.length} available on request
          </p>
        </div>

        <dl className="grid content-end gap-px bg-line sm:grid-cols-3 lg:grid-cols-1">
          {figures.map((figure) => (
            <div key={figure.label} className="flex flex-col bg-chalk p-5 lg:pl-0">
              <dt className="order-2 mt-1 text-xs text-charcoal">{figure.label}</dt>
              <dd className="order-1 font-display text-h2 font-extrabold tracking-tight text-ink">
                {figure.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * About page — verified brand facts only: handwoven rope/jute/paper-cord
 * furniture over wooden frames, enquired via WhatsApp. No invented
 * history, addresses, certifications or team claims.
 */
export default function AboutPage() {
  const products = useProducts()
  const materials = new Set<string>()
  for (const product of products) {
    product.materials?.forEach((m) => materials.add(m))
  }

  return (
    <div className="wrap">
      <header className="border-t border-line py-12 lg:py-16">
        <p className="eyebrow text-fog">About CULTURAFT</p>
        <h1 className="mt-3 max-w-3xl text-h1 lg:text-hero">
          Handwoven furniture, made to be lived in
        </h1>
      </header>

      <div className="grid gap-x-16 gap-y-12 pb-16 lg:grid-cols-[1.4fr_1fr] lg:pb-24">
        <div className="max-w-2xl">
          <p className="text-lead text-charcoal">
            CULTURAFT is a furniture brand built around the weave. Each piece in
            the collection — benches, dining chairs, lounges, sofas, stools and
            tables — pairs a handwoven seat or surface with a solid wooden frame.
          </p>
          <p className="mt-6 text-base text-charcoal">
            The collection works in natural materials: rope, jute and paper cord,
            woven by hand so the pattern of every seat and back carries the
            rhythm of its making. Pieces are photographed exactly as they are,
            described only with verified details, and priced where a price
            exists — everything else is available on request.
          </p>
          <p className="mt-6 text-base text-charcoal">
            There is no checkout on this site. Instead, every product page opens
            a direct WhatsApp enquiry, so questions about a piece, its materials
            or ordering are answered by a person.
          </p>
        </div>

        <aside>
          <div className="border border-line bg-paper p-6">
            <h2 className="eyebrow text-fog">Materials in the collection</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[...materials].map((material) => (
                <li
                  key={material}
                  className="border border-line px-3 py-1.5 text-xs text-charcoal"
                >
                  {material}
                </li>
              ))}
            </ul>
            <div className="rule my-6" />
            <h2 className="eyebrow text-fog">By the numbers</h2>
            <dl className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <dd className="font-display text-h3 font-extrabold text-ink">{products.length}</dd>
                <dt className="mt-1 text-xs text-charcoal">Pieces</dt>
              </div>
              <div>
                <dd className="font-display text-h3 font-extrabold text-ink">6</dd>
                <dt className="mt-1 text-xs text-charcoal">Collections</dt>
              </div>
              <div>
                <dd className="font-display text-h3 font-extrabold text-ink">0</dd>
                <dt className="mt-1 text-xs text-charcoal">Checkout steps</dt>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <section aria-labelledby="explore-heading" className="border-t border-line pb-20">
        <h2 id="explore-heading" className="pt-10 text-h2">
          Explore the collections
        </h2>
        <nav aria-label="Collections" className="mt-6 flex flex-wrap gap-2">
          {MAIN_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="inline-flex min-h-11 items-center gap-2 border border-line-strong bg-paper px-4 text-sm text-charcoal transition-colors hover:border-brand-primary hover:text-ink"
            >
              {category.name}
              <span className="text-xs text-fog">{category.productCount}</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  )
}

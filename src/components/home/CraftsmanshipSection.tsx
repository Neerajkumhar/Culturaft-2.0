import { Link } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'

/**
 * Craftsmanship section — split editorial on the sand field: real
 * close-up photography of the weaves on the left, verified material
 * story on the right. Copy describes only what the products document
 * (handwoven rope, jute, paper cord over wooden frames).
 */
export function CraftsmanshipSection() {
  const products = useProducts()
  const detail =
    products.find((p) => p.id === 'brenna-hand-woven-paper-cord-bench') ??
    products.find((p) => p.images.length > 1)
  const detailImage = detail?.images[1] ?? detail?.images[0]
  const second =
    products.find((p) => p.id === 'aaranya-handwoven-rope-bench') ??
    products.find((p) => p.id !== detail?.id && p.images.length > 0)
  const secondImage = second?.images[0]

  const materials = [
    {
      name: 'Handwoven rope',
      note: 'Woven seatwork in coloured and natural rope, patterned and knotted by hand.',
    },
    {
      name: 'Jute & paper cord',
      note: 'Fibre weaves with a matte, tactile finish over solid frames.',
    },
    {
      name: 'Wood frames',
      note: 'Acacia and other solid woods shaped to carry the weave.',
    },
  ]

  return (
    <section aria-labelledby="craft-heading" className="bg-sand">
      <div className="wrap grid items-center gap-x-14 gap-y-10 py-16 lg:grid-cols-2 lg:py-24">
        {/* Photography — two offset frames */}
        <div className="grid grid-cols-5 gap-4">
          {detailImage && (
            <img
              src={detailImage}
              alt={detail?.name ? `Weave detail — ${detail.name}` : 'Weave detail'}
              loading="lazy"
              decoding="async"
              className="col-span-3 aspect-[4/5] w-full object-cover"
            />
          )}
          {secondImage && (
            <img
              src={secondImage}
              alt={second?.name ? `${second.name} — full view` : 'Handwoven furniture'}
              loading="lazy"
              decoding="async"
              className="col-span-2 mt-10 aspect-[4/5] w-full object-cover"
            />
          )}
        </div>

        <div>
          <p className="eyebrow text-fog">The craft</p>
          <h2 id="craft-heading" className="mt-4 text-h2 lg:text-h2-lg">
            Woven by hand, over solid wood
          </h2>
          <p className="mt-5 max-w-xl text-lead text-charcoal">
            Every piece in the collection is built around a weave — rope, jute or
            paper cord worked over a wooden frame. The pattern of each seat and
            back is made by hand, so no two pieces sit exactly alike.
          </p>

          <dl className="mt-9 divide-y divide-line-strong border-y border-line-strong">
            {materials.map((material) => (
              <div key={material.name} className="grid gap-1 py-5 sm:grid-cols-[13rem_1fr]">
                <dt className="font-display text-sm font-bold text-ink">{material.name}</dt>
                <dd className="text-sm text-charcoal">{material.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/category/benches?subcategory=handwoven-benches" className="btn btn-primary">
              See handwoven benches
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Browse everything
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import ProductCard from './ProductCard'
import type { Product } from '@/types/product'

/**
 * Related products — real products from the same category, excluding
 * the current one, shown as a compact grid under the detail page.
 */
export function RelatedProducts({ heading, products }: { heading: string; products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <div className="rule mb-8" />
      <div className="flex items-end justify-between gap-6">
        <h2 id="related-heading" className="text-h2">
          {heading}
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

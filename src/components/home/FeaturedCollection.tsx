import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import { useProducts } from '@/hooks/useProducts'
import { MAIN_CATEGORIES, getCategoryProducts } from '@/data/categoryNavigation'
import ProductCard from '@/components/product/ProductCard'

/**
 * Selected pieces — eight real products, one representative per
 * collection first, then catalogue order to fill. Verified prices and
 * "Price on Request" are handled by ProductCard itself.
 */
export function FeaturedCollection() {
  const products = useProducts()

  const featured: Product[] = []
  for (const category of MAIN_CATEGORIES) {
    const first = getCategoryProducts(category.id)[0]
    if (first) featured.push(first)
  }
  for (const product of products) {
    if (featured.length >= 8) break
    if (!featured.some((f) => f.id === product.id) && product.images.length > 0) {
      featured.push(product)
    }
  }

  return (
    <section aria-labelledby="featured-heading" className="border-t border-line bg-sand">
      <div className="wrap py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow text-fog">Selected pieces</p>
            <h2 id="featured-heading" className="mt-4 text-h2 lg:text-h2-lg">
              A cross-section of the workshop
            </h2>
          </div>
          <Link to="/shop" className="btn btn-outline">
            Shop all furniture
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {featured.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  )
}

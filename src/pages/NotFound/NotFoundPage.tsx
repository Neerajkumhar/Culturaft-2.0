import { Link } from 'react-router-dom'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'

/**
 * 404 page for unknown routes — a clear dead-end escape hatch with
 * links back into the six verified collections and the shop.
 */
export default function NotFoundPage() {
  return (
    <div className="wrap py-20 text-center lg:py-28">
      <p className="eyebrow text-fog">Error 404</p>
      <h1 className="mt-3 text-h1">Page Not Found</h1>
      <p className="mx-auto mt-4 max-w-md text-lead text-charcoal">
        The page you are looking for doesn't exist or may have moved.
        Explore the collections instead.
      </p>
      <div className="mt-10">
        <Link to="/shop" className="btn btn-primary">
          Browse All Furniture
        </Link>
      </div>
      <nav aria-label="Available collections" className="mt-6 flex flex-wrap justify-center gap-2">
        {MAIN_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className="inline-flex min-h-11 items-center border border-line-strong bg-paper px-4 text-sm text-charcoal transition-colors hover:border-ink hover:text-ink"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

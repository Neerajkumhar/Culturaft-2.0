import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import { formatPrice, isPriceOnRequest } from '@/lib/price'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'
import { useWhatsAppUrl } from '@/hooks/useWhatsAppUrl'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'

/**
 * Product card — photography-first, square corners, no borders.
 * Shows verified category/subcategory, real price or "Price on Request",
 * short description snippet, and direct WhatsApp enquiry.
 *
 * `squareImage` is opt-in: the shop / category / subcategory listings use a
 * 1:1 photograph so the grid reads evenly, while editorial surfaces (home
 * featured collection, related products) keep the taller 4:5 crop.
 */
export default function ProductCard({
  product,
  showEnquiry = true,
  priority = false,
  squareImage = false,
}: {
  product: Product
  showEnquiry?: boolean
  /** Set on above-the-fold cards to skip lazy loading. */
  priority?: boolean
  /** Use a 1:1 photograph crop (catalogue listing grids). */
  squareImage?: boolean
}) {
  const category = MAIN_CATEGORIES.find((c) => c.productCategory === product.category)
  const categoryLabel = category?.name ?? product.category
  const subcategoryLabel = product.websiteCategory?.subcategory

  const whatsappUrl = useWhatsAppUrl({
    productName: product.name,
    productSlug: product.slug,
    category: product.category,
    productPrice: product.price,
    priceUnit: product.priceUnit,
  })

  const imageClass = squareImage ? 'aspect-square' : 'aspect-4/5'
  const imageWidth = squareImage ? 800 : 640
  const imageHeight = 800

  return (
    <article className="group relative flex flex-col">
      {/* Photography — reserved box; redundant link is not tabbable
          (the title link below is the keyboard path) */}
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden bg-sand"
        aria-label={`View details — ${product.name}`}
        tabIndex={-1}
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            width={imageWidth}
            height={imageHeight}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`${imageClass} w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]`}
          />
        ) : (
          <div className={`${imageClass} w-full bg-sand`} aria-hidden="true" />
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {/* Category & Subcategory */}
        <p className="eyebrow text-fog">
          {categoryLabel}
          {subcategoryLabel && subcategoryLabel !== categoryLabel && (
            <span className="text-fog/75"> · {subcategoryLabel}</span>
          )}
        </p>

        {/* Product Name */}
        <h3 className="mt-1 text-sm font-medium">
          <Link
            to={`/product/${product.slug}`}
            className="font-display font-semibold text-ink underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
        </h3>

        {/* Short description snippet where useful */}
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-charcoal/80">
            {product.shortDescription}
          </p>
        )}

        {/* Price & Unit */}
        <p className="mt-2 text-sm text-charcoal">
          {isPriceOnRequest(product.price) ? (
            <span className="text-fog font-medium">Price on Request</span>
          ) : (
            <span className="font-display font-semibold text-ink">
              {formatPrice(product.price, product.priceUnit)}
            </span>
          )}
        </p>

        {/* Action Links */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs border-t border-line/60">
          <Link
            to={`/product/${product.slug}`}
            className="font-display font-semibold text-brand-primary underline-offset-4 hover:text-ink hover:underline"
          >
            View Details →
          </Link>
          {showEnquiry && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire on WhatsApp about ${product.name}`}
              className="inline-flex items-center gap-1.5 text-charcoal underline-offset-4 hover:text-ink hover:underline"
            >
              <WhatsAppGlyph className="size-3.5 text-olive" />
              Enquire
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

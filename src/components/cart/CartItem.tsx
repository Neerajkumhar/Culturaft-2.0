import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import type { Product } from '@/types/product'
import { resolveLinePricing } from '@/lib/cartPricing'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'
import QuantitySelector from './QuantitySelector'

/**
 * One editorial cart row: photograph, verified category, price, quantity
 * control, calculable line subtotal and a remove action.
 */
export default function CartItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: {
  product: Product
  quantity: number
  onQuantityChange: (next: number) => void
  onRemove: () => void
}) {
  const pricing = resolveLinePricing(product, quantity)
  const category = MAIN_CATEGORIES.find((c) => c.productCategory === product.category)
  const categoryLabel = category?.name ?? product.category
  const subcategory = product.websiteCategory?.subcategory ?? null

  return (
    <li className="cart-row">
      <Link
        to={`/product/${product.slug}`}
        className="cart-row__media"
        aria-label={`View details — ${product.name}`}
        tabIndex={-1}
      >
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            width={120}
            height={120}
            loading="lazy"
            decoding="async"
            className="aspect-square w-full object-cover"
          />
        ) : (
          <span className="block aspect-square w-full bg-sand" aria-hidden="true" />
        )}
      </Link>

      <div className="cart-row__body">
        <p className="eyebrow text-fog">
          {categoryLabel}
          {subcategory && subcategory !== categoryLabel && (
            <span className="text-fog/75"> · {subcategory}</span>
          )}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold text-ink">
          <Link to={`/product/${product.slug}`} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-charcoal">{pricing.unitPriceText}</p>

        <div className="cart-row__controls">
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            label={`Quantity for ${product.name}`}
            size="sm"
          />
          <button
            type="button"
            onClick={onRemove}
            className="cart-row__remove"
            aria-label={`Remove ${product.name} from cart`}
          >
            <X className="size-4" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>

      <p className="cart-row__subtotal">
        <span className="eyebrow text-fog">Line Subtotal</span>
        <span className={pricing.calculable ? 'text-ink' : 'text-fog'}>
          {pricing.lineSubtotalText}
        </span>
      </p>
    </li>
  )
}

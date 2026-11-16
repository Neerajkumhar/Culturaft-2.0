import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

/**
 * Header cart link. The badge shows total units (the sum of quantities, not
 * the number of products) and the accessible name carries the same count.
 */
export default function CartIcon() {
  const { totalUnits } = useCart()
  const label =
    totalUnits === 0
      ? 'Shopping cart, empty'
      : `Shopping cart, ${totalUnits} item${totalUnits === 1 ? '' : 's'}`

  return (
    <Link
      to="/cart"
      aria-label={label}
      className="relative flex min-h-11 min-w-11 items-center justify-center px-2 text-charcoal transition-colors hover:text-ink"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {totalUnits > 0 && (
        <span className="cart-badge" aria-hidden="true">
          {totalUnits}
        </span>
      )}
    </Link>
  )
}

import type { MouseEvent } from 'react'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/product'
import { useCart } from '@/hooks/useCart'

/**
 * Add a product to the shared cart. Stops the click from bubbling so a card
 * wrapper can never navigate when the customer only meant to add the piece.
 */
export default function AddToCartButton({
  product,
  quantity = 1,
  size = 'md',
  className = '',
}: {
  product: Product
  quantity?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const { addItem } = useCart()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    addItem(product.id, quantity)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn btn-accent add-to-cart add-to-cart--${size} ${className}`}
      aria-label={`Add to Cart — ${product.name}`}
    >
      <ShoppingCart className="size-4" aria-hidden="true" />
      Add to Cart
    </button>
  )
}

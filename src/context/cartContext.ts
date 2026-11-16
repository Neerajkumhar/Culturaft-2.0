import { createContext } from 'react'
import type { CartLine } from '@/lib/cart'

/** Transient confirmation shown after a cart action. */
export type CartToastState = {
  message: string
  /** When present, the toast offers a "View cart" link. */
  productSlug?: string
}

export type CartContextValue = {
  lines: CartLine[]
  /** Sum of all quantities — the header badge number. */
  totalUnits: number
  /** Number of distinct products. */
  uniqueCount: number
  addItem: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
  toast: CartToastState | null
  dismissToast: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

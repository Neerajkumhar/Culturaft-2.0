import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { useProducts } from '@/hooks/useProducts'
import {
  cartReducer,
  cartTotalUnits,
  MAX_QUANTITY,
  type CartLine,
} from '@/lib/cart'
import { loadCart, saveCart, type StorageLike } from '@/lib/cartStorage'
import { CartContext, type CartToastState } from './cartContext'

/** How long a confirmation toast stays on screen. */
const TOAST_DURATION_MS = 3200

/** Access localStorage defensively — it can be unavailable (private mode, SSR). */
function getStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * Owns the one true cart. Mounted once around the app so the header, product
 * cards, product pages and /cart all read the same state.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const products = useProducts()
  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  )
  const storage = useMemo(getStorage, [])

  const [lines, dispatch] = useReducer(
    cartReducer,
    undefined,
    (): CartLine[] => loadCart(storage, (id) => productMap.has(id))
  )

  const [toast, setToast] = useState<CartToastState | null>(null)

  // Persist on every change; saveCart skips no-op writes and clears the key
  // when the cart empties.
  useEffect(() => {
    saveCart(storage, lines)
  }, [storage, lines])

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const product = productMap.get(productId)
      if (!product) return
      const existing = lines.find((line) => line.productId === productId)
      const wasClamped = (existing?.quantity ?? 0) + quantity > MAX_QUANTITY
      dispatch({ type: 'add', productId, quantity })
      setToast(
        wasClamped
          ? { message: `Maximum quantity is ${MAX_QUANTITY} per item.` }
          : { message: `Added to cart — ${product.name}`, productSlug: product.slug }
      )
    },
    [lines, productMap]
  )

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'setQuantity', productId, quantity })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'remove', productId })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const value = useMemo(
    () => ({
      lines,
      totalUnits: cartTotalUnits(lines),
      uniqueCount: lines.length,
      addItem,
      setQuantity,
      removeItem,
      clear,
      toast,
      dismissToast,
    }),
    [lines, addItem, setQuantity, removeItem, clear, toast, dismissToast]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

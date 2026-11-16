import { useContext } from 'react'
import { CartContext } from '@/context/cartContext'

/** Read and mutate the shared cart. Must be used inside a CartProvider. */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

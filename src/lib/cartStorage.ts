/**
 * localStorage persistence for the cart.
 *
 * Only `{ productId, quantity }` pairs are stored — never product details.
 * Every access is wrapped so a blocked or corrupted storage can never crash
 * the storefront: the worst case is an empty cart.
 */
import { clampQuantity, type CartLine } from './cart'

export const CART_STORAGE_KEY = 'culturaft_cart_v1'

/** The slice of the Web Storage API this module needs (injectable for tests). */
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/**
 * Read and validate the persisted cart.
 * Corrupt JSON, non-array payloads, malformed entries and unknown product ids
 * are dropped silently; out-of-range quantities are clamped.
 */
export function loadCart(
  storage: StorageLike | null | undefined,
  isValidProductId?: (productId: string) => boolean
): CartLine[] {
  if (!storage) return []

  let raw: string | null = null
  try {
    raw = storage.getItem(CART_STORAGE_KEY)
  } catch {
    return []
  }
  if (!raw) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const seen = new Set<string>()
  const lines: CartLine[] = []
  for (const entry of parsed) {
    if (!entry || typeof entry !== 'object') continue
    const { productId, quantity } = entry as { productId?: unknown; quantity?: unknown }
    if (typeof productId !== 'string' || productId.length === 0) continue
    if (typeof quantity !== 'number' || !Number.isFinite(quantity)) continue
    if (isValidProductId && !isValidProductId(productId)) continue
    if (seen.has(productId)) continue
    seen.add(productId)
    lines.push({ productId, quantity: clampQuantity(quantity) })
  }
  return lines
}

/**
 * Persist the cart, skipping the write when nothing changed and removing the
 * key entirely when the cart is empty. Never throws.
 */
export function saveCart(
  storage: StorageLike | null | undefined,
  lines: CartLine[]
): void {
  if (!storage) return

  let current: string | null = null
  try {
    current = storage.getItem(CART_STORAGE_KEY)
  } catch {
    return
  }

  if (lines.length === 0) {
    if (current === null) return
    try {
      storage.removeItem(CART_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    return
  }

  const next = JSON.stringify(
    lines.map((line) => ({ productId: line.productId, quantity: line.quantity }))
  )
  if (current === next) return
  try {
    storage.setItem(CART_STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
}

/**
 * Pure cart state — the single source of truth for what is in the basket.
 *
 * A cart line stores only the product id and a quantity; product details are
 * always resolved from products.json at render time, never persisted here.
 */

export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 99

export type CartLine = {
  productId: string
  quantity: number
}

export type CartAction =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; productId: string; quantity?: number }
  | { type: 'setQuantity'; productId: string; quantity: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

/** Coerce any value into a whole quantity inside [MIN_QUANTITY, MAX_QUANTITY]. */
export function clampQuantity(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return MIN_QUANTITY
  const whole = Math.floor(value)
  if (whole < MIN_QUANTITY) return MIN_QUANTITY
  if (whole > MAX_QUANTITY) return MAX_QUANTITY
  return whole
}

/** Add a product, or increase its existing quantity. Never duplicates a row. */
export function addToCart(
  lines: CartLine[],
  productId: string,
  quantity = 1
): CartLine[] {
  const qty = clampQuantity(quantity)
  const index = lines.findIndex((line) => line.productId === productId)
  if (index === -1) return [...lines, { productId, quantity: qty }]
  const next = [...lines]
  next[index] = { ...next[index], quantity: clampQuantity(next[index].quantity + qty) }
  return next
}

/** Set an exact quantity for a product; ignored when the product is absent. */
export function setLineQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number
): CartLine[] {
  const index = lines.findIndex((line) => line.productId === productId)
  if (index === -1) return lines
  const next = [...lines]
  next[index] = { ...next[index], quantity: clampQuantity(quantity) }
  return next
}

/** Remove a product from the cart. */
export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.productId !== productId)
}

/** Total units across every line — the number shown on the header badge. */
export function cartTotalUnits(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

/** Number of distinct products in the cart. */
export function cartUniqueCount(lines: CartLine[]): number {
  return lines.length
}

/** The reducer backing the cart context. Pure — never mutates its input. */
export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines
    case 'add':
      return addToCart(lines, action.productId, action.quantity ?? 1)
    case 'setQuantity':
      return setLineQuantity(lines, action.productId, action.quantity)
    case 'remove':
      return removeLine(lines, action.productId)
    case 'clear':
      return []
    default:
      return lines
  }
}

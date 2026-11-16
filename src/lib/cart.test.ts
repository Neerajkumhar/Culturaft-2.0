import { describe, it, expect } from 'vitest'
import {
  cartReducer,
  cartTotalUnits,
  cartUniqueCount,
  clampQuantity,
  MAX_QUANTITY,
  MIN_QUANTITY,
  type CartLine,
} from './cart'

const reducer = (lines: CartLine[], action: Parameters<typeof cartReducer>[1]) =>
  cartReducer(lines, action)

describe('clampQuantity', () => {
  it('keeps in-range integers', () => {
    expect(clampQuantity(1)).toBe(1)
    expect(clampQuantity(42)).toBe(42)
  })
  it('clamps below the minimum to 1', () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY)
    expect(clampQuantity(-5)).toBe(MIN_QUANTITY)
  })
  it('clamps above the maximum to 99', () => {
    expect(clampQuantity(100)).toBe(MAX_QUANTITY)
    expect(clampQuantity(9999)).toBe(MAX_QUANTITY)
  })
  it('treats non-finite values as the minimum', () => {
    expect(clampQuantity(Number.NaN)).toBe(MIN_QUANTITY)
    expect(clampQuantity(Infinity)).toBe(MIN_QUANTITY)
  })
})

describe('cartReducer', () => {
  it('adds a new product with the default quantity of 1', () => {
    const next = reducer([], { type: 'add', productId: 'a' })
    expect(next).toEqual([{ productId: 'a', quantity: 1 }])
  })

  it('adds a new product with an explicit quantity', () => {
    const next = reducer([], { type: 'add', productId: 'a', quantity: 3 })
    expect(next).toEqual([{ productId: 'a', quantity: 3 }])
  })

  it('increments instead of duplicating when the product is already present', () => {
    const start: CartLine[] = [{ productId: 'a', quantity: 2 }]
    const next = reducer(start, { type: 'add', productId: 'a' })
    expect(next).toEqual([{ productId: 'a', quantity: 3 }])
    expect(next).toHaveLength(1)
  })

  it('clamps an increment at the maximum', () => {
    const next = reducer([{ productId: 'a', quantity: 99 }], { type: 'add', productId: 'a' })
    expect(next[0].quantity).toBe(MAX_QUANTITY)
  })

  it('sets a quantity and clamps it to the valid range', () => {
    const start: CartLine[] = [{ productId: 'a', quantity: 2 }]
    expect(reducer(start, { type: 'setQuantity', productId: 'a', quantity: 7 })[0].quantity).toBe(7)
    expect(reducer(start, { type: 'setQuantity', productId: 'a', quantity: 0 })[0].quantity).toBe(1)
    expect(reducer(start, { type: 'setQuantity', productId: 'a', quantity: 500 })[0].quantity).toBe(99)
  })

  it('ignores setQuantity for an unknown product', () => {
    const start: CartLine[] = [{ productId: 'a', quantity: 2 }]
    expect(reducer(start, { type: 'setQuantity', productId: 'zzz', quantity: 5 })).toEqual(start)
  })

  it('removes a product', () => {
    const start: CartLine[] = [
      { productId: 'a', quantity: 1 },
      { productId: 'b', quantity: 2 },
    ]
    expect(reducer(start, { type: 'remove', productId: 'a' })).toEqual([{ productId: 'b', quantity: 2 }])
  })

  it('clears the cart', () => {
    expect(reducer([{ productId: 'a', quantity: 1 }], { type: 'clear' })).toEqual([])
  })

  it('hydrates from persisted lines', () => {
    const lines: CartLine[] = [{ productId: 'a', quantity: 4 }]
    expect(reducer([], { type: 'hydrate', lines })).toEqual(lines)
  })

  it('does not mutate the input array', () => {
    const start: CartLine[] = [{ productId: 'a', quantity: 1 }]
    reducer(start, { type: 'add', productId: 'a' })
    expect(start).toEqual([{ productId: 'a', quantity: 1 }])
  })
})

describe('selectors', () => {
  it('sums quantities for the badge', () => {
    expect(
      cartTotalUnits([
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 4 },
      ])
    ).toBe(6)
  })

  it('counts unique products', () => {
    expect(
      cartUniqueCount([
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 4 },
      ])
    ).toBe(2)
  })
})

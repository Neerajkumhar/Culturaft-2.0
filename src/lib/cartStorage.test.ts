import { describe, it, expect, vi } from 'vitest'
import { CART_STORAGE_KEY, loadCart, saveCart, type StorageLike } from './cartStorage'

/** Minimal in-memory Storage double with call spies. */
function makeStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    _dump: () => Object.fromEntries(store),
  }
}

describe('loadCart', () => {
  it('returns an empty cart when nothing is stored', () => {
    expect(loadCart(makeStorage())).toEqual([])
  })

  it('round-trips a saved cart', () => {
    const storage = makeStorage()
    saveCart(storage, [{ productId: 'a', quantity: 2 }])
    expect(loadCart(storage)).toEqual([{ productId: 'a', quantity: 2 }])
  })

  it('recovers from corrupted JSON without throwing', () => {
    const storage = makeStorage({ [CART_STORAGE_KEY]: '{not json' })
    expect(() => loadCart(storage)).not.toThrow()
    expect(loadCart(storage)).toEqual([])
  })

  it('ignores a non-array payload', () => {
    const storage = makeStorage({ [CART_STORAGE_KEY]: '{"productId":"a"}' })
    expect(loadCart(storage)).toEqual([])
  })

  it('drops entries with a missing or non-string productId', () => {
    const storage = makeStorage({
      [CART_STORAGE_KEY]: JSON.stringify([
        { productId: 'a', quantity: 1 },
        { quantity: 2 },
        { productId: 5, quantity: 1 },
      ]),
    })
    expect(loadCart(storage)).toEqual([{ productId: 'a', quantity: 1 }])
  })

  it('drops entries whose quantity is not a number', () => {
    const storage = makeStorage({
      [CART_STORAGE_KEY]: JSON.stringify([{ productId: 'a', quantity: '3' }]),
    })
    expect(loadCart(storage)).toEqual([])
  })

  it('clamps out-of-range quantities instead of dropping the line', () => {
    const storage = makeStorage({
      [CART_STORAGE_KEY]: JSON.stringify([
        { productId: 'a', quantity: 0 },
        { productId: 'b', quantity: 9999 },
      ]),
    })
    expect(loadCart(storage)).toEqual([
      { productId: 'a', quantity: 1 },
      { productId: 'b', quantity: 99 },
    ])
  })

  it('ignores unknown product ids when a validator is supplied', () => {
    const storage = makeStorage({
      [CART_STORAGE_KEY]: JSON.stringify([
        { productId: 'known', quantity: 1 },
        { productId: 'ghost', quantity: 1 },
      ]),
    })
    const result = loadCart(storage, (id) => id === 'known')
    expect(result).toEqual([{ productId: 'known', quantity: 1 }])
  })

  it('de-duplicates repeated product ids, keeping the first', () => {
    const storage = makeStorage({
      [CART_STORAGE_KEY]: JSON.stringify([
        { productId: 'a', quantity: 1 },
        { productId: 'a', quantity: 5 },
      ]),
    })
    expect(loadCart(storage)).toEqual([{ productId: 'a', quantity: 1 }])
  })

  it('never throws when the storage backend itself throws', () => {
    const hostile: StorageLike = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }
    expect(() => loadCart(hostile)).not.toThrow()
    expect(loadCart(hostile)).toEqual([])
  })

  it('returns an empty cart for a null storage (SSR / unavailable)', () => {
    expect(loadCart(null)).toEqual([])
  })
})

describe('saveCart', () => {
  it('writes only productId and quantity', () => {
    const storage = makeStorage()
    saveCart(storage, [{ productId: 'a', quantity: 3 }])
    expect(JSON.parse(storage._dump()[CART_STORAGE_KEY])).toEqual([
      { productId: 'a', quantity: 3 },
    ])
  })

  it('skips a write when the stored value is unchanged', () => {
    const storage = makeStorage()
    saveCart(storage, [{ productId: 'a', quantity: 1 }])
    storage.setItem.mockClear()
    saveCart(storage, [{ productId: 'a', quantity: 1 }])
    expect(storage.setItem).not.toHaveBeenCalled()
  })

  it('removes the key when the cart becomes empty', () => {
    const storage = makeStorage()
    saveCart(storage, [{ productId: 'a', quantity: 1 }])
    saveCart(storage, [])
    expect(storage._dump()[CART_STORAGE_KEY]).toBeUndefined()
    expect(storage.removeItem).toHaveBeenCalledWith(CART_STORAGE_KEY)
  })

  it('does not write an empty cart when nothing was stored', () => {
    const storage = makeStorage()
    saveCart(storage, [])
    expect(storage.setItem).not.toHaveBeenCalled()
    expect(storage.removeItem).not.toHaveBeenCalled()
  })

  it('never throws when the storage backend throws', () => {
    const hostile: StorageLike = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }
    expect(() => saveCart(hostile, [{ productId: 'a', quantity: 1 }])).not.toThrow()
  })

  it('is a no-op for a null storage', () => {
    expect(() => saveCart(null, [{ productId: 'a', quantity: 1 }])).not.toThrow()
  })
})

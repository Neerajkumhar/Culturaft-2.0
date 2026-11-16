import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'
import { HOME_BANNER } from '@/config/site'
import { listCategoryProducts, MAIN_CATEGORIES } from '@/data/categoryNavigation'
import {
  getCriticalImageUrls,
  getVisibleProductCount,
  preloadImageUrls,
  uniqueImageUrls,
} from './useImagePreloader'

const products = productsData as unknown as Product[]
const firstProduct = products[0]
const categoryImage = firstProduct.images[0]

class ControlledImage {
  complete = false
  naturalWidth = 0
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private currentSrc = ''

  set src(value: string) {
    this.currentSrc = value
    if (value.includes('cached')) {
      this.complete = true
      this.naturalWidth = 800
    }
  }

  get src(): string {
    return this.currentSrc
  }

  succeed() {
    this.complete = true
    this.naturalWidth = 800
    this.onload?.()
  }

  fail() {
    this.complete = true
    this.onerror?.()
  }
}

let requests: ControlledImage[]

beforeEach(() => {
  requests = []
  vi.stubGlobal(
    'Image',
    class extends ControlledImage {
      constructor() {
        super()
        requests.push(this)
      }
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('critical image selection', () => {
  it('uses the responsive homepage banner and only first-row catalog imagery', () => {
    const urls = getCriticalImageUrls({
      pathname: '/',
      search: '',
      viewportWidth: 1440,
      devicePixelRatio: 1,
    })

    expect(urls).toContain(HOME_BANNER.webp[1].src)
    expect(urls).toContain(categoryImage)
    expect(urls.length).toBeLessThanOrEqual(5)
    expect(urls.length).toBeLessThan(products.reduce((count, item) => count + item.images.length, 0))
  })

  it('selects only the visible shop row and respects current filters', () => {
    const filtered = products.filter((product) => product.category === firstProduct.category)
    const urls = getCriticalImageUrls({
      pathname: '/shop',
      search: '',
      viewportWidth: 1440,
      filterProducts: () => filtered,
    })

    expect(urls).toEqual(filtered.slice(0, 4).map((product) => product.images[0]))
    expect(urls).not.toContain(HOME_BANNER.webp[1].src)
  })

  it('limits category imagery to the selected category and subcategory', () => {
    const urls = getCriticalImageUrls({
      pathname: '/category/benches',
      search: '',
      viewportWidth: 1280,
    })

    expect(urls).toHaveLength(4)
    expect(urls.every((url) => url.includes('/BENCHES/'))).toBe(true)
  })

  it('uses the selected category subcategory when present in the URL', () => {
    const category = MAIN_CATEGORIES[0]
    const subcategory = category.subcategories[0]
    const expectedProducts = listCategoryProducts(category.id, subcategory.id)

    const urls = getCriticalImageUrls({
      pathname: `/category/${category.slug}`,
      search: `?subcategory=${subcategory.id}`,
      viewportWidth: 1440,
    })

    expect(urls).toEqual(expectedProducts.slice(0, 4).map((product) => product.images[0]))
  })

  it('preloads every gallery image only for the selected product', () => {
    const urls = getCriticalImageUrls({
      pathname: `/product/${firstProduct.slug}`,
      search: '',
      viewportWidth: 390,
    })

    expect(urls).toEqual(firstProduct.images)
  })

  it('limits cart preloads to the visible cart rows', () => {
    const urls = getCriticalImageUrls({
      pathname: '/cart',
      search: '',
      viewportWidth: 1440,
      cartProductIds: products.slice(0, 6).map((product) => product.id),
    })

    expect(urls).toEqual(products.slice(0, 4).map((product) => product.images[0]))
  })

  it('returns no images for routes without critical photography', () => {
    expect(
      getCriticalImageUrls({
        pathname: '/about',
        search: '',
        viewportWidth: 1440,
      }),
    ).toEqual([])
  })

  it('uses responsive row counts matching the catalog layout', () => {
    expect(getVisibleProductCount(390)).toBe(2)
    expect(getVisibleProductCount(768)).toBe(2)
    expect(getVisibleProductCount(1024)).toBe(3)
    expect(getVisibleProductCount(1440)).toBe(4)
  })
})

describe('preloadImageUrls', () => {
  it('settles an empty image list immediately', async () => {
    await expect(preloadImageUrls([])).resolves.toEqual({
      total: 0,
      completed: 0,
      loaded: [],
      failed: [],
      cancelled: false,
    })
  })

  it('handles cached images without waiting for load events', async () => {
    await expect(preloadImageUrls(['/cached.webp'])).resolves.toMatchObject({
      total: 1,
      completed: 1,
      loaded: ['/cached.webp'],
      failed: [],
      cancelled: false,
    })
  })

  it('records successful requests and progress from actual completions', async () => {
    const progress: number[] = []
    const result = preloadImageUrls(['/one.jpg', '/two.jpg'], {
      onProgress: ({ completed }) => progress.push(completed),
    })

    requests[0].succeed()
    requests[1].succeed()

    await expect(result).resolves.toMatchObject({
      total: 2,
      completed: 2,
      loaded: ['/one.jpg', '/two.jpg'],
      failed: [],
    })
    expect(progress).toEqual([1, 2])
  })

  it('records errors as completed requests without blocking other images', async () => {
    const result = preloadImageUrls(['/broken.jpg', '/good.jpg'])

    requests[0].fail()
    requests[1].succeed()

    await expect(result).resolves.toMatchObject({
      total: 2,
      completed: 2,
      loaded: ['/good.jpg'],
      failed: ['/broken.jpg'],
      cancelled: false,
    })
  })

  it('deduplicates URLs before loading and progress counting', async () => {
    const result = preloadImageUrls(['/same.jpg', '/same.jpg', ''])
    expect(requests).toHaveLength(1)

    requests[0].succeed()
    await expect(result).resolves.toMatchObject({
      total: 1,
      completed: 1,
      loaded: ['/same.jpg'],
    })
    expect(uniqueImageUrls(['/same.jpg', '/same.jpg', ''])).toEqual(['/same.jpg'])
  })

  it('cleans up image handlers when tracking is cancelled', async () => {
    const controller = new AbortController()
    const result = preloadImageUrls(['/slow.jpg'], { signal: controller.signal })

    controller.abort()

    await expect(result).resolves.toMatchObject({ cancelled: true })
    expect(requests[0].onload).toBeNull()
    expect(requests[0].onerror).toBeNull()
  })
})

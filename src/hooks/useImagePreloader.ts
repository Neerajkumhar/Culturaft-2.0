import { useEffect, useMemo, useState } from 'react'
import productsData from '@/data/products.json'
import {
  categoryCover,
  getCategoryBySlug,
  getCategoryProducts,
  getSubcategory,
  listCategoryProducts,
  MAIN_CATEGORIES,
} from '@/data/categoryNavigation'
import { HOME_BANNER } from '@/config/site'
import type { Product } from '@/types/product'

const products = productsData as unknown as Product[]

export interface ImagePreloadProgress {
  total: number
  completed: number
  loaded: string[]
  failed: string[]
}

export interface ImagePreloadResult extends ImagePreloadProgress {
  cancelled: boolean
}

interface ImagePreloadOptions {
  signal?: AbortSignal
  onProgress?: (progress: ImagePreloadProgress) => void
}

export interface CriticalImageOptions {
  pathname: string
  search: string
  viewportWidth: number
  devicePixelRatio?: number
  cartProductIds?: readonly string[]
  filterProducts?: (source: Product[]) => Product[]
}

export interface ImagePreloadState extends ImagePreloadProgress {
  isComplete: boolean
}

export function uniqueImageUrls(urls: readonly string[]): string[] {
  return [...new Set(urls.map((url) => url.trim()).filter(Boolean))]
}

export function getVisibleProductCount(viewportWidth: number): number {
  if (viewportWidth >= 1280) return 4
  if (viewportWidth >= 1024) return 3
  return 2
}

function firstProductImages(
  source: readonly Product[],
  count: number,
): string[] {
  return source
    .map((product) => product.images[0])
    .filter((image): image is string => Boolean(image))
    .slice(0, count)
}

export function getCriticalImageUrls({
  pathname,
  search,
  viewportWidth,
  devicePixelRatio = 1,
  cartProductIds = [],
  filterProducts = (source) => source,
}: CriticalImageOptions): string[] {
  const visibleCount = getVisibleProductCount(viewportWidth)
  const searchParams = new URLSearchParams(search)
  const categoryMatch = /^\/category\/([^/]+)\/?$/.exec(pathname)
  const productMatch = /^\/product\/([^/]+)\/?$/.exec(pathname)

  if (pathname === '/') {
    const targetWidth = viewportWidth * devicePixelRatio
    const banner =
      HOME_BANNER.webp.find((source) => source.width >= targetWidth) ??
      HOME_BANNER.webp[HOME_BANNER.webp.length - 1]
    const categoryImages = MAIN_CATEGORIES.slice(
      0,
      viewportWidth >= 640 ? 2 : 1,
    )
      .map((category) => categoryCover(category.id))
      .filter((image): image is string => Boolean(image))
    const featuredProducts = MAIN_CATEGORIES.map(
      (category) => getCategoryProducts(category.id)[0],
    ).filter((product): product is Product => Boolean(product))
    return uniqueImageUrls([
      banner.src,
      ...categoryImages,
      ...firstProductImages(featuredProducts, visibleCount),
    ])
  }

  if (pathname === '/shop' || pathname === '/shop/') {
    return uniqueImageUrls(
      firstProductImages(filterProducts(products), visibleCount),
    )
  }

  if (categoryMatch) {
    const category = getCategoryBySlug(categoryMatch[1])
    if (!category) return []

    const requestedSubcategory = getSubcategory(
      searchParams.get('subcategory') ?? undefined,
      category.id,
    )
    const categoryProducts = listCategoryProducts(
      category.id,
      requestedSubcategory?.id,
    )
    return uniqueImageUrls(
      firstProductImages(filterProducts(categoryProducts), visibleCount),
    )
  }

  if (productMatch) {
    const product = products.find((item) => item.slug === productMatch[1])
    return uniqueImageUrls(product?.images ?? [])
  }

  if (pathname === '/cart' || pathname === '/cart/') {
    const cartProducts = cartProductIds
      .map((productId) => products.find((product) => product.id === productId))
      .filter((product): product is Product => Boolean(product))
    return uniqueImageUrls(firstProductImages(cartProducts, visibleCount))
  }

  return []
}

export function preloadImageUrls(
  urls: readonly string[],
  { signal, onProgress }: ImagePreloadOptions = {},
): Promise<ImagePreloadResult> {
  const uniqueUrls = uniqueImageUrls(urls)
  const loaded: string[] = []
  const failed: string[] = []

  return new Promise((resolve) => {
    let completed = 0
    let settled = false
    const images = new Map<HTMLImageElement, string>()

    const snapshot = (cancelled = false): ImagePreloadResult => ({
      total: uniqueUrls.length,
      completed,
      loaded: [...loaded],
      failed: [...failed],
      cancelled,
    })

    const removeListeners = () => {
      signal?.removeEventListener('abort', handleAbort)
      for (const image of images.keys()) {
        image.onload = null
        image.onerror = null
      }
      images.clear()
    }

    const finishAll = (cancelled = false) => {
      if (settled) return
      settled = true
      removeListeners()
      resolve(snapshot(cancelled))
    }

    const handleAbort = () => finishAll(true)

    if (signal?.aborted) {
      finishAll(true)
      return
    }

    signal?.addEventListener('abort', handleAbort, { once: true })

    if (uniqueUrls.length === 0) {
      onProgress?.({
        total: 0,
        completed: 0,
        loaded: [],
        failed: [],
      })
      finishAll()
      return
    }

    const finishImage = (image: HTMLImageElement, succeeded: boolean) => {
      const url = images.get(image)
      if (!url || settled) return
      images.delete(image)
      image.onload = null
      image.onerror = null

      if (succeeded) loaded.push(url)
      else failed.push(url)
      completed += 1

      onProgress?.({
        total: uniqueUrls.length,
        completed,
        loaded: [...loaded],
        failed: [...failed],
      })

      if (completed === uniqueUrls.length) finishAll()
    }

    for (const url of uniqueUrls) {
      if (settled) break
      const image = new Image()
      images.set(image, url)
      image.onload = () => finishImage(image, true)
      image.onerror = () => finishImage(image, false)
      image.src = url

      if (image.complete) {
        finishImage(image, image.naturalWidth > 0)
      }
    }
  })
}

const EMPTY_PROGRESS: ImagePreloadState = {
  total: 0,
  completed: 0,
  loaded: [],
  failed: [],
  isComplete: true,
}

export function useImagePreloader(
  urls: readonly string[],
  enabled = true,
): ImagePreloadState {
  const stableUrls = useMemo(() => uniqueImageUrls(urls), [urls])
  const urlsKey = JSON.stringify(stableUrls)
  const [storedState, setStoredState] = useState(() => ({
    key: urlsKey,
    value: {
      ...EMPTY_PROGRESS,
      total: stableUrls.length,
      isComplete: stableUrls.length === 0,
    },
  }))
  const state =
    !enabled || stableUrls.length === 0
      ? EMPTY_PROGRESS
      : storedState.key === urlsKey
        ? storedState.value
        : {
            total: stableUrls.length,
            completed: 0,
            loaded: [],
            failed: [],
            isComplete: false,
          }

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    const requestUrls: string[] = JSON.parse(urlsKey)

    void preloadImageUrls(requestUrls, {
      signal: controller.signal,
      onProgress: (progress) => {
        if (controller.signal.aborted) return
        setStoredState({
          key: urlsKey,
          value: { ...progress, isComplete: progress.completed === progress.total },
        })
      },
    })
      .then((result) => {
        if (result.cancelled) return
        setStoredState({ key: urlsKey, value: { ...result, isComplete: true } })
        if (result.failed.length > 0) {
          console.warn(
            `CULTURAFT preloader: ${result.failed.length} critical image(s) failed to load.`,
            result.failed,
          )
        }
      })
      .catch((error: unknown) => {
        console.error('CULTURAFT preloader could not track critical images.', error)
        if (!controller.signal.aborted) {
          setStoredState({
            key: urlsKey,
            value: {
              total: requestUrls.length,
              completed: requestUrls.length,
              loaded: [],
              failed: requestUrls,
              isComplete: true,
            },
          })
        }
      })

    return () => controller.abort()
  }, [enabled, stableUrls, urlsKey])

  return state
}

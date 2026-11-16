export const HOME_BANNER = {
  webp: [
    { src: '/images/banners/banner-1-1280.webp', width: 1280 },
    { src: '/images/banners/banner-1-2560.webp', width: 2560 },
  ],
  jpeg: [
    { src: '/images/banners/banner-1-1280.jpg', width: 1280 },
    { src: '/images/banners/banner-1-2560.jpg', width: 2560 },
  ],
} as const

export function toSrcSet(
  sources: readonly { src: string; width: number }[],
): string {
  return sources.map(({ src, width }) => `${src} ${width}w`).join(', ')
}

import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/types/product'

/**
 * Product image gallery.
 *
 * Large main image with a thumbnail rail; arrow buttons overlay the main
 * image; thumbnails are proper buttons announced with position. A native
 * <dialog> lightbox provides platform focus trapping and Escape handling.
 */
export function ImageGallery({ product }: { product: Product }) {
  const images = product.images
  const [active, setActive] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    setActive(0)
  }, [product.slug])

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/5 items-center justify-center bg-sand text-sm text-fog">
        Photography coming soon
      </div>
    )
  }

  const openLightbox = () => dialogRef.current?.showModal()
  const closeLightbox = () => dialogRef.current?.close()

  const showPrev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const showNext = () => setActive((i) => (i + 1) % images.length)

  return (
    <div>
      {/* Main image */}
      <div className="relative overflow-hidden bg-sand">
        <img
          src={images[active]}
          alt={`${product.name} — view ${active + 1} of ${images.length}`}
          width={1200}
          height={1200}
          loading={active === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="aspect-4/5 w-full object-cover lg:aspect-square"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center bg-chalk/90 text-ink transition-colors hover:bg-chalk"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center bg-chalk/90 text-ink transition-colors hover:bg-chalk"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={openLightbox}
              className="absolute bottom-3 right-3 bg-chalk/90 px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-chalk"
            >
              View larger
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label={`${product.name} image thumbnails`}>
          {images.map((image, index) => (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === active ? 'true' : undefined}
                className={`block size-16 overflow-hidden border transition-colors sm:size-20 ${
                  index === active ? 'border-brand-primary' : 'border-line hover:border-brand-light'
                }`}
              >
                <img
                  src={image}
                  alt=""
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Lightbox — native dialog: focus trap + Escape for free */}
      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox()
        }}
        aria-label={`${product.name} — enlarged image`}
        className="lb m-auto max-h-[92dvh] max-w-[92vw] bg-transparent p-0 backdrop:bg-ink/85"
      >
        <div className="relative">
          <img
            src={images[active]}
            alt={`${product.name} — enlarged view ${active + 1} of ${images.length}`}
            className="max-h-[80dvh] w-auto max-w-[92vw] bg-chalk object-contain"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <button type="button" onClick={showPrev} className="flex min-h-11 items-center gap-2 text-sm text-chalk hover:underline">
              ← Previous
            </button>
            <span className="text-xs text-chalk/80">
              {active + 1} / {images.length}
            </span>
            <button type="button" onClick={showNext} className="flex min-h-11 items-center gap-2 text-sm text-chalk hover:underline">
              Next →
            </button>
          </div>
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close enlarged image"
            className="absolute -top-2 right-0 flex size-11 -translate-y-full items-center justify-center text-chalk"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </dialog>
    </div>
  )
}

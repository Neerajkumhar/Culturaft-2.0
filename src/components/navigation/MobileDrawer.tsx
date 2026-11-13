import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp'

/**
 * Mobile navigation drawer — native <dialog> so focus trapping, Escape
 * handling, inert background and focus restoration are provided by the
 * platform. Categories expand as accordions with their verified
 * subcategories; every link is a 44px+ touch target.
 */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
      document.documentElement.style.overflow = ''
    }
    return () => {
      if (dialog.open) dialog.close()
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q')
    const term = typeof query === 'string' ? query.trim() : ''
    onClose()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
  }

  const whatsappUrl = (() => {
    const number = getWhatsAppNumber()
    return number
      ? buildWhatsAppUrl(number, 'Hi Culturaft! I have a general enquiry.')
      : null
  })()

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label="Site navigation"
      className="drawer fixed inset-y-0 left-0 m-0 h-dvh max-h-dvh w-[22rem] max-w-[88vw] overflow-y-auto bg-chalk p-0"
    >
      <div className="flex h-full flex-col">
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex min-h-11 items-center bg-transparent"
            aria-label="CULTURAFT — home"
          >
            <img
              src="/culturaft-logo.png"
              alt="Culturaft - Furniture & Living"
              className="h-auto w-[135px] bg-transparent object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center text-charcoal hover:text-ink"
            aria-label="Close navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <form role="search" onSubmit={handleSearch} className="border-b border-line px-5 py-4">
          <label htmlFor="drawer-search" className="sr-only">
            Search furniture
          </label>
          <input
            id="drawer-search"
            name="q"
            type="search"
            placeholder="Search furniture…"
            className="field"
          />
        </form>

        {/* Categories with accordions */}
        <nav aria-label="Shop categories" className="flex-1 border-b border-line px-5 py-2">
          <ul>
            <li className="border-b border-line/70">
              <Link to="/shop" onClick={onClose} className="flex min-h-11 items-center py-2 text-sm text-charcoal hover:text-ink">
                Shop All Furniture
              </Link>
            </li>
            {MAIN_CATEGORIES.map((category) => (
              <li key={category.slug} className="border-b border-line/70">
                <details className="group">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 text-sm text-charcoal transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                    <span>
                      {category.name}
                      <span className="ml-2 text-xs text-fog">{category.productCount}</span>
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      className="shrink-0 transition-transform group-open:rotate-180"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className="pb-3 pl-1">
                    <Link
                      to={`/category/${category.slug}`}
                      onClick={onClose}
                      className="flex min-h-11 items-center border-l-2 border-brand-primary py-2 pl-3 text-sm font-semibold text-ink"
                    >
                      View All {category.name}
                    </Link>
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/category/${category.slug}?subcategory=${sub.id}`}
                        onClick={onClose}
                        className="flex min-h-11 items-center border-l-2 border-line py-2 pl-3 text-sm text-charcoal hover:border-brand-primary hover:text-ink"
                      >
                        {sub.label}
                        <span className="ml-auto text-xs text-fog">{sub.productCount}</span>
                      </Link>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </nav>

        {/* Company links */}
        <div className="px-5 py-4">
          <ul className="grid gap-1">
            <li>
              <Link to="/about" onClick={onClose} className="flex min-h-11 items-center text-sm text-charcoal hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={onClose} className="flex min-h-11 items-center text-sm text-charcoal hover:text-ink">
                Contact
              </Link>
            </li>
            {whatsappUrl && (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex min-h-11 items-center gap-2 text-sm text-charcoal hover:text-ink"
                >
                  <WhatsAppGlyph className="size-4 text-olive" />
                  WhatsApp enquiry
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </dialog>
  )
}

/** Shared WhatsApp glyph (real logo path), used across enquiry CTAs. */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2 22l4.9-1.6A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.2-2.9.9.9-2.8-.2-.3a8.1 8.1 0 0 1 6.6-12.7Zm-3 3.3c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.8 4.4 3.9 2.1.9 2.6.7 3 .7.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.6-.3-1.4-.6-2.1-1.2-.6-.5-1-1.1-1.2-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5Z" />
    </svg>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { MAIN_CATEGORIES, type MainCategoryId } from '@/data/categoryNavigation'
import { MegaMenuPanel } from '@/components/navigation/MegaMenuPanel'
import { MobileDrawer } from '@/components/navigation/MobileDrawer'

const CLOSE_DELAY_MS = 120

/**
 * Site header.
 *
 * Desktop: wordmark · six category links with a full-width mega menu
 * (opens on hover and keyboard focus, closes on Escape / outside click /
 * focus leaving) · About · Contact · search · Shop All.
 * Mobile: hamburger opens the slide-in drawer (native <dialog>).
 * No cart or account icons — the storefront has no checkout or login.
 */
export default function Header() {
  const [openCategory, setOpenCategory] = useState<MainCategoryId | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Close menus when the route changes (mega menu, search row).
  useEffect(() => {
    setOpenCategory(null)
    setSearchOpen(false)
  }, [location])

  // Close the mega menu when clicking outside the header.
  useEffect(() => {
    if (openCategory === null) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('header')) {
        setOpenCategory(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openCategory])

  const scheduleClose = (categoryId: MainCategoryId) => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(
      () => setOpenCategory((current) => (current === categoryId ? null : current)),
      CLOSE_DELAY_MS
    )
  }
  const cancelClose = () => window.clearTimeout(closeTimer.current)
  const openNow = (categoryId: MainCategoryId) => {
    cancelClose()
    setOpenCategory(categoryId)
  }

  const openCategoryData = MAIN_CATEGORIES.find((c) => c.slug === openCategory)
  const isCategoryRoute = (slug: string) =>
    location.pathname === `/category/${slug}` ||
    location.pathname.startsWith(`/category/${slug}/`)

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q')
    const term = typeof query === 'string' ? query.trim() : ''
    setSearchOpen(false)
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
  }

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  return (
    <header className="sticky top-0 z-50 bg-chalk/97 backdrop-blur-sm">
      {/* Announcement bar — genuine, factual information only */}
      <p className="bg-ink text-center text-2xs font-medium tracking-[0.08em] text-chalk/90">
        <span className="inline-block px-4 py-2">
          Handwoven rope furniture · Prices in INR · Enquire on WhatsApp
        </span>
      </p>

      <div className="border-b border-line">
        <div className="wrap flex items-center gap-3 py-3 sm:gap-6">
          {/* Brand logo — home access */}
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center bg-transparent"
            aria-label="CULTURAFT — home"
          >
            <img
              src="/culturaft-logo.png"
              alt="Culturaft - Furniture & Living"
              className="h-auto w-[130px] bg-transparent object-contain sm:w-[145px] md:w-[155px] lg:w-[170px]"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop primary navigation */}
          <nav aria-label="Shop categories" className="ml-2 hidden flex-1 lg:block">
            <ul className="flex items-center gap-1 xl:gap-3">
              {MAIN_CATEGORIES.map((category) => (
                <li
                  key={category.slug}
                  onMouseEnter={() => openNow(category.slug)}
                  onMouseLeave={() => scheduleClose(category.slug)}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="nav-link px-2 xl:px-2.5"
                    aria-haspopup="true"
                    aria-expanded={openCategory === category.slug}
                    aria-controls={openCategory === category.slug ? 'mega-panel' : undefined}
                    aria-current={isCategoryRoute(category.slug) ? 'true' : undefined}
                    onFocus={() => openNow(category.slug)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape' && openCategory === category.slug) {
                        setOpenCategory(null)
                      }
                    }}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="mx-2 hidden h-4 w-px bg-line-strong xl:block" />
              <li className="hidden lg:block">
                <Link to="/about" className="nav-link px-2.5" aria-current={location.pathname === '/about' ? 'page' : undefined}>
                  About
                </Link>
              </li>
              <li className="hidden lg:block">
                <Link to="/contact" className="nav-link px-2.5" aria-current={location.pathname === '/contact' ? 'page' : undefined}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              className="flex min-h-11 min-w-11 items-center justify-center px-2 text-charcoal transition-colors hover:text-ink"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            <Link
              to="/shop"
              className="hidden border border-line-strong bg-transparent px-4 py-2 font-display text-xs font-semibold tracking-[0.02em] text-ink transition-colors hover:border-ink hover:bg-paper xl:inline-flex xl:min-h-11 xl:items-center xl:justify-center"
            >
              Shop All
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex min-h-11 min-w-11 items-center justify-center text-ink lg:hidden"
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search row */}
        {searchOpen && (
          <div id="header-search" className="border-t border-line bg-paper">
            <form role="search" onSubmit={handleSearch} className="wrap flex gap-3 py-4">
              <label htmlFor="header-search-input" className="sr-only">
                Search furniture
              </label>
              <input
                ref={searchInputRef}
                id="header-search-input"
                name="q"
                type="search"
                placeholder="Search by name, material or keyword…"
                className="field flex-1"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mega menu band — flush with the bar so hover travel never breaks */}
      <div
        onMouseEnter={cancelClose}
        onMouseLeave={() => openCategory && scheduleClose(openCategory)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpenCategory(null)
            ;(document.activeElement as HTMLElement | null)?.blur()
          }
        }}
        onFocus={(event) => {
          if (event.target === event.currentTarget) return
          cancelClose()
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpenCategory(null)
          }
        }}
        className="hidden lg:block"
      >
        {openCategoryData && <MegaMenuPanel category={openCategoryData} />}
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  )
}

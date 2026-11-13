import { Link } from 'react-router-dom'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'

/**
 * Site footer.
 *
 * Shop: the six main categories, each with its verified subcategories.
 * Company: About and Contact. Connect: WhatsApp only when the business
 * number is configured — no invented email addresses or social profiles.
 */
export default function Footer() {
  const whatsappUrl = (() => {
    const number = getWhatsAppNumber()
    return number
      ? buildWhatsAppUrl(number, 'Hi Culturaft! I have a general enquiry.')
      : null
  })()

  return (
    <footer className="site-footer mt-auto border-t border-line bg-foreground">
      <div className="wrap grid gap-x-10 gap-y-10 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_2fr_1fr]">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center bg-transparent"
            aria-label="CULTURAFT — home"
          >
            <img
              src="/culturaft-logo.png"
              alt="Culturaft - Furniture & Living"
              className="h-auto w-[145px] bg-transparent object-contain md:w-[160px]"
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-charcoal">
            Handwoven rope furniture in natural jute, wood and paper cord —
            made to order and enquired directly on WhatsApp.
          </p>
        </div>

        {/* Categories + verified subcategories */}
        <nav aria-label="Shop collections" className="lg:border-l lg:border-line lg:pl-10">
          <h2 className="eyebrow text-fog">Shop by collection</h2>
          <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {MAIN_CATEGORIES.map((category) => (
              <div key={category.slug}>
                <h3 className="text-sm">
                  <Link
                    to={`/category/${category.slug}`}
                    className="font-display font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    {category.name}
                    <span className="ml-2 text-xs font-normal text-fog">
                      {category.productCount}
                    </span>
                  </Link>
                </h3>
                <ul className="mt-2 grid gap-0.5">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/category/${category.slug}?subcategory=${sub.id}`}
                        className="link-quiet text-xs"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/shop" className="link-quiet text-xs">
                      Shop All Furniture
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Company + genuine contact */}
        <div className="lg:border-l lg:border-line lg:pl-10">
          <h2 className="eyebrow text-fog">Company</h2>
          <ul className="mt-4 grid gap-1">
            <li>
              <Link to="/about" className="link-quiet text-sm">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="link-quiet text-sm">
                Contact
              </Link>
            </li>
          </ul>

          <h2 className="eyebrow mt-8 text-fog">Enquiries</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {whatsappUrl ? (
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-charcoal hover:text-ink"
                >
                  <WhatsAppGlyph className="size-4 text-olive" />
                  WhatsApp
                </a>
              </li>
            ) : (
              <li className="text-xs text-fog">Enquiry contact not configured.</li>
            )}
            <li>
              <Link to="/contact" className="link-quiet text-xs">
                Enquiry details →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col items-start justify-between gap-2 py-5 sm:flex-row sm:items-center">
          <p className="text-2xs text-fog">© 2026 CULTURAFT. All rights reserved.</p>
          <p className="text-2xs text-fog">
            Designed By{' '}
            <a
              href="https://visuark.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-light underline-offset-4 hover:underline"
            >
              Visuark
            </a>{' '}
            with ❤️ Love
          </p>
          <p className="text-2xs text-fog">
            Prices shown in INR · Unpriced pieces are available on request
          </p>
        </div>
      </div>
    </footer>
  )
}

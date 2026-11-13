import { Link } from 'react-router-dom'
import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'

/**
 * Final CTA — an ink band closing the homepage. Links to the shop and,
 * when VITE_WHATSAPP_NUMBER is configured, the general WhatsApp enquiry.
 * Nothing renders when the number is absent — no dead links.
 */
export function FinalCTA() {
  const number = getWhatsAppNumber()
  const whatsappUrl = number
    ? buildWhatsAppUrl(number, 'Hi Culturaft! I have a general enquiry.')
    : null

  return (
    <section aria-labelledby="final-cta-heading" className="bg-ink text-chalk">
      <div className="wrap flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20">
        <div className="max-w-xl">
          <p className="eyebrow text-chalk/60">Ready when you are</p>
          <h2 id="final-cta-heading" className="mt-4 text-h2 text-chalk lg:text-h2-lg">
            Find something made for your space
          </h2>
          <p className="mt-4 text-lead text-chalk/80">
            Browse the full catalogue — every piece opens with its own enquiry
            options and verified details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-onlight">
            Shop all furniture
          </Link>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light"
            >
              <WhatsAppGlyph className="size-4" />
              WhatsApp us
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

import { getWhatsAppNumber, buildWhatsAppUrl } from '@/lib/whatsapp'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'

/**
 * Contact page — honest contact information only. The business channel
 * is WhatsApp, driven by VITE_WHATSAPP_NUMBER; when it isn't configured
 * we say so plainly instead of inventing an email address or phone line.
 */
export default function ContactPage() {
  const number = getWhatsAppNumber()
  const whatsappUrl = number
    ? buildWhatsAppUrl(number, 'Hi Culturaft! I have a question about your furniture.')
    : null

  return (
    <div className="wrap">
      <header className="border-t border-line py-12 lg:py-16">
        <p className="eyebrow text-fog">Contact</p>
        <h1 className="mt-3 max-w-3xl text-h1 lg:text-hero">Enquire directly</h1>
        <p className="mt-5 max-w-xl text-lead text-charcoal">
          Questions about a piece, its materials, or ordering are answered
          directly on WhatsApp. Every product page carries an enquiry button
          that opens a chat with the piece's details prefilled.
        </p>
      </header>

      <section aria-labelledby="channels-heading" className="pb-20 lg:pb-24">
        <h2 id="channels-heading" className="sr-only">
          Contact channels
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp — the only real channel */}
          <div className="border border-line bg-paper p-7">
            <h3 className="font-display text-title font-bold text-ink">WhatsApp</h3>
            <p className="mt-3 text-sm text-charcoal">
              The fastest way to reach us. Send a general message, or open any
              product and use its “Enquire on WhatsApp” button to include the
              piece's name and details automatically.
            </p>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent mt-6"
              >
                <WhatsAppGlyph className="size-4" />
                Start a WhatsApp chat
              </a>
            ) : (
              <p className="mt-6 border border-line bg-sand px-4 py-3 text-sm text-charcoal">
                Enquiry contact not configured yet — the buttons appear
                automatically once the WhatsApp number is set.
              </p>
            )}
          </div>

          {/* Honest guidance */}
          <div className="border border-line bg-paper p-7">
            <h3 className="font-display text-title font-bold text-ink">What to ask</h3>
            <ul className="mt-3 grid gap-2.5 text-sm text-charcoal">
              <li>Availability and current pricing for an unpriced piece</li>
              <li>Material and weave details — rope, jute or paper cord</li>
              <li>Dimensions from a product's specifications table</li>
              <li>Ordering and delivery for your location</li>
            </ul>
            <p className="mt-6 text-xs text-fog">
              Prices shown are in INR; pieces without a listed price are
              available on request.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

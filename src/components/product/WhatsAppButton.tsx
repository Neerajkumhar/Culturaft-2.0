import { useWhatsAppUrl } from '@/hooks/useWhatsAppUrl'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'

/**
 * WhatsApp enquiry CTA — the primary buying action of this storefront.
 * Renders nothing when no valid VITE_WHATSAPP_NUMBER is configured,
 * so there is never a dead link.
 */
export default function WhatsAppButton({
  productName,
  productSlug,
  category,
  productPrice,
  priceUnit,
  size = 'lg',
}: {
  productName: string
  productSlug: string
  category?: string | null
  productPrice?: number | string | null
  priceUnit?: string | null
  size?: 'lg' | 'sm'
}) {
  const whatsappUrl = useWhatsAppUrl({
    productName,
    productSlug,
    category,
    productPrice,
    priceUnit,
  })

  if (!whatsappUrl) return null

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-accent w-full sm:w-auto ${
        size === 'sm' ? 'px-4 py-2 text-xs' : ''
      }`}
    >
      <WhatsAppGlyph className="size-4" />
      Enquire on WhatsApp
    </a>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useProducts } from '@/hooks/useProducts'
import {
  resolveLinePricing,
  summariseCart,
  type ResolvedCartLine,
} from '@/lib/cartPricing'
import { buildCartQuotationUrl, type QuotationItem } from '@/lib/quotation'
import { getWhatsAppNumber } from '@/lib/whatsapp'
import { MAIN_CATEGORIES } from '@/data/categoryNavigation'
import { WhatsAppGlyph } from '@/components/navigation/MobileDrawer'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'

/**
 * /cart — the quotation review page. Cart lines are resolved against the live
 * catalogue; the WhatsApp CTA rebuilds the message from the current state each
 * render, so it can never send stale information.
 */
export default function CartPage() {
  const { lines, setQuantity, removeItem, clear } = useCart()
  const products = useProducts()
  const [quotationError, setQuotationError] = useState<string | null>(null)
  const missingNumberWarningShown = useRef(false)

  useEffect(() => {
    document.title = 'Your Shopping Cart | CULTURAFT'
    return () => {
      document.title = 'CULTURAFT — Handcrafted Indian Furniture'
    }
  }, [])

  const resolved: ResolvedCartLine[] = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId)
      return product ? { product, quantity: line.quantity } : null
    })
    .filter((line): line is ResolvedCartLine => line !== null)
  const unresolvedCount = lines.length - resolved.length
  const numberConfigured = getWhatsAppNumber() !== null

  useEffect(() => {
    if (
      lines.length > 0 &&
      !numberConfigured &&
      import.meta.env.DEV &&
      !missingNumberWarningShown.current
    ) {
      console.warn(
        'WhatsApp quotations are disabled: VITE_WHATSAPP_NUMBER is missing or invalid.'
      )
      missingNumberWarningShown.current = true
    }
  }, [lines.length, numberConfigured])

  if (resolved.length === 0 && lines.length === 0) {
    return (
      <div className="wrap py-20 text-center lg:py-28">
        <p className="eyebrow text-fog">Cart</p>
        <h1 className="mt-3 text-h1">Your Cart Is Empty</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-charcoal">
          Explore our furniture collections and add pieces you'd like a quotation
          for.
        </p>
        <div className="mt-10">
          <Link to="/shop" className="btn btn-primary">
            Explore Furniture
          </Link>
        </div>
      </div>
    )
  }

  if (resolved.length === 0) {
    return (
      <div className="wrap py-20 text-center lg:py-28">
        <p className="eyebrow text-fog">Quotation Request</p>
        <h1 className="mt-3 text-h1">Cart Items Unavailable</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-charcoal" role="alert">
          One or more saved cart items are no longer available in the catalogue.
          Clear the cart and add current products before requesting a quotation.
        </p>
        <button type="button" onClick={clear} className="btn btn-primary mt-8">
          Clear Cart
        </button>
      </div>
    )
  }

  const summary = summariseCart(resolved)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const items: QuotationItem[] = resolved.map((line) => {
    const pricing = resolveLinePricing(line.product, line.quantity)
    const category = MAIN_CATEGORIES.find(
      (c) => c.productCategory === line.product.category
    )
    return {
      name: line.product.name,
      category: category?.name ?? line.product.category,
      subcategory: line.product.websiteCategory?.subcategory ?? null,
      quantity: line.quantity,
      unitPriceText: pricing.unitPriceText,
      lineSubtotalText: pricing.lineSubtotalText,
      calculable: pricing.calculable,
      productUrl: `${origin}/product/${line.product.slug}`,
    }
  })

  let whatsappUrl: string | null = null
  let quotationBuildFailed = false
  if (unresolvedCount === 0) {
    try {
      whatsappUrl = buildCartQuotationUrl(items, summary)
    } catch (error) {
      quotationBuildFailed = true
      if (import.meta.env.DEV) {
        console.error('CULTURAFT could not build the WhatsApp quotation URL.', error)
      }
    }
  }
  return (
    <div className="wrap pb-20 pt-8 lg:pb-28">
      <header className="max-w-2xl">
        <p className="eyebrow text-fog">Quotation Request</p>
        <h1 className="mt-2 text-h1 font-normal tracking-tight text-ink">
          Your Shopping Cart
        </h1>
        <p className="mt-4 text-lead text-charcoal">
          Review your selected furniture and request a quotation from CULTURAFT.
        </p>
      </header>

      {unresolvedCount > 0 && (
        <p className="mt-6 border-l-2 border-brand-primary bg-sand/50 px-4 py-3 text-sm text-charcoal" role="alert">
          {unresolvedCount} saved cart item{unresolvedCount === 1 ? ' is' : 's are'} no longer
          available in the catalogue. Clear the cart before requesting a complete quotation.
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-label="Cart items">
          <ul className="cart-list">
            {resolved.map((line) => (
              <CartItem
                key={line.product.id}
                product={line.product}
                quantity={line.quantity}
                onQuantityChange={(next) => setQuantity(line.product.id, next)}
                onRemove={() => removeItem(line.product.id)}
              />
            ))}
          </ul>
          <button
            type="button"
            onClick={clear}
            className="mt-6 text-sm text-charcoal underline underline-offset-4 hover:text-ink"
          >
            Clear cart
          </button>
        </section>

        <CartSummary summary={summary}>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent w-full"
            >
              <WhatsAppGlyph className="size-4" />
              Request Quotation on WhatsApp
            </a>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-accent w-full"
                disabled={!numberConfigured || unresolvedCount > 0 || quotationBuildFailed}
                onClick={() => setQuotationError('The quotation link could not be generated. Please review your cart and try again.')}
              >
                <WhatsAppGlyph className="size-4" />
                Request Quotation on WhatsApp
              </button>
              {!numberConfigured && (
                <p className="mt-3 text-xs text-charcoal" role="alert">
                  WhatsApp enquiries are unavailable because this deployment is
                  missing a valid <code>VITE_WHATSAPP_NUMBER</code>. Configure it
                  for Production in Vercel, then redeploy. Your cart is safe.
                </p>
              )}
              {quotationBuildFailed && (
                <p className="mt-3 text-xs text-charcoal" role="alert">
                  We couldn&apos;t generate this quotation link. Please review your
                  cart and try again.
                </p>
              )}
              {unresolvedCount > 0 && (
                <p className="mt-3 text-xs text-charcoal" role="alert">
                  The quotation is disabled until every cart item can be resolved.
                </p>
              )}
              {quotationError && (
                <p className="mt-3 text-xs text-charcoal" role="alert">
                  {quotationError}
                </p>
              )}
            </>
          )}
          <p className="mt-3 text-xs text-fog">
            This opens WhatsApp with your quotation prefilled. You review and send
            it yourself — nothing is sent automatically.
          </p>
        </CartSummary>
      </div>
    </div>
  )
}

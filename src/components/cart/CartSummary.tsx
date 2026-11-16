import type { ReactNode } from 'react'
import type { CartSummary as CartSummaryData } from '@/lib/cartPricing'

/**
 * Summary panel: counts, the known subtotal (or estimated total) and a plain
 * statement that unpriced products are excluded. The CTA is passed as children.
 */
export default function CartSummary({
  summary,
  children,
}: {
  summary: CartSummaryData
  children?: ReactNode
}) {
  const plural = (count: number) => (count === 1 ? '' : 's')

  return (
    <aside className="cart-summary" aria-label="Quotation summary">
      <h2 className="eyebrow text-fog">Quotation Summary</h2>

      <dl className="cart-summary__rows">
        <div>
          <dt>Items</dt>
          <dd>
            {summary.uniqueCount} product{plural(summary.uniqueCount)}
          </dd>
        </div>
        <div>
          <dt>Total Quantity</dt>
          <dd>{summary.totalQuantity}</dd>
        </div>
        <div className="cart-summary__total">
          <dt>{summary.totalLabel}</dt>
          <dd>{summary.knownSubtotalText}</dd>
        </div>
        {summary.onRequestCount > 0 && (
          <div>
            <dt>Price on Request</dt>
            <dd>
              {summary.onRequestCount} product type{plural(summary.onRequestCount)}
            </dd>
          </div>
        )}
      </dl>

      {summary.onRequestCount > 0 && (
        <p className="cart-summary__note">
          Final quotation may change after price confirmation for products marked
          Price on Request.
        </p>
      )}

      <div className="cart-summary__cta">{children}</div>
    </aside>
  )
}

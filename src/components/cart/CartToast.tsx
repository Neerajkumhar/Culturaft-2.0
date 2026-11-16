import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

/**
 * Non-intrusive confirmation for cart actions. The live region is always in the
 * DOM so screen readers announce each message as it appears.
 */
export default function CartToast() {
  const { toast, dismissToast } = useCart()

  return (
    <div className="cart-toast" role="status" aria-live="polite">
      {toast && (
        <div className="cart-toast__inner">
          <Check className="size-4 shrink-0 text-brand-primary" aria-hidden="true" />
          <span className="cart-toast__message">{toast.message}</span>
          {toast.productSlug && (
            <Link to="/cart" className="cart-toast__link" onClick={dismissToast}>
              View cart
            </Link>
          )}
          <button
            type="button"
            onClick={dismissToast}
            className="cart-toast__close"
            aria-label="Dismiss notification"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

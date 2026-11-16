import { Minus, Plus } from 'lucide-react'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/lib/cart'

/**
 * [ − ] n [ + ] quantity control. Keyboard operable with explicit labels;
 * the live value is announced politely.
 */
export default function QuantitySelector({
  value,
  onChange,
  label,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  /** Accessible group label, e.g. "Quantity for Aaranya Handwoven Rope Bench". */
  label: string
  min?: number
  max?: number
  size?: 'sm' | 'md'
}) {
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="qty__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

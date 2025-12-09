import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowRight, Lock, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate a brief load for smooth UI feel
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(stored)
    setLoading(false)
  }, [])

  const updateQty = (idx, newQty) => {
    if (newQty < 1) return
    const item = cart[idx]
    const stock = Number(item.stock || 0)
    if (stock > 0 && newQty > stock) {
      // cap to available stock
      newQty = stock
      // optional: inform user
      window.alert(`Only ${stock} remaining for ${item.title}. Quantity adjusted.`)
    }
    const copy = [...cart]
    copy[idx].qty = Number(newQty)
    setCart(copy)
    localStorage.setItem('cart', JSON.stringify(copy))
  }

  const remove = (idx) => {
    const copy = [...cart]
    copy.splice(idx, 1)
    setCart(copy)
    localStorage.setItem('cart', JSON.stringify(copy))
  }

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const shipping = subtotal > 150 ? 0 : 12.00 // Example logic: Free shipping over $150
  const sgstTotal = cart.reduce((s, i) => s + i.qty * i.price * (Number(i.sgst || 0) / 100), 0)
  const cgstTotal = cart.reduce((s, i) => s + i.qty * i.price * (Number(i.cgst || 0) / 100), 0)
  const totalTax = sgstTotal + cgstTotal
  const total = subtotal + shipping + totalTax

  if (loading) return <div className="min-h-screen bg-stone-50" />

  // --- Empty State ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-stone-500 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif text-stone-900 mb-2">Your collection is empty</h1>
        <p className="text-stone-500 mb-8 max-w-md">
          Looks like you haven't discovered any artifacts yet. Our artisans are crafting new pieces daily.
        </p>
        <Link to="/" className="px-8 py-3 bg-stone-900 text-white font-medium hover:bg-orange-800 transition-colors rounded-sm">
          Explore the Marketplace
        </Link>
      </div>
    )
  }

  // --- Populated Cart ---
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 font-sans text-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-stone-500 hover:text-stone-900 transition-colors w-fit">
          <ArrowLeft size={16} />
          <Link to="/" className="text-sm font-medium uppercase tracking-wide">Continue Shopping</Link>
        </div>

        <h1 className="text-4xl font-serif text-stone-900 mb-8">Shopping Bag <span className="text-stone-400 text-2xl font-sans">({cart.length} items)</span></h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Cart Items */}
          <div className="flex-1 space-y-6">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-6 bg-white p-6 rounded-lg border border-stone-200 shadow-sm relative group">
                
                {/* Image */}
                <div className="w-24 h-32 sm:w-32 sm:h-40 bg-stone-200 flex-shrink-0 rounded overflow-hidden">
                  <img 
                    src={item.images?.[0] || `https://picsum.photos/seed/${idx}/200/300`} 
                    alt={item.title} 
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif text-stone-900 leading-tight pr-8">
                        {item.title}
                      </h3>
                      <button 
                        onClick={() => remove(idx)} 
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">Artisan Collection</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                    {/* Custom Quantity Input */}
                    <div className="flex items-center border border-stone-300 rounded w-fit">
                      <button 
                        onClick={() => updateQty(idx, item.qty - 1)}
                        className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <div className="w-10 text-center text-sm font-medium select-none">{item.qty}</div>
                      <button 
                        onClick={() => updateQty(idx, item.qty + 1)}
                        className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
                        disabled={Number(item.stock || 0) > 0 ? item.qty >= Number(item.stock) : false}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-medium text-stone-900">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </div>
                      {item.qty > 1 && (
                        <div className="text-xs text-stone-400">
                          ₹{item.price.toFixed(2)} each
                        </div>
                      )}
                      {Number(item.stock || 0) <= 5 && Number(item.stock || 0) > 0 && (
                        <div className="text-xs text-orange-700 mt-1">Only {Number(item.stock)} remaining</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary (Sticky) */}
          <div className="lg:w-96">
            <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm sticky top-24">
              <h2 className="font-serif text-2xl text-stone-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm text-stone-600 border-b border-stone-100 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  {shipping === 0 ? (
                    <span className="text-orange-700 font-medium">Free</span>
                  ) : (
                    <span className="font-medium text-stone-900">₹{shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span className="font-medium text-stone-900">₹{sgstTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span className="font-medium text-stone-900">₹{cgstTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="py-6 flex justify-between items-center">
                <span className="text-lg font-serif text-stone-900">Total</span>
                <span className="text-2xl font-bold text-stone-900">₹{total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')} 
                className="w-full py-4 bg-stone-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-orange-900 transition-colors rounded-sm shadow-md group"
              >
                <Lock size={16} />
                Secure Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 text-xs text-center text-stone-400 space-y-2">
                <p>Every purchase supports independent artisans.</p>
                <div className="flex justify-center gap-2 opacity-50">
                  {/* Visual placeholders for payment icons */}
                  <div className="w-8 h-5 bg-stone-200 rounded"></div>
                  <div className="w-8 h-5 bg-stone-200 rounded"></div>
                  <div className="w-8 h-5 bg-stone-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
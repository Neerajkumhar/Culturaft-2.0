import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  Truck, 
  ArrowLeft, 
  Loader2, 
  CheckCircle 
} from 'lucide-react'
import API, { setToken } from '../lib/api'
import { ensureHttps, PLACEHOLDER_IMAGE } from '../lib/url'

export default function Checkout() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  })
  
  // Load cart on mount
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]')
    if (items.length === 0) {
      nav('/cart') // Redirect if empty
    }
    setCart(items)
  }, [nav])

  // Calculations
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0)
  const sgstTotal = cart.reduce((s, i) => s + i.qty * i.price * (Number(i.sgst || 0) / 100), 0)
  const cgstTotal = cart.reduce((s, i) => s + i.qty * i.price * (Number(i.cgst || 0) / 100), 0)
  const totalTax = sgstTotal + cgstTotal
  const shippingCost = subtotal > 150 ? 0 : 12.00
  const total = subtotal + shippingCost + totalTax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const purchase = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      alert('Please fill in all shipping information')
      return
    }
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
        alert('Please fill in all payment information')
        return
      }
    }
    
    setLoading(true)
    
    try {
      const items = cart.map(i => ({ product: i.product, qty: i.qty }))
      
      // Mask card number for security (keep last 4 digits)
      const cardNumberMasked = paymentMethod === 'card' ? formData.cardNumber.slice(-4) : null
      
      const orderData = {
        items,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentDetails: {
          method: paymentMethod,
          cardNumber: cardNumberMasked,
          expiry: paymentMethod === 'card' ? formData.expiry : null,
          cvc: paymentMethod === 'card' ? formData.cvc : null,
        },
        subtotal,
        shippingCost,
        sgstTotal,
        cgstTotal,
        totalTax,
        total,
      }
      
      const token = localStorage.getItem('token')
      if (token) setToken(token)
      
      await API.post('/orders', orderData)
      
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('storage')) // Update any listeners
      nav('/my-orders')
      
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 pb-20">
      
      {/* Header / Back Link */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm uppercase tracking-wide">
            <ArrowLeft size={16} /> Return to Bag
          </Link>
          <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-600" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COLUMN: Forms */}
          <div className="flex-1">
            <h1 className="font-serif text-3xl mb-8">Checkout Details</h1>
            
            <form id="checkout-form" onSubmit={purchase} className="space-y-8">
              
              {/* Shipping Section */}
              <section className="bg-white p-8 rounded-sm shadow-sm border border-stone-200">
                <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
                  <MapPin className="text-orange-800" size={20} />
                  <h2 className="font-serif text-xl">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">Full Name</label>
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Jane Doe" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Artisan Way" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Kyoto" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">Postal Code</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="10001" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none" />
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section className="bg-white p-8 rounded-sm shadow-sm border border-stone-200">
                <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
                  <CreditCard className="text-orange-800" size={20} />
                  <h2 className="font-serif text-xl">Payment Method</h2>
                </div>
                
                {/* Mock Payment Tabs */}
                <div className="flex gap-4 mb-6">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 border-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 text-stone-400 hover:bg-stone-50'}`}>
                    <CreditCard size={16} /> Card
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-3 border-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${paymentMethod === 'paypal' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 text-stone-400 hover:bg-stone-50'}`}>
                    PayPal
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">Card Number</label>
                      <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">Expiry</label>
                        <input required type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM/YY" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wide text-stone-500 mb-1">CVC</label>
                        <input required type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="123" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-sm focus:ring-1 focus:ring-stone-900 outline-none font-mono" />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-sm text-center text-sm text-blue-700">
                    You will be redirected to PayPal to complete your payment
                  </div>
                )}
              </section>
            </form>
          </div>

          {/* RIGHT COLUMN: Summary (Sticky) */}
          <div className="lg:w-96">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-200 sticky top-24">
              <h3 className="font-serif text-xl mb-6">Order Summary</h3>
              
              {/* Mini Item List */}
              <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-stone-200 rounded-sm overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img src={ensureHttps(item.images[0]) || PLACEHOLDER_IMAGE} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }} className="w-full h-full object-cover" alt="" />
                      ) : (
                         <div className="w-full h-full bg-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-stone-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-stone-500">Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-medium text-stone-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-stone-100 pt-4 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span>₹{sgstTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span>₹{cgstTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-serif text-xl text-stone-900 pt-4 border-t border-stone-100 mt-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                form="checkout-form"
                disabled={loading}
                className="w-full mt-8 bg-stone-900 text-white py-4 font-medium tracking-wide hover:bg-orange-900 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} /> Place Order
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
                <Truck size={12} />
                <span>Orders usually ship within 24 hours</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
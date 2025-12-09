import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Minus, 
  Plus, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  Star,
  ChevronDown,
  ArrowLeft
} from 'lucide-react'
import API from '../lib/api'
import { ensureHttps, PLACEHOLDER_IMAGE } from '../lib/url'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('desc') // desc, details, shipping

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setLoading(true)
      API.get(`/products/${id}`)
        .then(r => {
          setProduct(r.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [id])

  // Adjust quantity based on stock when product loads/changes
  useEffect(() => {
    if (!product) return
    const stock = Number(product.stock || 0)
    if (stock <= 0) {
      setQty(0)
    } else if (qty <= 0) {
      setQty(1)
    } else if (qty > stock) {
      setQty(stock)
    }
  }, [product])

  const addToCart = () => {
    const stock = Number(product.stock || 0)
    if (stock <= 0) {
      window.alert('Sorry, this product is out of stock and cannot be ordered.')
      return
    }
    if (qty > stock) {
      // enforce safety
      setQty(stock)
      window.alert(`Only ${stock} remaining. Quantity adjusted to available stock.`)
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(i => i.product === product._id)
    
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, stock)
    } else {
      cart.push({ 
        product: product._id, 
        title: product.title, 
        price: product.price, 
        images: product.images, // Storing image for cart UI
        qty,
        stock: stock,
        sgst: Number(product.sgst || 0),
        cgst: Number(product.cgst || 0),
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    // Optional: Dispatch event to update navbar cart count immediately
    window.dispatchEvent(new Event('storage')) 
    nav('/cart')
  }

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-stone-200 rounded-full mb-4"></div>
        <div className="font-serif text-stone-400">Unwrapping artifact...</div>
      </div>
    </div>
  )

  if (!product) return <div className="text-center py-20">Product not found.</div>

  // Image fallback logic
  const images = product.images && product.images.length > 0 
    ? product.images.map(ensureHttps)
    : [`https://picsum.photos/seed/${product._id}/800/800`, `https://picsum.photos/seed/${product._id}extra/800/800`]

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 pb-20">
      
      {/* Breadcrumb / Back Navigation */}
      <div className="container mx-auto px-6 py-6">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm uppercase tracking-wide"
        >
          <ArrowLeft size={16} /> Back to Gallery
        </button>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:w-1/2 space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-stone-200 w-full relative overflow-hidden group rounded-sm shadow-sm">
              <img 
                src={images[activeImg] || PLACEHOLDER_IMAGE} 
                alt={product.title} 
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-900">
                Handmade
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`w-20 h-24 flex-shrink-0 border transition-all ${activeImg === idx ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img || PLACEHOLDER_IMAGE} alt="" onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE }} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Narrative */}
          <div className="lg:w-1/2 flex flex-col">
            
            {/* Header Info */}
            <div className="border-b border-stone-200 pb-6 mb-8">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-orange-800 font-medium uppercase tracking-widest">
                  {product.category || 'Artisan Collection'}
                </div>
                <div className="flex gap-4 text-stone-400">
                  <button className="hover:text-red-600 transition-colors"><Heart size={20} /></button>
                  <button className="hover:text-blue-600 transition-colors"><Share2 size={20} /></button>
                </div>
              </div>
              
              <h1 className="font-serif text-4xl lg:text-5xl text-stone-900 leading-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-500 text-sm">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs text-stone-400 uppercase tracking-wide">24 Reviews</span>
                <span className="text-stone-300">|</span>
                <span className="text-xs text-stone-500">Origin: <strong>{product.origin || 'Kyoto, Japan'}</strong></span>
              </div>

              <div className="text-3xl font-serif text-stone-900">
                ₹{product.price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-stone mb-8">
              <p className="text-stone-600 leading-relaxed">
                {product.description || "Every curve of this piece tells a story of tradition. Handcrafted using age-old techniques, this artifact brings a touch of cultural heritage into your modern space. Because it is handmade, slight variations in texture and color are natural, making your piece truly one-of-a-kind."}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-6">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 w-fit">
                  <button 
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    className="p-3 hover:bg-stone-100 text-stone-600 transition-colors"
                    disabled={Number(product.stock || 0) <= 0 || qty <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="w-12 text-center font-medium">{qty}</div>
                  <button 
                    onClick={() => setQty(prev => {
                      const stock = Number(product.stock || 0)
                      if (stock <= 0) return 0
                      return Math.min(stock, prev + 1)
                    })}
                    className="p-3 hover:bg-stone-100 text-stone-600 transition-colors"
                    disabled={Number(product.stock || 0) <= 0 || qty >= Number(product.stock || 0)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button 
                  onClick={addToCart}
                  className={`flex-1 h-[50px] flex items-center justify-center gap-2 font-medium tracking-wide transition-all shadow-lg ${Number(product.stock || 0) > 0 ? 'bg-stone-900 text-white hover:bg-orange-900' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                  disabled={Number(product.stock || 0) <= 0}
                >
                  <ShoppingBag size={18} /> {Number(product.stock || 0) > 0 ? 'Add to Collection' : 'Out of stock'}
                </button>
              </div>

              {/* Stock hint */}
              <div className="text-sm text-stone-500">
                {Number(product.stock || 0) <= 0 && (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
                {Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5 && (
                  <span className="text-orange-700 font-medium">Only {Number(product.stock)} remaining</span>
                )}
              </div>

              {/* Trust Signals */}
              <div className="flex gap-6 text-xs text-stone-500 pt-4">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-stone-400" /> Free Global Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-stone-400" /> Authenticity Guaranteed
                </div>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="border-t border-stone-200">
              <AccordionItem title="The Artisan's Story" isOpen={activeTab === 'desc'} onClick={() => setActiveTab(activeTab === 'desc' ? '' : 'desc')}>
                <p>{product.artisanStory || 'Created by master artisan Koji Tanaka in his family-owned kiln. Koji focuses on the philosophy of Wabi-Sabi, finding beauty in imperfection. 80% of this purchase goes directly to supporting his workshop.'}</p>
              </AccordionItem>
              <AccordionItem title="Materials & Care" isOpen={activeTab === 'details'} onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}>
                {product.materialsCare ? (
                  <p>{product.materialsCare}</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    <li>Locally sourced organic clay</li>
                    <li>Natural glaze derived from wood ash</li>
                    <li>Hand wash only with mild soap</li>
                    <li>Avoid sudden temperature changes</li>
                  </ul>
                )}
              </AccordionItem>
              <AccordionItem title="Shipping & Returns" isOpen={activeTab === 'shipping'} onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}>
                <p>{product.shippingReturns || 'Ships within 3-5 business days in sustainable, plastic-free packaging. We accept returns within 30 days if the item arrives damaged or does not meet your expectations.'}</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related products removed: this was placeholder/dummy data */}
      </div>
    </div>
  )
}

// Sub-component for Accordion
function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-stone-200">
      <button 
        onClick={onClick}
        className="w-full py-4 flex justify-between items-center text-left hover:text-orange-800 transition-colors"
      >
        <span className="font-serif text-lg text-stone-900">{title}</span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <div className="text-stone-600 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  )
} 
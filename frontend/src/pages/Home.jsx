import React, { useEffect, useState } from 'react'
import { ArrowRight, Star, Heart, ShoppingBag, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../lib/api'
// Assuming ProductCard is available, but I will provide a custom styled one below for the "vibe"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/products')
      .then(res => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Mock data for UI demonstration
  const categories = [
    { id: 'decor', title: 'Home Decor', subtitle: 'Hand-carved aesthetics', img: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800' },
    { id: 'apparel', title: 'Textiles', subtitle: 'Organic woven fabrics', img: 'https://images.unsplash.com/photo-1520013573739-1b8495bc99dd?auto=format&fit=crop&q=80&w=800' },
    { id: 'pottery', title: 'Ceramics', subtitle: 'Clay & Kiln fired', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800' },
    { id: 'art', title: 'Artifacts', subtitle: 'Cultural heritage', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800' },
  ]

  const featured = products?.find(p => p.featured) || products?.[0]
  const topSelling = products.slice(0, 4) // Show 4 for a balanced grid

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600 font-serif animate-pulse">Curating collections...</div>

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 font-sans selection:bg-orange-200">
      
      {/* Hero Section: Immersive & Narrative */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src="/img/hero.png" 
          alt="Artisan working" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.25)' }} />
        
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-start">
          <span className="text-orange-200 tracking-[0.2em] uppercase text-sm mb-4 font-medium">Authentic & Handmade</span>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-50 font-medium leading-tight mb-6 max-w-2xl">
            Bring the soul of <br/> <span className="italic text-orange-100">culture</span> into your home.
          </h2>
          <p className="text-stone-200 text-lg md:text-xl max-w-lg mb-8 font-light">
            Discover a curated marketplace of one-of-a-kind pieces directly from master artisans around the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#shop" className="px-8 py-4 bg-orange-800 hover:bg-orange-700 text-white transition-all duration-300 font-medium tracking-wide">
              Shop Collections
            </a>
            <a href="#artisans" className="px-8 py-4 border border-stone-300 text-stone-100 hover:bg-white hover:text-stone-900 transition-all duration-300">
              Meet the Makers
            </a>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-2 bg-gradient-to-r from-orange-800 via-yellow-700 to-orange-800 w-full"></div>

      {/* Categories: Magazine Style */}
      <section id="categories" className="py-20 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h3 className="font-serif text-4xl text-stone-900 mb-3">Curated Categories</h3>
          <div className="w-24 h-1 bg-orange-800 mx-auto opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="group relative h-96 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-all z-10" />
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.25)' }} />
              <img 
                src={cat.img} 
                alt={cat.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h4 className="text-2xl font-serif italic">{cat.title}</h4>
                <p className="text-stone-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100 uppercase tracking-widest mt-1">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Story: Asymmetrical Layout */}
      {featured && (
        <section className="py-20 bg-stone-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 relative">
                 {/* Decorative background block */}
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-orange-800/30 hidden md:block"></div>
                <div className="relative aspect-[4/5] bg-stone-200 overflow-hidden shadow-xl">
                  {featured.images?.[0] 
                    ? <>
                      <img src={featured.images[0]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.25)' }} />
                    </>
                    : <>
                      <img src="https://images.unsplash.com/photo-1590735213920-68192a487c63?auto=format&fit=crop&q=80&w=800" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(28, 25, 23, 0.25)' }} />
                    </>
                  }
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 text-orange-700 font-bold uppercase tracking-widest text-xs">
                  <Star size={16} fill="currentColor" /> Editor's Pick
                </div>
                <h3 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
                  {featured.title}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed border-l-4 border-orange-800/20 pl-6 italic">
                  "{featured.description}"
                </p>
                
                <div className="py-6 flex items-center gap-8">
                  <div>
                    <span className="block text-sm text-stone-500 uppercase tracking-wide">Price</span>
                    <span className="text-3xl font-serif text-stone-900">₹{featured.price?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-stone-500 uppercase tracking-wide">Origin</span>
                    <span className="text-xl font-serif text-stone-900">{featured.origin || 'Unknown'}</span>
                  </div>
                </div>

                <a href={`/products/${featured._id}`} className="inline-flex items-center gap-3 px-8 py-3 bg-stone-900 text-white hover:bg-stone-800 transition-colors">
                  View Masterpiece <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Selling Grid */}
      <section id="shop" className="py-24 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-stone-900">Weekly Bestsellers</h3>
            <p className="text-stone-500 mt-2">Pieces loved by collectors worldwide</p>
          </div>
          <a href="/shop" className="hidden md:flex items-center gap-2 text-orange-800 font-medium hover:gap-4 transition-all">
            View All <ArrowRight size={18} />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {topSelling.map(p => (
            <CulturalProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Artisans: Circular & Patterned */}
      <section id="artisans" className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="font-serif text-4xl mb-4">Trending Artisans</h3>
            <p className="text-stone-400 font-light">
              We empower creators by cutting out the middleman. 80% of your purchase goes directly to the hands that made it.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map((n)=> (
              <div key={n} className="group text-center">
                <div className="relative mx-auto w-32 h-32 mb-6">
                  <div className="absolute inset-0 rounded-full border border-orange-500/30 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                  <img 
                    src={`https://i.pravatar.cc/300?img=${20+n}`} 
                    alt="artisan" 
                    className="w-full h-full rounded-full object-cover border-4 border-stone-800" 
                  />
                </div>
                <div className="font-serif text-xl mb-1">Elara Vance</div>
                <div className="text-xs text-orange-400 uppercase tracking-widest">Ceramist • Peru</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials: Clean Typography */}
      <section className="py-24 px-6 container mx-auto">
        <h3 className="font-serif text-3xl text-center mb-16">Voices of the Community</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sofia M.', text: 'The texture of the fabric is unlike anything I have bought in a store. You can feel the history.', loc: 'New York' },
            { name: 'Liam D.', text: 'Finally, a marketplace that respects the maker. The packaging was beautiful and sustainable.', loc: 'London' },
            { name: 'Aisha K.', text: 'A truly unique piece that has become the centerpiece of my living room. Fast shipping too.', loc: 'Toronto' }
          ].map(t => (
            <div key={t.name} className="bg-white p-8 border border-stone-200 hover:shadow-lg transition-shadow duration-300">
              <div className="text-orange-800 mb-4">★★★★★</div>
              <p className="text-stone-600 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center font-serif font-bold text-stone-500">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-stone-900">{t.name}</div>
                  <div className="text-xs text-stone-400 uppercase">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter: Earthy & Direct */}
      <section className="py-20 bg-orange-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <Mail className="mx-auto w-10 h-10 mb-4 opacity-80" />
          <h4 className="text-3xl font-serif mb-4">Join the Culturaft Collective</h4>
          <p className="text-orange-100 mb-8 max-w-md mx-auto">
            Receive stories from artisans, early access to new collections, and a 10% welcome code.
          </p>
          <form onSubmit={(e)=>{ e.preventDefault(); alert('Subscribed!') }} className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto gap-0">
            <input 
              type="email" 
              required 
              placeholder="Enter your email address" 
              className="px-6 py-4 w-full text-stone-900 outline-none bg-orange-50 focus:bg-white transition-colors" 
            />
            <button className="px-8 py-4 bg-stone-900 hover:bg-black text-white font-medium tracking-wide transition-colors whitespace-nowrap">
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

// ------------------------------------------------------------------
// Sub-Component: A styling wrapper for Product Cards to match the vibe
// ------------------------------------------------------------------
function CulturalProductCard({ product }) {
  // Fallbacks for data
  const img = product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/500`
  const title = product.title || "Handmade Artifact"
  const price = product.price || 45.00
  const artisan = product.artisan || "Local Artisan"

  return (
    <Link to={`/products/${product._id}`} className="group flex flex-col">
      <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-stone-200">
        <img 
          src={img} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Quick Actions Overlay */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2 bg-white text-stone-900 hover:bg-orange-800 hover:text-white rounded-full shadow-md transition-colors">
            <Heart size={18} />
          </button>
          <button className="p-2 bg-white text-stone-900 hover:bg-orange-800 hover:text-white rounded-full shadow-md transition-colors delay-75">
            <ShoppingBag size={18} />
          </button>
        </div>
        {/* 'Handmade' tag */}
        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-800 backdrop-blur-sm">
          Handmade
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-xs text-stone-500 uppercase tracking-wide">By {artisan}</div>
        <h4 className="font-serif text-lg text-stone-900 leading-tight group-hover:text-orange-800 transition-colors">
          {title}
        </h4>
        <div className="font-medium text-stone-900 mt-1">₹{price.toFixed(2)}</div>
      </div>
    </Link>
  )
}
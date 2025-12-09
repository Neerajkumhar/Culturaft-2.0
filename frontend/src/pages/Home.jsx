import React, { useEffect, useState } from 'react'
import { ArrowRight, Star, Heart, ShoppingBag, Mail, ArrowDown, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../lib/api'
import { ensureHttps, PLACEHOLDER_IMAGE } from '../lib/url'

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

  // Mock data 
  const categories = [
    { id: 'decor', title: 'Decor', subtitle: 'Hand-carved aesthetics', img: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=800' },
    { id: 'apparel', title: 'Textiles', subtitle: 'Organic woven fabrics', img: 'https://images.unsplash.com/photo-1520013573739-1b8495bc99dd?auto=format&fit=crop&q=80&w=800' },
    { id: 'pottery', title: 'Ceramics', subtitle: 'Clay & Kiln fired', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800' },
    { id: 'art', title: 'Artifacts', subtitle: 'Cultural heritage', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=800' },
  ]

  const featured = products?.find(p => p.featured) || products?.[0]
  const topSelling = products.slice(0, 4)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-600 font-serif animate-pulse">Curating collections...</div>

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 font-sans selection:bg-orange-200">
      
      {/* 1. HERO: Editorial Split Layout */}
      <header className="relative min-h-[90vh] flex flex-col justify-center pt-20 px-6 border-b border-stone-200">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pb-12 lg:pb-0">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-orange-800"></span>
              <span className="text-orange-800 uppercase tracking-widest text-xs font-bold">Est. 2024</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] mb-8 text-stone-900">
              The Soul <br/>
              <span className="italic text-stone-500">of</span> Culture.
            </h1>
            <p className="text-lg text-stone-600 font-light leading-relaxed max-w-md mb-10 border-l border-stone-300 pl-6">
              A digital gallery of master craftsmanship. We bridge the gap between ancient heritage and your modern living space.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <a href="#shop" className="group flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50 w-full sm:w-auto hover:bg-orange-900 transition-colors">
                <span className="uppercase tracking-widest text-sm">Explore Gallery</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>

          {/* Image Content */}
          <div className="lg:col-span-7 h-[50vh] lg:h-[80vh] relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-stone-200">
               <img 
                 src="https://drapedinheritage.com/cdn/shop/articles/DALL_E_2025-02-18_15.27.40_-_A_vibrant_scene_depicting_the_traditional_art_of_hand_block_printing_in_Rajasthan._The_image_shows_skilled_artisans_working_with_intricately_carved_wo.webp?v=1739910741&width=1100" 
                 alt="Hero" 
                 className="w-full h-full object-cover" 
                 width={1600}
                 height={900}
                 loading="eager"
                 decoding="async"
                 onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&q=80&w=2000"}
               />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-orange-50 p-6 max-w-xs shadow-xl hidden md:block border border-stone-100">
              <p className="font-serif text-lg italic text-stone-800">"Preserving history, one artifact at a time."</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ArrowDown size={14} />
        </div>
      </header>

      {/* 2. CATEGORIES: Asymmetrical Grid (Bento Box) */}
      <section className="py-24 px-6 container mx-auto border-b border-stone-200">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-serif">Curated Departments</h2>
          <a href="/shop" className="text-sm uppercase tracking-widest border-b border-stone-900 pb-1 hover:text-orange-800 hover:border-orange-800 transition-colors">View Full Catalog</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {/* Large Item */}
          <Link to="/shop?cat=decor" className="relative h-[600px] md:col-span-2 bg-stone-100 group overflow-hidden">
            <img src={categories[0].img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-8 left-8 bg-white px-6 py-4">
               <h3 className="font-serif text-2xl">{categories[0].title}</h3>
               <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">{categories[0].subtitle}</p>
            </div>
          </Link>

          {/* Stacked Items */}
          <div className="flex flex-col gap-1 h-[600px]">
             {categories.slice(1,3).map(cat => (
               <Link to={`/shop?cat=${cat.id}`} key={cat.id} className="relative flex-1 bg-stone-100 group overflow-hidden">
                 <img src={cat.img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                 <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                 <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
                    <h3 className="font-serif text-xl">{cat.title}</h3>
                 </div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED: Minimalist Exhibit */}
      {featured && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 order-2 md:order-1 space-y-8">
                <div className="flex items-center gap-4 text-orange-800">
                  <Star size={18} fill="currentColor" />
                  <span className="text-sm font-bold uppercase tracking-widest">Curator's Choice</span>
                </div>
                
                <h2 className="text-5xl lg:text-6xl font-serif leading-tight text-stone-900">
                  {featured.title}
                </h2>
                
                <div className="h-px w-24 bg-stone-300"></div>

                <p className="text-xl text-stone-600 font-light leading-relaxed">
                  {featured.description}
                </p>

                <div className="flex items-center justify-between pt-4 max-w-sm">
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Origin</span>
                    <span className="font-serif text-lg">{featured.origin || 'Kyoto, Japan'}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-stone-400 mb-1">Value</span>
                    <span className="font-serif text-lg">₹{featured.price?.toFixed(2)}</span>
                  </div>
                </div>

                <a href={`/products/${featured._id}`} className="inline-block mt-4 px-10 py-4 border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold">
                  View Details
                </a>
              </div>

              <div className="md:w-1/2 order-1 md:order-2">
                <div className="relative aspect-[4/5]">
                  <div className="absolute top-4 -right-4 w-full h-full border border-stone-200 z-0 hidden md:block"></div>
                  <img 
                    src={featured.images?.[0] || "https://images.unsplash.com/photo-1590735213920-68192a487c63?auto=format&fit=crop&q=80&w=800"} 
                    alt="Featured" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover relative z-10 shadow-2xl" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SHOP: Clean Grid */}
      <section id="shop" className="py-24 px-6 container mx-auto bg-stone-50 border-t border-stone-200">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-serif mb-4">The Collection</h2>
          <p className="text-stone-500 font-light">
            Each piece is selected for its integrity, beauty, and the story it carries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
          {topSelling.map(p => (
            <MinimalProductCard key={p._id} product={p} />
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link to="/shop" className="inline-flex items-center gap-3 text-stone-500 hover:text-orange-800 transition-colors pb-1 border-b border-transparent hover:border-orange-800">
            <span className="uppercase tracking-widest text-xs">View Entire Archive</span>
            <MoveRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. ARTISANS: Portraits (Replaced Circles) */}
      <section id="artisans" className="py-24 bg-white text-stone-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            {/* Title Block */}
            <div className="lg:pr-12">
              <h2 className="text-5xl font-serif mb-6 leading-tight">Meet the <br/> <span className="text-orange-800 italic">Hands.</span></h2>
              <p className="text-stone-600 mb-8 font-light leading-relaxed">
                We believe the soul of an object comes from the person who made it. Get to know the masters behind the masterpieces.
              </p>
              <Link to="/artisans" className="px-8 py-3 bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors uppercase tracking-widest text-xs font-bold">
                Read Their Stories
              </Link>
            </div>

            {/* Portraits */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="group relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img 
                    src={`https://i.pravatar.cc/400?img=${30+n}`} 
                    alt="Artisan" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-stone-100 font-serif text-xl">Elena V.</p>
                    <p className="text-orange-200 text-xs uppercase tracking-widest">Master Weaver</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER: Minimal Line Art */}
      <section className="py-24 px-6 border-t border-stone-200 bg-stone-50">
        <div className="container mx-auto max-w-4xl border border-stone-300 p-12 lg:p-20 text-center bg-white relative">
           {/* Decorative Corners */}
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-800"></div>
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-800"></div>
           
           <Mail className="mx-auto w-8 h-8 text-orange-800 mb-6" />
           <h2 className="text-3xl font-serif text-stone-900 mb-4">Join the Inner Circle</h2>
           <p className="text-stone-500 mb-8 font-light">Exclusive access to new acquisitions and artisan stories.</p>
           
           <form onSubmit={(e)=>{ e.preventDefault(); alert('Subscribed!') }} className="flex flex-col sm:flex-row max-w-md mx-auto border-b border-stone-300">
             <input 
               type="email" 
               placeholder="email@address.com" 
               className="flex-1 py-3 bg-transparent outline-none text-stone-900 placeholder:text-stone-300"
             />
             <button className="py-3 text-stone-900 font-bold uppercase tracking-widest text-xs hover:text-orange-800 transition-colors">
               Subscribe
             </button>
           </form>
        </div>
      </section>

    </div>
  )
}

// ------------------------------------------------------------------
// Sub-Component: Minimal Product Card
// ------------------------------------------------------------------
function MinimalProductCard({ product }) {
  const img = ensureHttps(product.images?.[0]) || `https://picsum.photos/seed/${product._id}/400/500`

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-6">
        <img 
          src={img} 
          alt={product.title} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
        />
        {/* Minimal Hover Overlay */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
           <span className="bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest">View Object</span>
        </div>
      </div>

      <div className="text-center">
        <h4 className="font-serif text-xl text-stone-900 mb-1 group-hover:text-orange-800 transition-colors">
          {product.title}
        </h4>
        <div className="flex justify-center gap-3 text-sm text-stone-500 font-light">
          <span>{product.category || 'Artifact'}</span>
          <span>•</span>
          <span>₹{product.price?.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  )
}
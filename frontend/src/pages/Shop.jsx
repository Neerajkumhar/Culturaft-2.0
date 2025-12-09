import React, { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X, Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import API from '../lib/api'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filter States
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [maxPrice, setMaxPrice] = useState(1000)

  // Categories matching backend
  const categories = ['All', 'Textiles', 'Pottery', 'Jewelry', 'Home Decor', 'Clothing', 'Accessories', 'Art', 'Crafts']

  useEffect(() => {
    API.get('/products')
      .then(res => {
        console.log('Products fetched successfully:', res.data)
        setProducts(res.data)
        // Determine dynamic max price so products with high price still show
        try {
          const prices = res.data.map(p => Number(p.price) || 0)
          const mx = Math.max(...prices, 1000)
          setMaxPrice(mx)
          setPriceRange([0, mx])
        } catch (e) {
          setMaxPrice(1000)
          setPriceRange([0, 1000])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err.response?.data || err.message)
        setLoading(false)
      })
  }, [])

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // 1. Search
    if (search) {
      result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    }

    // 2. Category
    if (category !== 'All') {
      // Assuming your product model has a 'category' string field. 
      // If not, this filter might need adjustment based on your data structure.
      result = result.filter(p => p.category === category || p.category?.title === category)
    }

    // 3. Price (coerce price to number to avoid string comparison issues)
    result = result.filter(p => {
      const pPrice = Number(p.price) || 0
      return pPrice >= priceRange[0] && pPrice <= priceRange[1]
    })

    // 4. Sort
    switch (sort) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price)
      case 'price-desc': return result.sort((a, b) => b.price - a.price)
      case 'newest': default: return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }, [products, search, category, sort, priceRange])

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-500">Curating the collection...</div>

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* Page Header */}
      <div className="bg-stone-900 text-stone-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">The Collection</h1>
          <p className="text-stone-400 max-w-2xl mx-auto font-light">
            Explore our carefully curated selection of handmade goods, directly from the workshops of master artisans.
          </p>
        </div>
      </div>

      {/* Toolbar (Search & Mobile Filter Toggle) */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-6 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for artifacts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 outline-none transition-all placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button 
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 text-stone-600 font-medium"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-stone-500 text-sm">Sort by:</span>
              <div className="relative group">
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent font-medium text-stone-900 pr-8 cursor-pointer focus:outline-none"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className={`md:w-64 flex-shrink-0 space-y-8 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          
          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-stone-200 pb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => setCategory(cat)}
                    className={`text-sm transition-colors ${category === cat ? 'text-orange-700 font-bold translate-x-1' : 'text-stone-600 hover:text-stone-900'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-stone-200 pb-2">Price Range</h3>
            <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
              <span>₹{priceRange[0]}</span>
              <span className="text-stone-300">—</span>
              <span>₹{priceRange[1]}+</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={maxPrice} 
              step="50"
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-stone-900 cursor-pointer" 
            />
          </div>

          {/* Active Filters Clear */}
          {(category !== 'All' || search || priceRange[1] < 1000) && (
            <button 
              onClick={() => { setCategory('All'); setSearch(''); setPriceRange([0, 1000]) }}
              className="text-xs uppercase tracking-wide text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <X size={14} /> Clear all filters
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-6 text-stone-500 text-sm">
            Showing {filteredProducts.length} artifacts
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white border border-stone-200 rounded">
              <h3 className="font-serif text-xl text-stone-900 mb-2">No artifacts found</h3>
              <p className="text-stone-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map(product => (
                <ShopProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// ------------------------------------------
// Sub-Component: Product Card for Shop Grid
// ------------------------------------------
function ShopProductCard({ product }) {
  const img = product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/500`
  const price = (typeof product.price === 'number') ? product.price : Number(product.price) || 0
  
  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden mb-4 aspect-[3/4] bg-stone-200">
        <Link to={`/products/${product._id}`}>
          <img 
            src={img} 
            alt={product.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        </Link>
        
        {/* Hover Actions */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2 bg-white text-stone-900 hover:bg-orange-800 hover:text-white rounded-full shadow-md transition-colors" title="Add to Wishlist">
            <Heart size={18} />
          </button>
          <Link to={`/products/${product._id}`} className="p-2 bg-white text-stone-900 hover:bg-orange-800 hover:text-white rounded-full shadow-md transition-colors delay-75" title="View Product">
            <ShoppingBag size={18} />
          </Link>
        </div>

        {/* Badges removed: Premium tag hidden */}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product._id}`}>
            <h4 className="font-serif text-lg text-stone-900 leading-tight group-hover:text-orange-800 transition-colors cursor-pointer">
              {product.title || 'Untitled Artifact'}
            </h4>
          </Link>
          <span className="font-medium text-stone-900">₹{price.toFixed(2)}</span>
        </div>
        <div className="text-xs text-stone-500 uppercase tracking-wide">
          {product.category || 'Artisan Collection'}
        </div>
      </div>
    </div>
  )
}
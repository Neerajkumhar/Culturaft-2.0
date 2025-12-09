import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react'
import { RequireAuth, RequireAdmin } from './lib/requireAuth'
import { getUserFromToken, logout as doLogout } from './lib/auth'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Artisans from './pages/Artisans' // <--- IMPORT ADDED
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import LoginUser from './pages/LoginUser'
import AdminDashboard from './pages/AdminDashboard'
import Register from './pages/Register'

function App() {
  const [user, setUser] = useState(() => getUserFromToken())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onAuth = () => setUser(getUserFromToken())
    window.addEventListener('authChange', onAuth)
    return () => window.removeEventListener('authChange', onAuth)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-800">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold tracking-wider text-stone-900 flex items-center gap-2">
            Culturaft<span className="text-orange-600 text-4xl leading-none">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-stone-600 hover:text-orange-800 font-medium transition-colors text-sm uppercase tracking-wide">Home</Link>
            <Link to="/shop" className="text-stone-600 hover:text-orange-800 font-medium transition-colors text-sm uppercase tracking-wide">Shop</Link>
            {/* UPDATED LINK: Points to /artisans instead of /#artisans */}
            <Link to="/artisans" className="text-stone-600 hover:text-orange-800 font-medium transition-colors text-sm uppercase tracking-wide">Artisans</Link>
          </div>

          {/* Icons / Actions */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" title="Admin Dashboard" className="text-stone-600 hover:text-orange-800 transition-colors">
                    <ShieldCheck size={20} />
                  </Link>
                )}
                
                <Link to="/my-orders" title="My Orders" className="text-stone-600 hover:text-orange-800 transition-colors">
                  <User size={20} />
                </Link>
                
                <Link to="/cart" className="relative text-stone-600 hover:text-orange-800 transition-colors">
                  <ShoppingBag size={20} />
                </Link>

                <div className="h-6 w-px bg-stone-300 mx-2"></div>

                <button 
                  onClick={() => { doLogout(); setUser(null) }} 
                  className="flex items-center gap-2 text-stone-500 hover:text-red-700 transition-colors text-sm font-medium"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                 <Link to="/login" className="text-stone-900 font-medium hover:text-orange-800 transition-colors">
                   Sign In
                 </Link>
                 <Link to="/register" className="px-5 py-2 bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-orange-800 transition-colors">
                   Join
                 </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-stone-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            <Link to="/" className="text-lg font-serif text-stone-800">Home</Link>
            <Link to="/shop" className="text-lg font-serif text-stone-800">Shop Collection</Link>
            <Link to="/artisans" className="text-lg font-serif text-stone-800">Our Artisans</Link>
            {user && (
              <>
                <Link to="/cart" className="text-lg font-serif text-stone-800">My Cart</Link>
                <Link to="/my-orders" className="text-lg font-serif text-stone-800">My Orders</Link>
                {user.role === 'admin' && <Link to="/admin/dashboard" className="text-lg font-serif text-stone-800 text-orange-700">Admin Dashboard</Link>}
                <button onClick={() => { doLogout(); setUser(null) }} className="text-left text-red-600 font-medium pt-2 border-t">Sign Out</button>
              </>
            )}
            {!user && (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/login" className="text-center py-2 border border-stone-300 rounded text-stone-800">Log In</Link>
                <Link to="/register" className="text-center py-2 bg-stone-900 text-white rounded">Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/artisans" element={<Artisans />} /> {/* <--- NEW ROUTE */}
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Public Auth */}
          <Route path="/login" element={<LoginUser />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-serif text-2xl text-stone-100 mb-4">Culturaft.</h4>
            <p className="max-w-sm font-light">
              Connecting discerning collectors with master artisans. 
              Every purchase supports the preservation of traditional crafts.
            </p>
          </div>
          <div>
            <h5 className="text-stone-100 font-medium mb-4 uppercase tracking-widest text-xs">Shop</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-orange-400 transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-orange-400 transition-colors">Best Sellers</Link></li>
              <li><Link to="/artisans" className="hover:text-orange-400 transition-colors">Artisans</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-stone-100 font-medium mb-4 uppercase tracking-widest text-xs">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-stone-800 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Culturaft Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
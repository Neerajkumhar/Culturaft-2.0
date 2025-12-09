import React, { useState } from 'react'
import API, { setToken } from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

export default function LoginUser() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Simulate a minimum loading time for UI smoothness
    const minLoad = new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      const [res] = await Promise.all([
        API.post('/auth/user/login', { email, password }),
        minLoad
      ])
      
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      window.dispatchEvent(new Event('authChange'))
      
      if (res.data.user.role === 'admin') {
        nav('/admin/dashboard')
      } else {
        nav('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans text-stone-800">
      
      {/* Left Side: Brand Imagery (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-stone-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=2449&auto=format&fit=crop" 
          alt="Artisan Workshop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full text-stone-100">
          <div className="font-serif text-3xl font-bold tracking-wider">Culturaft.</div>
          <div className="max-w-md">
            <p className="font-serif text-3xl italic leading-relaxed mb-4">
              "We don't just sell objects. We curate stories, traditions, and the human touch."
            </p>
            <p className="text-sm uppercase tracking-widest opacity-70">
              — The Artisan RamRakh Jaat
            </p>
          </div>
          <div className="text-xs opacity-50">
            © {new Date().getFullYear()} Culturaft Inc.
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-serif text-stone-900 mb-2">Welcome back</h2>
            <p className="text-stone-500">
              Enter your details to access your collection.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-sm text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-900 uppercase tracking-wide">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  placeholder="collector@example.com" 
                  className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-stone-900 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs text-stone-500 hover:text-orange-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  placeholder="••••••••" 
                  className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-4 bg-stone-900 text-stone-50 font-medium tracking-wide hover:bg-orange-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed rounded-sm shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="text-center pt-4 border-t border-stone-100">
            <p className="text-stone-500">
              New to Culturaft?{' '}
              <Link to="/register" className="font-semibold text-stone-900 hover:text-orange-800 transition-colors border-b border-stone-300 hover:border-orange-800 pb-0.5">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
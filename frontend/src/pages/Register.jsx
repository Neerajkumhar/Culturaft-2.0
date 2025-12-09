import React, { useState } from 'react'
import API, { setToken } from '../lib/api'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!name || !email || !password) return setError('Please fill all required fields.')
    if (password !== confirm) return setError('Passwords do not match.')
    
    setLoading(true)
    
    // Aesthetic delay for smooth UX
    const minLoad = new Promise(resolve => setTimeout(resolve, 800))

    try {
      const [res] = await Promise.all([
        API.post('/auth/register', { name, email, password }),
        minLoad
      ])
      
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      window.dispatchEvent(new Event('authChange'))
      
      setLoading(false)
      nav('/')
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans text-stone-800">
      
      {/* Left Side: Visual Narrative */}
      <div className="hidden lg:flex w-1/2 relative bg-stone-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop" 
          alt="Hands working with clay" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 w-full h-full text-stone-100">
          <div className="mb-6">
            <h2 className="font-serif text-4xl mb-4 leading-tight">
              Start your journey with <br/> true craftsmanship.
            </h2>
            <div className="w-16 h-1 bg-orange-700 mb-6"></div>
            <p className="text-stone-300 max-w-md font-light leading-relaxed">
              "To create is to relate. Join a community that values the human story behind every object."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-serif text-stone-900 mb-2">Join the Collective</h2>
            <p className="text-stone-500">
              Create an account to curate your own collection.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-sm text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-900 uppercase tracking-wide">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Jane Doe" 
                  className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="collector@example.com" 
                  className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-900 uppercase tracking-wide">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-900 uppercase tracking-wide">Confirm</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-800 transition-colors">
                    <CheckCircle size={18} />
                  </div>
                  <input 
                    type="password" 
                    value={confirm} 
                    onChange={e => setConfirm(e.target.value)} 
                    placeholder="••••••••" 
                    className="block w-full pl-10 pr-3 py-3 bg-stone-100 border-none rounded-sm focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all outline-none placeholder:text-stone-400" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-500">
              By creating an account, you agree to our <a href="#" className="underline hover:text-stone-800">Terms of Service</a> and <a href="#" className="underline hover:text-stone-800">Privacy Policy</a>.
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-4 bg-stone-900 text-stone-50 font-medium tracking-wide hover:bg-orange-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed rounded-sm shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-stone-100">
            <p className="text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-stone-900 hover:text-orange-800 transition-colors border-b border-stone-300 hover:border-orange-800 pb-0.5">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
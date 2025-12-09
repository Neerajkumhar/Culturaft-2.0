import React, { useEffect, useState } from 'react'
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag } from 'lucide-react'
import API, { setToken } from '../lib/api'
import InvoiceModal from '../components/InvoiceModal'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)
    
    API.get('/orders/my')
      .then(r => {
        setOrders(r.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper for status badges
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle size={14} /> }
      case 'shipped': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Truck size={14} /> }
      case 'accepted': return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <Clock size={14} /> }
      case 'pending': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Package size={14} /> }
      default: return { color: 'bg-stone-100 text-stone-600 border-stone-200', icon: <Package size={14} /> }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-stone-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-stone-200 rounded-full"></div>
          <div className="font-serif text-lg">Retrieving your collection...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">Order History</h1>
          <p className="text-stone-500 font-light">
            A record of the handcrafted pieces you have collected.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-lg shadow-sm">
              <ShoppingBag className="mx-auto h-12 w-12 text-stone-300 mb-4" />
              <h3 className="text-lg font-medium text-stone-900">No orders yet</h3>
              <p className="text-stone-500 mb-6">Start your collection today.</p>
              <a href="/" className="inline-block px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-orange-800 transition-colors">
                Browse Gallery
              </a>
            </div>
          ) : (
            orders.map(order => {
              const statusStyle = getStatusStyle(order.status)
              
              return (
                <div key={order._id} className="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  
                  {/* Order Header / Meta */}
                  <div className="bg-stone-50/50 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100">
                    <div className="flex flex-col sm:flex-row sm:gap-8 gap-2 text-sm">
                      <div>
                        <span className="block text-stone-400 text-xs uppercase tracking-wider">Order Placed</span>
                        <span className="font-medium text-stone-800">{formatDate(order.createdAt || new Date())}</span>
                      </div>
                      <div>
                        <span className="block text-stone-400 text-xs uppercase tracking-wider">Total Amount</span>
                        <span className="font-serif font-medium text-stone-900">₹{order.total?.toFixed(2)}</span>
                      </div>
                      <div>
                         <span className="block text-stone-400 text-xs uppercase tracking-wider">Order ID</span>
                         <span className="font-mono text-xs text-stone-500">#{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide w-fit ${statusStyle.color}`}>
                      {statusStyle.icon}
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <ul className="divide-y divide-stone-100">
                      {order.items.map((item, idx) => (
                        <li key={item._id || idx} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                          {/* Thumbnail Fallback */}
                          <div className="h-16 w-16 bg-stone-200 rounded overflow-hidden flex-shrink-0 border border-stone-100">
                            {/* Assuming item.product might be populated with images, or we use a placeholder */}
                            <img 
                              src={item.product?.images?.[0] || "https://picsum.photos/100"} 
                              alt="product thumbnail" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-stone-900 text-lg truncate">
                              {item.product?.title || 'Artisan Item'}
                            </h4>
                            <p className="text-stone-500 text-sm">
                              Qty: {item.qty} &times; ₹{item.priceAtPurchase?.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="text-right">
                             <a href={`/products/${item.product?._id || item.product}`} className="text-stone-400 hover:text-orange-800 transition-colors">
                               <ChevronRight size={20} />
                             </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-stone-50 px-6 py-3 flex justify-between items-center text-sm">
                    <span className="text-stone-400 text-xs">Need help with this order?</span>
                    <button 
                      onClick={() => {
                        setSelectedOrderId(order._id)
                        setInvoiceModalOpen(true)
                      }}
                      className="text-stone-900 font-medium hover:text-orange-800 hover:underline transition-all"
                    >
                      View Invoice
                    </button>
                  </div>
                  
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal 
        orderId={selectedOrderId} 
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />
    </div>
  )
}
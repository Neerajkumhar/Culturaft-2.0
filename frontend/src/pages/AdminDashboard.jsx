import React, { useEffect, useState } from 'react'
import API, { setToken } from '../lib/api'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Bell, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  Truck, 
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Printer
} from 'lucide-react'
import ProductManagement from '../components/ProductManagement'
import InvoiceModal from '../components/InvoiceModal'

// You might need to install 'date-fns' for nice formatting, 
// but I'll use standard JS dates to keep dependencies low.

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [notifications, setNotifications] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [invoiceOrderId, setInvoiceOrderId] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)

    const fetchData = async () => {
      try {
        const [notifRes, ordersRes] = await Promise.all([
          API.get('/admin/notifications'),
          API.get('/admin/orders')
        ])
        setNotifications(notifRes.data)
        setOrders(ordersRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status })
      const updated = orders.map(o => o._id === id ? { ...o, status } : o)
      setOrders(updated)
    } catch (err) {
      console.error(err)
      alert('Update failed')
    }
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-serif text-stone-600">
      Loading Dashboard...
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
      
      {/* Sidebar / Topbar Navigation Context (Simulated as top header for this file) */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Admin Console</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            Orders Management
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* --- KPI Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            icon={<DollarSign className="text-emerald-600" />} 
            trend="+12% from last month"
          />
          <MetricCard 
            title="Pending Orders" 
            value={pendingOrders} 
            icon={<Clock className="text-orange-600" />} 
            trend="Needs attention"
          />
          <MetricCard 
            title="Total Orders" 
            value={orders.length} 
            icon={<ShoppingBag className="text-blue-600" />} 
            trend="Lifetime volume"
          />
          <MetricCard 
            title="Active Artisans" 
            value="24" 
            icon={<Users className="text-purple-600" />} 
            trend="+3 this week"
          />
        </div>

        {/* --- VIEW: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-serif text-xl text-stone-900">Recent Notifications</h3>
                <button className="text-stone-400 hover:text-stone-800"><Filter size={18} /></button>
              </div>
              <div className="divide-y divide-stone-100 max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-stone-400">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="p-4 flex gap-4 hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 flex-shrink-0">
                        <Bell size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{n.type}</p>
                        <p className="text-sm text-stone-500 mt-1">
                          {/* Basic parsing of the data object for display */}
                          {n.data?.message || JSON.stringify(n.data).slice(0, 100)}
                        </p>
                        <span className="text-xs text-stone-400 mt-2 block">
                          {new Date(n.createdAt || Date.now()).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions / Mini Stats */}
            <div className="space-y-6">
              <div className="bg-stone-900 text-white p-6 rounded-lg shadow-lg">
                <h3 className="font-serif text-xl mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400">Server Load</span>
                    <span className="text-green-400 font-mono">Normal</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400">Database</span>
                    <span className="text-green-400 font-mono">Connected</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-stone-400">Last Backup</span>
                    <span className="text-stone-300 font-mono">2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW: PRODUCTS MANAGEMENT --- */}
        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {/* --- VIEW: ORDERS MANAGEMENT --- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200">
            {/* Table Header */}
            <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-serif text-xl text-stone-900">Order Database</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search order ID or customer..." 
                  className="pl-10 pr-4 py-2 border border-stone-200 rounded-md bg-stone-50 focus:bg-white focus:ring-1 focus:ring-stone-900 outline-none w-64 text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-medium text-xs">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-stone-600">
                        #{o._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-900">
                        {o.shippingAddress?.fullName || o.user?.name || 'Guest User'}
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-stone-900">
                        ${o.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="relative inline-block text-left group-hover:visible invisible">
                           <div className="flex justify-end gap-2 flex-wrap">
                             <button 
                               onClick={() => {
                                 setInvoiceOrderId(o._id)
                                 setShowInvoiceModal(true)
                               }}
                               title="View and print invoice"
                               className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center gap-1"
                             >
                               <Printer size={12} />
                               Invoice
                             </button>
                             {o.status !== 'accepted' && (
                               <button 
                                 onClick={() => updateStatus(o._id, 'accepted')}
                                 className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                               >
                                 Mark Accepted
                               </button>
                             )}
                             {o.status !== 'shipped' && (
                               <button 
                                 onClick={() => updateStatus(o._id, 'shipped')}
                                 className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                               >
                                 Mark Shipped
                               </button>
                             )}
                             {o.status !== 'delivered' && (
                               <button 
                                 onClick={() => updateStatus(o._id, 'delivered')}
                                 className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                               >
                                 Mark Delivered
                               </button>
                             )}
                           </div>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {orders.length === 0 && (
              <div className="p-12 text-center text-stone-400">No orders found.</div>
            )}
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoiceModal && invoiceOrderId && (
          <InvoiceModal
            orderId={invoiceOrderId}
            isOpen={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}
      </main>
    </div>
  )
}

// --- Sub-Components ---

function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-stone-50 rounded-md">
          {icon}
        </div>
        {/* Placeholder for a mini sparkline chart if desired */}
        <TrendingUp size={16} className="text-stone-300" />
      </div>
      <div>
        <p className="text-stone-500 text-sm uppercase tracking-wide">{title}</p>
        <h4 className="text-2xl font-serif font-bold text-stone-900 mt-1">{value}</h4>
        <p className="text-xs text-stone-400 mt-2">{trend}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-orange-100 text-orange-800 border-orange-200",
    shipped: "bg-blue-100 text-blue-800 border-blue-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }
  
  const normalizedStatus = status?.toLowerCase() || 'pending'
  const currentStyle = styles[normalizedStatus] || "bg-stone-100 text-stone-800 border-stone-200"
  const displayStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      {displayStatus}
    </span>
  )
}
import React, { useEffect, useState } from 'react'
import API, { setToken } from '../lib/api'
import { Plus, Trash2, Edit, ChevronDown, X } from 'lucide-react'

const CATEGORIES = [
  'Textiles',
  'Pottery',
  'Jewelry',
  'Home Decor',
  'Clothing',
  'Accessories',
  'Art',
  'Crafts'
]

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    images: [],
    featured: false,
    origin: '',
    artisanStory: '',
    materialsCare: '',
    shippingReturns: '',
    sgst: '',
    cgst: '',
  })

  // Fetch products on mount
  useEffect(() => {
    // ensure API client has token if admin is logged in
    const token = localStorage.getItem('token')
    if (token) setToken(token)
    fetchProducts()
  }, [])

  // Filter products whenever categories change
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter(p => selectedCategories.includes(p.category))
      )
    }
  }, [selectedCategories, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await API.get('/products')
      setProducts(res.data)
      setFilteredProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.price || !formData.category) {
      alert('Please fill in required fields (Title, Price, Category)')
      return
    }

    try {
      // ensure auth header is set
      const token = localStorage.getItem('token')
      if (token) setToken(token)

      const payload = {
        title: formData.title,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        category: formData.category,
        description: formData.description,
        images: formData.images,
        featured: formData.featured,
        origin: formData.origin,
        artisanStory: formData.artisanStory,
        materialsCare: formData.materialsCare,
        shippingReturns: formData.shippingReturns,
        sgst: formData.sgst ? parseFloat(formData.sgst) : 0,
        cgst: formData.cgst ? parseFloat(formData.cgst) : 0,
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, payload)
        setProducts(products.map(p => p._id === editingId ? { ...p, ...payload } : p))
        alert('Product updated successfully!')
      } else {
        const res = await API.post('/products', payload)
        setProducts([...products, res.data])
        alert('Product added successfully!')
      }

      setFormData({
        title: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        images: [],
        featured: false,
        origin: '',
        artisanStory: '',
        materialsCare: '',
        shippingReturns: '',
        sgst: '',
        cgst: '',
      })
      setEditingId(null)
      setShowForm(false)
    } catch (err) {
      console.error('Failed to save product:', err)
      alert('Failed to save product. Check console for details.')
    }
  }

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
      images: product.images || [],
      featured: product.featured || false,
      origin: product.origin || '',
      artisanStory: product.artisanStory || '',
      materialsCare: product.materialsCare || '',
      shippingReturns: product.shippingReturns || '',
      sgst: product.sgst || '',
      cgst: product.cgst || '',
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter(p => p._id !== id))
      alert('Product deleted successfully!')
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      price: '',
      stock: '',
      description: '',
      category: '',
      images: [],
      featured: false,
      origin: '',
      artisanStory: '',
      materialsCare: '',
      shippingReturns: '',
      sgst: '',
      cgst: '',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-stone-500">Loading products...</div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          Products Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-stone-200 bg-white">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-stone-400 hover:text-stone-900"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="e.g., Handwoven Scarf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="e.g., Kyoto, Japan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Materials & Care</label>
                  <input
                    type="text"
                    value={formData.materialsCare}
                    onChange={(e) => setFormData({ ...formData, materialsCare: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="Short care instructions"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Artisan's Story</label>
                <textarea
                  value={formData.artisanStory}
                  onChange={(e) => setFormData({ ...formData, artisanStory: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                  placeholder="A short story about the artisan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Shipping & Returns</label>
                <textarea
                  value={formData.shippingReturns}
                  onChange={(e) => setFormData({ ...formData, shippingReturns: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                  placeholder="Shipping & returns policy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Image URLs (comma-separated)
                </label>
                <textarea
                  value={formData.images.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value
                        .split(',')
                        .map(url => url.trim())
                        .filter(Boolean),
                    })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">SGST (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sgst}
                    onChange={(e) => setFormData({ ...formData, sgst: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">CGST (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cgst}
                    onChange={(e) => setFormData({ ...formData, cgst: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 outline-none"
                    placeholder="e.g., 2.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-stone-700">
                  Featured Product (Show on Home)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors font-medium"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-stone-200 text-stone-900 rounded-md hover:bg-stone-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {category}
            </button>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        <p className="text-sm text-stone-500 mt-3">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-medium text-xs border-b border-stone-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-stone-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-stone-900">
                      {product.title}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-900">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.featured ? 'text-green-600' : 'text-stone-400'}`}>
                        {product.featured ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

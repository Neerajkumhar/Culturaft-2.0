import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded-lg bg-white hover:shadow-lg transition">
      <div className="h-48 bg-amber-50 mb-2 flex items-center justify-center overflow-hidden rounded">
        {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-400">No image</span>}
      </div>
      <h3 className="font-semibold text-[var(--c-accent)]">{product.title}</h3>
      <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
      <Link to={`/products/${product._id}`} className="mt-2 inline-block text-[var(--c-primary)] font-semibold">View</Link>
    </div>
  )
}

import React from 'react'

export default function AdminOrderRow({ order, onUpdate }) {
  return (
    <div className="p-3 bg-white rounded border flex justify-between items-center mb-2">
      <div>
        <div className="font-semibold">Order {order._id}</div>
        <div className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</div>
        <div className="text-sm">Status: {order.status}</div>
      </div>
      <div className="space-x-2">
        {order.status === 'pending' && (
          <button onClick={() => onUpdate(order._id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>
        )}
        {order.status !== 'delivered' && (
          <button onClick={() => onUpdate(order._id, 'delivered')} className="px-3 py-1 bg-blue-600 text-white rounded">Mark Delivered</button>
        )}
      </div>
    </div>
  )
}

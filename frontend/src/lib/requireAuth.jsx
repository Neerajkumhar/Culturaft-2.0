import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getUserFromToken } from './auth'

export function RequireAuth({ children }) {
  const user = getUserFromToken()
  if (!user) return <Navigate to="/login" replace />
  return children ? children : <Outlet />
}

export function RequireAdmin({ children }) {
  const user = getUserFromToken()
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/login" replace />
  return children ? children : <Outlet />
}

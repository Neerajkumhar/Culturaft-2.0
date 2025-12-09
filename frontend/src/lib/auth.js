export function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch (err) {
    return null
  }
}

export function getUserFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload) return null
  return { id: payload.id, role: payload.role }
}

export function logout(redirect = true) {
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('authChange'))
  if (redirect) {
    // navigate to login page
    try {
      window.location.href = '/login'
    } catch (err) {
      // fallback: emit event only
    }
  }
}

import axios from 'axios'

// Use environment variable when available, fall back to localhost
// The Vercel / deployment environment can set VITE_API_URL to e.g. "https://api.example.com"
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
	? import.meta.env.VITE_API_URL
	: 'http://localhost:5000'

// Keep the `/api` prefix so existing calls like `/products` resolve to `${baseURL}/api/products`.
const API = axios.create({ baseURL: `${baseURL}/api` })

export const setToken = (token) => {
	if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
	else delete API.defaults.headers.common['Authorization']
}

export default API

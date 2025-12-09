import axios from 'axios'

const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api'

const API = axios.create({ baseURL: BASE })

export const setToken = (token) => {
	if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`
	else delete API.defaults.headers.common['Authorization']
}

export default API

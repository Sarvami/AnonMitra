/**
 * api.js — Central API utility
 *
 * XSS Fix:
 * - Token is stored in a JS module-level variable (memory only)
 * - NOT in localStorage — so XSS attacks can't steal it
 * - Token is lost on page refresh (user must login again)
 * - This is the safest approach without a backend cookie setup
 *
 * XSS Input Sanitization:
 * - sanitize() strips dangerous HTML characters from any user input
 *   before it gets sent to the backend
 */

import axios from 'axios'

export const API = 'http://localhost:8000/api'

// ── Token stored in memory only (not localStorage) ────────────────────────────
let _token = null

export function setToken(token) {
  _token = token
}

export function getToken() {
  return _token
}

export function clearToken() {
  _token = null
}

// ── Auth header helper ────────────────────────────────────────────────────────
export function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${_token}`,
    },
  }
}

// ── XSS input sanitizer ───────────────────────────────────────────────────────
export function sanitize(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// ── Axios instance with interceptors ─────────────────────────────────────────
const apiClient = axios.create({ baseURL: API })

// Attach token to every request automatically
apiClient.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`
  }
  return config
})

// Handle 401 globally — clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default apiClient
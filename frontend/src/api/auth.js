import apiClient, { sanitize, setToken, clearToken } from './api.js'

export const login = (data) =>
  apiClient.post('/auth/login', {
    email:    sanitize(data.email),
    password: data.password,         // passwords are never sanitized — hashed on backend
  }).then((res) => {
    setToken(res.data.access_token)  // store in memory, NOT localStorage
    return res
  })

export const register = (data) =>
  apiClient.post('/auth/register', {
    email:    sanitize(data.email),
    password: data.password,
  })

export const logout = () => {
  clearToken()
  window.location.href = '/login'
}

export const getMe = () =>
  apiClient.get('/auth/me')

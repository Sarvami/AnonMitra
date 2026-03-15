import axios from 'axios'

const API = 'http://localhost:8000/api'

export const login = (data) =>
  axios.post(`${API}/auth/login`, data)

export const register = (data) =>
  axios.post(`${API}/auth/register`, data)
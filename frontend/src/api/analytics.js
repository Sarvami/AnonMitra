import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getSummary = () =>
  axios.get(`${API}/analytics/summary`, authHeader())

export const getSpamByIdentity = () =>
  axios.get(`${API}/analytics/spam-by-identity`, authHeader())

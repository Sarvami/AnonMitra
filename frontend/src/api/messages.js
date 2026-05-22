import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getMessages = (identityId) =>
  axios.get(`${API}/messages/${identityId}`, authHeader())

export const toggleSpam = (messageId) =>
  axios.post(`${API}/messages/${messageId}/toggle-spam`, {}, authHeader())
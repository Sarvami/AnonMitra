import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getMessages = (identityId) =>
  axios.get(`${API}/messages/${identityId}`, authHeader())
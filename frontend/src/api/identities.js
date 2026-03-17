import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getIdentities = () =>
  axios.get(`${API}/identities`, authHeader())

export const generateIdentity = () =>
  axios.post(`${API}/identities/generate`, {}, authHeader())

export const deleteIdentity = (id) =>
  axios.delete(`${API}/identities/${id}`, authHeader())
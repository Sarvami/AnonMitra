import axios from 'axios'

const API = 'http://localhost:8000/api'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const detectText = (text) =>
  axios.post(`${API}/detector/text`, { text }, authHeader())

export const detectImage = (formData) =>
  axios.post(`${API}/detector/image`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data'
    }
  })
import apiClient, { sanitize } from './api'

export const detectText = (text) =>
  apiClient.post('/detector/text', {
    text: sanitize(text),
  })

export const detectImage = (formData) =>
  apiClient.post('/detector/detect/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

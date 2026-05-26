import apiClient, { sanitize } from './api'

export const getIdentities = () =>
  apiClient.get('/identities/')

export const generateIdentity = (platform) =>
  apiClient.post('/identities/generate', {
    platform: sanitize(platform) || 'general',
  })

export const deleteIdentity = (id) =>
  apiClient.delete(`/identities/${sanitize(id)}`)

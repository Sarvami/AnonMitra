import apiClient, { sanitize } from './api'

export const getMessages = (identityId) =>
  apiClient.get(`/messages/${sanitize(identityId)}`)

export const markAsRead = (messageId) =>
  apiClient.patch(`/messages/${sanitize(messageId)}/read`)

export const simulateSpam = (identityId) =>
  apiClient.post('/messages/simulate', {
    identity_id: sanitize(identityId),
  })

export const toggleSpam = (messageId) =>
  apiClient.post(`/messages/${sanitize(messageId)}/toggle-spam`, {})

export const simulateCustom = (payload) =>
  apiClient.post('/messages/simulate-custom', {
    identity_id: sanitize(payload.identity_id),
    sender:      sanitize(payload.sender),
    subject:     sanitize(payload.subject),
    body:        sanitize(payload.body),
  })

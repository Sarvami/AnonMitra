import apiClient from './api'

export const getSummary = () =>
  apiClient.get('/analytics/summary')

export const getSpamByIdentity = () =>
  apiClient.get('/analytics/spam-by-identity')

export const getRiskByPlatform = () =>
  apiClient.get('/analytics/risk-by-platform')

export const getSpamOverTime = () =>
  apiClient.get('/analytics/spam-over-time')

export const getDetectionHistory = () =>
  apiClient.get('/analytics/detection-history')

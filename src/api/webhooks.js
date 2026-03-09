import api from './client'

export const getProjectWebhooks = (projectId) => api.get(`/webhooks/project/${projectId}`)
export const createWebhook = (data) => api.post('/webhooks', data)
export const updateWebhook = (webhookId, data) => api.put(`/webhooks/${webhookId}`, data)
export const deleteWebhook = (webhookId) => api.delete(`/webhooks/${webhookId}`)
export const testWebhook = (webhookId) => api.post(`/webhooks/${webhookId}/test`)

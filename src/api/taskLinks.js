import api from './client'

export const createLink = (data) => api.post('/task-links', data)
export const getTaskLinks = (taskId) => api.get(`/task-links/task/${taskId}`)
export const deleteLink = (linkId) => api.delete(`/task-links/${linkId}`)

import api from './client'

export const getProjectLabels = (projectId) => api.get(`/labels/project/${projectId}`)
export const createLabel = (data) => api.post('/labels', data)
export const updateLabel = (labelId, data) => api.put(`/labels/${labelId}`, data)
export const deleteLabel = (labelId) => api.delete(`/labels/${labelId}`)

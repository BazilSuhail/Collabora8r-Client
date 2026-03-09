import api from './client'

export const getProjectFilters = (projectId) => api.get(`/filters/project/${projectId}`)
export const createFilter = (data) => api.post('/filters', data)
export const updateFilter = (filterId, data) => api.put(`/filters/${filterId}`, data)
export const deleteFilter = (filterId) => api.delete(`/filters/${filterId}`)

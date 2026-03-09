import api from './client'

export const createProject = (data) => api.post('/projects/create', data)
export const updateProject = (projectId, data) => api.put(`/projects/${projectId}/update`, data)
export const respondManagerInvite = (projectId, response) =>
  api.put(`/projects/manager-response/${projectId}`, { response })

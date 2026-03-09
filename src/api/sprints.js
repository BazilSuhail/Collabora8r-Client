import api from './client'

export const getSprints = (projectId) => api.get(`/sprints/${projectId}`)
export const createSprint = (projectId, data) => api.post(`/sprints/${projectId}`, data)
export const getSprintDetail = (sprintId) => api.get(`/sprints/sprint/${sprintId}`)
export const updateSprint = (sprintId, data) => api.put(`/sprints/sprint/${sprintId}`, data)
export const deleteSprint = (sprintId) => api.delete(`/sprints/sprint/${sprintId}`)
export const activateSprint = (sprintId) => api.post(`/sprints/sprint/${sprintId}/activate`)
export const completeSprint = (sprintId) => api.post(`/sprints/sprint/${sprintId}/complete`)
export const addTasksToSprint = (sprintId, taskIds) => api.post(`/sprints/sprint/${sprintId}/add-tasks`, { taskIds })
export const removeTasksFromSprint = (sprintId, taskIds) => api.post(`/sprints/sprint/${sprintId}/remove-tasks`, { taskIds })

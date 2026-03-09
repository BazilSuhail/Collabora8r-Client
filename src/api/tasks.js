import api from './client'

export const createTask = (data) => api.post('/manageTasks/', data)
export const getProjectTasks = (projectId) => api.get(`/manageTasks/project/${projectId}`)
export const getUserTasks = (userId) => api.get(`/manageTasks/user/${userId}`)
export const updateTask = (taskId, data) => api.patch(`/manageTasks/${taskId}`, data)
export const deleteTask = (taskId) => api.delete(`/manageTasks/${taskId}`)

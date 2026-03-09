import api from './client'

export const getProjectTasksWithUser = (projectId) => api.get(`/projecttasks/${projectId}`)
export const getTaskDetail = (taskId) => api.get(`/project-tasks/${taskId}`)
export const bulkUpdateStatus = (updates) => api.patch('/projecttasks/tasks/update', { updates })
export const updateTaskProgress = (taskId, data) => api.put(`/projecttasks/update-task-progress/${taskId}`, data)

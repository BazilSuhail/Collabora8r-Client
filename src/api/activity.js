import api from './client'

export const getProjectActivity = (projectId) => api.get(`/activity/project/${projectId}`)
export const getTaskActivity = (taskId) => api.get(`/activity/task/${taskId}`)
export const getUserActivity = (userId) => api.get(`/activity/user/${userId}`)

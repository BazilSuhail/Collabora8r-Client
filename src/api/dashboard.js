import api from './client'

export const getAssignedTasks = () => api.get('/overview/assigned-tasks')
export const getProgressOverview = () => api.get('/overview/progress-overview')

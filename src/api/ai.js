import api from './client'

export const createTaskWithAI = (data) => api.post('/ai/create-task', data)
export const breakdownTask = (data) => api.post('/ai/breakdown-task', data)
export const suggestAssignee = (data) => api.post('/ai/suggest-assignee', data)
export const recommendMetadata = (data) => api.post('/ai/recommend-metadata', data)
export const getProjectSummary = (projectId) => api.get(`/ai/project-summary/${projectId}`)
export const searchTasks = (data) => api.post('/ai/search-tasks', data)
export const summarizeComments = (data) => api.post('/ai/summarize-comments', data)
export const generateAcceptanceCriteria = (data) => api.post('/ai/generate-acceptance-criteria', data)
export const detectRisks = (data) => api.post('/ai/detect-risks', data)
export const retrospective = (data) => api.post('/ai/retrospective', data)

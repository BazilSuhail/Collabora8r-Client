import api from './client'

export const logTime = (data) => api.post('/time/entries', data)
export const getTaskTimeEntries = (taskId) => api.get(`/time/entries/task/${taskId}`)
export const getUserTimeEntries = () => api.get('/time/entries/user')
export const getProjectTimeReport = (projectId) => api.get(`/time/report/project/${projectId}`)
export const getSprintTimeReport = (sprintId) => api.get(`/time/report/sprint/${sprintId}`)
export const updateTimeEntry = (entryId, data) => api.put(`/time/entries/${entryId}`, data)
export const deleteTimeEntry = (entryId) => api.delete(`/time/entries/${entryId}`)

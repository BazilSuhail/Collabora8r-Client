import api from './client'

export const getJoinedProjects = () => api.get('/joinedprojects/')
export const getManagedProjects = () => api.get('/joinedprojects/as-manager')
export const getJoinedProjectDetail = (projectId) => api.get(`/joinedprojects/${projectId}`)

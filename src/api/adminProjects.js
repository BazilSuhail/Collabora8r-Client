import api from './client'

export const getAdminProjects = () => api.get('/admin-projects/')
export const getAdminProjectDetail = (projectId) => api.get(`/admin-projects/${projectId}`)
export const searchUser = (email) => api.post('/admin-projects/get-searched-user', { email })
export const sendInvitation = (data) => api.post('/admin-projects/send-project-invitation', data)

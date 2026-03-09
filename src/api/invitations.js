import api from './client'

export const sendInvitation = (data) => api.post('/invitations', data)
export const getPendingInvitations = () => api.get('/invitations/pending')
export const acceptInvitation = (token) => api.post(`/invitations/${token}/accept`)
export const declineInvitation = (token) => api.post(`/invitations/${token}/decline`)
export const getProjectInvitations = (projectId) => api.get(`/invitations/project/${projectId}`)

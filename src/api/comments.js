import api from './client'

export const addComment = (taskId, data) => api.post(`/comments/tasks/${taskId}/comments`, data)
export const getComments = (taskId) => api.get(`/comments/tasks/${taskId}/comments`)
export const updateComment = (commentId, data) => api.put(`/comments/${commentId}`, data)
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`)
export const getUserName = (userId) => api.get(`/comments/user/${userId}`)

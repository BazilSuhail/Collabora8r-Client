import api from './client'

export const uploadTaskFiles = (taskId, formData) =>
  api.post(`/uploads/task/${taskId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const uploadCommentFiles = (commentId, formData) =>
  api.post(`/uploads/comment/${commentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const getTaskFiles = (taskId) => api.get(`/uploads/task/${taskId}`)
export const deleteFile = (fileId) => api.delete(`/uploads/${fileId}`)

import api from './client'

export const getProjectBoards = (projectId) => api.get(`/boards/project/${projectId}`)
export const createBoard = (data) => api.post('/boards', data)
export const updateBoard = (boardId, data) => api.put(`/boards/${boardId}`, data)
export const deleteBoard = (boardId) => api.delete(`/boards/${boardId}`)

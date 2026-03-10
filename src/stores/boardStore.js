import { create } from 'zustand'
import * as boardsApi from '../api/boards'

const useBoardStore = create((set) => ({
  boardConfigs: [],
  activeBoardId: null,

  fetchBoardConfigs: async (projectId) => {
    const { data } = await boardsApi.getProjectBoards(projectId)
    set({ boardConfigs: data })
  },

  createBoard: async (boardData) => {
    const { data } = await boardsApi.createBoard(boardData)
    set((state) => ({ boardConfigs: [...state.boardConfigs, data] }))
    return data
  },

  updateBoard: async (boardId, boardData) => {
    const { data } = await boardsApi.updateBoard(boardId, boardData)
    set((state) => ({
      boardConfigs: state.boardConfigs.map((b) => (b._id === boardId ? data : b)),
    }))
    return data
  },

  deleteBoard: async (boardId) => {
    await boardsApi.deleteBoard(boardId)
    set((state) => ({
      boardConfigs: state.boardConfigs.filter((b) => b._id !== boardId),
      activeBoardId: state.activeBoardId === boardId ? null : state.activeBoardId,
    }))
  },
}))

export default useBoardStore

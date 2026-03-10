import { create } from 'zustand'
import * as sprintsApi from '../api/sprints'

const useSprintStore = create((set) => ({
  sprints: [],
  currentSprint: null,

  fetchSprints: async (projectId) => {
    const { data } = await sprintsApi.getSprints(projectId)
    set({ sprints: data })
  },

  fetchSprintDetail: async (sprintId) => {
    const { data } = await sprintsApi.getSprintDetail(sprintId)
    set({ currentSprint: data })
  },

  createSprint: async (projectId, sprintData) => {
    const { data } = await sprintsApi.createSprint(projectId, sprintData)
    set((state) => ({ sprints: [...state.sprints, data] }))
    return data
  },

  updateSprint: async (sprintId, sprintData) => {
    const { data } = await sprintsApi.updateSprint(sprintId, sprintData)
    set((state) => ({
      sprints: state.sprints.map((s) => (s._id === sprintId ? data : s)),
      currentSprint: state.currentSprint?._id === sprintId ? data : state.currentSprint,
    }))
    return data
  },

  deleteSprint: async (sprintId) => {
    await sprintsApi.deleteSprint(sprintId)
    set((state) => ({
      sprints: state.sprints.filter((s) => s._id !== sprintId),
      currentSprint: state.currentSprint?._id === sprintId ? null : state.currentSprint,
    }))
  },

  activateSprint: async (sprintId) => {
    const { data } = await sprintsApi.activateSprint(sprintId)
    set((state) => ({
      sprints: state.sprints.map((s) => (s._id === sprintId ? data : s)),
      currentSprint: state.currentSprint?._id === sprintId ? data : state.currentSprint,
    }))
  },

  completeSprint: async (sprintId) => {
    const { data } = await sprintsApi.completeSprint(sprintId)
    set((state) => ({
      sprints: state.sprints.map((s) => (s._id === sprintId ? data : s)),
      currentSprint: state.currentSprint?._id === sprintId ? data : state.currentSprint,
    }))
  },

  addTasksToSprint: async (sprintId, taskIds) => {
    await sprintsApi.addTasksToSprint(sprintId, taskIds)
  },

  removeTasksFromSprint: async (sprintId, taskIds) => {
    await sprintsApi.removeTasksFromSprint(sprintId, taskIds)
  },
}))

export default useSprintStore

import { create } from 'zustand'
import * as tasksApi from '../api/tasks'
import * as projectTasksApi from '../api/projectTasks'
import * as dashboardApi from '../api/dashboard'

const useTaskStore = create((set) => ({
  tasks: [],
  currentTask: null,

  fetchProjectTasks: async (projectId) => {
    const { data } = await tasksApi.getProjectTasks(projectId)
    set({ tasks: data })
  },

  fetchUserTasks: async (userId) => {
    const { data } = await tasksApi.getUserTasks(userId)
    set({ tasks: data })
  },

  fetchAssignedTasks: async () => {
    const { data } = await dashboardApi.getAssignedTasks()
    set({ tasks: data })
  },

  fetchTaskDetail: async (taskId) => {
    const { data } = await projectTasksApi.getTaskDetail(taskId)
    set({ currentTask: data })
  },

  createTask: async (taskData) => {
    const { data } = await tasksApi.createTask(taskData)
    set((state) => ({ tasks: [...state.tasks, data] }))
    return data
  },

  updateTask: async (taskId, taskData) => {
    const { data } = await tasksApi.updateTask(taskId, taskData)
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === taskId ? data : t)),
      currentTask: state.currentTask?._id === taskId ? data : state.currentTask,
    }))
    return data
  },

  deleteTask: async (taskId) => {
    await tasksApi.deleteTask(taskId)
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
      currentTask: state.currentTask?._id === taskId ? null : state.currentTask,
    }))
  },

  bulkUpdateStatus: async (updates) => {
    await projectTasksApi.bulkUpdateStatus(updates)
  },

  updateTaskProgress: async (taskId, data) => {
    await projectTasksApi.updateTaskProgress(taskId, data)
  },
}))

export default useTaskStore

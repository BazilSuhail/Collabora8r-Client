import { create } from 'zustand'
import * as labelsApi from '../api/labels'

const useLabelStore = create((set) => ({
  labels: [],

  fetchLabels: async (projectId) => {
    const { data } = await labelsApi.getProjectLabels(projectId)
    set({ labels: data })
  },

  createLabel: async (labelData) => {
    const { data } = await labelsApi.createLabel(labelData)
    set((state) => ({ labels: [...state.labels, data] }))
    return data
  },

  updateLabel: async (labelId, labelData) => {
    const { data } = await labelsApi.updateLabel(labelId, labelData)
    set((state) => ({
      labels: state.labels.map((l) => (l._id === labelId ? data : l)),
    }))
    return data
  },

  deleteLabel: async (labelId) => {
    await labelsApi.deleteLabel(labelId)
    set((state) => ({
      labels: state.labels.filter((l) => l._id !== labelId),
    }))
  },
}))

export default useLabelStore

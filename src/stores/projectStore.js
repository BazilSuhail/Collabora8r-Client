import { create } from 'zustand'
import api from '../utils/api'

const useProjectStore = create((set) => ({
  adminProjects: [],
  joinedProjects: [],
  managedProjects: [],
  currentProject: null,

  fetchAdminProjects: async () => {
    const { data, error } = await api('GET', '/admin-projects/')
    if (!error) set({ adminProjects: data })
  },

  fetchJoinedProjects: async () => {
    const { data, error } = await api('GET', '/joinedprojects/')
    if (!error) set({ joinedProjects: data })
  },

  fetchManagedProjects: async () => {
    const { data, error } = await api('GET', '/joinedprojects/as-manager')
    if (!error) set({ managedProjects: data })
  },

  fetchProjectDetail: async (id) => {
    let result = await api('GET', `/admin-projects/${id}`)
    if (result.error) result = await api('GET', `/joinedprojects/${id}`)
    const project = result.data?.project || result.data
    set({ currentProject: project })
  },

  createProject: async (projectData) => {
    const { data, error } = await api('POST', '/projects/create', projectData)
    if (error) throw error
    const project = data.project || data
    set((state) => ({ adminProjects: [...state.adminProjects, project] }))
    return project
  },

  updateProject: async (id, projectData) => {
    const { data, error } = await api('PUT', `/projects/${id}/update`, projectData)
    if (!error) set({ currentProject: data })
  },

  respondManagerInvite: async (id, response) => {
    await api('PUT', `/projects/manager-response/${id}`, { response })
  },

  fetchProjectTeam: async (id) => {
    const { data, error } = await api('GET', `/admin-projects/${id}`)
    if (!error) set({ currentProjectTeam: data.team || [] })
  },

  addToTeam: async (inviteData) => {
    const { error } = await api('POST', '/admin-projects/send-project-invitation', inviteData)
    if (error) throw error
  },
}))

export default useProjectStore

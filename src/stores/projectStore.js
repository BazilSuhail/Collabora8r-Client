import { create } from 'zustand'
import * as adminProjectsApi from '../api/adminProjects'
import * as joinedProjectsApi from '../api/joinedProjects'
import * as projectsApi from '../api/projects'
import * as manageUsersApi from '../api/adminProjects'

const useProjectStore = create((set) => ({
  adminProjects: [],
  joinedProjects: [],
  managedProjects: [],
  currentProject: null,
  currentProjectTeam: [],

  fetchAdminProjects: async () => {
    const { data } = await adminProjectsApi.getAdminProjects()
    set({ adminProjects: data })
  },

  fetchJoinedProjects: async () => {
    const { data } = await joinedProjectsApi.getJoinedProjects()
    set({ joinedProjects: data })
  },

  fetchManagedProjects: async () => {
    const { data } = await joinedProjectsApi.getManagedProjects()
    set({ managedProjects: data })
  },

  fetchProjectDetail: async (id) => {
    try {
      const { data } = await adminProjectsApi.getAdminProjectDetail(id)
      set({ currentProject: data })
    } catch {
      const { data } = await joinedProjectsApi.getJoinedProjectDetail(id)
      set({ currentProject: data })
    }
  },

  createProject: async (projectData) => {
    const { data } = await projectsApi.createProject(projectData)
    set((state) => ({ adminProjects: [...state.adminProjects, data] }))
    return data
  },

  updateProject: async (id, projectData) => {
    const { data } = await projectsApi.updateProject(id, projectData)
    set({ currentProject: data })
  },

  respondManagerInvite: async (id, response) => {
    await projectsApi.respondManagerInvite(id, response)
  },

  fetchProjectTeam: async (id) => {
    const { data } = await manageUsersApi.getAdminProjectDetail(id)
    set({ currentProjectTeam: data.team || [] })
  },

  addToTeam: async (inviteData) => {
    await adminProjectsApi.sendInvitation(inviteData)
  },
}))

export default useProjectStore

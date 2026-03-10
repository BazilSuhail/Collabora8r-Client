import { create } from 'zustand'
import * as organizationsApi from '../api/organizations'

const useOrganizationStore = create((set) => ({
  organizations: [],
  currentOrg: null,

  fetchOrganizations: async () => {
    const { data } = await organizationsApi.getOrganizations()
    set({ organizations: data })
  },

  fetchOrgDetail: async (orgId) => {
    const { data } = await organizationsApi.getOrgDetail(orgId)
    set({ currentOrg: data })
  },

  createOrganization: async (orgData) => {
    const { data } = await organizationsApi.createOrg(orgData)
    set((state) => ({ organizations: [...state.organizations, data] }))
    return data
  },

  updateOrganization: async (orgId, orgData) => {
    const { data } = await organizationsApi.updateOrg(orgId, orgData)
    set((state) => ({
      organizations: state.organizations.map((o) => (o._id === orgId ? data : o)),
      currentOrg: state.currentOrg?._id === orgId ? data : state.currentOrg,
    }))
    return data
  },

  deleteOrganization: async (orgId) => {
    await organizationsApi.deleteOrg(orgId)
    set((state) => ({
      organizations: state.organizations.filter((o) => o._id !== orgId),
      currentOrg: state.currentOrg?._id === orgId ? null : state.currentOrg,
    }))
  },

  addOrgMember: async (orgId, userId, role) => {
    const { data } = await organizationsApi.addOrgMember(orgId, userId, role)
    set({ currentOrg: data })
  },

  updateOrgMember: async (orgId, userId, role) => {
    const { data } = await organizationsApi.updateOrgMember(orgId, userId, role)
    set({ currentOrg: data })
  },

  removeOrgMember: async (orgId, userId) => {
    const { data } = await organizationsApi.removeOrgMember(orgId, userId)
    set({ currentOrg: data })
  },
}))

export default useOrganizationStore

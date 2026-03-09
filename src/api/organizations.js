import api from './client'

export const getOrganizations = () => api.get('/organizations')
export const getOrgDetail = (orgId) => api.get(`/organizations/${orgId}`)
export const createOrg = (data) => api.post('/organizations', data)
export const updateOrg = (orgId, data) => api.put(`/organizations/${orgId}`, data)
export const deleteOrg = (orgId) => api.delete(`/organizations/${orgId}`)
export const addOrgMember = (orgId, userId, role) =>
  api.post(`/organizations/${orgId}/members`, { userId, role })
export const updateOrgMember = (orgId, userId, role) =>
  api.put(`/organizations/${orgId}/members/${userId}`, { role })
export const removeOrgMember = (orgId, userId) =>
  api.delete(`/organizations/${orgId}/members/${userId}`)

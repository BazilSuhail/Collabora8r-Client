import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiUserPlus, FiArrowLeft } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import api from '../../utils/api'

const OrganizationDetail = () => {
  const { orgId } = useParams()
  const [currentOrg, setCurrentOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/organizations/' + orgId)
      setCurrentOrg(data)
      setLoading(false)
    }
    load()
  }, [orgId])

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    try {
      const { data } = await api('POST', '/organizations/' + orgId + '/members', { userId: inviteEmail, role: 'member' })
      setCurrentOrg(data)
      setInviteEmail('')
    } catch (err) {
      console.error('Failed to add member:', err)
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  }

  if (!currentOrg) return <p className="text-gray-500 dark:text-gray-400">Division not found.</p>

  return (
    <div>
      <Link to="/organizations" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-4 transition-colors">
        <FiArrowLeft size={16} /> Back to Divisions
      </Link>

      <PageHeader
        icon={FiUsers}
        title={currentOrg.name}
        subtitle={currentOrg.description || 'No mission brief'}
      />

      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 max-w-2xl">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <FiUsers size={18} className="text-orange-600" />
          Personnel ({currentOrg.members?.length || 0})
        </h2>

        <form onSubmit={handleAddMember} className="flex gap-3 mb-6">
          <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@company.com" required
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md">
            <FiUserPlus size={16} /> Add
          </button>
        </form>

        <div className="space-y-2">
          {(currentOrg.members || []).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-medium">No members yet.</p>
          ) : (
            (currentOrg.members || []).map((m) => (
              <div key={m._id || m.user?._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-sm font-bold">
                    {(m.name || m.user?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{m.name || m.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{m.email || m.user?.email || m.role || ''}</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">{m.role || 'member'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetail

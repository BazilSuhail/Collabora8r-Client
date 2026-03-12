import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiUserPlus, FiUserX } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import useProjectStore from '../../../stores/projectStore'
import useAuthStore from '../../../stores/authStore'

const TeamManagement = () => {
  const { projectId } = useParams()
  const { currentProjectTeam, fetchProjectTeam, addToTeam } = useProjectStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (projectId) fetchProjectTeam(projectId).finally(() => setLoading(false))
  }, [projectId])

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setSending(true)
    try {
      await addToTeam({ email: inviteEmail, projectId, role: inviteRole })
      setInviteEmail('')
    } catch (err) {
      console.error('Invite failed:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={FiUsers}
        title="Team"
        highlight="Personnel"
        subtitle={`${currentProjectTeam.length} operatives`}
      />

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Deploy New Operative</h2>
          <form onSubmit={handleInvite} className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 outline-none transition">
                <option value="member">Operative</option>
                <option value="admin">Commander</option>
              </select>
            </div>
            <button type="submit" disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md">
              <FiUserPlus size={16} /> {sending ? 'Deploying...' : 'Invite'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Active Operatives</h2>
          {loading ? (
            <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}</div>
          ) : currentProjectTeam.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-medium">No operatives deployed.</p>
          ) : (
            <div className="space-y-2">
              {currentProjectTeam.map((member) => (
                <div key={member._id || member.user?._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-sm font-bold">
                      {(member.name || member.user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name || member.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{member.email || member.user?.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">{member.role || 'member'}</span>
                    {member._id !== user?._id && member.user !== user?._id && (
                      <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <FiUserX size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamManagement

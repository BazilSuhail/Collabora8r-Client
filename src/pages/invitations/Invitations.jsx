import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiCheck, FiX, FiFolder, FiUsers } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import api from '../../utils/api'

const Invitations = () => {
  const [pendingInvitations, setPendingInvitations] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/invitations/pending')
      setPendingInvitations(data || [])
    }
    load()
  }, [])

  return (
    <div>
      <PageHeader
        icon={FiMail}
        title="Pending"
        highlight="Invitations"
        subtitle={`${pendingInvitations.length} awaiting response`}
      />

      {pendingInvitations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] max-w-2xl">
          <FiMail size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Inbox Clear</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No pending invitations.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {pendingInvitations.map((inv) => {
            const Icon = inv.project ? FiFolder : FiUsers
            return (
              <motion.div
                key={inv._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-5 md:p-6 flex items-center justify-between hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white shadow-md">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{inv.project?.name || inv.organization?.name || 'Invitation'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Role: {inv.role || 'member'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { await api('POST', '/invitations/' + inv.token + '/accept'); setPendingInvitations((prev) => prev.filter((i) => i._id !== inv._id)) }}
                    className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all">
                    <FiCheck size={18} />
                  </button>
                  <button onClick={async () => { await api('POST', '/invitations/' + inv.token + '/decline'); setPendingInvitations((prev) => prev.filter((i) => i._id !== inv._id)) }}
                    className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all">
                    <FiX size={18} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Invitations

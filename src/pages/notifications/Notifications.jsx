import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiCheck, FiTrash2, FiZap, FiUser, FiFolder, FiShield } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import api from '../../utils/api'

const typeIcons = {
  task_assigned: FiZap,
  project_invite: FiFolder,
  manager_invite: FiShield,
  comment_added: FiUser,
  sprint_completed: FiBell,
}

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/profile/get-notifications')
      setNotifications(data || [])
    }
    load()
  }, [])

  return (
    <div>
      <PageHeader
        icon={FiBell}
        title="Signal"
        highlight="Intel"
        subtitle={`${unreadCount} unread transmissions`}
        action={
            notifications.length > 0 && (
            <button onClick={() => setNotifications([])} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] text-gray-500 hover:text-red-500 hover:border-red-500/30 transition-all font-bold text-sm">
              <FiTrash2 size={14} /> Clear All
            </button>
          )
        }
      />

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiBell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Radio Silence</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((n) => {
            const TypeIcon = typeIcons[n.type] || FiBell
            return (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1a1a1a]'
                    : 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20'
                }`}
                onClick={() => { if (!n.read) { setNotifications((prev) => prev.map((x) => x._id === n._id ? { ...x, read: true } : x)) } }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.read
                    ? 'bg-gray-100 dark:bg-[#151515] text-gray-500 dark:text-gray-400'
                    : 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md'
                }`}>
                  <TypeIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? 'font-medium' : 'font-bold'} text-gray-900 dark:text-white`}>
                    {n.message || n.data?.message || 'New transmission'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                {!n.read && (
                  <button onClick={(e) => { e.stopPropagation(); setNotifications((prev) => prev.map((x) => x._id === n._id ? { ...x, read: true } : x)) }}
                    className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-all">
                    <FiCheck size={16} />
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications

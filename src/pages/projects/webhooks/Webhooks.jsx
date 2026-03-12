import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiPlus, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const Webhooks = () => {
  const { projectId } = useParams()
  const [webhooks, setWebhooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api('GET', '/webhooks/project/' + projectId)
        setWebhooks(data)
      } catch (err) {
        console.error('Failed to load webhooks:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  const handleDelete = async (id) => {
    if (!confirm('Delete this webhook?')) return
    try {
      await api('DELETE', '/webhooks/' + id)
      setWebhooks((prev) => prev.filter((w) => w._id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleTest = async (id) => {
    try {
      await api('POST', '/webhooks/' + id + '/test')
      alert('Test transmission sent!')
    } catch (err) {
      console.error('Test failed:', err)
    }
  }

  return (
    <div>
      <PageHeader
        icon={FiZap}
        title="Webhook"
        highlight="Integrations"
        subtitle="Configure external communications"
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiZap size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Webhooks</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Configure integrations for real-time events.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {webhooks.map((hook) => (
            <div key={hook._id} className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 transition-all">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{hook.name || hook.url}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate">{hook.url}</p>
                <p className="text-xs text-gray-400 mt-0.5">Events: {hook.events?.join(', ') || 'all'}</p>
              </div>
              <div className="flex gap-1 shrink-0 ml-4">
                <button onClick={() => handleTest(hook._id)} className="p-2.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-all" title="Test">
                  <FiZap size={16} />
                </button>
                <button onClick={() => handleDelete(hook._id)} className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Webhooks

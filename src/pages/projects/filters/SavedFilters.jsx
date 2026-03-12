import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiPlus, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const SavedFilters = () => {
  const { projectId } = useParams()
  const [filters, setFilters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api('GET', '/filters/project/' + projectId)
        setFilters(data)
      } catch (err) {
        console.error('Failed to load filters:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  const handleDelete = async (id) => {
    if (!confirm('Delete this filter?')) return
    try {
      await api('DELETE', '/filters/' + id)
      setFilters((prev) => prev.filter((f) => f._id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div>
      <PageHeader
        icon={FiFilter}
        title="Saved"
        highlight="Filters"
        subtitle="Saved search parameters"
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : filters.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiFilter size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Saved Filters</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Save custom filters to quickly find tasks.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filters.map((filter) => (
            <div key={filter._id} className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 transition-all">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{filter.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                  {filter.criteria ? Object.entries(filter.criteria).map(([k, v]) => `${k}: ${v}`).join(', ') : 'No criteria'}
                </p>
              </div>
              <button onClick={() => handleDelete(filter._id)}
                className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedFilters

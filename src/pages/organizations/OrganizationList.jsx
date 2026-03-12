import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiPlus } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import api from '../../utils/api'

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/organizations')
      setOrganizations(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <PageHeader
        icon={FiUsers}
        title="Organization"
        highlight="Command"
        subtitle="Manage your divisions and teams"
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiUsers size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Divisions</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Create an organization to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, i) => (
            <motion.div key={org._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/organizations/${org._id}`}
                className="block bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 hover:shadow-xl hover:border-orange-500/30 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-lg shadow-md mb-4 group-hover:scale-105 transition-transform">
                  {org.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors mb-1">{org.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{org.description}</p>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-4">{org.members?.length || 0} personnel</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrganizationList

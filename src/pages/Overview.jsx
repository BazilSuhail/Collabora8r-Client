import { motion } from 'framer-motion'
import { FiActivity } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'

const Overview = () => {
  return (
    <div>
      <PageHeader
        icon={FiActivity}
        title="Sector:"
        highlight="Overview"
        subtitle="High-level mission analytics and status"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] p-12 text-center"
      >
        <FiActivity size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Overview Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Consolidated project analytics and cross-sector metrics will appear here.</p>
      </motion.div>
    </div>
  )
}

export default Overview

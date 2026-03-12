import { motion } from 'framer-motion'
import { FiGitBranch } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'

const Workflow = () => {
  return (
    <div>
      <PageHeader
        icon={FiGitBranch}
        title="Directive:"
        highlight="Workflow"
        subtitle="Automation rules and pipeline configuration"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] p-12 text-center"
      >
        <FiGitBranch size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Workflow Coming Soon</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Custom workflow rules, automation triggers, and pipeline orchestration will appear here.</p>
      </motion.div>
    </div>
  )
}

export default Workflow

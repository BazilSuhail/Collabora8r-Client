import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiArrowLeft } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import useProjectStore from '../../stores/projectStore'

const CreateProject = () => {
  const [form, setForm] = useState({ name: '', description: '', theme: '#ea580c' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createProject } = useProjectStore()
  const navigate = useNavigate()

  const update = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Project name is required'); return }
    setLoading(true)
    setError('')
    try {
      const project = await createProject(form)
      navigate(`/projects/${project._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        icon={FiPlus}
        title="Establish New"
        highlight="Sector"
        subtitle="Configure your project workspace"
      />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-8 space-y-6"
      >
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Sector Name</label>
          <input type="text" value={form.name} onChange={update('name')} placeholder="Enter project name" required
            className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Mission Brief</label>
          <textarea value={form.description} onChange={update('description')} placeholder="What is the objective of this project?" rows={5}
            className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Theme Color</label>
          <div className="flex items-center gap-4">
            <input type="color" value={form.theme} onChange={update('theme')}
              className="w-12 h-12 rounded-xl border border-gray-300 dark:border-[#1a1a1a] cursor-pointer" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Choose a color for your project identity</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#1a1a1a]">
          <button type="submit" disabled={loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md">
            {loading ? 'Initializing...' : 'Establish Sector'}
          </button>
          <button type="button" onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#151515] transition-all">
            <FiArrowLeft size={16} /> Cancel
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default CreateProject

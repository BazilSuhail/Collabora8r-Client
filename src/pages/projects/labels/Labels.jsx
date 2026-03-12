import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTag, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const Labels = () => {
  const { projectId } = useParams()
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', color: '#ea580c' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/labels/project/' + projectId)
      setLabels(data || [])
      setLoading(false)
    }
    load()
  }, [projectId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      if (editingId) {
        const { data } = await api('PUT', '/labels/' + editingId, { ...form, projectId })
        setLabels((prev) => prev.map((l) => (l._id === editingId ? data : l)))
      } else {
        const { data } = await api('POST', '/labels', { ...form, projectId })
        setLabels((prev) => [...prev, data])
      }
      setForm({ name: '', color: '#ea580c' })
      setShowForm(false)
      setEditingId(null)
    } catch (err) {
      console.error('Label save failed:', err)
    }
  }

  const startEdit = (label) => {
    setForm({ name: label.name, color: label.color })
    setEditingId(label._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this label?')) return
    try {
      await api('DELETE', '/labels/' + id)
      setLabels((prev) => prev.filter((l) => l._id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <PageHeader
        icon={FiTag}
        title="Labels"
        highlight="& Tags"
        subtitle="Classification system"
        action={
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', color: '#ea580c' }) }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold shadow-md hover:from-orange-500 hover:to-orange-600 transition-all">
            <FiPlus size={18} /> {showForm ? 'Cancel' : 'New Label'}
          </button>
        }
      />

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-lg bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 mb-6 flex items-end gap-3"
        >
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="bug, feature, urgent..." required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Color</label>
            <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              className="w-11 h-11 rounded-xl border border-gray-300 dark:border-[#1a1a1a] cursor-pointer" />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md">
            {editingId ? 'Update' : 'Create'}
          </button>
        </motion.form>
      )}

      {loading ? (
        <div className="space-y-2 max-w-lg">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] max-w-lg">
          <FiTag size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Labels</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Create labels to classify tasks.</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-lg">
          {labels.map((label) => (
            <div key={label._id} className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: label.color }} />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{label.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => startEdit(label)} className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-all">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(label._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Labels

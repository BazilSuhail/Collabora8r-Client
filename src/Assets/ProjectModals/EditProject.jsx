import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLowPriority, MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';
import { IoCheckmarkDoneCircleOutline, IoMailUnreadOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

const EditProject = ({ setShowModal, project, heading = "Modify Project Parameters" }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectManagerEmail, setProjectManagerEmail] = useState('');
  const [theme, setTheme] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setProjectManagerEmail(project.projectManager.email || project.projectManagerEmail || '');
      setTheme(project.theme || null);
    }
  }, [project]);

  const handleEditProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projects/${project._id}/update`,
        { name, description, projectManagerEmail, theme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Project parameters updated successfully!');
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setError('Failed to update project configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] flex flex-col p-8 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
      >
        <button 
          onClick={() => setShowModal(false)} 
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl dark:hover:bg-[#151515]"
        >
          <RxCross2 className="text-2xl" />
        </button>

        <header className="mb-8">
          <h3 className="text-2xl font-bold dark:text-white tracking-tight">
            {heading}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Re-evaluating operational sector directives.</p>
        </header>

        <div className="h-[1px] bg-gray-100 dark:bg-[#1a1a1a] w-full mb-8" />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold text-center">
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEditProject} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <MdOutlineSubtitles className="text-orange-500" />
              Project Designation
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all focus:ring-4 focus:ring-orange-500/5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <MdLowPriority className="text-orange-500" />
                Theme Configuration
              </label>
              <button
                type="button"
                onClick={() => setShowThemeModal(true)}
                className="w-full text-left px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent hover:border-orange-500/30 rounded-xl transition-all"
              >
                {theme !== null ? `Sector Mode ${theme}` : 'Select Operational Theme'}
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <IoMailUnreadOutline className="text-orange-500" />
                Project Lead Identification
              </label>
              <input
                type="email"
                value={projectManagerEmail}
                onChange={(e) => setProjectManagerEmail(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              <MdOutlineDescription className="text-orange-500" />
              Operational Directives
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all h-32 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
          >
            <IoCheckmarkDoneCircleOutline className="text-xl" />
            {isSubmitting ? 'Synchronizing Directives...' : 'Update Sector Parameters'}
          </button>
        </form>
      </motion.div>

      {showThemeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] w-full max-w-4xl p-8 rounded-3xl flex flex-col relative max-h-[90vh]'
          >
            <button
              onClick={() => setShowThemeModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <RxCross2 className="text-2xl" />
            </button>
            
            <h4 className="text-xl font-bold dark:text-white mb-6">Redefine environment Visuals</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 no-scrollbar">
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl border-4 transition-all ${theme === index + 1 ? 'border-orange-600' : 'border-transparent'}`}
                  onClick={() => {
                    setTheme(index + 1);
                    setShowThemeModal(false);
                  }}
                >
                  <img
                    src={`/Themes/${index + 1}.jpg`}
                    alt={`Theme ${index + 1}`}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {theme === index + 1 && (
                    <div className="absolute top-3 right-3 bg-orange-600 text-white p-1 rounded-full">
                      <IoCheckmarkDoneCircleOutline className="text-xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest">Apply Theme {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EditProject;

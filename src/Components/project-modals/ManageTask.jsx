import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserFriends } from 'react-icons/fa';
import { GrStatusInfo } from 'react-icons/gr';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdLowPriority, MdOutlineDescription, MdOutlineSubtitles, MdEvent } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const TaskModal = ({ isOpen, onClose, onSubmit, newTask, users, handleChange, editingTaskId }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl dark:hover:bg-[#151515]"
            >
              <RxCross2 className="text-2xl" />
            </button>

            <header className="mb-8">
              <h3 className="text-2xl font-bold dark:text-white tracking-tight">
                {editingTaskId ? 'Modify Directive' : 'New Directive'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign operational goals to project units.</p>
            </header>

            <div className="h-[1px] bg-gray-100 dark:bg-[#1a1a1a] w-full mb-8" />

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  <MdOutlineSubtitles className="text-orange-500" />
                  Directive Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  placeholder="Primary objective"
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <GrStatusInfo className="text-orange-500" />
                    Unit Status
                  </label>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent hover:border-orange-500/30 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <MdLowPriority className="text-orange-500" />
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent hover:border-orange-500/30 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <MdEvent className="text-orange-500" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    required
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all appearance-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <FaUserFriends className="text-orange-500" />
                    Assign To
                  </label>
                  <select
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent hover:border-orange-500/30 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Contributor</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  <MdOutlineDescription className="text-orange-500" />
                  Directive Guidelines
                </label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  placeholder="Specific requirements and success criteria..."
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/50 rounded-xl outline-none transition-all h-28 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 active:scale-[0.98]"
              >
                <IoCheckmarkDoneCircleOutline className="text-xl" />
                {editingTaskId ? 'Authorize Synchronization' : 'Authorize Directive'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;

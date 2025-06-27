import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MyTask = ({ task, user, creator }) => {
  const navigate = useNavigate();
  const handleTaskClick = () => {
    navigate(`/task/${creator._id || creator}/${task._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleTaskClick}
      className="p-6 bg-white dark:bg-[#131313] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm hover:shadow-xl hover:border-orange-500/20 dark:hover:border-orange-500/10 cursor-pointer transition-all duration-300 group mb-6"
    >
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div className="flex items-center gap-5">
          <div className='w-14 h-14 bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500'>
            <FaClipboardList className='text-3xl' />
          </div>
          <div>
            <h3 className='font-bold text-sm md:text-base text-gray-800 dark:text-gray-100 mb-2 truncate'>
              {task.title.length > 22 ? `${task.title.slice(0, 22)}...` : task.title}
            </h3>
            <div className='flex items-center gap-3'>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold  tracking-widest ${
                task.status === 'Not Started'
                  ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
                  : task.status === 'Completed'
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                    : 'text-orange-600 bg-orange-100 dark:bg-orange-500/20'
              }`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold  tracking-widest ${
                task.priority === 'High' ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 
                task.priority === 'Medium' ? 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' : 
                'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <div className='flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-600 dark:text-red-400'>
            <span className="text-[12px] font-black  tracking-tighter">Deadline</span>
            <span className='text-xs font-semibold'>{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3 group/user p-1 pl-3 pr-1 bg-gray-50 dark:bg-[#151515] rounded-xl border border-transparent group-hover:border-orange-500/20 transition-all">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Assigned:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{user.name}</span>
              <img
                src={`/avatars/${user.avatar || 1}.jpg`}
                alt={user.name}
                className="w-8 h-8 rounded-lg border-2 border-white dark:border-[#0a0a0a]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-6 pt-6 border-t border-gray-50 dark:border-[#1a1a1a] flex items-center justify-between'>
        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500 hover:text-orange-600 transition-colors">
          <FaComments className="text-lg" />
          <span className="text-xs font-bold  tracking-widest">
            {task.comments.length} Operational {task.comments.length === 1 ? 'Log' : 'Logs'}
          </span>
        </div>
        <button className="text-orange-600 text-[10px] font-black  tracking-[3px] opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          Report &rarr;
        </button>
      </div>
    </motion.div>
  );
};

const ProjectTasks = ({ creator, tasks }) => {
  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 opacity-60 grayscale scale-75'>
          <img src="/Resources/3.png" alt='No tasks' className='w-64 dark:invert brightness-0 opacity-20' />
          <p className="text-center font-bold text-gray-400 mt-4 tracking-widest  text-xs">Zero directives currently active in sector</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {tasks.map(({ task, user }) => (
                <MyTask key={task._id} creator={creator} task={task} user={user} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectTasks;

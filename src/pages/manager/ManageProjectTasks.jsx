import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import TaskModal from '../../components/project-modals/ManageTask';
import { GrChapterAdd } from 'react-icons/gr';
import { FiFolder, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { LuDoorOpen } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProjectTasks = () => {
  const { projectId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectTeam, setProjectTeam] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksResponse.data.validTasks);
        setProjectName(tasksResponse.data.projectName);
        setProjectTeam(tasksResponse.data.projectTeam);

        const usersResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/${projectId}/get-all-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks or users.');
      }
    };

    fetchTasksAndUsers();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks`,
        { ...newTask, projectId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Task created successfully.');
      setNewTask({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });

      const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data.validTasks);
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError('Failed to create task.');
    }
  };

  const handleEditTask = async (task) => {
    setEditingTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      assignedTo: task.assignedTo ? task.assignedTo._id : ''
    });
    handleOpenModal();
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/${editingTaskId}`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Task updated successfully.');
      setEditingTaskId(null);
      setNewTask({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });

      const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data.validTasks);
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Task deleted successfully.');
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTaskId(null);
    setNewTask({
      title: '',
      description: '',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '',
      assignedTo: ''
    });
  };

  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300'>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className='w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-xl text-orange-600'>
              <FiFolder />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                {projectName || 'Project'} Directives
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>Orchestrating workflow and unit assignments</p>
            </div>
          </div>
          
          {projectTeam > 0 && (
            <button 
              onClick={handleOpenModal} 
              className='flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20'
            >
              <GrChapterAdd className="text-lg text-white" />
              <span>New Directive</span>
            </button>
          )}
        </div>

        <div className='h-[1px] bg-gray-200 dark:bg-[#1a1a1a] w-full mb-8'></div>

        {projectTeam === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-dashed border-gray-200 dark:border-[#1a1a1a]'>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
              <img src="/Resources/7.png" alt="Empty Team" className="w-48 grayscale opacity-40 dark:invert brightness-0" />
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white text-center mb-2">Isolation Protocol Active</p>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-xs">You must recruit contributors to the project ecosystem before issuing directives.</p>
            <Link 
              to={`/projects/${projectId}`} 
              className="px-8 py-3 bg-white dark:bg-[#151515] text-orange-600 border border-orange-600 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
            >
              Recruit Member
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-orange-600 mb-2">
              <LuDoorOpen className='text-2xl' />
              <h3 className="text-xl font-bold">Active Directives</h3>
              <span className="ml-auto bg-gray-100 dark:bg-[#151515] text-gray-500 px-3 py-1 rounded-lg text-xs font-bold">
                {tasks.length} Total
              </span>
            </div>

            <div className='bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm overflow-hidden'>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-[#151515]/50 border-b border-gray-100 dark:border-[#1a1a1a]">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400">Directive Title</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400">Priority</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400">Assignee</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-[#1a1a1a]">
                    <AnimatePresence>
                      {tasks.map((task) => (
                        <motion.tr 
                          key={task._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="hover:bg-orange-50/30 dark:hover:bg-orange-500/5 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <p className="font-bold text-gray-800 dark:text-gray-200">
                              {task.title.length > 30 ? `${task.title.slice(0, 30)}...` : task.title}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                              task.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                              task.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                              'bg-green-100 dark:bg-green-900/30 text-green-600'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className='flex items-center gap-3'>
                              <img
                                src={`/Avatars/${task.assignedTo?.avatar || '1'}.jpg`}
                                alt={task.assignedTo?.name || 'Unassigned'}
                                className="w-8 h-8 rounded-lg border-2 border-white dark:border-[#0a0a0a] shadow-sm"
                              />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {task.assignedTo?.name || 'Unassigned'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                              task.status === 'Completed' ? 'bg-green-600 text-white' : 
                              task.status === 'In Progress' ? 'bg-orange-600 text-white' : 
                              'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all"
                                title="Edit Directive"
                              >
                                <FiEdit3 className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                title="Delete Directive"
                              >
                                <FiTrash2 className="text-lg" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {tasks.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-gray-400 font-medium">No directives currently active in the sector.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}
          newTask={newTask}
          users={users}
          handleChange={handleChange}
          editingTaskId={editingTaskId}
        />
      </div>
    </div>
  );
};

export default ManageProjectTasks;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MdTask } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/loaders/Loader';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { FaPeopleRoof } from 'react-icons/fa6';
import { GrStatusInfo } from 'react-icons/gr';
import { useAuthContext } from '../AuthProvider';
import { motion } from "framer-motion";

const STATUS_TYPES = ['Not Started', 'In Progress', 'Completed'];

const TaskCard = ({ task }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, status: task.status },
  });

  return (
    <div
      ref={drag}
      onClick={() => {
        navigate(`/task/${user._id}/${task._id}`);
      }}
      className="px-4 py-3 cursor-pointer flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg mb-4 shadow-sm group"
    >
      <div className="flex xsx:flex-row flex-col xsx:items-center xsx:justify-between gap-3">
        <h3 className="text-[17px] xsx:text-[19px] flex items-center font-bold text-gray-800 dark:text-white">
          <span className="bg-orange-100 dark:bg-orange-500/10 p-2 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
            <MdTask className="text-orange-600 text-[18px] xsx:text-[20px]" />
          </span>
          <span className="ml-3 text-sm md:text-base leading-tight">{task.title.slice(0, 40)}{task.title.length > 40 && "..."}</span>
        </h3>
        <div className='flex flex-col items-end shrink-0'>
          <p className="text-[11px] font-bold">
            <span className="text-red-500 mr-1">Due:</span>
            <span className="text-red-700 dark:text-red-400 underline">
              {task.dueDate ? new Date(task.dueDate.$date || task.dueDate).toLocaleDateString() : 'N/A'}
            </span>
          </p>
          <div className='mt-1'>
            <p className='text-[10px] px-2 py-0.5 rounded-lg text-white font-bold bg-orange-600 dark:bg-orange-700'>
              {task.projectName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Column = ({ status, tasks, moveTask }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, status),
    canDrop: (item) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} className={`w-full py-6 min-h-[500px] px-4 border border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a]/50 backdrop-blur-sm shadow-sm rounded-2xl transition-all ${isOver && canDrop ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-500 ring-2 ring-orange-500/20' : ''}`}>
      <h2 className={`text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6 inline-block
       ${status === 'Not Started'
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : status === 'Completed'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
        }`}>
        {status}
      </h2>
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} moveTask={moveTask} />
        ))}
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[999] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] p-8 w-full max-w-md rounded-2xl shadow-2xl">

        <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-gray-800 dark:text-white">
          <GrStatusInfo className='text-orange-600' />
          Confirm Status Update
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Are you sure you want to update the tasks' status? This action will reflect across all platforms.
        </p>
        <div className="flex justify-end gap-3">
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#151515] transition-colors" onClick={onClose}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-2 shadow-lg shadow-orange-600/20 transition-all" >
            <IoCheckmarkDoneCircleOutline className='text-lg' />
            Confirm Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Workflow = () => {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please sign in again.');

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/overview/assigned-tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const initialTasks = STATUS_TYPES.reduce((acc, status) => {
          acc[status] = response.data.tasks.filter(task => task.status === status);
          return acc;
        }, {});

        setTasks(initialTasks);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const moveTask = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const task = Object.values(prevTasks).flat().find(t => t._id === taskId);
      const updatedTask = { ...task, status: newStatus };

      setUpdatedTasks((prev) => ({ ...prev, [taskId]: newStatus }));

      const updatedTasks = { ...prevTasks };
      updatedTasks[task.status] = updatedTasks[task.status].filter(t => t._id !== taskId);
      updatedTasks[newStatus] = [...(updatedTasks[newStatus] || []), updatedTask];

      return updatedTasks;
    });
  };

  const handleUpdate = async () => {
    setModalOpen(true);
  };

  const confirmUpdate = async () => {
    const updates = Object.entries(updatedTasks).map(([taskId, newStatus]) => ({ id: taskId, status: newStatus }));

    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projecttasks/tasks/update`, { updates });
    } catch (error) {
      console.error('Error updating tasks:', error);
    } finally {
      setUpdatedTasks({});
      setModalOpen(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 py-20">Error: {error}</p>;

  const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto space-y-8 pt-4">
          
          {/* Page Header */}
          <header className="relative p-8 rounded-[2.5rem] bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-100 dark:border-[#1a1a1a] shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                  <FaPeopleRoof className="text-3xl" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">
                    Workflow <span className="text-orange-600">Commander</span>
                  </h1>
                  <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[4px] mt-1">
                    Synchronize task lifecycles across active sectors
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                disabled={Object.keys(updatedTasks).length === 0}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all flex items-center gap-3 shadow-xl
                  ${Object.keys(updatedTasks).length === 0 
                    ? 'bg-gray-100 dark:bg-[#151515] text-gray-400 cursor-not-allowed shadow-none border border-transparent' 
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/20 border border-orange-500'}`}
              >
                <IoCheckmarkDoneCircleOutline className="text-xl" />
                {Object.keys(updatedTasks).length > 0 ? `Push Updates (${Object.keys(updatedTasks).length})` : 'System Synchronized'}
              </motion.button>
            </div>
          </header>

          {Object.values(tasks).every((taskArray) => taskArray.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 grayscale opacity-60">
              <img src="/Resources/1.png" alt="No Intelligence" className="w-64 mb-8" />
              <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Operational Void</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Zero active task signals detected in current sectors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {STATUS_TYPES.map((status) => (
                <Column key={status} status={status} tasks={tasks[status] || []} moveTask={moveTask} />
              ))}
            </div>
          )}
        </div>

        <ConfirmationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmUpdate} />
      </div>
    </DndProvider>
  );
};

export default Workflow;

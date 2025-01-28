import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MdTask } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loader from '../Assets/Loaders/Loader';
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
      className="px-4 py-[10px] cursor-pointer flex flex-col bg-gray-50 border-[2px] rounded-lg transform transition duration-300 hover:scale-[1.01] mb-6"
    >
      <div className="flex xsx:flex-row flex-col xsx:items-center xsx:justify-between">
        <h3 className="text-[17px] xsx:text-[19px] flex items-center font-[600]">
          <span className="bg-gray-400 p-[5px] xsx:p-[8px] rounded-full">
            <MdTask className="text-white text-[17px] xsx:text-[20px]" />
          </span>
          <span className="ml-[8px] text-[16px] mt-[-3px]">{task.title.slice(0, 17) || 'Untitled Task'}{task.title.length > 15 && "..."}</span>
        </h3>
        <div className='flex flex-col items-end'>
          <p className="text-[15px] ml-[35px] xsx:ml-[45px]">
            <span className="text-red-500 font-[600] text-[12px] mr-[5px]">Due:</span>
            <span className="text-red-700 underline  text-[13px]  font-[600] rounded-xl">
              {task.dueDate ? new Date(task.dueDate.$date || task.dueDate).toLocaleDateString() : 'N/A'}
            </span>
          </p>
          <div className=' inline-block'>
            <p className='text-[10px]  inline-block text-center px-[12px] rounded-xl py-[3px] text-white font-[600]  bg-blue-800'>
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
    <div ref={drop} className={`w-full py-4 min-h-[500px] px-[12px] border  shadow-md  rounded-xl ${isOver && canDrop ? 'bg-green-200 z-[999]' : ''}`}>
      <h2 className={`text-[14px] md:text-[15px] rounded-[25px] py-[2px] font-semibold mb-4
       ${status === 'Not Started'
          ? 'bg-blue-100 text-blue-600 w-[110px] md:w-[120px] text-center'
          : status === 'Completed'
            ? 'text-green-600 bg-green-100 w-[110px] md:w-[120px] text-center'
            : 'text-yellow-600 bg-yellow-100 w-[110px] md:w-[120px] text-center'
        }`}>
        {status}
      </h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} moveTask={moveTask} />
      ))}
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[999]">
      <motion.div
        initial={{ scale: 0.7, opacity: 1, y: -500 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className="bg-white pt-8 pb-6 px-4 w-[325px] sm:w-[440px] lg:w-[520px] rounded-[8px] shadow-lg">

        <h2 className="text-[17px] font-[600] flex sm:flex-row flex-col sm:items-center mb-8">
          <GrStatusInfo className='mr-[8px] sm:mb-0 mb-[12px] text-[20px]' />Are you sure you want to update the tasks' status?</h2>
        <div className="flex justify-end">
          <button className="bg-red-800 flex items-center text-[14px] text-white mr-[8px] px-[15px] py-[4px]  duration-150 rounded-lg hover:bg-red-600" onClick={onClose}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="bg-blue-600 flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded-lg hover:bg-blue-800 duration-150" >
            <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
            Confirm
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
        console.log(initialTasks)
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

    updates.forEach(({ id, status }) => {
      console.log(`Task ID: ${id}, New Status: ${status}`);
    });

    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projecttasks/tasks/update`, { updates });
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error updating tasks:', error);
    } finally {
      setUpdatedTasks({});
      setModalOpen(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen xsx:pl-[280px] p-6 bg-gray-50">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
          <div className="flex items-center space-x-2">
            <FaPeopleRoof className="text-2xl text-gray-600" />
            <h2 className="text-[24px] text-gray-600 font-bold">Task Workflow Manager</h2>
          </div>
        </div>
        <p className='mt-[2px] text-[12px] sm:text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500'>
          Manage Statuses of all your tasks across all projects at one place.
        </p>
        <div className='w-full h-[3px] rounded-lg bg-gray-300 mb-[10px]'></div>
        {/* */}
        {Object.values(tasks).every((taskArray) => taskArray.length === 0) ?
          <div>
            <div className='flex flex-col mx-auto'>
              <div className='mx-auto'>
              <img src="/Resources/4.png" alt='Connection Error' className='scale-[0.8] mix-blend-multiply md:scale-[0.9] mt-[135px]' />
              </div>
              <p className="text-center text-gray-700 font-[600] text-[11px] md:text-[15px]">You have no tasks yet</p>
              <p className="text-center text-gray-400 font-[700] text-[11px] md:text-[13px]">This is where you will manage your .</p>
              <p className="text-center text-gray-400 font-[700] text-[11px] md:text-[13px]">tasks status across all projects.</p>
            </div>
          </div>
          :
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {STATUS_TYPES.map((status) => (
                <Column key={status} status={status} tasks={tasks[status] || []} moveTask={moveTask} />
              ))}
            </div>
            <button
              onClick={handleUpdate}
              disabled={Object.keys(updatedTasks).length === 0}
              className="bg-blue-600 mt-[25px] flex items-center duration-150 cursor-pointer text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-[#396fb6]" >
              <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
              Update Tasks
            </button>
          </>
        }

        <ConfirmationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmUpdate} />
      </div>
    </DndProvider>
  );
};



export default Workflow;

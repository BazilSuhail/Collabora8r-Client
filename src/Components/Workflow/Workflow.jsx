import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MdTask } from 'react-icons/md';
import { FaCalendarAlt, FaProjectDiagram } from 'react-icons/fa';
 
const STATUS_TYPES = ['Not Started', 'In Progress', 'Completed'];

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.id;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    throw err;
  }
}

const TaskCard = ({ task, moveTask }) => {
  const [, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, status: task.status },
  });

  return (
    <div
    ref={drag}
    className="p-6 bg-white shadow-lg rounded-lg mb-6 transition-transform transform hover:scale-105 hover:shadow-xl"
  >
    <div className="flex items-center mb-4">
      <MdTask className="text-blue-500 text-2xl mr-3" />
      <h3 className="text-2xl font-semibold text-gray-800">
        {task.title || 'Untitled Task'}
      </h3>
    </div>

    <div className="flex items-center mb-2">
      <FaProjectDiagram className="text-green-500 text-xl mr-2" />
      <p className="text-gray-600 font-medium">Project: {task.projectName}</p>
    </div>

    <div className="flex items-center">
      <FaCalendarAlt className="text-red-500 text-xl mr-2" />
      <p className="text-sm text-gray-500">
        Due: {task.dueDate
          ? new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()
          : 'N/A'}
      </p>
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
    <div ref={drop} className={`w-full py-4 pr-[15px] border-r-[3px] ${isOver && canDrop ? 'bg-green-200' : ''}`}>
      <h2 className={`text-[17px]  rounded-[25px] py-[5px] font-semibold mb-4
       ${status === 'Not Started'
        ? 'bg-blue-100 text-blue-600 w-[140px] text-center'
        : status === 'Completed'
          ? 'text-green-600 bg-green-100  w-[120px] text-center'
          : 'text-yellow-600 bg-yellow-100  w-[140px] text-center'
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Are you sure you want to update the tasks' status?</h2>
        <div className="flex justify-between">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
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

        const userId = decodeJWT(token);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/overview/assigned-tasks/${userId}`,
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

    updates.forEach(({ id, status }) => {
      console.log(`Task ID: ${id}, New Status: ${status}`);
    });

    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/projecttasks/tasks/update`, { updates });
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error updating tasks:', error);
    } finally {
      setUpdatedTasks({});
      setModalOpen(false);
    }
  };

  if (loading) return <p className="text-center">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen lg:pl-[280px] xl:pl-[287px] py-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Workflow Manager</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STATUS_TYPES.map((status) => (
            <Column key={status} status={status} tasks={tasks[status] || []} moveTask={moveTask} />
          ))}
        </div>

        <button
          onClick={handleUpdate}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={Object.keys(updatedTasks).length === 0}
        >
          Update Tasks
        </button>

        <ConfirmationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmUpdate} />
      </div>
    </DndProvider>
  );
};



export default Workflow;

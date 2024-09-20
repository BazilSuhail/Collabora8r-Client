import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Constants for task statuses
const STATUS_TYPES = ['Not Started', 'In Progress', 'Completed'];

// TaskCard Component - Draggable
const TaskCard = ({ task, index }) => (
  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`p-4 bg-white shadow-md rounded-lg mb-4 transition-transform duration-300 ${
          snapshot.isDragging ? 'opacity-50 scale-105' : 'opacity-100'
        }`}
      >
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-600">Project: {task.projectName}</p>
        <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    )}
  </Draggable>
);

// Column Component - Drop Area for tasks
const Column = ({ status, tasks }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="w-full p-4 bg-gray-100 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">{status}</h2>
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

// Main Workflow Component
const Workflow = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateButtonEnabled, setUpdateButtonEnabled] = useState(false);
  const [movedTasks, setMovedTasks] = useState([]);

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
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const moveTask = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    setMovedTasks([...movedTasks, { id: taskId, status: newStatus }]);
    setUpdateButtonEnabled(true);
  };

  const updateTasks = () => {
    alert('Tasks updated!');
    movedTasks.forEach((task) => {
      console.log(`Task ID: ${task.id}, New Status: ${task.status}`);
    });
    setUpdateButtonEnabled(false);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      moveTask(parseInt(draggableId), destination.droppableId);
    }
  };

  if (loading) return <p className="text-center">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Filter tasks by status
  const filteredTasks = (status) => tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Workflow Manager</h1>

      <div className="text-center mb-4">
        <button
          className={`px-4 py-2 rounded-lg shadow-md text-white font-semibold transition-colors duration-200 ${
            updateButtonEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={updateTasks}
          disabled={!updateButtonEnabled}
        >
          Update Tasks
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STATUS_TYPES.map((status) => (
            <Column key={status} status={status} tasks={filteredTasks(status)} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

// Helper function to decode JWT (replace this with your own implementation)
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

export default Workflow;

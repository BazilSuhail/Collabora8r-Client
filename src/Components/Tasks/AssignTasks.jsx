import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AssignTasks = () => {
  const { projectId } = useParams();
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
        const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksResponse.data);

        const usersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageusers/getallUsers`, {
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
        `${process.env.REACT_APP_API_BASE_URL}/manageTasks`,
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

      // Refresh the tasks list
      const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data);
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
      dueDate: task.dueDate.split('T')[0], // Convert to YYYY-MM-DD format
      assignedTo: task.assignedTo ? task.assignedTo._id : ''
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/manageTasks/${editingTaskId}`,
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

      // Refresh the tasks list
      const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/manageTasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Task deleted successfully.');

      // Refresh the tasks list
      const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  return (
    <div className='xsx:ml-[265px] bg-white flex flex-col p-6 rounded-lg shadow-lg'>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Assign Tasks</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    {success && <p className="text-green-500 mb-4">{success}</p>}
  
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Existing Tasks</h3>
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="text-left py-2 px-4 border-b border-gray-300 text-gray-600">Title</th>
          <th className="text-left py-2 px-4 border-b border-gray-300 text-gray-600">Description</th>
          <th className="text-left py-2 px-4 border-b border-gray-300 text-gray-600">Assigned To</th>
          <th className="text-left py-2 px-4 border-b border-gray-300 text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b border-gray-300">{task.title}</td>
            <td className="py-2 px-4 border-b border-gray-300">{task.description}</td>
            <td className="py-2 px-4 border-b border-gray-300">
              {task.assignedTo ? task.assignedTo.email : 'Unassigned'}
            </td>
            <td className="py-2 px-4 border-b border-gray-300">
              <button 
                onClick={() => handleEditTask(task)} 
                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                Edit
              </button>
              <button 
                onClick={() => handleDeleteTask(task._id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  
    <h3 className="text-lg font-semibold text-gray-700 mt-6">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h3>
    <form onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Status</label>
        <select
          name="status"
          value={newTask.status}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Priority</label>
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700">Assign To</label>
        <select
          name="assignedTo"
          value={newTask.assignedTo}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-[#072f63] text-white px-4 py-2 rounded hover:bg-[#396fb6]">
        {editingTaskId ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  </div>
  
  );
};

export default AssignTasks;

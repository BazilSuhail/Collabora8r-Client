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

  return (
    <div>
      <h2>Assign Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Existing Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>: {task.description} (Assigned to: {task.assignedTo ? task.assignedTo.email : 'Unassigned'})
          </li>
        ))}
      </ul>

      <h3>Create New Task</h3>
      <form onSubmit={handleCreateTask}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status</label>
          <select
            name="status"
            value={newTask.status}
            onChange={handleChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Assign To</label>
          <select
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={handleChange}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default AssignTasks;

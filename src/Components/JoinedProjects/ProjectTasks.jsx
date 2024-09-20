import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For retrieving projectId from URL
import axios from 'axios';

// Badge component for priority or other labels
const Badge = ({ label, type }) => {
  const badgeColor = type === 'high' ? 'bg-red-500' : type === 'medium' ? 'bg-yellow-400' : 'bg-green-500';
  return <span className={`text-xs font-bold text-white py-1 px-2 rounded ${badgeColor}`}>{label}</span>;
};

// Task Component
const Task = ({ task, user }) => (
  <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm transition-shadow hover:shadow-lg">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <Badge label={task.priority} type={task.priority.toLowerCase()} />
    </div>
    <p className="text-gray-600 mt-2">{task.description || 'No description provided'}</p>
    <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
    <div className="flex items-center mt-4">
      <img src={`/Assets/${user.avatar}.jpg`} alt={user.name} className="w-8 h-8 rounded-full border-2 border-gray-300 mr-2" />
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
  </div>
);

// Main Component to display tasks for a project
const ProjectTasks = () => {
  const { projectId } = useParams(); // Get project ID from the URL
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`);
        setProject(response.data.project);
        setTasks(response.data.tasks);
      } catch (err) {
        setError('Error fetching project tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTasks();
  }, [projectId]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-5 rounded-lg mb-6 shadow">
        <h1 className="text-2xl font-bold mb-2">{project?.name || 'Project Tasks'}</h1>
        <p className="text-gray-500">{project?.description || 'No description available'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(({ task, user }) => (
          <Task key={task._id} task={task} user={user} />
        ))}
      </div>
    </div>
  );
};

export default ProjectTasks;

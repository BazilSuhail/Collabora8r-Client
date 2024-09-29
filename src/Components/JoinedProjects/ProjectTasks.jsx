import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';

const Badge = ({ label, type }) => {
  const badgeColor = type === 'high' ? 'bg-red-500' : type === 'medium' ? 'bg-yellow-400' : 'bg-green-500';
  return <span className={`text-xs font-bold text-white py-1 px-2 rounded ${badgeColor}`}>{label}</span>;
};
 
const Task = ({ task, user,creator }) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(`/task/${creator}/${task._id}`);
  };

  return (
    <div
      onClick={handleTaskClick}
      className="p-4 mb-4 bg-white border rounded-lg shadow-sm transition-shadow hover:shadow-lg cursor-pointer"
    > 
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <Badge label={task.priority} type={task.priority.toLowerCase()} />
      </div>
 
      <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded-lg flex items-center mb-4">
        <div className="flex-shrink-0 text-blue-500 font-bold mr-2">Assigned to:</div>
        <div className="flex items-center">
          <img
            src={`/Assets/${user.avatar}.jpg`}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-blue-300 mr-3"
          />
          <div>
            <p className="text-sm font-medium text-blue-900">{user.name}</p>
            <p className="text-xs text-blue-700">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Due Date and Created Date */}
      <div className="flex justify-between text-gray-500 text-sm mb-4">
        <div>
          <p className="font-semibold">Due Date</p>
          <p>{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Created On</p>
          <p>{new Date(task.createdAt.$date || task.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="flex items-center mt-4 text-gray-600">
        <FaComments className="mr-2" />
        <span className="font-medium">
          {task.comments.length} {task.comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
    </div>
  );
};

const ProjectTasks = ({creator}) => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`);
        setTasks(response.data.tasks);
      } catch (err) {
        setError('Error fetching project tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTasks();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader border-t-transparent border-solid rounded-full border-4 border-gray-300 h-12 w-12"></div>
        <p className="ml-4">Loading tasks...</p>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found for this project.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.length} tasks
        </div>
      )}

      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map(({ task, user }) => (
            <Task key={task._id} creator={creator} task={task} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTasks;

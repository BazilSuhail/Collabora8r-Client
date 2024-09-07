import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.id;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    throw err;
  }
}

const JoinedProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [teamDetails, setTeamDetails] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [taskComments, setTaskComments] = useState({});
  const [commentContent, setCommentContent] = useState('');
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.project) {
          setProject(response.data.project);
          setTeamDetails(response.data.project.team);
        } else {
          setError('Project not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch project details.');
      }
    };

    const fetchProjectTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/projecttasks/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data.projectTasks;
        setProjectTasks(tasks);

        const taskCommentsMap = {};
        for (const task of tasks) {
          const commentsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/comments/tasks/${task._id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          taskCommentsMap[task._id] = commentsResponse.data.comments;
        }

        setTaskComments(taskCommentsMap);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch project tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
    fetchProjectTasks();
  }, [projectId]);

  const handleAddComment = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = decodeJWT(token);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`,
        { content: commentContent, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTaskComments((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), response.data.comment],
      }));
      setCommentContent('');
    } catch (err) {
      console.error(err);
      setError('Failed to add comment.');
    }
  };

  const handleEditComment = async (taskId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`,
        { content: editCommentContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTaskComments((prev) => ({
        ...prev,
        [taskId]: prev[taskId].map((comment) =>
          comment._id === commentId ? response.data.comment : comment
        ),
      }));
      setEditingCommentId(null);
      setEditCommentContent('');
    } catch (err) {
      console.error(err);
      setError('Failed to edit comment.');
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTaskComments((prev) => ({
        ...prev,
        [taskId]: prev[taskId].filter((comment) => comment._id !== commentId),
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to delete comment.');
    }
  };

  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className='xsx:ml-[265px] bg-gray-100 p-5'>
      {project ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-5 mb-5">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-5 mb-5">
            <h3 className="text-2xl font-semibold mb-3">Team Members</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {teamDetails.length > 0 ? (
                  teamDetails.map((member) => (
                    <tr key={member._id} className="border-b">
                      <td className="p-2">{member.name}</td>
                      <td className="p-2">{member.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-2 text-center">No team members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-2xl font-semibold mb-3">Project Tasks</h3>
            {projectTasks.length > 0 ? (
              projectTasks.map((task) => (
                <div key={task._id} className="mb-5">
                  <motion.div
                    className="bg-gray-50 border border-gray-300 rounded-lg p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedTaskId(selectedTaskId === task._id ? null : task._id)}
                  >
                    <h4 className="text-xl font-semibold mb-2">{task.title}</h4>
                    <p className="text-gray-600">{task.description}</p>
                  </motion.div>

                  <AnimatePresence>
                    {selectedTaskId === task._id && (
                      <motion.div
                        className="mt-3 bg-gray-50 border border-gray-300 rounded-lg p-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full mb-2"
                          />
                          <button
                            onClick={() => handleAddComment(task._id)}
                            className="bg-blue-500 text-white rounded px-4 py-2"
                          >
                            Add Comment
                          </button>
                        </div>
                        <ul className="mt-3">
                          {taskComments[task._id] &&
                            taskComments[task._id].map((comment) => (
                              <li key={comment._id} className="border-b border-gray-300 py-2">
                                {editingCommentId === comment._id ? (
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      value={editCommentContent}
                                      onChange={(e) => setEditCommentContent(e.target.value)}
                                      className="border border-gray-300 rounded p-2 w-full mr-2"
                                    />
                                    <button
                                      onClick={() => handleEditComment(task._id, comment._id)}
                                      className="bg-green-500 text-white rounded px-3 py-1"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() => setEditingCommentId(null)}
                                      className="bg-gray-500 text-white rounded px-3 py-1 ml-2"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <p>{comment.content} - {new Date(comment.createdAt).toLocaleString()} by {comment.userId.name}</p>
                                    {comment.userId._id === decodeJWT(localStorage.getItem('token')) && (
                                      <div>
                                        <button
                                          onClick={() => { setEditingCommentId(comment._id); setEditCommentContent(comment.content); }}
                                          className="text-blue-500 ml-2"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(task._id, comment._id)}
                                          className="text-red-500 ml-2"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </li>
                            ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <p>No tasks found for this project.</p>
            )}
          </div>
        </>
      ) : (
        <p>Project not available.</p>
      )}
    </div>
  );
};

export default JoinedProjectDetails;

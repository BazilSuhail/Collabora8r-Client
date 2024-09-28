import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
//import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import TeamMembers from './TeamMembers';
import ProjectTasks from './ProjectTasks';

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
  // My project Tasks
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [commentState, setCommentState] = useState({
    taskComments: {},
    commentContent: '',
    editCommentContent: '',
    editingCommentId: null,
    selectedTaskId: null,
  });
  const [error, setError] = useState({});
  const [view, setView] = useState('all');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          setError((prev) => ({ ...prev, project: 'Project not found.' }));
        }
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, project: 'Failed to fetch project details.' }));
      }
    };

    const fetchProjectTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/projecttasks/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response.data.projectTasks;
        setFilteredTasks(tasks);

        const taskCommentsMap = {};
        for (const task of tasks) {
          const commentsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/comments/tasks/${task._id}/comments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          taskCommentsMap[task._id] = commentsResponse.data.comments;
        }

        setCommentState((prev) => ({ ...prev, taskComments: taskCommentsMap }));
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, tasks: 'Failed to fetch project tasks.' }));
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
        { content: commentState.commentContent, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCommentState((prev) => ({
        ...prev,
        taskComments: {
          ...prev.taskComments,
          [taskId]: [...(prev.taskComments[taskId] || []), response.data.comment],
        },
        commentContent: '',
      }));
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, comment: 'Failed to add comment.' }));
    }
  };

  const handleEditComment = async (taskId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`,
        { content: commentState.editCommentContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCommentState((prev) => ({
        ...prev,
        taskComments: {
          ...prev.taskComments,
          [taskId]: prev.taskComments[taskId].map((comment) =>
            comment._id === commentId ? response.data.comment : comment
          ),
        },
        editingCommentId: null,
        editCommentContent: '',
      }));
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, comment: 'Failed to edit comment.' }));
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommentState((prev) => ({
        ...prev,
        taskComments: {
          ...prev.taskComments,
          [taskId]: prev.taskComments[taskId].filter((comment) => comment._id !== commentId),
        },
      }));
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, comment: 'Failed to delete comment.' }));
    }
  };

  return (
    <div className="xsx:ml-[265px] bg-gray-100 p-5">
      {project ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-5 mb-5">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p>
            {error.project && <p className="text-red-500">{error.project}</p>}
          </div>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Show Team Members
          </button>

          <TeamMembers
            teamDetails={teamDetails}
            isOpen={isModalOpen}
            onClose={closeModal}
          />

          <div className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-2xl font-semibold mb-3">Project Tasks</h3>

            <div className="mb-4">
              <button onClick={() => setView('my')} className={`mr-4 px-4 py-2 ${view === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                My Tasks
              </button>
              <button onClick={() => setView('all')} className={`px-4 py-2 ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} >
                All Tasks
              </button>
            </div>

            {view === "my" ?
              <>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task._id} className="mb-5">
                      <motion.div
                        className="bg-gray-50 border border-gray-300 rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() =>
                          setCommentState((prev) => ({
                            ...prev,
                            selectedTaskId: prev.selectedTaskId === task._id ? null : task._id,
                          }))
                        }
                      >
                        <h4 className="text-xl font-semibold mb-2">{task.title}</h4>
                        <p className="text-gray-600">{task.description}</p>
                      </motion.div>

                      <AnimatePresence>
                        {commentState.selectedTaskId === task._id && (
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
                                value={commentState.commentContent}
                                onChange={(e) =>
                                  setCommentState((prev) => ({ ...prev, commentContent: e.target.value }))
                                }
                                className="border border-gray-300 rounded p-2 w-full mb-2"
                              />
                              <button
                                onClick={() => handleAddComment(task._id)}
                                className="bg-blue-500 text-white rounded px-4 py-2"
                              >
                                Add Comment
                              </button>
                              {error.comment && <p className="text-red-500 mt-2">{error.comment}</p>}
                            </div>
                            <ul className="mt-3">
                              {commentState.taskComments[task._id] &&
                                commentState.taskComments[task._id].map((comment) => (
                                  <li key={comment._id} className="border-b border-gray-300 py-2">
                                    {commentState.editingCommentId === comment._id ? (
                                      <div>
                                        <input
                                          type="text"
                                          value={commentState.editCommentContent}
                                          onChange={(e) =>
                                            setCommentState((prev) => ({ ...prev, editCommentContent: e.target.value }))
                                          }
                                          className="border border-gray-300 rounded p-2 w-full mb-2"
                                        />
                                        <button
                                          onClick={() => handleEditComment(task._id, comment._id)}
                                          className="bg-green-500 text-white rounded px-4 py-2 mr-2"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            setCommentState((prev) => ({
                                              ...prev,
                                              editingCommentId: null,
                                              editCommentContent: '',
                                            }))
                                          }
                                          className="bg-red-500 text-white rounded px-4 py-2"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <div>
                                        <p className="text-gray-800">{comment.content}</p>
                                        <button
                                          onClick={() =>
                                            setCommentState((prev) => ({
                                              ...prev,
                                              editingCommentId: comment._id,
                                              editCommentContent: comment.content,
                                            }))
                                          }
                                          className="bg-blue-500 text-white rounded px-3 py-1 mr-2 mt-2"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(task._id, comment._id)}
                                          className="bg-red-500 text-white rounded px-3 py-1 mt-2"
                                        >
                                          Delete
                                        </button>
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
                  <p>No tasks available.</p>
                )}
              </>
              :
              <ProjectTasks />
            }
          </div>
        </>
      ) : (
        <p>Project not found.</p>
      )}
    </div>
  );
};

export default JoinedProjectDetails;
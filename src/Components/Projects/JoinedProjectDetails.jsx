import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    <div style={{ padding: '20px' }}>
      {project ? (
        <>
          <h2>Project Details</h2>
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          <h3>Team Members</h3>
          {teamDetails.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {teamDetails.map((member) => (
                <li key={member._id.toString()} style={{ marginBottom: '10px' }}>
                  <strong>{member.name}</strong> - {member.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members found.</p>
          )}

          <h3>Project Tasks</h3>
          {projectTasks.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {projectTasks.map((task) => (
                <li key={task._id.toString()} style={{ marginBottom: '20px' }}>
                  <strong>{task.title}</strong> - {task.description}
                  <div>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button onClick={() => handleAddComment(task._id)}>Comment</button>
                  </div>
                  <ul style={{ listStyleType: 'none', padding: '10px' }}>
                    {taskComments[task._id] &&
                      taskComments[task._id].map((comment) => (
                        <li key={comment._id.toString()}>
                          {editingCommentId === comment._id ? (
                            <div>
                              <input
                                type="text"
                                value={editCommentContent}
                                onChange={(e) => setEditCommentContent(e.target.value)}
                              />
                              <button onClick={() => handleEditComment(task._id, comment._id)}>Save</button>
                              <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                            </div>
                          ) : (
                            <div>
                              <p>{comment.content} - {new Date(comment.createdAt).toLocaleString()} by {comment.userId.name}</p>
                              {comment.userId._id === decodeJWT(localStorage.getItem('token')) && (
                                <div>
                                  <button onClick={() => { setEditingCommentId(comment._id); setEditCommentContent(comment.content); }}>Edit</button>
                                  <button onClick={() => handleDeleteComment(task._id, comment._id)}>Delete</button>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found for this project.</p>
          )}
        </>
      ) : (
        <p>Project not available.</p>
      )}
    </div>
  );
};

export default JoinedProjectDetails;

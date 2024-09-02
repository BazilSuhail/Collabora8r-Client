import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function decodeJWT(token) {
  try {
    // Split the token into parts (header, payload, signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (the second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Return the user ID
    return payload.id;  // Assuming 'id' is the field containing the user ID
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    throw err; // Re-throw the error for further handling
  }
}



const JoinedProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [teamDetails, setTeamDetails] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [taskComments, setTaskComments] = useState({});

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

        setProjectTasks(response.data.projectTasks);
        setUserTasks(response.data.userTaskDetails);
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
                <li key={task._id.toString()} style={{ marginBottom: '10px' }}>
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
                        <li key={comment._id.toString()}>{comment.content} - {new Date(comment.createdAt).toLocaleString()}</li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found for this project.</p>
          )}

          <h3>Your Tasks in this Project</h3>
          {userTasks.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {userTasks.map((task) => (
                <li key={task._id.toString()} style={{ marginBottom: '10px' }}>
                  <strong>Title: {task.title}</strong> -  {task.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no tasks assigned in this project.</p>
          )}
        </>
      ) : (
        <p>Project not available.</p>
      )}
    </div>
  );
};

export default JoinedProjectDetails;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = decodeJWT(token);
        setCurrentUserId(userId);

        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);

        const commentsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsResponse.data.comments);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch task details or comments.');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleAddComment = async () => {
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

      setComments((prev) => [...prev, response.data.comment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
      setError('Failed to add comment.');
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`,
        { content: editCommentContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: response.data.comment.content }
            : comment
        )
      );

      setEditCommentId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to edit comment.');
    }
  };


  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete comment.');
    }
  };

  const handleStartEditing = (comment) => {
    setEditCommentId(comment._id);
    setEditCommentContent(comment.content);
  };

  const handleCancelEditing = () => {
    setEditCommentId(null);
    setEditCommentContent('');
  };

  if (error) {
    return <p className="pl-[287px] bg-gray-100 min-h-screen p-6">{error}</p>;
  }

  if (!task) {
    return <p className="pl-[287px] bg-gray-100 min-h-screen p-6">Loading task details...</p>;
  }

  return (
    <div className="pl-[287px] bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold">{task.title}</h2>
        <p className="mt-2 text-gray-700">{task.description}</p>
        <p className="mt-2 text-gray-600">
          Status:{' '}
          <span
            className={`font-semibold ${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
              }`}
          >
            {task.status}
          </span>
        </p>
        <p className="mt-2 text-gray-600">
          Priority:{' '}
          <span
            className={`font-semibold ${task.priority === 'High'
              ? 'text-red-600'
              : task.priority === 'Medium'
                ? 'text-yellow-600'
                : 'text-green-600'
              }`}
          >
            {task.priority}
          </span>
        </p>
        <p className="mt-2 text-gray-600">Due Date: {new Date(task.dueDate.$date).toLocaleDateString()}</p>

        <h3 className="mt-4 text-lg font-semibold">Comments</h3>
        <div className="mt-2">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border p-2 rounded mb-2 bg-gray-50">
                {comment.user && (
                  <img
                    src={`/Assets/${comment.user.avatar}.jpg`}
                    alt={comment.user.name}
                    className="rounded-full w-8 h-8"
                  />
                )}
                <p className="font-semibold">
                  {comment.user ? (
                    <>
                      {comment.user.name} <span className="text-gray-500">({comment.user.email})</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Unknown User</span>
                  )}
                </p>
                {editCommentId === comment._id ? (
                  <div>
                    <textarea
                      value={editCommentContent}
                      onChange={(e) => setEditCommentContent(e.target.value)}
                      className="border p-2 w-full rounded-lg"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="bg-blue-500 text-white py-1 px-4 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="bg-gray-500 text-white py-1 px-4 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>{comment.content}</p>
                    {comment.userId === currentUserId && (
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleStartEditing(comment)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="border p-2 w-full rounded-lg"
          />
          <button
            onClick={handleAddComment}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};


export default TaskDetails;

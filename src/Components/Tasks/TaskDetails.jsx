import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPeopleFill } from 'react-icons/bs';
import { FaClipboardList, FaSnowboarding, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { LuSendHorizonal } from 'react-icons/lu';
import { IoMdDoneAll } from 'react-icons/io';

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
  const { taskId, creatorId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const [creatorName, setCreatorName] = useState('');

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

    const fetchCreatorName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/comments/${creatorId}/name`);
        setCreatorName(response.data.name);
      } catch (err) {
        setError('Failed to fetch creator name');
      }
    };

    fetchCreatorName();
    fetchTaskDetails();
  }, [taskId, creatorId]);

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
      const newComment = {
        ...response.data.comment,
        user: {
          _id: currentUserId,
          name: 'Reload Page',
          email: '',
          avatar: '1',
        },
      };

      setComments((prev) => [...prev, newComment]);
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
    return <p className="pl-[287px] bg-white min-h-screen p-6">{error}</p>;
  }

  if (!task) {
    return <p className="pl-[287px] bg-gray-100 min-h-screen p-6">Loading task details...</p>;
  }

  return (
    <main className="xsx:pl-[287px] grid lg:grid-cols-7 xsx:grid-rows-1  bg-white min-h-screen p-6">
      <section className='lg:col-span-5 lg:px-[25px]'>

        <h2 className="text-3xl flex items-center font-bold"><FaClipboardList className='text-blue-700 mr-[8px]' />{task.title}</h2>

        <div className='flex mt-[15px] items-center'>
          <h2 className="text-[19px] text-gray-500 font-[500]">{creatorName}</h2>
          <div className='w-[7px] h-[7px] mx-[8px] rounded-full bg-gray-500'></div>
          <p className="text-[17px] text-gray-500"><span className='text-[14px] text-gray-600 font-[500]'></span> {new Date(task.createdAt.$date || task.createdAt).toLocaleDateString()}</p>
        </div>

        <div className='flex justify-between mt-[12px] items-center'>
          <p
            className={`mt-2 ml-[8px] rounded-2xl py-[2px] px-[12px] font-semibold ${task.priority === 'High'
              ? 'text-red-700 bg-red-100'
              : task.priority === 'Medium'
                ? 'text-yellow-700 border bg-yellow-100'
                : 'text-green-700 bg-green-100'
              }`}
          >
            {task.priority}
          </p>
          <p className="mt-2 text-gray-600"><span className='text-[16px] mr-[4px]'>Due:</span>{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
        </div>

        <div className='h-[2px] mt-[10px] w-full bg-gray-300'></div>
        <p className="mt-2 text-gray-700">{task.description}</p>
        <div className='h-[2px] mt-[35px] w-full bg-gray-300'></div>

        {comments.length === 0 ?
          <div className="text-blue-500  w-full bg-100 flex py-[15px] pl-[6px] underline rounded-md"><FaSnowboarding className='mr-[8px] text-[25px]' />No comments yet.</div>
          :
          <div className="flex items-center mb-[20px] mt-4 text-gray-600">
            <BsPeopleFill className="mr-2 text-[20px]" />
            <span className="font-medium">
              {comments.length} {comments.length === 1 ? 'task comment' : 'task comments'}
            </span>
          </div>
        }

        <div className="mt-2 xl:ml-[70px]">
          {comments.length !== 0 && (
            comments.map((comment) => (
              <div key={comment._id} className="mb-[25px] pb-[12px] border-b-[1.2px] border-gray-300">
                <div className='flex items-center justify-between'>
                  <div className="flex items-center">
                    {comment.user && (
                      <img
                        src={`/Assets/${comment.user.avatar}.jpg`}
                        alt={comment.user.name}
                        className="w-12 h-12 shadow-md rounded-full mr-3"
                      />
                    )}
                    {comment.user ? (
                      <div>
                        <p className="text-[16px] mb-[-3px] text-gray-800 font-[600]">{comment.user.name}</p>
                        <p className="text-[14px] text-gray-600">{comment.user.email}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">Unknown User</div>
                    )}
                  </div>
                  {comment.userId === currentUserId && (
                    <div className="flex space-x-[6px] justify-end">
                      <FaUserEdit onClick={() => handleStartEditing(comment)} className='text-blue-800 bg-blue-100 rounded-lg p-[5px] text-[30px]' />
                      <FaTrashAlt onClick={() => handleDeleteComment(comment._id)} className='text-red-800 bg-red-100 rounded-lg p-[7px] text-[30px]' />
                    </div>
                  )}
                </div>

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
                    <p className='text-[14px] mt-[8px]'>{comment.content}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className='lg:col-span-2 lg:px-[8px]'>
        <div className="  px-[20px] py-[15px] mb-[25px] bg-white rounded-lg shadow-md border">
          <div className="flex items-center pb-[3px] border-b-[2px] mb-[15px] mt-4 text-gray-600">
            <IoMdDoneAll className="mr-2 text-[28px]" />
            <span className="font-medium text-[22px]">
              Task Status
            </span>
          </div>
          <div
            className={`rounded-xl text-center py-[8px] font-semibold ${task.priority === 'High'
              ? 'text-red-100 bg-red-800'
              : task.priority === 'Medium'
                ? 'text-yellow-100 border bg-yellow-800'
                : 'text-green-100 bg-green-800'
              }`}
          >
            {task.priority}
          </div>
          <button className="mt-2 text-[15px] text-white bg-blue-600 w-full rounded-md text-center py-[8px] font-semibold">
            Update Status
          </button>
          <p className='text-gray-600 mt-[10px] italic fotn-[600] text-[13px] text-center'>Task Status Cannot be Updated After the Due Date</p>
        </div>

        <div className="p-[20px] bg-white rounded-lg shadow-md border">
          <div className="flex items-center mb-[20px] mt-4 text-gray-600">
            <IoPersonSharp className="mr-2 text-[20px]" />
            <span className="font-medium">
              Add Comments to <span className='text-blue-700 underline font-[600]'>{creatorName}</span>
            </span>
          </div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="border decoration-none p-2 w-full rounded-lg"
          />
          <button className="mt-2 ml-auto" onClick={handleAddComment}>
            <LuSendHorizonal className="text-blue-500 text-[22px]" />
          </button>
        </div>
      </section>
    </main>
  );
};


export default TaskDetails;

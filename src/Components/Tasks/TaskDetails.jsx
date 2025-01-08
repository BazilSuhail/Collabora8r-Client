import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPeopleFill } from 'react-icons/bs';
import { FaClipboardList, FaRegEdit, FaSnowboarding, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { LuSendHorizonal } from 'react-icons/lu';
import { IoMdDoneAll } from 'react-icons/io';
import Loader from '../../Assets/Loader';
import { CgUiKit } from 'react-icons/cg';

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

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);

        const commentsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`, {
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
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/${creatorId}/name`);
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
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`,
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
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/${commentId}`,
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
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/${commentId}`, {
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
    return <Loader />;
  }

  return (
    <main className="xsx:pl-[287px] grid xl:grid-cols-7 grid-cols-1 pt-[35px] bg-gray-50 min-h-screen px-6">

      <section className='lg:col-span-5 xl:pr-[20px]'>
         
        <div className='bg-white p-[12px] xl:p-[25px] border rounded-[18px] '>
          
          <div className="text-[18px] md:text-[24px] flex md:flex-row flex-col md:items-center font-[600]">
            <p className='bg-blue-200 w-[50px] mr-[12px] h-[50px] rounded-full flex items-center justify-center text-[28px] text-blue-600  md:mb-0 mb-[15px] '>
              <FaClipboardList />
            </p>
            {task.title}
          </div>

          <div className='flex mt-[15px] items-center'>
            <h2 className="text-[15px] text-gray-500 font-[500]">{creatorName}</h2>
            <div className='w-[7px] h-[7px] mx-[8px] rounded-full bg-gray-500'></div>
            <p className="text-[15px] text-gray-500"><span className='text-[14px] text-gray-600 font-[500]'></span> {new Date(task.createdAt.$date || task.createdAt).toLocaleDateString()}</p>
          </div>

          <div className='flex justify-between mt-[12px] items-center'>
            <p className={`mt-2 ml-[8px] rounded-2xl py-[2px] px-[12px] font-semibold ${task.priority === 'High'
              ? 'text-red-700 bg-red-100' : task.priority === 'Medium' ? 'text-yellow-700 border bg-yellow-100'
                : 'text-green-700 bg-green-100'
              }`}>
              {task.priority}
            </p>
            <p className="mt-2 font-[600] text-gray-600"><span className='text-[14px] font-[600] text-red-500 mr-[4px]'>Due:</span>{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className='bg-white p-[12px] mt-[15px] xl:px-[35px] py-[15px] border rounded-[18px] '>
          <div className='flex  text-blue-600 items-center'>
            <CgUiKit className='text-[18px]  mr-[5px]' />
            <span className='text-[14px] font-[600]'>Task Guidelines</span>
          </div>
          <p className="mt-2 font-[500] text-[14px] pl-[22px] text-gray-500">{task.description}</p>
        </div>

        <div className='bg-white p-[12px] mt-[15px] xl:px-[35px] py-[15px] border rounded-[18px] '>
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
                          className="w-[32px] h-[32px] shadow-md rounded-full mr-3"
                        />
                      )}
                      {comment.user ? (
                        <div>
                          <p className="text-[14px] mb-[-3px] text-gray-800 font-[600]">{comment.user.name}</p>
                          <p className="text-[12px] text-gray-600">{comment.user.email}</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">Unknown User</div>
                      )}
                    </div>
                    {comment.userId === currentUserId && (
                      <div className="flex space-x-[6px] justify-end">
                        <FaRegEdit onClick={() => handleStartEditing(comment)} className='text-blue-600 text-[17px] mt-[-1px]' />
                        <FaTrashAlt onClick={() => handleDeleteComment(comment._id)} className='text-red-500 text-[15px]' />
                      </div>
                    )}
                  </div>

                  {editCommentId === comment._id ? (
                    <div className='mt-[8px]'>
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="border-[2px] h-[105px] outline-none resize-none p-2 w-full  rounded-lg"
                      />
                      <div className="flex justify-end  mt-2">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="bg-blue-600 font-[600] mr-[5px] text-white py-[2px] text-[13px] px-[15px] rounded-[6px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditing}
                          className="text-red-600 font-[600] bg-red-50 border border-red-700 py-[2px] text-[13px] px-[15px] rounded-[6px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className='text-[15px] pl-[42px] mt-[8px]'>{comment.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className='lg:col-span-2 lg:px-[8px]'>
        <div className="  px-[20px] py-[15px] mb-[25px] bg-white rounded-lg border">
          <div className="flex items-center pb-[3px] border-b-[2px] mb-[15px] mt-4 text-gray-600">
            <IoMdDoneAll className="mr-2 text-[23px]" />
            <span className="font-medium text-[17px]">
              Task Status
            </span>
          </div>
          <div
            className={`rounded-[5px] text-center py-[4px] font-[600] ${task.priority === 'High'
              ? 'text-red-100 bg-red-800'
              : task.priority === 'Medium'
                ? 'bg-yellow-100 border border-red-500 text-yellow-800'
                : 'bg-green-100  border-[2px] border-green-400 text-green-800'
              }`}
          >
            {task.priority}
          </div>
          <button className="mt-[15px] text-[15px] text-white bg-blue-600 w-full rounded-md text-center py-[8px] font-semibold">
            Update Status
          </button>
          <p className='text-gray-600 mt-[10px] italic fotn-[600] text-[13px] text-center'>Task Status Cannot be Updated After the Due Date</p>
        </div>

        <div className="p-[20px] bg-white rounded-lg border">
          <div className="flex items-center mb-[20px] mt-4 text-gray-600">
            <IoPersonSharp className="mr-2 text-[18px]" />
            <span className="font-medium text-[14px]">
              Add Comments to <span className='text-blue-700 underline font-[600]'>{creatorName}</span>
            </span>
          </div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="border outline-none px-2 pt-[4px] h-[165px]  resize-none text-[14px] w-full rounded-[7px]"
          />
          <button className="mt-2 ml-auto" onClick={handleAddComment}>
            <LuSendHorizonal className="text-blue-500 text-[20px]" />
          </button>
        </div>
      </section>
    </main>
  );
};


export default TaskDetails;

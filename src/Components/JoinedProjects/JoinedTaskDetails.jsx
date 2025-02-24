import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPeopleFill } from 'react-icons/bs';
import { FaClipboardList, FaRegEdit, FaSnowboarding, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { IoCheckmarkDoneCircleOutline, IoPersonSharp } from 'react-icons/io5';
import { LuSendHorizonal } from 'react-icons/lu';
import { IoMdDoneAll } from 'react-icons/io';
import Loader from '../../Assets/Loaders/Loader';
import { CgUiKit } from 'react-icons/cg'; 
import { RxCross2 } from 'react-icons/rx';
import { MdOutlineSubtitles } from 'react-icons/md';
import { GrStatusInfo } from 'react-icons/gr';
import { motion } from 'framer-motion';
import { useAuthContext } from '../../AuthProvider';

const JoinedTaskDetails = () => {
  const { user } = useAuthContext();
  const { taskId, creatorId } = useParams();
  const [task, setTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(1);
  const [status, setStatus] = useState("Not Started");
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        //const userId = decodeJWT(token);
        
        setCurrentUserId(user._id);

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
        //console.log(response.data)
        setTaskProgress(response.data.progress);
        setStatus(response.data.status)

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

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projecttasks/update-task-progress/${taskId}`,
        { progress: taskProgress, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTask((prev) => ({
        ...prev,
        progress: taskProgress,
        status,
      }));
      toggleModal();
    } catch (err) {
      console.error(err);
      setError("Failed to update task details.");
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      //const userId = decodeJWT(token);
      //const userId = decodeJWT(user._id);
      const userId = user._id;
      

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


  const clampedProgress = Math.min(Math.max(taskProgress, 0), 100);

  // Calculate the stroke dash offset
  const radius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

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
                          src={`/Avatars/${comment.user.avatar}.jpg`}
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
          <p className='bg-[#1eb720] '></p>
          <div className="flex justify-center items-center">
            <svg
              className="w-25 h-28 transform rotate-[-90deg]"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#1eb720"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all rounded-[25px] duration-300"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-2xl font-bold text-green-700">{clampedProgress}%</p>
            </div>
          </div>

          <div className={`rounded-[5px] mt-[10px] text-center py-[4px] font-[600] ${task.status === 'Not Started'
            ? 'text-blue-100 bg-blue-800'
            : task.status === 'In Progress'
              ? 'bg-yellow-100 border border-red-500 text-yellow-800'
              : 'bg-green-100  border-[2px] border-green-400 text-green-800'
            }`}
          >
            {task.status}
          </div>

          {task.assignedTo === user._id &&
            <button onClick={toggleModal} className="mt-[15px] text-[15px] text-white bg-blue-600 w-full rounded-md text-center py-[8px] font-semibold">
              Update Task
            </button>
          }
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="bg-white flex flex-col rounded-lg py-4 px-6 w-[315px] sm:w-[400px]">

            <RxCross2 onClick={toggleModal} className="font-[700] text-[20px] ml-auto text-gray-600 hover:text-gray-800" />
            <h3 className="text-lg font-[600] mt-[-8px] text-center text-gray-700 ">
              Edit Task
            </h3>
            <div className='w-full rounded-xl bg-gray-300 h-[2px] mt-[10px] mb-[15px]'></div>
            <div className="mb-4">
              <div className='flex items-center justify-between'>
                <div className='flex text-[17px] items-center'>
                  <MdOutlineSubtitles />
                  <p className="ml-[5px] mb-[2px] text-[15px] font-[600] text-gray-700">Progress</p>
                </div>
                <p className="text-center text-[17px] font-[600] text-green-700">{taskProgress}%</p>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={taskProgress}
                onChange={(e) => setTaskProgress(Number(e.target.value))}
                className="w-full text-green-800"
              />

            </div>
            <div className="mb-4">
              <div className='flex text-[15px] items-center'>
                <GrStatusInfo />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Status</p>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">

              <button onClick={handleSaveChanges} className="bg-[#275ca2] flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-[#396fb6]" >
                <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
                Save
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
};


export default JoinedTaskDetails;

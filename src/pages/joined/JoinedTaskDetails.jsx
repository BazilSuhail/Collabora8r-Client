import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPeopleFill, BsSend } from 'react-icons/bs';
import { FaClipboardList, FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { IoCheckmarkDoneCircleOutline, IoPersonSharp } from 'react-icons/io5';
import { IoMdDoneAll } from 'react-icons/io';
import Loader from '../../components/loaders/Loader';
import { CgUiKit } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import { MdOutlineSubtitles } from 'react-icons/md';
import { GrStatusInfo } from 'react-icons/gr';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from '../../AuthProvider';
import { PiPersonSimpleSnowboardFill } from 'react-icons/pi';

const JoinedTaskDetails = () => {
  const { user } = useAuthContext();
  const { taskId, creatorId } = useParams();
  const [task, setTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Low");
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        setCurrentUserId(user._id);

        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
        setTaskProgress(response.data.progress || 0);
        setStatus(response.data.status || "Not Started");
        setPriority(response.data.priority || "Low");

        const commentsResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(commentsResponse.data.comments);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch task details or operational logs.');
      }
    };

    const fetchCreatorName = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/${creatorId}/name`);
        setCreatorName(response.data.name);
      } catch (err) {
        setError('Failed to synchronize sector identification.');
      }
    };

    fetchCreatorName();
    fetchTaskDetails();
  }, [taskId, creatorId, user._id]);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projecttasks/update-task-progress/${taskId}`,
        { progress: taskProgress, status, priority },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTask((prev) => ({
        ...prev,
        progress: taskProgress,
        status,
        priority,
      }));
      toggleModal();
    } catch (err) {
      console.error(err);
      setError("Failed to synchronize task synchronization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/tasks/${taskId}/comments`,
        { content: commentContent, userId: currentUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newComment = {
        ...response.data.comment,
        user: {
          _id: currentUserId,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '1',
        },
      };

      setComments((prev) => [...prev, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
      setError('Failed to transmit operational log.');
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
      setError('Failed to update operational log.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Erase this operational log?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error(err);
      setError('Failed to erase operational log.');
    }
  };

  const clampedProgress = Math.min(Math.max(taskProgress, 0), 100);
  const radius = 50;
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

  if (!task && !error) return <Loader />;

  return (
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-7 gap-8 pt-4">

        <section className='lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1'>
          {/* Directive Header */}
          <div className='bg-white dark:bg-[#0a0a0a] p-6 lg:p-8 border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-sm'>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-5">
                <div className='w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl text-orange-600'>
                  <FaClipboardList />
                </div>
                <div>
                  <h1 className="text-xl lg:text-[30px] font-semibold text-gray-800 dark:text-white tracking-tighter">
                    {task.title}
                  </h1>

                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                <span className={`px-3 lg:px-4 py-1 rounded-full text-[9px] lg:text-[10px] font-black  tracking-[2px] ${task.priority === 'High' ? 'bg-red-600 text-white' :
                    task.priority === 'Medium' ? 'bg-amber-600 text-white' :
                      'bg-blue-600 text-white'
                  }`}>
                  {task.priority || 'Medium'}
                </span>

              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 mt-1'>
                <span className="text-[10px] lg:text-xs font-bold text-gray-400 dark:text-gray-500  tracking-widest">Target Sector Lead:</span>
                <span className="text-[10px] lg:text-xs font-black text-orange-600 dark:text-orange-500  underline decoration-orange-500/20 underline-offset-4">{creatorName}</span>
              </div>
              <p className="text-[10px] lg:text-xs font-bold text-gray-400 dark:text-gray-500">
                ESTABLISHED: {new Date(task.createdAt.$date || task.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-[#1a1a1a]">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-transparent">
                <div className="w-1.5 h-full bg-orange-600 rounded-full" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400  tracking-widest">Operational Deadline</p>
                  <p className="font-black text-sm lg:text-base text-gray-800 dark:text-white">{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-transparent">
                <div className="w-1.5 h-full bg-green-500 rounded-full" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400  tracking-widest">Current Authorization</p>
                  <p className="font-black text-sm lg:text-base text-gray-800 dark:text-white ">{task.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Guidelines */}
          <div className='bg-white dark:bg-[#0a0a0a] p-6 lg:p-8 border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-sm'>
            <div className='flex items-center gap-3 text-orange-600 mb-6'>
              <CgUiKit className='text-2xl' />
              <h3 className='text-sm font-black  tracking-widest'>Mission Directives</h3>
            </div>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed lg:pl-8 border-l-2 border-orange-500/20 italic">
              {task.description}
            </p>
          </div>

          {/* Operational Logs (Comments) */}
          <div className='bg-white dark:bg-[#0a0a0a] p-6 lg:p-8 border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-sm flex-1'>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-orange-600">
                <BsPeopleFill className="text-2xl" />
                <h3 className="text-sm font-black  tracking-widest">Operational Intel</h3>
                <span className="bg-gray-100 dark:bg-[#151515] text-gray-500 px-2 py-0.5 rounded text-[10px] font-black">{comments.length}</span>
              </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence>
                {comments.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center opacity-40">
                    <PiPersonSimpleSnowboardFill className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p className="text-sm font-bold tracking-widest ">Intel void detected.</p>
                  </motion.div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group relative pl-10 lg:pl-12 pb-8 border-l-2 border-gray-50 dark:border-[#1a1a1a] last:border-transparent"
                    >
                      <img
                        src={`/avatars/${comment.user?.avatar || 1}.jpg`}
                        alt=""
                        className="absolute left-[-17px] top-0 w-8 h-8 rounded-xl border-2 border-white dark:border-[#0a0a0a] shadow-md grayscale group-hover:grayscale-0 transition-all"
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div>
                          <span className="text-xs font-black text-gray-800 dark:text-gray-200  tracking-tight">
                            {comment.user?.name || 'Unknown Unit'}
                          </span>
                          <span className="mx-2 text-gray-300 hidden sm:inline">/</span>
                          <span className="text-[10px] font-bold text-gray-400 tracking-tighter  block sm:inline">{comment.user?.email || 'OFFLINE'}</span>
                        </div>
                        {comment.userId === currentUserId && (
                          <div className="flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleStartEditing(comment)} className='text-orange-500 hover:text-orange-700 transition-colors'>
                              <FaRegEdit className='text-base' />
                            </button>
                            <button onClick={() => handleDeleteComment(comment._id)} className='text-red-500 hover:text-red-700 transition-colors'>
                              <FaTrashAlt className='text-sm' />
                            </button>
                          </div>
                        )}
                      </div>

                      {editCommentId === comment._id ? (
                        <div className='mt-4 bg-gray-50 dark:bg-[#151515] p-4 rounded-2xl border border-orange-500/20'>
                          <textarea
                            value={editCommentContent}
                            onChange={(e) => setEditCommentContent(e.target.value)}
                            className="w-full bg-transparent border-none outline-none resize-none text-sm dark:text-white"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={handleCancelEditing}
                              className="px-4 py-2 text-xs font-black  text-gray-500 hover:text-gray-800"
                            >
                              Abort
                            </button>
                            <button
                              onClick={() => handleEditComment(comment._id)}
                              className="px-6 py-2 bg-orange-600 text-white text-xs font-black  rounded-lg hover:bg-orange-700 transition-all"
                            >
                              Patch
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-gray-50/50 dark:bg-[#151515]/30 p-4 rounded-2xl'>
                          {comment.content}
                        </p>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Status & Action Sidebar */}
        <section className='lg:col-span-2 lg:sticky lg:top-6 flex flex-col gap-6 order-1 lg:order-2 h-fit'>
          {/* Progress Visualizer */}
          <div className="p-6 lg:p-8 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-sm text-center">
            <div className="flex items-center gap-3 text-orange-600 mb-8 border-b border-gray-50 dark:border-[#1a1a1a] pb-4">
              <IoMdDoneAll className="text-2xl" />
              <h3 className="text-sm font-black  tracking-widest">Synchronization</h3>
            </div>

            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="w-24 h-24 lg:w-32 lg:h-32 transform -rotate-90">
                <circle
                  cx="50%" cy="50%" r="40%"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-gray-100 dark:text-[#151515]"
                />
                <circle
                  cx="50%" cy="50%" r="40%"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-green-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl lg:text-3xl font-black text-gray-800 dark:text-white">{clampedProgress}%</span>
              </div>
            </div>

            <div className={`py-2 px-4 rounded-xl text-[9px] lg:text-[10px] font-black  tracking-[2.5px] mb-6 shadow-inner ${task.status === 'Completed' ? 'bg-green-600 text-white' :
                task.status === 'In Progress' ? 'bg-orange-600 text-white' :
                  'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500'
              }`}>
              {task.status}
            </div>

            {task.assignedTo === user._id && (
              <button
                onClick={toggleModal}
                className="w-full bg-white dark:bg-[#0a0a0a] text-orange-600 border-2 border-orange-600 py-3 lg:py-4 rounded-2xl font-black text-xs  tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-95"
              >
                Modify Authorization
              </button>
            )}
            <p className='text-[9px] text-gray-400 dark:text-gray-500 mt-4 font-bold  tracking-tighter'>
              Synchronization lock initiates after deadline epoch.
            </p>
          </div>

          {/* Comment Transceiver */}
          <div className="p-6 lg:p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-6">
              <IoPersonSharp className="text-xl" />
              <h3 className="text-xs font-black  tracking-widest">Intel Transceiver</h3>
            </div>
            <div className="relative">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Log operational update..."
                className="w-full p-6 bg-gray-50/50 dark:bg-[#151515] dark:text-white border-2 border-transparent focus:border-orange-500/20 rounded-2xl outline-none transition-all h-32 lg:h-40 resize-none text-sm font-medium"
              />
              <button
                onClick={handleAddComment}
                className="absolute bottom-4 right-4 p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg active:scale-90"
              >
                <BsSend className="text-xl" />
              </button>
            </div>
            <p className="text-[9px] font-bold text-gray-400 mt-3 text-center  tracking-tighter">Transmission sent to {creatorName}</p>
          </div>
        </section>
      </div>

      {/* Synchronization Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-[1000]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md p-6 lg:p-8 relative"
            >
              <button onClick={toggleModal} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-500 transition-colors">
                <RxCross2 className="text-2xl" />
              </button>

              <header className="mb-8">
                <h3 className="text-xl lg:text-2xl font-black dark:text-white tracking-tighter">Modify Sector Directive</h3>
                <p className="text-[10px] lg:text-xs font-bold text-gray-500 dark:text-gray-400  tracking-widest mt-1">Re-evaluating operational metrics.</p>
              </header>

              <div className="h-[1px] bg-gray-100 dark:bg-[#1a1a1a] w-full mb-8" />

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className='flex items-center justify-between'>
                    <label className="flex items-center gap-2 text-[10px] lg:text-xs font-black  tracking-widest text-gray-400">
                      <MdOutlineSubtitles className="text-orange-500" />
                      Progress Synchronization
                    </label>
                    <span className="text-sm font-black text-orange-600">{taskProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={taskProgress}
                    onChange={(e) => setTaskProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 dark:bg-[#151515] rounded-full appearance-none cursor-pointer accent-orange-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] lg:text-xs font-black  tracking-widest text-gray-400">
                      <GrStatusInfo className="text-orange-500" />
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/20 rounded-xl outline-none appearance-none font-bold text-sm"
                    >
                      <option value="Not Started">NOT STARTED</option>
                      <option value="In Progress">IN PROGRESS</option>
                      <option value="Paused">PAUSED</option>
                      <option value="Completed">COMPLETED</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] lg:text-xs font-black  tracking-widest text-gray-400">
                      <MdOutlineSubtitles className="text-orange-500" />
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/20 rounded-xl outline-none appearance-none font-bold text-sm"
                    >
                      <option value="Low">LOW</option>
                      <option value="Medium">MEDIUM</option>
                      <option value="High">HIGH</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSaveChanges}
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 py-4 rounded-2xl text-white font-black text-xs  tracking-[3px] transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <IoCheckmarkDoneCircleOutline className='text-xl mr-2 inline' />
                  {isSubmitting ? 'Synchronizing...' : 'Authorize Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default JoinedTaskDetails;

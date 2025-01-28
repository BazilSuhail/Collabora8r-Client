import { motion } from 'framer-motion';
import { FaUserFriends } from 'react-icons/fa';
import { GrStatusInfo } from 'react-icons/gr';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdLowPriority, MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';

const TaskModal = ({ isOpen, onClose, onSubmit, newTask, users, handleChange, editingTaskId }) => {
  if (!isOpen) return null;

  return (
    <div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex items-center px-[15px] justify-center bg-black bg-opacity-50">
      <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute text-[28px] top-2 right-[22px] text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>
        <h3 className="text-lg font-[600] text-center text-gray-700 ">
          {editingTaskId ? 'Edit Task' : 'Create New Task'}
        </h3>
        <div className='w-full rounded-xl bg-gray-300 h-[2px] mt-[10px] mb-[15px]'></div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <div className='flex text-[15px] items-center'>
              <MdOutlineSubtitles />
              <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Title</p>
            </div>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleChange}
              className="w-full mt-1 px-[5px] py-[2px] border border-gray-400 rounded focus:ring-2 focus:outline-none"
              required
            />
          </div>

          <div className='flex items-center justify-between w-full'>
            <div className='w-[48%]'>
              <div className='flex text-[15px] items-center'>
                <GrStatusInfo />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Status</p>
              </div>
              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className="w-full mt-1 px-[5px] py-[5px] text-[14px] border border-gray-300 rounded focus:ring-2 focus:outline-none"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <div className='w-[48%]'>
              <div className='flex text-[15px] items-center'>
                <MdLowPriority />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Priority</p>
              </div>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleChange}
                className="w-full mt-1 px-[5px] py-[5px] text-[14px] border border-gray-300 rounded focus:ring-2 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className='flex items-center mb-[12px] justify-between w-full'>
            <div className='w-[48%]'>
              <div className='flex text-[15px] items-center'>
                <GrStatusInfo />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Due Date</p>
              </div>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                required
                onChange={handleChange}
                className="w-full mt-1 px-[5px] py-[5px] text-[12px] pl-[10px] outline-none font-[600] text-blue-700 border border-blue-700 rounded focus:ring-2 focus:outline-none"
              />
            </div>
            <div className='w-[48%]'>
              <div className='flex text-[15px] items-center'>
                <FaUserFriends />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Select member</p>
              </div>
              <select
                name="assignedTo"
                value={newTask.assignedTo}
                className="w-full mt-1 px-[5px] font-[600] py-[5px] text-[14px] border border-gray-300 rounded focus:ring-2 focus:outline-none"
                onChange={handleChange}
              >
                <option value="">Select member</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex text-[15px] items-center'>
            <MdOutlineDescription />
            <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Guidelines</p>
          </div>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-[#275ca2] flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-[#396fb6]"
          >
            <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
            {editingTaskId ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;

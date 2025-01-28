import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdLowPriority, MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';
import { IoCheckmarkDoneCircleOutline, IoMailUnreadOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

const EditProject = ({ setShowModal, project, heading = "Edit Project" }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectManagerEmail, setProjectManagerEmail] = useState('');
  const [theme, setTheme] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setProjectManagerEmail(project.projectManager.email || '');
      setTheme(project.theme || null);
    }
  }, [project]);

  const handleEditProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projects/${project._id}/update`,
        { name, description, projectManagerEmail, theme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Project updated successfully!');
      setShowModal(false);
    } catch (err) {
      setError('Failed to update project.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-white flex flex-col p-6 rounded-lg xl:w-[35vw] w-96"
      >
        <button onClick={() => setShowModal(false)} className="cursor-pointer ml-auto text-[22px] mt-[-5px] text-gray-500">
          <RxCross2 />
        </button>
        <h3 className="text-lg font-[600] mt-[-5px] text-center text-gray-700">
          {heading}
        </h3>
        <div className="w-full rounded-xl bg-gray-300 h-[2px] mt-[10px] mb-[15px]"></div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleEditProject}>
          <div>
            <div className="flex text-[15px] items-center">
              <MdOutlineSubtitles />
              <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Project Name</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-[5px] text-[14px] py-[2px] border border-gray-400 rounded focus:ring-2 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center mt-[18px] justify-between w-full">
            <div className="w-[48%]">
              <div className="flex text-[15px] items-center">
                <MdLowPriority />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Select Theme</p>
              </div>
              <button
                type="button"
                onClick={() => setShowThemeModal(true)}
                className="w-full mt-1 px-[5px] py-[5px] text-[14px] border border-gray-300 rounded focus:ring-2 focus:outline-none"
              >
                {theme !== null ? `Theme ${theme}` : 'Select Theme'}
              </button>
            </div>
            <div className="w-[48%]">
              <div className="flex text-[15px] items-center">
                <IoMailUnreadOutline />
                <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Manager Email</p>
              </div>
              <input
                type="email"
                value={projectManagerEmail}
                onChange={(e) => setProjectManagerEmail(e.target.value)}
                className="w-full mt-1 px-[5px] py-[5px] text-[14px] border border-gray-300 rounded focus:ring-2 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex mt-[15px] text-[15px] items-center">
            <MdOutlineDescription />
            <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Project Description</p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="bg-[#275ca2] mt-[12px] flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-[#396fb6]"
          >
            <IoCheckmarkDoneCircleOutline className="ml-[10px] mr-[5px] text-[18px]" />
            Save Changes
          </button>
        </form>
      </motion.div>

      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-55 z-[999] px-[15px] flex flex-col items-center justify-center">
          <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className='bg-white  xl:w-[60vw] xl:px-[25px] px-[8px] rounded-[8px] py-[8px] flex flex-col'
          >
          <button
            onClick={() => setShowThemeModal(false)}
            className="mb-4 text-gray-700 scale-x-[1.3] ml-auto"
          >
            X
          </button>
          <div className="grid h-[60vh] md:h-auto overflow-y-auto no-scrollbar  grid-cols-1 md:grid-cols-2 gap-4 pb-[25px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <img
                key={index}
                src={`/Themes/${index + 1}.jpg`}
                alt={`Theme ${index}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => {
                  setTheme(index+1);
                  setShowThemeModal(false);
                }}
              />
            ))}
          </div>
            </motion.div>
        </div>
      )}
    </div>
  );
};

export default EditProject;

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdLowPriority, MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';
import { IoCheckmarkDoneCircleOutline, IoMailUnreadOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

const CreateProject = ({ setShowModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectManagerEmail, setProjectManagerEmail] = useState('');
  const [theme, setTheme] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projects/create`,
        { name, description, projectManagerEmail, theme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Project created successfully!');
      setName('');
      setDescription('');
      setProjectManagerEmail('');
      setTheme(null);
      setShowModal(false);
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 12,
        }}
        className="bg-white flex flex-col p-6 rounded-lg xl:w-[35vw] w-96"
      >
        <button onClick={() => setShowModal(false)} className="cursor-pointer ml-auto text-[22px] mt-[-5px] text-gray-500">
          <RxCross2 />
        </button>
        <h3 className="text-lg font-[600] mt-[-5px] text-center text-gray-700">
          Create A New Project
        </h3>
        <div className="w-full rounded-xl bg-gray-300 h-[2px] mt-[10px] mb-[15px]"></div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleCreateProject}>
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
                {theme !== null ? `Theme ${theme + 1}` : 'Select Theme'}
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
            Create Project
          </button>
        </form>
      </motion.div>

      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[1000] flex flex-col items-center justify-center">
          <button
            onClick={() => setShowThemeModal(false)}
            className="mb-4  text-white px-4 py-2 bg-red-500 rounded"
          >
            Close
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="xl:w-[350px] w-[158px] h-32 xl:h-36 overflow-hidden rounded-lg cursor-pointer">
                <img
                  src={`/Themes/${index + 1}.jpg`}
                  alt={`Theme ${index}`}
                  className=" h-full w-[350px]"
                  onClick={() => {
                    setTheme(index);
                    setShowThemeModal(false);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;

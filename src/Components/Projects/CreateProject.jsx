import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CreateProject = ({ setShowModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectManagerEmail, setProjectManagerEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projects/create`,
        { name, description, projectManagerEmail },
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
        className="bg-white p-6 rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Create A New Project</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <form onSubmit={handleCreateProject}>
          <div className="mb-4">
            <label className="block text-gray-700">Project Name:</label>
            <input
              className="border border-gray-300 p-2 w-full rounded"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description:</label>
            <input
              className="border border-gray-300 p-2 w-full rounded"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Project Manager Email:</label>
            <input
              className="border border-gray-300 p-2 w-full rounded"
              type="email"
              value={projectManagerEmail}
              onChange={(e) => setProjectManagerEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProject;

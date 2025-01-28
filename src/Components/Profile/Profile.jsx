import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiEdit, FiSave } from 'react-icons/fi';
import Loader from '../../Assets/Loaders/Loader';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile`, config);
        setProfile(response.data);
        setSelectedAvatar(response.data.avatar); // Initialize selectedAvatar with current avatar
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const updatedProfile = { ...profile, avatar: selectedAvatar }; // Include avatar in profile update
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile`, updatedProfile, config);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating profile');
    }
  };

  const openAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const selectAvatar = (index) => {
    setSelectedAvatar(index);
    closeAvatarModal();
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className='xsx:ml-[265px] bg-white flex flex-col'>
      <div className='bg-white border border-gray-300 shadow-lg rounded-lg p-6'>
        {/* Greeting Section */} 
        {!isEditing ? (
          <div> 
            <section className="relative mb-[18px] xl:mb-[25px] w-full h-[120px] md:h-[180px] xl:h-[220px] rounded-xl overflow-hidden bg-yellow-300">
              <div className="absolute inset-0 w-full flex pt-3 items-center space-x-2 pb-[8px]">
                <img src={`/Themes/3.jpg`} alt="" className="h-[120px] md:h-[180px] xl:h-[220px] w-full object-cover" />
              </div>
 
              <div className="absolute xl:scale-[1.2] xl:pl-[125px] xl:pt-[10px] h-[120px] md:h-[180px] xl:h-[220px] inset-0 pl-[28px] w-full bg-black bg-opacity-30 z-10">
               <div className='flex mt-[20px] md:mt-[52px] w-full'>
               <img
                  src={`/Avatars/${profile.avatar}.jpg`}
                  alt="Profile Avatar"
                  className="w-[68px] h-[68px] lg:w-24 lg:h-24 rounded-full border border-gray-300 shadow-md"
                />
                <div className="flex lg:flex-row flex-col lg:items-end ml-[15px] text-[20px] lg:text-[30px] font-extrabold text-blue-200">
                  Hello, <p className="lg:ml-[15px] text-[25px]  lg:text-[40px] text-white">{profile.name}</p>
                </div>
               </div>
              </div>
            </section>
            <div className=' mb-4'>
              <div className="flex-1 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  <div className="flex items-center space-x-4 bg-gray-100 border p-4 rounded-lg shadow-sm">
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5v3c0 1.38 1.12 2.5 2.5 2.5H5c1.38 0 2.5 1.12 2.5 2.5v2c0 1.38 1.12 2.5 2.5 2.5h2c1.38 0 2.5-1.12 2.5-2.5v-2c0-1.38 1.12-2.5 2.5-2.5h.5C19.88 16.5 21 15.38 21 14v-3c0-4.28-3.455-5-5-5h-1c-1.545 0-5 .72-5 5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Full Name</h2>
                      <p className="text-gray-600">{profile.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-gray-100 border p-4 rounded-lg shadow-sm">
                    <div className="p-3 bg-blue-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4-4m0 0l-4 4m4-4v12" />
                        <path d="M16 5H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Email</h2>
                      <p className="text-gray-600">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-gray-100 border p-4 rounded-lg shadow-sm">
                    <div className="p-3 bg-green-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h2l1 2m4 0l1-2h5a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2m-2 0H3m0 0V9m0 0a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3V9a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H6" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Phone</h2>
                      <p className="text-gray-600">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-gray-100 border p-4 rounded-lg shadow-sm">
                    <div className="p-3 bg-pink-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7a4 4 0 014-4h3m-7 0a4 4 0 00-4 4v4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Gender</h2>
                      <p className="text-gray-600">{profile.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-gray-100 border p-4 rounded-lg shadow-sm">
                    <div className="p-3 bg-yellow-600 text-white rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 0v4m-4 12a4 4 0 100-8 4 4 0 000 8zm-4 1h8a2 2 0 012 2v1H6v-1a2 2 0 012-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Date of Birth</h2>
                      <p className="text-gray-600">{new Date(profile.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <button
              onClick={() => setIsEditing(true)}
              className='bg-blue-500 mt-[25px] text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center space-x-2'
            >
              <FiEdit className='w-5 h-5' />
              <span>Edit Profile</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className='space-y-4'>
            <div className='flex items-end mb-4'>
              <img
                src={`/Avatars/${selectedAvatar}.jpg`}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
              />
              <button
                type="button"
                onClick={openAvatarModal}
                className='bg-blue-900 ml-[10px] text-white px-4 py-[4px] rounded-md hover:bg-gray-600'
              >
                Change Avatar
              </button>
            </div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="gender"
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              placeholder="Phone"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="date"
              name="dob"
              value={profile.dob.split('T')[0]}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <div className='flex'>
              <button
                type="submit"
                className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center space-x-2'
              >
                <FiSave className='w-5 h-5' />
                <span>Update Profile</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className='bg-red-700 ml-[15px] text-white px-4 py-2 rounded-md shadow-md hover:bg-red-900'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <motion.div
            className='bg-white p-6 rounded-lg shadow-lg'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <h2 className='text-xl font-bold mb-4'>Select an Avatar</h2>
            <div className='grid grid-cols-3 lg:grid-cols-4 gap-4'>
              {Array.from({ length: 12 }).map((_, index) => (
                <img
                  key={index}
                  src={`/Avatars/${index + 1}.jpg`}
                  alt={`Avatar ${index + 1}`}
                  className='w-24 h-24 rounded-full border border-gray-300 shadow-md cursor-pointer hover:opacity-75'
                  onClick={() => selectAvatar(index + 1)}
                />
              ))}
            </div>
            <button
              onClick={closeAvatarModal}
              className='mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;

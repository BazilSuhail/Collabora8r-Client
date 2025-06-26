import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import Loader from '../../components/loaders/Loader';
import { IoMailOutline, IoCallOutline, IoCalendarOutline, IoPersonOutline } from 'react-icons/io5';
import { RiGenderlessLine } from 'react-icons/ri';

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
        setSelectedAvatar(response.data.avatar);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Access Denied: Intelligence extraction failed.');
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
      const updatedProfile = { ...profile, avatar: selectedAvatar };
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile`, updatedProfile, config);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Update failed: Profile synchronization error.');
    }
  };

  const selectAvatar = (index) => {
    setSelectedAvatar(index);
    setIsAvatarModalOpen(false);
  };

  if (loading) return <Loader />;

  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-4 md:p-6 transition-colors duration-300'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] shadow-sm rounded-2xl md:rounded-[2.5rem] overflow-hidden p-5 md:p-8'>
          
          <AnimatePresence mode='wait'>
            {!isEditing ? (
              <motion.div 
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Hero Profile Section */}
                <section className="relative mb-8 md:mb-10 w-full h-28 md:h-48 lg:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
                  <img src={`/themes/3.jpg`} alt="" className="w-full h-full object-cover scale-110 grayscale-[0.15]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6 lg:p-8">
                    <div className='flex items-center gap-3 md:gap-5'>
                      <div className="relative group">
                        <img
                          src={`/avatars/${profile.avatar}.jpg`}
                          alt="Profile Avatar"
                          className="w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 rounded-xl md:rounded-2xl border-2 md:border-4 border-white dark:border-[#0a0a0a] shadow-lg transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-7 md:h-7 bg-green-500 rounded-md md:rounded-lg flex items-center justify-center text-white border-2 border-white dark:border-[#0a0a0a]">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1 className="text-lg md:text-3xl lg:text-5xl font-black text-white tracking-tighter truncate">
                          {profile.name}
                        </h1>
                        <p className="text-orange-300 font-bold text-[7px] md:text-xs lg:text-sm tracking-[1.5px] md:tracking-[3px] mt-0.5 md:mt-1 opacity-80">Active Profile</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <ProfileCard icon={<IoPersonOutline />} label="Name" value={profile.name} />
                  <ProfileCard icon={<IoMailOutline />} label="Email" value={profile.email} />
                  <ProfileCard icon={<IoCallOutline />} label="Phone" value={profile.phone || 'Not Set'} />
                  <ProfileCard icon={<RiGenderlessLine />} label="Gender" value={profile.gender || 'Not Set'} />
                  <ProfileCard icon={<IoCalendarOutline />} label="Date of Birth" value={new Date(profile.dob).toLocaleDateString()} />
                  
                  {/* Edit Button */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="flex flex items-center justify-center gap-2 md:gap-4 bg-orange-600 text-white p-4 md:p-8 rounded-xl shadow-lg shadow-orange-600/20 cursor-pointer transition-all"
                  >
                    <FiEdit className="text-2xl md:text-3xl" />
                    <span className="font-black text-[9px] md:text-xs tracking-[2px] md:tracking-[3px]">Edit Profile</span>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="edit"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleUpdate} 
                className='space-y-6 md:space-y-8 max-w-2xl mx-auto py-4 md:py-8'
              >
                <header className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-black dark:text-white tracking-tighter mb-1 md:mb-2">Edit Profile</h2>
                  <p className="text-[9px] md:text-[10px] font-black text-orange-600 tracking-widest">Update your information</p>
                </header>

                <div className='flex flex-col items-center gap-6 md:gap-8 mb-10 md:mb-12'>
                  <div className="relative group">
                    <img
                      src={`/avatars/${selectedAvatar}.jpg`}
                      alt="Selected Avatar"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl md:rounded-3xl border-3 md:border-4 border-orange-600/40 shadow-md transition-all group-hover:shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className='absolute -bottom-4 md:-bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#0a0a0a] dark:text-white text-gray-800 px-5 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-xl text-[8px] md:text-xs font-bold tracking-widest shadow-lg border border-gray-200 dark:border-[#1a1a1a] hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all'
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-100 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-xl md:rounded-xl outline-none transition-all font-semibold text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest ml-1">Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-100 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-xl md:rounded-xl outline-none appearance-none font-semibold text-sm"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest ml-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-100 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-xl md:rounded-xl outline-none transition-all font-semibold text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-100 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-xl md:rounded-xl outline-none transition-all font-semibold text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest ml-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob?.split('T')[0]}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-gray-100 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-xl md:rounded-xl outline-none font-semibold text-sm"
                      required
                    />
                  </div>
                </div>

                <div className='flex gap-3 md:gap-4 pt-8 md:pt-10'>
                  <button
                    type="submit"
                    className='flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-[9px] md:text-xs tracking-wider shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 active:scale-95'
                  >
                    <FiSave className='text-base md:text-lg' />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    type="button"
                    className='px-6 md:px-8 bg-gray-200 dark:bg-[#1a1a1a] dark:text-white text-gray-800 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-[9px] md:text-xs tracking-wider hover:bg-gray-300 dark:hover:bg-[#252525] transition-all active:scale-95'
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar Selection Modal */}
        <AnimatePresence>
          {isAvatarModalOpen && (
            <div className='fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className='bg-white dark:bg-[#0a0a0a] p-4 md:p-8 rounded-2xl md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-[#1a1a1a] max-w-4xl w-full relative'
              >
                <button 
                  onClick={() => setIsAvatarModalOpen(false)}
                  className='absolute top-4 md:top-8 right-4 md:right-8 p-2 md:p-3 text-gray-400 hover:text-orange-600 transition-colors'
                >
                  <RxCross2 className="text-xl md:text-2xl" />
                </button>

                <header className="mb-6 md:mb-8">
                  <h2 className='text-xl md:text-2xl font-black dark:text-white tracking-tighter'>Choose Avatar</h2>
                  <p className='text-[9px] md:text-[10px] font-black text-orange-600 tracking-widest mt-1'>Select your profile picture</p>
                </header>

                <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6 overflow-y-auto max-h-[60vh] pr-2 md:pr-4 no-scrollbar'>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectAvatar(index + 1)}
                      className={`relative cursor-pointer rounded-lg md:rounded-2xl overflow-hidden border-3 md:border-4 transition-all ${
                        selectedAvatar === index + 1 ? 'border-orange-600' : 'border-transparent hover:border-gray-200 dark:hover:border-[#1a1a1a]'
                      }`}
                    >
                      <img
                        src={`/avatars/${index + 1}.jpg`}
                        alt={`Avatar ${index + 1}`}
                        className='w-full h-full object-cover aspect-square'
                      />
                      {selectedAvatar === index + 1 && (
                        <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                          <div className="bg-orange-600 text-white px-2 py-0.5 md:p-1 rounded-full text-[7px] md:text-xs font-bold">Selected</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProfileCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-gray-50/60 dark:bg-[#151515]/40 border border-gray-200/50 dark:border-[#1a1a1a]/60 rounded-2xl md:rounded-[2rem] hover:border-orange-500/30 hover:bg-gray-50/80 dark:hover:bg-[#151515]/60 transition-all duration-300 group">
    <div className="w-11 h-11 md:w-13 md:h-13 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg md:rounded-xl flex flex-shrink-0 items-center justify-center text-base md:text-lg text-white shadow-sm transition-transform group-hover:scale-110">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[8px] md:text-[9px] font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-1 md:mb-1.5 uppercase">{label}</p>
      <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 truncate">{value}</p>
    </div>
  </div>
);

export default Profile;

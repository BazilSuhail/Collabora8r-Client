import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiSave } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import Loader from '../../Assets/Loaders/Loader';
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
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] shadow-xl rounded-[2.5rem] overflow-hidden p-8'>
          
          <AnimatePresence mode='wait'>
            {!isEditing ? (
              <motion.div 
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Hero Profile Section */}
                <section className="relative mb-8 w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={`/Themes/3.jpg`} alt="" className="w-full h-full object-cover scale-110 grayscale-[0.2]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <div className='flex items-center gap-6'>
                      <div className="relative group">
                        <img
                          src={`/Avatars/${profile.avatar}.jpg`}
                          alt="Profile Avatar"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-white dark:border-[#0a0a0a] shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white border-2 border-white dark:border-[#0a0a0a]">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                          {profile.name}
                        </h1>
                        <p className="text-orange-500 font-black text-xs md:text-sm uppercase tracking-[4px] mt-1 opacity-80">Operational Specialist</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProfileCard icon={<IoPersonOutline />} label="Personnel Designation" value={profile.name} />
                  <ProfileCard icon={<IoMailOutline />} label="Comm Channel" value={profile.email} />
                  <ProfileCard icon={<IoCallOutline />} label="Secure Line" value={profile.phone || 'NOT SET'} />
                  <ProfileCard icon={<RiGenderlessLine />} label="Genetic Marker" value={profile.gender || 'NOT SET'} />
                  <ProfileCard icon={<IoCalendarOutline />} label="Inception Epoch" value={new Date(profile.dob).toLocaleDateString()} />
                  
                  {/* Edit Trigger Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsEditing(true)}
                    className="flex flex-col items-center justify-center gap-4 bg-orange-600 text-white p-8 rounded-[2rem] shadow-lg shadow-orange-600/20 cursor-pointer transition-all"
                  >
                    <FiEdit className="text-3xl" />
                    <span className="font-black text-xs uppercase tracking-[3px]">Modify Intelligence</span>
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
                className='space-y-8 max-w-2xl mx-auto py-8'
              >
                <header className="text-center mb-12">
                  <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase mb-2">Refine Identity</h2>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Altering personnel intelligence</p>
                </header>

                <div className='flex flex-col items-center gap-6 mb-12'>
                  <div className="relative group">
                    <img
                      src={`/Avatars/${selectedAvatar}.jpg`}
                      alt="Selected Avatar"
                      className="w-40 h-40 rounded-[2.5rem] border-4 border-orange-600/30 shadow-2xl transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className='absolute -bottom-4 bg-white dark:bg-[#151515] dark:text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border dark:border-[#1a1a1a] hover:bg-orange-600 hover:text-white transition-all'
                    >
                      Update Visual
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Designation</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/30 rounded-2xl outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Gender Classification</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/30 rounded-2xl outline-none appearance-none font-bold"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Male">MALE</option>
                      <option value="Female">FEMALE</option>
                      <option value="Other">OTHER / NON-BINARY</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Secure Line</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/30 rounded-2xl outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Comm Channel</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/30 rounded-2xl outline-none transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Inception Epoch</label>
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob?.split('T')[0]}
                      onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-[#151515] dark:text-white border border-transparent focus:border-orange-500/30 rounded-2xl outline-none font-bold"
                      required
                    />
                  </div>
                </div>

                <div className='flex gap-4 pt-8'>
                  <button
                    type="submit"
                    className='flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 active:scale-95'
                  >
                    <FiSave className='text-lg' />
                    Authorize Update
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    type="button"
                    className='px-8 bg-gray-100 dark:bg-[#151515] dark:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95'
                  >
                    Abort
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Intelligence Selection Modal */}
        <AnimatePresence>
          {isAvatarModalOpen && (
            <div className='fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className='bg-white dark:bg-[#0a0a0a] p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-[#1a1a1a] max-w-4xl w-full relative'
              >
                <button 
                  onClick={() => setIsAvatarModalOpen(false)}
                  className='absolute top-8 right-8 p-3 text-gray-400 hover:text-orange-600 transition-colors'
                >
                  <RxCross2 className="text-2xl" />
                </button>

                <header className="mb-8">
                  <h2 className='text-2xl font-black dark:text-white tracking-tighter uppercase'>Personnel Manifest</h2>
                  <p className='text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1'>Selection of visual identifiers</p>
                </header>

                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 overflow-y-auto max-h-[60vh] pr-4 no-scrollbar'>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => selectAvatar(index + 1)}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden border-4 transition-all ${
                        selectedAvatar === index + 1 ? 'border-orange-600' : 'border-transparent hover:border-gray-200 dark:hover:border-[#1a1a1a]'
                      }`}
                    >
                      <img
                        src={`/Avatars/${index + 1}.jpg`}
                        alt={`Avatar ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                      {selectedAvatar === index + 1 && (
                        <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                          <div className="bg-orange-600 text-white p-1 rounded-full text-xs">READY</div>
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
  <div className="flex items-center gap-5 p-6 bg-gray-50/50 dark:bg-[#151515]/30 border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] hover:border-orange-500/20 transition-all group">
    <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] rounded-xl flex items-center justify-center text-xl text-orange-600 shadow-sm transition-transform group-hover:scale-110">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{value}</p>
    </div>
  </div>
);

export default Profile;

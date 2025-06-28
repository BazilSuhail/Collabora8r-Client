import React, { useState } from 'react';
import { AiOutlinePhone, AiOutlineCalendar } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi'; // Icon for gender


const UserDetails = ({ onSubmit, userEmail }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail,
    gender: '',
    phone: '',
    dob: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen fixed top-0 right-0 bg-white flex items-center justify-center">
        <div className='pl-[85px]'>
        <div className="scale-[0.45]">
          <div className="animate-custom-spin">
            <div className="container">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
            </div>
          </div>
        </div>
        </div>
        <p className="mt-[145px] ml-[-60px] font-[600] text-red-700 text-[14px]">Creating <span className="text-cyan-600">Account</span><span className="text-blue-200"></span></p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-8">
      <div className="relative group">
        <div className="flex items-center gap-4">
          <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
            <AiOutlinePhone className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
          </div>
          <div className="flex-1 relative">
            <label
              htmlFor="phone"
              className="absolute -top-6 left-0 text-[10px] font-black text-orange-600 uppercase tracking-widest"
            >
              Contact Signal
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a] focus:border-orange-600 dark:focus:border-orange-600 transition-colors focus:outline-none font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600"
              required
            />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="flex items-center gap-4">
          <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
            <BiUserCircle className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
          </div>
          <div className="flex-1 relative">
            <label
              htmlFor="gender"
              className="absolute -top-6 left-0 text-[10px] font-black text-orange-600 uppercase tracking-widest"
            >
              Identity Class
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a] focus:border-orange-600 dark:focus:border-orange-600 transition-colors focus:outline-none font-bold appearance-none cursor-pointer"
              required
            >
              <option value="" className="dark:bg-[#0a0a0a]">Select Identity</option>
              <option value="Male" className="dark:bg-[#0a0a0a]">Male</option>
              <option value="Female" className="dark:bg-[#0a0a0a]">Female</option>
              <option value="Other" className="dark:bg-[#0a0a0a]">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="flex items-center gap-4">
          <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
            <AiOutlineCalendar className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
          </div>
          <div className="flex-1 relative">
            <label
              htmlFor="dob"
              className="absolute -top-6 left-0 text-[10px] font-black text-orange-600 uppercase tracking-widest"
            >
              Operational Start (DOB)
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a] focus:border-orange-600 dark:focus:border-orange-600 transition-colors focus:outline-none font-bold"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5"
      >
        Initialize Neural Profile
      </button>
    </form>
  );
};

export default UserDetails;

import React, { useState } from 'react';
import { AiOutlinePhone, AiOutlineCalendar } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi'; // Icon for gender

const UserDetails = ({ onSubmit, userEmail }) => {
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex mb-[25px] flex-col items-center"> 
      <div className="w-full relative mt-[55px] mb-6 flex items-center">
        <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'>
          <AiOutlinePhone className="text-gray-50 text-[22px]" />
        </div>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] placeholder:text-gray-600 border-gray-600 focus:outline-none"
          required
        />
      </div>

      <div className="w-full relative mt-4 mb-6 flex items-center">
        <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'>
          <BiUserCircle className="text-gray-50 text-[22px]" />
        </div>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="w-full relative mt-4 mb-6 flex items-center">
        <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'>
          <AiOutlineCalendar className="text-gray-50 text-[22px]" />
        </div>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-3 rounded-md transition-colors duration-300 flex items-center justify-center"
      >
        Create Account
      </button>
    </form>
  );
};

export default UserDetails;

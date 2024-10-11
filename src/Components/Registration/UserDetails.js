import React, { useState } from 'react';

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
    onSubmit(formData); // Pass all data back to parent component
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
       
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="mb-4 p-3 bg-gray-700 text-white rounded-md w-full"
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="mb-4 p-3 bg-gray-700 text-white rounded-md w-full"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="mb-6 p-3 bg-gray-700 text-white rounded-md w-full"
        required
      />
      <button
        type="submit"
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md"
      >
        Create Account
      </button>
    </form>
  );
};

export default UserDetails;

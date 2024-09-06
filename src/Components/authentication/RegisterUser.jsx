import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    dob: '',
    password: ''
  });
  const navigate = useNavigate();

  const { name, gender, phone, email, dob, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signup`, formData);
      localStorage.setItem('token', res.data.token);
      navigate("/login"); // Navigate to the login page after successful sign-up
    } catch (error) {
      console.error(error.response?.data?.error || 'Error during sign up');
    }
  };  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      {/* Logo and Tagline */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Collabora8r</h1>
        <p className="text-gray-400">Join us and start collaborating on your projects today</p>
      </div>

      {/* Sign-Up Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl text-center text-white mb-6">Create an Account</h2>
        
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>

        <div className="mb-4">
          <select
            name="gender"
            value={gender}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      
        <div className="mb-4">
          <input
            type="date"
            name="dob"
            value={dob}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300" 
        >
          Sign Up
        </button>
      </form>
 
    </div>
  );
};

export default Register;

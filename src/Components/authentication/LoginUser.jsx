import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signin`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/profile'); // Redirect to the profile page after sign-in
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      {/* Logo and Tagline */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Collabor8e</h1>
        <p className="text-gray-400">Collaborate seamlessly with your team on projects</p>
      </div>

      {/* Sign-In Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl text-center text-white mb-6">Sign In to Collabor8e</h2>
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
          Sign In
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-100 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form> 
    </div>
  );
};

export default SignIn;

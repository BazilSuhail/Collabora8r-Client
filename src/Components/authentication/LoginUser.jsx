import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import EmailVerificationLogo from "../../Assets/EmailVerification.svg";
import collaboratorLogo from "../../logo.png";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focusField, setFocusField] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocusField(field);
  };

  const handleBlur = () => {
    setFocusField('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signin`, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <main className='h-screen w-screen grid lg:grid-cols-2 bg-[#fafbfd] p-4'>
      <div className='items-center justify-center lg:flex hidden'>
        <img src={EmailVerificationLogo} alt="Profile" className="text-white" />
      </div>
      <div className='flex flex-col justify-center px-[18px] lg:px-[95px]'>
        <div className="flex items-center">
          <img src={collaboratorLogo} alt="Connection Failed" className="w-[38px] h-[38px]" />
          <div className="text-[#575757] ml-[4px] md:text-[25px] text-[22px] font-[700]">Collabora<span className='font-[800] text-red-600'>8</span>r</div>
        </div>

        <p className="text-gray-500 ml-[4px] my-[14px]">
          <span className='text-blue-500 font-[500] mr-[5px] text-[16px]'>Sign In</span> to collaborate seamlessly with your team on projects
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          {/* Email Field with Animated Label */}
          <div className="relative mt-4 mb-6 flex items-center">
            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
              <AiOutlineMail className="text-gray-50 text-[22px]" />
            </div>
            <div className="flex-1">
              <label
                htmlFor="email"
                className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'email' || email ? '-top-5 text-sm' : 'top-2'}`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field with Animated Label */}
          <div className="relative mt-4 mb-6 flex items-center">
            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
              <AiOutlineLock className="text-gray-50 text-[22px]" />
            </div>
            <div className="flex-1">
              <label
                htmlFor="password"
                className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'password' || password ? '-top-5 text-sm' : 'top-2'}`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
                className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full lg:w-[70%] mx-auto bg-blue-800 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300 flex items-center justify-center"
          >
            Sign In
          </button>
        </form>

        <div className='w-[92%] mx-auto font-[600] my-[15px] bg-gray-400 rounded-md h-[2px]'></div>
        <p className='mx-auto text-gray-500 font-medium'>
          Don’t have an account?
          <span onClick={() => navigate("/register")} className='text-blue-700 ml-[8px] underline cursor-pointer'>Sign Up</span>
        </p>
      </div>
    </main>
  );
};

export default SignIn;

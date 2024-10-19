import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import collaboration from "../../Assets/collaboration.webp";
import collaboratorLogo from "../../logo.png";
import { FaApple, FaGoogle } from 'react-icons/fa';
import ForgotPasswordModal from './ForgotPasswordModal';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focusField, setFocusField] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
    <main className='h-screen w-screen grid lg:grid-cols-2 bg-[#fafbfd]'>
      <div className='items-center justify-center lg:flex hidden'>
        <img src={collaboration} alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div className='flex flex-col justify-center px-[18px] md:px-[160px] lg:px-[95px] xl:px-[140px]'>
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

          <div className=' w-full flex justify-between items-center'>
          <p onClick={() => setIsModalOpen(true)} className='text-blue-700 underline text-[17px] font-[600]'>Forgot Password</p>
            <button
              type="submit"
              className="w-[140px] text-[17px] bg-blue-800 hover:bg-gray-600 text-white py-[3px] rounded-[25px] transition-colors duration-300"
            >
              Sign In
            </button>
          </div>
        </form> 
        <ForgotPasswordModal isOpen={isModalOpen} onClose={closeModal} />

        <div className='grid grid-cols-1 gap-y-[10px] mt-[18px] md:grid-cols-2 gap-x-[12px] items-center px-[15px]'>
          <div className='border-[2px] py-[12px] flex border-gray-400 rounded-[8px]'>
            <div className='w-[15%]  pl-[4px] flex justify-center items-center'>
              <FaGoogle size={24} className='text-blue-500' />
            </div>
            <div className='text-gray-500 text-[15px] w-[80%] pl-[5px]'>Continue with PlayStore</div>
          </div>

          <div className='border-[2px] py-[12px] flex bg-gray-950 rounded-[8px]'>
            <div className='w-[15%] pl-[4px] flex justify-center items-center'>
              <FaApple size={24} className='text-gray-50' />
            </div>
            <div className='text-gray-50 text-[15px] w-[80%] pl-[5px]'>Continue with AppleStore</div>
          </div>
        </div>
        <p className='mx-auto mt-[18px] text-gray-500 font-medium'>  Don’t have an account?<span onClick={() => navigate("/register")} className='text-blue-700 ml-[8px] underline'>Sign Up</span></p>

      </div>
    </main>
  );
};

export default SignIn;

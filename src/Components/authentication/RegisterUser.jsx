import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailVerification from '../Registration/EmailVerification';
import PasswordInput from '../Registration/PasswordInput';
import UserDetails from '../Registration/UserDetails';

import collaboration from "../../Assets/collaboration.webp";
import { BiCheckCircle, BiCircle } from 'react-icons/bi';

import collaboratorLogo from "../../logo.png";
import { FaApple, FaGoogle } from 'react-icons/fa';

const StepProgress = ({ step }) => {
  return (
    <div className="flex items-center mx-auto mt-[35px]">
      {/* First Step */}
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center 
          ${step >= 1 ? 'bg-green-500' : 'bg-gray-400'}`}>
          {step >= 1 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] text-center font-[600] mt-2 text-gray-500">Email Authentication</span>
      </div>

      {/* Line between steps */}
      <div className={`h-1 w-[88px] md:w-[105px] mx-2 ${step > 1 ? 'bg-green-500' : 'bg-gray-400'}`} />

      {/* Second Step */}
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center 
          ${step >= 2 ? 'bg-green-500' : 'bg-gray-400'}`}>
          {step >= 2 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] mt-2 text-center text-gray-500">Password Setup</span>
      </div>

      {/* Line between steps */}
      <div className={`h-1 w-[88px] md:w-[105px] mx-2 ${step > 2 ? 'bg-green-500' : 'bg-gray-400'}`} />

      {/* Third Step */}
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center 
          ${step >= 3 ? 'bg-green-500' : 'bg-gray-400'}`}>
          {step >= 3 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] text-center mt-2 text-gray-500">Account Creation</span>
      </div>
    </div>
  );
};



const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Store name separately
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSuccess = ({ name, email }) => { // Destructure both values
    setEmail(email);
    setName(name);
    setStep(2);
  };

  const handlePasswordNext = (password) => {
    setPassword(password);
    setStep(3);
  };

  const handleUserDetailsSubmit = async (data) => {
    try {
      console.log(data);
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signup`, {
        ...data,
        email,
        name,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data?.error || 'Error during sign up');
    }
  };

  return (

    <main className='h-screen w-screen md:scale-[1] scale-[0.9] grid lg:grid-cols-2 bg-[#fafbfd]'>
      <div className='items-center justify-center lg:flex hidden'>
        <img src={collaboration} alt="Profile" className="w-full h-full object-cover" />
      </div>

      <div className='flex flex-col justify-center px-[1px] md:px-[190px] lg:px-[115px]'>
        <div className="flex items-center">
          <img src={collaboratorLogo} alt="Connection Failed" className="w-[38px] h-[38px]" />
          <div className="text-[#575757] ml-[4px] md:text-[25px] text-[22px] font-[700]">Collabora<span className='font-[800] text-red-600'>8</span>r</div>
        </div>
        <StepProgress step={step} />
        {step === 1 && <EmailVerification onSuccess={handleEmailSuccess} />}
        {step === 2 && <PasswordInput onNext={handlePasswordNext} />}
        {step === 3 && <UserDetails userEmail={email} onSubmit={handleUserDetailsSubmit} />}

        <div className='w-[92%] mx-auto font-[600] mt-[28px] mb-[15px] bg-gray-400 rounded-md h-[2px]'></div>

        <div className='grid grid-cols-1 gap-y-[10px] md:grid-cols-2 gap-x-[12px] items-center px-[15px]'>
          <div className='border-[2px] py-[12px] flex border-gray-400 rounded-[8px]'>
            <div className='w-[20%] flex justify-center items-center'>
              <FaGoogle size={24} className='text-blue-500' />
            </div>
            <div className='text-gray-500 text-[15px] w-[80%] pl-[5px]'>Register Using PlayStore</div>
          </div>

          <div className='border-[2px] py-[12px] flex bg-gray-950 rounded-[8px]'>
            <div className='w-[20%] flex justify-center items-center'>
              <FaApple size={24} className='text-gray-50' />
            </div>
            <div className='text-gray-50 text-[15px] w-[80%] pl-[5px]'>Register Using Apple Store</div>
          </div>
        </div>
        <p className='mx-auto mt-[18px] text-gray-500 font-medium'>Already Have An Account?<span onClick={() => navigate("/login")} className='text-blue-700 ml-[8px] underline'>Sign In</span></p>
      </div>
    </main>
  );
};

export default Register;

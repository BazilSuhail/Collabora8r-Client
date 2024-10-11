import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailVerification from '../Registration/EmailVerification';
import PasswordInput from '../Registration/PasswordInput';
import UserDetails from '../Registration/UserDetails';

import EmailVerificationLogo from "../../Assets/EmailVerification.svg";
const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Store name separately
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSuccess = ({ name, email }) => { // Destructure both values
    setEmail(email);
    setName(name); // Set name state
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
        name, // Pass name in the data
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error(error.response?.data?.error || 'Error during sign up');
    }
  };

  return (

    <main className='h-screen w-screen grid grid-cols-2 bg-[#fafbfd] p-4'>
      <div className='items-center justify-center lg:flex hidden'> <img src={EmailVerificationLogo} alt="Profile" className="text-white" /></div>
      <div className='flex flex-col justify-center px-[95px]'>
        
        <div className="flex justify-between">
          <div className="text-[22px] font-bold text-[#363636]">Collabora8r</div>
        </div>
        {step === 1 && <EmailVerification onSuccess={handleEmailSuccess} />}
        {step === 2 && <PasswordInput onNext={handlePasswordNext} />}
        {step === 3 && <UserDetails userEmail={email} onSubmit={handleUserDetailsSubmit} />}
      </div>
    </main>
  );
};

export default Register;

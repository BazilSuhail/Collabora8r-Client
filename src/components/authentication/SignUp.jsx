import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import EmailVerification from './registration/EmailVerification';
import PasswordInput from './registration/PasswordInput';
import UserDetails from './registration/UserDetails';

import { BiCheckCircle, BiCircle } from 'react-icons/bi';
  

const StepProgress = ({ step }) => {
  return (
    <div className="flex items-center mx-auto mt-[15px]">
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-xl h-10 w-10 flex items-center justify-center transition-all
          ${step >= 1 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-400 dark:bg-[#1a1a1a]'}`}>
          {step >= 1 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] text-center font-bold mt-2 text-gray-500 dark:text-gray-400">Email Authentication</span>
      </div>

      {/* Line between steps */}
      <div className={`h-1 w-[88px] md:w-[105px] mx-2 rounded-full transition-all ${step > 1 ? 'bg-green-500' : 'bg-gray-400 dark:bg-[#1a1a1a]'}`} />

      {/* Second Step */}
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-xl h-10 w-10 flex items-center justify-center transition-all
          ${step >= 2 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-400 dark:bg-[#1a1a1a]'}`}>
          {step >= 2 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] mt-2 font-bold text-center text-gray-500 dark:text-gray-400">Password Setup</span>
      </div>

      {/* Line between steps */}
      <div className={`h-1 w-[88px] md:w-[105px] mx-2 rounded-full transition-all ${step > 2 ? 'bg-green-500' : 'bg-gray-400 dark:bg-[#1a1a1a]'}`} />

      {/* Third Step */}
      <div className={`flex flex-col items-center`}>
        <div className={`rounded-xl h-10 w-10 flex items-center justify-center transition-all
          ${step >= 3 ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-400 dark:bg-[#1a1a1a]'}`}>
          {step >= 3 ? <BiCheckCircle className="text-white text-2xl" /> : <BiCircle className="text-white text-2xl" />}
        </div>
        <span className="text-[11px] text-center font-bold mt-2 text-gray-500 dark:text-gray-400">Account Creation</span>
      </div>
    </div>
  );
};



const SignUp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');  
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSuccess = ({ name, email }) => { 
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
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/signup`, {
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
    <main className='h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-[#000000] transition-colors duration-300'>
      <div className='flex flex-col sm:w-[530px] xsmall:w-[355px] w-[330px]'>
        <div className="scale-[1.2] flex mx-auto">
          <img src="/logo.svg" alt="Connection Failed" className="w-[34px] h-[34px]" />
          <div className="text-[#575757] dark:text-white ml-[4px] md:text-[25px] text-[25px] font-[700]">Collabora<span className='font-[800] text-red-600'>8</span>r</div>
        </div>
        <p className='text-[15px] mb-[15px] text-center mt-[8px] text-gray-500 dark:text-gray-400 font-[400]'>Simplify Teamwork, Streamline Success</p>

        <div className='py-6 px-[25px] flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-xl transition-colors duration-300'>
         
          <div className='ml-[-8px] md:ml-0 md:scale-[1] scale-[0.6] xsmall:scale-[0.8] '>
            <StepProgress step={step} />
          </div>
          <div className="mt-6">
            {step === 1 && <EmailVerification onSuccess={handleEmailSuccess} />}
            {step === 2 && <PasswordInput onNext={handlePasswordNext} />}
            {step === 3 && <UserDetails userEmail={email} onSubmit={handleUserDetailsSubmit} />}
          </div>

          <div className='w-full flex px-[12px] md:px-[19px] mt-8 items-center space-x-2'>
            <div className='w-[47%] h-[1px] bg-[#c5c5c5] dark:bg-[#1a1a1a]'></div>
            <p className='text-gray-500 dark:text-gray-400 w-[6%] text-[14px] text-center'>OR</p>
            <div className='w-[47%] h-[1px] bg-[#c5c5c5] dark:bg-[#1a1a1a]'></div>
          </div>

          <p className='mx-auto mt-[18px] text-gray-500 dark:text-gray-400 font-medium'>Already Have An Account?<span onClick={() => navigate("/login")} className='text-orange-600 hover:cursor-pointer ml-[2px] font-bold'> Sign In </span></p>

        </div>
      </div>
    </main>
  );
};

export default SignUp;

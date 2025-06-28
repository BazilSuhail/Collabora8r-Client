import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import EmailVerification from '../../components/authentication/EmailVerification';
import PasswordInput from '../../components/authentication/PasswordInput';
import UserDetails from '../../components/authentication/UserDetails';

import { BiCheckCircle, BiCircle } from 'react-icons/bi';
  

const StepProgress = ({ step }) => {
  return (
    <div className="flex items-center justify-between gap-2 md:gap-0">
      {/* Step 1 */}
      <div className="flex flex-col items-center flex-1">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
          step >= 1 ? 'bg-green-600 shadow-lg shadow-green-600/30' : 'bg-gray-300 dark:bg-gray-700'
        }`}>
          {step >= 1 ? <BiCheckCircle className="text-white text-lg" /> : <BiCircle className="text-white text-lg" />}
        </div>
        <span className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-400 text-center">Email</span>
      </div>

      {/* Line */}
      <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${
        step > 1 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
      }`} />

      {/* Step 2 */}
      <div className="flex flex-col items-center flex-1">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
          step >= 2 ? 'bg-green-600 shadow-lg shadow-green-600/30' : 'bg-gray-300 dark:bg-gray-700'
        }`}>
          {step >= 2 ? <BiCheckCircle className="text-white text-lg" /> : <BiCircle className="text-white text-lg" />}
        </div>
        <span className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-400 text-center">Password</span>
      </div>

      {/* Line */}
      <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${
        step > 2 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700'
      }`} />

      {/* Step 3 */}
      <div className="flex flex-col items-center flex-1">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
          step >= 3 ? 'bg-green-600 shadow-lg shadow-green-600/30' : 'bg-gray-300 dark:bg-gray-700'
        }`}>
          {step >= 3 ? <BiCheckCircle className="text-white text-lg" /> : <BiCircle className="text-white text-lg" />}
        </div>
        <span className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-400 text-center">Details</span>
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
  
  console.log('%c🔐 SignUp Component Mounted', 'color: #ff6600; font-size: 12px; font-weight: bold;');

  const handleEmailSuccess = ({ name, email }) => { 
    console.log('✅ Email verified:', {name, email});
    setEmail(email);
    setName(name);
    setStep(2);
  };

  const handlePasswordNext = (password) => {
    console.log('✅ Password set');
    setPassword(password);
    setStep(3);
  };

  const handleUserDetailsSubmit = async (data) => {
    try {
      console.log('📝 Submitting account creation:', {name, email});
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/signup`, {
        ...data,
        email,
        name,
        password
      });
      localStorage.setItem('token', res.data.token);
      console.log('✅ Account created successfully');
      navigate("/login");
    } catch (error) {
      console.error('❌ Error during sign up:', error.response?.data?.error || error.message);
    }
  };
  return (
    <main className='min-h-screen overflow-hidden w-screen flex justify-center items-center bg-white dark:bg-[#000000] transition-colors duration-300 p-4'>
      <div className='w-full max-w-md'>

        <div className="text-center mb-8">
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Create account</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>Join Collabora8r and streamline teamwork</p>
        </div>

        {/* Card */}
        <div className='bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl shadow-sm p-8'>
          {/* Progress indicator */}
          <div className='mb-8'>
            <StepProgress step={step} />
          </div>

          {/* Step content */}
          <div className="">
            {step === 1 && <EmailVerification onSuccess={handleEmailSuccess} />}
            {step === 2 && <PasswordInput onNext={handlePasswordNext} />}
            {step === 3 && <UserDetails userEmail={email} onSubmit={handleUserDetailsSubmit} />}
          </div>

          {/* Divider */}
          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-gray-200 dark:bg-[#2a2a2a]'></div>
            <p className='text-xs text-gray-500 dark:text-gray-500'>or</p>
            <div className='flex-1 h-px bg-gray-200 dark:bg-[#2a2a2a]'></div>
          </div>

          {/* Sign in link */}
          <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
            Already have an account? 
            <button 
              onClick={() => navigate("/login")} 
              className='ml-1 text-orange-600 hover:text-orange-700 font-semibold transition-colors'
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;

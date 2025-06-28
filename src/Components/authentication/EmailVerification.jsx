import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { AiOutlineUser, AiOutlineMail, AiOutlineClockCircle } from 'react-icons/ai';
import axios from 'axios';
import { IoMdMailUnread } from 'react-icons/io';

const EmailVerification = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [focusField, setFocusField] = useState('');
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async () => {
    try {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Check if email exists
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/check-email`, { email });
      if (response.data.exists) { 
        setError('This email is already registered. Try signing in instead.');
        return;
      }

      // Generate OTP and log it to console
      const otpCode = generateOtp();
      setGeneratedOtp(otpCode);
      
      // Console log the OTP for testing
      console.log('✅ Verification code generated:', otpCode);
      console.log('Test email:', email);
      console.log('Test name:', name);
      
      setTimer(120);
      setIsResendDisabled(true);
      setOtpSent(true);
      setError('');
    }
    catch (error) {
      setError(error.response?.data?.message || 'Error checking email. Please try again.');
    }
  };


  const handleResendOtp = async () => {
    setOtp(new Array(6).fill(''));
    handleSendOtp();
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join(''); 

    if (otpString === generatedOtp) {
      setError('');
      console.log('✅ Verification successful!');
      onSuccess({ name, email });
    } else {
      setError('Incorrect code. Please enter the code sent to your email.');
    }
  };

  const handleFocus = (field) => {
    setFocusField(field);
  };

  const handleBlur = () => {
    setFocusField('');
  };

  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false); 
    }
    return () => clearInterval(timerId);
  }, [timer]);


  const handleOtpChange = (element, index) => {
    const value = element.value;
    const isValidCharacter = /^[0-9]$/.test(value);

    if (value && !isValidCharacter) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (e.target.value) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleOtpFocus = (e) => e.target.select();


  return (
    <div className='w-full'>
      {!otpSent ? (
        <div className='space-y-6'>
          <div className="relative group">
            <div className="flex items-center gap-3">
              <div className='w-10 h-10 bg-gray-100 dark:bg-[#151515] rounded-lg flex items-center justify-center transition-colors group-focus-within:bg-orange-100 dark:group-focus-within:bg-orange-900/20'>
                <AiOutlineUser className="text-gray-400 dark:text-orange-500 text-base group-focus-within:text-orange-600" />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="name"
                  className={`absolute left-0 font-medium text-sm transition-all duration-300 pointer-events-none ${focusField === 'name' || name ? '-top-5 text-xs text-orange-600' : 'top-2.5 text-gray-400'}`}
                >
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="w-full py-2.5 bg-transparent text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 focus:border-orange-500 transition-colors focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-3">
              <div className='w-10 h-10 bg-gray-100 dark:bg-[#151515] rounded-lg flex items-center justify-center transition-colors group-focus-within:bg-orange-100 dark:group-focus-within:bg-orange-900/20'>
                <AiOutlineMail className="text-gray-400 dark:text-orange-500 text-base group-focus-within:text-orange-600" />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="email"
                  className={`absolute left-0 font-medium text-sm transition-all duration-300 pointer-events-none ${focusField === 'email' || email ? '-top-5 text-xs text-orange-600' : 'top-2.5 text-gray-400'}`}
                >
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full py-2.5 bg-transparent text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 focus:border-orange-500 transition-colors focus:outline-none"
                />
              </div>
            </div>
          </div>
        
          {error && (
            <div className='bg-red-50 dark:bg-red-950/10 p-3 rounded-xl border border-red-200 dark:border-red-900/30'>
              <p className="text-red-700 dark:text-red-400 text-sm">✕ {error}</p>
            </div>
          )}

          <button
            onClick={handleSendOtp}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium text-sm transition-all shadow-lg shadow-orange-600/20 active:scale-95"
          >
            Send verification code
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium mb-3">
              <IoMdMailUnread size={14} />
              Verification code sent
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter the 6-digit code sent to {email}</p>
          </div>

          <div className="flex justify-center gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                inputMode="numeric"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
                onFocus={handleOtpFocus}
                className="w-11 h-12 text-center text-lg font-semibold bg-gray-100 dark:bg-[#151515] text-gray-800 dark:text-white border border-gray-300 dark:border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            {timer > 0 ? (
              <p>
                Resend code in <span className='text-orange-600 font-semibold'>{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className='text-orange-600 hover:text-orange-700 font-medium'
              >
                Resend code
              </button>
            )}
          </div>

          {error && (
            <div className='bg-red-50 dark:bg-red-950/10 p-3 rounded-xl border border-red-200 dark:border-red-900/30'>
              <p className="text-red-700 dark:text-red-400 text-xs text-center">✕ {error}</p>
            </div>
          )}

          <button
            onClick={handleVerifyOtp}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-orange-600/20 active:scale-95"
          >
            Verify code
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

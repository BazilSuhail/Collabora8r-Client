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
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleSendOtp = async () => {
    try {
      if (email === '') {
        setError('Enter Valid Name and Email Address')
        return;
      }
      if (name === '') {
        setError('Enter Valid Name and Email Address')
        return;
      }
      // Check if email exists
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/check-email`, { email });
      if (response.data.exists) { 
        setError('Email already exists. Please use another email.');
        return;
      }

      // If email doesn't exist, generate OTP and send
      const otpCode = generateOtp();
      setGeneratedOtp(otpCode);
      console.log(otpCode);
      setTimer(120);
      setIsResendDisabled(true);

      const templateParams = {
        user_name: name,
        to_name: email,
        otp_code: otpCode,
      };

      /*await emailjs.send(
        import.meta.env.VITE_REACT_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_REACT_APP_EMAILJS_USER_ID
      );*/

      setOtpSent(true);
      setError('');
    }
    catch (error) {
      setError('Email already exists. Please use another email.');

      //console.error('Error sending OTP or checking email:', error);
    }
  };


  const handleResendOtp = async () => {
    handleSendOtp();
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join(''); 
    //console.log(otpString);
    //console.log(generatedOtp);

    if (otpString == generatedOtp) {
      setError('');
      onSuccess({ name, email });
    } else {
      console.log(otpString);
      setError('Invalid OTP. Please Enter your valid email.');
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
    const value = element.value.toUpperCase();
    const isValidCharacter = /^[A-Z0-9]$/.test(value);

    if (!isValidCharacter) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    const newOtp = [...otp];

    if (e.key === 'Backspace') {
      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleOtpFocus = (e) => e.target.select();


  return (
    <div className='w-full mt-6'>
      {!otpSent ? (
        <div className='md:px-4 space-y-8'>
          <div className="relative group">
            <div className="flex items-center gap-4">
              <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
                <AiOutlineUser className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="name"
                  className={`absolute left-0 font-bold transition-all duration-300 pointer-events-none ${focusField === 'name' || name ? '-top-6 text-[10px] text-orange-600 uppercase tracking-widest' : 'top-3 text-gray-400'}`}
                >
                  Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#1a1a1a] focus:border-orange-600 transition-colors focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-4">
              <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
                <AiOutlineMail className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
              </div>
              <div className="flex-1 relative">
                <label
                  htmlFor="email"
                  className={`absolute left-0 font-bold transition-all duration-300 pointer-events-none ${focusField === 'email' || email ? '-top-6 text-[10px] text-orange-600 uppercase tracking-widest' : 'top-3 text-gray-400'}`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#1a1a1a] focus:border-orange-600 transition-colors focus:outline-none font-bold"
                />
              </div>
            </div>
          </div>
        
          {error && (
            <div className='bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-500/20'>
              <p className="text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-2">
                <span className='w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse' />
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleSendOtp}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5"
          >
            Transmission Signal
          </button>
        </div>
      ) : (
        <div className='space-y-8'>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-full mb-4">
              <IoMdMailUnread size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Verification</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Intel sent to {email}</p>
          </div>

          <div className="flex justify-center gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
                onFocus={handleOtpFocus}
                className="w-12 h-16 text-center text-xl font-black bg-gray-50 dark:bg-[#151515] text-gray-800 dark:text-white border border-gray-200 dark:border-[#1a1a1a] rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all uppercase"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <AiOutlineClockCircle className={timer > 0 ? "animate-spin-slow" : ""} />
            {timer > 0 ? (
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Resignal in <span className='text-orange-600'>{timer}s</span>
              </p>
            ) : (
              <p className='text-[10px] font-black text-green-600 uppercase tracking-widest'>Signal Path Clear</p>
            )}
          </div>

          {error && (
            <div className='bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-500/20'>
              <p className="text-red-600 dark:text-red-400 font-bold text-xs text-center">{error}</p>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <button
              onClick={handleVerifyOtp}
              className="py-4 bg-gray-800 dark:bg-[#151515] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all border border-transparent dark:border-[#1a1a1a]"
            >
              Confirm Intel
            </button>
            <button
              onClick={handleResendOtp}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                isResendDisabled 
                  ? 'bg-gray-100 dark:bg-[#121212] text-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20'
              }`}
              disabled={isResendDisabled}
            >
              New Signal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

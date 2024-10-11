import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { AiOutlineCheck, AiOutlineUser, AiOutlineMail, AiOutlineClockCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';

const EmailVerification = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    console.log(otpCode);
    setTimer(120);
    setIsResendDisabled(true);

    try {
      const templateParams = {
        user_name: name,
        to_name: email,
        otp_code: otpCode,
      };

      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      );

      setOtpSent(true);
      setError('');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      setOtpSent(true);
      console.error('EmailJS error:', error);
    }
  };

  const handleResendOtp = async () => {
    handleSendOtp();
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setError('');
      onSuccess({ name, email });
    } else {
      setError('Invalid OTP. Please try again.');
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
      setIsResendDisabled(false); // Enable resend button when timer reaches 0
    }
    return () => clearInterval(timerId);
  }, [timer]);

  return (
    <div className='w-full xl:pr-[45px]'>
      {!otpSent ? (
        <>
          <h2 className="text-2xl text-center text-white mb-6">Verify Your Email</h2>
          <div className="relative mb-4 flex items-center">
            <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'><AiOutlineUser className="text-gray-50 text-[22px]" /></div>
            <div className="flex-1">
              <label
                htmlFor="name"
                className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'name' || name ? '-top-5 text-sm' : 'top-2'
                  }`}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="relative mt-[35px] mb-4 flex items-center">
            <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'><AiOutlineMail className="text-gray-50 text-[22px]" /></div>
            <div className="flex-1">
              <label
                htmlFor="email"
                className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'email' || email ? '-top-5 text-sm' : 'top-2'
                  }`}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className="w-full py-3  bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
              />
            </div>
          </div>
          <div className='flex items-center underline justify-end'>
            <button
              onClick={handleSendOtp}
              className="hover:text-blue-100 bg-blue-700 rounded-lg text-white font-[500] px-[15px] py-[5px] transition duration-300 flex items-center justify-center"
            >
              Send OTP
              <IoSendSharp className="ml-[6px] text-[15px]" />
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl text-center text-white mb-6">Enter OTP</h2>
          <div className="relative mb-4 flex items-center">
            <AiOutlineCheck className="text-gray-600 mr-2" />
            <div className="flex-1">
              <label
                htmlFor="otp"
                className={`absolute left-8 text-gray-700 font-[600] text-[16px] transition-all duration-300 ${focusField === 'otp' || otp ? '-top-5 text-sm' : 'top-2'
                  }`}
              >
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => handleFocus('otp')}
                onBlur={handleBlur}
                className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="text-center text-gray-600 mb-4 flex justify-center items-center">
            <AiOutlineClockCircle className="text-gray-600 mr-2" />
            {timer > 0 ? (
              <p>{`Resend OTP in ${timer} seconds`}</p>
            ) : (
              <p>You can resend the OTP now!</p>
            )}
          </div>
          <div className='w-full px-[8px] flex justify-between gap-x-[6px]'>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300 mb-2 flex items-center justify-center"
            >
              Verify OTP
            </button>
            <button
              onClick={handleResendOtp}
              className={`w-full ${isResendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'} text-white py-3 rounded-md transition-colors duration-300`}
              disabled={isResendDisabled}
            >
              Resend OTP
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      )}
    </div>
  );
};

export default EmailVerification;

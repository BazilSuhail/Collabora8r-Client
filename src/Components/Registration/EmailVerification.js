import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { AiOutlineCheck } from 'react-icons/ai';  
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
    setTimer(30); // Set timer for 30 seconds
    setIsResendDisabled(true); // Disable resend button

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
    <div className='w-full'>
      <div>
        {!otpSent ? (
          <>
            <h2 className="text-2xl text-center text-white mb-6">Verify Your Email</h2>
            <div className="relative mb-4">
              <label
                htmlFor="name"
                className={`absolute left-0 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'name' || name ? '-top-5 text-sm' : 'top-2'
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
            <div className="relative mt-[35px] mb-4">
              <label
                htmlFor="email"
                className={`absolute left-0 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'email' || email ? '-top-5 text-sm' : 'top-2'
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
                className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
              />
            </div>
            <div className='flex items-center underline justify-end'>
              <button
                onClick={handleSendOtp}
                className="hover:text-blue-600 underline text-gray-700 font-[500] py-3 rounded-md transition duration-300 flex items-center justify-center"
              >
                Send OTP
                <IoSendSharp className="ml-[6px] text-[15px]" />
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl text-center text-white mb-6">Enter OTP</h2>
            <div className="relative mb-4">
              <label
                htmlFor="otp"
                className={`absolute left-0 text-gray-700 font-[600] text-[16px] transition-all duration-300 ${focusField === 'otp' || otp ? '-top-5 text-sm' : 'top-2'
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
            <div className="text-center text-gray-600 mb-4">
              {timer > 0 ? (
                <p>{`Resend OTP in ${timer} seconds`}</p>
              ) : (
                <p>You can resend the OTP now!</p>
              )}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300 mb-2 flex items-center justify-center"
            >
              <AiOutlineCheck className="mr-2" /> {/* Verify OTP icon */}
              Verify OTP
            </button>
            <button
              onClick={handleResendOtp}
              className={`w-full ${isResendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'} text-white py-3 rounded-md transition-colors duration-300`}
              disabled={isResendDisabled}
            >
              Resend OTP
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

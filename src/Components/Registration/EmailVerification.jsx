import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { AiOutlineUser, AiOutlineMail, AiOutlineClockCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';
import axios from 'axios';

const EmailVerification = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  //const [otp, setOtp] = useState('');
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
      // Check if email exists
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/check-email`, { email });
      if (response.data.exists) {
        console.log('Email already exists. Please use another email.')
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
      console.error('Error sending OTP or checking email:', error);
    }
  };


  const handleResendOtp = async () => {
    handleSendOtp();
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    
    if (otpString === generatedOtp) {
      setError(''); 
      onSuccess({ name, email });
    } else {
      console.log(otpString);
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

  const [otp, setOtp] = useState(new Array(6).fill(''));

  const handleOtpChange = (element, index) => {
    const value = element.value.toUpperCase(); // Convert to uppercase for uniformity
    const isValidCharacter = /^[A-Z0-9]$/.test(value); // Check if it's a capital letter or a number

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
    <div className='w-full'>
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
          <div>{error && <p className='bg-red-100 text-[15px] px-[10px] mb-[12px] py-[8px] text-red-700 font-[500] rounded-xl'>An account has already been registered with this Email, kindly use another one.</p>}</div>
          <button
            onClick={handleSendOtp}
            className="hover:text-blue-100 ml-auto bg-blue-700 rounded-lg text-white font-[500] px-[15px] py-[5px] transition duration-300 flex items-center justify-center"
          >
            Send OTP
            <IoSendSharp className="ml-[6px] text-[15px]" />
          </button>
        </>
      ) : (
        <>
          <div className="relative mt-[40px] mb-4 justify-center flex items-center">
            <div className="flex">
              <label htmlFor="otp" className={`absolute  text-gray-700 font-[600] text-[16px] transition-all duration-300 ${focusField === 'otp' || otp ? '-top-5 text-sm' : 'top-2'}`}>
                Enter OTP
              </label>
              <div className="flex mt-[15px] space-x-2">
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
                    className="w-12 h-16 text-center text-lg font-semibold bg-transparent text-gray-700 border-2 rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600 mb-4 flex justify-center items-center">
            <AiOutlineClockCircle className="text-gray-600 mr-2" />
            {timer > 0 ? (
              <p>Resend OTP in <span className='text-[17px] font-[600] underline text-blue-600'>{timer} seconds</span></p>
            ) : (
              <p>You can resend the OTP now!</p>
            )}
          </div>

          {error && <div className='bg-red-100 mb-[15px] mt-[8px] py-[6px] pl-[8px] rounded-lg'><p className="text-red-500 font-[500] text-[15px]">{error}</p></div>}

          <div className='w-full  px-[8px] flex justify-between gap-x-[6px]'>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white h-[45px] rounded-md transition-colors duration-300 flex items-center justify-center"
            >
              Verify OTP
            </button>
            <button
              onClick={handleResendOtp}
              className={`w-full ${isResendDisabled ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'} text-white h-[45px] rounded-md transition-colors duration-300`}
              disabled={isResendDisabled}
            >
              Resend OTP
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailVerification;

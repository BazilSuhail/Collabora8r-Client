import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
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
    <div className='w-full mt-[25px]'>
      {!otpSent ? (
        <div className='md:px-[18px]'>
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
                required
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
                required
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className="w-full py-3  bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
              />
            </div>
          </div>
        
          {error && <div className='mt-[8px] py-[6px] pl-[8px] rounded-lg'><p className="text-red-500 font-[500] text-[15px]"><span className='font-[700]'>*{" "}</span>{error}</p></div>}

          <button
            onClick={handleSendOtp}
            className="hover:text-blue-100 w-full my-[15px] bg-blue-600 rounded-lg text-white font-[500] py-[12px] transition duration-300"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className='mb-[25px]'>
          <div className="relative mt-[20px] justify-center flex items-center">
            <div className="flex">
              <label htmlFor="otp" className={`absolute flex items-center text-blue-700 font-[600] text-[16px] transition-all duration-300 ${focusField === 'otp' || otp ? '-top-5 text-sm' : 'top-2'}`}>
              <IoMdMailUnread size={20} className='mr-[5px]'/> Enter the OTP sent to your Entered Email.
              </label>
              <div className="flex mt-[35px] justify-center space-x-2">
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
                    className="lg:w-[10%] w-1/6 sm:w-[15%] h-16 text-center text-lg font-semibold bg-transparent text-gray-700 border-2 rounded-lg border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600  mb-[25px] mt-[15px] flex justify-center items-center">
            <AiOutlineClockCircle className="text-gray-600 mr-2" />
            {timer > 0 ? (
              <p>Resend OTP in <span className='text-[17px] font-[600] underline text-blue-600'>{timer} seconds</span></p>
            ) : (
              <p className='text-[14px] font-[600]'>You can resend the OTP now!</p>
            )}
          </div>

          {error && <div className='mb-[15px] mt-[8px] py-[6px] pl-[8px] rounded-lg'><p className="text-red-500 font-[500] text-[15px]"><span className='font-[700]'>*{" "}</span>{error}</p></div>}

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
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

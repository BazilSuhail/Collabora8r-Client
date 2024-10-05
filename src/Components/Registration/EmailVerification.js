import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailVerification = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const generateOtp = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const handleSendOtp = async () => {
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    console.log(otpCode);

    try {
      const templateParams = {
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
      console.log(`OTP sent to ${email}: ${otpCode}`); // For testing purpose
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      setOtpSent(true);
      console.error('EmailJS error:', error);
    }
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setError('');
      onSuccess(); // Call success callback
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        {!otpSent ? (
          <>
            <h2 className="text-2xl text-center text-white mb-6">Verify Your Email</h2>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl text-center text-white mb-6">Enter OTP</h2>
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors duration-300"
            >
              Verify OTP
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;

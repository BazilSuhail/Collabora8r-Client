import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { AiOutlineCheck, AiOutlineUser, AiOutlineMail, AiOutlineClockCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';
import axios from 'axios';
import { ImCross } from 'react-icons/im';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [focusField, setFocusField] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    // Generate a 6-character OTP
    const generateOtp = () => {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    };

    const handleSendOtp = async () => {
        if (!email) {
            setError('Please enter your email.');
            return;
        }

        try {
            // Check if email exists
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/forgot-password`, { email });
            if (!response.data.success) {
                setError('Email does not exist. Please check and try again.');
                return;
            }

            const otpCode = generateOtp();
            setGeneratedOtp(otpCode);
            console.log(otpSent);
            setTimer(120);
            setIsResendDisabled(true);

            const templateParams = {
                user_name: email,
                to_name: email,
                otp_code: otpCode,
            };

            await emailjs.send(
                import.meta.env.VITE_REACT_APP_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_REACT_APP_EMAILJS_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_REACT_APP_EMAILJS_USER_ID
            );


            setOtpSent(true);
            setError('');
            setStep(2);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
            console.error('Error sending OTP or checking email:', err);
        }
    };

    const handleResendOtp = async () => {
        handleSendOtp();
    };

    const handleVerifyOtp = () => {
        if (otp === generatedOtp) {
            setError('');
            setStep(3);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Please enter and confirm your new password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/reset-password`, {
                email,
                newPassword,
            });

            setError('');
            alert('Password reset successfully!');
            onClose();
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            console.error('Error resetting password:', err);
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

    if (!isOpen) return null;

    return (
        <div className="fixed w-screen h-screen z-50 flex items-center justify-center bg-black bg-opacity-50">
           
           <div className='lg:w-[450px] w-[320px] sm:w-[300px] '>
           <motion.div
                initial={{ y: '-100vh', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100vh', opacity: 0 }}
                className="bg-white rounded-lg shadow-lg  p-6"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <ImCross size={18} />
                </button>

                {step === 1 && (
                    <>
                        <h2 className="text-2xl text-center text-gray-800 mb-6">Forgot Password</h2>
                        <div className="relative mb-4 flex items-center">
                            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
                                <AiOutlineMail className="text-gray-50 text-[22px]" />
                            </div>
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
                                    className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="bg-red-100 text-[15px] px-[10px] mb-[12px] py-[8px] text-red-700 font-[500] rounded-xl">
                                {error}
                            </p>
                        )}
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-[500] px-[15px] py-[10px] transition duration-300 flex items-center justify-center"
                        >
                            Send OTP <IoSendSharp className="ml-2 text-[20px]" />
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-2xl text-center text-gray-800 mb-6">Verify OTP</h2>
                        <div className="relative mb-4 flex items-center">
                            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
                                <AiOutlineCheck className="text-gray-50 text-[22px]" />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="otp"
                                    className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'otp' || otp ? '-top-5 text-sm' : 'top-2'
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
                                <p>
                                    Resend OTP in{' '}
                                    <span className="text-[17px] font-[600] underline text-blue-600">
                                        {timer} seconds
                                    </span>
                                </p>
                            ) : (
                                <p>You can resend the OTP now!</p>
                            )}
                        </div>
                        {error && (
                            <div className="bg-red-100 mb-4 py-2 px-3 rounded-lg">
                                <p className="text-red-700 font-[500] text-[15px]">{error}</p>
                            </div>
                        )}
                        <div className="w-full flex justify-between gap-2">
                            <button
                                onClick={handleVerifyOtp}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white h-[45px] rounded-md transition-colors duration-300 flex items-center justify-center"
                            >
                                Verify OTP
                            </button>
                            <button
                                onClick={handleResendOtp}
                                className={`w-full ${isResendDisabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-700 hover:bg-blue-600'
                                    } text-white h-[45px] rounded-md transition-colors duration-300`}
                                disabled={isResendDisabled}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-2xl text-center text-gray-800 mb-6">Reset Password</h2>
                        <div className="relative mb-4 flex items-center">
                            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
                                <AiOutlineUser className="text-gray-50 text-[22px]" />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="newPassword"
                                    className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'newPassword' || newPassword ? '-top-5 text-sm' : 'top-2'
                                        }`}
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onFocus={() => handleFocus('newPassword')}
                                    onBlur={handleBlur}
                                    className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="relative mb-4 flex items-center">
                            <div className="bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]">
                                <AiOutlineUser className="text-gray-50 text-[22px]" />
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="confirmPassword"
                                    className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'confirmPassword' || confirmPassword
                                        ? '-top-5 text-sm'
                                        : 'top-2'
                                        }`}
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => handleFocus('confirmPassword')}
                                    onBlur={handleBlur}
                                    className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-100 mb-4 py-2 px-3 rounded-lg">
                                <p className="text-red-700 font-[500] text-[15px]">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleResetPassword}
                            className="w-full bg-green-700 hover:bg-green-600 text-white rounded-lg font-[500] px-[15px] py-[10px] transition duration-300 flex items-center justify-center"
                        >
                            Reset Password
                        </button>
                    </>
                )}
            </motion.div>
           </div>
        </div>
    );
};

export default ForgotPasswordModal;

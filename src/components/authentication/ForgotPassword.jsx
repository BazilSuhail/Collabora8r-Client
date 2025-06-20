import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { AiOutlineCheck, AiOutlineUser, AiOutlineMail, AiOutlineClockCircle } from 'react-icons/ai';
import { IoSendSharp } from 'react-icons/io5';
import axios from 'axios';
import { FaThinkPeaks } from 'react-icons/fa';

const ForgotPassword = ({ isOpen, onClose }) => {
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
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/forgot-password`, { email });
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
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/auth/reset-password`, {
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
        <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className='w-full max-w-[450px]'>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.2, 0.8, 0.2, 1],
                    }}
                    className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl flex flex-col py-8 px-6 lg:px-8 border border-gray-100 dark:border-[#1a1a1a]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-orange-600 rounded-full" />
                            <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">Reset Uplink</h2>
                        </div>
                        <button onClick={onClose}
                            className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"
                        >
                            <RxCross2 className="text-2xl" />
                        </button>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Identify your credentials to initialize recovery protocol.</p>
                            
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Personnel Identifier (Email)</label>
                                <div className="flex items-center bg-gray-50 dark:bg-[#151515] rounded-2xl p-4 border-2 border-transparent group-focus-within:border-orange-500/20 transition-all">
                                    <AiOutlineMail className="text-gray-400 text-xl mr-3" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent w-full text-gray-800 dark:text-white outline-none font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-600 uppercase bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleSendOtp}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-[3px] py-4 transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Send Security Token <IoSendSharp className="text-lg" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Verify authorization token sent to your terminal.</p>
                            
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Security Token (OTP)</label>
                                <div className="flex items-center bg-gray-50 dark:bg-[#151515] rounded-2xl p-4 border-2 border-transparent group-focus-within:border-orange-500/20 transition-all">
                                    <AiOutlineCheck className="text-gray-400 text-xl mr-3" />
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="bg-transparent w-full text-gray-800 dark:text-white outline-none font-bold text-sm tracking-[5px]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-gray-500 bg-gray-50 dark:bg-[#151515] py-3 rounded-2xl">
                                <AiOutlineClockCircle className="text-lg" />
                                {timer > 0 ? (
                                    <p className="text-[10px] font-black uppercase tracking-widest">
                                        Re-authorization available in <span className="text-orange-600">{timer}S</span>
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Token reload available</p>
                                )}
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-600 uppercase bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl">
                                    {error}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest py-4 transition-all active:scale-95"
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={handleResendOtp}
                                    disabled={isResendDisabled}
                                    className={`w-full ${isResendDisabled ? 'opacity-50 grayscale cursor-not-allowed' : 'bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#252525] text-gray-800 dark:text-white'} rounded-2xl font-black text-xs uppercase tracking-widest py-4 transition-all active:scale-95`}
                                >
                                    Resend
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Protocol success. Establish new security credentials.</p>
                            
                            <div className="space-y-4">
                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">New Access Key</label>
                                    <div className="flex items-center bg-gray-50 dark:bg-[#151515] rounded-2xl p-4 border-2 border-transparent group-focus-within:border-orange-500/20 transition-all">
                                        <AiOutlineUser className="text-gray-400 text-xl mr-3" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="bg-transparent w-full text-gray-800 dark:text-white outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Confirm Access Key</label>
                                    <div className="flex items-center bg-gray-50 dark:bg-[#151515] rounded-2xl p-4 border-2 border-transparent group-focus-within:border-orange-500/20 transition-all">
                                        <AiOutlineUser className="text-gray-400 text-xl mr-3" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="bg-transparent w-full text-gray-800 dark:text-white outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs font-bold text-red-600 uppercase bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleResetPassword}
                                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-[3px] py-4 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                            >
                                Secure New Credentials
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;

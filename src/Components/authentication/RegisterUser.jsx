import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EmailVerification from '../Registration/EmailVerification';
import PasswordInput from '../Registration/PasswordInput';
import UserDetails from '../Registration/UserDetails';

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSuccess = (email) => {
    console.log("hehe mail ="+ email);
    setEmail(email);
    setStep(2);
  };

  const handlePasswordNext = (password) => {
    setPassword(password);
    setStep(3);
  };

  const handleUserDetailsSubmit = async (data) => {
    try {
      console.log(data);
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signup`, {
        ...data,
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error(error.response?.data?.error || 'Error during sign up');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      {step === 1 && <EmailVerification onSuccess={handleEmailSuccess} />}
      {step === 2 && <PasswordInput onNext={handlePasswordNext} />}
      {step === 3 && <UserDetails userEmail={email} onSubmit={handleUserDetailsSubmit} />}
    </div>
  );
};

export default Register;

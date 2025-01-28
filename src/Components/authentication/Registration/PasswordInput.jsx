import React, { useState } from 'react';
import { AiOutlineLock } from 'react-icons/ai';

const PasswordInput = ({ onNext }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusField, setFocusField] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length >= 6 && password === confirmPassword) {
      onNext(password);
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    } else {
      alert("Password must be at least 6 characters.");
    }
  };

  const handleFocus = (field) => {
    setFocusField(field);
  };

  const handleBlur = () => {
    setFocusField('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center"> 
      <div className="w-full relative mt-[55px] mb-4 flex items-center">
        <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'>
          <AiOutlineLock className="text-gray-50 text-[22px]" />
        </div>
        <div className="flex-1">
          <label
            htmlFor="password"
            className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'password' || password ? '-top-5 text-sm' : 'top-2'}`}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            className="w-full py-3 bg-transparent text-gray-700 border-b-[2px] border-gray-600 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="w-full mt-[15px] relative mb-6 flex items-center">
        <div className='bg-gray-400 mr-2 rounded-full flex items-center justify-center w-[40px] h-[40px]'>
          <AiOutlineLock className="text-gray-50 text-[22px]" />
        </div>
        <div className="flex-1">
          <label
            htmlFor="confirmPassword"
            className={`absolute left-12 text-gray-900 font-[600] text-[16px] transition-all duration-300 ${focusField === 'confirmPassword' || confirmPassword ? '-top-5 text-sm' : 'top-2'}`}
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
            required
          />
        </div>
      </div>
 
        <button
          type="submit"
          className="hover:text-green-400 w-full my-[15px] bg-green-700 rounded-lg text-white font-[500] py-[12px] transition duration-300"
          > 
          Confirm Password
        </button> 
    </form>
  );
};

export default PasswordInput;

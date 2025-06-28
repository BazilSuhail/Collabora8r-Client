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
    <form onSubmit={handleSubmit} className="w-full mt-6 space-y-8"> 
      <div className="relative group">
        <div className="flex items-center gap-4">
          <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
            <AiOutlineLock className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
          </div>
          <div className="flex-1 relative">
            <label
              htmlFor="password"
              className={`absolute left-0 font-bold transition-all duration-300 pointer-events-none ${focusField === 'password' || password ? '-top-6 text-[10px] text-orange-600 uppercase tracking-widest' : 'top-3 text-gray-400'}`}
            >
              Access Secret
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a] focus:border-orange-600 dark:focus:border-orange-600 transition-colors focus:outline-none font-bold"
              required
            />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="flex items-center gap-4">
          <div className='w-12 h-12 bg-gray-100 dark:bg-[#151515] rounded-xl flex items-center justify-center transition-colors group-focus-within:bg-orange-500/10'>
            <AiOutlineLock className="text-gray-500 dark:text-gray-400 text-xl group-focus-within:text-orange-600" />
          </div>
          <div className="flex-1 relative">
            <label
              htmlFor="confirmPassword"
              className={`absolute left-0 font-bold transition-all duration-300 pointer-events-none ${focusField === 'confirmPassword' || confirmPassword ? '-top-6 text-[10px] text-orange-600 uppercase tracking-widest' : 'top-3 text-gray-400'}`}
            >
              Verify Secret
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              className="w-full py-3 bg-transparent text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#2a2a2a] focus:border-orange-600 dark:focus:border-orange-600 transition-colors focus:outline-none font-bold"
              required
            />
          </div>
        </div>
      </div>
 
      <button
        type="submit"
        className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-600/20 hover:-translate-y-0.5"
      > 
        Establish Protocol
      </button> 
    </form>
  );
};

export default PasswordInput;

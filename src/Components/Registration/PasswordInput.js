import React, { useState } from 'react';

const PasswordInput = ({ onNext }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length >= 6) {
      onNext(password);
    } else {
      alert("Password must be at least 6 characters.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="mb-4 p-3 bg-gray-700 text-white rounded-md w-full"
        required
      />
      <button
        type="submit"
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md"
      >
        Set Password
      </button>
    </form>
  );
};

export default PasswordInput;

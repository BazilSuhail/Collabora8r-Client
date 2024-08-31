// SignUp.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    dob: '',
    password: ''
  });

  const { name, gender, phone, email, dob, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/profile/signup`, formData);
      localStorage.setItem('token', res.data.token);
      // Redirect or update UI based on successful sign up
    } catch (error) {
      console.error(error.response?.data?.error || 'Error during sign up');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={name} onChange={handleChange} placeholder="Name" required />
      <select name="gender" value={gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input type="text" name="phone" value={phone} onChange={handleChange} placeholder="Phone" required />
      <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
      <input type="date" name="dob" value={dob} onChange={handleChange} required />
      <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Register;

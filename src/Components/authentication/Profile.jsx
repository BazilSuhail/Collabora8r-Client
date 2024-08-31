import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, config);
        setProfile(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/profile`, profile, config);
      setProfile(response.data);
      // Optionally, show a success message
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        placeholder="Name"
        required
      />
      <select
        name="gender"
        value={profile.gender}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="text"
        name="phone"
        value={profile.phone}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        placeholder="Phone"
        required
      />
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="date"
        name="dob"
        value={profile.dob.split('T')[0]} // Adjust for date format
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        required
      />
      <input
        type="text"
        name="project"
        value={profile.project || ''}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        placeholder="Project ID"
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default Profile;

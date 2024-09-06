import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
      // Optionally, show a success message
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
  
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col'>
      <div className='bg-white border border-gray-300 shadow-lg rounded-lg p-6'>
        {/* Display Section */}
        {!isEditing ? (
          <div>
            <div className='flex items-center mb-4'>
              <img
                src={`/Assets/${profile.avatar}.jpg`}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
              />
              <div className='ml-6'>
                <h1 className='text-2xl font-bold text-gray-800'>{profile.name}</h1>
                <p className='text-gray-600'>{profile.email}</p>
                <p className='text-gray-600'>{profile.phone}</p>
                <p className='text-gray-600'>{profile.gender}</p>
                <p className='text-gray-600'>{new Date(profile.dob).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600'
            >
              Edit Profile
            </button>
          </div>
        ) : ( 
          <form onSubmit={handleUpdate} className='space-y-4'>
            <div className='flex items-center mb-4'>
              <img
                src={`/Assets/${profile.avatar}.jpg`}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
              />
            </div>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <select
              name="gender"
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
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
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="date"
              name="dob"
              value={profile.dob.split('T')[0]} // Adjust for date format
              onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600'
            >
              Update Profile
            </button>
            <button
              onClick={() => setIsEditing(false)}
              type="button"
              className='bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600'
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
 
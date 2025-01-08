import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                //const token = localStorage.getItem('token'); // Retrieve token from localStorage
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/get-notifications`, config);
                setNotifications(response.data);
            } catch (err) {
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <p className="text-center text-gray-600">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <main className="ml-auto xsx:ml-[265px] min-h-screen bg-white p-6">
        <div className="p-4 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length > 0 ? (
                <ul className="space-y-4">
                    {notifications.map((notification, index) => (
                        <li key={index} className="p-4 bg-white rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">{notification.title}</h2>
                            <p className="text-gray-700">{notification.description}</p>
                            {notification.isLink && (
                                <a
                                    href={notification.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Visit Link
                                </a>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Sent by: {notification.from} | {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No notifications available.</p>
            )}
        </div>
        </main>
    );
};

export default Notifications;

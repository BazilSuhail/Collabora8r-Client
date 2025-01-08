import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import axios from 'axios';

const NotificationsModal = ({ isModalOpen, setModalOpen }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/get-notifications`,
                    config
                );
                setNotifications(response.data);
            } catch (err) {
                setError('Failed to fetch notifications');
            } finally {
                setLoading(false);
            }
        };

        if (isModalOpen) {
            fetchNotifications();
        }
    }, [isModalOpen]);

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleNotificationClick = (projectId, from) => {
        // Navigate to the desired route with projectId and from as query params
        navigate(`/project-details/${projectId}/${from}`);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
                {/* Close button */}
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h1 className="text-2xl font-bold mb-4">Notifications</h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : notifications.length > 0 ? (
                    <ul className="space-y-4">
                        {notifications.map((notification, index) => {
                            const { type, data } = notification;

                            return (
                                <li
                                    key={index}
                                    className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer"
                                    onClick={() =>
                                        type === 'teamMember' &&
                                        handleNotificationClick(data.projectId, data.from)
                                    } // Handle click
                                >
                                    {type === 'projectManager' && (
                                        <>
                                            <h2 className="text-lg font-semibold">
                                                {data.title}
                                            </h2>
                                            <p className="text-gray-700">
                                                {data.description}
                                            </p>
                                            {data.isLink && (
                                                <a
                                                    href={data.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    Visit Link
                                                </a>
                                            )}
                                            <p className="text-sm text-gray-500 mt-2">
                                                Sent by: {data.from} |{' '}
                                                {new Date(
                                                    data.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </>
                                    )}

                                    {type === 'teamMember' && (
                                        <>
                                            <p className="text-gray-700">
                                                {data.description}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Project ID: {data.projectId} | Sent by:{' '}
                                                {data.from} |{' '}
                                                {new Date(
                                                    data.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-600">No notifications available.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsModal;

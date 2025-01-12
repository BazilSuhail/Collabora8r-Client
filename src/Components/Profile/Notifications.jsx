import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion"
import { MdKeyboardDoubleArrowRight, MdManageAccounts } from 'react-icons/md';
import { VscProject } from 'react-icons/vsc';

const NotificationsModal = ({ isModalOpen, setModalOpen }) => {
    const [notifications, setNotifications] = useState([]);
    const [tempModal, setTempModal] = useState(true);
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

    const handleClose = () => {
        setTempModal(false)
        setTimeout(closeModal, 500);
    };

    const handleUserNotificationClick = (projectId, from) => {
        handleClose();
        navigate(`/project-details/${projectId}/${from}`);
    };


    const handleManagerNotificationClick = (projectId) => {
        handleClose();
        navigate(`/manager-invitation/${projectId}`);
    };

    return (
        <div className="fixed inset-0 flex  justify-end bg-black bg-opacity-20 z-[999]">
            <AnimatePresence>
                <motion.div
                    initial={{ x: 900 }}
                    animate={{ x: tempModal ? 0 : 900 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-white w-[340px] overflow-y-auto no-scrollbar md:w-[500px] p-6 rounded-l-[15px] shadow-lg relative">
                    {/* Close button */}
                    <button onClick={handleClose} className="absolute top-2 left-2 flex items-center text-gray-400 hover:text-gray-700">
                        <MdKeyboardDoubleArrowRight className='text-[28px]' />
                        <h1 className="text-[16px] ml-[5px] font-[600]">Notifications</h1>
                    </button>

                    {loading ? (
                        <p className="text-center text-gray-600">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : notifications.length > 0 ? (
                        <div className="mt-[35px]  space-y-4">
                            {notifications.slice().reverse().map((notification, index) => {
                                const { type, data } = notification;
                                return (
                                    <div key={index}
                                        className="px-4 py-[14px] bg-gra border-[2px] rounded-[8px] border-gray-200 cursor-pointer">
                                        {type === 'projectManager' && (
                                            <div  onClick={() => handleManagerNotificationClick(data.projectId)}>
                                                <div className='flex items-center'>
                                                    <div className='bg-bluepx] rounded-full'>
                                                        <MdManageAccounts className='text-blue-800 text-[25px]' />
                                                    </div>
                                                    <p className="text-blue-600 font-[600] ml-[8px] text-[14px] sm:text-[17px]">
                                                        Invitation for Product Manager
                                                    </p>
                                                </div >
                                                <div className='ml-[35px] flex flex-col mt-[8px]'>
                                                    <p className="text-gray-700 text-[12px] sm:text-[14px]">
                                                        {data.description}
                                                    </p>
                                                    <p className="text-[12px] font-[600] ml-auto mt-[5px] text-gray-500">
                                                        {new Date(data.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {type === 'teamMember' && (
                                            <div onClick={() => handleUserNotificationClick(data.projectId, data.from)}>
                                                <div className='flex items-center'>
                                                    <div className='bg-blue-800 p-[6px] rounded-full'>
                                                        <VscProject className='text-white text-[15px]' />
                                                    </div>
                                                    <p className="text-blue-700 font-[500] ml-[8px] text-[14px] sm:text-[17px]">
                                                        {data.title}
                                                    </p>
                                                </div >
                                                <div className='ml-[40px] flex flex-col mt-[8px]'>
                                                    <p className="text-gray-700 text-[12px] sm:text-[14px]">
                                                        {data.description}
                                                    </p>
                                                    <p className="text-[12px] font-[600] ml-auto mt-[5px] text-gray-500">
                                                        {new Date(data.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-600">No notifications available.</p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NotificationsModal;

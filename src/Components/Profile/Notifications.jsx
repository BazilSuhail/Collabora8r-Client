import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion"
import { MdKeyboardDoubleArrowRight, MdManageAccounts } from 'react-icons/md';
import { VscProject } from 'react-icons/vsc';
import TeamMemberInvitation from '../../Assets/ProfileModals/MemberAccept';
import ProjectManagerInvitation from '../../Assets/ProfileModals/ManagerAccept';
import { useAuthContext } from '../../AuthProvider';

const NotificationsModal = ({ isNotificationsModalOpen, setIsNotificationsModalOpen }) => {
    //const [notifications, setNotifications] = useState([]);
    const { userNotifications, notifications } = useAuthContext();
    //console.log(userNotifications)
    const [tempModal, setTempModal] = useState(true);
    const [memberModal, setMemberModal] = useState({ projectId: '1', from: '2' });
    const [managerModal, setManagerModal] = useState('');

    //lmmodal
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);



    const closeModal = () => {
        setIsNotificationsModalOpen(!isNotificationsModalOpen);
    };

    const handleClose = () => {
        setTempModal(false)
        setTimeout(closeModal, 500);
    };

    const handleUserNotificationClick = (projectId, from) => {
        setShowMemberModal(true);
        setMemberModal((prevState) => ({
            ...prevState,
            projectId: projectId,
            from: from,
        }));
        //console.log(memberModal.projectId) 
    };


    const handleManagerNotificationClick = (projectId) => {
        setShowManagerModal(true);
        setManagerModal(projectId);
    };

    return (
        <div className="fixed inset-0 flex  justify-end bg-black bg-opacity-20 z-[999]">

            {showMemberModal && <TeamMemberInvitation projectId={memberModal.projectId} from={memberModal.from} setShowMemberModal={setShowMemberModal} />}
            {showManagerModal && <ProjectManagerInvitation projectId={managerModal} setShowManagerModal={setShowManagerModal} />}

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

                    {(notifications.length === 0 && userNotifications.length === 0) &&
                        <div className='mt-[205px]'>
                            <div className='w-[310px] h-[240px] mx-auto'>
                                <img src="/Resources/8.png" alt='Connection Error' className='w-full h-full' />
                            </div>
                            <div className="text-center pl-[28px] text-gray-400 bg-white mt-[-5px] py-[15px] font-[700] text-[14px] ">No Notifications yet ...</div>
                        </div>
                    }
                    <div className='w-full'>
                        {notifications.length > 0 &&
                            <div className="mt-[35px]  space-y-4">
                                {notifications.slice().reverse().map((notification, index) => {
                                    const { type, data } = notification;
                                    return (
                                        <div key={index}
                                            className="px-4 py-[14px] bg-gra border-[2px] rounded-[8px] border-gray-200 cursor-pointer">
                                            {type === 'projectManager' && (
                                                <div onClick={() => handleManagerNotificationClick(data.projectId)}>
                                                    <div className='flex items-center'>
                                                        <div className='bg-bluepx] rounded-full'>
                                                            <MdManageAccounts className='text-blue-800 text-[25px]' />
                                                        </div>
                                                        <p className="text-blue-600 font-[600] ml-[8px] text-[14px] sm:text-[17px]">
                                                            Invitation for Product Manager
                                                        </p>
                                                    </div >
                                                    <div className='ml-[35px] flex flex-col mt-[8px]'>
                                                        <p className="text-gray-700 break-words text-[12px] sm:text-[14px]">
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
                                                        <p className="text-gray-700 text-[12px] break-words sm:text-[14px]">
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
                            </div>}
                    </div>
                    {userNotifications.length > 0 &&
                        <div className="mt-[35px]  space-y-4">
                            {userNotifications.slice().reverse().map((notification, index) => {
                                const { type, data } = notification;
                                return (
                                    <div key={index}
                                        className="px-4 py-[14px] bg-blue-50 border-[2px] rounded-[8px] border-gray-200 cursor-pointer">
                                        {type === 'projectManager' && (
                                            <div onClick={() => handleManagerNotificationClick(data.projectId)}>
                                                <div className='flex items-center'>
                                                    <div className='bg-bluepx] rounded-full'>
                                                        <MdManageAccounts className='text-blue-500 text-[25px]' />
                                                    </div>
                                                    <p className="text-blue-500 font-[600] ml-[8px] text-[14px] sm:text-[17px]">
                                                        Invitation for Product Manager
                                                    </p>
                                                </div >
                                                <div className='ml-[35px] flex flex-col mt-[8px]'>
                                                    <p className="text-blue-400 break-words text-[12px] sm:text-[14px]">
                                                        {data.description}
                                                    </p>
                                                    <p className="text-[12px] font-[700] ml-auto mt-[5px] text-blue-400">
                                                        {new Date(data.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {type === 'teamMember' && (
                                            <div onClick={() => handleUserNotificationClick(data.projectId, data.from)}>
                                                <div className='flex items-center'>
                                                    <div className='bg-blue-500 p-[6px] rounded-full'>
                                                        <VscProject className='text-white text-[15px]' />
                                                    </div>
                                                    <p className="text-blue-500 font-[500] ml-[8px] text-[14px] sm:text-[17px]">
                                                        {data.title}
                                                    </p>
                                                </div >
                                                <div className='ml-[40px] flex flex-col mt-[8px]'>
                                                    <p className="text-blue-400 break-words text-[12px] sm:text-[14px]">
                                                        {data.description}
                                                    </p>
                                                    <p className="text-[12px] font-[700] ml-auto mt-[5px] text-blue-400">
                                                        {new Date(data.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    }
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default NotificationsModal;




/*


<div className='w-full bg-yellow-100'>
                    {notifications.length > 0 ? (
                        <div className="mt-[35px]  space-y-4">
                            {notifications.slice().reverse().map((notification, index) => {
                                const { type, data } = notification;
                                return (
                                    <div key={index}
                                        className="px-4 py-[14px] bg-gra border-[2px] rounded-[8px] border-gray-200 cursor-pointer">
                                        {type === 'projectManager' && (
                                            <div onClick={() => handleManagerNotificationClick(data.projectId)}>
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
                    </div>
                    {userNotifications.length > 0 ? (
                        <div className="mt-[35px]  space-y-4">
                            {userNotifications.slice().reverse().map((notification, index) => {
                                const { type, data } = notification;
                                return (
                                    <div key={index}
                                        className="px-4 py-[14px] bg-gra border-[2px] rounded-[8px] border-gray-200 cursor-pointer">
                                        {type === 'projectManager' && (
                                            <div onClick={() => handleManagerNotificationClick(data.projectId)}>
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

*/
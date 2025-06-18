import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion"
import { MdKeyboardDoubleArrowRight, MdManageAccounts } from 'react-icons/md';
import { VscProject } from 'react-icons/vsc';
import TeamMemberInvitation from '../../Assets/ProfileModals/MemberAccept';
import ProjectManagerInvitation from '../../Assets/ProfileModals/ManagerAccept';
import { useAuthContext } from '../../AuthProvider';

const NotificationsModal = ({ isNotificationsModalOpen, setIsNotificationsModalOpen }) => {
    const { userNotifications, notifications } = useAuthContext();
    const [isExiting, setIsExiting] = useState(false);
    const [memberModal, setMemberModal] = useState({ projectId: '', from: '' });
    const [managerModal, setManagerModal] = useState('');
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsNotificationsModalOpen(false);
            setIsExiting(false);
        }, 500);
    };

    const handleUserNotificationClick = (projectId, from) => {
        setMemberModal({ projectId, from });
        setShowMemberModal(true);
    };

    const handleManagerNotificationClick = (projectId) => {
        setManagerModal(projectId);
        setShowManagerModal(true);
    };

    return (
        <AnimatePresence>
            {isNotificationsModalOpen && (
                <div className="fixed inset-0 z-[1000] flex justify-end">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {showMemberModal && (
                        <TeamMemberInvitation 
                            projectId={memberModal.projectId} 
                            from={memberModal.from} 
                            setShowMemberModal={setShowMemberModal} 
                        />
                    )}
                    {showManagerModal && (
                        <ProjectManagerInvitation 
                            projectId={managerModal} 
                            setShowManagerModal={setShowManagerModal} 
                        />
                    )}

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: isExiting ? '100%' : 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative bg-white dark:bg-[#0a0a0a] w-[340px] md:w-[480px] h-full shadow-2xl border-l border-gray-100 dark:border-[#1a1a1a] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 dark:border-[#1a1a1a] flex items-center justify-between bg-white dark:bg-[#0a0a0a] sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-orange-600 rounded-full" />
                                <div>
                                    <h2 className="text-xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">Signal Intel</h2>
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Incoming Transmissions</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleClose} 
                                className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-all"
                            >
                                <MdKeyboardDoubleArrowRight className='text-2xl' />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-8">
                            {notifications.length === 0 && userNotifications.length === 0 ? (
                                <div className='flex flex-col items-center justify-center h-full opacity-40 grayscale'>
                                    <img src="/Resources/8.png" alt='Empty' className='w-48 mb-6 dark:invert brightness-0 opacity-20' />
                                    <p className="text-xs font-black uppercase tracking-[4px] text-gray-400">Zero active signals</p>
                                </div>
                            ) : (
                                <>
                                    {/* Primary Notifications System */}
                                    <div className="space-y-4">
                                        {[...notifications, ...userNotifications].slice().reverse().map((notification, index) => {
                                            const { type, data } = notification;
                                            const isManager = type === 'projectManager';
                                            
                                            return (
                                                <motion.div 
                                                    key={`${index}-${type}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => isManager ? handleManagerNotificationClick(data.projectId) : handleUserNotificationClick(data.projectId, data.from)}
                                                    className="group relative p-6 bg-gray-50 dark:bg-[#151515] border border-transparent hover:border-orange-500/20 rounded-[2rem] cursor-pointer transition-all duration-300"
                                                >
                                                    <div className='flex items-start gap-4'>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                                            isManager ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600'
                                                        }`}>
                                                            {isManager ? <MdManageAccounts className='text-2xl' /> : <VscProject className='text-xl' />}
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h3 className="font-black text-xs text-gray-800 dark:text-gray-100 uppercase tracking-widest truncate">
                                                                    {isManager ? 'Command Directive' : data.title || 'Sector Intel'}
                                                                </h3>
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                                    {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                                                                {data.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase">Received: {new Date(data.createdAt).toLocaleDateString()}</span>
                                                        <span className="text-orange-600 text-[10px] font-black uppercase tracking-widest">Establish Intel &rarr;</span>
                                                    </div>

                                                    {/* Status indicator dot */}
                                                    <div className="absolute top-4 right-4 w-2 h-2 bg-orange-600 rounded-full animate-pulse shadow-lg shadow-orange-600/50" />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-gray-50/50 dark:bg-[#151515]/50 border-t border-gray-100 dark:border-[#1a1a1a] text-center">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[3px]">Collabora8r Signal Protocol v2.4</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotificationsModal;
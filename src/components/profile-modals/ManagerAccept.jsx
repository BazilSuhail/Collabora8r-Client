import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const ManagerInvite = ({ project, createdBy, onClose, projectId, setShowManagerModal }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptDecline = async (response) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projects/manager-response/${projectId}`,
        { response },
        config
      );

      setIsAccepted(response === 'Accept');
      setTimeout(() => {
        setShowManagerModal(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to transmit authority synchronization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-white dark:bg-[#0a0a0a] w-[90vw] md:w-[520px] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-[#1a1a1a] p-10 relative overflow-hidden"
    >
      <button
        onClick={() => setShowManagerModal(false)}
        className="absolute top-8 right-8 p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl dark:hover:bg-[#151515]"
      >
        <RxCross2 className="text-2xl" />
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-orange-600 mb-2">
          <MdOutlineSubtitles className="text-2xl" />
          <h3 className="text-xs font-black uppercase tracking-[4px]">Authority Transfer Signal</h3>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tighter uppercase leading-tight">
          Assume Command: {project.name}
        </h2>
      </header>

      <div className="space-y-6">
        <div className="p-5 bg-gray-50 dark:bg-[#151515] rounded-3xl border border-transparent">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Appointing Admin</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-600 font-black">
              {createdBy.name[0]}
            </div>
            <div>
              <p className="font-black text-gray-800 dark:text-gray-100 text-sm">{createdBy.name}</p>
              <a href={`mailto:${createdBy.email}`} className="text-[10px] font-bold text-orange-600 hover:text-orange-500 uppercase tracking-tighter">{createdBy.email}</a>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-400">
            <MdOutlineDescription className="text-lg" />
            <p className="text-[10px] font-black uppercase tracking-widest">Sector Intelligence</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium pl-6 border-l-2 border-orange-500/10 italic">
            {project.description || 'Sector objectives are classified.'}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode='wait'>
          {isAccepted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 p-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-xl shadow-orange-600/30"
            >
              <IoCheckmarkDoneCircleOutline className='text-2xl' />
              Command Authority Absolute
            </motion.div>
          ) : (
            <div className="space-y-4">
              {error && (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center bg-red-500/5 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <div className='flex flex-col sm:flex-row gap-4'>
                <button 
                  onClick={() => handleAcceptDecline('Accept')}
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[3px] transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  {isSubmitting ? 'Synchronizing...' : 'Accept Command'}
                </button>
                <button 
                  onClick={() => handleAcceptDecline('Decline')}
                  disabled={isSubmitting}
                  className="px-8 bg-gray-100 dark:bg-[#151515] text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-[3px] hover:bg-red-600 hover:text-white transition-all active:scale-95"
                >
                  Relinquish
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProjectManagerInvitation = ({ projectId, setShowManagerModal }) => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/get-project-details`,
          { projectId }, {
          headers: { Authorization: `Bearer ${token}` },
        }
        );
        setProjectData(response.data.project);
        setCreatedBy(response.data.createdBy);
      }
      catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const onClose = () => {
    navigate(-1);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-white uppercase tracking-[5px] animate-pulse">Syncing Authority...</p>
        </div>
      ) : projectData && createdBy ? (
        <ManagerInvite
          setShowManagerModal={setShowManagerModal}
          projectId={projectId}
          project={projectData}
          createdBy={createdBy}
          onClose={onClose}
        />
      ) : (
        <div className="bg-white dark:bg-[#0a0a0a] p-10 rounded-3xl text-center shadow-2xl border border-red-500/10">
          <p className="text-red-500 font-black uppercase tracking-widest text-xs">Authority Link: CORRUPTED</p>
          <button onClick={() => setShowManagerModal(false)} className="mt-6 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-orange-600 transition-colors">Terminate Connection</button>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerInvitation;

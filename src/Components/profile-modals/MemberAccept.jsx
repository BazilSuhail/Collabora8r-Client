import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const TeamInvite = ({ project, createdBy, onClose, setShowMemberModal }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/accept-invite`,
        { projectId: project._id },
        config
      );

      setIsAccepted(true);
      setTimeout(() => {
        onClose();
        setShowMemberModal(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to authorize sector entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-white dark:bg-[#0a0a0a] w-[90vw] md:w-[500px] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#1a1a1a] p-8 relative overflow-hidden"
    >
      <button
        onClick={() => setShowMemberModal(false)}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl dark:hover:bg-[#151515]"
      >
        <RxCross2 className="text-2xl" />
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-orange-600 mb-2">
          <MdOutlineSubtitles className="text-2xl" />
          <h3 className="text-xs font-black uppercase tracking-[3px]">Collaboration Signal</h3>
        </div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">
          Invitation: {project.name}
        </h2>
      </header>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-transparent">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Originator</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 dark:text-gray-200">{createdBy.name}</span>
            <span className="text-gray-300">/</span>
            <a href={`mailto:${createdBy.email}`} className="text-xs font-bold text-orange-600 hover:underline">{createdBy.email}</a>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <MdOutlineDescription className="text-lg" />
            <p className="text-[10px] font-black uppercase tracking-widest">Sector Objectives</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-6 border-l-2 border-orange-500/10 italic">
            {project.description || 'No direct mission stated.'}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <AnimatePresence mode='wait'>
          {isAccepted ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 font-black text-xs uppercase tracking-widest"
            >
              <IoCheckmarkDoneCircleOutline className='text-xl' />
              Sector Entry Authorized
            </motion.div>
          ) : (
            <div className="space-y-4">
              {error && (
                <p className="text-xs font-bold text-red-500 uppercase tracking-tighter bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  {error}
                </p>
              )}
              <button 
                onClick={handleAccept}
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[4px] transition-all shadow-lg shadow-orange-600/20 active:scale-95"
              >
                {isSubmitting ? 'Synchronizing...' : 'Accept Directive'}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TeamMemberInvitation = ({ projectId, from, setShowMemberModal }) => {
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
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const onClose = () => {
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-white uppercase tracking-[4px]">Syncing Signal...</p>
        </div>
      ) : projectData && createdBy ? (
        <TeamInvite
          setShowMemberModal={setShowMemberModal}
          project={projectData}
          createdBy={createdBy}
          onClose={onClose}
        />
      ) : (
        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl text-center">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Signal Corrupted: Sector Data Offline</p>
          <button onClick={() => setShowMemberModal(false)} className="mt-4 text-orange-600 font-black text-[10px] uppercase underline decoration-orange-600/30 underline-offset-8">Abort Link</button>
        </div>
      )}
    </div>
  );
};

export default TeamMemberInvitation;

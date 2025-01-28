import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';

const TeamInvite = ({ project, createdBy, onClose, setShowMemberModal }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
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
      onClose();
      setShowMemberModal(false)
    } catch (err) {
      console.error(err);
      setError('Failed to accept the invitation.');
    }
  };

  if (!project || !createdBy) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">No project or user data available.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-white w-[90vw] md:w-[580px] pt-[35px] min-h-[250px] rounded-lg shadow-lg p-6 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={() => setShowMemberModal(false)}
          className="absolute font-[700] top-3 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close modal"
        >
          ✕
        </button>
      )}
      <div className="flex text-[28px] items-center">
        <MdOutlineSubtitles />
        <h3 className="ml-[8px] mt-[8px] mb-[2px] text-[18px] font-[600] text-gray-700"> Invitation to Collaborate on {project.name}</h3>
      </div>
      <p className="text-gray-600 mt-[10px] text-sm mb-6">
        Invited by: <span className="font-semibold">{createdBy.name}</span> (<a className="text-blue-500" href={`mailto:${createdBy.email}`}>{createdBy.email}</a>)
      </p>

      <div className="mb-6">

        <div className="flex mt-[15px] text-[15px] items-center">
          <MdOutlineDescription />
          <p className="ml-[5px] mb-[2px] text-[13px] font-[600] text-gray-700">Project Details</p>
        </div>
        <p className="text-gray-700 bg-gray-100 p-2 rounded-[8px] text-[14px] mt-[5px]">{project.description || 'No description provided.'}</p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isAccepted ? (
        <p className="text-green-600 flex items-center text-[15px] font-semibold">
          <IoCheckmarkDoneCircleOutline className='mr-[5px] text-[22px]' />
          You have successfully joined the project!
        </p>
      ) : (
        <button onClick={handleAccept}
          className="bg-green-700 flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-green-700"
        >
          <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
          Accept Invite
        </button>

      )}
    </motion.div>
  );
};


const TeamMemberInvitation = ({ projectId, from, setShowMemberModal }) => {
  const navigate = useNavigate();
  //const { projectId } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [showModal, setShowModal] = useState(true);

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
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const onClose = () => {
    setShowModal(false);
    navigate(-1);
  }

  return (
    <main className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      <div>
        {showModal && projectData && createdBy ? (
          <TeamInvite
            setShowMemberModal={setShowMemberModal}
            project={projectData}
            createdBy={createdBy}
            onClose={onClose}
          />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-600">Loading project details...</p>
          </div>
        )}
      </div>
    </main>
  );
};


export default TeamMemberInvitation;

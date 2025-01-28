import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { MdOutlineDescription, MdOutlineSubtitles } from 'react-icons/md';

const ManagerInvite = ({ project, createdBy, onClose, projectId, setShowManagerModal }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleAcceptDecline = async (response) => {
    //console.log(response)
    setShowManagerModal(false)
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

      setIsAccepted(true);
      setShowManagerModal(false)
      onClose()
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
      className="bg-white flex flex-col rounded-lg md::w-[450px] xl:w-[580px] min-h-[320px] shadow-lg w-full p-6 relative">
      {/* Close Button */}

      <button
        onClick={() => setShowManagerModal(false)}
        className="absolute font-[700] top-3 right-4 text-gray-600 hover:text-gray-800"
        aria-label="Close modal"
      >
        ✕
      </button>

      <div className="flex mt-[15px] text-[28px] items-center">
        <MdOutlineSubtitles />
        <h3 className="ml-[8px] mb-[2px] text-[18px] font-[600] text-gray-700">Invitation to Manage Project <span className='font-[700]'>{project.name}</span></h3>
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
        <div className='flex items-center mt-auto space-x-3'>
          <button onClick={() => handleAcceptDecline('Accept')}
            className="bg-green-700 flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-green-700"
          >
            <IoCheckmarkDoneCircleOutline className='mx-[10px] mr-[5px] text-[18px]' />
            Accept Invite
          </button>
          <button onClick={() => handleAcceptDecline('Decline')}
            className="bg-red-700 flex items-center text-[14px] text-white pr-[15px] py-[4px] rounded hover:bg-red-700"
          >
            <IoCheckmarkDoneCircleOutline className='ml-[10px] mr-[5px] text-[18px]' />
            Decline Invite
          </button>
        </div>
      )}
    </motion.div>
  );
};


const ProjectManagerInvitation = ({ projectId, setShowManagerModal }) => {
  const navigate = useNavigate();
  //const { projectId } = useParams();
  console.log(projectId)
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
        console.log(response.data)
        setProjectData(response.data.project);
        setCreatedBy(response.data.createdBy);
      }
      catch (error) {
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
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div>
        {showModal && projectData && createdBy ? (
          <ManagerInvite
            setShowManagerModal={setShowManagerModal}
            projectId={projectId}
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


export default ProjectManagerInvitation;

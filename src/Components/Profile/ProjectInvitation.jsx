import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';



const ProjectInvite = ({ project, createdBy }) => {
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
  
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/accept-invite`,
          { projectId: project._id },
          config
        );
  
        setIsAccepted(true); // Mark as accepted
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
      <div className="flex items-center justify-center h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invitation to Collaborate on {project.name}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Created by: <span className="font-semibold">{createdBy.name}</span> (<a className="text-blue-500" href={`mailto:${createdBy.email}`}>{createdBy.email}</a>)
          </p>
  
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Project Details</h2>
            <p className="text-gray-700">{project.description || 'No description provided.'}</p>
          </div>
  
          {error && <p className="text-red-500 mb-4">{error}</p>}
  
          {isAccepted ? (
            <p className="text-green-600 text-lg font-semibold">
              You have successfully joined the project!
            </p>
          ) : (
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            >
              Accept Invitation
            </button>
          )}
        </div>
      </div>
    );
  };
  
const ProjectInvitationDetails = () => {
    const { projectId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [createdBy, setCreatedBy] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/get-project-details`, { projectId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProjectData(response.data.project);
                setCreatedBy(response.data.createdBy);
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        };

        fetchProjectDetails();
    }, []);

    return (
        <main className="ml-auto xsx:ml-[265px] min-h-screen bg-white p-6">
            <div>
                {projectData && createdBy ? (
                    <ProjectInvite project={projectData} createdBy={createdBy} />
                ) : (
                    <div className="flex items-center justify-center h-screen">
                        <p className="text-gray-600">Loading project details...</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProjectInvitationDetails;

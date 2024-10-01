import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TeamMembers from './TeamMembers';
import ProjectTasks from './ProjectTasks';
import MyProjectTasks from './MyProjectTasks';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.id;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    throw err;
  }
}



const JoinedProjectDetails = () => {
  const { projectId } = useParams();
  const [loggedUser, setloggedUser] = useState(null);

  const [project, setProject] = useState(null);
  const [teamDetails, setTeamDetails] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);
  const [error, setError] = useState({});
  const [view, setView] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const DecodeUserId = decodeJWT(token);
        setloggedUser(DecodeUserId);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.project) {
          setProject(response.data.project);
          setTeamDetails(response.data.project.team);
        } else {
          setError((prev) => ({ ...prev, project: 'Project not found.' }));
        }
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, project: 'Failed to fetch project details.' }));
      }
    };

    const fetchProjectTasks = async () => {
      try {
        //const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`);

        const tasks = response.data.tasks;

        //console.log(loggedUser);
        // Filter tasks based on assignedTo

        const assignedToMe = tasks.filter(task => task.task.assignedTo === loggedUser);
        const assignedToOthers = tasks.filter(task => task.task.assignedTo !== loggedUser);
        tasks.forEach(task => {
          console.log(task);
        });

        setMyTasks(assignedToMe);
        setOtherTasks(assignedToOthers);
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, tasks: 'Failed to fetch project tasks.' }));
      }
    };

    fetchProjectDetails();
    fetchProjectTasks();
  }, [projectId, loggedUser]);

  return (
    <div className="xsx:ml-[265px] bg-gray-100 p-5">
      {project ? (
        <>
          <div className="bg-white shadow-lg rounded-lg p-5 mb-5">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p> 
            {error.project && <p className="text-red-500">{error.project}</p>}
          </div>

          <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
            Show Team Members
          </button>

          <TeamMembers teamDetails={teamDetails} isOpen={isModalOpen} onClose={closeModal} />

          <div className="bg-white shadow-lg rounded-lg p-5">
            <h3 className="text-2xl font-semibold mb-3">Project Tasks</h3>

            <div className="mb-4">
              <button onClick={() => setView('my')} className={`mr-4 px-4 py-2 ${view === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                My Tasks
              </button>
              <button onClick={() => setView('all')} className={`px-4 py-2 ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                All Tasks
              </button>
            </div>

            {view === 'my' ? <MyProjectTasks creator={project.createdBy} tasks={otherTasks} /> : <ProjectTasks creator={project.createdBy} tasks={myTasks} /> }

          </div>
        </>
      ) : (
        <p>Project not found.</p>
      )}
    </div>
  );
};

export default JoinedProjectDetails;

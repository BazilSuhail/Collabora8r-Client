import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TeamMembers from './TeamMembers';
import ProjectTasks from './ProjectTasks';
import { FaLandMineOn, FaPeopleGroup } from 'react-icons/fa6';
import { FaBorderAll } from 'react-icons/fa';

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
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.project) {
          setProject(response.data.project);
          setTeamDetails(response.data.project.team);
        } 
        else {
          setError((prev) => ({ ...prev, project: 'Project not found.' }));
        }
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, project: 'Failed to fetch project details.' }));
      }
    };

    const fetchProjectTasks = async () => {
      try { 
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`);

        const tasks = response.data.tasks;
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
    <main className="xsx:ml-[265px] min-h-screen bg-white p-5">
      {project ? (
        <section>

          <div className="mb-[15px] bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 border-2 border-blue-300 p-6 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
            <p className="text-gray-700">{project.description}</p>
            {error.project && <p className="text-red-500">{error.project}</p>}
          </div>

          <button onClick={openModal}  className='xsx:hidden bg-blue-900 flex text-[16px] mt-[10px] text-blue-50 py-[8px] rounded-xl mb-[15px] px-[10px] font-[600] items-center '>
          <FaPeopleGroup className='mr-[8px] text-[24px] ' />
          Team Members
          </button>

          <section className='grid grid-cols-1 xl:grid-cols-7 xsx:grid-rows-1'>

            <div className='col-span-2 mb-[15px] xsx:mx-[8px]'>
              <div className='flex mb-[15px]'>
                <button onClick={() => setView('my')} className={`mr-4 flex items-center px-4 py-[2px] rounded-[8px] ${view === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <FaBorderAll className="mr-2" />All Tasks
                </button>
                <button onClick={() => setView('all')} className={`px-4 flex items-center text-[14px] rounded-[8px] py-[2px] ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <FaLandMineOn className="mr-2 text-[18px]" /><span className=''></span>My Tasks
                </button>
              </div>

              <h1 className='hidden xsx:flex text-[22px] mt-[10px] text-blue-700 font-[600] items-center '>
                <FaPeopleGroup className='mr-[8px] text-[28px] ' />
                Team Members
              </h1>

              {teamDetails.length > 0 ? (
                teamDetails.map((member) => (
                  <div key={member._id} className="xsx:flex hidden mt-[10px] bg-white items-center px-4 py-2 border-l-4 border-gray-300 shadow-md rounded-md">
                    <img
                      src={`/Assets/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-[40px] h-[40px] rounded-full border-2 border-gray-300 mr-4"
                    />
                    <div>
                      <p className="font-semibold text-md">{member.name}</p>
                      <p className="text-gray-500 text-[12px]">{member.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-blue-500 underline text-center">No team members found.</p>
              )}
            </div>
            <TeamMembers teamDetails={teamDetails} isOpen={isModalOpen} onClose={closeModal} />

            <section className='col-span-5'>
              {view === 'my' ? <ProjectTasks creator={project.createdBy} tasks={otherTasks} /> : <ProjectTasks creator={project.createdBy} tasks={myTasks} />}
            </section>
          </section>
        </section>
      ) : (
        <p>Project not found.</p>
      )}
    </main>
  );
};

export default JoinedProjectDetails;

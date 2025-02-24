import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import TeamMembers from '../../Assets/ProjectModals/TeamMembers'
import ProjectTasks from './JoinedProjectTasks'
import { FaLandMineOn, FaPeopleGroup } from 'react-icons/fa6'
import { FaBorderAll } from 'react-icons/fa'
import { useAuthContext } from '../../AuthProvider'
import Loader from '../../Assets/Loaders/Loader'

const JoinedProjectDetails = () => {
  const { user } = useAuthContext();
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
        //const DecodeUserId = decodeJWT(token);

        //setloggedUser(DecodeUserId);
        setloggedUser(user._id);
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.project) {
          setProject(response.data.project);
          setTeamDetails(response.data.project.team);
          console.log("Asdasd")
          console.log(teamDetails.length)

          console.log(teamDetails)
        }
        else {
          setError((prev) => ({ ...prev, project: 'Project not found.' }));
        }
      }
      catch (err) {
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
        // tasks.forEach(task => { console.log(task);});

        setMyTasks(assignedToMe);
        setOtherTasks(assignedToOthers);
      }
      catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, tasks: 'Failed to fetch project tasks.' }));
      }
    };

    fetchProjectDetails();
    fetchProjectTasks();
  }, [projectId, loggedUser]);

  return (
    <main >
      {project ? (
        <section className="xsx:ml-[265px] min-h-screen bg-white p-5">
          {error.project && <p className="text-red-500">{error.project}</p>}
          <div className="relative mb-[18px] xl:mb-[25px] w-full h-[180px] lg:h-[180px] xl:h-[220px] rounded-xl overflow-hidden bg-yellow-300">
            <div className="absolute inset-0 w-full flex pt-3 items-center space-x-2 pb-[8px]">
              <img src={`/Themes/${project.theme}.jpg`} alt="" className=" h-[180px] lg:h-[180px] xl:h-[220px] w-full object-cover" />
            </div>

            <div className="absolute h-[180px] lg:h-[180px] xl:h-[220px] inset-0 w-full px-[18px] space-x-2 bg-black bg-opacity-40 z-10">
              <Link to={`/joinedprojects/${projectId}`}>
                <p className="ml-[8px] underline mt-[25px] underline-offset-[12px] font-[700] text-[15px] md:text-[24px] xl:text-[30px] text-blue-100">
                  {project.name}
                </p>

                <p className="font-[600] mt-[15px] ml-[8px] text-[12px] md:text-[14px] text-white">
                  {project.description}
                  {project.description.length > 150 ? project.description.slice(0,27)+" ..." : project.description}

                </p>
              </Link>
            </div>
          </div>

          <button onClick={openModal} className='xsx:hidden bg-blue-900 flex text-[13px] mt-[10px] text-blue-50 py-[5px] rounded-[8px] mb-[15px] px-[15px] font-[600] items-center '>
            <FaPeopleGroup className='mr-[8px] text-[17px] mt-[2px]' />
            Team Members
          </button>

          <section className='grid grid-cols-1 xl:grid-cols-7 xsx:grid-rows-1'>

            <div className='col-span-2 mb-[15px] xsx:mx-[8px] xl:pr-[15px]'>
              <div className='flex mb-[15px]'>
                <button onClick={() => setView('my')} className={`mr-4 flex items-center px-4 py-[2px] rounded-[8px] ${view === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <FaBorderAll className="mr-2" />All Tasks
                </button>
                <button onClick={() => setView('all')} className={`px-4 flex items-center text-[14px] rounded-[8px] py-[2px] ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <FaLandMineOn className="mr-2 text-[18px]" /><span className=''></span>My Tasks
                </button>
              </div>

              <h1 className='hidden xsx:flex mt-[18px] text-blue-700 font-[600] items-center '>
                <FaPeopleGroup className='mr-[8px] text-[25px] ' />
                <span className='text-[17px]'>Team Members</span>
              </h1>

              <TeamMembers teamDetails={teamDetails} isOpen={isModalOpen} onClose={closeModal} />
              
              {teamDetails.filter((member) => member._id !== loggedUser).map((member) => (
                  <div key={member._id} className="xsx:flex hidden mt-[10px] bg-white items-center px-4 py-2 border border-gray-300 rounded-[8px]" >
                    <img
                      src={`/Avatars/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-[40px] h-[40px] rounded-full border-2 border-gray-300 mr-4"
                    />
                    <div>
                      <p className="font-semibold text-md">{member.name}</p>
                      <p className="text-gray-500 text-[12px]">{member.email}</p>
                    </div>
                  </div>
                ))}
            </div>

            <section className='col-span-5 xl:px-[15px]'>
              {view === 'my' ? <ProjectTasks creator={project.createdBy} tasks={otherTasks} /> : <ProjectTasks creator={project.createdBy} tasks={myTasks} />}
            </section>
          </section>
        </section>
      ) : (
        <Loader/>
      )}
    </main>
  );
};

export default JoinedProjectDetails;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import TaskModal from '../../Assets/ProjectModals/ManageTask';
import { GrChapterAdd } from 'react-icons/gr';
import { FiFolder } from 'react-icons/fi';
import { FaRegTrashAlt, FaUserEdit } from 'react-icons/fa';
import { LuDoorOpen } from 'react-icons/lu';

const ManageProjectTasks = () => {
  const { projectId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectTeam, setProjectTeam] = useState('');
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksResponse.data.validTasks);
        setProjectName(tasksResponse.data.projectName);
        setProjectTeam(tasksResponse.data.projectTeam);

        const usersResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/${projectId}/get-all-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks or users.');
      }
    };

    fetchTasksAndUsers();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks`,
        { ...newTask, projectId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Task created successfully.');
      setNewTask({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });

      // Refresh the tasks list
      const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data.validTasks);
      setProjectName(tasksResponse.data.projectName);
      setProjectTeam(tasksResponse.data.projectTeam);

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError('Failed to create task.');
    }
  };

  const handleEditTask = async (task) => {
    handleOpenModal();
    setEditingTaskId(task._id);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      assignedTo: task.assignedTo ? task.assignedTo._id : ''
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/${editingTaskId}`,
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Task updated successfully.');
      setEditingTaskId(null);
      setNewTask({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });

      const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data.validTasks);

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Task deleted successfully.');

      const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageTasks/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasksResponse.data.validTasks);

    } catch (err) {
      console.error(err);
      setError('Failed to delete task.');
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className='xsx:ml-[265px] bg-white flex flex-col p-6 rounded-lg shadow-lg'>
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <FiFolder className="text-2xl text-gray-600" />
          <h2 className="text-[24px] text-gray-600 font-bold">{projectName} Tasks</h2>
        </div>
      </div>
      <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500' >List of All projects Adminstrated By you</p>
      <div className='h-[2px] bg-gray-300 w-full rounded-2xl mb-[6px]'></div>


      {/*error && <p className="text-red-500 mb-4">{error}</p>*/}
      {/*success && <p className="text-green-500 mb-4">{success}</p>
         <p className='px-[15px] my-[25px] pt-[5px] pb-[7px] rounded-lg text-[14px] font-[600] w-[320px] bg-red-100 border border-red-500 text-red-700'>
          Kindly add a member to start assigning tasks
        </p>
      */}

      {projectTeam === 0 ?
        <div className='flex flex-col mx-auto min-h-[50vh] overflow-hidden'>
          <div className='w-[250px] h-[250px]'>
            <img
              src="/Resources/7.png"
              alt="Connection Error"
              className="scale-x-[-1] w-full h-full mt-[150px] z-30"
            />
          </div>
          <p className="text-center md:mt-[105px] text-red-600 z-[500] font-[600] bg-white text-[11px] md:text-[14px]">Kindly add a member in this <br/> project to start assigning tasks</p>
          <Link to={`/projects/${projectId}`} className="text-center mt-[15px] text-red-500 underline font-[700] bg-white text-[11px] md:text-[14px]">Add a Member</Link>
        </div>
        :
        <>
          <div onClick={handleOpenModal} className='lg:w-[150px] py-[7px] cursor-pointer flex items-center mt-[15px] bg-gradient-to-r to-blue-800 from-cyan-600 rounded-[10px]'>
            <GrChapterAdd className="ml-[15px] text-[18px] mt-[2px] text-blue-50" />
            <span className='text-[15px] ml-[8px] font-[600] mt-[px] text-blue-50'>Create Task</span>
          </div>


          <h3 className="text-[21px] flex mb-[10px] items-center mt-[15px] font-semibold text-gray-700"><LuDoorOpen className='mr-[6px] mt-[4px] text-[25px]' />Existing Tasks</h3>

          <div className='overflow-x-auto rounded-lg border no-scrollbar border-gray-300 w-full'>
            <table className="bg-white w-full">
              <thead className='text-[14px] bg-gray-100'>
                <th className="text-center py-2 px-4 border-b border-gray-300 text-gray-600">Title</th>
                <th className="text-center py-2 px-4 border-b border-gray-300 text-gray-600">Priority</th>
                <th className="text-center py-2 px-4 whitespace-nowrap border-b border-gray-300 text-gray-600">Assigned To</th>
                <th className="text-center py-2 px-4 border-b border-gray-300 text-gray-600">Status</th>
                <th className="text-center py-2 px-4 border-b border-gray-300 text-gray-600">Actions</th>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-100"><td className="py-2 whitespace-nowrap font-[700] px-4 text-center border-b border-gray-300">
                    {task.title.length > 15 ? `${task.title.slice(0, 15)}..` : task.title}
                  </td>

                    <td className="py-2 px-4 border-b text-center">
                      <p
                        className={`sm:scale-[1] scale-[0.8] text-[13px] text-center pb-[4px] rounded-2xl pt-[3px] font-[600] mx-auto w-[80px] ${task.priority === 'Low'
                          ? 'text-green-700 bg-green-100 border border-green-400'
                          : task.priority === 'Medium'
                            ? 'text-blue-700 bg-blue-100 border border-blue-300'
                            : 'text-red-900 bg-red-200'
                          }`}
                      >
                        {task.priority}
                      </p>
                    </td>

                    <td className="text-center">
                      <div className='flex justify-center sm:w-full w-[200px] items-center'>
                        <img
                          src={`/Avatars/${task.assignedTo.avatar}.jpg`}
                          alt={task.assignedTo.name}
                          className="w-[28px] h-[28px] rounded-full border-2 border-gray-300 mr-[6px]"
                        />
                        <div>
                          <p className="font-semibold whitespace-nowrap text-[14px]">{task.assignedTo ? <>{task.assignedTo.name}</> : 'Unassigned'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2 px-4 border-b text-center">
                      <p
                        className={`sm:scale-[1] scale-[0.8] text-[12px] text-center pb-[4px] rounded-2xl pt-[3px] font-[600] mx-auto w-[90px] ${task.status === 'Completed'
                          ? 'text-green-50 bg-green-600'
                          : task.status === 'In Progress'
                            ? 'text-blue-50 bg-blue-600'
                            : 'text-yellow-100 bg-yellow-600'
                          }`}
                      >
                        {task.status}
                      </p>
                    </td>

                    <td className="py-2 whitespace-nowrap text-center px-4 border-b border-gray-300">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="bg--500 text-blue-600 text-[21px] mr-3">
                        <FaUserEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-700 text-[19px]">
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TaskModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={editingTaskId ? handleUpdateTask : handleCreateTask}
            newTask={newTask}
            users={users}
            handleChange={handleChange}
            editingTaskId={editingTaskId}
          />
        </>
      }
    </div >
  );
};

export default ManageProjectTasks;

import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaComments } from 'react-icons/fa';

const MyTask = ({ task, user, creator }) => {
  const navigate = useNavigate();
  const handleTaskClick = () => {
    navigate(`/task/${creator}/${task._id}`);
  };

  return (
    <div
      onClick={handleTaskClick}
      className="px-4 pt-4 mb-[15px] pb-[-12px] bg-white border-[2px] rounded-lg transform transition duration-300 hover:scale-[1.01]"
    >
      <div className='flex xsx:flex-row flex-col xsx:items-center xsx:justify-between'>
        <h1 className="text-[17px] xsx:text-[19px] flex items-center font-[600]"><span className='bg-gray-400 p-[5px] xsx:p-[8px] rounded-full'><FaClipboardList className='text-white  text-[17px] xsx:text-[20px]' /></span><span className='ml-[8px] mt-[-3px]'>{task.title}</span></h1>
        <p
          className={`text-[15px] w-[120px] text-center xsx:block hidden font-[600] px-[15px] py-1 rounded-[15px] ${task.status === 'Not Started'
            ? 'text-blue-600 bg-blue-100'
            : task.status === 'Completed'
              ? 'text-green-600 bg-green-100'
              : 'text-yellow-600 bg-yellow-100'
            }`}
        >
          {task.priority}
        </p>
      </div> 

      <div className="flex xsx:ml-[45px] xsx:pr-[10px] justify-between text-gray-500 text-[15px] mb-4">
      <div>
          <p className="font-semibold text-green-600">Created On</p>
          <p className='text-center'>{new Date(task.createdAt.$date || task.createdAt).toLocaleDateString()}</p>
        </div>
        <div>         
          <p className="font-semibold text-red-600">Due Date</p>
          <p className='text-center'>{new Date(task.dueDate.$date || task.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="xsx:ml-[45px flex items-center my-[5px]">
        <div className="flex-shrink-0 text-blue-500 font-bold mr-2">Assigned to:</div>
        <p className="text-[17px] underline font-medium text-blue-900">{user.name}</p>
      </div>

      <div className='h-[2px] w-full bg-[#eeeeee] rounded-xl mt-[8px]'></div>
      <div className="flex items-center my-[15px] text-gray-600">
        <FaComments className="mr-2" />
        <span className="font-medium">
          {task.comments.length} {task.comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
    </div>
  );
};
 
const ProjectTasks = ({ creator, tasks }) => {

  return (
    <div className="min-h-screen pb-6 xsx:px-6 bg-gray-100">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found for this project.</p>
      ) : (
        <div className="bg-white xsx:text-[22px] border-l-4 border-b-4 border-gray-300 p-3 rounded-lg flex items-center mb-4">
          <div className="flex-shrink-0 text-gray-500 font-[600] mr-2"> Total Tasks:</div>
          <p className="font-medium text-gray-900"> {tasks.length}</p>
        </div>
      )}

      {tasks.length > 0 && (
        <div>
          {tasks.map(({ task, user }) => (
            <MyTask key={task._id} creator={creator} task={task} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTasks;

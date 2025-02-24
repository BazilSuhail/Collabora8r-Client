import { FaTimes } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';

const TeamMembers = ({ teamDetails, isOpen, onClose }) => {
  if (!isOpen) return null;  
  const gridCols = teamDetails.length > 12 ? 'grid-cols-1'
    : teamDetails.length > 6 ? 'grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1';

  return (
    <div className="fixed inset-0 px-[25px] flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-4xl relative overflow-auto max-h-screen"> 
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose} >
          <FaTimes size={18} />
        </button>
        <h3 className="text-[16px] flex items-center font-semibold mb-5"> <FaPeopleGroup className='mr-[8px] mt-[3px] text-[22px] ' />Team Members</h3>
        <div className={`grid gap-4 ${gridCols}`}>
          {teamDetails.length > 0 ? (
            teamDetails.map((member) => (
              <div key={member._id} className="flex items-center p-4 border bg-gray-50 rounded-md">
                <img
                  src={`/Avatars/${member.avatar}.jpg`}
                  alt={member.name}
                  className="w-[38px] h-[38px] rounded-full border-2 border-gray-300 mr-4"
                />
                <div>
                  <p className="font-semibold text-[14px]">{member.name}</p>
                  <p className="text-gray-500 text-[13px]">{member.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No team members found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;

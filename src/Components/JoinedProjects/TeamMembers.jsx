import { FaTimes } from 'react-icons/fa';

const TeamMembers = ({ teamDetails, isOpen, onClose }) => {
  if (!isOpen) return null; // Do not render if modal is not open

  const gridCols = teamDetails.length > 12 ? 'grid-cols-1'
    : teamDetails.length > 6 ? 'grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-4xl relative overflow-auto max-h-screen">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-5">Team Members</h3>

        {/* Grid layout for team members */}
        <div className={`grid gap-4 ${gridCols}`}>
          {teamDetails.length > 0 ? (
            teamDetails.map((member) => (
              <div key={member._id} className="flex items-center p-4 border-l-4 border-gray-300 shadow-md rounded-md">
                <img
                  src={`/Assets/${member.avatar}.jpg`}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 mr-4"
                />
                <div>
                  <p className="font-semibold text-lg">{member.name}</p>
                  <p className="text-gray-500">{member.email}</p>
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

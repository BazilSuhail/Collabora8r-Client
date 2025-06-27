import { FaTimes } from 'react-icons/fa';
import { FaPeopleGroup } from 'react-icons/fa6';

const TeamMembers = ({ teamDetails, isOpen, onClose }) => {
  if (!isOpen) return null;  
  const gridCols = teamDetails.length > 12 ? 'grid-cols-1'
    : teamDetails.length > 6 ? 'grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] p-8 rounded-xl shadow-2xl w-full max-w-4xl relative overflow-hidden transition-colors"> 
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl dark:hover:bg-[#151515]"
        >
          <FaTimes size={18} />
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <FaPeopleGroup className="text-2xl" />
            <h3 className="text-xs font-semibold  tracking-[3px]">Collaboration Unit</h3>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tighter ">
            Team Personnel
          </h2>
        </header>

        <div className="h-0.75 bg-gray-300 dark:bg-[#1a1a1a] w-full mb-2" />

        <div className={`grid gap-6 overflow-y-auto max-h-[60vh] pr-4 no-scrollbar ${gridCols}`}>
          {teamDetails.length > 0 ? (
            teamDetails.map((member) => (
              <div key={member._id} className="flex items-center p-5 bg-gray-50/50 dark:bg-[#151515]/30 border border-gray-100 dark:border-[#1a1a1a] rounded-[2rem] hover:border-orange-500/20 transition-all group">
                <img
                  src={`/avatars/${member.avatar}.jpg`}
                  alt={member.name}
                  className="w-12 h-12 rounded-2xl border-2 border-white dark:border-[#0a0a0a] shadow-lg group-hover:scale-110 transition-transform"
                />
                <div className="ml-4 min-w-0">
                  <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{member.name}</p>
                  <p className="text-[10px] font-black text-gray-400  tracking-widest truncate">{member.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center grayscale">
              <p className="text-xs font-black text-gray-400  tracking-[5px]">Zero signals detected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;

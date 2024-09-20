const TeamMembers = ({ teamDetails }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-5 mb-5">
        <h3 className="text-2xl font-semibold mb-3">Team Members</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {teamDetails.length > 0 ? (
              teamDetails.map((member) => (
                <tr key={member._id} className="border-b">
                  <td className="p-2">{member.name}</td>
                  <td className="p-2">{member.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 text-center">No team members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TeamMembers;
  
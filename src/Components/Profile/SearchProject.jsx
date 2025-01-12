import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdScreenSearchDesktop } from 'react-icons/md';

const SearchProject = ({setIsSearchModalOpen}) => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJoinedProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
console.log(response.data)
               
                setProjects(response.data);
                setFilteredProjects(response.data);
            }
            catch (err) {
                console.error(err);
                setError('Failed to fetch projects.');
            }
        };

        fetchJoinedProjects();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        if (term) {
            setFilteredProjects(
                projects.filter((project) =>
                    project.name.toLowerCase().includes(term)
                )
            );
        } else {
            setFilteredProjects(projects);
        }
    };

    const highlightText = (text, term) => {
        if (!term) return text;

        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase() ? (
                <span key={index} className="bg-yellow-200">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const handleProjectClick = (projectId) => {
        navigate(`/joinedprojects/${projectId}`);
        setIsSearchModalOpen(false); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
            <div className="bg-white sm:w-[550px] w-[330px] lg:w-[750px]  p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg flex items-center font-bold text-gray-700">
                        <MdScreenSearchDesktop className='text-[24px] mr-[8px]'/>
                        Search Projects
                        </h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsSearchModalOpen(false)}
                    >
                        <FaTimes className="text-[20px] mt-[-15px]" />
                    </button>
                </div>
 <div className="flex items-center border-2 rounded-[25px] border-gray-300 mb-6">
            <FaSearch className="text-gray-400 text-[20px] ml-3" />
            <input
                    type="text"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={handleSearch}
              className="w-full pl-3 py-[6px] text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="text-[14px] px-4 py-[7px] bg-gray-500 text-white rounded-[25px] hover:bg-indigo-600 transition"
            >
              Search
            </button>
          </div>
 
                <div className="min-h-60 overflow-y-auto">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            className="p-4 border-b cursor-pointer hover:bg-gray-100"
                            onClick={() => handleProjectClick(project._id)}
                        >
                            {highlightText(project.name, searchTerm)}
                        </div>
                    ))}
                </div>
                {filteredProjects.length === 0 && (
                    <p className="text-gray-500 text-center">No projects found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchProject;

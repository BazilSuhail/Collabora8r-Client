import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdScreenSearchDesktop } from 'react-icons/md';
import { motion } from 'framer-motion';

const SearchProject = ({ setIsSearchModalOpen }) => {
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
            <motion.div
                initial={{ scale: 0.7, opacity: 1, y: -500 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: [0.2, 0.8, 0.2, 1],
                }}
                className="bg-white sm:w-[80vw] w-[90vw] lg:w-[750px]  p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg flex items-center font-bold text-gray-700">
                        <MdScreenSearchDesktop className='text-[24px] mr-[8px]' />
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
                    <div className='mx-auto'>
                        <div className='mt-[-185px] pb-[65px]'>
                            <img src="/Resources/2.png" alt='Connection Error' className='scale-[0.6] mx-auto ' />
                        </div>
                        <p className="text-center text-gray-500 font-[600] text-[13px] mt-[-95px] mb-[65px]">No Projects Found</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SearchProject;

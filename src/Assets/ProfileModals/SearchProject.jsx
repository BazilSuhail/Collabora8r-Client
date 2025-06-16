import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdScreenSearchDesktop } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { RxCross2 } from 'react-icons/rx';

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
                setProjects(response.data);
                setFilteredProjects(response.data);
            }
            catch (err) {
                console.error(err);
                setError('Sector reconnaissance failed.');
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
                <span key={index} className="text-orange-600 bg-orange-600/10 px-0.5 rounded-sm font-black">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-start pt-[15vh] z-[1000] p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-[#1a1a1a] overflow-hidden"
            >
                <div className="p-8 pb-4">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-600/10 rounded-xl text-orange-600">
                                <MdScreenSearchDesktop className='text-2xl' />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">
                                    Reconnaissance
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scanning active sectors</p>
                            </div>
                        </div>
                        <button
                            className="p-2 text-gray-400 hover:text-orange-600 transition-colors rounded-xl hover:bg-orange-50 dark:hover:bg-orange-500/10"
                            onClick={() => setIsSearchModalOpen(false)}
                        >
                            <RxCross2 className="text-2xl" />
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Identify sector by name..."
                            value={searchTerm}
                            onChange={handleSearch}
                            autoFocus
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-[#151515] border-2 border-transparent focus:border-orange-500/20 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none rounded-3xl transition-all font-bold text-lg"
                        />
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-4 space-y-2">
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="group p-5 hover:bg-orange-600/5 dark:hover:bg-orange-500/10 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-orange-500/10 flex items-center justify-between"
                                onClick={() => handleProjectClick(project._id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-[#1a1a1a] group-hover:bg-orange-600 text-gray-400 group-hover:text-white rounded-xl flex items-center justify-center font-black transition-colors">
                                        {project.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                            {highlightText(project.name, searchTerm)}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">Sector ID: {project._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <div className="p-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-orange-600 font-black text-xs uppercase tracking-widest">
                                    Access &rarr;
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredProjects.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center grayscale">
                            <img src="/Resources/2.png" alt='Not Found' className="w-48 opacity-20 dark:invert brightness-0 mb-6" />
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[5px]">Zero signals detected</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 dark:bg-[#151515] border-t border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Deep Scan Protocol Active</span>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{filteredProjects.length} Sectors Found</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SearchProject;

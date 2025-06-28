import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  return (
   <header className="fixed top-0 left-0 right-0 z-50 ">
     <div className='self-center max-w-6xl mx-auto mt-4 bg-white rounded-3xl dark:bg-[#111111] border-2 border-gray-200 dark:border-[#1a1a1a] shadow-sm dark:shadow-lg dark:shadow-black/30 transition-colors duration-300"' >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src="/collabor8r.svg" alt="Logo" className="w-8 h-8" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-[#575757] dark:text-white">
                Collabora<span className="text-orange-600">8</span>r
              </span>
            </NavLink>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-lg transition-all border bg-gray-100 dark:bg-[#151515] text-gray-600 dark:text-orange-400 border-gray-300 dark:border-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#1a1a1a]"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <motion.svg 
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </motion.svg>
              ) : (
                <motion.svg 
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              )}
            </button>
            <NavLink 
              to="/register" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg shadow-orange-600/30"
            >
              Get Started
            </NavLink>
          </div>
        </div>
      </div>
    </div>
   </header>
  );
};

export default Header;

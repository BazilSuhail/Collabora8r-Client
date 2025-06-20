import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import { useAuthContext } from '../../AuthProvider';

const Layout = ({ children }) => {
  const location = useLocation();
  const { userLoginStatus, user } = useAuthContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const isHome = location.pathname === '/';
  const isAuth = ['/login', '/register', '/signup'].includes(location.pathname);

  // Auth pages have no layout
  if (isAuth) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        {children}
      </div>
    );
  }

  // Home page has Header but no Sidebar
  if (isHome) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    );
  }

  // Application pages have Sidebar + a persistent App Header
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {userLoginStatus && (
        <Navbar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${userLoginStatus
          ? isExpanded ? 'lg:ml-[280px]' : '  :ml-[80px]'
          : ''
        }`}>
        <div className="p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

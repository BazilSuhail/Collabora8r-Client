import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from '../Assets/Navbar';
import { useAuthContext } from '../AuthProvider';

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
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
        {children}
      </div>
    );
  }

  // Home page has Header but no Sidebar
  if (isHome) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] text-gray-900 dark:text-white transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    );
  }

  // Application pages have Sidebar + a persistent App Header
  return (
    <div className="flex min-h-screen bg-[#f6f6f6] dark:bg-[#000000] text-gray-900 dark:text-white transition-colors duration-300">
      {userLoginStatus && (
        <Navbar 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
      )}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        userLoginStatus 
          ? isExpanded ? 'xsx:ml-[280px]' : 'xsx:ml-[80px]' 
          : ''
      }`}>
        {/* Internal App Header (Dashboard/Projects etc) */}
        {!isHome && userLoginStatus && (
          <header className={`fixed top-0 right-0 z-[40] transition-all duration-300 bg-white/70 dark:bg-[#000000]/70 backdrop-blur-md border-b border-gray-100 dark:border-[#1a1a1a] h-16 flex items-center justify-between px-6 ${
            isExpanded ? 'left-[280px]' : 'left-[80px]'
          } hidden xsx:flex`}>
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-orange-50 dark:hover:bg-orange-600/10 rounded-xl text-gray-400 hover:text-orange-600 transition-all"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
               </button>
               <h1 className="text-xs font-black uppercase tracking-[3px] text-gray-400 dark:text-gray-500">
                  Sector <span className="text-gray-800 dark:text-white">{location.pathname.substring(1).replace('-', ' ') || 'Dashboard'}</span>
               </h1>
            </div>
            
            <div className="flex items-center gap-6">
               <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
               >
                  {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
               </button>
               <div className="w-px h-6 bg-gray-100 dark:bg-[#1a1a1a]" />
               <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-tight line-clamp-1">{user?.name}</p>
                    <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest leading-none">Specialist</p>
                  </div>
                  <img src={`/Avatars/${user?.avatar || 1}.jpg`} className="w-9 h-9 rounded-xl border-2 border-white dark:border-[#1a1a1a] shadow-sm transform hover:scale-105 transition-transform" />
               </div>
            </div>
          </header>
        )}

        <main className="flex-1 mt-16">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

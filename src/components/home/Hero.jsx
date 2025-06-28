import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { RiRocket2Line, RiGlobalLine, RiLightbulbLine } from "react-icons/ri";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-10 pointer-events-none  transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto px-6 py-20 text-center ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full text-xs md:text-sm font-semibold mb-8 border border-orange-200 dark:border-orange-800">
            <RiGlobalLine className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Team Collaboration • Project Management • Real-time Updates</span>
            <span className="sm:hidden">Collaborate • Track • Succeed</span>
          </div>

          <h1 className=" font-black text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="text-[32px] lg:text-[70px] inline-block text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-orange-700 animate-linear bg-size-[200%_auto]">
              Accelerate Success
            </span>
            <span className="block text-[22px] md:text-6xl lg:text-[44px] text-gray-700 dark:text-gray-200 mt-2">
              Streamline Your Teamwork
            </span>
          </h1>

          <style>{`
            @keyframes linear {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            .animate-linear {
              animation: linear 2s ease infinite;
            }
          `}</style>

          <p className="text-[14px] px-2 sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Manage projects, assign tasks, track progress, and collaborate seamlessly with your team. 
            Real-time updates, intuitive interface, and powerful analytics all in one place.
          </p>

          <div className="flex gap-3 justify-center mb-16">
            <NavLink
              to="/login"
              className="group pointer-events-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:shadow-xl hover:shadow-orange-600/30"
            >
              <RiRocket2Line className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Get Started</span>
            </NavLink>
            <NavLink
              to="/register"
              className="inline-flex pointer-events-auto items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-[#151515] text-gray-900 dark:text-white text-sm font-semibold rounded-xl border border-gray-200 dark:border-[#1a1a1a] transition-all hover:border-orange-600/50"
            >
              <RiLightbulbLine className="w-4 h-4" />
              <span>Sign Up</span>
            </NavLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
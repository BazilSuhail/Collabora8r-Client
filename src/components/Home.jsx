import React from 'react';
// Importing specific icons from react-icons
import { MdOutlineDashboardCustomize, MdOutlineAutoAwesome, MdOutlineAnalytics } from "react-icons/md";
import { FiUsers, FiClock, FiArrowRight } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";

const ZenFlowLanding = () => {
  return (
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] text-[#1a120b] dark:text-white selection:bg-orange-100 dark:selection:bg-orange-900/30 font-sans transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Ambient background glow - softer for light mode, vibrant for dark */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-400/5 dark:bg-orange-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 text-sm font-medium text-orange-600 dark:text-orange-400 mb-10 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Vite 8 Optimized Build
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-[#0f0804] dark:text-white">
            Simplify Teamwork. <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Streamline Success.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The intelligent management suite designed to eliminate friction, 
            automate complex workflows, and keep your squad in the zone.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
            <button className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-lg shadow-orange-200 dark:shadow-none group">
              Start Building Free
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 rounded-2xl border border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] hover:bg-gray-50 dark:hover:bg-[#151515] transition-all font-bold shadow-sm text-gray-700 dark:text-gray-300">
              View Roadmap
            </button>
          </div>

          {/* Visual Placeholder / Dashboard Preview Mockup */}
          <div className="relative max-w-5xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-red-100 dark:from-orange-500 dark:to-red-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 dark:border-[#1a1a1a] bg-gray-50/50 dark:bg-[#000000]/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 text-xs text-gray-400 font-mono tracking-widest uppercase">zenflow_core_v1.0</div>
              </div>
              <div className="h-64 md:h-96 bg-gradient-to-br from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#000000] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 w-full p-8 opacity-60">
                    <div className="h-32 rounded-xl bg-gray-100 dark:bg-[#151515] border border-dashed border-gray-300 dark:border-[#1a1a1a]" />
                    <div className="h-32 rounded-xl bg-gray-100 dark:bg-[#151515] border border-dashed border-gray-300 dark:border-[#1a1a1a]" />
                    <div className="h-32 rounded-xl bg-gray-100 dark:bg-[#151515] border border-dashed border-gray-300 dark:border-[#1a1a1a]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-6 py-3 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-200 dark:border-[#1a1a1a] rounded-xl text-sm font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                      Live Project Canvas Coming Soon
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 italic tracking-tight text-[#0f0804] dark:text-white">Engineered for Velocity</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to ship products faster without the burnout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureItem 
            icon={<MdOutlineDashboardCustomize className="text-3xl text-orange-500" />}
            title="Dynamic Boards"
            description="Adaptable Kanban and Scrum views built on a blazing fast React architecture."
          />
          <FeatureItem 
            icon={<MdOutlineAutoAwesome className="text-3xl text-orange-400" />}
            title="Oxc-Powered Speed"
            description="Experience near-instant hot module replacement and ultra-lightweight production builds."
          />
          <FeatureItem 
            icon={<FiUsers className="text-3xl text-blue-500" />}
            title="Deep Collaboration"
            description="Real-time multi-player editing with presence indicators and instant sync."
          />
          <FeatureItem 
            icon={<HiOutlineCheckBadge className="text-3xl text-green-600" />}
            title="Task Automation"
            description="Let ZenFlow handle the busy work with intelligent task routing and reminders."
          />
          <FeatureItem 
            icon={<MdOutlineAnalytics className="text-3xl text-purple-600" />}
            title="Advanced Analytics"
            description="Visualise team velocity and project health with isometric 3D charts."
          />
          <FeatureItem 
            icon={<FiClock className="text-3xl text-red-500" />}
            title="Time Tracking"
            description="Integrated deep-focus timers and automatic logging for every contributor."
          />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center border-t border-gray-100 dark:border-[#1a1a1a]">
        <p className="text-gray-400 text-sm">
          &copy; 2026 ZenFlow Management Suite. Powered by Vite & Tailwind.
        </p>
      </footer>
    </main>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <div className="group p-8 rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a] hover:bg-orange-50/30 dark:hover:bg-orange-900/10 hover:border-orange-100 dark:hover:border-orange-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#151515] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-white dark:group-hover:bg-[#1a1a1a] shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

export default ZenFlowLanding;
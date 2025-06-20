import React from 'react';
import { MdOutlineDashboardCustomize, MdOutlineAutoAwesome, MdOutlineAnalytics } from "react-icons/md";
import { FiUsers, FiClock, FiArrowRight } from "react-icons/fi";
import { HiOutlineCheckBadge } from "react-icons/hi2";

// Reusable Button Component
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 justify-center text-sm md:text-base';
  const variants = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg',
    secondary: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm',
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// Reusable Badge Component
const Badge = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-300 dark:border-orange-500/30 bg-orange-100 dark:bg-orange-900/20 text-xs font-medium text-orange-700 dark:text-orange-300">
    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
    {children}
  </div>
);

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md dark:hover:shadow-orange-900/20 transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 text-lg text-orange-600 dark:text-orange-400">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const ZenFlowLanding = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 font-poppins transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 dark:bg-orange-900/20 blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-20 -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge>Vite 8 Optimized • React 19</Badge>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
            Simplify Teamwork.<br />
            <span className="text-orange-600 dark:text-orange-400">Streamline Success.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent management suite designed to eliminate friction, automate workflows, and keep your team in the zone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="primary">
              Start Building Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary">
              View Roadmap
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 to-orange-100 dark:from-orange-600 dark:to-orange-900 rounded-2xl blur opacity-20" />
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 font-mono">ZenFlow Dashboard</span>
              </div>
              <div className="h-48 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
                <div className="grid grid-cols-3 gap-3 w-full">
                  <div className="h-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-20 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Engineered for Velocity
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to ship products faster without the burnout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MdOutlineDashboardCustomize />}
              title="Dynamic Boards"
              description="Adaptable Kanban and Scrum views built on blazing fast React architecture."
            />
            <FeatureCard
              icon={<MdOutlineAutoAwesome />}
              title="Lightning Speed"
              description="Experience instant hot module replacement and ultra-lightweight production builds."
            />
            <FeatureCard
              icon={<FiUsers />}
              title="Real Collaboration"
              description="Multi-player editing with presence indicators and instant synchronization."
            />
            <FeatureCard
              icon={<HiOutlineCheckBadge />}
              title="Task Automation"
              description="Intelligent task routing and smart reminders keep work flowing smoothly."
            />
            <FeatureCard
              icon={<MdOutlineAnalytics />}
              title="Advanced Analytics"
              description="Visualize team velocity and project health with intuitive charts."
            />
            <FeatureCard
              icon={<FiClock />}
              title="Time Tracking"
              description="Integrated timers and automatic logging for accurate time tracking."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; 2026 ZenFlow Management Suite. Crafted with care.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default ZenFlowLanding;
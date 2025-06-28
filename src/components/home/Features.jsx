import React from "react";
import { 
  RiCodeSSlashLine, 
  RiFlashlightLine, 
  RiTerminalBoxLine, 
  RiSparklingLine, 
  RiCpuLine, 
  RiShieldCheckLine 
} from "react-icons/ri";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <RiCodeSSlashLine className="w-6 h-6" />,
      title: "Task Management",
      description: "Create, assign, and track tasks with priorities, deadlines, and detailed descriptions."
    },
    {
      icon: <RiFlashlightLine className="w-6 h-6" />,
      title: "Real-Time Updates",
      description: "Instant notifications and live status updates keep everyone synchronized."
    },
    {
      icon: <RiTerminalBoxLine className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Discussion boards and comments enable seamless team communication."
    },
    {
      icon: <RiSparklingLine className="w-6 h-6" />,
      title: "Project Analytics",
      description: "Data-driven insights and performance metrics to enhance productivity."
    },
    {
      icon: <RiCpuLine className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Visual timelines, Gantt charts, and milestone tracking for projects."
    },
    {
      icon: <RiShieldCheckLine className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Role-based access control and encrypted data protect your projects."
    }
  ];

  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <section ref={containerRef} className="relative z-10 py-20 px-6 pointer-events-none transition-colors duration-300">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        {/* Scroll animation ONLY on the heading */}
        <motion.div
          style={{ opacity, scale, y }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-orange-700 animate-linear-features bg-size-[200%_auto] mb-4">
            Powerful Features
          </h2>
          
          <style>{`
            @keyframes linear-features {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            .animate-linear-features {
              animation: linear-features 2s ease infinite;
            }
          `}</style>
          <p className="text-[13px] sm:text-xl text-gray-600 dark:text-gray-400">
            Everything you need for seamless team collaboration
          </p>
        </motion.div>

        {/* Static grid as requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-gray-50 dark:bg-[#131212] backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-300 dark:hover:border-orange-600/30 transition-all hover:shadow-xl hover:shadow-orange-600/10 dark:hover:shadow-orange-600/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-orange-600 to-orange-700 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-[14px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

import { ReactLenis } from "lenis/react";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WordReveal = ({
  text = `Collabora8r streamlines team collaboration with real-time updates task management and seamless communication. Manage projects efficiently track progress dynamically and build stronger teams together. Collabora8r empowers teams to achieve more with less friction and maximum impact.`,
}) => {
  const containerRef = useRef(null);
  const words = text.split(' ');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const SCROLL_END = 0.7;

  return (
    <section className="mx-auto pt-[5vh] pb-[50vh] md:pt-[30vh] md:pb-[30vh] sm:px-6 max-w-5xl md:mb-12">
      <div
        ref={containerRef}
        className='relative mx-auto text-[32px] sm:text-[40px] md:text-[25px] font-semibold'
      >
        {/* Static gray background */}
        <div className="absolute inset-0 flex flex-wrap justify-start pointer-events-none select-none">
          {words.map((word, i) => (
            <span 
              key={`bg-${i}`} 
              className="mr-2 text-gray-400/10 dark:text-gray-600/10"
            >
              {word}
            </span>
          ))}
        </div>

        {/* Animated linear foreground */}
        <div className="relative flex flex-wrap justify-start">
          {words.map((word, i) => {
            const start = (i / words.length) * SCROLL_END;
            const end = ((i + 1) / words.length) * SCROLL_END;

            const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
            const x = useTransform(scrollYProgress, [start, end], [-2, 0]);

            return (
              <motion.span
                key={`motion-${i}`}
                style={{ opacity, x }}
                className="inline-block mr-2 text-orange-600 dark:text-orange-500"
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>

  );
};

const Words = () => {
  const descriptions = [
    "Collabora8r streamlines team collaboration with real-time updates task management and seamless communication. Manage projects efficiently track progress dynamically and build stronger teams together.",
    "Real-time synchronization ensures all team members stay connected and informed instantly. Get instant notifications for task updates project changes and team activities keeping everyone on the same page always.",
    "Empower your teams to achieve more with less friction and maximum impact. Boost productivity reduce bottlenecks and deliver projects faster with intelligent project management and collaboration tools."
  ];

  return (
    <ReactLenis root>
      <div className="stats-scroll max-w-6xl mx-auto relative w-full tansition-colors duration-300">

        {/* Sticky left, scrollable right */}
        <div className="flex md:flex-row flex-col">
          {/* Text panel - sticky */}
          <div className="md:sticky md:top-[10vh] md:h-screen md:w-1/2 w-full flex flex-col justify-center p-6 md:p-12 z-10">
            <div className="font-poppins font-semibold text-[37px] md:text-[60px] text-gray-900 dark:text-white leading-tight">
              Why Collabora8r?
            </div>
            <div className="text-[12px] sm:text-[15px] font-medium text-gray-700 dark:text-gray-300 mt-4 md:mt-8 font-roboto">
            Collabora8r provides everything teams need to work efficiently—from task assignment and real-time updates to comprehensive analytics. Built for teams of all sizes, it reduces friction and maximizes productivity.
                <br />
              <button className="mt-4 md:mt-8 bg-orange-600 hover:bg-orange-700 border-2 border-orange-600 rounded-md py-2 px-6 font-semibold text-white transition-all shadow-lg shadow-orange-600/20">
                Explore Features
              </button>
            </div>
          </div>

          {/* Cards panel - scrolls */}
          <div className="w-full md:w-1/2 p-6 md:p-12 relative">
           {descriptions.map((desc, index) => (
             <WordReveal key={index} text={desc} />
           ))}
          </div>

        </div>

      </div>
    </ReactLenis>
  );
};

export default Words;
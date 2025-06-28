
import { ReactLenis } from "lenis/react";

import { useEffect, useRef } from "react";

const Card = ({ data = [] }) => {
 const cardsContainerRef = useRef(null);

  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;

    const cards = cardsContainer.querySelectorAll(".stack-card");

    // Get the outer 420vh scroll container
    const parentContainer = cardsContainer.closest(".stats-scroll");

    const rotateCards = () => {
      cards.forEach((card, index) => {
        if (card.classList.contains("card-away")) {
          const transformType = index % 4;
          let transform = '';
          
          if (transformType === 0) {
            transform = `translateX(150vh)`;
          } else if (transformType === 1) {
            transform = `translateX(-150vh)`;
          } else if (transformType === 2) {
            transform = `translateY(150vh)`;
          } else if (transformType === 3) {
            transform = `translateY(-150vh)`;
          }
          
          card.style.transform = transform;
        } else {
          card.style.transform = 'none';
          card.style.zIndex = cards.length - index;
        }
      });
    };

    const handleScroll = () => {
      if (!parentContainer) return;
      const distance = window.innerHeight * 0.5;
      const topVal = parentContainer.getBoundingClientRect().top;
      let index = -1 * (topVal / distance + 1);
      index = Math.floor(index);

      cards.forEach((card, i) => {
        if (i <= index) {
          card.classList.add("card-away");
        } else {
          card.classList.remove("card-away");
        }
      });
      rotateCards();
    };

    rotateCards();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  return (
    <div ref={cardsContainerRef} className="mx-auto">
      {data.map((card, index) => (
      <div
  key={index}
  className={`
    stack-card mx-auto z-100  self-center mb-2.5 absolute 
    transition-all duration-500 ease-in-out box-border p-6 md:p-7 flex flex-col 
    justify-between ${
    index % 2 === 0 
      ? 'bg-orange-600 text-white dark:bg-orange-600 dark:text-white' 
      : 'bg-orange-50 text-gray-900 dark:bg-[#151515] dark:text-white border border-orange-200 dark:border-[#1a1a1a]'
  }
    stack-card absolute mx-auto z-100 
    w-[90vw] left-[5vw]
    sm:w-[85%] sm:left-[7.5%]
    md:w-[70%] md:left-[15%]
    lg:w-[64%] lg:left-[18%]
    xl:w-[70%] xl:left-[15%]
    h-80 lg:h-100 md:h-95 rounded-[25px] 
    `}
  style={{
    top: '23vh',
  }}
>
            <div className="text-[35px] md:text-[34px] font-bold mb-3">
              {card.sub}
            </div>
              <p className={`text-xs  lg:max-w-[60%] md:text-sm leading-relaxed font-medium line-clamp-2 ${
              index % 2 === 0 ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {card.desc}
            </p>
            <div className="font-poppins mt-auto font-bold text-[65px] md:text-[100px] mb-4 leading-13">
              {card.content}
            </div>
          
          </div>
      ))}
    </div>
  );
};

const StatsSection = () => {
  const statsData = [
    { sub: "Active Projects", content: "1000+", desc: "Organizations collaborating and managing projects seamlessly on Collabora8r every single day, building stronger teams and delivering better results" },
    { sub: "Team Members", content: "50K+", desc: "Professionals worldwide working together collaboratively to achieve ambitious project goals, milestones, and deliver exceptional value to their organizations" },
    { sub: "Tasks Managed", content: "500K+", desc: "Tasks meticulously created, assigned, tracked and successfully completed across thousands of projects with precision and transparency" },
    { sub: "Real-time Updates", content: "24/7", desc: "Instant notifications and live updates keeping teams perfectly synchronized, informed and connected no matter where they are located globally" },
    { sub: "Uptime Guarantee", content: "99.9%", desc: "Highly reliable and stable infrastructure ensuring your critical projects are always accessible and running smoothly without interruptions" },
    { sub: "Support Teams", content: "24/7", desc: "Dedicated, responsive support specialists available round-the-clock providing immediate assistance and solutions for any challenges you encounter" },
  ];

  return (
    <ReactLenis root>
      <div className="stats-scroll max-w-6xl mx-auto overflow-clip relative w-full transition-colors duration-300" style={{ height: '400vh' }}>

        {/* Single sticky viewport — both rows always visible */}
        <div className="sticky top-0 h-screen ">
           <div className="h-[50vh] md:h-full relative">
              <Card data={statsData} />
            </div>
        </div>

      </div>
    </ReactLenis>
  );
};

export default StatsSection;
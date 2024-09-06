import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRegStar, FaRegHandshake, FaUserTie } from 'react-icons/fa';

import { FaUsers } from 'react-icons/fa';
import { IoMdPeople } from 'react-icons/io';
import { GiCheckMark, GiFactory, GiPencilBrush } from 'react-icons/gi';

import AboutPage from "../../Assets/1.jpg"

const About = () => {
  // Animation variants
  const Aboutref = useRef(null); // Create a ref for the Privacy Policy section

  useEffect(() => {
    if (Aboutref.current) {
      Aboutref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div ref={Aboutref} className="about-us bg-gray-50 py-10 sm:px-6 lg:px-0">
      <div className="container mx-auto">

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="pb-16 lg:px-4"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="md:w-1/2">
                <img
                  src={AboutPage}
                  alt="Texleath Industries"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:p-8 ">
                <h2 className="text-4xl font-bold mb-6 text-red-600">
                  About Us
                </h2>
                <p className="text-lg mb-6">
                  Texleath Industries is a leading name in the world of premium clothing. Our dedication to quality and innovation sets us apart. From high-end clothing sales to state-of-the-art manufacturing processes, and a seamless export service, we are committed to excellence at every step.
                </p>
                <p className="text-lg">
                  Founded on the principles of quality and customer satisfaction, we pride ourselves on delivering products that exceed expectations. Our team of experts ensures that every garment meets the highest standards of craftsmanship and style.
                </p>
              </div>
            </div>
          </div>
        </motion.section >

        {/* Our Vision Section */}
        <motion.section
          className="bg-red-50 px-5 lg:px-20 py-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-red-900 text-center">
            What We Offer
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {/* Existing Cards */}
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <FaRegStar className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Manufacturing</h3>
                <p className="text-gray-600">Delivering products that exceed expectations in quality and design.</p>
              </div>
            </motion.div>
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <IoMdPeople className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Sales</h3>
                <p className="text-gray-600">Prioritizing our customers’ needs and delivering exceptional service.</p>
              </div>
            </motion.div>
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <GiCheckMark className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Export</h3>
                <p className="text-gray-600">Maintaining honesty and transparency in all our dealings.</p>
              </div>
            </motion.div>
            {/* Additional Cards */}
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <GiFactory className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Customization</h3>
                <p className="text-gray-600">Utilizing state-of-the-art technology to ensure high production standards.</p>
              </div>
            </motion.div>
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <GiPencilBrush className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Design</h3>
                <p className="text-gray-600">Crafting unique designs that reflect elegance and style.</p>
              </div>
            </motion.div>
            <motion.div
              className="card bg-white p-6 rounded-lg shadow-md flex items-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <FaUsers className="text-red-500 text-5xl mr-4" />
              <div>
                <h3 className="text-xl font-semibold">Customer Support</h3>
                <p className="text-gray-600">Providing exceptional support to ensure customer satisfaction.</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section className='md:w-[90%] w-[95%] mt-[35px] xl:w-[80%] mx-auto flex  bg-gradient-to-t from-red-400 via-red-100 to-red-400 rounded-md py-[40px] sm:py-[85px] xsx:py-[105px]' >
        <div className='w-[40%] mt-[-28px] lg:mt-[-15px] xl:mt-[5px] sm:ml-[45px] ml-[35px] mr-[-45px] scale-75 sm:scale-125 xsx:scale-150'>
          <div className="cycle-loader"></div>
        </div>
        <div className='w-[60%] flex flex-col justify-center'>
          <p className='text-[30px] sm:text-[45px] xsx:text-[55px] xl:text-[68px] text-white font-extrabold text-center'>FREE DELIVERY</p>
          <p className='text-[17px] sm:text-[32px] xsx:text-[40px] xl:text-[50px] text-red-200 font-medium text-center'>ON <span className='text-red-500'>PKR 10,000</span> OR ABOVE</p>
        </div>
      </section>

        {/* Meet the Team Section */}
        <motion.section
          className="meet-the-team py-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Meet the Team</h2>
          <p className="text-lg text-gray-700 mb-4">
            Our team of dedicated professionals brings a wealth of experience and a passion for excellence to Texleath Industries. Get to know the people behind the brand who make our vision a reality.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="team-member bg-white p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-center">Jane Doe</h3>
              <p className="text-gray-600 text-center">CEO & Founder</p>
              <p className="text-gray-600 text-center mt-2">Jane is the visionary behind Texleath Industries, guiding the company with her passion for innovation and excellence.</p>
            </motion.div>
            <motion.div
              className="team-member bg-white p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-center">John Smith</h3>
              <p className="text-gray-600 text-center">Head of Design</p>
              <p className="text-gray-600 text-center mt-2">John leads our design team, ensuring that each product reflects our commitment to style and quality.</p>
            </motion.div>
            <motion.div
              className="team-member bg-white p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-center">Emily Davis</h3>
              <p className="text-gray-600 text-center">Chief Marketing Officer</p>
              <p className="text-gray-600 text-center mt-2">Emily drives our marketing efforts, building the Texleath brand and connecting with our customers.</p>
            </motion.div>
          </div>
        </motion.section>
        {/* Our Values Section */}
        <motion.section
          className="our-values px-3 lg:px-20 bg-gradient-to-br from-red-900 to-custom-red py-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
           <h2 className="text-2xl md:text-4xl font-bold mb-4 text-red-50 text-center">Our Values</h2>
          <p className="text-lg text-red-300 font-serif text-center mb-4">
            At Texleath Industries, our values are the cornerstone of our business. They guide our actions, shape our culture, and define our commitment to excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="value-card bg-red-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <FaRegHandshake className="text-red-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-red-600">Working together to achieve common goals and drive success.</p>
            </motion.div>
            <motion.div
              className="value-card bg-red-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <FaUserTie className="text-red-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professionalism</h3>
              <p className="text-gray-600">Maintaining the highest standards of conduct in every aspect of our business.</p>
            </motion.div>
            <motion.div
              className="value-card bg-red-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <FaRegStar className="text-red-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">Ensuring our products meet the highest standards of excellence and craftsmanship.</p>
            </motion.div>
            <motion.div
              className="value-card bg-red-50 p-6 rounded-lg shadow-md"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <IoMdPeople className="text-red-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Respect</h3>
              <p className="text-gray-600">Valuing and honoring the individuality and contributions of each person.</p>
            </motion.div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default About;

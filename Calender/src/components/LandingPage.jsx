import React from "react";
import { motion } from "framer-motion"; // 👈 Import Framer Motion
import CustomCarousel from './CustomCarousel'; // 👈 Import CustomCarousel component

const LandingPage = () => {
  return (
    <div className="h-[100vh] flex justify-center p-6 max-md:p-4">
      <div className="h-[100%] w-[100%] flex max-md:flex-col md:flex-row items-center justify-between md:px-16 font-poppins font-normal not-italic">
        {/* LEFT SECTION */}
        <div className="h-[100%] w-[90%] max-md:w-full max-md:flex max-md:flex-col max-md:items-center max-md:text-center">
          {/* LOGO */}
          <div className="pb-10 max-md:pb-6">
            <img src="/slogo.png" alt="Tiro.ai Logo" className="h-16 max-md:h-12" />
          </div>

          {/* MAIN TEXT */}
         <h1 className="text-[66px] max-md:text-10xl leading-tight text-black font-poppins font-normal not-italic">
            AI Assistant <br />School Management Platform
          </h1>

          {/* BUTTONS */}
          <div className="mt-8 max-md:mt-6 flex gap-4 max-md:flex-col max-md:gap-3 max-md:items-center">
            <button className="bg-black text-[17px] max-md:text-base text-white w-40 max-md:w-32 py-3 max-md:py-2 rounded-full text-sm font-semibold hover:bg-gray-900 transition-all">
              Login
            </button>
            <button className="bg-white text-[17px] max-md:text-base text-black w-40 max-md:w-32 py-3 max-md:py-2 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition-all">
              Signup
            </button>
          </div>

          {/* SUBTEXT */}
          <p className="text-black-800 mt-20 max-md:mt-8 text-base md:text-lg max-w-[500px] max-md:max-w-[90%] max-md:mx-auto">
            The first school management assistant that uses AI to track live data in real-time—giving admins, teachers, and parents accurate updates, reports, and communication you can trust.
          </p>
        </div>

        {/* RIGHT SECTION WITH ANIMATION */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-[80%] max-md:w-full max-md:mt-28 md:mt-0"
        >
          <div className=" bg-[radial-gradient(at_left_bottom,_rgb(76,0,130),_rgb(88,28,135),_rgb(109,40,217),_rgb(126,34,206),_rgb(192,132,252),_rgb(243,232,255))] 
            backdrop-blur-xl 
            rounded-3xl 
            p-6 md:p-10 
            shadow-[0_0_80px_rgba(168,85,247,0.4)] 
            h-[600px]  max-md:h-[400px] 
            flex 
            items-center 
            justify-center 
            transition-all duration-500"
          >
            <CustomCarousel />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
import React from "react";
import { motion } from "framer-motion"; // 👈 Import Framer Motion
import CustomCarousel from './CustomCarousel'; // 👈 Import CustomCarousel component

const LandingPage = () => {
  return (
    <div className="h-[500px] w-full flex md:flex-row items-center justify-between md:px-16 font-sans  ">

      {/* LEFT SECTION */}
      <div className="w-full md:w-1/2 mb-12  relative min-h-[600px] content-center ">
        {/* LOGO */}
        <div className="w-full flex justify-start mb-12 items-center ">
          <img src="/slogo.png" alt="Tiro.ai Logo" className="h-16" /> {/* change src */}
        </div>
        {/* <div className="text-xl font-bold mb-6">Tiro.ai</div> */}

        {/* MAIN TEXT */}
        <h1 className="text-[64px] md:text-[64px] leading-tight font-bold text-black">
          Verified emails.
          <br />
          Accurate Phone Numbers
        </h1>

        {/* SUBTEXT */}
        <p className="text-black-800 mt-32 text-base md:text-lg max-w-md">
          The first prospecting tool that pulls live data in real-time as you
          search—giving you accurate, reliable contact info you can count on
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button className="bg-black text-white w-40 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 transition-all">
            Login
          </button>
          <button className="bg-white text-black w-40 py-3 rounded-full border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition-all">
            Signup
          </button>
        </div>
      </div>

      {/* RIGHT SECTION WITH ANIMATION */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full md:w-1/2 relative"
      >


        {/* purple 6 shades */}

        <div className="bg-[radial-gradient(at_left_bottom,_rgb(76,0,130),_rgb(88,28,135),_rgb(109,40,217),_rgb(126,34,206),_rgb(192,132,252),_rgb(243,232,255))] 
    backdrop-blur-xl 
    rounded-3xl 
    p-6 md:p-10 
    shadow-[0_0_80px_rgba(168,85,247,0.4)] 
    h-[600px] 
    flex 
    items-center 
    justify-center 
    transition-all duration-500">



          <CustomCarousel />
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

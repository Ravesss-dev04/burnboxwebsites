import { motion } from 'framer-motion'
import React from 'react'

const MissionVission = () => {
  return (
    <section  id='mission-and-vision' className=' bg-[#333] z-[1] mt-20 w-full min-h-[100vh] overflow-hidden flex flex-col items-center pb-10' style=
    {{
    backgroundImage: "url('/missionbg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '80vh',
  }}>
        <div className=' max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-50 md:gap-20  px-2 lg:px-2  mt-80 md:mt-80'>
    {/* mission and vission cards */}
    {/* mission */}
      <motion.div
        className=' relative bg-[#4A4A4A] rounded-lg 
                  p-8 sm:p-10 md:p-20 
                  text-center shadow-lg flex flex-col justify-start 
                  h-full min-h-[300px] sm:min-h-[360px] md:min-h-[380px] '
      >
        <img src="/missionimage.png" alt="mission" draggable="false" 
          className=' absolute left-1/2 lg:left-1/7    -translate-x-1/3
        translate-y-[-200px] sm:translate-y-[-60px] md:translate-y-[-80px] lg:translate-y-[-300px] 
        w-[200px] sm:w-[120px]  md:w-[150px] lg:w-[240px]
        rotate-[-10deg] sm:rotate-[-15deg] md:rotate-[-20deg] lg:rotate-[-25deg]
        h-auto object-contain z-[-1]'
        />
        <h3 className='text-[25px] font-bold mb-10 lg:mb-10 mt-4 text-pink-500'>Our Mission</h3>
        <p className='text-[16px] sm:text-base md:text-lg leading-relaxed'>
          To exceed client expectations by delivering innovative printing solutions, exceptional services continuous improvement in everything we do.
        </p>
      </motion.div>
    <div className='relative'>
      <img src="/rrr4.png" alt="background image" width={500} height={500}
        className='absolute right-300 pt-20 -translate-y-1/5  w-full h-[100vh] pointer-events-none select-none hidden md:block opacity-20 z-[-9]'
      />
      <img src="/imgggcolor.png" alt="background image" width={500} height={500}
        className='absolute top-50 left-100 -translate-y-4/8 w-[500px] rotate-[-60deg] h-auto object-contain opacity-70 z-[-1]'
      />
      {/* vission */}
       <motion.div
          viewport={{ once: false }}
          className="relative  bg-[#4A4A4A] rounded-lg p-10 sm:p-20 md:p-20 text-center shadow-lg flex flex-col justify-start h-full pb-10"
        >
          {/* Floating Image */}
          <img
            src="/visionimages.png"
            alt="Vision"
            draggable="false"
            className=" absolute left-1/2 lg:left-5/6 lg:-top-1/5 -translate-x-1/2
            translate-y-[-200px] sm:translate-y-[-60px] md:translate-y-[-80px] lg:translate-y-[-140px]
            w-[200px] sm:w-[120px] md:w-[150px] lg:w-[240px]
            rotate-[10deg] sm:rotate-[15deg] md:rotate-[20deg] lg:rotate-[25deg]
            h-auto object-contain z-[-1]"
          />
          {/* Content */}
          <h3 className="text-lg lg:text-[25px] font-bold mb-10 lg:mb-10 mt-4">Our Vision</h3>
          <p className="text-lg leading-relaxed">
To become the go-to creative printing partner for businesses nationwide, recognized for reliability, creativity, and quality that inspires clients to recommend us again and again.          </p>
        </motion.div>
          </div>
         </div>
    </section>
  )
}
export default MissionVission
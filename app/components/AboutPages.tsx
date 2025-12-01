"use client";
import { motion, useInView } from 'framer-motion'
import React, { useRef } from 'react'
import MissionVission from './MissionVission'

const AboutPages = () => {
  const aboutRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.2 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 });
  const textInView = useInView(textRef, { once: true, amount: 0.3 });

  return (
    <section 
      id='about-us'
      className='min-h-[100vh] text-white flex flex-col relative items-center overflow-hidden pt-20 md:pt-32 pb-10'
    >
      {/* Animated background decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={aboutInView ? { opacity: 0.7, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute right-0 top-0 w-[800px] md:w-[1000px] lg:w-[1200px] opacity-70 pointer-events-none select-none hidden md:block"
        style={{ zIndex: 0 }}
      >
        <img
          src="/vsvissionabout.png"
          alt="Decorative background"
          className="w-full h-auto"
        />
      </motion.div>

      {/* Main content container */}
      <motion.div
        ref={aboutRef}
        initial={{ opacity: 0 }}
        animate={aboutInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className='relative w-full max-w-7xl flex flex-col items-center z-10 px-4 md:px-8'
      >
        {/* Image section */}
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, y: 50, rotate: -10 }}
          animate={imageInView ? { opacity: 1, y: 0, rotate: 10 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2
          }}
          className='mt-10 md:mt-20 mb-8 md:mb-0 flex flex-col items-center relative z-20'
        >
          <motion.img
            alt='Hand illustration'
            src="/aboutimage1.png"
            className='w-[200px] sm:w-[240px] md:w-[300px] lg:w-[350px] -mb-16 md:-mb-20 md:absolute md:-top-[10rem] md:right-1/2 md:translate-x-1/2'
            whileHover={{ 
              scale: 1.1, 
              rotate: [10, 15, 10],
              transition: { duration: 0.5 }
            }}
          />
        </motion.div>
        {/* Text content card */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={textInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.4
          }}
          className='relative bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#3a3a3a] md:mt-32 p-6 md:p-10 lg:p-12 w-full md:max-w-4xl rounded-2xl md:rounded-3xl text-center shadow-2xl border border-gray-700/50 backdrop-blur-sm z-10'
        >
          {/* Decorative gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-purple-500/5 rounded-2xl md:rounded-3xl'></div>
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={textInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className='relative z-10'
          >

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={textInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent'
            >
              
              About Burnbox Printing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={textInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className='text-gray-200 leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl font-light'
            >
              Founded in 2015, Burnbox Printing has grown from a small printing shop into one of the most trusted partners for businesses and individuals in signage fabrication, large-format printing, and creative branding solutions. We don't just print—we bring ideas to life, transforming concepts into powerful visuals that build brands, attract customers, and leave lasting impressions.
            </motion.p>
          </motion.div>

          {/* Shine effect on hover */}
          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full rounded-2xl md:rounded-3xl'
            whileHover={{
              translateX: '200%',
              transition: { duration: 0.6 }
            }}
          ></motion.div>
        </motion.div>
      </motion.div>

      {/* Mission and Vision section */}
      <MissionVission/>
    </section>
  )
}

export default AboutPages


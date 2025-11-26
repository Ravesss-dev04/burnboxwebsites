"use client";
import React from 'react'
import AboutPages from '../components/AboutPages';
import Footer from '../components/Footer';

const page = () => {
  return (
    <div className='relative min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black'>
      {/* Background with overlay */}
      <div 
        className='absolute inset-0 opacity-30'
        style={{
          backgroundImage: "url('/missionbg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content */}
      <div className='relative z-10'>
        <AboutPages/>
        <Footer/>
      </div>
    </div>
  )
}

export default page





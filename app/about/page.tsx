"use client";
import React, { Suspense, useState } from 'react'

import AboutPages from '../components/AboutPages';
import Footer from '../components/Footer';

const page = () => {
 
  return (
    <div>
    <div  style={{backgroundImage: "url('/missionbg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '80vh',
    opacity: 2
    }}>
        <AboutPages/>
        <Footer/>
      </div>
    </div>
  )


}
export default page





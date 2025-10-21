import React from 'react'
import { Suspense, useEffect, useState } from "react";
import { CardCarousel,IntroductionVideo, EmailPopup, Maps} from "../components";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Footer from "../components/Footer";
import WhyChooseBurnboxPage from "../components/WhyChooseBurnBox";
import GalleryPhotos from "../components/GalleryPhotos";
import { HeaderProvider } from "../context/HeaderContext";
import { TooltipProvider } from "../context/TooltipContext";
import ServicesProduct from "../components/ServicesProduct";

const MainPage = () => {
  const [videoVisible, isVideoVisible] = useState(true);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedServiceFromHeader, setSelectedServiceFromHeader] = useState<string | null>(null);
  
    
  useEffect(() => {
    if (!videoVisible) {
      setShowEmailPopup(true); 
    }
  }, [videoVisible]);
  
  return (
    <div className="h-full max-w-full flex flex-col  bg-black relative overflow-x-hidden p-0 m-0">
       {videoVisible && <IntroductionVideo isVideoVisible={isVideoVisible} />}
      <AnimatePresence mode="wait">
        {showEmailPopup && <EmailPopup setShowEmailPopup={setShowEmailPopup} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!showEmailPopup && (
          <motion.button 
            type="button" 
            className='p-3 rounded-full shadow-md bg-white fixed top-5/6 right-5 z-70'
            animate={{ x: [10, -10] }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 20,
              repeat: Infinity,
              repeatType: 'mirror',
              repeatDelay: 1.5
            }}
            onClick={() => setShowEmailPopup(true)}
          >

            <Image
              height={500}
              width={500}
              alt='gmail icon'
              src={'/gmail.png'}
              className='h-7 w-7 object-center object-contain'
            />
          </motion.button>
        )}
      </AnimatePresence>
      <CardCarousel />
      <div id="why-choose-burnbox">
      <WhyChooseBurnboxPage/>
      </div>
      <div  className="h-auto w-full bg-white flex flex-col">
       <GalleryPhotos/>
      </div>
      <Maps /> 
     <Footer/>
    </div>
  )
}


export default MainPage

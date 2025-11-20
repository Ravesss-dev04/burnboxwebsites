import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import React from 'react'

const MissionVission = () => {
  return (
    <section  id='mission-and-vision' className=' bg-[#333] z-[1] mt-20 w-full min-h-[100vh] overflow-hidden flex flex-col items-center pb-10 py-16 gap-10'  style=
    {{
    backgroundImage: "url('/missionbg.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '80vh',
  }}>
        {/* mission section */}
        <div className='flex flex-col   md:flex-row justify-between items-center bg-[#232323] rounded-2xl p-8 md:-12 '>
          {/* text */}
          <div className='relative md:w-1/2 text-center md:text-left space-y-4 overflow-hidden'>
            <div className='relative flex items-center justify-center md:justify-start gap-2'>
              <h2 className='text-[35px] font-semibold  italic'>Our Mission</h2>
              <img src="/missionicon.png" alt="" className='md:w-[160px] w-[90] h-auto object-contain' width={50} height={50} />
              <span className='absolute md:top-7 top-2 bg-pink-500 w-29 h-[2px] left-20 right-12 -translate-x-1'></span>
            </div>
            <p className='text-gray-300 leading-relaxed  text-[20px] break-words'>To exceed client expectations by delivering innovative printing
            solutions, exceptional services, and continuous improvement in
            everything we do.
            </p>
          </div>
          {/* image */}
          <div className='relative md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end'>
            <img src="/mission.png" alt="mission"  className='w-60 m-auto md:w-99 object-contain'/>
            <div className='absolute bottom-0 w-80 h-5 md:bottom-0 md:w-120 md:h-5 bg-gradient-to-t from-[#333333] to-[#99999980] blur-md rounded-full'>
            </div>
          </div>
      </div>
      {/* vission */}
      <div className='bg-gradient-to-b from-[#000000] to-[#99999990]   flex flex-col md:flex-row-reverse justify-between items-center rounded-2xl p-8  md:p-12'>
            {/* text */}
            <div className='md:w-1/2 max-w-full text-center md:text-left space-y-4'>
              <div className='relative flex items-center justify-center md:justify-center gap-2'>
                <h2 className='text-[35px] italic font-semibold'>Our Vision</h2>
                <img src="/vissionicon.png" alt="" className='w-[90px] h-auto object-contain' width={50} height={50} />

                <span className='absolute md:top-1 top-1 w-23 h-[2px] left-20 bg-pink-500 md:w-23 md:h-[2px] md:left-20 md:right-12 md:translate-x-68 translate-x-2'></span>
              </div>
              <p className='text-gray-300 leading-relaxed text-[20px] md:text-base'>
                 To become the go-to creative printing partner for businesses
            nationwide, recognized for reliability, creativity, and quality that
            inspires clients to recommend us again and again.
              </p>
            </div>
            <div className='relative md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-start'>
              <img src="/visionimg.png" alt="vission" className=' w-60 md:w-99 m-auto  object-contain'/>
               <div className='absolute w-70 h-5 bottom-0 md:bottom-0 md:w-120 md:h-5 bg-gradient-to-t from-[#333333] to-[#999999] blur-md rounded-full'>
            </div>
            </div>
        </div>
    </section>
  )
}
export default MissionVission
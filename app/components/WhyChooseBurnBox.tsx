import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'
import EditableText from '../admin/components/EditableText'

interface AboutSectionProps {
  editable?: boolean
}

const WhyChooseBurnboxPage: React.FC<AboutSectionProps> = ({editable = false}) => {
  const [title, setTitle] = useState("Why Choose burnbox Printing?")
  return (
   <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 0.8, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ duration: 0.5 }}  
    whileInView={{scale: 1}}
    viewport={{once: false, amount: 0.4}}
  >
    <section  className='bg-gray-100 text-white px-8 py-10 min-h-[55vh]'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-12'>
        
         <div className='w-full'>
          {/* image here */}
          <Image
            src="/aboutusimage.png"
            alt='burnbox Storefront'
            width={1000}
            height={1000}
          />
         </div>
         {/* about descriptuon */}
    
         <div className='text-black space-y-8 text-sm md:text-base leading-relaxed'>
          <h1 className='text-3xl text-center text-pink-500 font-bold'><EditableText text={title} onChange={setTitle} editable={editable}/></h1>
          <p  className='text-black' > One-Stop Printing Partner - From business cards to massive billboards, we cover it all.
          </p>
          <p >
           Quality Meets - State-of-thee-art machines and skilled artists deliver premium output everytime.
          </p>

          <p>
           Tailored Solutions - We don't just print; we design and strategize to fit your exact brand goals.
          </p>

          <p>
              Proven Trust - Proudly serving SMEs, big brands, and government clients with repeat partnerships since 2015
          </p>
          <p>
            hassle-Free Service-Fast turnaround, expert installation, and after-sales support
          </p>
         </div>
       
    </div>
 
    </section>
</motion.div>
  )
}

export default WhyChooseBurnboxPage


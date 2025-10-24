import React from 'react'

import { Header } from '../components'
import WhyChooseBurnboxPage from '../components/WhyChooseBurnBox'
import Home from '../page'

interface CustomizeDarkmodeOpen {
  darkmode?: boolean;
}

const Customize = ({darkmode =  false}: CustomizeDarkmodeOpen) => {
  return (
    <div className=' bg-white shadow-md rounded-xl p-6 w-full h-full'>

        <div className='overflow-y-auto h-[80vh]'>

        <div className='relative  rounded-md bg-black/20 w-full h-15'>
                <button className='absolute text-[12px]  top-0 right-0  h-full bg-pink/50 p-2 text-white font-medium rounded-md text-center'>Save Changes</button>
        </div>
        <div className='h-full w-[1600px] flex flex-col  bg-black relative overflow-x-hidden p-0 m-0'>
        <Home />
        </div>
        </div>
    </div>
  )
}






export default Customize

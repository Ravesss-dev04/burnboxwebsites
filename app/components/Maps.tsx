import React from 'react'
import StoreLocation from './StoreLocation'
import StoreDetail from './StoreDetail'



const Maps = () => {
  const handleDirectionClick = () => {
  console.log("Directions clicked");

  // Optionally set a target or interact with the map if needed
};
  return (
    <div className='min-h-[100vh] min-w-[100vw] z-0 relative  bg-white overflow-hidden'>
        <div className='rounded-lg  p-4 h-auto  sm:w-[300px] md:w-[350px] lg:w-[400px] absolute top-1/2 -translate-y-1/2  left-1 lg:left-5 z-[999] bg-black'>
          <StoreDetail onDirectionClick={handleDirectionClick} />
        </div>
        <StoreLocation />
    </div>
  )
}
export default Maps
import React, { useState } from 'react'
import StoreDetail from './StoreDetail';
import StoreLocation from './StoreLocation';




const StoreLocatorPage = () => {

    const [target, setTarget] = useState<[number, number] | null>(null);

    const handleDirectionClick = () => {
        setTarget([14.428425252312016, 120.98849405250161]);
    };

return (
    <div className='flex flex-col md:flex-row h-full w-full'>
        <div className='w-full  md:w-1/3 p-4 bg-black'>
            <StoreDetail onDirectionClick={handleDirectionClick}/>
        </div>
        <div className='w-full md:-2/3 h-[500px]'>
            <StoreLocation target={target || undefined} />
        </div>
    </div>
  )
}

export default StoreLocatorPage




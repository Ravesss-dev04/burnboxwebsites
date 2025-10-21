import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

interface StoreDetailProps {
    onDirectionClick: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ onDirectionClick }) => {

  return (
    <div className='text-white space-y-3   lg:space-y-4  lg:p-2 text-sm font-light'>

        <div className=''>
            <h2 className='text-lg font-semibold'>Our Stores</h2>
            <p className='flex items-start gap-2 mt-2'>
            <FaLocationDot className='text-pink-500 mt-1'/>
            <span>
                <strong>BF Resort Branch</strong><br />
                Unit 109, 17 Vatican Bldg.<br />
                BF Resort Village, Las Pinas City
            </span>
            </p>
        </div>
        <div className='flex items-start gap-2'>
            <FaCalendar className='mt-1 text-pink-500'/>
            <p>Mon - Fri, 8:00 am - 10:00PM</p>
        </div>
        <div>
            <p>
                Mobile: <a href="tel: +639177008364">+63 917 700 8364</a>
                Tel: <a href="tel:+63270072416" >(02) 7007 2416</a>
            </p>
        </div>
        <div>
            <p>Online Shop - Business Hours: 24/7</p>
            <p>
                Email: {""}
                <a href="mail:burnboxprinting@gmail.com">
                    burnboxprinting@gmail.com
                </a>
            </p>
        </div>
        <div className='flex gap-3 mt-4'>
            <button className='bg-gray-800 px-4 py-2 rounded flex items-center gap-2'>
                <FaPhoneAlt className='text-pink-500'/>
            </button>
             <button onClick={onDirectionClick} className='text-pink-500 px-4 bg-transparent border  py-2 rounded flex items-center gap-2'>
                <FaLocationDot />
                <span className='text-white'>Directions</span>
            </button>
        </div>
    </div> 
  )
}




export default StoreDetail



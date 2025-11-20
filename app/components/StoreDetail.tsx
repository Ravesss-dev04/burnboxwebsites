// app/components/StoreDetail.tsx
import React, { useState, useEffect } from 'react'

import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";

interface StoreDetailProps {
    onDirectionClick: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ onDirectionClick }) => {
  // Coordinates for BF Resort Branch
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  const bfResortCoords = {
    lat: 14.428425252312016,
    lng: 120.98849405250161
  };

  // Function to handle calls
  const handleCall = () => {
    window.open('tel:+639177008364', '_self');
  };

  // function if the store is Open

  const checkStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // format current time for display

    const formattedTime =  now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setCurrentTime(formattedTime);


      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5; // Monday = 1, Friday = 5
      const isOpenHours = currentHour >= 10 && currentHour < 22;
    
    // Special case: exactly 10:00 PM should be closed
    const isExactly10PM = currentHour === 22 && currentMinutes === 0;
    
    setIsOpen(isWeekday && isOpenHours && !isExactly10PM);
  }


  useEffect(() => {
    // check status
    checkStatus();
    // update every minute
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  // function

  

  // Enhanced directions function
  const handleGetDirections = () => {
    // Call the parent function to animate the map
    onDirectionClick();
    
    // Open directions in new tab after a short delay
    setTimeout(() => {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bfResortCoords.lat},${bfResortCoords.lng}`;
      const appleMapsUrl = `http://maps.apple.com/?daddr=${bfResortCoords.lat},${bfResortCoords.lng}`;
      
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.open(appleMapsUrl, '_blank');
      } else {
        window.open(googleMapsUrl, '_blank');
      }
    }, 500);
  };

  return (
    <div className='text-white space-y-3 lg:space-y-4 lg:p-2 text-sm font-light'>
        <div className=''>
            <h2 className='text-lg font-semibold'>Our Store</h2>
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
            <div>
              <p className='flex items-center gap-2'>
                Mon - Fri, 10:00 am - 10:00 PM
                <span 
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isOpen 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  <span 
                    className={`w-2 h-2 rounded-full mr-1 ${
                      isOpen ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  ></span>
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              </p>
              
            </div>
        </div>
        <div>
            <p>
                Mobile: <a href="tel:+639177008364" className="hover:text-pink-300">+63 917 700 8364</a>
            </p>
            <p>
                Tel: <a href="tel:+63270072416" className="hover:text-pink-300">(02) 7007 2416</a>
            </p>
        </div>
        <div>
            <p>Online Shop - Business Hours: 24/7</p>
            <p>
                Email: {""}
                <a href="mailto:burnboxprinting@gmail.com" className="hover:text-pink-300">
                    burnboxprinting@gmail.com
                </a>
            </p>
        </div>
        <div className='flex gap-3 mt-4'>
            <button 
              onClick={handleCall}
              className='bg-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors'
            >
                <FaPhoneAlt className='text-pink-500'/>
                <span>Call</span>
            </button>
            <button 
              onClick={handleGetDirections} 
              className='text-pink-500 px-4 bg-transparent border border-pink-500 py-2 rounded flex items-center gap-2 hover:bg-pink-500 hover:text-white transition-colors'
            >
                <FaLocationDot />
                <span>Directions</span>
            </button>
        </div>
    </div> 
  )

}

export default StoreDetail
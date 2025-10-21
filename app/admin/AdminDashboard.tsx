
import { motion } from 'framer-motion';
import { HomeIcon, LogOutIcon, Menu, MoonIcon, PersonStanding, X } from 'lucide-react';
import Image from 'next/image'
import React, { JSX, useState } from 'react'
import { BiSolidCustomize } from 'react-icons/bi';
import { FaProductHunt, FaUserCircle } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiMailSendFill } from 'react-icons/ri';
import DashboardContent from './DashboardContent';
import Customize from './Customize';


const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard")
  const sectionMap: Record<string, JSX.Element> = {
    dashboard: <DashboardContent/>,
    customize: <Customize/>
  }

  return (
    <div className='relative flex  w-full h-full bg-gray-100 '>
        <div className='absolute flex gap-3 top-0 right-5 mt-2'>
          <MoonIcon size={30}/>
          
          <FaUserCircle onClick={() => setIsOpen(true)}  size={30} className='hover:text-pink/100'/>
       </div>

      <div
        className={`${isOpen ? 'w-64' : 'w-20'} relative bg-white border-r  border-gray-200 transition-all duration-300 flex flex-col `}
      >

        {/* sidebar */}
        <div className='flex  items-center justify-between  p-4 border border-gray-200'>
          <Image
            src="/bblogo.png"
            alt='logo'
            width={50}
            height={50}
            className={`transition-all duration-300 ${!isOpen && 'hidden'}`}
          />
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} className='text-pink/60'/> : <Menu size={22} className='w-9' /> }
          </button>
        </div>
           {/* sidebar menu */}
           <nav className='flex-1 p-4'>
               {[
                  { id: "dashboard", icon: <HomeIcon size={20} />, label: "Dashboard" },
                  { id: "product", icon: <MdOutlineProductionQuantityLimits size={20} />, label: "Product" },
                  { id: "inquiry", icon: <RiMailSendFill size={20} />, label: "Inquiry" },
                  { id: "customize", icon: <BiSolidCustomize size={25} />, label: "Customize" },
                ].map(({ id, icon, label }) => (
                  <div
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                      activeSection === id ? "bg-pink/60 text-white" : "hover:bg-pink/60 hover:text-white"
                    }`}
                >
              {icon}
              {isOpen && <span>{label}</span>}
            </div>
          ))}

           </nav>

        {/* logout */}
           <div className='p-4 border-t border-gray-400'>
            <button className='flex items-center gap-3 text-gray-700 hover:text-pink/80 w-full'>
              <LogOutIcon size={20} />
            {isOpen && <span>Logout</span>}
            </button>
           </div>
     </div>
        {/* content of dashboard */}
          <div className="flex-1 p-6 transition-all duration-300 w-full h-full bg-white/100">
          {sectionMap[activeSection]}
        </div>
      </div>
  )
}


export default AdminDashboard

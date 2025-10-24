import { motion } from 'framer-motion';
import { CalculatorIcon, GalleryThumbnailsIcon, HomeIcon, LogOutIcon, Menu, MoonIcon, PersonStanding, SunIcon, X } from 'lucide-react';
import Image from 'next/image'
import React, { JSX, ReactNode, useState, useEffect } from 'react'
import { BiSolidCustomize } from 'react-icons/bi';
import { FaProductHunt, FaUserCircle } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiMailSendFill } from 'react-icons/ri';
import DashboardContent from './DashboardContent';
import Customize from './Customize';
import CalculatorPage from './Calculator';
import GalleryManager from './GalleryManager';

interface AdminDashboardProps {
  userMail?: string;
  onLogout?: () => void;
  children?: ReactNode;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userMail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const sectionMap: Record<string, React.ReactElement> = {
    dashboard: React.createElement(DashboardContent as any, { userMail, onLogout, darkMode }),
    customize: <Customize />,
    calculator: <CalculatorPage  />,
    gallery: <GalleryManager darkMode={darkMode} />
  }

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedDarkMode = localStorage.getItem('adminDarkMode');
      console.log('Saved dark mode from localStorage:', savedDarkMode);
      
      if (savedDarkMode !== null) {
        // Safe JSON parsing with validation
        const parsed = JSON.parse(savedDarkMode);
        if (typeof parsed === 'boolean') {
          setDarkMode(parsed);
        } else {
          // If it's not a boolean, use system preference
          throw new Error('Invalid dark mode value');
        }
      } else {
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('System prefers dark:', systemPrefersDark);
        setDarkMode(systemPrefersDark);
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
      // Clear invalid data and use system preference
      localStorage.removeItem('adminDarkMode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply dark mode to the entire admin container
  useEffect(() => {
    if (!mounted) return;
    
    const adminContainer = document.getElementById('admin-container');
    if (adminContainer) {
      if (darkMode) {
        adminContainer.classList.add('dark');
        document.documentElement.classList.add('dark');
      } else {
        adminContainer.classList.remove('dark');
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('adminDarkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  }, [darkMode, mounted]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get first letter of email for avatar
  const getAvatarLetter = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : 'A'
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="admin-container"
      className={`relative flex w-full h-full transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Top Right Icons - Updated with Dark Mode Toggle */}
      <div className='absolute flex gap-3 top-0 right-5 mt-2 z-10'>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <SunIcon size={20} />
          ) : (
            <MoonIcon size={20} />
          )}
        </button>
        
        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          {userMail ? (
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-800 border-gray-600' 
                : 'bg-gray-100 border-gray-300'
            }`}>
              <div className="w-8 h-8 bg-[#F43C6D] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getAvatarLetter(userMail)}
              </div>
              <span className={`text-sm hidden md:block ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {userMail}
              </span>
            </div>
          ) : (
            <FaUserCircle 
              onClick={() => setIsOpen(true)} 
              size={30} 
              className={`hover:text-pink/100 transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${isOpen ? 'w-64' : 'w-20'} relative transition-all duration-300 flex flex-col z-20 ${
          darkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border-r`}
      >

        {/* Sidebar header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Image
            src="/bblogo.png"
            alt='logo'
            width={50}
            height={50}
            className={`transition-all duration-300 ${!isOpen && 'hidden'}`}
          />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {isOpen ? <X size={22} className='text-pink/60'/> : <Menu size={22} /> }
          </button>
        </div>
        
        {/* User Info in Sidebar - Only show when sidebar is open */}
        {isOpen && userMail && (
          <div className={`px-4 py-3 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F43C6D] rounded-full flex items-center justify-center text-white font-semibold">
                {getAvatarLetter(userMail)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Admin</p>
                <p className={`text-xs truncate ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{userMail}</p>
              </div>
            </div>
          </div>
        )}
        {/* Sidebar menu */}
        <nav className='flex-1 p-4'>
          {[
            { id: "dashboard", icon: <HomeIcon size={20} />, label: "Dashboard" },
            { id: "product", icon: <MdOutlineProductionQuantityLimits size={20} />, label: "Product" },
            { id: "inquiry", icon: <RiMailSendFill size={20} />, label: "Inquiry" },
            { id: "customize", icon: <BiSolidCustomize size={25} />, label: "Customize" },
            { id: "calculator", icon: <CalculatorIcon size={25}/>, label: "Calculator" },
            { id: "gallery", icon: <GalleryThumbnailsIcon size={25}/>, label: "Gallery" }
          ].map(({ id, icon, label }) => (
            <div
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                activeSection === id 
                  ? "bg-pink/60 text-white" 
                  : `${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
              }`}
            >
              {icon}
              {isOpen && <span>{label}</span>}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t ${
          darkMode ? 'border-gray-600' : 'border-gray-400'
        }`}>
          <button 
            onClick={onLogout}
            className={`flex items-center gap-3 w-full transition-colors duration-200 ${
              darkMode 
                ? 'text-gray-300 hover:text-pink-400' 
                : 'text-gray-700 hover:text-pink/80'
            }`}
          >
            <LogOutIcon size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 p-6 transition-all duration-300 w-full h-full ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {sectionMap[activeSection]}
      </div>
    </div>
  )
}

export default AdminDashboard
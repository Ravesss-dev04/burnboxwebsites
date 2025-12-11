
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Users
} from 'lucide-react';
import Image from 'next/image'
import React, { JSX, ReactNode, useState, useEffect } from 'react'
import DashboardContent from './DashboardContent';
import GalleryManager from './GalleryManager';
import CalculatorBox from './components/CalculatorBox';
import AdminServices from './AdminServices';
import SettingsAdmin from './SettingsAdmin';
import ProfileInfo from './ProfileInfo';

interface AdminDashboardProps {
  userMail?: string;
  userRole?: 'ADMIN' | 'STAFF';
  onLogout?: () => void;
  children?: ReactNode;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userMail, userRole = 'STAFF', onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const sectionMap: Record<string, React.ReactElement> = {
    dashboard: React.createElement(DashboardContent as any, { userMail, onLogout, darkMode: true }),
    services: <AdminServices/>,
    gallery: <GalleryManager darkMode={true} />,
    inquiry: <div className="text-white">Inquiry Component Placeholder</div>, // Placeholder if component missing
    profile: <ProfileInfo/>,
    settings: <SettingsAdmin/>,
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent direct navigation to settings by URL state if not admin
  useEffect(() => {
    if (userRole !== 'ADMIN' && activeSection === 'settings') {
      setActiveSection('dashboard');
    }
  }, [userRole, activeSection]);

  const getAvatarLetter = (email: string) => {
    const localPart = email?.split('@')[0] || ''
    return localPart ? localPart.charAt(0).toUpperCase() : 'A'
  }

  const getDisplayName = (email?: string) => {
    if (!email) return 'Admin User'
    const localPart = email.split('@')[0]
    return localPart.charAt(0).toUpperCase() + localPart.slice(1)
  }

  if (!mounted) return null;

  const menuItems = [
    { category: "Main", items: [
      { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
      // Placeholder
    ]},
    { category: "Management", items: [
      { id: "services", icon: <ShoppingBag size={20} />, label: "Services" },
      { id: "inquiry", icon: <MessageSquare size={20} />, label: "Inquiries" },
      { id: "gallery", icon: <ImageIcon size={20} />, label: "Gallery" },
    ]},
    { category: "System", items: [
      { id: "profile", icon: <User size={20} />, label: "Profile" },
      ...(userRole === 'ADMIN' ? [{ id: "settings", icon: <Settings size={20} />, label: "Settings" }] : []),
    ]}
  ];


  return (
    <div className="flex w-full min-h-screen bg-[#030303] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className="relative h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col z-30"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Image src="/bblogo.png" alt="logo" width={24} height={24} className="w-6 h-6" />
            </div>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
              >
                BURNBOX
              </motion.span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              {isOpen && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                  {group.category}
                </h3>
              )}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      activeSection === item.id 
                        ? "text-white" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent border-l-4 border-pink-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    {isOpen && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 ${!isOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-900/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl" />
        </div>

        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#030303]/50 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? <Menu size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-pink-500/50 transition-colors">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{getDisplayName(userMail)}</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
                    {getAvatarLetter(userMail || 'A')}
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-2 space-y-1">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <User size={16} /> Profile
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                          <Settings size={16} /> Settings
                        </button>
                        <div className="h-px bg-white/5 my-1" />
                        <button 
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {sectionMap[activeSection] || (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <p>Section under construction</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
"use client";
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  HiMenu,
  HiOutlineSearch,
  HiOutlineShoppingCart,
  HiX
} from 'react-icons/hi'
import { HiChevronDown } from 'react-icons/hi2'
import { RiMenu4Line } from "react-icons/ri";
import ToolTip from './ToolTip'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import TooltipServices from './TooltipServices';
import AboutTooltip from './AboutTooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { useHeaderContext } from '../context/HeaderContext';

// header props



const Header: React.FC = () => {

const {searchValue, setSearchValue, filteredProducts, selectProductById, setSelectedServiceFromHeader} = useHeaderContext();

const pathname = usePathname();

const handleTooltipServiceClick = (serviceName: string) => {
  const encoded = encodeURIComponent(serviceName);
  if (pathname === "/services") {
    
    setSelectedServiceFromHeader(serviceName);
  } else {
    router.push(`/services?selected=${encoded}`);
  }
};


const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchValue(value);
  setIsLoading(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 500)
};




const handleClearSearch = () => {
  setSearchValue("");
  setIsSearchActive(false);
}
const [isSearchActive, setIsSearchActive] = useState(false);
const router = useRouter()

 const handleNavClick = (sectionId: string) => {
  if(typeof window !== 'undefined' && window.location.pathname === '/') {
    const section = document.getElementById(sectionId);
    if(section) {
      section.scrollIntoView({behavior: "smooth"});
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  } else {
    // Not on home page — store target section, then go home
    sessionStorage.setItem("scrollToSection", sectionId);
    router.push("/", { scroll: false }); // no query, no hash
  }
 }; 
 const searchParams = useSearchParams();
 useEffect(() => {
  const scrollTo = searchParams?.get('scrollTo');
  if(scrollTo) {
    const section = document.getElementById(scrollTo);
    if(section) {
      section.scrollIntoView({behavior: 'smooth'});
    }
  }
 }, [searchParams])
  const [list, setList] = useState<string[]>([
    'A4 Paper',
    'about',
    'services',
    'PCV ID/Lanyard',
    'Photo canvas',
    'Wall Mural',
    'gallery',
    'burnbox',
    'home',
    'contact'
  ]);

    
  const aboutList = ['About Us', 'Mission and Vission', 'Why Choose Burnbox Printing?'];
  
  const servicesList  = [
    { id: 1, name: "Digital & Offset Printing" },
    { id: 2, name: "Forms & reciepts",},
    { id: 3, name: "Panaflex-Signage"},
    { id: 4, name: "Large format Services"},
    { id: 5, name: "Sticker & Labels"},
    { id: 6, name: "Acrylic Build-up"},
    { id: 7, name: "Standee Signage"},
    { id: 8, name: "Wall Mural"},
    { id: 9, name: "Glass Frosted Sticker"},
    { id: 10,name: "Sticker On Sintra"},
    { id: 11,name: "Graphic Design"},
    { id: 12,name: "Logo design" },
    { id: 14,name: "Flyer Design"},
    { id: 13,name: "Other services.", 
    nestedTooltip: ["Receipt types", "Forms customization", "Bulk orders", 
    ],
 },
];



  const buttons = ['wallmural', 'labelsticker', 'photocanvas', 'pvclanyard']
  const [showToolTip, setToolTip] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMobileSubmenu, setShowMobileSubmenu] = useState(false)
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [showServicesTooltip, setShowServicesTooltip] = useState(false);
  const [showAboutTooltip, setShowAboutTooltip] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const hideTooltipTimeout = useRef<NodeJS.Timeout | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  
  const filteredList = list.filter((item) => {
    return item.toLowerCase().includes(searchValue.toLowerCase())
  });
  const handleSearch = () => {
    if(filteredList.length === 1) {
      const sectionId = filteredList[0].toLowerCase().replace(/\s+/g, '-');
      const section = document.getElementById(sectionId);
      if(section) {
        section.scrollIntoView({behavior:  'smooth'})
      }
    }
  }

  useEffect(() => {
    // detect 
    const handleResize = () =>{
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])


  useEffect(() => {
    if(searchValue) {
      handleSearch();
    }
  }, [searchValue])

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth >= 768) {
        setMobileMenuOpen(false)
        setShowMobileSubmenu(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])
const handleMobileNavClick = (id: string) => {
  const section = document.getElementById(id);
  if(section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
  setMobileMenuOpen(false)
  setShowMobileSubmenu(false)
}

  const handleMouseLeaveLeaveAbout = () => {
    if(!isHoveringTooltip) {
      hideTooltipTimeout.current = setTimeout(() => {
        setShowAboutTooltip(false);
      }, 200)
    }
  }

  const handleMouseLeaveServices = () => {
    // Delay tooltip hide only if not hovering over the tooltip
    if (!isHoveringTooltip) {
      hideTooltipTimeout.current = setTimeout(() => {
        setShowServicesTooltip(false);
      }, 200);  // Adjust delay if necessary
    }
  };
  // Handle mouse enter the Tooltip component
  const handleMouseEnterTooltip = () => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);  // Cancel timeout if mouse enters tooltip
    }
    setIsHoveringTooltip(true);
    setShowServicesTooltip(true);  // Show tooltip when mouse is over it
  };


  // Handle mouse leave the Tooltip component
  const handleMouseLeaveTooltip = () => {
    setIsHoveringTooltip(false);  // Set flag to false when leaving the tooltip
    hideTooltipTimeout.current = setTimeout(() => {
      setShowServicesTooltip(false);  // Hide tooltip after delay
    }, 200);  // Adjust delay if necessary
  };

 const handleMouseEnterTooltipAbout = () => {
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);  // Cancel timeout if mouse enters tooltip
    }
    setIsHoveringTooltip(true);
    setShowAboutTooltip(true);  // Show tooltip when mouse is over it

  };

  // Handle mouse leave the Tooltip component
  const handleMouseLeaveTooltipAbout = () => {
    setIsHoveringTooltip(false);  // Set flag to false when leaving the tooltip
    hideTooltipTimeout.current = setTimeout(() => {
      setShowAboutTooltip(false);  // Hide tooltip after delay
    }, 200); 
  };

  return (
    <div className='h-20 w-full flex items-center justify-between px-5 py-3 text-white font-extralight text-lg z-100 bg-black fixed'>
      {/* Logo */}
      <a href="#home" className='h-20 py-3 px-1'>
      <Image
        height={500}
        width={500} 
        src={'/burnboxlogo.png'}
        alt='company logo'
        className='h-full object-contain object-left'
      />
      </a>
      <div className='hidden md:flex items-center   justify-end flex-1 '>
        {!isSearchActive ? (
       <>
        <a href="#home"><button
          onClick={() => handleNavClick("home")}
          type="button"
          className='px-5 h-full hover:text-pink transition ease-in duration-200'
        >Home</button>
        </a>
        <span className='relative'
          onMouseEnter={() => setShowAboutTooltip(true)}
          onMouseLeave={handleMouseLeaveLeaveAbout}
        >
        <a href="/about">
        <button
          onClick={() => handleNavClick("about")}
          type="button"
          className='px-5 h-full hover:text-pink transition ease-in duration-200'
        >
          About
        </button>
        </a>
       
        {showAboutTooltip && (
          <div ref={tooltipRef}
            onMouseEnter={handleMouseEnterTooltipAbout}
            onMouseLeave={handleMouseLeaveTooltipAbout}
          >
          <AboutTooltip aboutus={aboutList}/>
          </div>
        )}
          </span>
        <span 
        className='relative'
        onMouseEnter={() => setShowServicesTooltip(true)}
        // onMouseLeave={() => setShowServicesTooltip(false)}
        onMouseLeave={handleMouseLeaveServices}
        >
        <a href="/services"><button
          onClick={() => handleNavClick("product")}
          type="button"
          className='px-5 h-full flex gap-2 items-center hover:text-pink transition ease-in duration-200'
        >
          Services
        </button>
        </a>
        {showServicesTooltip && (
          <div
          ref={tooltipRef}
          onMouseEnter={handleMouseEnterTooltip}
          onMouseLeave={handleMouseLeaveTooltip}
          >
          <TooltipServices services={servicesList} onServiceClick={(serviceName) => handleTooltipServiceClick(serviceName)}/>
          </div>
        )}
      </span>
        
         <a href="/contact">
        <button
          onClick={() => handleNavClick("contact")}
          type="button"
          className='px-5 h-full hover:text-pink transition ease-in duration-200'
        >
          Contact
        </button>
        </a>
        {/* search */}
        <button
          type="button"
          onClick={() => setIsSearchActive(true)}
        ><HiOutlineSearch />
        </button>
      {/* cart */}
          </>
        ): (

          // search bar lines
          <div
                className={`
                  ${isSearchActive
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none absolute"}
                  transition-all duration-300 relative
                `}
              >
                {/* Search Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    className="bg-transparent border border-pink-300 text-white px-4 py-2 rounded-md focus:outline-none transition-all duration-300 w-64 placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    className="text-2xl p-2 mr-3"
                    onClick={() => {
                      setIsSearchActive(false);
                      setSearchValue("");
                    }}
                  >
                    <HiX className="text-pink-500" />
                  </button>
                </div>

                {/* Conditional Content */}
                <AnimatePresence>
            {searchValue.trim() === "" ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute mt-3 w-[260px] bg-zinc-900 text-gray-300 rounded-xl shadow-lg border border-gray-700 p-4 flex flex-col items-center gap-3 z-50"
              >
                <Image
                  src="/bblogo.png"
                  alt="Burnbox Logo"
                  width={50}
                  height={40}
                  className="object-contain"
                />
                <div className="text-center text-sm">
                  <p className="text-white font-semibold">Looking for something?</p>
                  <p className="text-xs text-gray-400">
                    Search Burnbox Printing for posts, photos, and other visible activity.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-3 w-[265px] bg-zinc-900 border border-gray-700 rounded-xl shadow-lg p-2 z-50 max-h-[320px] overflow-y-auto"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        selectProductById(product.id); // <- ito yung mag-oopen ng modal sa ServicesProduct
                        setSearchValue("");
                        setIsSearchActive(false);
                      }}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 transition"
                    >
                      
                      <div className="w-14 h-14 relative flex-shrink-0 rounded overflow-hidden bg-zinc-800">
                        <Image
                          src={product.image[0]}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{product.name}</p>
                        <p className="text-xs text-pink-400">₱ {product.price}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-3">No products found.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
              </div>
            )
          }
   {/* end of searchbar */}

      </div>
          {/* right side */}
        <div className='hidden md:flex ml-4'>
           <button className='text-2xl p-3 rounded-full bg-pink hover:scale-110 ease-in-out duration-200'>
            <HiOutlineShoppingCart />
          </button>
        </div>
      <div className='md:hidden flex items-center'>
        <button
          className='text-3xl text-white'
          onClick={() => {
            setMobileMenuOpen(!isMobileMenuOpen)
            setShowMobileSubmenu(false) // reset submenu when toggling menu
          }}
        >
          {isMobileMenuOpen ? <RiMenu4Line  className='text-pink-500'/>: <HiMenu />}
        </button>
      </div>
      {isMobileMenuOpen && (
  <div
    className={`absolute top-full left-0 w-full bg-black text-white px-7 space-y-4 transition-[max-height,opacity,transform] duration-300 ease-in-out max-h-screen opacity-100`}
  >
 {['Home', 'About', 'Services', 'Contact'].map((item, index) => {
  const isAbout = item === 'About';
  const isServices = item === 'Services';
  const isHome = item === 'Home';
  const isContact  = item === 'Contact'
  return (
    <div
      key={item}
      className="w-full animate-fadeInUp"
      style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
    >
      {/* Top-level Menu Item */}
      <div className="flex items-center gap-2">
        <button  
        onClick={() => {
          if (isAbout) {
            if (isMobile) {
              router.push('/about');
              setMobileMenuOpen(false);
            } else {
              setShowAboutTooltip(prev => !prev);
              setShowServicesTooltip(false);
            }
          } else if (isServices) {
            if (isMobile) {
              router.push('/services');
              setMobileMenuOpen(false);
            } else {
              setShowServicesTooltip(prev => !prev);
              setShowAboutTooltip(false);
            }
          } else if(isHome) {
            router.push('/#home')
            setMobileMenuOpen(false)
          } else if (isContact) {
            router.push('/contact#contact')
            setMobileMenuOpen(false)
          } 
        }}
          className="flex items-center gap-2 text-left hover:text-pink transition"
        >
         {item}
        </button>
         {(isAbout || isServices) && (
        <button
          onClick={() => {
            if (isAbout) {
              setShowAboutTooltip(prev => !prev);
              setShowServicesTooltip(false);
            } else if (isServices) {
              setShowServicesTooltip(prev => !prev);
              setShowAboutTooltip(false);
            }
          }}
          onMouseEnter={() => {
            if (isAbout) setShowAboutTooltip(true);
            if (isServices) setShowServicesTooltip(true);
          }}
        
          className="flex items-center"
        >
          <HiChevronDown
            className={`text-pink-500 transition-transform duration-300 
              ${((isAbout && showAboutTooltip) || (isServices && showServicesTooltip)) ? 'rotate-180' : ''}`}
            size={18}
          />
        </button>
          )}
      </div>
      {/* Submenu */}   
      <AnimatePresence>
      {isAbout && showAboutTooltip && (
        <motion.div
          key="tooltip-overlay"
          initial={{ opacity: 0, scale: 1,y: 10}}
          animate={{opacity: 1, scale: 1, y : 0}}
          exit={{opacity: 0, scale: 0.8, transition: { duration: 0.2 }}}
          transition={{duration: 0.2, ease: 'easeInOut'}}
          onMouseEnter={() => {
            if(hideTimeout.current) clearTimeout(hideTimeout.current);
          }}
          onMouseLeave={() => {
            hideTimeout.current = setTimeout(() => {
              setShowAboutTooltip(false);
            }, 200)
          }}
        >
        <div className="ml-4 mt-2 space-y-2 bg-zinc-900 rounded p-6 w-[280px]">
        {aboutList.map((label, idx) => {
          const handleAboutNavigation = (label: string) => {
            const routeMap: Record<string, string> = {
              "About Us": "/about#about-us",
              "Mission and Vission": "/about#mission-and-vision",
              "Why Choose Burnbox Printing?": "#why-choose-burnbox",
            };
            const target = routeMap[label];
            if (!target) return;

            if (label === "Why Choose Burnbox Printing?") {
              if (pathname === "/") {
                const section = document.querySelector(target);
                section?.scrollIntoView({ behavior: "smooth" });
              } else {
                router.push("/#why-choose-burnbox");
              }
            } else {
              router.push(target);
            }
            setMobileMenuOpen(false);
            setShowAboutTooltip(false);
          };
          return (
            <button
              key={idx}
              className="block text-sm text-left hover:text-pink transition"
              onClick={() => handleAboutNavigation(label)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </motion.div>
      )}
      </AnimatePresence>
      <AnimatePresence>
      {isServices && showServicesTooltip && (
        <motion.div
          key="tooltip-overlay"
          initial={{ opacity: 0, scale: 1,y: 10}}
          animate={{opacity: 1, scale: 1, y : 0}}
          exit={{opacity: 0, scale: 0.8, transition: { duration: 0.2 }}}
          transition={{duration: 0.2, ease: 'easeInOut'}}
          onMouseEnter={() => {
            if(hideTimeout.current) clearTimeout(hideTimeout.current);
          }}
          onMouseLeave={() => {
            hideTimeout.current = setTimeout(() => {
              setShowServicesTooltip(false);
            }, 200)
          }}
        >
        <div className="ml-4 mt-2 space-y-2 bg-zinc-900 rounded p-6 w-[280px]">
          {servicesList.map((service, idx) => (
            <button
              key={idx}
              className="block text-sm text-left hover:text-pink transition"
              onClick={() => {
                const id = service.name.toLowerCase().replace(/\s+/g, '-');
                const section = document.getElementById(id);
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
                setShowServicesTooltip(false);
              }}
            >
              {service.name}
            </button>
          ))}
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
})}
    <div className='block w-full text-left animate-fadeInUp' style={{ animationDelay: '0.4s' }}>
       

      {showMobileSubmenu && (
        <div className='ml-4 mt-3 space-y-2 '>
          {buttons.map((item, index) => (
            <button
              key={index}
              className='block w-full text-left text-sm hover:text-pink animate-fadeInUp'
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              onClick={() => {
                const id = item.toLowerCase().replace(/\s+/g, '-');
                const section = document.getElementById(id)
                if(section) {
                  section.scrollIntoView({behavior: 'smooth'});
                }
                setMobileMenuOpen(false);
                setShowMobileSubmenu(false);
              }}
            >
              {item}
            </button>
            
          ))}
        </div>
      )}
    </div>
    
   <div
  className='relative flex items-center gap-4 mt-6 py-4 animate-fadeInUp transition-all duration-300 overflow-visible z-[9999]'
  style={{ animationDelay: '0.7s'}}
>
  {/* Cart Icon */}
  <div className='p-2 rounded-full bg-pink hover:scale-110 transition'>
    <HiOutlineShoppingCart className='text-xl' />
  </div>
  {/* Search Input Field */}
  {isMobileSearchActive && (
    <input
      type='text'
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    
      placeholder='Search...'
      className='min-w-[120px] max-w-[200px] bg-transparent border border-pink-300 text-white px-4 py-2 rounded-md focus:outline-none placeholder:text-gray-400 transition-all duration-300'
    />
  )}

 <button
    onClick={() => {
      setIsMobileSearchActive(prev => !prev);
      setSearchValue('');
    }}
    className='relative w-8 h-8 transition-all duration-500 ease-in-out transform hover:rotate-90'
  >
    
    {/* Search Icon */}
    <HiOutlineSearch
      className={`
        absolute top-0 left-0 w-8 h-8 text-white transition-all duration-300 ease-in-out 
        ${isMobileSearchActive ? 'opacity-0 scale-0 rotate-45' : 'opacity-100 scale-100 rotate-0'}
      `}
    />
    {/* X Icon */}
    <HiX
      className={`
        absolute top-0 left-0 w-8 h-8 text-pink-500 transition-all duration-300 ease-in-out 
        ${isMobileSearchActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-45'}
      `}
    />

  </button>
     {isMobileSearchActive && (
  <div className="absolute bottom-[-150px] left-12 w-52 bg-zinc-900/95 text-gray-300 rounded-xl shadow-lg border border-gray-700 p-4 flex flex-col items-center gap-3 z-[10000] backdrop-blur-md transition-all duration-300">
    {searchValue.trim() === '' ? (
      <>
        <img
          src="/bblogo.png"
          alt="Burnbox Logo"
          className="h-12 object-contain animate-fadeIn"
        />
        <div className="text-center text-sm animate-fadeIn">
          <p className="text-white font-semibold">Looking for something?</p>
          <p className="text-xs text-gray-400">
            Search Burnbox Printing for posts, photos, and other visible activity.
          </p>
        </div>
      </>
    ) : (
      <>
        {searchValue.length < 2 ? (
          <div className="flex flex-col items-center justify-center w-full py-4">
            <div className="w-17 h-17 border-2 border-pink-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-gray-400">Searching...</p>
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col gap-2">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Contact', id: 'contact' },
              ]
                .filter((item) =>
                  item.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const section = document.getElementById(item.id);
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = `/${item.id.toLowerCase()}`;
                      }
                      setIsMobileSearchActive(false);
                    }}
                    className="w-full sm:w-full px-3 py-13 rounded-md  hover:text-white transition-all duration-200 text-sm"
                  >
                    {item.name}
                  </button>
                ))}
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Contact', id: 'contact' },
              ].filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              ).length === 0 && (
                <p className="text-center py-13 text-xs text-gray-400 ">
                  No results found.
                </p>
              )}
            </div>
          </>
        )}
      </>
    )}
  </div>
)}

</div>
  </div>
)}
    </div>
  )
}


export default Header
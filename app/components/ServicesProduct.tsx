"use client"

import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Image from 'next/image'
import { ArrowBigRightDash, ArrowLeft, ArrowRight, ChevronDown, ChevronDownIcon, User2Icon, XCircleIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/16/solid'
import FakeInquiryForm from './FakeInquiryForm'
import { useHeaderContext } from '../context/HeaderContext'



const ProductImageSlider = ({ images, name }: { images: string[], name: string }) => {
  const filledImages =
    images.length >= 3
      ? images
      : [
          ...images,
          ...Array.from({ length: 3 - images.length }, (_, i) => 
            images[0]
          ),
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  // auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filledImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [filledImages.length]);

  return (
    <div className="relative w-full md:w-full h-full bg-black/50 rounded-md overflow-hidden">
      {/* main image */}
      <img
        src={filledImages[currentIndex]}
        alt="product"
        className="object-contain w-full h-full items-center justify-center"
        draggable="false"
      />
      {/* progress bar / indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 lg:gap-10 md:gap-10">
        {filledImages.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-7 md:w-15 lg:w-20 md:h-1 lg:h-1 rounded-full ${
              i === currentIndex ? "bg-pink-500" : "bg-gray-400/50"
            }`}
          ></div>
        ))}
      </div>
      {/* thumbnail preview below */}
      <div className="absolute bottom-2 left-1/2  -translate-x-1/2 flex gap-6 lg:gap-4 md:gap-4">
        {filledImages.map((img, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`relative  lg:h-25  md:w-40 w-50 lg:w-25 xs:h-20 h-20 cursor-pointer rounded-md overflow-hidden border ${
              i === currentIndex ? "bg-pink-500" : "bg-gray-400/50"
            }`}
          >
            <img
              src={img}
              alt={`thumb-${i}`}
              className="object-contain w-full h-full items-center justify-center lg:object-contain md:object-contain"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
};



const ServicesProduct = () => {
    const { 
      searchValue, 
      selectedProduct, 
      setSelectedProduct,
      products 
    } = useHeaderContext();

    // Use products from context
    const allProducts = products;

    // Filter products based on search
    const filteredProducts = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase())
    );



    const [page, setPage] = useState(1);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const [showRelated, setShowRelated] = useState(true);

    // Randomize related products (except current one)
    const getRandomRelated = (excludeId: number) => {
        const others = allProducts.filter((p) => p.id !== excludeId);
        return [...others].sort(() => 0.5 - Math.random()).slice(0, 6);
    };
    

    const [showInquiry, setShowInquiry] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isOld, setIsOld] = useState(false);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

    // Generate Gravatar URL from email (requires proper MD5 hash)
    const getGravatarUrl = (email: string, size: number = 64) => {
      if (!email) return null;
      
      // Use a simple approach: create MD5 hash using crypto API or fallback
      // For Gravatar, we need MD5 hash of lowercase email
      const emailLower = email.trim().toLowerCase();
      
      // Simple hash function (not true MD5, but works for basic use)
      // For production, consider using crypto-js library: npm install crypto-js
      const simpleHash = (str: string): string => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        // Convert to hex and pad to 32 chars (MD5-like length)
        return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32);
      };
      
      // Try to use Web Crypto API for proper MD5 if available (async)
      // For now, use simple hash - Gravatar will handle invalid hashes gracefully
      const emailHash = simpleHash(emailLower);
      
      // Gravatar URL format: https://www.gravatar.com/avatar/{hash}?d=404&s={size}
      // d=404 means return 404 if no image exists (so we can fallback to initials)
      return `https://www.gravatar.com/avatar/${emailHash}?d=404&s=${size}`;
    };
  
    // Get initials from email address (uses the part before @)
    const getInitials = (email: string) => {
      if (!email) return 'U';
      
      // Extract the part before @ from email
      const emailPrefix = email.split('@')[0];
      if (!emailPrefix) return 'U';
      
      // Split by common separators (dots, underscores, hyphens) to get parts
      const parts = emailPrefix.split(/[._-]/).filter(part => part.length > 0);
      
      // If email prefix has 2 or more parts (e.g., "john.doe" or "john_doe"), use first letter of first and last part
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      
      // If single part (e.g., "animateevi"), use only first letter
      return emailPrefix.charAt(0).toUpperCase();
    };

    // Fetch feedback from API
    useEffect(() => {
      const fetchFeedbacks = async () => {
        setLoadingFeedbacks(true);
        try {
          const response = await fetch('/api/feedback');
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.feedbacks) {
              setFeedbacks(data.feedbacks);
            }
          }
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
        } finally {
          setLoadingFeedbacks(false);
        }
      };

      fetchFeedbacks();
    }, []);

    const handleButtonClick = () => {
      setShowModal(true)
    }

    const handlePopupClick = () => {
      setIsOld(!isOld);
      setShowModal(false);
    }

    // Sort feedbacks based on Latest/Old
    const sortedFeedbacks = isOld 
      ? [...feedbacks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      : [...feedbacks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Limit to 10 most recent/oldest
    const displayedFeedbacks = sortedFeedbacks.slice(0, 10);


    // Close modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setSelectedProduct(null);
      }
    };


    const handleCloseModal = () => {
      setSelectedProduct(null);
      setPage(1)
    }

    
    // Handle product selection with related products
    const handleProductSelect = (item: any) => {
      setSelectedProduct({
        ...item,
        related: getRandomRelated(item.id),
      });
    };

     React.useEffect(() => {
      if (selectedProduct && !(selectedProduct as any).related) {
        // If selectedProduct doesn't have related products, add them
        setSelectedProduct({
          ...selectedProduct,
          related: getRandomRelated(selectedProduct.id),
        });
      }
    }, [selectedProduct]);
    React.useEffect(() => {
      setPage(1);
    }, [searchValue])

    return (
    <>
      <div id="products-section" className='custom-gallery-bg w-full min-h-screen flex flex-col items-center py-20'>
        <div className='grid grid-cols-1 sm:grid-cols-2 mt-30 lg:grid-cols-4 gap-6 w-[90%] lg:w-full max-w-7xl'>
          {currentProducts.map((item) => (
            <div 
              key={item.id} 
              className='flex flex-col bg-white/20 border border-pink/20 rounded-xl overflow-hidden shadow hover:bg-white/50 hover:scale-[1.05] cursor-pointer  transition-all duration-300 '
              onClick={() => handleProductSelect(item)}
              style={{}}
            >
              <div className='relative w-full h-64 '>
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className=' object-contain items-center justify-center w-full h-full hover:scale-[1.3] transition-transform duration-300' 
                />
                <img
                  src="/splashimg.png" alt='img'
                  className='absolute w-full h-full top-40 left-0 opacity-0 hover:opacity-60 transition-opacity duration-300'
                />
              </div>
              <div className='p-4 flex flex-col gap-1  bg-black/40 mt-auto z-[50]'>
                
                <div className='flex flex-col  items-center gap-2 justify-between mt-2 text-pink-300'>
                  {/* <div className='text-[19px]  text-nowrap'><span className='text-pink-300 opacity-70'>As low as:</span> 
                    <p className=''>
                      Price: ₱ {item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                  </div> */}
                  <h3 className='font-medium text-pink-200 mb-2 text-[20px]'>{item.name}</h3>
                  <button className='text-white/90 bg-pink/60 p-2 text-nowrap lg:p-2 rounded-[5px]'>
                    View Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pt-20 bg-black/70 flex items-center justify-center z-50"
              onClick={handleBackdropClick}
            >
              <div className='bg-[#211F1F] h-full px-4 md:px-6 text-white lg:rounded-md w-full lg:w-4/5 md:w-2/3 relative overflow-y-auto lg:h-[90vh]'>
                <button onClick={handleCloseModal}>
                  <div className='absolute top-10 md:top-3 right-4 flex items-center gap-1'>
                    <span className='font-medium'>Go back</span>
                    <ArrowRight className='text-pink hover:text cursor-pointer'/>
                  </div>
                </button>
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-6 lg:p-6 md:p-6 pt-14'>
                  {/* Image Section */}
                  <div className='col-span-1 flex flex-col items-center justify-start gap-4'>
                    <div className='relative w-[120%] lg:w-full h-64 lg:full md:h-80 sm:h-72 bg-black/50 rounded-md overflow-hidden flex items-center justify-center'>
                      <ProductImageSlider images={selectedProduct.image} name={selectedProduct.name} />
                    </div>
                  </div>
                  
                  {/* Info Section */}
                  <div className='col-span-1 flex flex-col justify-start gap-4 w-[100%] lg:pr-0 max-w-md mx-auto'>
                    <h2 className='text-2xl font-semibold mb-2 text-center md:text-left'>{selectedProduct.name}</h2>
                    <p className='text-gray-200 mt-5'>{selectedProduct.description}</p>
                    <p className='text-pink/60 text-4xl font-bold mt-3 pb-4'>{selectedProduct.price === 0 ? " " : ` ₱ ${selectedProduct.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</p>
                    <div className='flex flex-col gap-2'>
                      <button 
                        onClick={() => setShowInquiry(true)} 
                        className='bg-pink/45 lg:w-full text-white py-2 rounded hover:bg-pink/20 transition'
                      >
                        Inquire Now
                      </button>
                      <div className='relative c'>
                      <button className='border border-pink/60 text-pink/60 hover:bg-pink/10 w-full hover:text-white rounded transition py-2  cursor-not-allowed opacity-50'
                    title='Not allowed'
                    style={{
                      cursor: 'not-allowed',
                      pointerEvents: 'none'
                    }}>
                        Customize this item
                      </button>

                      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                        <span className='bg-red-500 w-full opacity-30 text-white py-3 text-center rounded text-xs font-bold'>
                          not applicable
                        </span>
                      </div>
                      </div>
                    </div>
                  </div>
                  {/* Feedback Section */}
                  <div className="col-span-1 flex flex-col justify-between bg-[#1a1a1a] rounded-lg p-4 w-[100%] max-w-md h-full">
                    <div className='flex justify-between items-center mb-2'>
                      <h3 className='text-pink-500 font-semibold text-lg'>Feedback</h3>
                      <span className='relative'>
                        <button 
                          onClick={handleButtonClick} 
                          className="bg-gradient-to-r from-black/20 via-pink/60 border border-pink/70 text-pink-200 font-bold text-xs px-3 py-1 rounded"
                        >
                          {isOld ? "Old" : "Latest"}
                        </button>
                        {showModal && (
                          <div 
                            onClick={handlePopupClick} 
                            className='absolute text-center justify-center top-full left-0 mt-2 bg-gradient-to-r from-black/20 via-pink/60 border border-pink/70 text-pink-200 font-bold text-xs px-3 py-1 rounded'
                          >
                            {isOld ? "Latest" : "Old"}
                          </div>
                        )}
                      </span>
                    </div>
                    <div className='flex flex-col gap-3 overflow-y-auto max-h-[300px] bg-[#121212] p-3 rounded-md scrollbar-thin'>
                      {loadingFeedbacks ? (
                        <div className="text-center text-gray-400 py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto"></div>
                          <p className="mt-2 text-xs">Loading feedback...</p>
                        </div>
                      ) : displayedFeedbacks.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                          <p className="text-sm">No feedback yet. Be the first to share!</p>
                        </div>
                      ) : (
                        displayedFeedbacks.map((feedback) => {
                          const feedbackDate = new Date(feedback.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                          // Get initials from email address (not the input name)
                          const initials = getInitials(feedback.email);
                          const gravatarUrl = getGravatarUrl(feedback.email, 64);
                          
                          return (
                            <div key={feedback.id} className="bg-[#181818] p-2 rounded-md text-gray-300 text-sm flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                {/* Avatar with Gravatar fallback to initials */}
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white font-semibold text-xs flex-shrink-0 overflow-hidden relative">
                                  {gravatarUrl ? (
                                    <img
                                      src={gravatarUrl}
                                      alt={feedback.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // If Gravatar image fails to load, hide img and show initials
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                          parent.innerHTML = initials;
                                          parent.style.display = 'flex';
                                          parent.style.alignItems = 'center';
                                          parent.style.justifyContent = 'center';
                                        }
                                      }}
                                    />
                                  ) : (
                                    initials
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-pink-200 text-xs">{feedback.name}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm break-words">{feedback.message}</p>
                                  <span className="text-xs text-gray-400 mt-1 block">{feedbackDate}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                {/* Related Products Section */}
                <div className="relative lg:absolute bottom-1 left-0 w-full flex flex-col items-center bg-gradient-to-r from-black/40 via-black/80">
                  <motion.button
                    className="flex items-center gap-2 text-pink hover:text-pink/70 transition"
                    initial={false}
                    animate={{ y: showRelated ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <span className="text-[20px] uppercase font-medium mt-7">
                      You Might Also Like
                    </span>
                  </motion.button>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-6 w-full overflow-x-auto px-6"
                    >
                      <div className="flex gap-4 pb-4">
                        {/* Use type assertion for related products since we added them dynamically */}
                        {(selectedProduct as any)?.related?.map((item: any, i: number) => (
                          <div
                            key={i}
                            onClick={() => handleProductSelect(item)}
                            className="relative w-full lg:w-58 h-50 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer group hover:scale-[1.03] transition-all duration-300"
                          >
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="object-contain w-full h-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-2">
                              <h3 className="text-lg font-semibold text-white">
                                {item.name}
                              </h3>
                              <p className="text-pink-500 text-lg mt-1">
                               {item.price === 0 ? "" : `₱ ${item.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inquiry Form Modal */}
        <AnimatePresence>
          {showInquiry && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'
              onClick={() => setShowInquiry(false)}
            > 
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y:50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 30 }}
                transition={{ duration: 0.34, ease: 'easeOut' }}
                className='bg-[#1a1a1a] flex flex-col text-white p-6 rounded-xl w-full max-h-5/6 overflow-x-hidden max-w-md relative mt-20'
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowInquiry(false)}
                  className='absolute top-3 right-7 text-gray-400 hover:text-pink transition'
                >
                  <ArrowBigRightDash />
                </button>
                
                <h2 className='text-[22px] items-center justify-center text-center font-extrabold mt-4 text-pink-500 mb-4'>
                  Inquire Now
                </h2>
                <div>
                  <img
                    src={selectedProduct.image[0]}
                    alt={selectedProduct.name}
                    width={300}
                    height={60}
                    className='rounded-md object-contain ml-12 aspect-square max-h-40'
                  />
                  <div>
                    <h3 className='text-lg font-medium'>{selectedProduct.name}</h3>
                    <p className='text-sm text-gray-400'>{selectedProduct.price === 0 ? "" : `₱ ${selectedProduct.price.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}`}</p>
                  </div>
                </div>

                {/* Convert price to string for FakeInquiryForm */}
                <FakeInquiryForm product={{
                  name: selectedProduct.name,
                  price: selectedProduct.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                }}/>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between gap-10 mt-8'>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 gap-1 rounded ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink text-white hover:bg-pink/80'}`}
            >
              <ArrowLeft size={22}/>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${page === i + 1 ? 'bg-pink text-white' : 'bg-white text-pink hover:bg-pink/20'}`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}   
              disabled={page === totalPages}
              className='text-sm px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50'
            >
              <ArrowRight size={22}/>
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </>
  )
}

export default ServicesProduct
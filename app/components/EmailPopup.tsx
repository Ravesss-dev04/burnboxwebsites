import React, { useState, useRef } from 'react'
import { RiMailSendLine } from 'react-icons/ri'
import Image from 'next/image'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { AnimatePresence, motion } from 'framer-motion'
import { EmailPopupProps } from '@/types'
import { FaFacebook } from "react-icons/fa";
import { FaViber } from "react-icons/fa";

const EmailPopup = ({ setShowEmailPopup }: EmailPopupProps) => {
  const [formData, setFormData] = useState({
    email: '',
    message: 'Write us a message...'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Honeypot field reference
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if this field is filled, it's likely a bot
    if (honeypotRef.current && honeypotRef.current.value !== '') {
      console.log('Bot detected - honeypot triggered');
      // Silently succeed to avoid giving feedback to bots
      setIsSent(true);
      setTimeout(() => {
        setFormData({ email: '', message: 'Write us a message...' });
        setShowEmailPopup(false);
        setIsSent(false);
      }, 2000);
      return;
    }

    // Basic client-side validation
    if (!formData.email || !formData.message || formData.message === 'Write us a message...') {
      alert('Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          timestamp: Date.now(), // For rate limiting on server
          source: 'website-contact-form' // Identify the source
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Show sent animation
        setIsSent(true);
        
        // Close popup after 2 seconds
        setTimeout(() => {
          setFormData({ email: '', message: 'Write us a message...' });
          setShowEmailPopup(false);
          setIsSent(false);
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value === 'Write us a message...') {
      setFormData({
        ...formData,
        message: ''
      });
    }
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '') {
      setFormData({
        ...formData,
        message: 'Write us a message...'
      });
    }
  };

  return (
    <motion.div 
      initial={{ x: 399 }}
      animate={{ x: 0 }}
      exit={{ x: 399 }}
      transition={{
        duration: 1,
        ease: 'easeInOut'
      }}
      className='fixed top-1/2 right-5 z-[70] flex flex-col gap-3 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[420px] max-w-[90vw]'
    >
      <div className='h-min w-full bg-[#201E1E] shadow-md rounded-lg p-3'>
        <span className='flex gap-2 items-center mb-5'>
          <Image
            height={500}
            width={500}
            alt='gmail icon'
            src={'/gmail.png'}
            className='h-5 w-5 object-center object-contain'
          />
          <h2 className='text-white font-semibold'>Reach us out via gmail.</h2>
          <button 
            type="button" 
            className='ml-auto text-2xl rounded-full bg-black/20 p-1 hover:bg-black/50 focus:bg-black/75 focus:text-white ease-in-out duration-200'
            onClick={() => setShowEmailPopup(false)}
          >
            <HiOutlineArrowSmallRight className='text-white' />
          </button>
        </span>
        <form className='w-full flex flex-col gap-2 items-end' onSubmit={handleSubmit}>
          {/* Honeypot Field - Hidden from real users */}
          <input
            type="text"
            name="website"
            ref={honeypotRef}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          
          <input 
            type="email" 
            name="email" 
            placeholder='Input your email address'
            className='p-3 outline-none text-white/80 bg-black/5 focus:bg-pink/10 placeholder-zinc-400 rounded-md w-full'
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <textarea 
            name="message"
            className='resize-none text-white/40 h-32 p-3 bg-black/5 rounded-md w-full' 
            value={formData.message}
            onChange={handleChange}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            required
            minLength={5}
          />
          <div className="flex items-center gap-2 w-full justify-end">
            <button 
              type="submit" 
              disabled={isLoading || isSent}
              className={`flex items-center justify-center px-3 py-2 rounded-md bg-[#FA7EA0] hover:bg-pink/65 focus:bg-pink focus:text-white ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSent ? 'w-12' : 'w-20'
              }`}
            >
              {isSent ? (
                <Image
                  src="/EmailSent.gif"
                  alt="Sent"
                  width={24}
                  height={24}
                  className="h-10 w-10"
                />
              ) : (
                <div className="flex items-center gap-2 ">
                  <RiMailSendLine /> 
                  <span>{isLoading ? 'Sending...' : 'Send'}</span>
                </div>
              )}
            </button>        
          </div>
        </form>
      </div>
      <div className='h-min w-full text-white/70 flex gap-3 rounded-lg shadow-md bg-[#201E1E] white py-3 px-5 items-center '>
        other ways to contact us
        <a
          href="https://facebook.com/burnboxprinting"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md hover:scale-110 ease-in-out duration-200 text-3xl ml-auto"
          aria-label="Facebook"
        >
          <FaFacebook className='text-blue-500'/>
        </a>
        <a
          href="https://www.instagram.com/burnboxprinting/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md hover:scale-110 ease-in-out duration-200 text-3xl"
          aria-label="Instagram"
        >
          <Image
            height={500}
            width={500}
            alt='instagram image'
            src='/instagram.png'
            className='h-7 w-7 object-contain'
          />
        </a>
        <a
          href="viber://chat?number=YOUR_PHONE_NUMBER"
          className="p-1 flex h-min items-center rounded-md bg-purple-600 hover:scale-110 ease-in-out duration-200 text-2xl"
          aria-label="Viber"
        >
          <FaViber className='text-white'/>
        </a>
      </div>
    </motion.div>
  )
}

export default EmailPopup
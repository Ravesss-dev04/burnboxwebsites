import React from 'react'
import { RiMailSendLine } from 'react-icons/ri'
import Image from 'next/image'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { AnimatePresence, motion } from 'framer-motion'
import { EmailPopupProps } from '@/types'
import { FaFacebook } from "react-icons/fa";
import { FaViber } from "react-icons/fa";
const EmailPopup = ({ setShowEmailPopup }: EmailPopupProps) => {
  return (
    
    <motion.div 
            initial={{ x: 399 }}
            animate={{ x: 0 }}
            exit={{ x: 399 }}
            transition={{
                duration: 1,
                ease: 'easeInOut'
            }}
            className='fixed top-1/2 right-5 z-70 flex flex-col gap-3 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[420px] max-w-[90vw]'
        >
            <div className='h-min w-full bg-white shadow-md rounded-lg p-3'>
                <span className='flex gap-2 items-center mb-5'>
                    <Image
                        height={500}
                        width={500}
                        alt='gmail icon'
                        src={'/gmail.png'}
                        className='h-5 w-5 object-center object-contain'
                    />
                    <h2>Reach us out via gmail.</h2>
                    <button 
                        type="button" 
                        className='ml-auto text-2xl rounded-full bg-black/20 p-1 hover:bg-black/50 focus:bg-black/75 focus:text-white ease-in-out duration-200'
                        onClick={() => setShowEmailPopup(false)}
                    >
                        <HiOutlineArrowSmallRight />
                    </button>
                </span>
                <form className='w-full flex flex-col gap-2 items-end'>
                    <input 
                        type="email" 
                        placeholder='Input your email  address'
                        className='p-3 outline-none  bg-black/5 focus:bg-black/10 placeholder-zinc-400 rounded-md w-full'
                    />
                    <textarea className='resize-none text-black h-32 p-3 bg-black/5 rounded-md w-full' defaultValue={'Write us a message...'}></textarea>
                    <div className="flex items-center gap-2 w-full justify-end">
                        <button 
                            type="button" 
                            className='flex gap-2 items-center px-3 py-2 rounded-md bg-pink/30 w-min hover:bg-pink/65 focus:bg-pink focus:text-white ease-in-out duration-200'
                            onClick={() => setShowEmailPopup(false)}
                        >
                                <RiMailSendLine /> 
                                Send
                        </button>        
                    </div>
                </form>
            </div>
            <div className='h-min w-full text-black flex gap-3 rounded-lg shadow-md bg-white py-3 px-5 items-center'>
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
                    href=""
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



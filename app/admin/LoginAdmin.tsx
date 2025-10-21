"use client"

import Image from 'next/image'

import React, { useState } from 'react'
import AdminDashboard from './AdminDashboard'



const LoginAdmin = () => {

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@example.com' && password === 'admin123') {
      setIsLoggedIn(true)
    } else {
      alert('Invalid credentials')
    }
  }

  

  if (isLoggedIn) {
    return <AdminDashboard/> 
  }
  return (
    <div className='flex min-h-screen items-center justify-center '>
        <div className='flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-[60%] '>
            <div className='w-full md:w-1/2 px-15 relative bg-[#D9D9D9]'>
            {/* logo     */}
            <div className='absolute top-5 left-6'>
                <Image
                    src="/bblogo.png"
                    alt='logo'
                    width={35}
                    height={35}
                    className='mr-2'
                />
            </div>
            {/* title */}
            <div className='flex flex-col justify-center items-center h-[80vh] px-10 py-12'>
            <h2 className='text-[25px] font-semibold text-center mb-8'>Login an Account</h2>
            {/* form */}
            <form className='space-y-4' onSubmit={handleLogin}>
                <input type="email" 
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                />
                <input 
                type="text" 
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                />
                <button type='submit' className='bg-[#F43C6D] w-full text-white font-medium py-2 rounded-md hover:bg-pink-600 transition'>
                    Login
                </button>
            </form>
                <div className='bg-gray-400 w-full border border-gray-400 opacity-50 mt-10'></div>
            {/* extra links */}
            <div className='mt-5 w-full text-[15px] font-medium text-gray-700'>
                <a href="#">forgot Password?</a>
                <p className='mt-2'>
                    Don't have an Account Yet?
                    <a href="#" className='text-blue font-bold'>Sign Up</a>
                </p>
            </div>
        </div>
    </div>
        {/* image section */}
        <div className='hidden md:flex w-full md:w-1/2 bg-black text-white relative items-center justify-center'>
            <div className='absolute inset-0  opacity-100'>
                <Image
                    src="/bbimage2.png"
                    alt='bbimage'
                    fill
                    className='object-cover'
                />
            </div>
            <div className='relative  w-full h-full flex flex-col justify-start pt-8 px-8 items-center'>
                <h1 className='text-2xl font-light mb-4'>Welcome Admin Login Here!</h1>
                
            <Image
                src="/bbimage.png"
                alt='logo'
                width={400}
                height={400}
                className='object-contain mt-auto text0-right'
                priority
            />
            
            </div>
        </div>
    </div>
</div>
  )
}

export default LoginAdmin

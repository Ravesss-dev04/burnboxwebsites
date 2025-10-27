"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

const LoginAdmin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(true) // true for login, false for register
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('') // Add this missing state
  const router = useRouter()

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setIsLoggedIn(true)
      setUserEmail(userData.email)
    }
  }, [])

  // Handle both login and registration
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // For demo purposes - hardcoded admin login
    if (isLoginMode && email === 'admin@example.com' && password === 'admin123') {
      const userData = { email: 'admin@example.com' }
      localStorage.setItem('adminUser', JSON.stringify(userData))
      setIsLoggedIn(true)
      setUserEmail('admin@example.com') // Set the user email
      setIsLoading(false)
      return
    }

    try {
      const endpoint = isLoginMode ? 'https://bburnboxsites.vercel.app/login' : 'https://bburnboxsites.vercel.app/register'
      
      // For registration, validate passwords match
      if (!isLoginMode && password !== confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (isLoginMode) {
          // Login successful - save user data
          const userData = { email: email }
          localStorage.setItem('adminUser', JSON.stringify(userData))
          setIsLoggedIn(true)
          setUserEmail(email) // Set the user email
          router.refresh()
        } else {
          // Registration successful - switch to login mode
          alert('Account created successfully! Please login.')
          setIsLoginMode(true)
          setPassword('')
          setConfirmPassword('')
        }
      } else {
        setError(data.error || `${isLoginMode ? 'Login' : 'Registration'} failed`)
      }
    } catch (error) {
      setError(`An error occurred during ${isLoginMode ? 'login' : 'registration'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address first')
      return
    }

    try {
      const response = await fetch('https://bburnboxsites.vercel.app/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert('Error sending reset email')
    }
  }

  // Add this missing function
  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
    setUserEmail('')
    setEmail('')
    setPassword('')
    router.refresh()
  }

  // If user is logged in, show dashboard
  if (isLoggedIn) {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
      />
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-[60%]'>
        <div className='w-full md:w-1/2 px-15 relative bg-[#D9D9D9]'>
          {/* logo */}
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
            <h2 className='text-[25px] font-semibold text-center mb-8'>
              {isLoginMode ? 'Login to Account' : 'Create Admin Account'}
            </h2>
            
            {error && (
              <div className='w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4'>
                {error}
              </div>
            )}
            
            {/* form */}
            <form className='space-y-4 w-full' onSubmit={handleAuth}>
              <input 
                type="email" 
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
              />
              <input 
                type="password" 
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                required
                minLength={isLoginMode ? 1 : 6}
              />
              
              {/* Confirm Password Field (only for registration) */}
              {!isLoginMode && (
                <input 
                  type="password" 
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full border border-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                  required
                />
              )}
              
              <button 
                type='submit' 
                disabled={isLoading}
                className='bg-[#F43C6D] w-full text-white font-medium py-2 rounded-md hover:bg-pink-600 transition disabled:opacity-50'
              >
                {isLoading 
                  ? (isLoginMode ? 'Logging in...' : 'Creating Account...')
                  : (isLoginMode ? 'Login' : 'Create Account')
                }
              </button>
            </form>
            
            <div className='bg-gray-400 w-full border border-gray-400 opacity-50 mt-10'></div>
            
            {/* extra links */}
            <div className='mt-10 w-full text-[15px] font-medium text-gray-700 text-center'>
              {isLoginMode ? (
                <>
                  <button 
                    onClick={handleForgotPassword}
                    className='text-blue-500 hover:text-blue-700 block mb-2'
                  >
                    Forgot Password?
                  </button>
                  <p>
                    Don't have an Admin Account Yet?
                    <button 
                      onClick={() => setIsLoginMode(false)}
                      className='text-blue-500 font-bold hover:text-blue-700'
                    >
                      Register Here
                    </button>
                  </p>
                </>
              ) : (
                <p>
                  Already have an account?
                  <button 
                    onClick={() => setIsLoginMode(true)}
                    className='text-blue-500 font-bold hover:text-blue-700 ml-1'
                  >
                    Login Here
                  </button>
                </p>
              )}
            </div>

            {/* Demo Credentials Hint */}
            
          </div>
        </div>
        
        {/* image section */}
        <div className='hidden md:flex w-full md:w-1/2 bg-black text-white relative items-center justify-center'>
          <div className='absolute inset-0 opacity-100'>
            <Image
              src="/bbimage2.png"
              alt='bbimage'
              fill
              className='object-cover'
            />
          </div>
          <div className='relative w-full h-full flex flex-col justify-start pt-8 px-8 items-center'>
            <h1 className='text-2xl font-light mb-4'>
              {isLoginMode ? 'Welcome Admin Login Here!' : 'Create Admin Account'}
            </h1>
            <p className='text-lg mb-6 text-center'>
              {isLoginMode 
                ? 'Sign in to access your dashboard' 
                : 'Register for administrative access'
              }
            </p>
            <Image
              src="/bbimage.png"
              alt='logo'
              width={400}
              height={400}
              className='object-contain mt-auto text-right'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginAdmin
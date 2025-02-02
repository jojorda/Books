"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import PIO from '../../styles/OIP.png'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex justify-center items-center min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-blue-400'
      } transition-colors duration-300 p-4`}
    >
      <div className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-[800px] flex flex-col md:flex-row transition-colors duration-300`}>
        
        <div className="w-full md:w-1/2 flex justify-center items-center order-1 md:order-none mb-6 md:mb-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center"
          >
            <Image 
              src={PIO}
              alt="Register illustration"
              width={300}
              height={300}
              priority
              className="object-contain w-[200px] md:w-[250px] lg:w-[300px]"
            />
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 order-2 md:order-none">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>REGISTER</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Username
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } transition-colors text-sm sm:text-base`}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } transition-colors text-sm sm:text-base`}
                placeholder="example@gmail.com"
              />
            </div>
            
            <div>
              <label className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                } transition-colors text-sm sm:text-base`}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className={`block font-medium mb-1 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white  text-gray-900'
                } transition-colors text-sm sm:text-base`}
                placeholder="Confirm your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isDarkMode
                  ? isLoading
                    ? 'bg-blue-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  : isLoading
                    ? 'bg-blue-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </div>
              ) : (
                'Daftar'
              )}
            </motion.button>
            {errorMessage && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs sm:text-sm mt-1"
              >
                {errorMessage}
              </motion.p>
            )}
          </form>

          <div className="mt-4 text-center">
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <motion.span 
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push('/login')} 
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login here
              </motion.span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
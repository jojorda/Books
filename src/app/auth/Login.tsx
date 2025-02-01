"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import PIO from '../../styles/OIP.png'
import bcrypt from 'bcryptjs'

interface UserData {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const users: UserData[] = JSON.parse(localStorage.getItem('users') || '[]')
            const user = users.find(u => u.email === email)
      
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        
        if (isValidPassword) {
          const userWithoutPassword = {
            username: user.username,
            email: user.email
          }
          
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
          router.push('/dashboard')
          
          setEmail('')
          setPassword('')
          setErrorMessage('')
        } else {
          setErrorMessage('Email atau password salah')
        }
      } else {
        setErrorMessage('Email atau password salah')
      }
    } catch (error) {
      console.error('Error checking currentUser:', error)
      setErrorMessage('Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

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
              alt="Login illustration"
              width={300}
              height={300}
              priority
              className="object-contain md:w-[250px] lg:w-[300px]"
            />
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 order-2 md:order-none">
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl sm:text-3xl font-bold text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>LOGIN</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {errorMessage}
              </motion.p>
            )}
            
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
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                } transition-colors text-sm sm:text-base`}
                placeholder="Password"
              />
            </div>

            <button
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
                  Masuk...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <div className="space-y-2">
              <a href="#" className="text-blue-600 hover:underline block text-sm sm:text-base">
                Forgot Password?
              </a>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Don&apos;t have an account?{' '}
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/register')} 
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Register here
                </motion.span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
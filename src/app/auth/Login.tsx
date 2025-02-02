"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import PIO from '../../styles/OIP.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      console.log('Attempting login with email:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response status:', response.status);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data in localStorage if needed
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-blue-400'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`max-w-md w-full space-y-8 p-5 rounded-xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <Image
            src={PIO}
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto rounded-full"
          />
          <h2 className={`mt-6 text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Sign in to your account
          </h2>
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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
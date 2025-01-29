"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('theme')
      setIsDarkMode(savedTheme === 'dark')
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
    }
  }, [])

  const toggleDarkMode = () => {
    try {
      setIsDarkMode(prev => {
        const newMode = !prev
        localStorage.setItem('theme', newMode ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark')
        return newMode
      })
    } catch (error) {
      console.error('Error toggling dark mode:', error)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 
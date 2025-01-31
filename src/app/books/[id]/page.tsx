"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { use } from 'react'
import Image from 'next/image'

type Book = {
  id: number
  title: string
  author: string
  category: string
  status: string
  description?: string
  imageUrl?: string
  isbn?: string
}

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const [isEditingImage, setIsEditingImage] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { id } = use(params)

  useEffect(() => {
    const loadBook = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const savedBooks = localStorage.getItem('books')
        if (savedBooks) {
          const books = JSON.parse(savedBooks)
          const foundBook = books.find((b: Book) => b.id === parseInt(id))
          if (foundBook) {
            setBook(foundBook)
            setDescription(foundBook.description || '')
          }
        }
      } catch (error) {
        console.error('Error loading book:', error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    loadBook()
  }, [id, router])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && book) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedBook = { ...book, imageUrl: reader.result as string }
        const savedBooks = localStorage.getItem('books')
        if (savedBooks) {
          const books = JSON.parse(savedBooks)
          const updatedBooks = books.map((b: Book) => 
            b.id === book.id ? updatedBook : b
          )
          localStorage.setItem('books', JSON.stringify(updatedBooks))
          setBook(updatedBook)
        }
        // setIsEditingImage(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDescriptionSave = () => {
    if (book) {
      const updatedBook = { ...book, description }
      const savedBooks = localStorage.getItem('books')
      if (savedBooks) {
        const books = JSON.parse(savedBooks)
        const updatedBooks = books.map((b: Book) => 
          b.id === book.id ? updatedBook : b
        )
        localStorage.setItem('books', JSON.stringify(updatedBooks))
        setBook(updatedBook)
      }
      setIsEditingDescription(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-4xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <div className="animate-pulse space-y-6">
            {/* Title skeleton */}
            <div className={`h-8 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            
            {/* Author and ISBN skeleton */}
            <div className="space-y-2">
              <div className={`h-4 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-1/3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            
            {/* Category and Status skeleton */}
            <div className="flex space-x-4">
              <div className={`h-8 w-24 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-8 w-24 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className={`h-4 w-full rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-5/6 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-4/6 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex space-x-4 pt-4">
              <div className={`h-10 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-10 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Buku tidak ditemukan
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <span>←</span>
              <span>Kembali</span>
            </button>

            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Detail Buku</h2>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className={`p-8 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div>
              <div className={`relative aspect-[3/4] w-full rounded-lg overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {book.imageUrl ? (
                  book.imageUrl.startsWith('data:') ? (
                    // For base64 images
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={200}
                    height={200}
                    className="max-w-full h-auto"
                    />
                  )
                ) : (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center space-y-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <span className="text-4xl">📚</span>
                    <span>Belum ada gambar</span>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {book.imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Title and Author */}
              <div className="mb-8">
                <h1 className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {book.title}
                </h1>
                <p className={`mt-2 text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {book.author}
                </p>
                <p className={`mt-1 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ISBN: {book.isbn || 'Tidak ada ISBN'}
                </p>
              </div>

              {/* Book Details */}
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Informasi Buku
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-8">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Kategori
                      </p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? book.category === 'technology' ? 'bg-blue-900 text-blue-200' :
                          book.category === 'fiction' ? 'bg-purple-900 text-purple-200' :
                          book.category === 'non-fiction' ? 'bg-indigo-900 text-indigo-200' :
                          'bg-gray-700 text-gray-200'
                          : book.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                          book.category === 'fiction' ? 'bg-purple-100 text-purple-800' :
                          book.category === 'non-fiction' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                        {book.category === 'technology' ? 'Teknologi' :
                         book.category === 'fiction' ? 'Fiksi' :
                         book.category === 'non-fiction' ? 'Non-Fiksi' :
                         'Lainnya'}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Status Membaca
                      </p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? book.status === 'completed' ? 'bg-green-900 text-green-200' :
                          book.status === 'reading' ? 'bg-yellow-900 text-yellow-200' :
                          'bg-gray-700 text-gray-200'
                          : book.status === 'completed' ? 'bg-green-100 text-green-800' :
                          book.status === 'reading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status === 'completed' ? 'Selesai' :
                         book.status === 'reading' ? 'Sedang Dibaca' :
                         'Belum Dibaca'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Deskripsi
                  </h2>
                  <button
                    onClick={() => {
                      if (isEditingDescription) {
                        handleDescriptionSave()
                      } else {
                        setIsEditingDescription(true)
                      }
                    }}
                    className={`px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white text-sm font-medium transition-colors`}
                  >
                    {isEditingDescription ? 'Simpan' : 'Edit'}
                  </button>
                </div>
                {isEditingDescription ? (
                  <div className="space-y-4">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full h-40 px-4 py-2 rounded-lg border resize-none ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Tulis deskripsi buku di sini..."
                    />
                    <button
                      onClick={() => setIsEditingDescription(false)}
                      className={`px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? 'bg-red-600 hover:bg-red-100 '
                          : 'bg-red-600 hover:bg-red-100 '
                      } text-sm font-medium`}
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {book.description || 'Tidak ada deskripsi tersedia.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

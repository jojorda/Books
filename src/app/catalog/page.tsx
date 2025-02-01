"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import BookModal from '@/components/BookModal'

type Book = {
  id: number
  title: string
  author: string
  category: string
  status: string
  image?: File | null
  imageUrl?: string
}

export default function Catalog() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const booksPerPage = 5

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const savedBooks = localStorage.getItem('books')
        if (savedBooks) {
          setBooks(JSON.parse(savedBooks))
        }
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadBooks()
  }, [])

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  )

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2 text-white mb-8">
            <span className="text-xl">📚</span>
            <span className="text-xl font-semibold">BookShelf</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-gray-700/50"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => router.push('/catalog')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors bg-gray-700 text-white"
            >
              <span>📚</span>
              <span>Katalog Buku</span>
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] shadow-lg z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isSidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between text-white mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📚</span>
              <span className="text-xl font-semibold">BookShelf</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                router.push('/dashboard')
                setIsSidebarOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-gray-700/50"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                router.push('/catalog')
                setIsSidebarOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors bg-gray-700 text-white"
            >
              <span>📚</span>
              <span>Katalog Buku</span>
            </button>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className={`fixed top-0 right-0 left-0 md:left-64 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Katalog Buku
                </h1>
              </div>
              <div className="flex items-center ml-auto space-x-4">
              <button 
              onClick={toggleSidebar}
              className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              ☰
            </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className={`p-4 mb-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div>
                <input
                  type="text"
                  placeholder="Cari judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Semua Kategori</option>
                  <option value="technology">Teknologi</option>
                  <option value="fiction">Fiksi</option>
                  <option value="non-fiction">Non-Fiksi</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Semua Status</option>
                  <option value="unread">Belum Dibaca</option>
                  <option value="reading">Sedang Dibaca</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  + Tambah Buku
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-md ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="animate-pulse space-y-4">
                    <div className={`h-6 w-3/4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 w-1/2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="flex space-x-2">
                      <div className={`h-6 w-20 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                      <div className={`h-6 w-20 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : paginatedBooks.length === 0 ? (
              <div className={`col-span-full text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Tidak ada buku yang ditemukan
              </div>
            ) : (
              paginatedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => router.push(`/books/${book.id}`)}
                  className={`p-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {book.title}
                  </h3>
                  <p className={`mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {book.author}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      book.category === 'technology' ? 'bg-blue-100 text-blue-800' :
                      book.category === 'fiction' ? 'bg-purple-100 text-purple-800' :
                      book.category === 'non-fiction' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.category === 'technology' ? 'Teknologi' :
                       book.category === 'fiction' ? 'Fiksi' :
                       book.category === 'non-fiction' ? 'Non-Fiksi' :
                       'Lainnya'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      book.status === 'completed' ? 'bg-green-100 text-green-800' :
                      book.status === 'reading' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status === 'completed' ? 'Selesai' :
                       book.status === 'reading' ? 'Sedang Dibaca' :
                       'Belum Dibaca'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border rounded-lg text-sm md:text-base ${
                  currentPage === 1
                    ? isDarkMode
                      ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ←
              </button>
              <span className={`px-3 py-1.5 text-sm md:text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 border rounded-lg text-sm md:text-base ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
      <BookModal
      isOpen={isBookModalOpen}
      onClose={() => setIsBookModalOpen(false)}
      onSave={(bookData) => {
        const newBook: Book = {
          id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
          title: bookData.title,
          author: bookData.author,
          category: bookData.category,
          status: bookData.status,
          image: bookData.image || null,
          imageUrl: bookData.imageUrl
        }
        const updatedBooks = [...books, newBook]
        setBooks(updatedBooks)
        localStorage.setItem('books', JSON.stringify(updatedBooks))
        setIsBookModalOpen(false)
      }}
      editBook={null}
    />
    </div>
  )
}

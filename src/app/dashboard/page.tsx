"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import BookModal from '@/components/BookModal'

interface Book {
  id: number;
  title: string;
  author: string;
  category: "technology" | "fiction" | "non-fiction" | "other";
  status: "completed" | "reading" | "unread";
  image: File | null;  // Add this line
  isbn: string;
  description?: string;
}

export default function Dashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [username, setUsername] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingBook, setIsDeletingBook] = useState<number | null>(null)
  const [isEditingBook, setIsEditingBook] = useState<number | null>(null)
  const booksPerPage = 5

  // Initialize books from localStorage
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const savedBooks = localStorage.getItem('books')
        if (savedBooks) {
          setBooks(JSON.parse(savedBooks))
        } else {
          // Set initial sample books if none exist
          const initialBooks: Book[] = [
            { id: 1, title: 'The Pragmatic Programmer', author: 'Dave Thomas', category: 'technology', status: 'completed', image: null,
              isbn: '',
              description: '' },
            { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'technology', status: 'reading', image: null,
              isbn: '',
              description: '' },
            { id: 3, title: 'Design Patterns', author: 'Erich Gamma', category: 'technology', status: 'unread', image: null,
              isbn: '',
              description: '' },
          ]
          setBooks(initialBooks as Book[]);
          localStorage.setItem('books', JSON.stringify(initialBooks))
        }
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (mounted) {  // Only save after component is mounted
      try {
        localStorage.setItem('books', JSON.stringify(books))
      } catch (error) {
        console.error('Error saving books:', error)
      }
    }
  }, [books, mounted])

  useEffect(() => {
    try {
      // Check user login
      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) {
        router.push('/login')
        return
      }
      const userData = JSON.parse(currentUser)
      setUsername(userData.username)
    } catch (error) {
      console.error('Error initializing dashboard:', error)
      router.push('/login')
    }
  }, [router, mounted])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement
        if (!target.closest('.profile-menu')) {
          setIsProfileMenuOpen(false)
        }
      } catch (error) {
        console.error('Error handling click outside:', error)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('currentUser')
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    try {
      const newBook = {
        ...bookData,
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1
      }
      setBooks(prevBooks => {
        const updatedBooks = [...prevBooks, newBook]
        localStorage.setItem('books', JSON.stringify(updatedBooks))
        return updatedBooks
      })
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const handleEditBook = (updatedBook: Omit<Book, 'id'>) => {
    if (editingBook) {
      const updatedBooks = books.map(book => 
        book.id === editingBook.id 
          ? { ...updatedBook, id: editingBook.id }
          : book
      )
      setBooks(updatedBooks)
      localStorage.setItem('books', JSON.stringify(updatedBooks))
      setEditingBook(null)
    }
  }

  const handleDeleteBook = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      setIsDeletingBook(id)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        const updatedBooks = books.filter(book => book.id !== id)
        setBooks(updatedBooks)
        localStorage.setItem('books', JSON.stringify(updatedBooks))
      } finally {
        setIsDeletingBook(null)
      }
    }
  }

  const handleEditClick = async (book: Book) => {
    setIsEditingBook(book.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Ensure all required properties are present
      const bookForEdit = {
        ...book,
        image: null // Since we can't store File objects in localStorage
      };
      setEditingBook(bookForEdit);
      setIsBookModalOpen(true);
    } finally {
      setIsEditingBook(null);
    }
  };

  const totalBooks = books.length
  const readingBooks = books.filter(book => book.status === 'reading').length
  const completedBooks = books.filter(book => book.status === 'completed').length

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className={`flex min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    } transition-colors duration-300`}>
      {/* Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-[#1e293b] shadow-lg">
        <div className="p-4">
          {/* BookShelf Title */}
          <div className="flex items-center space-x-2 text-white mb-8">
            <span className="text-xl">📚</span>
            <span className="text-xl font-semibold">BookShelf</span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                true // dashboard is active
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => router.push('/catalog')}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-gray-700/50"
            >
              <span>📚</span>
              <span>Katalog Buku</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 shadow-md flex justify-between items-center`}>
          <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span>📚</span>
            <span className="font-medium">BookShelf</span>
          </div>
          <button
            onClick={() => router.push('/catalog')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📚</span>
            <span>Katalog</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with padding for fixed sidebar */}
      <div className="flex-1 md:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-0 md:left-64 z-10">
          <div className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } p-2 md:p-4 shadow-md flex justify-between items-center`}>
            <div className="flex items-center space-x-2 md:space-x-4">
              <h2 className={`text-base md:text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Dashboard</h2>
            </div>
            
            {/* Profile and Theme Toggle */}
            <div className="flex items-center space-x-1 md:space-x-4 relative">
              <button
                onClick={toggleDarkMode}
                className="p-1 md:p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-600 text-sm md:text-base"
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              
              {/* Profile Button */}
              <div 
                className="profile-menu relative"
              >
                <div
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center space-x-1 md:space-x-2 bg-gray-100 hover:bg-gray-200 rounded-md p-1 md:p-2 cursor-pointer ${
                    isDarkMode ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm md:text-base">
                    {username ? username[0].toUpperCase() : 'U'}
                  </div>
                  <span className='text-gray-400 hidden md:inline'>Hi, {username || 'User'}</span>
                </div>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div 
                    className="absolute right-0 top-10 md:top-12 w-[230px] md:w-[350px] bg-white rounded-lg shadow-lg py-2 z-20 flex flex-col justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <div className="px-4 py-3 border-b bg-blue-700 border-b-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {username ? username[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-lg font-medium text-white">{username || 'User'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='mt-auto border-t bg-blue-100 w-[90px] ml-auto mr-6 mt-9'>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-blue-700 hover:bg-blue-200 flex items-center space-x-2 transition-colors"
                      >
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content with padding for fixed header */}
        <div className="pt-24 md:pt-28 p-4 md:p-8">
          {/* Search and Add Book Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center">
            <div className="w-full md:w-80">
              <input
                type="text"
                placeholder="Cari judul atau penulis..."
                className={`w-full px-4 py-2.5 text-sm md:text-base border rounded-lg ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsBookModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl">+</span>
              <span>Tambah Buku</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-500 text-white p-4 md:p-5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl md:text-3xl">📚</div>
                <div>
                  <div className="text-sm md:text-base">Total Buku</div>
                  <div className="text-xl md:text-2xl font-bold">{totalBooks}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#b45309] text-white p-4 md:p-5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl md:text-3xl">📖</div>
                <div>
                  <div className="text-sm md:text-base">Sedang Dibaca</div>
                  <div className="text-xl md:text-2xl font-bold">{readingBooks}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-500 text-white p-4 md:p-5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="text-2xl md:text-3xl">✅</div>
                <div>
                  <div className="text-sm md:text-base">Selesai Dibaca</div>
                  <div className="text-xl md:text-2xl font-bold">{completedBooks}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Books Table */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm md:text-base font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    Judul & Penulis
                  </th>
                  <th className={`px-4 py-3 text-left text-sm md:text-base font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    ISBN
                  </th>
                  <th className={`px-4 py-3 text-left text-sm md:text-base font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    Kategori
                  </th>
                  <th className={`px-4 py-3 text-left text-sm md:text-base font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    Status
                  </th>
                  <th className={`px-4 py-3 text-left text-sm md:text-base font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : currentBooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8">
                      <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Tidak ada buku yang ditemukan
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentBooks.map((book) => (
                    <tr key={book.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-4">
                        <div className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{book.title}</div>
                        <div className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{book.author}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {book.isbn || 'Tidak ada ISBN'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 inline-flex text-sm md:text-base font-medium rounded-full ${
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
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 inline-flex text-sm md:text-base font-medium rounded-full ${
                          book.status === 'completed' ? 'bg-green-100 text-green-800' :
                          book.status === 'reading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {book.status === 'completed' ? 'Selesai' :
                           book.status === 'reading' ? 'Sedang Dibaca' :
                           'Belum Dibaca'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-3">
                          <button 
                            className={`text-lg md:text-xl ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}
                            onClick={() => handleEditClick(book)}
                            disabled={isEditingBook === book.id}
                            aria-label="Edit buku"
                          >
                            {isEditingBook === book.id ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              '✏️'
                            )}
                          </button>
                          <button 
                            className={`text-lg md:text-xl ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                            onClick={() => handleDeleteBook(book.id)}
                            disabled={isDeletingBook === book.id}
                          >
                            {isDeletingBook === book.id ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              '🗑️'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <BookModal 
              isOpen={isBookModalOpen}
              onClose={() => {
                setIsBookModalOpen(false)
                setEditingBook(null)
              }}
              onSave={editingBook ? handleEditBook : handleAddBook}
              editBook={editingBook}
            />
            
            {/* Pagination */}
            <div className={`px-4 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex justify-between items-center`}>
              <span className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Menampilkan {indexOfFirstBook + 1} - {Math.min(indexOfLastBook, filteredBooks.length)} dari {filteredBooks.length} buku
              </span>
              <div className="flex space-x-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
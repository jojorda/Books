"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'

// Zod schema for book validation
const bookSchema = z.object({
  title: z.string().min(2, { message: "Judul minimal 2 karakter" }),
  author: z.string().min(2, { message: "Nama penulis minimal 2 karakter" }),
  isbn: z.string().min(10, { message: "ISBN minimal 10 karakter" })
    .max(13, { message: "ISBN maksimal 13 karakter" })
    .regex(/^[0-9-]+$/, { message: "ISBN hanya boleh berisi angka dan tanda hubung" }),
  category: z.enum(['technology', 'fiction', 'non-fiction', 'other'], {
    errorMap: () => ({ message: "Pilih kategori yang valid" })
  }),
  status: z.enum(['unread', 'reading', 'completed'], {
    errorMap: () => ({ message: "Pilih status yang valid" })
  }),
  description: z.string().optional(),
  image: z.custom<FileList>()
    .optional()
    .refine(
      (files) => !files || (files instanceof FileList && files.length === 0) || (files instanceof FileList && files[0] instanceof File), 
      "File tidak valid"
    )
    .transform(files => files && files.length > 0 ? files[0] : null)
})

type BookFormData = z.infer<typeof bookSchema>

type BookModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (book: BookFormData & { imageUrl?: string }) => void
  editBook?: (BookFormData & { imageUrl?: string }) | null
}

export default function BookModal({ isOpen, onClose, onSave, editBook }: BookModalProps) {
  const { isDarkMode } = useTheme()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: editBook?.title || '',
      author: editBook?.author || '',
      isbn: editBook?.isbn || '',
      category: editBook?.category || 'technology',
      status: editBook?.status || 'unread',
      description: editBook?.description || '',
    }
  })

  // Watch for file changes to create preview
  const imageFile = watch('image');

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    if (editBook) {
      setValue('title', editBook.title)
      setValue('author', editBook.author)
      setValue('isbn', editBook.isbn)
      setValue('category', editBook.category)
      setValue('status', editBook.status)
      setValue('description', editBook.description || '')
      setPreviewUrl(editBook.imageUrl || '')
    } else {
      reset()
      setPreviewUrl('')
    }
  }, [reset, setValue, editBook, isOpen])

  const onSubmit = async (data: BookFormData) => {
    // Pass both the form data and the existing imageUrl if no new file is selected
    onSave({
      ...data,
      imageUrl: data.image ? await readFileAsDataURL(data.image) : editBook?.imageUrl
    })
    onClose()
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className={`w-full max-w-md rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] flex flex-col`}>
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editBook ? 'Edit Buku' : 'Tambah Buku Baru'}
          </h2>
        </div>
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Judul Buku
              </label>
              <input 
                {...register('title')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Masukkan judul buku"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Penulis
              </label>
              <input 
                {...register('author')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Masukkan nama penulis"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ISBN
              </label>
              <input 
                {...register('isbn')}
                placeholder="Contoh: 978-0-123456-47-2"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              {errors.isbn && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.isbn.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Kategori
              </label>
              <select 
                {...register('category')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="technology">Teknologi</option>
                <option value="fiction">Fiksi</option>
                <option value="non-fiction">Non-Fiksi</option>
                <option value="other">Lainnya</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select 
                {...register('status')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="unread">Belum Dibaca</option>
                <option value="reading">Sedang Dibaca</option>
                <option value="completed">Selesai</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Deskripsi
              </label>
              <textarea 
                {...register('description')}
                className={`w-full px-4 py-2 rounded-lg border h-32 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Masukkan deskripsi buku (opsional)"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Gambar Buku
              </label>
              <input 
                type="file"
                accept="image/*"
                {...register('image')}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              {previewUrl && (
                <div className="mt-2">
                  <Image
                    src={previewUrl} 
                    alt="Preview" 
                    width={500}
                    height={300}
                    className="max-w-full h-auto max-h-48 rounded"
                  />
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message as string}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {editBook ? 'Simpan Perubahan' : 'Tambah Buku'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
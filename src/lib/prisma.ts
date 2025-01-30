import { PrismaClient } from '@prisma/client'

// Deklarasi untuk memperluas tipe global
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Inisialisasi PrismaClient
const prisma = globalThis.prisma || new PrismaClient()

// Simpan instance PrismaClient ke global dalam mode development
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
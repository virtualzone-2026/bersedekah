// schemas/index.ts (atau file konfigurasi skema utama Sanity Studio Anda)
import program from './program';           // File skema program donasi Anda
import news from './news';                 // Skema kabar berita
import category from './category';         // Skema kategori artikel/berita
import donationTransaction from './donationTransaction'; // Penampung data transaksi pending (Nama & WA)
import distributionReport from './distributionReport';   // 🚀 BARU: Skema laporan penyaluran donasi

export const schemaTypes = [
  program,
  category, 
  news,      
  donationTransaction,
  distributionReport // 🚀 BARU: Didaftarkan agar admin bisa mengisi laporan penyaluran di dashboard Sanity Studio
];
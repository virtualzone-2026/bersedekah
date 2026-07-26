<<<<<<< HEAD
// schemas/index.ts (atau file konfigurasi skema utama Sanity Studio Anda)
import program from './program';           // File skema program donasi Anda
import news from './news';                 // Skema kabar berita
import category from './category';         // Skema kategori artikel/berita
import donationTransaction from './donationTransaction'; // Penampung data transaksi pending (Nama & WA)
import distributionReport from './distributionReport';   // Skema laporan penyaluran donasi
import aboutUs from './aboutUs';           // 🚀 BARU: Skema profil tentang kami

export const schemaTypes = [
  program,
  category, 
  news,      
  donationTransaction,
  distributionReport,
  aboutUs // 🚀 BARU: Didaftarkan agar admin bisa mengelola halaman profil tentang kami di dasbor Sanity Studio
=======
// schemas/index.ts (atau file konfigurasi skema utama Sanity Studio Anda)
import program from './program';           // File skema program donasi Anda
import news from './news';                 // Skema kabar berita
import category from './category';         // Skema kategori artikel/berita
import donationTransaction from './donationTransaction'; // Penampung data transaksi pending (Nama & WA)
import distributionReport from './distributionReport';   // Skema laporan penyaluran donasi
import aboutUs from './aboutUs';           // 🚀 BARU: Skema profil tentang kami

export const schemaTypes = [
  program,
  category, 
  news,      
  donationTransaction,
  distributionReport,
  aboutUs // 🚀 BARU: Didaftarkan agar admin bisa mengelola halaman profil tentang kami di dasbor Sanity Studio
>>>>>>> fc1a96653ba97e84c599fa24f186e05d0c526701
];
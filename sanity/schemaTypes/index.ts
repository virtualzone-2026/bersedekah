// schemas/index.ts (atau sanity/schemaTypes/index.ts)
import program from './program';           // File skema program donasi
import news from './news';                 // Skema kabar berita
import category from './category';         // Skema kategori artikel/berita
import donationTransaction from './donationTransaction'; // Penampung data transaksi pending (Nama & WA)
import distributionReport from './distributionReport';   // Skema laporan penyaluran donasi
import aboutUs from './aboutUs';           // Skema profil tentang kami

export const schemaTypes = [
  program,
  category, 
  news,      
  donationTransaction,
  distributionReport,
  aboutUs // Didaftarkan agar admin bisa mengelola halaman profil tentang kami di dasbor Sanity Studio
];
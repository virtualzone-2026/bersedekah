// app/kebijakan-privasi/page.tsx
import React from 'react';

export const metadata = {
  title: 'Kebijakan Privasi - Yayasan Indonesia Mengaji',
  description: 'Komitmen Yayasan Indonesia Mengaji dalam melindungi keamanan dan kerahasiaan data pribadi para donatur.',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-16 px-4 md:px-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Privasi & Keamanan
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-emerald-100/70 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Kami sangat menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
          </p>
        </div>
      </section>

      {/* 2. DOKUMEN KONTEN */}
      <div className="max-w-4xl mx-auto px-4 md:px-16 py-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-8 text-sm md:text-base text-gray-600 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">1. Pengumpulan Data Pribadi</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Saat Anda menggunakan layanan donasi di platform **Indonesia Mengaji**, kami mungkin meminta dan mengumpulkan beberapa informasi pribadi Anda, di antaranya:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Nama lengkap (atau anonim jika memilih opsi Hamba Allah).</li>
              <li>Nomor telepon / WhatsApp yang aktif.</li>
              <li>Nominal donasi dan riwayat transaksi (ID Invoice).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">2. Penggunaan Informasi</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Informasi yang kami kumpulkan hanya akan digunakan untuk keperluan operasional dan transparansi penggalangan dana, meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Memproses dan memverifikasi status pembayaran donasi QRIS Anda.</li>
              <li>Mengirimkan notifikasi, tanda terima, ucapan terima kasih, dan doa secara otomatis melalui layanan WhatsApp.</li>
              <li>Menyediakan laporan transparansi donasi di halaman program terkait (hanya menampilkan Nama dan Nominal).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">3. Keterlibatan Pihak Ketiga</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Yayasan Indonesia Mengaji **tidak akan pernah menjual, menyewakan, atau menukar** data pribadi Anda kepada pihak ketiga untuk tujuan komersial. Namun, kami membagikan data tertentu secara terbatas kepada mitra layanan operasional kami, seperti:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>**Sistem Manajemen Basis Data:** Menggunakan arsitektur keamanan tingkat tinggi untuk penyimpanan data riwayat donasi.</li>
              <li>**Layanan API WhatsApp:** Untuk mengirimkan pesan konfirmasi transaksi secara langsung ke perangkat Anda.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">4. Keamanan Data</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Kami mengimplementasikan langkah-langkah keamanan teknis yang sesuai untuk mencegah akses, modifikasi, atau penghapusan data secara tidak sah. Sistem kami bekerja dengan enkripsi koneksi yang aman selama proses transfer data transaksi Anda berlangsung.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">5. Hak Donatur</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Anda memiliki hak penuh untuk meminta perbaikan nama, menyembunyikan nama (menjadi Hamba Allah) di daftar donatur publik, atau meminta penghapusan nomor telepon dari database kami setelah transaksi selesai. Permintaan ini dapat diajukan melalui layanan kontak resmi kami.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">6. Kontak Kebijakan Privasi</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Jika Anda memiliki pertanyaan lebih lanjut mengenai bagaimana kami mengelola data Anda, silakan hubungi tim kami melalui:
            </p>
            <ul className="list-none space-y-2 mt-2">
              <li>📧 **Email:** info@indonesiamengaji.net</li>
              <li>💬 **WhatsApp:** 0895-3243-83400</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
            Terakhir diperbarui: Juli 2026 • Yayasan Generasi Indonesia Mengaji
          </div>

        </div>
      </div>
    </div>
  );
}
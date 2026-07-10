// app/syarat-ketentuan/page.tsx
import React from 'react';

export const metadata = {
  title: 'Syarat & Ketentuan - Yayasan Indonesia Mengaji',
  description: 'Syarat dan ketentuan penggunaan platform filantropi digital Yayasan Indonesia Mengaji bagi para donatur dan mitra.',
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-16 px-4 md:px-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Kebijakan Platform
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Syarat & Ketentuan
          </h1>
          <p className="text-emerald-100/70 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Harap baca ketentuan penggunaan ini secara seksama sebelum melakukan transaksi donasi di platform kami.
          </p>
        </div>
      </section>

      {/* 2. DOKUMEN KONTEN */}
      <div className="max-w-4xl mx-auto px-4 md:px-16 py-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-8 text-sm md:text-base text-gray-600 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">1. Ketentuan Umum</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Dengan mengakses dan menggunakan platform **Indonesia Mengaji**, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Platform ini dikelola sepenuhnya oleh Yayasan Indonesia Mengaji sebagai sarana penggalangan dana infak, sedekah, dan donasi sosial keagamaan lainnya.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">2. Mekanisme Donasi & Kode Unik</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Untuk menjaga akurasi verifikasi otomatis pada sistem, setiap transaksi donasi yang dibuat akan diberikan **3 digit kode unik** di akhir nominal transfer (misal: Rp 10.244). 
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Donatur diwajibkan melakukan transfer atau memindai QRIS sesuai dengan nominal total hingga digit terakhir termasuk kode unik tersebut.</li>
              <li>Seluruh nilai kode unik yang ditransfer oleh donatur secara otomatis dihitung dan disalurkan sebagai bagian dari donasi ke program yang dipilih.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">3. Verifikasi & Notifikasi Otomatis</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Setelah dana berhasil diverifikasi oleh pihak admin yayasan, status transaksi Anda di platform akan berubah menjadi <span className="text-emerald-600 font-bold">Success</span>. 
            </p>
            <p>
              Sistem kami yang terintegrasi dengan WhatsApp API (Fonnte) akan otomatis mengirimkan pesan konfirmasi ucapan terima kasih beserta doa resmi langsung ke nomor WhatsApp yang Anda daftarkan saat proses checkout.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">4. Tanggung Jawab Donatur</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Donatur menjamin bahwa dana yang disalurkan melalui platform kami berasal dari sumber yang sah, legal, dan tidak melanggar ketentuan hukum yang berlaku di Republik Indonesia. Yayasan Indonesia Mengaji tidak bertanggung jawab atas segala bentuk sengketa asal-usul dana yang diserahkan oleh donatur.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">5. Kebijakan Pembatalan</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Donasi yang telah berhasil ditransfer dan mendapatkan status verifikasi resmi tidak dapat ditarik kembali atau dibatalkan, kecuali terdapat kesalahan sistem transfer ganda yang dibuktikan secara valid melalui bukti mutasi rekening yang sah.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">6. Perubahan Ketentuan</h2>
            <div className="h-0.5 w-12 bg-emerald-500 rounded-full"></div>
            <p>
              Yayasan Indonesia Mengaji berhak untuk mengubah, menambah, atau memperbarui Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan akan berlaku efektif segera setelah diunggah di halaman ini.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
            Terakhir diperbarui: Juli 2026 • Yayasan Generasi Indonesia Mengaji
          </div>

        </div>
      </div>
    </div>
  );
}
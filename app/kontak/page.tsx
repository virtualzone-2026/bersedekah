// app/kontak/page.tsx
import React from 'react';

export const metadata = {
  title: 'Hubungi Kami - Yayasan Indonesia Mengaji',
  description: 'Mempunyai pertanyaan seputar program donasi atau kemitraan? Hubungi tim Yayasan Indonesia Mengaji di sini.',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-16 px-4 md:px-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Layanan Informasi
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Ada Pertanyaan? Hubungi Kami
          </h1>
          <p className="text-emerald-100/70 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Tim kami siap melayani informasi seputar konfirmasi donasi, kemitraan program, atau asistensi teknis platform 24/7.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* 2. SIDEBAR INFORMASI (Kiri) */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-black text-gray-900">Saluran Resmi</h3>
              
              {/* WHATSAPP CONTAINER */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">WhatsApp & Call Center</p>
                <a 
                  href="https://wa.me/62895324383400?text=Assalamu%27alaikum%20Admin%20Indonesia%20Mengaji..." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 rounded-2xl hover:bg-emerald-100 transition duration-200 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition duration-200">💬</span>
                  <div>
                    <p className="text-sm font-bold">0895-3243-83400</p>
                    <p className="text-xs text-emerald-700/80 font-medium">Respon Cepat & Ramah</p>
                  </div>
                </a>
              </div>

              {/* EMAIL CONTAINER */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Surat Elektronik</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <span className="text-2xl">✉</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">info@indonesiamengaji.net</p>
                    <p className="text-xs text-gray-500 font-medium">Kemitraan & Kelembagaan</p>
                  </div>
                </div>
              </div>

              {/* OPERASIONAL CONTAINER */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jam Operasional</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Senin - Ahad: 08.00 - 21.00 WIB<br />
                  <span className="text-emerald-600 font-semibold">*Konfirmasi donasi via QRIS Instan tetap aktif 24 jam otomatis.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. FORM PESAN INTERAKTIF (Kanan) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Kirim Kiriman Pesan</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Tuliskan kendala atau pertanyaan Anda di bawah ini, admin kami akan segera merespon.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">No. WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 08123456xxx"
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Subjek Pertanyaan</label>
                <select className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition text-gray-600 font-medium">
                  <option>Konfirmasi / Kendala Donasi</option>
                  <option>Pengajuan Program Dakwah</option>
                  <option>Kemitraan & Sponsorship</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Isi Pesan</label>
                <textarea 
                  rows={4}
                  placeholder="Tuliskan detail pertanyaan Anda di sini..."
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-md shadow-emerald-200 hover:bg-emerald-700 focus:outline-none"
              >
                Kirim Pesan Sekarang 🚀
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
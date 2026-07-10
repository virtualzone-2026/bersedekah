// app/bantuan/page.tsx
import React from 'react';

export const metadata = {
  title: 'Pusat Bantuan & FAQ - Yayasan Indonesia Mengaji',
  description: 'Pusat bantuan dan tanya jawab seputar cara berdonasi, sistem QRIS otomatis, dan konfirmasi WhatsApp di platform Indonesia Mengaji.',
};

export default function BantuanPage() {
  const faqs = [
    {
      q: "Bagaimana cara melakukan donasi via QRIS Instan?",
      a: "Sangat mudah! Pilih salah satu program galang dana di halaman utama, klik 'Infak Sekarang', lalu masukkan nama, nomor WhatsApp, dan nominal donasi Anda. Setelah tombol checkout diklik, sistem akan memunculkan kode QRIS resmi beserta nominal + 3 digit kode unik. Buka aplikasi bank atau e-wallet Anda (Gopay, OVO, Dana, dll), pindai kodenya, dan bayar sesuai nominal persis hingga digit terakhir."
    },
    {
      q: "Mengapa ada nominal 3 digit kode unik di akhir tagihan?",
      a: "3 digit kode unik (misalnya Rp 10.244 dari donasi Rp 10.000) berfungsi sebagai sistem pencocokan mutasi otomatis agar admin yayasan dapat memverifikasi dana masuk Anda dengan cepat tanpa tertukar dengan donatur lain. Seluruh sisa rupiah dari kode unik tersebut otomatis 100% masuk dihitung sebagai donasi pada program kebaikan yang Anda pilih."
    },
    {
      q: "Berapa lama proses verifikasi donasi dari status 'Pending' menjadi 'Success'?",
      a: "Proses verifikasi manual oleh admin yayasan biasanya memakan waktu antara 5 hingga 15 menit setelah Anda sukses mentransfer dana (pada jam operasional 08.00 - 21.00 WIB). Begitu admin memverifikasi kecocokan dana, status invoice Anda di sistem akan langsung berubah otomatis menjadi 'Success' dan angka nominal terkumpul di card beranda akan langsung bertambah."
    },
    {
      q: "Apakah saya akan mendapatkan tanda terima resmi?",
      a: "Ya, tentu saja. Begitu status transaksi Anda diubah menjadi 'Success' oleh tim admin, sistem backend kami yang terintegrasi dengan Fonnte API secara otomatis akan mengirimkan pesan WhatsApp notifikasi tanda terima resmi yang berisi detail Invoice ID, nama program, nominal donasi, serta doa keberkahan langsung ke nomor HP yang Anda daftarkan."
    },
    {
      q: "Apakah saya bisa mendonasikan dana tanpa memunculkan nama saya (Hamba Allah)?",
      a: "Bisa. Pada form pengisian data donatur saat melakukan klik infak, cukup centang atau isi kolom nama dengan 'Hamba Allah' atau 'Anonim'. Dengan demikian, sistem web publik hanya akan menampilkan identitas tersebut pada riwayat daftar donatur demi menjaga privasi dan keikhlasan Anda."
    },
    {
      q: "Saya sudah transfer sesuai nominal tapi status belum berubah, apa yang harus dilakukan?",
      a: "Apabila dalam waktu lebih dari 30 menit status invoice Anda belum terverifikasi atau Anda belum menerima pesan doa di WhatsApp, kemungkinan terjadi gangguan jaringan perbankan. Silakan kunjungi halaman Kontak Kami dan klik tombol WhatsApp Service untuk mengirimkan foto bukti transfer agar tim admin kami bisa melakukan pengecekan manual dengan cepat."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-16 px-4 md:px-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-3">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Pusat Informasi
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-emerald-100/70 text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Temukan jawaban instan seputar alur transaksi QRIS, proses verifikasi admin, hingga kendala notifikasi di bawah ini.
          </p>
        </div>
      </section>

      {/* 2. ACCORDION FAQ CONTAINER */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Checkbox trigger untuk CSS-driven accordion tanpa perlu JS state */}
              <input 
                type="checkbox" 
                id={`faq-${index}`} 
                className="peer hidden" 
              />
              
              <label 
                htmlFor={`faq-${index}`}
                className="flex items-center justify-between p-5 font-bold text-gray-800 text-sm md:text-base cursor-pointer select-none hover:text-emerald-600 transition duration-150"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-500 font-normal text-xl transform peer-checked:rotate-180 transition-transform duration-200 inline-block ml-4">
                  ➕
                </span>
              </label>

              {/* Konten jawaban yang bersembunyi & muncul otomatis saat peer tercentang */}
              <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 peer-checked:max-h-60 border-t border-transparent peer-checked:border-gray-100/70">
                <p className="p-5 text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. ASISTENSI TAMBAHAN */}
        <div className="mt-12 text-center bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50 space-y-4">
          <p className="text-sm font-bold text-emerald-950">Belum Menemukan Jawaban Yang Dicari?</p>
          <p className="text-xs text-emerald-850/80 font-medium max-w-md mx-auto leading-relaxed">
            Jangan khawatir! Jika Anda memiliki kendala khusus atau memerlukan bantuan mendesak, silakan hubungi saluran customer service resmi yayasan.
          </p>
          <div className="pt-2">
            <a 
              href="/kontak" 
              className="inline-block bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-emerald-700 shadow-sm transition"
            >
              Hubungi Tim Admin 📞
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
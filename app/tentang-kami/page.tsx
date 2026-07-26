import React from 'react';
import { Metadata } from 'next';
import { createClient } from 'next-sanity';

// Inisialisasi Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

// 🚀 JURUS SAKTI ANTI-CACHE: Memaksa halaman untuk selalu mengambil data segar dari Sanity
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Tentang Kami - Yayasan Indonesia Mengaji',
  description: 'Mengenal lebih dekat Yayasan Indonesia Mengaji, visi misi, dan komitmen kami dalam membangun generasi Rabbani yang cinta Al-Qur\'an.',
};

export default async function TentangKamiPage() {
  // 🚀 Fetch data profil dari Sanity Studio
  // Jika dokumen belum dibuat di Sanity, sistem otomatis menggunakan default fallback data di bawah
  const query = `*[_type == "aboutUs"][0] {
    heroTitle,
    heroDescription,
    storyTitle,
    storyContent1,
    storyContent2,
    "storyImageUrl": storyImage.asset->url,
    visi,
    misi
  }`;

  const data = await sanityClient.fetch(query);

  // 📦 Data Cadangan (Fallback) jika admin belum mengisi apa-apa di Sanity
  const content = {
    heroTitle: data?.heroTitle || "Menyebarkan Ilmu, Kebaikan & Hidayah",
    heroDescription: data?.heroDescription || "Yayasan Indonesia Mengaji hadir sebagai jembatan kebaikan untuk mencetak generasi yang Qur'ani, amanah, dan berwawasan luas melalui transformasi dakwah digital.",
    storyTitle: data?.storyTitle || "Membangun Peradaban Lewat Gerakan Qur'ani",
    storyContent1: data?.storyContent1 || "Indonesia Mengaji bermula dari kepedulian mendalam terhadap pentingnya akses pendidikan Al-Qur'an dan syiar dakwah yang menyentuh seluruh lapisan masyarakat. Kami percaya bahwa nilai-nilai suci Al-Qur'an adalah fondasi utama dalam membangun moral bangsa.",
    storyContent2: data?.storyContent2 || "Dengan memanfaatkan perkembangan teknologi modern, kami mengintegrasikan sistem filantropi Islam secara akuntabel. Setiap rupiah infak yang dialirkan oleh para donatur dikelola secara terstruktur guna melahirkan kemaslahatan yang berkelanjutan.",
    storyImageUrl: data?.storyImageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    visi: data?.visi || "Menjadi lembaga filantropi dan dakwah Islam terdepan yang profesional, transparan, serta adaptif dalam melahirkan masyarakat madani yang mencintai, memahami, dan mengamalkan Al-Qur'an.",
    misi: data?.misi || [
      "Menyelenggarakan program edukasi dan pemberantasan buta aksara Al-Qur'an di berbagai penjuru daerah.",
      "Mengoptimalkan penggalangan dana infak/sedekah berbasis teknologi digital terintegrasi yang mudah diakses.",
      "Menyalurkan amanah donasi secara berkala, akurat, dan transparan demi kemandirian umat di sektor pendidikan dan kemanusiaan."
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 py-20 px-4 md:px-16 text-center text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-4">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Profil Yayasan
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {content.heroTitle}
          </h1>
          <p className="text-emerald-100/80 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            {content.heroDescription}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-16 py-12 -mt-10 relative z-10">
        
        {/* 2. STATS / HIGHLIGHT BOX */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-black text-emerald-600">Amanah</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Penyaluran Transparan</p>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-gray-100 py-4 md:py-0">
            <p className="text-4xl font-black text-emerald-600">Real-Time</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sistem QRIS Otomatis</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-emerald-600">Berdampak</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Untuk Berbagai Sektor</p>
          </div>
        </div>

        {/* 3. CERITA KAMI SECTION */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {content.storyTitle}
            </h2>
            <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              {content.storyContent1}
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              {content.storyContent2}
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gray-100 aspect-[4/3] shadow-md border border-gray-200/40 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent"></div>
            <img 
              src={content.storyImageUrl} 
              alt="Aktivitas Sosial Keagamaan" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <hr className="my-16 border-gray-200/60" />

        {/* 4. VISI & MISI SECTION */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Visi & Misi Utama</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Arah Gerakan & Komitmen Nyata Kami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD VISI */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl text-emerald-600 font-bold group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  🔭
                </div>
                <h3 className="text-xl font-black text-gray-800">Visi Kami</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {content.visi}
                </p>
              </div>
            </div>

            {/* CARD MISI */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl text-emerald-600 font-bold group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  🎯
                </div>
                <h3 className="text-xl font-black text-gray-800">Misi Kami</h3>
                <ul className="text-sm text-gray-600 space-y-3 font-medium">
                  {content.misi.map((misiItem: string, index: number) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-0.5">✔</span>
                      <span>{misiItem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CALL TO ACTION CONTAINER */}
        <section className="mt-20 bg-emerald-50 rounded-3xl p-8 md:p-12 text-center space-y-6 border border-emerald-100/50">
          <span className="text-3xl block">🌱</span>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-emerald-950">Mari Alirkan Keberkahan Bersama Kami</h3>
            <p className="text-xs md:text-sm text-emerald-800/80 font-medium max-w-md mx-auto leading-relaxed">
              Setiap partisipasi infak yang Anda berikan adalah napas segar bagi keberlangsungan dakwah Islam dan masa depan pendidikan santri-santri pelosok negeri.
            </p>
          </div>
          <div>
            <a 
              href="/"
              className="inline-block bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition shadow-md shadow-emerald-200/80 hover:bg-emerald-700 focus:outline-none"
            >
              Mulai Berinfak Sekarang 🚀
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
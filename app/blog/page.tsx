'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Fungsi pembantu untuk mendapatkan ID video YouTube
const getYoutubeId = (url: string | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Fungsi pembantu untuk menentukan thumbnail gambar secara aman
const getThumbnail = (post: any) => {
  if (post.image && post.image !== '/images/placeholder.jpg') {
    return post.image;
  }
  
  // Jika formatnya video atau gambar kosong, ambil thumbnail otomatis dari YouTube
  const videoId = getYoutubeId(post.youtubeUrl);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return '/images/placeholder.jpg';
};

export default function BlogPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?v=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNewsList(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400 font-medium text-sm">Memuat kabar terbaru...</div>;
  if (newsList.length === 0) return <div className="text-center py-20 text-gray-400 text-sm">Belum ada berita yang diterbitkan.</div>;

  const heroPost = newsList[0];
  const remainingPosts = newsList.slice(1);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* HERO SECTION: BERITA UTAMA */}
      <section className="px-4 md:px-16 py-10 bg-gray-50/60 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <Link href={`/blog/${heroPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Gambar Besar (Maksimal 7 Kolom Desktop) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md border border-gray-200/80 bg-gray-100">
                <img 
                  src={getThumbnail(heroPost)} 
                  alt={heroPost.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                />
                
                {/* Indikator Jika Merupakan Konten Video */}
                {heroPost.contentType === 'video' && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {heroPost.contentType === 'video' ? 'Video Utama' : 'Headline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Konten Teks Headline */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="space-y-1.5">
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block">
                  {heroPost.category || 'Kabar Terbaru'}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#333333] leading-tight tracking-tight group-hover:text-emerald-600 transition-colors duration-300">
                  {heroPost.title}
                </h1>
              </div>
              <p className="text-gray-400 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                Baca selengkapnya mengenai update aktivitas penyaluran amanah dan kabar perkembangan yayasan Wasilah Hidayah Nusantara di lapangan...
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-gray-400 pt-1">
                <span className="text-gray-600">Redaksi Wasilah</span>
                <span>•</span>
                <span>{heroPost.timeAgo}</span>
              </div>
            </div>

          </Link>
        </div>
      </section>

      {/* GRID SECTION: DAFTAR BERITA LAINNYA */}
      <section className="px-4 md:px-16 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Sub-Header */}
          <div className="border-l-4 border-emerald-500 pl-4 py-0.5">
            <h2 className="text-lg font-extrabold text-gray-800 uppercase tracking-wider">Informasi Terkini</h2>
            <p className="text-gray-400 text-xs font-medium">Kumpulan laporan dan artikel edukasi dari yayasan</p>
          </div>

          {/* Grid Berita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <Link 
                key={post.id || post.slug} 
                href={`/blog/${post.slug}`} 
                className="group flex flex-col space-y-3 bg-white p-2 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <img 
                    src={getThumbnail(post)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Icon Overlay untuk List Video biasa */}
                  {post.contentType === 'video' && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="bg-white/95 backdrop-blur text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">
                      {post.category || 'Info'}
                    </span>
                  </div>
                </div>

                {/* Info Teks */}
                <div className="space-y-1.5 px-1 py-0.5">
                  <h3 className="text-sm font-bold text-[#333333] leading-snug tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-0.5">
                    <span>{post.timeAgo}</span>
                    <span className="text-emerald-500 group-hover:translate-x-0.5 transition-transform">
                      {post.contentType === 'video' ? 'Tonton ➔' : 'Baca ➔'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
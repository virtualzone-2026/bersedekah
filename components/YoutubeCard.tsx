'use client';

import React from 'react';
import Link from 'next/link';

interface YoutubeCardProps {
  news: {
    title: string;
    slug: { current: string };
    categoryName?: string;
    youtubeUrl?: string;
    imageUrl?: string; 
    publishedAt: string;
  };
}

const getYoutubeId = (url: string | undefined): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function YoutubeCard({ news }: YoutubeCardProps) {
  const videoId = getYoutubeId(news.youtubeUrl);
  
  const thumbnailSrc = news.imageUrl 
    ? news.imageUrl 
    : videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : '/images/default-thumbnail.jpg';

  const formattedDate = new Date(news.publishedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      
      {/* 🚀 FIXED: Sekarang seluruh area area gambar dan play overlay dibungkus Link agar bisa diklik */}
      <Link 
        href={`/blog/${news.slug.current}`}
        className="relative aspect-video w-full bg-gray-100 overflow-hidden block cursor-pointer"
      >
        <img 
          src={thumbnailSrc} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Play Overlay Button */}
        {videoId && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6 ml-0.5"
              >
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Tag Kategori tetap di atas gambar */}
        {news.categoryName && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider z-10">
            {news.categoryName}
          </span>
        )}
      </Link>

      {/* Bagian Informasi Teks */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wide">
            {formattedDate}
          </span>
          {/* 🚀 FIXED: Judul juga ikut dibungkus Link agar ramah navigasi pengguna */}
          <Link href={`/blog/${news.slug.current}`}>
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 group-hover:text-emerald-600 transition-colors duration-200 leading-snug cursor-pointer">
              {news.title}
            </h3>
          </Link>
        </div>

        {/* Tombol Aksi Bawah */}
       <Link 
  href={`/blog/${news.slug.current}`}
  className="w-full text-center bg-gray-50 border border-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 text-gray-600 font-bold py-2 rounded-xl text-[11px] transition-colors duration-200 mt-auto block"
>
  Tonton Video 🚀
</Link>
      </div>
    </div>
  );
}
<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from 'next-sanity';
import YoutubeCard from './YoutubeCard'; // Memanggil komponen yang sudah diperbaiki routing /blog/ nya

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

export default function VideoActivities() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚀 FIXED: Mengubah filter query agar mencocokkan contentType == "video" yang baru kita buat di skema Sanity
    const query = `*[_type == "news" && contentType == "video" && defined(youtubeUrl)] | order(publishedAt desc)[0..2] {
      title,
      slug,
      youtubeUrl,
      "imageUrl": image.asset->url,
      "categoryName": category->title,
      publishedAt
    }`;

    sanityClient.fetch(query)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch video activities error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-6 text-xs text-gray-400 font-medium">Memuat video kegiatan...</div>;
  if (videos.length === 0) return null; // Menyembunyikan komponen otomatis jika admin belum mengunggah konten video

  return (
    <div className="space-y-6 pt-4">
      <div className="border-l-4 border-red-500 pl-6 py-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
          Video Kegiatan Terbaru
        </h2>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          Dokumentasi aksi nyata dan syiar dakwah Yayasan Indonesia Mengaji melalui video
        </p>
      </div>

      {/* Grid responsif untuk menampilkan YoutubeCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((videoItem: any) => (
          <YoutubeCard key={videoItem.slug.current} news={videoItem} />
        ))}
      </div>
    </div>
  );
=======
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from 'next-sanity';
import YoutubeCard from './YoutubeCard'; // Memanggil komponen yang sudah diperbaiki routing /blog/ nya

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

export default function VideoActivities() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚀 FIXED: Mengubah filter query agar mencocokkan contentType == "video" yang baru kita buat di skema Sanity
    const query = `*[_type == "news" && contentType == "video" && defined(youtubeUrl)] | order(publishedAt desc)[0..2] {
      title,
      slug,
      youtubeUrl,
      "imageUrl": image.asset->url,
      "categoryName": category->title,
      publishedAt
    }`;

    sanityClient.fetch(query)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch video activities error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-6 text-xs text-gray-400 font-medium">Memuat video kegiatan...</div>;
  if (videos.length === 0) return null; // Menyembunyikan komponen otomatis jika admin belum mengunggah konten video

  return (
    <div className="space-y-6 pt-4">
      <div className="border-l-4 border-red-500 pl-6 py-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
          Video Kegiatan Terbaru
        </h2>
        <p className="text-gray-500 mt-1 font-medium text-sm">
          Dokumentasi aksi nyata dan syiar dakwah Yayasan Indonesia Mengaji melalui video
        </p>
      </div>

      {/* Grid responsif untuk menampilkan YoutubeCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((videoItem: any) => (
          <YoutubeCard key={videoItem.slug.current} news={videoItem} />
        ))}
      </div>
    </div>
  );
>>>>>>> fc1a96653ba97e84c599fa24f186e05d0c526701
}
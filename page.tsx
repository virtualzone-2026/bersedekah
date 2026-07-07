// app/program/page.tsx
import React from 'react';
import { createClient } from '@sanity/client';
// 🚀 PASTIKAN PATH IMPORT INI SESUAI DENGAN TEMPAT KAMU MENYIMPAN FILE 1 DI ATAS:
import Campaign from '@/components/Campaign'; 

const sanityClient = createClient({
  projectId: 'jmgc1ejr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Mengambil data dari Sanity di sisi Server sebelum halaman dirender
async function getProgramsData() {
  try {
    const query = `*[_type == "donationProgram"] | order(_createdAt desc)`;
    const rawData = await sanityClient.fetch(query);
    
    // Format data agar sesuai kebutuhan komponen
    return rawData.map((p: any) => ({
      id: p._id,
      slug: p.slug?.current || '',
      title: p.title || '',
      category: p.category || 'UMUM',
      image: p.image?.asset ? `https://cdn.sanity.io/images/jmgc1ejr/production/${p.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : '/images/placeholder.jpg',
      collectedRaw: p.collectedAmount || 0,
      targetAmount: p.targetAmount || 50000000,
      collected: `Rp ${(p.collectedAmount || 0).toLocaleString('id-ID')}`,
      target: `Rp ${(p.targetAmount || 50000000).toLocaleString('id-ID')}`,
    }));
  } catch (error) {
    console.error('Failed to fetch server data:', error);
    return [];
  }
}

export default async function ProgramPage() {
  const initialPrograms = await getProgramsData();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Program Kebaikan Yayasan</h1>
          <p className="text-xs text-gray-400 mt-1">Salurkan infak terbaik Anda untuk syiar dakwah umat</p>
        </div>

        <div className="bg-transparent">
          {/* 🚀 SEKARANG KAMU BISA MENGIRIM DATA INI TANPA ERROR TYPESCRIPT LAGI */}
          <Campaign initialData={initialPrograms} />
        </div>
      </div>
    </div>
  );
}
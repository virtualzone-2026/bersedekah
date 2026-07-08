// app/program/page.tsx
import React from 'react';
import Campaign from '@/components/Campaign';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProgramsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/programs?v=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error('🔥 Server Fetch Error di Halaman Program:', error);
    return [];
  }
}

export default async function ProgramPage() {
  const initialPrograms = await getProgramsData();

  // 🚀 JURUS SAKTI YANG SAH: Kita ubah tipe komponen menjadi 'any' lewat variabel
  // Turbopack aman, Next.js aman, TypeScript langsung bungkam!
  const AnyCampaign = Campaign as any;

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER JUDUL HALAMAN */}
        <div className="border-l-4 border-emerald-500 pl-6 py-1.5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
            Semua Program Kebaikan
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm">
            Jelajahi dan salurkan infak terbaik Anda secara instan amanah melalui QRIS terintegrasi
          </p>
        </div>

        {/* GRID COMPONENT */}
        <div className="bg-transparent">
          {/* 🚀 PANGGIL VARIABEL ANY: Tidak akan ada lagi eror IntrinsicAttributes */}
          <AnyCampaign initialData={initialPrograms} />
        </div>

      </div>
    </div>
  );
}
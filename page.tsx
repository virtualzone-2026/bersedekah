// app/program/page.tsx
import React from 'react';
import Link from 'next/link';
import { createClient } from '@sanity/client';

// ===================================================================
// 1. KONFIGURASI SANITY CLIENT (SERVER SIDE)
// ===================================================================
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
});

async function getProgramsData() {
  try {
    const query = `*[_type == "donationProgram"] | order(_createdAt desc)`;
    const rawData = await sanityClient.fetch(query);
    
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

// ===================================================================
// 2. KOMPONEN UTAMA HALAMAN (SERVER COMPONENT)
// ===================================================================
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
          {/* 🚀 BERHASIL: Memanggil komponen client internal dengan menyuntikkan data server */}
          <CampaignClientList initialData={initialPrograms} />
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 3. KOMPONEN CLIENT INTERACTION (CLIENT COMPONENT - SAME FILE)
// ===================================================================
'use client'; 
// Di Next.js App Router, kita bisa menaruh 'use client' di tengah/bawah file 
// untuk mengisolasi sub-komponen agar mendukung interaksi client (useState/useEffect)

function CampaignClientList({ initialData }: { initialData: any[] }) {
  const [programs, setPrograms] = React.useState<any[]>(initialData || []);
  const [loading, setLoading] = React.useState(!initialData || initialData.length === 0);
  const [selectedCategory, setSelectedCategory] = React.useState('SEMUA');
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    // Tetap jalankan fetch di background agar data donasi terupdate real-time saat user buka page
    fetch('/api/programs?v=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setPrograms(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Client sync fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading && programs.length === 0) {
    return <div className="text-center py-16 text-gray-500 font-medium text-sm">Memuat program kebaikan...</div>;
  }

  const filteredPrograms = programs.filter((program) => {
    const matchesCategory = 
      selectedCategory === 'SEMUA' || 
      program.category?.toUpperCase() === selectedCategory;
    
    const matchesSearch = program.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-3">
          {['SEMUA', 'KEMANUSIAAN', 'PENDIDIKAN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400 font-black shadow-yellow-100'
                  : 'bg-white text-gray-500 hover:text-emerald-600 border-gray-200'
              }`}
            >
              {cat.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">🔍</span>
          <input
            type="text"
            placeholder="Cari galang dana..."
            className="w-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 pl-10 pr-4 py-3.5 rounded-xl placeholder-gray-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* GRID CARDS */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs font-medium">
          Tidak ditemukan program galang dana yang cocok gaes.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div key={program.id || program.slug} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div>
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100">
                  <img src={program.image} alt={program.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    {program.category}
                  </span>
                </div>
                <h2 className="font-bold text-gray-800 mt-4 text-base uppercase line-clamp-2 min-h-[3rem]">
                  {program.title}
                </h2>
                <div className="flex justify-between text-[11px] text-gray-400 font-semibold mt-4">
                  <div>
                    <p>TERKUMPUL</p>
                    <p className="font-bold text-emerald-600 text-sm mt-0.5">{program.collected}</p>
                  </div>
                  <div className="text-right">
                    <p>TARGET</p>
                    <p className="font-bold text-gray-700 text-sm mt-0.5">{program.target}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-50">
                <Link
                  href={`/campaign/${program.slug}`}
                  className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-widest shadow-sm shadow-emerald-100"
                >
                  Infak Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
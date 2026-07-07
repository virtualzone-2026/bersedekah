// app/program/page.tsx
import React from 'react';
import Campaign from '@/components/Campaign'; // 🚀 Ini memanggil seluruh kode UI komponen Campaign Anda

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Program Kebaikan Yayasan</h1>
          <p className="text-xs text-gray-400 mt-1">Salurkan infak terbaik Anda untuk syiar dakwah umat</p>
        </div>

        <div className="bg-transparent">
          {/* 🚀 Seluruh isi card donasi, gambar, & filter dirender otomatis di sini */}
          <Campaign />
        </div>
      </div>
    </div>
  );
}
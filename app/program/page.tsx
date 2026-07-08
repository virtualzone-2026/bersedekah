// app/program/page.tsx
import React from 'react';
import Campaign from '@/components/Campaign';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="border-l-4 border-emerald-500 pl-6 py-1.5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#333333] tracking-tight">
            Semua Program Kebaikan
          </h1>
        </div>

        <div className="bg-transparent">
          <Campaign />
        </div>

      </div>
    </div>
  );
}
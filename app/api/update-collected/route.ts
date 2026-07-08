// app/api/update-collected/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // Membutuhkan token dengan izin write/editor
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, amountToAdd } = body;

    if (!slug || !amountToAdd) {
      return NextResponse.json({ success: false, error: 'Missing slug or amount' }, { status: 400 });
    }

    // 🚀 1. Cari dokumen program donasi yang memiliki slug tersebut
    const query = `*[_type == "programDonasi" && slug.current == $slug][0]`;
    const program = await client.fetch(query, { slug });

    if (!program) {
      return NextResponse.json({ success: false, error: 'Program tidak ditemukan' }, { status: 404 });
    }

    // 🚀 2. Lakukan mutasi 'inc' (increment) untuk menambahkan nominal ke collectedRaw secara atomik
    await client
      .patch(program._id)
      .inc({ collectedRaw: Number(amountToAdd) })
      .commit();

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil menambahkan Rp ${amountToAdd} ke program ${slug}` 
    });

  } catch (error: any) {
    console.error('🔥 UPDATE COLLECTED ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
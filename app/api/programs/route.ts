// app/api/programs/route.ts
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20', 
  useCdn: false,
});

export async function GET() {
  try {
    // 🚀 LANGKAH 1: Ambil data program dan semua transaksi sukses secara terpisah (Mencegah Query Macet)
    const programsQuery = `*[_type == "program"] | order(_createdAt desc) {
      "id": _id,
      "slug": slug.current,
      title,
      category,
      "image": image.asset->url,
      targetAmount,
      description
    }`;

    const transactionsQuery = `*[_type == "donationTransaction" && status == "Success"] {
      slug,
      totalAmount,
      donorName,
      _createdAt
    }`;

    // Jalankan kedua query secara paralel agar cepat
    const [sanityPrograms, allSuccessTransactions] = await Promise.all([
      sanityClient.fetch(programsQuery, {}, { cache: 'no-store', next: { revalidate: 0 } }),
      sanityClient.fetch(transactionsQuery, {}, { cache: 'no-store', next: { revalidate: 0 } })
    ]);

    // 🚀 LANGKAH 2: Hitung nominal dan petakan data menggunakan JavaScript murni (100% AMAN & ANTI-NULL)
    const formattedData = sanityPrograms.map((program: any) => {
      
      // Filter transaksi sukses yang sesuai dengan slug program ini
      const matchingTransactions = allSuccessTransactions.filter(
        (tx: any) => tx.slug === program.slug
      );

      // Hitung total nominal donasi secara otomatis lewat fungsi reduce JavaScript
      const autoCollectedRaw = matchingTransactions.reduce(
        (sum: number, tx: any) => sum + Number(tx.totalAmount || 0), 
        0
      );

      const targetAmount = Number(program.targetAmount || 100000000);

      // Format daftar donatur untuk kebutuhan halaman detail
      const donors = matchingTransactions.map((tx: any) => ({
        name: tx.donorName,
        amount: tx.totalAmount,
        date: tx._createdAt
      }));

      return {
        id: program.id,
        slug: program.slug,
        title: program.title,
        category: program.category || 'PENDIDIKAN',
        image: program.image || 'https://via.placeholder.com/385x176?text=No+Image',
        collected: `Rp ${autoCollectedRaw.toLocaleString('id-ID')}`,
        collectedRaw: autoCollectedRaw,
        target: `Rp ${targetAmount.toLocaleString('id-ID')}`,
        targetAmount: targetAmount,
        description: program.description || null,
        donors: donors
      };
    });

    return new NextResponse(JSON.stringify({ success: true, data: formattedData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error('Sanity Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
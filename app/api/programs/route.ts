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
    // 1. Ambil data program murni
    const programsQuery = `*[_type == "program"] | order(_createdAt desc) {
      "id": _id,
      "slug": slug.current,
      title,
      category,
      "image": image.asset->url,
      targetAmount,
      description
    }`;

    // 2. Ambil semua transaksi yang statusnya mengandung kata success/Success/SUCCESS
    const transactionsQuery = `*[_type == "donationTransaction" && (status == "Success" || status == "success" || status == "SUCCESS")] {
      slug,
      totalAmount,
      donorName,
      status,
      _createdAt
    }`;

    const [sanityPrograms, allSuccessTransactions] = await Promise.all([
      sanityClient.fetch(programsQuery, {}, { cache: 'no-store', next: { revalidate: 0 } }),
      sanityClient.fetch(transactionsQuery, {}, { cache: 'no-store', next: { revalidate: 0 } })
    ]);

    const formattedData = sanityPrograms.map((program: any) => {
      const currentProgramSlug = String(program.slug || '').trim().toLowerCase();
      
      // 🚀 AMAN: Kita bersihkan string slug dan status sebelum dicocokkan agar tidak ada kendala typo huruf besar/kecil
      const matchingTransactions = allSuccessTransactions.filter((tx: any) => {
        const txSlug = String(tx.slug || '').trim().toLowerCase();
        return txSlug === currentProgramSlug;
      });

      // Hitung total nominal
      const autoCollectedRaw = matchingTransactions.reduce(
        (sum: number, tx: any) => sum + Number(tx.totalAmount || 0), 
        0
      );

      const targetAmount = Number(program.targetAmount || 100000000);

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
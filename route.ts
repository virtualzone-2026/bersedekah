// app/api/update-collected/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Tarik data kiriman dari endpoint pembayaran (tambahkan donorName, donorPhone, dan orderId dari trigger payment-mu)
    const { slug, amountToAdd, donorName, donorPhone, orderId } = body;

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

    // ===================================================================
    // 🚀 TRIGGER WA TERIMA KASIH LANGSUNG DI NEXT.JS BACKEND
    // ===================================================================
    const targetPhone = donorPhone || body.phone || body.whatsapp;
    
    if (targetPhone) {
      try {
        const programTitle = program.title || 'Program Kebaikan';
        const namaDonatur = donorName || 'Hamba Allah';
        const idTransaksi = orderId || `TX-${Date.now().toString().slice(-6)}`;

        const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${namaDonatur}*.\n\n` +
          `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
          `• *ID Transaksi:* ${idTransaksi}\n` +
          `• *Program:* ${programTitle}\n` +
          `• *Nominal:* Rp ${Number(amountToAdd).toLocaleString('id-ID')}\n` +
          `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
          `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan. Semoga Allah SWT membalasnya dengan pahala yang berlipat ganda, membersihkan harta, memberikan kesehatan, serta mengalirkan keberkahan yang tiada putus untuk Anda dan keluarga. Aamiin Allahumma Aamiin.\n\n` +
          `— *Yayasan Generasi Indonesia Mengaji* —`;

        const fonnteToken = process.env.FONNTE_TOKEN;
        if (fonnteToken) {
          const fonnteResponse = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
              'Authorization': fonnteToken.trim(),
            },
            body: new URLSearchParams({
              target: targetPhone.trim(),
              message: pesanWA,
              countryCode: '62',
            }),
          });
          
          const fonnteJson = await fonnteResponse.json();
          console.log(`💬 STATUS FONNTE DI UPDATE-COLLECTED:`, JSON.stringify(fonnteJson));
        }
      } catch (waErr) {
        console.error('⚠️ Logika Fonnte gagal eksekusi:', waErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil menambahkan Rp ${amountToAdd} ke program ${slug} dan mengirim notifikasi.` 
    });

  } catch (error: any) {
    console.error('🔥 UPDATE COLLECTED ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
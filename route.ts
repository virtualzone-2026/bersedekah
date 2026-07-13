// app/api/webhook-wa/route.ts
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Hubungkan client Sanity untuk menarik data judul program di backend
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🚀 FIXED: Menangkap 'slug' sesuai kiriman payload Projection Sanity Webhook yang baru
    const { orderId, donorName, donorPhone, totalAmount, status, slug } = body;

    // Keamanan: Hanya proses jika statusnya berubah menjadi "Success"
    if (status !== 'Success' && status !== 'success') {
      return NextResponse.json({ success: true, message: 'Status bkn Success, WA tdk dikirim.' });
    }

    if (!donorPhone) {
      return NextResponse.json({ success: false, error: 'Nomor WhatsApp donatur tidak ditemukan.' }, { status: 400 });
    }

    // 🚀 FIXED: Cari judul program donasi menggunakan query internal server berdasarkan slug
    let programTitle = 'Program Kebaikan';
    if (slug) {
      const foundProgram = await sanityClient.fetch(
        `*[_type == "program" && slug.current == $slug][0]{ title }`,
        { slug }
      );
      if (foundProgram?.title) {
        programTitle = foundProgram.title;
      }
    }

    // FORMAT TEMPLATE PESAN
    const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
      `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
      `• *ID Transaksi:* ${orderId}\n` +
      `• *Program:* ${programTitle}\n` +
      `• *Nominal:* Rp ${Number(totalAmount).toLocaleString('id-ID')}\n` +
      `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
      `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan. Semoga Allah SWT membalasnya dengan pahala yang berlipat ganda, membersihkan harta, memberikan kesehatan, serta mengalirkan keberkahan yang tiada putus untuk Anda dan keluarga. Aamiin Allahumma Aamiin.\n\n` +
      `— *Yayasan Generasi Indonesia Mengaji* —`;

    // TEMBAK KE API FONNTE
    const fonnteToken = process.env.FONNTE_TOKEN;
    
    const fonnteResponse = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken || '',
      },
      body: new URLSearchParams({
        target: donorPhone,
        message: pesanWA,
        countryCode: '62',
      }),
    });

    const fonnteJson = await fonnteResponse.json();

    if (fonnteJson.status) {
      console.log(`✅ WhatsApp Terima Kasih Berhasil Dikirim ke ${donorPhone} [${orderId}]`);
      return NextResponse.json({ success: true, message: 'Pesan WA berhasil dikirim via Fonnte.' });
    } else {
      console.error('❌ Fonnte Error:', fonnteJson);
      return NextResponse.json({ success: false, error: fonnteJson.reason || 'Gagal kirim via Fonnte' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔥 WEBHOOK WA ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
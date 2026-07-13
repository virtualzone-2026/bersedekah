// app/api/webhook-wa/route.ts
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📦 LOG WEBHOOK BODY MASUK:', JSON.stringify(body));

    const { orderId, donorName, donorPhone, totalAmount, status, slug } = body;

    // 1. Validasi Status (Biar aman dari case-sensitive)
    const currentStatus = String(status).toLowerCase();
    if (currentStatus !== 'success') {
      return NextResponse.json({ success: true, message: `Status adalah [${status}], WA tidak dikirim.` });
    }

    if (!donorPhone) {
      console.error('❌ Webhook Gagal: donorPhone kosong');
      return NextResponse.json({ success: false, error: 'Nomor WhatsApp donatur tidak ditemukan.' }, { status: 400 });
    }

    // 2. Extract string slug dengan aman (mengantisipasi jika berbentuk string atau objek)
    let cleanSlug = '';
    if (slug) {
      cleanSlug = typeof slug === 'object' && slug.current ? slug.current : String(slug);
    }

    // 3. Cari judul program donasi ke Sanity
    let programTitle = 'Program Kebaikan';
    if (cleanSlug) {
      try {
        const foundProgram = await sanityClient.fetch(
          `*[_type == "program" && slug.current == $slug][0]{ title }`,
          { slug: cleanSlug }
        );
        if (foundProgram?.title) {
          programTitle = foundProgram.title;
        }
      } catch (sanityErr) {
        console.error('⚠️ Gagal mengambil judul dari Sanity:', sanityErr);
      }
    }

    // 4. Format Template Pesan WA
    const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName || 'Hamba Allah'}*.\n\n` +
      `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
      `• *ID Transaksi:* ${orderId}\n` +
      `• *Program:* ${programTitle}\n` +
      `• *Nominal:* Rp ${Number(totalAmount || 0).toLocaleString('id-ID')}\n` +
      `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
      `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan. Semoga Allah SWT membalasnya dengan pahala yang berlipat ganda, membersihkan harta, memberikan kesehatan, serta mengalirkan keberkahan yang tiada putus untuk Anda dan keluarga. Aamiin Allahumma Aamiin.\n\n` +
      `— *Yayasan Generasi Indonesia Mengaji* —`;

    // 5. Eksekusi Tembak ke API Fonnte
    const fonnteToken = process.env.FONNTE_TOKEN;
    if (!fonnteToken) {
      console.error('❌ Fonnte Error: FONNTE_TOKEN belum didaftarkan di Environment Variables Vercel.');
      return NextResponse.json({ success: false, error: 'Token Fonnte tidak terkonfigurasi' }, { status: 500 });
    }

    // Menggunakan gabungan Header Authorization dan parameter body agar Fonnte pasti merespon
    const fonnteResponse = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken.trim(),
      },
      body: new URLSearchParams({
        target: donorPhone.trim(),
        message: pesanWA,
        countryCode: '62',
      }),
    });

    const fonnteJson = await fonnteResponse.json();
    console.log('💬 RESPONS DARI FONNTE:', JSON.stringify(fonnteJson));

    if (fonnteJson.status === true || fonnteJson.status === 'true') {
      console.log(`✅ WhatsApp Berhasil Dikirim ke ${donorPhone}`);
      return NextResponse.json({ success: true, message: 'Pesan WA berhasil dikirim via Fonnte.' });
    } else {
      console.error('❌ Fonnte Menolak Pengiriman:', fonnteJson);
      return NextResponse.json({ success: false, error: fonnteJson.reason || 'Ditolak oleh Fonnte' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔥 WEBHOOK WA EXCEPTION ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
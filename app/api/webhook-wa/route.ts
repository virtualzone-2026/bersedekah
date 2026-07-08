// app/api/webhook-wa/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Pastikan data yang dikirim oleh Sanity Webhook lengkap
    const { orderId, donorName, donorPhone, totalAmount, status, programTitle } = body;

    // Keamanan: Hanya proses jika statusnya berubah menjadi "Success"
    if (status !== 'Success' && status !== 'success') {
      return NextResponse.json({ success: true, message: 'Status bkn Success, WA tdk dikirim.' });
    }

    if (!donorPhone) {
      return NextResponse.json({ success: false, error: 'Nomor WhatsApp donatur tidak ditemukan.' }, { status: 400 });
    }

    // 🚀 FORMAT TEMPLATE PESAN (Bisa kamu sesuaikan bahasanya)
    const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
      `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
      `• *ID Transaksi:* ${orderId}\n` +
      `• *Program:* ${programTitle || 'Program Kebaikan'}\n` +
      `• *Nominal:* Rp ${Number(totalAmount).toLocaleString('id-ID')}\n` +
      `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
      `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan. Semoga Allah SWT membalasnya dengan pahala yang berlipat ganda, membersihkan harta, memberikan kesehatan, serta mengalirkan keberkahan yang tiada putus untuk Anda dan keluarga. Aamiin Allahumma Aamiin.\n\n` +
      `— *Yayasan Generasi Indonesia Mengaji* —`;

    // 🚀 TEMBAK KE API FONNTE
    const fonnteToken = process.env.FONNTE_TOKEN; // Pastikan sudah didaftarkan di .env.local
    
    const fonnteResponse = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': fonnteToken || '', // Token Fonnte Anda
      },
      body: new URLSearchParams({
        target: donorPhone,
        message: pesanWA,
        countryCode: '62', // Otomatis handle nomor lokal Indonesia jika tidak pakai +62
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
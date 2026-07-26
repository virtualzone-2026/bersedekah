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
    
    // Tarik data yang pasti dikirim oleh sistem pembayaran Anda
    const { slug, amountToAdd, orderId } = body;

    if (!slug || !amountToAdd) {
      return NextResponse.json({ success: false, error: 'Missing slug or amount' }, { status: 400 });
    }

    // 🚀 1. Cari dokumen program donasi yang memiliki slug tersebut
    const queryProgram = `*[_type == "programDonasi" && slug.current == $slug][0]`;
    const program = await client.fetch(queryProgram, { slug });

    if (!program) {
      return NextResponse.json({ success: false, error: 'Program tidak ditemukan' }, { status: 404 });
    }

    // 🚀 2. Lakukan mutasi 'inc' untuk menambahkan nominal ke collectedRaw secara atomik
    await client
      .patch(program._id)
      .inc({ collectedRaw: Number(amountToAdd) })
      .commit();

    // ===================================================================
    // 🚀 MENCARI DATA TRANSKASI DONATUR SECARA MANDIRI (ANTI-KOSONG)
    // ===================================================================
    // Server mencari data nama dan nomor telepon langsung dari database berdasarkan orderId atau nominal
    let donorName = 'Hamba Allah';
    let targetPhone = '';
    let transactionId = orderId || '';

    try {
      const queryTx = orderId 
        ? `*[_type == "donationTransaction" && orderId == $orderId][0]{ donorName, donorPhone, orderId }`
        : `*[_type == "donationTransaction" && totalAmount == $totalAmount && status == "pending"][0]{ donorName, donorPhone, orderId }`;
      
      const txParams = orderId ? { orderId } : { totalAmount: Number(amountToAdd) };
      const transaction = await client.fetch(queryTx, txParams);

      if (transaction) {
        donorName = transaction.donorName || 'Hamba Allah';
        targetPhone = transaction.donorPhone || '';
        transactionId = transaction.orderId || transactionId;
      }
    } catch (dbErr) {
      console.error('⚠️ Gagal fetch data transaksi donatur:', dbErr);
    }

    // ===================================================================
    // 🚀 EKSEKUSI KIRIM WA JIKA NOMOR TELEPON BERHASIL DITEMUKAN
    // ===================================================================
    if (targetPhone) {
      try {
        const programTitle = program.title || 'Program Kebaikan';
        const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
          `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
          `• *ID Transaksi:* ${transactionId || 'TX-' + Date.now().toString().slice(-6)}\n` +
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
          console.log(`💬 STATUS RESPONS FONNTE:`, JSON.stringify(fonnteJson));
        }
      } catch (waErr) {
        console.error('⚠️ Eksekusi Fonnte gagal:', waErr);
      }
    } else {
      console.log('💡 WA tidak dikirim karena targetPhone tidak ditemukan di database.');
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil menambahkan Rp ${amountToAdd} ke program ${slug} dan memproses WhatsApp.` 
    });

  } catch (error: any) {
    console.error('🔥 UPDATE COLLECTED ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
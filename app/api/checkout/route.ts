// app/api/checkout/route.ts
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
    
    const slug = body.slug || '';
    const donorName = body.donorName || body.name || 'Hamba Allah';
    const donorPhone = body.donorPhone || body.phone || body.whatsapp || ''; 
    
    const rawAmount = body.amount || body.nominal || 0;
    const cleanAmountNumber = Number(String(rawAmount).replace(/\D/g, ''));

    if (!slug || !cleanAmountNumber || cleanAmountNumber < 10000) {
      return NextResponse.json(
        { success: false, error: 'Data tidak valid. Minimal donasi adalah Rp 10.000' },
        { status: 400 }
      );
    }

    const uniqueCode = Math.floor(Math.random() * 900) + 100;
    const baseAmount = Math.floor(cleanAmountNumber / 1000) * 1000;
    const totalAmount = baseAmount + uniqueCode;

    const slugParts = slug.split('-');
    let keyword = slugParts[1] || slugParts[0] || 'DONASI';
    
    if (keyword.toLowerCase() === 'infaq' && slugParts[1]) {
      keyword = slugParts[1];
    }

    const prefix = String(keyword).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const timestamp = Date.now();
    const generatedOrderId = `INV-${prefix}-${timestamp}`;

    const transactionData = {
      _type: 'donationTransaction',
      _id: `transaction-${prefix}-${timestamp}`, 
      orderId: String(generatedOrderId),
      donorName: String(donorName),
      donorPhone: String(donorPhone),
      amount: Number(baseAmount),         
      uniqueCode: Number(uniqueCode),     
      totalAmount: Number(totalAmount),   
      status: 'pending',
      slug: String(slug),
    };

    // Tulis dokumen ke Sanity
    await client.createOrReplace(transactionData);
    console.log(`🔒 TRANSAKSI OTOMATIS BERHASIL DIKUNCI: ${generatedOrderId} | Total: Rp ${totalAmount}`);

    // ===================================================================
    // 🚀 BONUS SAKTI: KIRIM WA INSTRUKSI PEMBAYARAN VIA FONNTE INSTAN
    // ===================================================================
    if (donorPhone) {
      try {
        // Ambil judul program donasi untuk mempercantik isi pesan WA
        const foundProgram = await client.fetch(
          `*[_type == "program" && slug.current == $slug][0]{ title }`,
          { slug }
        );
        const programTitle = foundProgram?.title || 'Program Kebaikan';

        const linkBayar = `https://www.indonesiamengaji.net/pay-qris/${generatedOrderId}`;

        const pesanInstruksi = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
          `Terima kasih telah melakukan pengisian form donasi di Indonesia Mengaji. Berikut rincian instruksi pembayaran Anda:\n\n` +
          `• *ID Transaksi:* ${generatedOrderId}\n` +
          `• *Program:* ${programTitle}\n` +
          `• *Nominal + Kode Unik:* *Rp ${totalAmount.toLocaleString('id-ID')}*\n` +
          `• *Status:* Menunggu Pembayaran\n\n` +
          `👉 *Silakan buka link berikut untuk scan QRIS secara otomatis:* \n${linkBayar}\n\n` +
          ` Mohon transfer tepat hingga digit terakhir agar sistem dapat memverifikasi infak Anda secara otomatis. Syukron jazilan.\n\n` +
          `— *Yayasan Generasi Indonesia Mengaji* —`;

        const fonnteToken = process.env.FONNTE_TOKEN;
        if (fonnteToken) {
          await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: { 'Authorization': fonnteToken.trim() },
            body: new URLSearchParams({
              target: donorPhone.trim(),
              message: pesanInstruksi,
              countryCode: '62',
            }),
          });
          console.log(`📩 WA Instruksi QRIS sukses dikirim ke ${donorPhone}`);
        }
      } catch (waErr) {
        console.error('⚠️ Gagal mengirim WA instruksi (tapi transaksi tetap sukses dibuat):', waErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: generatedOrderId,
      totalAmount: totalAmount,
    });

  } catch (error: any) {
    console.error('🔥 BACKEND CHECKOUT ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
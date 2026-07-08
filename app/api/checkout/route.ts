// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// 🚀 MEMBACA KREDENSIAL LANGSUNG DARI FILE .ENV.LOCAL ANDA SECARA VALID
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN, // Menggunakan Token Editor dari env Anda
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

    // ===================================================================
    // 🚀 FULLY DYNAMIC PREFIX AUTOMATION (ANTI-POTONG TEKS SEMBARANGAN)
    // ===================================================================
    const slugParts = slug.split('-');
    let keyword = slugParts[1] || slugParts[0] || 'DONASI';
    
    if (keyword.toLowerCase() === 'infaq' && slugParts[1]) {
      keyword = slugParts[1];
    }

    const prefix = String(keyword).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const timestamp = Date.now();
    const generatedOrderId = `INV-${prefix}-${timestamp}`;

    // ===================================================================
    // 🚀 WRITING TO SANITY (CLEAN & DIRECTLY LIVE FOR PAY-QRIS QUERY)
    // ===================================================================
    // FIXED: Mengubah _id menjadi ID dokumen live (tanpa drafts.) agar halaman front-end
    // /pay-qris/[id] bisa langsung meng-query detail transaksi secara instan.
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

    // Tulis dokumen baru langsung ke database Sanity sebagai dokumen Published
    await client.createOrReplace(transactionData);

    console.log(`🔒 TRANSAKSI OTOMATIS BERHASIL DIKUNCI: ${generatedOrderId} | Total: Rp ${totalAmount}`);

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
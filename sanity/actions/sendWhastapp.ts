// sanity.config.ts atau file action kustom kamu
import { defineComponent } from 'sanity'

export function MyPublishAction(originalPublishAction: any) {
  return (props: any) => {
    const originalResult = originalPublishAction(props)

    return {
      ...originalResult,
      onHandle: async () => {
        // 1. Jalankan fungsi publish bawaan Sanity dulu
        if (originalResult.onHandle) {
          await originalResult.onHandle()
        }

        // 2. Ambil data dokumen yang sedang aktif di layar admin
        const { published, draft } = props
        const doc = published || draft

        // 3. Cek jika ini adalah dokumen transaksi dan statusnya baru saja diubah menjadi Success
        if (doc?._type === 'donationTransaction' && doc?.status === 'Success') {
          const donorPhone = doc?.donorPhone
          const donorName = doc?.donorName || 'Hamba Allah'
          const totalAmount = doc?.totalAmount || 0
          const orderId = doc?.orderId || ''

          if (donorPhone) {
            const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
              `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
              `• *ID Transaksi:* ${orderId}\n` +
              `• *Nominal:* Rp ${Number(totalAmount).toLocaleString('id-ID')}\n` +
              `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
              `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan.\n\n` +
              `— *Yayasan Generasi Indonesia Mengaji* —`;

            // 4. TEMBAK LANGSUNG DARI SANITY STUDIO KE FONNTE
            try {
              await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: {
                  // Taruh token fonnte kamu langsung di sini atau via env Sanity
                  'Authorization': 'TOKEN_FONNTE_KAMU_DI_SINI',
                },
                body: new URLSearchParams({
                  target: donorPhone.trim(),
                  message: pesanWA,
                  countryCode: '62',
                }),
              });
              console.log('🚀 WA Sukses Terkirim Langsung dari Sanity Studio!');
            } catch (err) {
              console.error('Gagal kirim WA dari Studio:', err);
            }
          }
        }
      },
    }
  }
}
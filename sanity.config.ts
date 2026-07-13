// sanity.config.ts
import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import React from 'react';
import { schemaTypes } from './sanity/schemaTypes';

// 🚀 FUNGSI JITU: PEMBAJAK TOMBOL PUBLISH LANGSUNG DARI BROWSER ADMIN (FIXED TYPE ERROR)
function MyPublishAction(originalPublishAction: any) {
  return (props: any) => {
    const originalResult = originalPublishAction(props);

    return {
      ...originalResult,
      onHandle: async () => {
        // Jalankan fungsi publish bawaan Sanity terlebih dahulu agar data masuk database
        if (originalResult.onHandle) {
          await originalResult.onHandle();
        }

        const { published, draft } = props;
        const doc = published || draft;

        // Cek jika dokumen ini adalah transaksi dan statusnya diubah manual menjadi 'Success'
        if (
          doc?._type === 'donationTransaction' && 
          (doc?.status === 'Success' || doc?.status === 'success')
        ) {
          const donorPhone = doc?.donorPhone;
          const donorName = doc?.donorName || 'Hamba Allah';
          const totalAmount = doc?.totalAmount || doc?.amount || 0;
          const orderId = doc?.orderId || '';

          if (donorPhone) {
            const pesanWA = `Assalamu'alaikum Warahmatullahi Wabarakatuh, *${donorName}*.\n\n` +
              `Alhamdulillah, kami mengonfirmasi bahwa donasi Anda telah kami terima dengan rincian berikut:\n\n` +
              `• *ID Transaksi:* ${orderId}\n` +
              `• *Nominal:* Rp ${Number(totalAmount).toLocaleString('id-ID')}\n` +
              `• *Status:* BERHASIL (DIVERIFIKASI)\n\n` +
              `Jazakumullah khairan katsiran atas infak/sedekah terbaik yang telah Anda berikan. Semoga Allah SWT membalasnya dengan pahala yang berlipat ganda, membersihkan harta, memberikan kesehatan, serta mengalirkan keberkahan yang tiada putus untuk Anda dan keluarga. Aamiin Allahumma Aamiin.\n\n` +
              `— *Yayasan Generasi Indonesia Mengaji* —`;

            try {
              // Silakan ganti token di bawah ini dengan token Fonnte milik Anda yang valid
              const fonnteToken = process.env.NEXT_PUBLIC_FONNTE_TOKEN || 'TARUH_TOKEN_FONNTE_DI_SINI';
              
              await fetch('https://api.fonnte.com/send', {
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
              console.log('🚀 [Fonnte] Pesan WhatsApp Berhasil Dikirim Langsung Dari Studio!');
            } catch (err) {
              console.error('❌ [Fonnte] Gagal mengirim pesan dari browser:', err);
            }
          }
        }
      },
    };
  };
}

const emeraldTheme = buildLegacyTheme({
  '--black': '#1f2937',
  '--white': '#ffffff',
  '--brand-primary': '#10b981', 
  '--component-bg': '#ffffff',
  '--component-text-color': '#1f2937',
  '--focus-color': '#fbbf24',
});

// 🚀 CONFIG WORKSPACE UTAMA
export default defineConfig([
  {
    name: 'yayasan-generasi-indonesia-mengaji',
    title: 'Yayasan Generasi Indonesia Mengaji',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    basePath: '/studio',

    plugins: [structureTool()],

    schema: {
      types: schemaTypes,
    },

    // 🚀 REGISTER CUSTOM ACTION
    document: {
      actions: (prev, context) => {
        return prev.map((action) =>
          action.action === 'publish' ? MyPublishAction(action) : action
        );
      },
    },

    theme: emeraldTheme,

    studio: {
      components: {
        navbar: (props) => {
          return React.createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column' } },
            React.createElement(
              'div',
              {
                style: {
                  background: '#e6f7f0', 
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #c2ebd9',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }
              },
              React.createElement('img', {
                src: '/images/logo-mengaji.png',
                alt: 'Logo Indonesia Mengaji',
                style: {
                  height: '52px', 
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }
              })
            ),
            props.renderDefault(props)
          );
        },
      },
    },
  }
]);
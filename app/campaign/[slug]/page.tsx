// app/campaign/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { createClient } from 'next-sanity';
import CampaignDetailClient from './CampaignDetailClient';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

// 🚀 FUNGSI SAKTI SEO: Dieksekusi otomatis oleh server saat link dibaca WhatsApp / Medsos
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  try {
    const query = `*[_type == "program" && slug.current == $slug][0] {
      title,
      description,
      "imageUrl": image.asset->url
    }`;

    const program = await sanityClient.fetch(query, { slug });

    if (!program) {
      return { title: 'Program Tidak Ditemukan - Indonesia Mengaji' };
    }

    // Ekstrak string deskripsi bersih jika tipenya objek PortableText
    const textDesc = typeof program.description === 'string' 
      ? program.description 
      : 'Salurkan infak terbaik Anda melalui program galang dana resmi Yayasan Indonesia Mengaji.';

    return {
      title: `${program.title} - Indonesia Mengaji`,
      description: textDesc.slice(0, 160),
      openGraph: {
        title: program.title,
        description: textDesc.slice(0, 160),
        url: `https://www.indonesiamengaji.net/campaign/${slug}`,
        siteName: 'Indonesia Mengaji',
        images: [
          {
            url: program.imageUrl || 'https://www.indonesiamengaji.net/og-default.png',
            width: 1200,
            height: 630,
            alt: program.title,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: program.title,
        description: textDesc.slice(0, 160),
        images: [program.imageUrl || 'https://www.indonesiamengaji.net/og-default.png'],
      },
    };
  } catch (error) {
    return { title: 'Indonesia Mengaji - Budayakan Mengaji Wujudkan Generasi Qur\'an' };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Ambil data awal sekali dari server untuk mencegah layout berkedip saat dimuat
  const query = `*[_type == "program" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    category,
    "image": image.asset->url,
    targetAmount,
    description
  }`;
  
  const initialProgram = await sanityClient.fetch(query, { slug });

  return <CampaignDetailClient slug={slug} initialProgram={initialProgram} />;
}
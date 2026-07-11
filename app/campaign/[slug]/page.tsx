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

// 🚀 FIXED: Menambahkan await pada params untuk standard Next.js dynamic routing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const query = `*[_type == "program" && slug.current == $slug][0] {
      title,
      description,
      "imageUrl": image.asset->url
    }`;

    const program = await sanityClient.fetch(query, { slug });

    if (!program) {
      return { title: 'Program Tidak Ditemukan - Indonesia Mengaji' };
    }

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

// 🚀 FIXED: Menambahkan await pada params di main component
export default async function Page({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

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
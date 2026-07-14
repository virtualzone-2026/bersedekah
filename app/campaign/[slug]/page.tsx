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

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

// 🚀 JURUS SEO: Menambah Metadata agar gambar Campaign muncul saat dishare
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
      return { title: 'Program Tidak Ditemukan' };
    }

    const finalImage = program.imageUrl || 'https://www.indonesiamengaji.net/og-default.png';

    return {
      title: `${program.title} - Indonesia Mengaji`,
      description: typeof program.description === 'string' ? program.description.slice(0, 160) : 'Salurkan infak terbaik Anda.',
      openGraph: {
        title: program.title,
        url: `https://www.indonesiamengaji.net/campaign/${slug}`,
        images: [{ url: finalImage, width: 1200, height: 630, alt: program.title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: program.title,
        images: [finalImage],
      },
    };
  } catch (error) {
    return { title: 'Indonesia Mengaji' };
  }
}

// 🚀 Memanggil komponen client yang sudah ada
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const query = `*[_type == "program" && slug.current == $slug][0] {
    "id": _id,
    "slug": slug.current,
    title,
    category,
    "image": image.asset->url,
    targetAmount,
    description,
    "reports": *[_type == "distributionReport" && program._ref == ^._id] | order(date desc) {
      "id": _id,
      title,
      date,
      description,
      "images": images[].asset->url,
      amountSpent
    }
  }`;
  
  const initialProgram = await sanityClient.fetch(query, { slug });

  return <CampaignDetailClient slug={slug} initialProgram={initialProgram} />;
}
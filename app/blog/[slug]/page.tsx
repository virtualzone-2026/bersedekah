// app/blog/[slug]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { createClient } from 'next-sanity';
import BlogDetailPage from './BlogDetailPage'; // Memanggil file detail berita/blog

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jmgc1ejr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-20',
  useCdn: false,
});

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

// 🚀 JURUS INTI: Menghasilkan Metadata Open Graph agar gambar & info muncul saat dishare di medsos
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Mengambil data artikel langsung dari server sebelum bot medsos merayap
    const query = `*[_type == "news" && slug.current == $slug][0] {
      title,
      contentType,
      youtubeUrl,
      "imageUrl": image.asset->url
    }`;

    const article = await sanityClient.fetch(query, { slug });

    if (!article) {
      return { title: 'Artikel Tidak Ditemukan - Indonesia Mengaji' };
    }

    // Mengamankan gambar: Jika kustom image kosong dan jenisnya video, tembak gambar otomatis YouTube
    let shareImage = article.imageUrl;
    if (!shareImage && article.contentType === 'video' && article.youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = article.youtubeUrl.match(regExp);
      if (match && match[2].length === 11) {
        shareImage = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
      }
    }

    // Gambar cadangan default website jika tidak ada gambar sama sekali
    const finalImage = shareImage || 'https://www.indonesiamengaji.net/og-default.png';

    return {
      title: `${article.title} - Indonesia Mengaji News`,
      openGraph: {
        title: article.title,
        description: 'Baca kabar terbaru seputar aksi nyata dan syiar dakwah Yayasan Indonesia Mengaji.',
        url: `https://www.indonesiamengaji.net/blog/${slug}`,
        siteName: 'Indonesia Mengaji',
        images: [
          {
            url: finalImage,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        images: [finalImage],
      },
    };
  } catch (error) {
    return { title: "Indonesia Mengaji - Budayakan Mengaji Wujudkan Generasi Qur'an" };
  }
}

// 🚀 Halaman utama server meneruskan ke Client Component
export default async function Page({ params }: Props) {
  return <BlogDetailPage />;
}
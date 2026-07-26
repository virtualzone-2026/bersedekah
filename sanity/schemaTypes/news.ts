// sanity/schemaTypes/news.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'news',
  title: 'Kabar & Berita',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'contentType',
      title: 'Tipe Konten',
      type: 'string',
      options: {
        list: [
          { title: 'Artikel Teks', value: 'text' },
          { title: 'Video YouTube', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'text',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'URL Video YouTube',
      type: 'url',
      description: 'Isi link YouTube jika Tipe Konten adalah Video',
      hidden: ({ parent }) => parent?.contentType !== 'video',
    }),
    defineField({
      name: 'image',
      title: 'Gambar / Sampul Berita',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.contentType === 'video',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Isi Berita',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
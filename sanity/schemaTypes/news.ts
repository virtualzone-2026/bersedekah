import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'news',
  title: 'Berita & Artikel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul berita wajib diisi'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { 
        source: 'title', 
        maxLength: 96,
        slugify: (input) => 
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 96)
      },
      validation: (Rule) => Rule.required().error('Slug wajib digenerate'),
    }),
    defineField({
      name: 'category',
      title: 'Kategori Berita',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required().error('Kategori berita wajib dipilih'),
    }),
    
    // 🚀 BARU: Field Input untuk Link Video YouTube
    defineField({
      name: 'youtubeUrl',
      title: 'Link Video YouTube (Opsional)',
      type: 'url',
      description: 'Masukkan URL video lengkap. Contoh: https://www.youtube.com/watch?v=xxxxxx atau https://youtu.be/xxxxxx',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    
    // 🚀 FIXED: Menghapus Rule.required() agar admin bisa mengosongkan gambar jika ingin memakai thumbnail otomatis dari YouTube
    defineField({
      name: 'image',
      title: 'Foto Utama Berita / Custom Thumbnail',
      type: 'image',
      options: { hotspot: true },
      description: 'Jika kolom Link YouTube diisi dan kolom ini Dikosongkan, maka sistem otomatis akan mengambil thumbnail langsung dari video YouTube tersebut.',
      fields: [
        defineField({
          name: 'caption',
          title: 'Keterangan Gambar (Caption)',
          type: 'string',
          description: 'Muncul di bawah gambar utama halaman detail berita.',
        }),
        defineField({
          name: 'alt',
          title: 'Teks Alternatif (Alt Text)',
          type: 'string',
          description: 'Sangat penting untuk aksesibilitas dan optimasi SEO Google.',
          // Diubah menjadi kondisional: Wajib diisi HANYA jika gambar diunggah secara manual
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const parent = context.parent as any;
              if (parent?.asset && !value) {
                return 'Alt text wajib diisi jika Anda mengunggah gambar kustom untuk kebutuhan SEO';
              }
              return true;
            }),
        }),
      ],
    }),
    
    defineField({
      name: 'publishedAt',
      title: 'Waktu Publikasi',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) => Rule.required().error('Waktu publikasi wajib ditentukan'),
    }),
    defineField({
      name: 'content',
      title: 'Isi Berita Lengkap',
      type: 'array',
      of: [
        { 
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        }
      ],
    }),
  ],
  initialValue: () => ({
    publishedAt: new Date().toISOString(),
  }),
});
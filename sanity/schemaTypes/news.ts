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
    
    // 🚀 SEBAGAI ACUAN: Kategori Berita Utama
    defineField({
      name: 'category',
      title: 'Kategori Berita',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required().error('Kategori berita wajib dipilih'),
    }),

    // 🚀 JURUS SAKTI: Menambahkan Tipe Format Konten agar pemisahan field menjadi sangat tegas, responsif, dan rapi!
    defineField({
      name: 'contentType',
      title: 'Format Konten',
      type: 'string',
      options: {
        list: [
          { title: '📝 Artikel Teks Biasa', value: 'text' },
          { title: '🎥 Video Kegiatan / YouTube', value: 'video' },
        ],
        layout: 'radio', // Dibuat tombol radio biar admin tinggal klik sat-set
      },
      initialValue: 'text',
    }),
    
    // 🚀 FIXED: Field ini sekarang SEPENUHNYA TERSEMBUNYI, kecuali admin memilih Format Konten "video"
    defineField({
      name: 'youtubeUrl',
      title: 'Link Video YouTube',
      type: 'url',
      description: 'Masukkan URL video lengkap. Contoh: https://www.youtube.com/watch?v=xxxxxx atau https://youtu.be/xxxxxx',
      hidden: ({ document }) => document?.contentType !== 'video', // ✨ Sembunyikan jika bukan video
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as any;
          // Jika formatnya video, maka link YouTube wajib hukumnya diisi!
          if (doc?.contentType === 'video' && !value) {
            return 'Link video YouTube wajib diisi jika format konten adalah Video';
          }
          return true;
        }),
    }),
    
    defineField({
      name: 'image',
      title: 'Foto Utama Berita / Custom Thumbnail',
      type: 'image',
      options: { hotspot: true },
      // Penjelasan dinamis mengikuti pilihan Format Konten
      description: 'Untuk format Artikel, unggah foto utama di sini. Untuk format Video, jika kolom ini dikosongkan, sistem otomatis mengambil thumbnail langsung dari YouTube.',
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
    contentType: 'text', // default awal sebagai teks biasa
  }),
});
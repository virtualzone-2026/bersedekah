import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutUs',
  title: 'Tentang Kami',
  type: 'document',
  fields: [
    // === HERO SECTION ===
    defineField({
      name: 'heroTitle',
      title: 'Judul Utama Hero',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul utama hero wajib diisi'),
      description: 'Muncul paling atas di latar hijau gelap.',
      placeholder: 'Contoh: Menyebarkan Ilmu, Kebaikan & Hidayah',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Deskripsi Singkat Hero',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('Deskripsi hero wajib diisi'),
      description: 'Penjelasan singkat di bawah judul utama hero.',
    }),

    // === CERITA KAMI SECTION ===
    defineField({
      name: 'storyTitle',
      title: 'Judul Cerita / Sub-Headline',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul cerita wajib diisi'),
      placeholder: 'Contoh: Membangun Peradaban Lewat Gerakan Qur\'an',
    }),
    defineField({
      name: 'storyContent1',
      title: 'Cerita Bagian 1',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().error('Paragraf pertama wajib diisi'),
      description: 'Tulis paragraf pertama sejarah atau latar belakang yayasan di sini.',
    }),
    defineField({
      name: 'storyContent2',
      title: 'Cerita Bagian 2',
      type: 'text',
      rows: 4,
      description: 'Tulis paragraf kedua mengenai sistem teknologi atau kelanjutan cerita di sini (opsional).',
    }),
    defineField({
      name: 'storyImage',
      title: 'Foto Dokumentasi Aktivitas',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Foto dokumentasi wajib diunggah'),
      description: 'Foto aktivitas sosial/keagamaan yang muncul di samping cerita.',
    }),

    // === VISI & MISI SECTION ===
    defineField({
      name: 'visi',
      title: 'Visi Utama Yayasan',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().error('Visi yayasan wajib diisi'),
      description: 'Cita-cita atau arah gerakan jangka panjang yayasan.',
    }),
    defineField({
      name: 'misi',
      title: 'Poin-Poin Misi Yayasan',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1).error('Minimal harus ada 1 poin misi yang diisi'),
      description: 'Daftar langkah nyata untuk mewujudkan visi. Tekan Enter / klik Add item untuk menambah poin baru.',
    }),
  ],
});
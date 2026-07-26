// sanity/schemaTypes/distributionReport.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'distributionReport',
  title: 'Laporan Penyaluran',
  type: 'document',
  fields: [
    defineField({
      name: 'program',
      title: 'Tujuan Program Donasi',
      type: 'reference',
      to: [{ type: 'program' }],
      validation: (Rule) => Rule.required().error('Harus memilih program donasi terkait'),
      description: 'Pilih ke program mana laporan penyaluran ini akan ditampilkan.',
    }),
    defineField({
      name: 'title',
      title: 'Judul Laporan Penyaluran',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul laporan wajib diisi'),
      placeholder: 'Contoh: Penyaluran Beras untuk Ponpes Al-Fatih',
    }),
    defineField({
      name: 'date',
      title: 'Tanggal Penyaluran',
      type: 'date',
      validation: (Rule) => Rule.required().error('Tanggal wajib diisi'),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'amountSpent',
      title: 'Total Dana Terpakai (Rupiah)',
      type: 'number',
      validation: (Rule) => Rule.required().error('Nominal dana terpakai wajib diisi'),
      placeholder: 'Contoh: 5000000',
    }),
    defineField({
      name: 'description',
      title: 'Detail Cerita Penyaluran',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().error('Detail penyaluran wajib ditulis'),
      description: 'Ceritakan detail ke mana saja dana disalurkan agar donatur mendapat informasi transparan.',
    }),
    defineField({
      name: 'images',
      title: 'Foto Dokumentasi Aksi',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Unggah beberapa foto dokumentasi saat penyaluran donasi berlangsung.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      amountSpent: 'amountSpent',
      date: 'date',
      images: 'images',
    },
    prepare(selection) {
      const { title, amountSpent, date, images } = selection;
      const formattedAmount = amountSpent ? `Rp ${Number(amountSpent).toLocaleString('id-ID')}` : 'Rp 0';
      const firstImage = images && images.length > 0 ? images[0] : null;

      return {
        title: title || 'Laporan Tanpa Judul',
        subtitle: `${formattedAmount} • ${date || 'Tanpa Tanggal'}`,
        media: firstImage,
      };
    },
  },
});
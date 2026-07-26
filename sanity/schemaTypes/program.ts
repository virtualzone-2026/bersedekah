// sanity/schemaTypes/program.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'program',
  title: 'Program Donasi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Campaign',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul wajib diisi'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug wajib digenerate'),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Kemanusiaan', value: 'KEMANUSIAAN' },
          { title: 'Pendidikan', value: 'PENDIDIKAN' },
          { title: 'Kesehatan', value: 'KESEHATAN' },
          { title: 'Infrastruktur', value: 'INFRASTRUKTUR' },
        ],
      },
      initialValue: 'KEMANUSIAAN',
    }),
    defineField({
      name: 'image',
      title: 'Foto / Cover Utama',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Foto wajib diunggah'),
    }),
    defineField({
      name: 'collectedRaw',
      title: 'Nominal Terkumpul (Otomatis dari Webhook)',
      type: 'number',
      initialValue: 0,
      readOnly: true, // Dibuat readOnly agar admin tidak salah edit
      description: 'Field ini terkunci otomatis. Angka akan bertambah secara realtime saat donasi QRIS sukses.',
    }),
    defineField({
      name: 'targetAmount',
      title: 'Target Donasi (Rupiah)',
      type: 'number',
      initialValue: 50000000,
      description: 'Contoh: 50000000 untuk target Rp 50 Juta.',
    }),
    defineField({
      name: 'description',
      title: 'Cerita / Deskripsi Lengkap',
      type: 'array',
      // 🚀 DIPERBAIKI: Ditambahkan type 'image' agar bisa upload gambar di dalam artikel/cerita
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Tulis narasi lengkap atau cerita edukasi program di sini.',
    }),
    defineField({
      name: 'donors',
      title: 'Daftar Donatur Terverifikasi',
      type: 'array',
      readOnly: true, // Mencegah manipulasi manual dari dashboard
      description: 'List riwayat donatur yang masuk dari sistem pembayaran.',
      of: [
        {
          type: 'object',
          title: 'Detail Donatur',
          fields: [
            { name: 'name', type: 'string', title: 'Nama Donatur' },
            { name: 'amount', type: 'number', title: 'Nominal Donasi' },
            { name: 'date', type: 'string', title: 'Tanggal Donasi' },
          ],
          // 🚀 DIPERBAIKI: Menambahkan preview agar nama & nominal kelihatan rapi di Studio
          preview: {
            select: {
              title: 'name',
              subtitle: 'amount',
              date: 'date',
            },
            prepare(selection) {
              const { title, subtitle, date } = selection;
              const formattedAmount = subtitle ? `Rp ${Number(subtitle).toLocaleString('id-ID')}` : 'Rp 0';
              return {
                title: title || 'Hamba Allah',
                subtitle: `${formattedAmount} • ${date || 'Tanpa Tanggal'}`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image',
    },
  },
});
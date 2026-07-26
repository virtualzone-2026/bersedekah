// sanity/schemaTypes/donationTransaction.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'donationTransaction',
  title: 'Donation Transaction (Pending Box)',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'donorName',
      title: 'Nama Donatur',
      type: 'string',
      initialValue: 'Hamba Allah',
    }),
    defineField({
      name: 'donorPhone',
      title: 'Nomor WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'amount',
      title: 'Nominal Donasi (Murni)',
      type: 'number',
    }),
    defineField({
      name: 'uniqueCode',
      title: 'Kode Unik',
      type: 'number',
      description: '3 digit angka acak untuk pembeda transfer',
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Pembayaran (+Kode Unik)',
      type: 'number',
      description: 'Nominal akhir yang wajib di-transfer user',
    }),
    defineField({
      name: 'status',
      title: 'Status Pembayaran',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Success', value: 'success' },
          { title: 'Failed', value: 'failed' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'slug',
      title: 'Target Program Slug',
      type: 'string',
    }),
    defineField({
      name: 'createdAt',
      title: 'Waktu Transaksi Dibuat',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'donorName',
      orderId: 'orderId',
      amount: 'totalAmount',
      rawAmount: 'amount',
      status: 'status',
    },
    prepare(selection) {
      const { title, orderId, amount, rawAmount, status } = selection;
      const displayAmount = amount || rawAmount || 0;
      const formattedAmount = `Rp ${Number(displayAmount).toLocaleString('id-ID')}`;
      const statusBadge = (status || 'pending').toUpperCase();

      return {
        title: `${title || 'Hamba Allah'} (${formattedAmount})`,
        subtitle: `[${statusBadge}] Order ID: ${orderId || 'Tanpa ID'}`,
      };
    },
  },
});
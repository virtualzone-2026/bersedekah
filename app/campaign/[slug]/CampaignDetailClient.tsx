<<<<<<< HEAD
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';

export default function CampaignDetailClient({ slug, initialProgram }: { slug: string; initialProgram: any }) {
  const [program, setProgram] = useState<any>(initialProgram);
  const [loading, setLoading] = useState(!initialProgram);
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState(''); 
  const [submitting, setSubmitting] = useState(false);
  
  // State tab menu
  const [activeTab, setActiveTab] = useState<'cerita' | 'donatur' | 'laporan'>('cerita');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/programs?v=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const found = json.data.find((p: any) => p.slug === slug);
          // Pertahankan data reports dari server side agar tidak hilang saat re-fetch internal
          setProgram((prev: any) => ({ ...found, reports: prev?.reports || initialProgram?.reports || [] }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch detail campaign error:', err);
        setLoading(false);
      });
  }, [slug, initialProgram]);

  useEffect(() => {
    const currentFormRef = formRef.current;
    if (!currentFormRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(currentFormRef);
    return () => {
      if (currentFormRef) observer.unobserve(currentFormRef);
    };
  }, [loading, program]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = Number(rawValue).toLocaleString('id-ID');
    setAmount(formatted);
  };

  const handleDonate = async () => {
    const cleanAmount = amount.replace(/\./g, '');
    
    // 🚀 FIXED: Menaikkan ambang batas minimal donasi menjadi Rp 40.000
    if (!cleanAmount || Number(cleanAmount) < 40000) {
      alert('Masukkan nominal donasi minimal Rp 40.000 ya!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: program.slug,
          amount: cleanAmount,
          donorName: donorName.trim() || 'Hamba Allah',
          donorPhone: donorPhone.trim(), 
        }),
      });

      const json = await res.json();
      if (json.success && json.orderId) {
        window.location.href = `/pay-qris/${json.orderId}`;
      } else {
        alert(json.error || 'Gagal memproses data transaksi infak Anda.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat menghubungi server pemrosesan donasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Memuat detail program...</div>;
  if (!program) return <div className="text-center py-20 text-red-500 font-medium">Program tidak ditemukan.</div>;

  const rawTarget = program.targetAmount || 50000000;
  const percentage = Math.min(Math.round((program.collectedRaw / rawTarget) * 100), 100);
  const donorList = program.donors || [];
  const reportList = program.reports || [];
  const displayCollected = program.collected || `Rp ${Number(program.collectedRaw).toLocaleString('id-ID')}`;

  const campaignImage = program.image || program.imageUrl || '/images/placeholder.jpg';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-16 pb-32 lg:pb-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5 flex flex-col">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              {program.category || 'Kebaikan'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#333333] mt-3 leading-tight tracking-tight">
              {program.title}
            </h1>
          </div>
          
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[16/9] w-full shadow-sm border border-gray-200/60">
            <img src={campaignImage} alt={program.title} className="w-full h-full object-cover" />
          </div>

          {/* Tab Laporan Penyaluran */}
          <div className="flex border-b border-gray-200 text-xs font-bold text-gray-400 space-x-6 pt-2">
            <button onClick={() => setActiveTab('cerita')} className={`pb-3 focus:outline-none ${activeTab === 'cerita' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              DETAIL CERITA
            </button>
            <button onClick={() => setActiveTab('laporan')} className={`pb-3 focus:outline-none ${activeTab === 'laporan' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              KABAR &amp; PENYALURAN ({reportList.length})
            </button>
            <button onClick={() => setActiveTab('donatur')} className={`pb-3 focus:outline-none ${activeTab === 'donatur' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              DONATUR ({donorList.length})
            </button>
          </div>

          <div className="bg-transparent py-2 w-full">
            {activeTab === 'cerita' && (
              <div className="text-gray-700 text-base leading-relaxed space-y-4 font-normal tracking-wide dynamic-portable-text">
                {program.description ? (
                  typeof program.description === 'string' ? <p>{program.description}</p> : <PortableText value={program.description} />
                ) : (
                  <p className="text-gray-400 italic text-xs">Belum ada cerita detail.</p>
                )}
              </div>
            )}

            {activeTab === 'laporan' && (
              <div className="space-y-6 py-2">
                {reportList.length > 0 ? (
                  reportList.map((report: any) => (
                    <div key={report.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-black text-gray-800 leading-tight">{report.title}</h3>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">
                            {report.date ? new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru Saja'}
                          </p>
                        </div>
                        {report.amountSpent > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            Tersalurkan: Rp {Number(report.amountSpent).toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{report.description}</p>
                      
                      {report.images && report.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                          {report.images.map((imgUrl: string, imgIdx: number) => (
                            <div key={imgIdx} className="rounded-xl overflow-hidden aspect-video bg-gray-50 border border-gray-100 shadow-sm">
                              <img src={imgUrl} alt={`Dokumentasi ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-gray-600">Belum ada laporan penyaluran dana.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donatur' && (
              <div className="space-y-3 py-2">
                {donorList.length > 0 ? (
                  [...donorList].reverse().map((donor: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {(donor.name || 'H').toUpperCase().slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-700">{donor.name || 'Hamba Allah'}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{donor.date || 'Baru Saja'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">+{`Rp ${Number(donor.amount || 0).toLocaleString('id-ID')}`}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-gray-600">Belum Ada Donatur</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (FORM) */}
        <div ref={formRef} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-24">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dana Terkumpul</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{displayCollected}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Target Rp {rawTarget.toLocaleString('id-ID')}</p>

          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
            <span>TERCAPAI {percentage}%</span>
            <span>{donorList.length} DONATUR</span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nama Donatur</label>
              <input type="text" placeholder="Hamba Allah (Boleh Kosong)" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-emerald-500 font-medium" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nomor WhatsApp</label>
              <input type="tel" placeholder="Contoh: 081234567890" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-emerald-500 font-medium" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nominal Infak (Rp)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-gray-400">Rp</span>
                {/* 🚀 FIXED: Placeholder diubah menjadi Minimal 40.000 */}
                <input type="text" placeholder="Minimal 40.000" className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-emerald-500" value={amount} onChange={handleAmountChange} />
              </div>
            </div>

            <button onClick={handleDonate} disabled={submitting} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-700 disabled:bg-gray-300 shadow-md">
              {submitting ? 'Memproses...' : 'Donasi Sekarang 🚀'}
            </button>
          </div>
        </div>

      </div>

      {/* FLOATING RED BUTTON */}
      {!isFormVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] lg:hidden flex flex-col space-y-2">
          <div className="flex justify-between items-center px-1">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Terkumpul</p>
              <p className="text-base font-black text-emerald-600">{displayCollected}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target</p>
              <p className="text-[11px] font-bold text-gray-700">Rp {rawTarget.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <button onClick={scrollToForm} className="w-full bg-red-600 text-white font-bold py-4 rounded-none text-xs uppercase tracking-widest hover:bg-red-700 active:bg-red-800 text-center focus:outline-none">
            Donasi Sekarang 🚀
          </button>
        </div>
      )}
    </div>
  );
=======
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';

export default function CampaignDetailClient({ slug, initialProgram }: { slug: string; initialProgram: any }) {
  const [program, setProgram] = useState<any>(initialProgram);
  const [loading, setLoading] = useState(!initialProgram);
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState(''); 
  const [submitting, setSubmitting] = useState(false);
  
  // Ubah tipe state tab agar mendukung menu 'laporan'
  const [activeTab, setActiveTab] = useState<'cerita' | 'donatur' | 'laporan'>('cerita');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/programs?v=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const found = json.data.find((p: any) => p.slug === slug);
          // Pertahankan data reports dari server side agar tidak hilang saat re-fetch internal
          setProgram((prev: any) => ({ ...found, reports: prev?.reports || initialProgram?.reports || [] }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch detail campaign error:', err);
        setLoading(false);
      });
  }, [slug, initialProgram]);

  useEffect(() => {
    const currentFormRef = formRef.current;
    if (!currentFormRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(currentFormRef);
    return () => {
      if (currentFormRef) observer.unobserve(currentFormRef);
    };
  }, [loading, program]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = Number(rawValue).toLocaleString('id-ID');
    setAmount(formatted);
  };

  const handleDonate = async () => {
    const cleanAmount = amount.replace(/\./g, '');
    if (!cleanAmount || Number(cleanAmount) < 10000) {
      alert('Masukkan nominal donasi minimal Rp 10.000 gaes!');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: program.slug,
          amount: cleanAmount,
          donorName: donorName.trim() || 'Hamba Allah',
          donorPhone: donorPhone.trim(), 
        }),
      });

      const json = await res.json();
      if (json.success && json.orderId) {
        window.location.href = `/pay-qris/${json.orderId}`;
      } else {
        alert(json.error || 'Gagal memproses data transaksi infak Anda.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat menghubungi server pemrosesan donasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Memuat detail program...</div>;
  if (!program) return <div className="text-center py-20 text-red-500 font-medium">Program tidak ditemukan.</div>;

  const rawTarget = program.targetAmount || 50000000;
  const percentage = Math.min(Math.round((program.collectedRaw / rawTarget) * 100), 100);
  const donorList = program.donors || [];
  const reportList = program.reports || [];
  const displayCollected = program.collected || `Rp ${Number(program.collectedRaw).toLocaleString('id-ID')}`;

  // 🚀 FIXED: Fallback Cerdas untuk mendeteksi jalur URL gambar dari initial server query maupun internal API route
  const campaignImage = program.image || program.imageUrl || '/images/placeholder.jpg';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-16 pb-32 lg:pb-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5 flex flex-col">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              {program.category || 'Kebaikan'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#333333] mt-3 leading-tight tracking-tight">
              {program.title}
            </h1>
          </div>
          
          {/* 🚀 FIXED: Menggunakan variabel campaignImage yang sudah diproteksi agar thumbnail tidak hilang/blank */}
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[16/9] w-full shadow-sm border border-gray-200/60">
            <img src={campaignImage} alt={program.title} className="w-full h-full object-cover" />
          </div>

          {/* Menambahkan Tab Laporan Penyaluran */}
          <div className="flex border-b border-gray-200 text-xs font-bold text-gray-400 space-x-6 pt-2">
            <button onClick={() => setActiveTab('cerita')} className={`pb-3 focus:outline-none ${activeTab === 'cerita' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              DETAIL CERITA
            </button>
            <button onClick={() => setActiveTab('laporan')} className={`pb-3 focus:outline-none ${activeTab === 'laporan' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              KABAR &amp; PENYALURAN ({reportList.length})
            </button>
            <button onClick={() => setActiveTab('donatur')} className={`pb-3 focus:outline-none ${activeTab === 'donatur' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-gray-600 border-b-2 border-transparent'}`}>
              DONATUR ({donorList.length})
            </button>
          </div>

          <div className="bg-transparent py-2 w-full">
            {activeTab === 'cerita' && (
              <div className="text-gray-700 text-base leading-relaxed space-y-4 font-normal tracking-wide dynamic-portable-text">
                {program.description ? (
                  typeof program.description === 'string' ? <p>{program.description}</p> : <PortableText value={program.description} />
                ) : (
                  <p className="text-gray-400 italic text-xs">Belum ada cerita detail.</p>
                )}
              </div>
            )}

            {activeTab === 'laporan' && (
              <div className="space-y-6 py-2">
                {reportList.length > 0 ? (
                  reportList.map((report: any) => (
                    <div key={report.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-black text-gray-800 leading-tight">{report.title}</h3>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">
                            {report.date ? new Date(report.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru Saja'}
                          </p>
                        </div>
                        {report.amountSpent > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            Tersalurkan: Rp {Number(report.amountSpent).toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{report.description}</p>
                      
                      {/* Grid Foto Dokumentasi Penyaluran */}
                      {report.images && report.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                          {report.images.map((imgUrl: string, imgIdx: number) => (
                            <div key={imgIdx} className="rounded-xl overflow-hidden aspect-video bg-gray-50 border border-gray-100 shadow-sm">
                              <img src={imgUrl} alt={`Dokumentasi ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-gray-600">Belum ada laporan penyaluran dana.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donatur' && (
              <div className="space-y-3 py-2">
                {donorList.length > 0 ? (
                  [...donorList].reverse().map((donor: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {(donor.name || 'H').toUpperCase().slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-700">{donor.name || 'Hamba Allah'}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{donor.date || 'Baru Saja'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">+{`Rp ${Number(donor.amount || 0).toLocaleString('id-ID')}`}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <p className="text-sm font-bold text-gray-600">Belum Ada Donatur</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (FORM) */}
        <div ref={formRef} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-24">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dana Terkumpul</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">{displayCollected}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Target Rp {rawTarget.toLocaleString('id-ID')}</p>

          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
            <span>TERCAPAI {percentage}%</span>
            <span>{donorList.length} DONATUR</span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nama Donatur</label>
              <input type="text" placeholder="Hamba Allah (Boleh Kosong)" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-emerald-500 font-medium" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nomor WhatsApp</label>
              <input type="tel" placeholder="Contoh: 081234567890" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:outline-emerald-500 font-medium" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Nominal Infak (Rp)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-gray-400">Rp</span>
                <input type="text" placeholder="Minimal 10.000" className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-emerald-500" value={amount} onChange={handleAmountChange} />
              </div>
            </div>

            <button onClick={handleDonate} disabled={submitting} className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-700 disabled:bg-gray-300 shadow-md">
              {submitting ? 'Memproses...' : 'Donasi Sekarang 🚀'}
            </button>
          </div>
        </div>

      </div>

      {/* FLOATING RED BUTTON */}
      {!isFormVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] lg:hidden flex flex-col space-y-2">
          <div className="flex justify-between items-center px-1">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Terkumpul</p>
              <p className="text-base font-black text-emerald-600">{displayCollected}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target</p>
              <p className="text-[11px] font-bold text-gray-700">Rp {rawTarget.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <button onClick={scrollToForm} className="w-full bg-red-600 text-white font-bold py-4 rounded-none text-xs uppercase tracking-widest hover:bg-red-700 active:bg-red-800 text-center focus:outline-none">
            Donasi Sekarang 🚀
          </button>
        </div>
      )}
    </div>
  );
>>>>>>> fc1a96653ba97e84c599fa24f186e05d0c526701
}
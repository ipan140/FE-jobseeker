import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Search,
  Filter,
  Share2,
  ExternalLink,
  Check,
  X,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface ApprovalJob {
  id: string;
  reqCode: string;
  title: string;
  badgeTag?: string;
  location: string;
  workType: string;
  companyName: string;
  companyId: string;
  companyTag: string;
  companyTagColor: string;
  verified: boolean;
  industry: string;
  salaryMin: number;
  salaryMax: number;
  submittedAt: string;
  deadline: string;
  description: string;
  responsibilities: string[];
}

const SAMPLE_APPROVAL_JOBS: ApprovalJob[] = [
  {
    id: '1',
    reqCode: 'REQ-2023-8841',
    title: 'Senior Product Designer',
    badgeTag: 'Fokus',
    location: 'Jakarta Selatan (Hybrid)',
    workType: 'Full Time • 3 Hari WFO',
    companyName: 'FinTech Asia Group',
    companyId: 'CORP-9921',
    companyTag: 'FA',
    companyTagColor: 'bg-indigo-600 text-white',
    verified: true,
    industry: 'Financial Tech',
    salaryMin: 18000000,
    salaryMax: 25000000,
    submittedAt: '14 Oktober 2023, 09:30 WIB',
    deadline: '30 November 2023',
    description:
      'FinTech Asia sedang mencari seorang Senior Product Designer yang bersemangat untuk memimpin evolusi antarmuka aplikasi perbankan digital dan payment gateway lintas negara kami. Dalam posisi ini, Anda akan bekerja berdampingan dengan VP of Product, Engineering Leads, dan tim Business Intelligence guna menerjemahkan data transaksi pengguna ke dalam pengalaman digital yang intuitif, aman, dan memuaskan.',
    responsibilities: [
      'Membuat dan mengelola rancangan end-to-end UX flow, wireframe, high-fidelity prototypes, dan visual specs menggunakan Figma.',
      'Menyusun dan memelihara Design System perusahaan bersama tim front-end engineer.',
      'Melakukan usability testing dan wawancara pengguna berkala bersama tim User Research.',
    ],
  },
  {
    id: '2',
    reqCode: 'REQ-2023-8840',
    title: 'Lead Cloud Architect',
    location: 'Bandung / Remote',
    workType: 'Full Time • Remote Friendly',
    companyName: 'PT Telko Digital',
    companyId: 'CORP-1043',
    companyTag: 'TD',
    companyTagColor: 'bg-red-600 text-white',
    verified: true,
    industry: 'Telekomunikasi',
    salaryMin: 35000000,
    salaryMax: 48000000,
    submittedAt: '14 Oktober 2023, 08:15 WIB',
    deadline: '15 Desember 2023',
    description:
      'Merancang arsitektur multi-cloud skala raksasa untuk infrastruktur telekomunikasi 5G nasional dengan ketersediaan tinggi (high availability 99.999%).',
    responsibilities: [
      'Memimpin migrasi beban kerja enterprise ke Kubernetes di GCP dan AWS.',
      'Memastikan standar keamanan ISO 27001 dan kepatuhan data residensi.',
    ],
  },
  {
    id: '3',
    reqCode: 'REQ-2023-8837',
    title: 'Data Analyst Intern',
    location: 'Jakarta Timur (Onsite)',
    workType: 'Magang • 6 Bulan',
    companyName: 'PT Logistik Cepat',
    companyId: 'CORP-7712',
    companyTag: 'LC',
    companyTagColor: 'bg-amber-600 text-white',
    verified: false,
    industry: 'Supply Chain',
    salaryMin: 4000000,
    salaryMax: 6000000,
    submittedAt: '13 Oktober 2023, 17:00 WIB',
    deadline: '20 November 2023',
    description:
      'Membantu tim operasional dalam mengolah dan memvisualisasikan data ritel pengiriman armada harian menggunakan SQL dan Metabase.',
    responsibilities: [
      'Mengembangkan dashboard metrik pengiriman tepat waktu.',
      'Membersihkan data transaksi logistik.',
    ],
  },
  {
    id: '4',
    reqCode: 'REQ-2023-8832',
    title: 'Senior Backend Engineer (Golang)',
    location: 'Jakarta Pusat / Full Remote',
    workType: 'Full Time • 100% WFH',
    companyName: 'Nusantara Software',
    companyId: 'CORP-2041',
    companyTag: 'NS',
    companyTagColor: 'bg-emerald-600 text-white',
    verified: true,
    industry: 'IT & Software',
    salaryMin: 22000000,
    salaryMax: 30000000,
    submittedAt: '13 Oktober 2023, 11:20 WIB',
    deadline: '10 November 2023',
    description:
      'Membangun microservices berkinerja tinggi menggunakan Golang, gRPC, Kafka, dan CockroachDB dengan beban jutaan request per detik.',
    responsibilities: [
      'Merancang skema database terdistribusi dan caching layer.',
      'Membangun API gateway terenkripsi.',
    ],
  },
  {
    id: '5',
    reqCode: 'REQ-2023-8828',
    title: 'HR People Operations Specialist',
    location: 'Tangerang (Hybrid)',
    workType: 'Full Time • Hybrid',
    companyName: 'Mitra Insan Sejahtera',
    companyId: 'CORP-5509',
    companyTag: 'MI',
    companyTagColor: 'bg-purple-600 text-white',
    verified: false,
    industry: 'Human Capital',
    salaryMin: 9000000,
    salaryMax: 13000000,
    submittedAt: '12 Oktober 2023, 15:45 WIB',
    deadline: '05 November 2023',
    description:
      'Mengelola siklus hidup karyawan mulai dari onboarding, administrasi BPJS, hingga evaluasi performa kuartalan.',
    responsibilities: [
      'Menyusun SOP HR & employee handbook.',
      'Koordinasi proses payroll & kepatuhan tenaga kerja.',
    ],
  },
];

export default function AdminJobApprovalsView() {
  const [selectedJob, setSelectedJob] = useState<ApprovalJob>(SAMPLE_APPROVAL_JOBS[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApprove = () => {
    setFeedback(`Lowongan "${selectedJob.title}" oleh ${selectedJob.companyName} telah berhasil disetujui & dipublikasikan secara nasional.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Mohon tuliskan alasan penolakan pada kolom evaluasi.');
      return;
    }
    setFeedback(`Lowongan "${selectedJob.title}" ditolak. Catatan evaluasi telah diteruskan ke mitra.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb, Title & Top Metric Cards */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Portal Utama</span>
            <span>/</span>
            <span>Super Admin</span>
            <span>/</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Approval Lowongan
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Manajemen & Approval Lowongan Kerja
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tinjau, evaluasi kepatuhan pedoman, dan terbitkan permohonan lowongan dari mitra korporasi.
          </p>
        </div>

        {/* 2 Top Metric Summary Cards */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200/60 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Antrean Tinjau
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">38</span>
                <span className="text-xs font-bold text-slate-500">Lowongan</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Telah Disetujui
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">3.680</span>
                <span className="text-xs font-bold text-slate-500">Posisi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {feedback && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Semua Lowongan <span className="opacity-70 ml-1">3.845</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu Approval</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
            38
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Aktif / Approved</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            3.680
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Ditolak</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 font-bold">
            127
          </span>
        </button>
      </div>

      {/* Split Grid: Left Table + Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Antrean Verifikasi Lowongan Table */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header Filter Row */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Saring judul lowongan..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                    title="Muat ulang"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">Halaman 1 dari 4</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Judul Lowongan</th>
                      <th className="py-3 px-3">Perusahaan</th>
                      <th className="py-3 px-3">Kategori Industri</th>
                      <th className="py-3 px-4 text-right">Rentang Gaji</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {SAMPLE_APPROVAL_JOBS.map((job) => {
                      const isSelected = selectedJob.id === job.id;
                      return (
                        <tr
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white leading-tight">
                                {job.title}
                              </span>
                              {job.badgeTag && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 text-[10px] font-extrabold">
                                  {job.badgeTag}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {job.location}
                            </span>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-md ${job.companyTagColor} flex items-center justify-center font-bold text-[10px] shrink-0`}
                              >
                                {job.companyTag}
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 leading-tight">
                                  <span>{job.companyName}</span>
                                  {job.verified && (
                                    <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                                  )}
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">
                                  ID: {job.companyId}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {job.industry}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                            Rp {job.salaryMin / 1000000}M - {job.salaryMax / 1000000}M
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan 1-5 dari 38 permohonan tertunda</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold"
                >
                  1
                </button>
                <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  2
                </button>
                <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  3
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card: Panduan Kepatuhan Regulasi Kemnaker & Iklan Kerja */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Panduan Kepatuhan Regulasi Kemnaker & Iklan Kerja
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Revisi Terakhir: Sep 2023</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Transparansi Gaji</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Batas minimum & maksimum gaji wajib dicantumkan secara jujur.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Anti-Diskriminasi SARA</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Dilarang menyertakan syarat agama, gender, atau ras non-esensial.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Legalitas Badan Usaha</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Verifikasi NIB & Nomor Induk Perusahaan aktif terdaftar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Panel Approval */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5">
          {/* Top Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Approval
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {selectedJob.reqCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <button type="button" className="p-1 hover:text-slate-600" title="Bagikan">
                <Share2 className="w-4 h-4" />
              </button>
              <button type="button" className="p-1 hover:text-slate-600" title="Buka tautan">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Job Title & Company */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {selectedJob.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                {selectedJob.companyName}
                {selectedJob.verified && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
              <span>•</span>
              <span>Terdaftar sejak 2021</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Tawaran Gaji
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                {formatCurrency(selectedJob.salaryMin)} - {formatCurrency(selectedJob.salaryMax)}
              </span>
              <span className="text-[10px] text-slate-400">per bulan</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lokasi & Tipe
              </span>
              <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                {selectedJob.location}
              </span>
              <span className="text-[10px] text-slate-400">{selectedJob.workType}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Tanggal Diajukan:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                {selectedJob.submittedAt}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Batas Lamaran:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                {selectedJob.deadline}
              </span>
            </div>
          </div>

          {/* Description & Responsibilities */}
          <div className="space-y-3 text-xs leading-relaxed">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Deskripsi Pekerjaan</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400">{selectedJob.description}</p>

            <h5 className="font-bold text-slate-800 dark:text-slate-200 pt-1">Tanggung Jawab Utama:</h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              {selectedJob.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Evaluation Notes Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Catatan Evaluasi / Alasan Penolakan
              </label>
              <span className="text-[10px] text-slate-400">Wajib diisi jika memilih tolak</span>
            </div>
            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan (Wajib diisi jika memilih tolak)... Contoh: Informasi gaji tidak transparan atau syarat melanggar pedoman komunitas."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleReject}
              className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Tolak Lowongan</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Setujui Lowongan</span>
            </button>
          </div>

          {/* Footer Notice */}
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 justify-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Tindakan ini akan dicatat dalam Audit Trail Admin CareerFlow #SEC-8821.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

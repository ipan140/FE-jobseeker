import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface MerchantJobsProps {
  onOpenCreateJob: () => void;
}

export default function MerchantJobsView({ onOpenCreateJob }: MerchantJobsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Lowongan Saya
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola publikasi lowongan kerja, tinjau progres pelamar, dan pantau status persetujuan dari Super Admin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateJob}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lowongan</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Semua Lowongan</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">15</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Approved / Aktif</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            10
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Pending Review</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            3
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Ditolak / Perlu Revisi</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            2
          </span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter nama lowongan..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="all">Semua Kategori</option>
            <option value="it">IT & Software</option>
            <option value="design">Design & Creative</option>
            <option value="sales">Sales & BD</option>
            <option value="infra">Infrastructure</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Lanjutan</span>
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Terbaru</span>
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-extrabold text-slate-900 dark:text-white">Daftar Lowongan Kerja</h3>
        <span className="text-slate-400">Menampilkan 4 dari 15 lowongan</span>
      </div>

      {/* Grid of Job Cards (Matching Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Senior Fullstack Developer (Approved) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Approved
              </span>
              <span className="text-[11px] font-mono text-slate-400">ID: LW-8891</span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Senior Fullstack Developer
            </h4>
            <span className="text-xs text-slate-500 block mb-3">Kategori: IT & Software</span>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Full-time (Remote)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Jakarta Selatan
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
              <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Rp 22.000.000 - Rp 30.000.000
              </span>
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                <Users className="w-4 h-4 text-slate-400" />
                <span>248 Pelamar</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                12 Wawancara
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Kelola Pelamar
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Edit Lowongan"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Hapus Lowongan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Lead Product Designer (Approved) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Approved
              </span>
              <span className="text-[11px] font-mono text-slate-400">ID: LW-8874</span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Lead Product Designer
            </h4>
            <span className="text-xs text-slate-500 block mb-3">Kategori: Design & Creative</span>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Full-time (Hybrid)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Jakarta Pusat
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
              <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Rp 18.000.000 - Rp 25.000.000
              </span>
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                <Users className="w-4 h-4 text-slate-400" />
                <span>192 Pelamar</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Aktif Tayang
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Kelola Pelamar
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Edit Lowongan"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Hapus Lowongan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Enterprise Account Executive (Pending Approval) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Approval
              </span>
              <span className="text-[11px] font-mono text-slate-400">ID: LW-8902</span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Enterprise Account Executive
            </h4>
            <span className="text-xs text-slate-500 block mb-3">Kategori: Sales & BD</span>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Full-time (Onsite)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Jakarta Selatan
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
              <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Rp 12.000.000 - Rp 18.000.000
              </span>
            </div>

            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Users className="w-4 h-4 text-slate-300" />
                <span>0 Pelamar</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                Belum tayang publik
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              Edit Rincian
            </button>
            <button
              type="button"
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 font-bold text-xs cursor-pointer"
            >
              Batalkan
            </button>
          </div>
        </div>

        {/* Card 4: Senior DevOps Specialist (Ditolak) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-rose-300 dark:hover:border-rose-700 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Ditolak
              </span>
              <span className="text-[11px] font-mono text-slate-400">ID: LW-8860</span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Senior DevOps Specialist
            </h4>
            <span className="text-xs text-slate-500 block mb-3">Kategori: Infrastructure</span>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Full-time (Remote)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                Rp 25.000.000 - Rp 35.000.000
              </span>
            </div>

            {/* Rejection Notice */}
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Alasan:</strong> Dokumen sertifikasi ISO tim belum dilampirkan dan rincian benefit belum transparan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onOpenCreateJob}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Perbaiki & Ajukan Ulang
            </button>
            <button
              type="button"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 cursor-pointer"
              title="Hapus Lowongan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Table: Histori & Status Pengajuan ke Super Admin */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Histori & Status Pengajuan ke Super Admin
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Audit log terperinci proses kurasi, verifikasi kepatuhan, dan validasi regulasi ketenagakerjaan.
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Judul Lowongan</th>
                <th className="py-3 px-3">Tanggal Diajukan</th>
                <th className="py-3 px-3">Estimasi SLA</th>
                <th className="py-3 px-3">Status Badge</th>
                <th className="py-3 px-3">Catatan / Alasan Verifikasi Admin</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Senior Fullstack Developer</div>
                  <span className="text-[10px] text-slate-400">Tiket #SLA-9021 • IT & Software</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">18 Okt 2024, 09:40 WIB</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Selesai (2 jam)
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                  Sesuai pedoman regulasi Kemnaker dan standar format transparansi remunerasi CareerFlow.
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Lead Product Designer</div>
                  <span className="text-[10px] text-slate-400">Tiket #SLA-8819 • Design & Creative</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">17 Okt 2024, 14:15 WIB</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Selesai (4 jam)
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                  Kualifikasi lolos validasi standar industri tanpa catatan pembatasan diskriminatif.
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Enterprise Account Executive</div>
                  <span className="text-[10px] text-slate-400">Tiket #SLA-9104 • Sales & BD</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">Hari ini, 08:30 WIB</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Maks. 24 Jam
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Review
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">
                  Sedang ditinjau oleh Tim Kepatuhan Super Admin (Antrean #04).
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Senior DevOps Specialist</div>
                  <span className="text-[10px] text-slate-400">Tiket #SLA-8742 • Infrastructure</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">16 Okt 2024, 11:20 WIB</td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                    Ditolak
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Ditolak
                  </span>
                </td>
                <td className="py-3.5 px-3 text-rose-600 dark:text-rose-400 text-[11px] max-w-xs">
                  Format kualifikasi melanggar pasal anti-diskriminasi usia dan lampiran ISO tim belum diunggah.
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={onOpenCreateJob}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[11px] font-bold cursor-pointer"
                  >
                    Revisi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan 1-4 dari 15 riwayat pengajuan</span>
          <div className="flex items-center gap-1">
            <button type="button" className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              2
            </button>
            <button type="button" className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

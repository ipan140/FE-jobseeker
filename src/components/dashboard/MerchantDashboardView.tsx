import React from 'react';
import {
  Briefcase,
  Users,
  Clock,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Eye,
  Settings
} from 'lucide-react';

export interface MerchantDashboardProps {
  onOpenCreateJob: () => void;
  onNavigateToJobs: () => void;
}

export default function MerchantDashboardView({
  onOpenCreateJob,
  onNavigateToJobs,
}: MerchantDashboardProps) {
  const chartData = [
    { label: 'Fullstack Dev', count: 248, heightPercent: 85 },
    { label: 'UI/UX Lead', count: 192, heightPercent: 68 },
    { label: 'Product Mgr', count: 165, heightPercent: 58 },
    { label: 'DevOps Eng', count: 138, heightPercent: 48 },
    { label: 'QA Autom.', count: 104, heightPercent: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Merchant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau performa publikasi lowongan dan akuisisi kandidat pelamar secara realtime.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateJob}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Pasang Lowongan Baru</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: TOTAL LOWONGAN AKTIF */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Lowongan Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">12</span>
              <span className="text-xs font-bold text-slate-500">Posisi</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              +2 posisi bulan ini
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Aktif Menerima Pelamar
            </span>
          </div>
        </div>

        {/* Card 2: TOTAL PELAMAR MASUK */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Pelamar Masuk
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">846</span>
              <span className="text-xs font-bold text-slate-500">Kandidat</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% peningkatan</span>
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              34 Perlu Review Cepat
            </span>
          </div>
        </div>

        {/* Card 3: LOWONGAN PENDING APPROVAL */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lowongan Pending Approval
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">3</span>
              <span className="text-xs font-bold text-slate-500">Pengajuan</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Estimasi verifikasi 1×24 jam
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Menunggu Verifikasi Admin
            </span>
          </div>
        </div>
      </div>

      {/* Chart: Jumlah Pelamar per Lowongan */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Jumlah Pelamar per Lowongan
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              5 lowongan teratas dengan akumulasi lamaran kandidat tertinggi
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded bg-blue-600" />
            <span>Kandidat Terdaftar (Top 5)</span>
          </div>
        </div>

        {/* Custom Bar Visualization */}
        <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-slate-100 dark:border-slate-800">
          {chartData.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.count}
              </span>
              <div
                style={{ height: `${bar.heightPercent}%` }}
                className="w-full max-w-[56px] bg-blue-600 hover:bg-blue-500 rounded-t-xl transition-all duration-300 shadow-md shadow-blue-600/20"
              />
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-3 text-center truncate max-w-[80px]">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section: Lowongan Terbaru & Status Pelamar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Lowongan Terbaru & Status Pelamar
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar publikasi posisi terkini beserta status verifikasi dan akumulasi kandidat
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToJobs}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Lowongan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Judul Posisi</th>
                <th className="py-3 px-3">Departemen / Kategori</th>
                <th className="py-3 px-3">Tanggal Tayang</th>
                <th className="py-3 px-3">Total Pelamar</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Senior Fullstack Developer</div>
                  <span className="text-[10px] font-mono text-slate-400">ID: LOW-2024-001</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">IT & Software</td>
                <td className="py-3.5 px-3 text-slate-500">12 Okt 2024</td>
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">248 Pelamar</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Lihat Pelamar
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Lead Product Designer</div>
                  <span className="text-[10px] font-mono text-slate-400">ID: LOW-2024-004</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">Design & Creative</td>
                <td className="py-3.5 px-3 text-slate-500">15 Okt 2024</td>
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">192 Pelamar</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Lihat Pelamar
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Enterprise Sales Specialist</div>
                  <span className="text-[10px] font-mono text-slate-400">ID: LOW-2024-008</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">Business & Sales</td>
                <td className="py-3.5 px-3 text-slate-500">22 Okt 2024</td>
                <td className="py-3.5 px-3 text-slate-400">0 Pelamar</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Pending
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-semibold">
                    Menunggu Review
                  </span>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Senior Cloud DevOps</div>
                  <div className="text-[10px] text-rose-500 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>Catatan: Gaji tidak memenuhi standar UMR/SOP</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">Cloud Infrastructure</td>
                <td className="py-3.5 px-3 text-slate-500">20 Okt 2024</td>
                <td className="py-3.5 px-3 text-slate-400">0 Pelamar</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Ditolak
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={onOpenCreateJob}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-bold cursor-pointer"
                  >
                    Perbaiki
                  </button>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white">Marketing Growth Lead</div>
                  <span className="text-[10px] font-mono text-slate-400">ID: LOW-2024-009</span>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">Marketing</td>
                <td className="py-3.5 px-3 text-slate-500">18 Okt 2024</td>
                <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">86 Pelamar</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Lihat Pelamar
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToJobs}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Kelola
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Tips Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <strong>Tips Rekrutmen:</strong> Lengkapi profil perusahaan dan sertifikasi legal untuk mempercepat approval lowongan hingga 2x lebih cepat.
          </span>
        </div>
        <a
          href="#"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          Pelajari Selengkapnya &gt;
        </a>
      </div>
    </div>
  );
}

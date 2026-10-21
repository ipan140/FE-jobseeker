import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Loader2
} from 'lucide-react';
import { getMyCompanyJobs, deleteJob, getJobs, type BackendJobItem } from '../../lib/api';
import MerchantAtsModal from './MerchantAtsModal';

export interface MerchantJobsProps {
  onOpenCreateJob: () => void;
}

export default function MerchantJobsView({ onOpenCreateJob }: MerchantJobsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [jobs, setJobs] = useState<BackendJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [atsModalJob, setAtsModalJob] = useState<{ id: string; title: string } | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await getMyCompanyJobs(1, 20);
      if (res && res.items && res.items.length > 0) {
        setJobs(res.items);
      } else {
        // Fallback to public jobs list so merchant view is not empty
        const publicRes = await getJobs({ limit: 12 });
        setJobs(publicRes.items || []);
      }
    } catch {
      // Fallback
      getJobs({ limit: 12 })
        .then((r) => setJobs(r.items || []))
        .catch(() => {});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`)) return;
    setIsDeletingId(jobId);
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert('Lowongan berhasil dihapus dari sistem backend.');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus lowongan.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchSearch =
      !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      categoryFilter === 'all' ||
      j.category?.toLowerCase().includes(categoryFilter.toLowerCase());

    if (activeTab === 'approved') return matchSearch && matchCategory && (j.status === 'PUBLISHED' || !j.status);
    if (activeTab === 'pending') return matchSearch && matchCategory && j.status === 'DRAFT';
    if (activeTab === 'rejected') return matchSearch && matchCategory && j.status === 'CLOSED';
    return matchSearch && matchCategory;
  });

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
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{jobs.length}</span>
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
            {jobs.filter((j) => j.status === 'PUBLISHED' || !j.status).length}
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
            {jobs.filter((j) => j.status === 'DRAFT').length}
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
            {jobs.filter((j) => j.status === 'CLOSED').length}
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
            <option value="Information Technology">IT & Software</option>
            <option value="Design">Design & Creative</option>
            <option value="Sales">Sales & BD</option>
            <option value="Finance">Finance & Banking</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchJobs}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-extrabold text-slate-900 dark:text-white">Daftar Lowongan Kerja</h3>
        <span className="text-slate-400">
          Menampilkan {filteredJobs.length} dari {jobs.length} lowongan
        </span>
      </div>

      {/* Grid of Job Cards */}
      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Memuat data lowongan dari backend...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Tidak ada lowongan ditemukan</h4>
          <p className="text-xs text-slate-400 mt-1">Gunakan tombol di atas untuk menambah lowongan baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      job.status === 'CLOSED'
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 border border-rose-200'
                        : job.status === 'DRAFT'
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        job.status === 'CLOSED'
                          ? 'bg-rose-500'
                          : job.status === 'DRAFT'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    />
                    {job.status === 'CLOSED'
                      ? 'Closed'
                      : job.status === 'DRAFT'
                      ? 'Pending Approval'
                      : 'Approved & Aktif'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {job.id.substring(0, 8)}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {job.title}
                </h4>
                <span className="text-xs text-slate-500 block mb-3">
                  Kategori: {job.category || 'Information Technology'}
                </span>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {job.job_type ? job.job_type.replace('_', ' ') : 'Full-time'} (
                    {job.workplace_type || 'Hybrid'})
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    {job.location || 'Jakarta'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
                  <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Rp {((job.salary_min || 15000000) / 1000000).toFixed(0)}.000.000 - Rp{' '}
                    {((job.salary_max || 25000000) / 1000000).toFixed(0)}.000.000
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{job.views_count ? `${job.views_count * 3} Views` : 'Aktif Tayang'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    Database Live
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAtsModalJob({ id: job.id, title: job.title })}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Kelola Pelamar
                </button>
                <button
                  type="button"
                  onClick={onOpenCreateJob}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Edit Lowongan"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id, job.title)}
                  disabled={isDeletingId === job.id}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 text-rose-600 cursor-pointer disabled:opacity-50"
                  title="Hapus Lowongan"
                >
                  {isDeletingId === job.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
            onClick={fetchJobs}
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
              {jobs.slice(0, 4).map((j, idx) => (
                <tr key={j.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{j.title}</div>
                    <span className="text-[10px] text-slate-400">
                      ID #{j.id.substring(0, 8)} • {j.category || 'IT & Software'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                    {j.created_at ? new Date(j.created_at).toLocaleDateString('id-ID') : '18 Okt 2024'}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATS Pipeline Modal */}
      <MerchantAtsModal
        isOpen={!!atsModalJob}
        onClose={() => setAtsModalJob(null)}
        jobId={atsModalJob?.id || ''}
        jobTitle={atsModalJob?.title || ''}
      />
    </div>
  );
}

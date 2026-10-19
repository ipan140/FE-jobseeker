import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Filter,
  Bookmark,
  Send,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  Plus
} from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import Navbar from './dashboard/Navbar';
import Footer from './dashboard/Footer';
import {
  getJobs,
  applyJob,
  toggleBookmarkJob,
  type BackendJobItem,
  type BackendPaginationMeta
} from '../lib/api';

export default function JobsExplorer() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [jobs, setJobs] = useState<BackendJobItem[]>([]);
  const [meta, setMeta] = useState<BackendPaginationMeta>({
    total_items: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 9,
    has_next_page: false,
    has_prev_page: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [workplaceType, setWorkplaceType] = useState('');
  const [page, setPage] = useState(1);

  // Apply Modal
  const [selectedJob, setSelectedJob] = useState<BackendJobItem | null>(null);
  const [expectedSalary, setExpectedSalary] = useState('20000000');
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await getJobs({
        page,
        limit: 9,
        search: search || undefined,
        category: category || undefined,
        location: location || undefined,
        workplace_type: workplaceType || undefined,
      });
      setJobs(res.items);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, category, workplaceType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsApplying(true);
    setApplyFeedback(null);
    try {
      const res = await applyJob(selectedJob.id, {
        expected_salary: parseInt(expectedSalary) || undefined,
        cover_letter: coverLetter || 'Saya sangat tertarik dengan kesempatan karir ini.',
      });
      setApplyFeedback({
        type: 'success',
        message: `Lamaran berhasil terkirim ke ${selectedJob.company_name}! ID: APP-${res.id.slice(0, 5).toUpperCase()}`,
      });
      setTimeout(() => {
        setSelectedJob(null);
        setApplyFeedback(null);
      }, 2000);
    } catch (err: any) {
      setApplyFeedback({
        type: 'error',
        message: err.message || 'Gagal mengirim lamaran. Pastikan Anda telah masuk sebagai Pencari Kerja.',
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleBookmark = async (id: string) => {
    try {
      const res = await toggleBookmarkJob(id);
      alert(res.message || 'Status bookmark lowongan berhasil diperbarui!');
    } catch (err: any) {
      alert(err.message || 'Harap login untuk menyimpan lowongan.');
    }
  };

  const formatRupiah = (val?: number) => {
    if (!val) return 'Gaji Dirahasiakan';
    return `Rp ${(val / 1000000).toFixed(0)}.000.000`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activePath="/jobs"
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-[72px]' : 'pl-64'
        }`}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title="Direktori Lowongan Kerja"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Header Banner & Search Box */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Temukan Karir Impian Anda
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-xl">
              Jelajahi lowongan terverifikasi dari ratusan perusahaan teknologi dan enterprise di Indonesia.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari posisi kerja, skill (Python, React, DevOps)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-white text-slate-900 focus:outline-none shadow-md placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-slate-950 hover:bg-slate-900 text-white shadow-md transition-all cursor-pointer"
              >
                Cari Lowongan
              </button>
            </form>
          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#151f32] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">Semua Kategori</option>
                <option value="Information Technology">Information Technology</option>
                <option value="UI/UX & Creative Design">UI/UX & Design</option>
                <option value="Product Management">Product Management</option>
                <option value="Data & Analytics">Data & Analytics</option>
              </select>

              <select
                value={workplaceType}
                onChange={(e) => {
                  setWorkplaceType(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">Semua Model Kerja</option>
                <option value="remote">Remote (WFH)</option>
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-Site</option>
              </select>
            </div>

            <span className="text-slate-400 font-medium text-[11px]">
              Menampilkan {jobs.length} dari {meta.total_items} lowongan di database
            </span>
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-xs">Memuat daftar lowongan pekerjaan dari backend...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white dark:bg-[#151f32] p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Tidak ada lowongan yang sesuai
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Coba sesuaikan kata kunci atau bersihkan filter pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-[#151f32] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Company & Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {job.company_name}
                          </p>
                          <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {job.title}
                          </h2>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBookmark(job.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Simpan Lowongan"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Location & Salary */}
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 my-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{formatRupiah(job.salary_min)} - {formatRupiah(job.salary_max)}</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 my-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-800/40 capitalize">
                        {job.workplace_type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                        {job.job_type.replace('_', ' ')}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                        {job.experience_level.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Skills pills */}
                    {job.skills_required && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-4">
                        Keahlian: {job.skills_required}
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      ID: JOB-{job.id.slice(0, 5).toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Lamar Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={!meta.has_prev_page}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-500">
                Halaman {meta.current_page} dari {meta.total_pages}
              </span>
              <button
                type="button"
                disabled={!meta.has_next_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Quick Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#182234] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kirimkan Lamaran Pekerjaan
              </h3>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedJob.title}
              </h4>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                {selectedJob.company_name} — {selectedJob.location}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                Tawaran Gaji: {formatRupiah(selectedJob.salary_min)} - {formatRupiah(selectedJob.salary_max)}
              </p>
            </div>

            {applyFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  applyFeedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{applyFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ekspektasi Gaji Bulanan (IDR) *
                </label>
                <input
                  type="number"
                  required
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Letter / Pesan untuk HR Recruiter
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Ceritakan pengalaman dan kontribusi terbaik yang dapat Anda berikan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-4 py-2 font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirimkan...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Kirimkan Lamaran ke BE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

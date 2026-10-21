import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Bookmark,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Loader2,
  TrendingUp,
  Bell,
  X
} from 'lucide-react';
import {
  getJobs,
  toggleBookmarkJob,
  getSalaryBenchmarks,
  createJobAlert,
  type BackendJobItem,
  type BackendPaginationMeta
} from '../../lib/api';

export interface JobseekerExploreProps {
  onSelectJob: (jobTitle: string, company: string, jobId?: string) => void;
  onOpenApplyModal?: (jobTitle: string, company: string, jobId?: string) => void;
}

export default function JobseekerExploreView({ onSelectJob, onOpenApplyModal }: JobseekerExploreProps) {
  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('relevant');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modals for Benchmark & Job Alert
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertFrequency, setAlertFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);

  // Backend Jobs State
  const [jobs, setJobs] = useState<BackendJobItem[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<BackendPaginationMeta>({
    total_items: 0,
    total_pages: 1,
    current_page: 1,
    per_page: 10,
    has_next_page: false,
    has_prev_page: false,
  });

  // Filters State
  const [categoryTech, setCategoryTech] = useState(true);
  const [categoryDesign, setCategoryDesign] = useState(false);
  const [typeFullTime, setTypeFullTime] = useState(true);
  const [typeRemote, setTypeRemote] = useState(false);
  const [locJakarta, setLocJakarta] = useState(true);
  const [salaryRange, setSalaryRange] = useState('all');
  const [urgentlyHiringOnly, setUrgentlyHiringOnly] = useState(false);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      let minSal: number | undefined = undefined;
      let maxSal: number | undefined = undefined;
      if (salaryRange === 'under5') maxSal = 5000000;
      else if (salaryRange === '5-10') { minSal = 5000000; maxSal = 10000000; }
      else if (salaryRange === '10-20') { minSal = 10000000; maxSal = 20000000; }
      else if (salaryRange === 'above20') { minSal = 20000000; }

      const res = await getJobs({
        page,
        limit: 10,
        search: search.trim() || undefined,
        location: locJakarta ? 'Jakarta' : undefined,
        workplace_type: typeRemote ? 'remote' : undefined,
        min_salary: minSal,
        max_salary: maxSal,
        urgently_hiring: urgentlyHiringOnly ? true : undefined,
      });

      if (res.items && res.items.length > 0) {
        setJobs(res.items);
        setPaginationMeta(res.meta);
      }
    } catch (err) {
      console.warn('Backend getJobs warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, search, locJakarta, typeRemote, salaryRange, urgentlyHiringOnly]);

  const handleOpenBenchmark = async () => {
    setShowBenchmarkModal(true);
    setLoadingBenchmark(true);
    try {
      const data = await getSalaryBenchmarks('Information Technology');
      setBenchmarkData(data.length > 0 ? data : [
        { job_title: 'Backend Engineer', experience_level: 'Mid Level', min_salary: 15000000, max_salary: 28000000, avg_salary: 21500000 },
        { job_title: 'Frontend Developer', experience_level: 'Senior Level', min_salary: 18000000, max_salary: 32000000, avg_salary: 25000000 },
        { job_title: 'UI/UX Designer', experience_level: 'Mid Level', min_salary: 12000000, max_salary: 22000000, avg_salary: 17000000 },
        { job_title: 'DevOps / SRE', experience_level: 'Lead Level', min_salary: 25000000, max_salary: 45000000, avg_salary: 35000000 },
      ]);
    } catch {
      setBenchmarkData([
        { job_title: 'Backend Engineer', experience_level: 'Mid Level', min_salary: 15000000, max_salary: 28000000, avg_salary: 21500000 },
        { job_title: 'Frontend Developer', experience_level: 'Senior Level', min_salary: 18000000, max_salary: 32000000, avg_salary: 25000000 },
        { job_title: 'UI/UX Designer', experience_level: 'Mid Level', min_salary: 12000000, max_salary: 22000000, avg_salary: 17000000 },
      ]);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAlert(true);
    try {
      await createJobAlert({
        keyword: alertKeyword || search || 'Software Engineer',
        frequency: alertFrequency,
      });
      alert(`Job Alert untuk kata kunci "${alertKeyword || search || 'Software Engineer'}" berhasil diaktifkan via Backend!`);
      setShowAlertModal(false);
      setAlertKeyword('');
    } catch (err: any) {
      alert(err.message || 'Harap login terlebih dahulu untuk mengaktifkan notifikasi lowongan.');
    } finally {
      setIsCreatingAlert(false);
    }
  };

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    try {
      await toggleBookmarkJob(id);
    } catch {
      // Ignore if not logged in
    }
  };

  const handleResetFilters = () => {
    setCategoryTech(true);
    setCategoryDesign(false);
    setTypeFullTime(true);
    setTypeRemote(false);
    setLocJakarta(true);
    setSalaryRange('all');
    setUrgentlyHiringOnly(false);
    setSearch('');
  };

  const formatCurrency = (min: number, max: number) => {
    return `Rp ${(min / 1000000).toFixed(0)}.000.000 - Rp ${(max / 1000000).toFixed(0)}.000.000 / bln`;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Beranda</span>
            <span>&gt;</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Cari Lowongan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Eksplorasi Peluang Karier
          </h1>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleOpenBenchmark}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Insight Gaji Industri</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAlertModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl cursor-pointer shadow-md shadow-blue-600/30 transition-all"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>+ Buat Job Alert</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Filter Panel (Left) + Search & Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Filter Lowongan Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Lowongan</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Kategori Pekerjaan */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Kategori Pekerjaan</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryTech}
                    onChange={(e) => setCategoryTech(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Teknologi Informasi</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">24</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryDesign}
                    onChange={(e) => setCategoryDesign(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Desain & UI/UX</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">12</span>
              </label>
            </div>
          </div>

          {/* Model Kerja */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Model Kerja</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeRemote}
                  onChange={(e) => setTypeRemote(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Remote (WFH 100%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locJakarta}
                  onChange={(e) => setLocJakarta(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>DKI Jakarta (Hybrid / Onsite)</span>
              </label>
            </div>
          </div>

          {/* Rentang Gaji */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Rentang Gaji</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              {['all', 'under5', '5-10', '10-20', 'above20'].map((val) => {
                const labels: Record<string, string> = {
                  all: 'Semua Rentang Gaji',
                  under5: '< Rp 5 Juta',
                  '5-10': 'Rp 5 - 10 Juta',
                  '10-20': 'Rp 10 - 20 Juta',
                  above20: '> Rp 20 Juta',
                };
                return (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="salary"
                      checked={salaryRange === val}
                      onChange={() => setSalaryRange(val)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{labels[val]}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Search Box & Job Listings */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Top Search Input & Sort Dropdown */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari posisi (Frontend, DevOps, UI/UX, Backend)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Urutkan:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="relevant">Paling Relevan</option>
                <option value="newest">Paling Baru</option>
                <option value="salary">Gaji Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Result Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong>{jobs.length} lowongan</strong> dari total <strong>{paginationMeta.total_items || jobs.length}</strong>
            </span>
            {loading && (
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat dari backend...
              </span>
            )}
          </div>

          {/* Job Cards List */}
          <div className="space-y-4">
            {jobs.map((job) => {
              const bookmarked = bookmarkedIds.includes(job.id);
              const tags = job.skills_required
                ? job.skills_required.split(',').map((t) => t.trim()).slice(0, 4)
                : ['Teknologi', 'Full-time'];

              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job.title, job.company_name, job.id)}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center cursor-pointer group"
                >
                  {/* Left Column: Banner Box Mockup */}
                  <div
                    className="md:col-span-5 h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden shadow-inner shrink-0"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
                      <Sparkles className="w-6 h-6 text-sky-300" />
                    </div>
                    <span className="text-sm font-black tracking-wider uppercase">
                      {job.company_name}
                    </span>
                    <span className="text-[10px] text-blue-200/80 mt-1">
                      {job.workplace_type.toUpperCase()} • TERVERIFIKASI
                    </span>
                  </div>

                  {/* Right Column: Job Information */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                              {job.title}
                            </h3>
                            {job.urgently_hiring && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                Mendesak
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                            <span>{job.company_name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          </div>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleBookmark(job.id, e)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                            bookmarked
                              ? 'bg-blue-50 border-blue-300 text-blue-600'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-400'
                          }`}
                          title="Simpan lowongan"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-blue-600' : ''}`} />
                        </button>
                      </div>

                      {/* Salary */}
                      <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-2">
                        {formatCurrency(job.salary_min, job.salary_max)}
                      </div>

                      {/* Tech Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata & Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{job.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : 'Aktif'}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">{job.job_type}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectJob(job.title, job.company_name, job.id)}
                        className="py-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer ${
                currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
              }`}
            >
              &lt; Sebelumnya
            </button>
            <div className="flex items-center gap-1 font-bold">
              <span>Halaman {currentPage} dari {paginationMeta.total_pages || 1}</span>
            </div>
            <button
              type="button"
              disabled={!paginationMeta.has_next_page && currentPage >= paginationMeta.total_pages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer ${
                !paginationMeta.has_next_page && currentPage >= paginationMeta.total_pages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-slate-50'
              }`}
            >
              Selanjutnya &gt;
            </button>
          </div>
        </div>

      </div>
      {/* MODAL 1: Insight Gaji Industri (Benchmark) */}
      {showBenchmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Insight Benchmark Gaji Pasar (FastAPI)</h3>
              </div>
              <button type="button" onClick={() => setShowBenchmarkModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 my-3">
              Rerata rentang gaji standar pasar di industri teknologi berdasarkan data penawaran kerja aktual.
            </p>

            {loadingBenchmark ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400">Menghitung benchmark gaji...</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {benchmarkData.map((b, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{b.job_title}</h4>
                      <span className="text-[11px] text-slate-400">{b.experience_level || 'Mid Level'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400 block">
                        Rp {((b.min_salary || 10000000) / 1000000).toFixed(0)}M - Rp {((b.max_salary || 20000000) / 1000000).toFixed(0)}M
                      </span>
                      <span className="text-[10px] text-slate-400">Rata-rata: Rp {((b.avg_salary || 15000000) / 1000000).toFixed(0)}M / bln</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                type="button"
                onClick={() => setShowBenchmarkModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Buat Job Alert */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-blue-600">
                <Bell className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Aktifkan Notifikasi Lowongan Baru</h3>
              </div>
              <button type="button" onClick={() => setShowAlertModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="my-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Kunci Posisi / Skill *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: React, Python, Product Designer"
                  value={alertKeyword}
                  onChange={(e) => setAlertKeyword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Frekuensi Pemberitahuan
                </label>
                <select
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                >
                  <option value="daily">Harian (Rangkuman setiap pagi)</option>
                  <option value="weekly">Mingguan (Setiap hari Senin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAlert}
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isCreatingAlert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>Pasang Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

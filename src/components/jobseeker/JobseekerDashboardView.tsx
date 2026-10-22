import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Send,
  Calendar,
  Award,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Building2,
  Zap,
  Sparkles
} from 'lucide-react';
import {
  getJobs,
  getMyApplications,
  toggleBookmarkJob,
  type BackendJobItem,
  type BackendApplicationItem
} from '../../lib/api';
import SkillAssessmentModal from './SkillAssessmentModal';

export interface JobseekerDashboardProps {
  onSelectJob: (jobTitle: string, company: string, jobId?: string) => void;
  onOpenApplyModal: (jobTitle: string, company: string, jobId?: string) => void;
  onNavigateToExplore: (searchKeyword?: string) => void;
  onNavigateToApplications?: () => void;
  onNavigateToProfile?: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  onOpenAuthModal?: () => void;
}

export default function JobseekerDashboardView({
  onSelectJob,
  onOpenApplyModal,
  onNavigateToExplore,
  onNavigateToApplications,
  onNavigateToProfile,
  isAuthenticated = false,
  userName = 'Budi Santoso',
  onOpenAuthModal,
}: JobseekerDashboardProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Semua Lokasi');
  const [selectedWorkType, setSelectedWorkType] = useState('Semua Tipe');
  const [recommendationFilter, setRecommendationFilter] = useState<'all' | 'interest' | 'salary'>('all');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [backendJobs, setBackendJobs] = useState<BackendJobItem[]>([]);
  const [applicationsCount, setApplicationsCount] = useState<number>(0);
  const [interviewCount, setInterviewCount] = useState<number>(0);
  const [offeredCount, setOfferedCount] = useState<number>(0);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getJobs({ page: 1, limit: 20 })
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setBackendJobs(res.items);
        }
      })
      .catch(() => {});

    if (isAuthenticated) {
      getMyApplications(1, 20)
        .then((res) => {
          if (res.items && res.items.length > 0) {
            setApplicationsCount(res.items.length);
            const interviews = res.items.filter((a) => a.status === 'interview').length;
            setInterviewCount(interviews);
            const offered = res.items.filter((a) => a.status === 'offered' || a.status === 'hired').length;
            setOfferedCount(offered);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const recommendationJobs = React.useMemo(() => {
    if (!backendJobs || backendJobs.length === 0) return [];
    let list = [...backendJobs];
    if (recommendationFilter === 'salary') {
      list.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (recommendationFilter === 'interest') {
      list.sort((a, b) => (b.urgently_hiring ? 1 : 0) - (a.urgently_hiring ? 1 : 0));
    }
    return list.slice(0, 3);
  }, [backendJobs, recommendationFilter]);

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    try {
      await toggleBookmarkJob(id);
    } catch {
      // Ignore if not logged in
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Search Header (Matching Image 1) */}
      <div className="space-y-4">
        {/* Verification Pill / Status */}
        {isAuthenticated ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Akun Terverifikasi • Siap Kerja Aktif</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Eksplorasi Karir Terbuka • Transparansi Gaji 100%</span>
          </div>
        )}

        {/* Big Headline */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAuthenticated ? (
              <>
                Halo, {userName}!{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  Temukan Karir Impianmu Hari Ini
                </span>
              </>
            ) : (
              <>
                Jelajahi Lowongan &{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  Temukan Karir Impianmu
                </span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Jelajahi ribuan peluang karir terpilih dari perusahaan terkemuka di Indonesia dan global dengan transparansi gaji serta proses yang terjamin.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            {/* Search Button / Icon */}
            <button
              type="button"
              onClick={() => onNavigateToExplore(searchKeyword)}
              className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Cari Lowongan</span>
            </button>

            {/* Keyword Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigateToExplore(searchKeyword);
                }}
                placeholder="Posisi, skill, atau kata kunci..."
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative md:w-56 shrink-0">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="Semua Lokasi">Semua Lokasi</option>
                <option value="Jakarta Selatan">Jakarta Selatan</option>
                <option value="Tangerang / BSD">Tangerang / BSD</option>
                <option value="Bandung">Bandung</option>
              </select>
            </div>

            {/* Work Type Dropdown */}
            <div className="relative md:w-44 shrink-0">
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="Semua Tipe">Semua Tipe</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Kontrak</option>
                <option value="internship">Magang</option>
              </select>
            </div>
          </div>

          {/* Popular Search Keywords */}
          <div className="flex flex-wrap items-center gap-2 pt-3 px-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> POPULER:
            </span>
            {['Frontend', 'Data Scientist', 'UI/UX', 'Mobile', 'QA Engineer', 'Security'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchKeyword(tag);
                    onNavigateToExplore(tag);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 3 Metrics Cards (Conditional: Personal Metrics if Authenticated, Platform Highlights if Guest) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isAuthenticated ? (
          <>
            {/* Card 1: Lamaran Terkirim */}
            <div
              onClick={onNavigateToApplications}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="Lihat Lamaran Saya"
            >
              <div>
                <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Lamaran Terkirim</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{applicationsCount}</span>
                  <span className="text-[11px] text-emerald-600 font-bold">+1 minggu ini</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Panggilan Wawancara */}
            <div
              onClick={onNavigateToApplications}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="Lihat Jadwal Wawancara"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Panggilan Wawancara</span>
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{interviewCount}</span>
                  <span className="text-[11px] text-blue-600 font-bold">Jadwal: Besok, 14:00</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Tawaran Kerja */}
            <div
              onClick={onNavigateToApplications}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="Lihat Tawaran Kerja"
            >
              <div>
                <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Tawaran Kerja</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{offeredCount}</span>
                  <span className="text-[11px] text-slate-400">Menunggu keputusan</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Guest Highlight 1: Lowongan Aktif */}
            <div
              onClick={onNavigateToExplore}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="Jelajahi Lowongan"
            >
              <div>
                <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Peluang Karir Aktif</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">2.500+</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Terverifikasi</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            {/* Guest Highlight 2: Perusahaan Mitra */}
            <div
              onClick={onNavigateToExplore}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="Perusahaan Mitra"
            >
              <div>
                <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Perusahaan Mitra</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">1.200+</span>
                  <span className="text-[11px] text-blue-600 font-bold">Startup & BUMN</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Guest Highlight 3: Bebas Biaya */}
            <div
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal();
                else window.location.href = '/login';
              }}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
              title="100% Gratis untuk Pelamar"
            >
              <div>
                <span className="text-xs text-slate-500 font-semibold block group-hover:text-blue-600 transition-colors">Bebas Biaya 100%</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">Gratis</span>
                  <span className="text-[11px] text-emerald-600 font-bold">Untuk Pencari Kerja</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Section: Rekomendasi Lowongan untukmu */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Rekomendasi Lowongan untukmu
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Berdasarkan preferensi profil dan riwayat pencarianmu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRecommendationFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  recommendationFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setRecommendationFilter('interest')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  recommendationFilter === 'interest'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Sesuai Minat
              </button>
              <button
                type="button"
                onClick={() => setRecommendationFilter('salary')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  recommendationFilter === 'salary'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Gaji Tertinggi
              </button>
            </div>

            <button
              type="button"
              onClick={onNavigateToExplore}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic 3 Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendationJobs.length > 0 ? (
            recommendationJobs.map((job) => {
              const skills = job.skills_required
                ? job.skills_required.split(',').map((s) => s.trim()).slice(0, 3)
                : ['Full-time', 'Modern Stack'];
              const isBookmarked = bookmarkedJobs.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job.title, job.company_name, job.id)}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {job.company_name.substring(0, 2).toUpperCase()}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(job.id, e)}
                        className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer transition-colors"
                        title="Simpan lowongan"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      {job.urgently_hiring && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
                          Mendesak
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                      <span className="truncate">{job.company_name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                      <span>{job.location} • {job.workplace_type}</span>
                      <span>•</span>
                      <span className="capitalize">{job.job_type}</span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji Bulanan</span>
                      <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                        Rp {job.salary_min.toLocaleString('id-ID')} - Rp {job.salary_max.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : 'Aktif'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job.title, job.company_name, job.id);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center text-slate-400 text-xs">
              Memuat rekomendasi lowongan dari backend...
            </div>
          )}
        </div>
      </div>

      {/* Section: Lowongan Terbaru (Matching Image 1) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Lowongan Terbaru
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Peluang kerja yang baru saja dipublikasikan oleh mitra CareerFlow
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToExplore}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Lowongan Terbaru</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List Rows */}
        <div className="space-y-3">
          {backendJobs.length > 0 ? (
            backendJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {job.company_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {job.urgently_hiring && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                          Mendesak
                        </span>
                      )}
                      <h4
                        onClick={() => onSelectJob(job.title, job.company_name, job.id)}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                      >
                        {job.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company_name}</span>
                      <span>•</span>
                      <span>{job.location} ({job.workplace_type})</span>
                      <span>•</span>
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">
                        Rp {job.salary_min.toLocaleString('id-ID')} - Rp {job.salary_max.toLocaleString('id-ID')} / bln
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills_required?.split(',').slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(job.id, e)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-400 cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedJobs.includes(job.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenApplyModal(job.title, job.company_name, job.id)}
                    className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Lamar Cepat</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
              Belum ada lowongan terbaru saat ini. Silakan periksa kembali nanti.
            </div>
          )}
        </div>
      </div>

      {/* Uji Kompetensi & Sertifikasi Skill Banner (FastAPI Powered) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-400/30">
                Lencana Sertifikasi Terstandarisasi
              </span>
              <span className="text-[11px] text-blue-200">FastAPI Verified Quiz</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              Tingkatkan Peluang Diterima Kerja dengan Tes Sertifikasi Skill! 🏆
            </h3>
            <p className="text-xs text-blue-100/80 mt-0.5">
              Ikuti tes kompetensi teknis Python/FastAPI, UI/UX Design, dan System Design. Lencana otomatis terpasang di profil Anda.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAssessmentModalOpen(true)}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer hover:scale-105"
        >
          <Award className="w-4 h-4" />
          <span>Ikuti Tes Keahlian</span>
        </button>
      </div>

      {/* Footer (Matching Image 1) */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm tracking-tight">
            CareerFlow
          </span>
          <span>© 2025 CareerFlow. Hak Cipta Dilindungi Undang-Undang.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <a href="#about" className="hover:text-blue-600 transition-colors">Tentang CareerFlow</a>
          <a href="#help" className="hover:text-blue-600 transition-colors">Pusat Bantuan</a>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</a>
        </div>
      </footer>

      {/* Skill Assessment Modal */}
      <SkillAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        isAuthenticated={isAuthenticated}
        onOpenAuthModal={onOpenAuthModal}
      />
    </div>
  );
}

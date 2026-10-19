import React, { useState } from 'react';
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
  Zap,
  Sparkles,
  PawPrint
} from 'lucide-react';

export interface JobseekerDashboardProps {
  onSelectJob: (jobTitle: string, company: string) => void;
  onOpenApplyModal: (jobTitle: string, company: string) => void;
  onNavigateToExplore: () => void;
  onNavigateToZen: () => void;
}

export default function JobseekerDashboardView({
  onSelectJob,
  onOpenApplyModal,
  onNavigateToExplore,
  onNavigateToZen,
}: JobseekerDashboardProps) {
  const [searchKeyword, setSearchKeyword] = useState('Frontend Developer');
  const [selectedLocation, setSelectedLocation] = useState('Jakarta (Jabodetabek)');
  const [selectedWorkType, setSelectedWorkType] = useState('Full-time');
  const [recommendationFilter, setRecommendationFilter] = useState<'all' | 'interest' | 'salary'>('all');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(['1']);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedJobs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Search Header (Matching Image 1) */}
      <div className="space-y-4">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Akun Terverifikasi • Siap Kerja Aktif</span>
        </div>

        {/* Big Headline */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Halo, Budi Santoso!{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Temukan Karir Impianmu Hari Ini
            </span>
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
              onClick={onNavigateToExplore}
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
                <option value="Jakarta (Jabodetabek)">Jakarta (Jabodetabek)</option>
                <option value="Bandung">Bandung</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Remote / WFH">Remote / WFH</option>
              </select>
            </div>

            {/* Work Type Dropdown */}
            <div className="relative md:w-44 shrink-0">
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-medium text-slate-700 dark:text-slate-300"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Magang">Magang</option>
              </select>
            </div>
          </div>

          {/* Popular Search Keywords */}
          <div className="flex flex-wrap items-center gap-2 pt-3 px-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> POPULER:
            </span>
            {['Frontend Developer', 'Product Designer', 'Data Analyst', 'Remote', 'Fresh Graduate'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchKeyword(tag)}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* 3 Applicant Metrics Cards (Matching Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Lamaran Terkirim */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Lamaran Terkirim</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">4</span>
              <span className="text-[11px] text-emerald-600 font-bold">+1 minggu ini</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-xs">
            <Send className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Panggilan Wawancara */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold block">Panggilan Wawancara</span>
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">1</span>
              <span className="text-[11px] text-blue-600 font-bold">Jadwal: Besok, 14:00</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Tawaran Kerja */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Tawaran Kerja</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">0</span>
              <span className="text-[11px] text-slate-400">Menunggu keputusan</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5" />
          </div>
        </div>
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

        {/* 3 Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Senior Frontend Engineer */}
          <div
            onClick={() => onSelectJob('Senior Frontend Engineer (React/Next.js)', 'PT Solusi Teknologi Nusantara')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  ST
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleBookmark('1', e)}
                  className="text-slate-400 hover:text-blue-600 p-1"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarkedJobs.includes('1') ? 'fill-blue-600 text-blue-600' : ''}`}
                  />
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Senior Frontend...
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                <span>PT Solusi Teknologi Nusantara</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                <span>Jakarta • Hybrid</span>
                <span>•</span>
                <span>Full-time</span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji Bulanan</span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  Rp 18.000.000 - Rp 25.000.000
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  React.js
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  TypeScript
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Tailwind CSS
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Tayang 2 jam yang lalu
              </span>
              <button
                type="button"
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          {/* Card 2: UI/UX Product Designer */}
          <div
            onClick={() => onSelectJob('UI/UX Product Designer', 'Gojek Tech Indonesia')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  GK
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleBookmark('2', e)}
                  className="text-slate-400 hover:text-blue-600 p-1"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarkedJobs.includes('2') ? 'fill-blue-600 text-blue-600' : ''}`}
                  />
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                UI/UX Product Designer
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                <span>Gojek Tech Indonesia</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                <span>Jakarta Selatan • Onsite</span>
                <span>•</span>
                <span>Full-time</span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji Bulanan</span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  Rp 15.000.000 - Rp 22.000.000
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Figma
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Design Systems
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  User Research
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Tayang 1 hari yang lalu
              </span>
              <button
                type="button"
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>
          </div>

          {/* Card 3: Senior Data Analyst */}
          <div
            onClick={() => onSelectJob('Senior Data Analyst', 'Tokopedia Digital Care')}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  TK
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleBookmark('3', e)}
                  className="text-slate-400 hover:text-blue-600 p-1"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarkedJobs.includes('3') ? 'fill-blue-600 text-blue-600' : ''}`}
                  />
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Senior Data Analyst
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                <span>Tokopedia Digital Care</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                <span>Jakarta • Full Remote</span>
                <span>•</span>
                <span>Full-time</span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 font-medium block">Rentang Gaji Bulanan</span>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  Rp 16.000.000 - Rp 23.000.000
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  SQL BigQuery
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Python
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  Tableau
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-xs">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Tayang 3 hari yang lalu
              </span>
              <button
                type="button"
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>
          </div>
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
          {/* Row 1: Bukalapak */}
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                BL
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Baru
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Frontend React & React Native Specialist
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Bukalapak Commerce</span>
                  <span>•</span>
                  <span>Bandung / Remote</span>
                  <span>•</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    Rp 14.000.000 - Rp 20.000.000 / bln
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    Asuransi Swasta & Gigi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    Flexible Hours
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    Tunjangan Laptop WFH
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-400 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenApplyModal('Frontend React & React Native Specialist', 'Bukalapak Commerce')}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Lamar Cepat</span>
              </button>
            </div>
          </div>

          {/* Row 2: Dana Sahabat Finansial */}
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                DS
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Baru
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Junior Web Developer (Next.js & Supabase)
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dana Sahabat Finansial</span>
                  <span>•</span>
                  <span>Jakarta Pusat • Onsite</span>
                  <span>•</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    Rp 9.000.000 - Rp 13.000.000 / bln
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    BPJS & Asuransi Jiwa
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    Anggaran Kursus & Sertifikasi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    Makan Siang Gratis
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-400 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenApplyModal('Junior Web Developer (Next.js & Supabase)', 'Dana Sahabat Finansial')}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Lamar Cepat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Feature: Zen Wellness Banner (Combining Image 5 seamlessly!) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center shrink-0">
            <PawPrint className="w-7 h-7 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/30 text-pink-300 border border-pink-400/30">
                Zen Wellness Corner
              </span>
              <span className="text-[11px] text-slate-400">99% Stress Free</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              Lelah dan stress saat mencari kerja? Temukan inner Zen bersama kucing kami! 🐱
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Latihan pernapasan relaksasi, afirmasi positif harian, dan ketenangan pikiran.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToZen}
          className="py-3 px-6 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Zen Corner</span>
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
    </div>
  );
}

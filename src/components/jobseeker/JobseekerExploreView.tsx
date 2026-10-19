import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

export interface JobseekerExploreProps {
  onSelectJob: (jobTitle: string, company: string) => void;
}

interface ExploreJobItem {
  id: string;
  title: string;
  isNew?: boolean;
  companyName: string;
  verified: boolean;
  location: string;
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  postedAt: string;
  deadline: string;
  logoBannerText: string;
  logoBg: string;
}

const SAMPLE_EXPLORE_JOBS: ExploreJobItem[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    isNew: true,
    companyName: 'PT Finansial Integrasi Nusantara',
    verified: true,
    location: 'Jakarta Selatan (Hybrid)',
    salaryMin: 18000000,
    salaryMax: 25000000,
    tags: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Rest API'],
    postedAt: 'Diposting 2 hari yang lalu',
    deadline: 'Deadline: 28 Nov 2025',
    logoBannerText: 'FINTEK GLOBAL',
    logoBg: 'bg-gradient-to-br from-slate-900 to-blue-950',
  },
  {
    id: '2',
    title: 'Product Manager (Growth & Core)',
    isNew: false,
    companyName: 'PT Logika Solusi Digital',
    verified: true,
    location: 'Bandung (Remote / WFH)',
    salaryMin: 16000000,
    salaryMax: 22000000,
    tags: ['Product Discovery', 'Scrum', 'Data Analytics', 'Jira'],
    postedAt: 'Diposting 3 hari yang lalu',
    deadline: 'Deadline: 05 Des 2025',
    logoBannerText: 'Cari Lowongan',
    logoBg: 'bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-800 dark:to-slate-900',
  },
  {
    id: '3',
    title: 'UI/UX Specialist & Design Lead',
    isNew: false,
    companyName: 'PT Kreatif Bangun Negeri',
    verified: true,
    location: 'Jakarta Pusat (Onsite)',
    salaryMin: 14000000,
    salaryMax: 19000000,
    tags: ['Figma', 'Design System', 'Usability Testing', 'Wireframing'],
    postedAt: 'Diposting 5 hari yang lalu',
    deadline: 'Deadline: 12 Des 2025',
    logoBannerText: 'CARI LOWONGAN',
    logoBg: 'bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900',
  },
  {
    id: '4',
    title: 'Cloud & DevOps Engineer',
    isNew: false,
    companyName: 'PT Awan Komputasi Pratama',
    verified: true,
    location: 'Surabaya (Hybrid)',
    salaryMin: 15000000,
    salaryMax: 21000000,
    tags: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
    postedAt: 'Diposting 1 minggu yang lalu',
    deadline: 'Deadline: 20 Des 2025',
    logoBannerText: 'STRATUS CORE',
    logoBg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900',
  },
];

export default function JobseekerExploreView({ onSelectJob }: JobseekerExploreProps) {
  const [search, setSearch] = useState('Frontend Engineer');
  const [selectedSort, setSelectedSort] = useState('relevant');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['3']);

  // Filters State
  const [categoryTech, setCategoryTech] = useState(true);
  const [categoryDesign, setCategoryDesign] = useState(false);
  const [typeFullTime, setTypeFullTime] = useState(true);
  const [typeRemote, setTypeRemote] = useState(true);
  const [locJakarta, setLocJakarta] = useState(true);
  const [salaryRange, setSalaryRange] = useState('10-20');
  const [expMid, setExpMid] = useState(true);
  const [expSenior, setExpSenior] = useState(true);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setCategoryTech(true);
    setCategoryDesign(false);
    setTypeFullTime(true);
    setTypeRemote(true);
    setLocJakarta(true);
    setSalaryRange('10-20');
    setExpMid(true);
    setExpSenior(true);
  };

  const formatCurrency = (min: number, max: number) => {
    return `Rp ${(min / 1000000).toLocaleString('id-ID')}.000.000 - Rp ${(max / 1000000).toLocaleString('id-ID')}.000.000 / bln`;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

        <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full w-fit">
          <CheckCircle2 className="w-4 h-4" />
          <span>Semua perusahaan telah terverifikasi resmi</span>
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
                <span className="text-[11px] font-mono text-slate-400">42</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryDesign}
                    onChange={(e) => setCategoryDesign(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Desain & Kreatif</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">18</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                  <span>Pemasaran & Sales</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">24</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                  <span>Keuangan</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">15</span>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                  <span>Operasional</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">10</span>
              </label>
            </div>
          </div>

          {/* Tipe Pekerjaan */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Tipe Pekerjaan</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeFullTime}
                  onChange={(e) => setTypeFullTime(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Full-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Part-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Kontrak</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Magang / Internship</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={typeRemote}
                  onChange={(e) => setTypeRemote(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Remote</span>
              </label>
            </div>
          </div>

          {/* Lokasi Kerja */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Lokasi Kerja</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={locJakarta}
                  onChange={(e) => setLocJakarta(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Jakarta</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Bandung</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Surabaya</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Yogyakarta</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Luar Negeri / Remote</span>
              </label>
            </div>
          </div>

          {/* Rentang Gaji */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Rentang Gaji</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              {['all', 'under5', '5-10', '10-20', 'above20'].map((val) => {
                const labels: Record<string, string> = {
                  all: 'Semua',
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

          {/* Pengalaman */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Pengalaman</h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>Fresh Graduate</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
                <span>1-3 Tahun</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expMid}
                  onChange={(e) => setExpMid(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>3-5 Tahun</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expSenior}
                  onChange={(e) => setExpSenior(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>&gt; 5 Tahun</span>
              </label>
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
                placeholder="Frontend Engineer..."
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
              Menampilkan <strong>24 lowongan</strong> ditemukan
            </span>
            <span className="text-[11px] text-slate-400">Diperbarui 5 menit yang lalu</span>
          </div>

          {/* Job Cards List (Matching Image 2 horizontal format) */}
          <div className="space-y-4">
            {SAMPLE_EXPLORE_JOBS.map((job) => {
              const bookmarked = bookmarkedIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job.title, job.companyName)}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center cursor-pointer group"
                >
                  {/* Left Column: Banner Box Mockup */}
                  <div
                    className={`md:col-span-5 h-44 rounded-2xl ${job.logoBg} flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden shadow-inner shrink-0`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2">
                      <Sparkles className="w-6 h-6 text-sky-300" />
                    </div>
                    <span className="text-sm font-black tracking-wider uppercase">
                      {job.logoBannerText}
                    </span>
                    <span className="text-[10px] text-blue-200/80 mt-1">Enterprise Partner</span>
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
                            {job.isNew && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                Baru
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold mt-1">
                            <span>{job.companyName}</span>
                            {job.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
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
                        {formatCurrency(job.salaryMin, job.salaryMax)}
                      </div>

                      {/* Tech Skill Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.tags.map((t, idx) => (
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
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>{job.postedAt}</span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {job.deadline}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectJob(job.title, job.companyName)}
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
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
            >
              &lt; Sebelumnya
            </button>
            <div className="flex items-center gap-1">
              <button type="button" className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold">
                1
              </button>
              <button type="button" className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                2
              </button>
              <button type="button" className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                3
              </button>
              <button type="button" className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                4
              </button>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
            >
              Selanjutnya &gt;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  Bookmark,
  Send,
  Building2,
  ExternalLink,
  ShieldCheck,
  Share2,
  Flag,
  Laptop,
  Heart,
  BookOpen,
  Award,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export interface JobDetailProps {
  onBack: () => void;
  onApply: () => void;
  jobTitle?: string;
  companyName?: string;
}

export default function JobseekerJobDetailView({
  onBack,
  onApply,
  jobTitle = 'Senior Frontend Engineer (React/Next.js)',
  companyName = 'PT Solusi Teknologi Nusantara',
}: JobDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-blue-600 flex items-center gap-1 cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Lowongan</span>
          </button>
          <span>/</span>
          <span>Teknologi Informasi</span>
          <span>/</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
            {jobTitle}
          </span>
        </div>
      </div>

      {/* Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            ST
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Full-time
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Mitra Terverifikasi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Clock className="w-3 h-3" /> Batas Lamaran: 30 November 2024
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {jobTitle}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              {companyName}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                Rp 18.000.000 - Rp 25.000.000 <span className="text-xs font-normal text-slate-500">/ bulan</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Jakarta Selatan (Hybrid - 3 hari WFO)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Min. 4 Tahun Pengalaman
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onApply}
            className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            <span>Lamar Sekarang</span>
          </button>
          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`py-2.5 px-6 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-950/40 dark:border-blue-700'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
            <span>{isBookmarked ? 'Tersimpan' : 'Simpan Lowongan'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Job Details) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ringkasan Posisi */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Ringkasan Posisi</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              PT Solusi Teknologi Nusantara tengah mencari seorang <strong>Senior Frontend Engineer</strong> berpengalaman tinggi untuk memperkuat divisi Core Product. Anda akan memegang peranan krusial dalam merancang arsitektur web client-side yang berdaya tahan tinggi, scalable, dan memiliki performa optimal guna melayani jutaan pengguna aktif harian di seluruh Indonesia.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Tingkat Jabatan</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                  Senior / Specialist
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Metode Kerja</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                  Hybrid Working
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Departemen</span>
                <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                  Engineering & Tech
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi Pekerjaan & Tanggung Jawab */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Deskripsi Pekerjaan & Tanggung Jawab
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Memimpin pengembangan dan arsitektur aplikasi berbasis web modern menggunakan ekosistem <strong>Next.js 14+</strong> dan <strong>React</strong> dengan prinsip clean architecture.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Berkolaborasi aktif dengan Product Manager, UI/UX Designer, dan Backend Engineer dalam menerjemahkan rancangan antarmuka Figma ke modul web interaktif berkecepatan tinggi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Menjamin web vitals terbaik (LCP, FID, CLS) serta mengimplementasikan teknik code-splitting, lazy loading, dan server-side rendering (SSR/SSG).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Meninjau pull request (code review), menegakkan best practices TypeScript, serta memberikan mentoring teknis kepada junior dan mid-level engineers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>Membangun dan memelihara modul automated testing (unit test & E2E) untuk memastikan keandalan sistem produksi tanpa degradasi performa.</span>
              </li>
            </ul>
          </div>

          {/* Kualifikasi & Persyaratan Minimum */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Kualifikasi & Persyaratan Minimum
            </h3>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Keahlian Teknis Wajib:</h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Pengalaman komersial minimal 4 tahun dalam pengembangan web production menggunakan React dan TypeScript.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Keahlian mendalam pada Next.js (App Router, Server Actions), state management (Zustand, Redux Toolkit, atau TanStack Query).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Kemampuan integrasi RESTful API dan GraphQL dengan penanganan caching & error state yang tangguh.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Familiar dengan automated testing frameworks seperti Jest, React Testing Library, atau <strong>Cypress / Playwright</strong>.</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Kualifikasi Umum & Soft Skills:</h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Gelar Sarjana (S1) di bidang Ilmu Komputer, Teknik Informatika, atau portofolio setara yang terbukti solid.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Keterampilan komunikasi verbal dan tertulis yang apik, proaktif, dan terbiasa bekerja dalam metodologi Agile/Scrum.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefit & Fasilitas Kerja */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Benefit & Fasilitas Kerja</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Jaminan Kesehatan Lengkap</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    BPJS Ketenagakerjaan, BPJS Kesehatan, dan Asuransi Swasta rawat inap/jalan keluarga.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <Laptop className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Perangkat Kerja Premium</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Pilihan MacBook Pro M3 atau Lenovo ThinkPad X1 Carbon seri terbaru beserta monitor 4K.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Budget Kursus & Sertifikasi</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Tunjangan pembelajaran tahunan Rp 12.000.000 untuk kursus, konferensi, dan ujian resmi.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">Jam Kerja Fleksibel</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Core hours berorientasi hasil dengan sistem hybrid fleksibel (3 hari WFO, 2 hari WFH).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Company & Verification) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Company Card */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                STN
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {companyName}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                  <span>★ 4.8</span>
                  <span className="text-slate-400 font-normal">(142 ulasan karyawan)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Industri:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Software & FinTech Solutions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ukuran Tim:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">250 - 500 Karyawan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Situs Web:</span>
                <a
                  href="https://solusitek.id"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>solusiteknologi.co.id</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400">Lokasi Kantor:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-right max-w-40">
                  SCBD Lot 8, Senayan, Jakarta Selatan
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Lihat Profil Perusahaan
            </button>
          </div>

          {/* Keamanan & Etika */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Keamanan & Etika</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                Bebas Biaya Rekrutmen 100%
              </span>
              <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                Proses rekrutmen ini sepenuhnya gratis tanpa pungutan tiket, akomodasi, atau tes berbayar.
              </p>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Seluruh mitra perusahaan di CareerFlow terikat regulasi resmi Kementerian Ketenagakerjaan RI (Kemnaker). Segala upaya penipuan akan ditindaklanjuti secara hukum.
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Pertanyaan HR?</span>
              <a href="#help" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Hubungi Helpdesk
              </a>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-2">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Lowongan</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Laporkan Lowongan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

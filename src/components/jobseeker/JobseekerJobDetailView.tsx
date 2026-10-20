import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { getJobDetail, trackJobClick, toggleBookmarkJob, type BackendJobItem } from '../../lib/api';

export interface JobDetailProps {
  onBack: () => void;
  onApply: () => void;
  jobId?: string;
  jobTitle?: string;
  companyName?: string;
}

export default function JobseekerJobDetailView({
  onBack,
  onApply,
  jobId,
  jobTitle = 'Senior Frontend Engineer (React/Next.js)',
  companyName = 'PT Solusi Teknologi Nusantara',
}: JobDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [jobData, setJobData] = useState<BackendJobItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      // Track view/click on backend
      trackJobClick(jobId);

      getJobDetail(jobId)
        .then((data) => {
          setJobData(data);
        })
        .catch((err) => {
          console.warn('Failed to load backend job detail:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [jobId]);

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    if (jobId) {
      try {
        await toggleBookmarkJob(jobId);
      } catch (err) {
        console.warn('Bookmark toggle error:', err);
      }
    }
  };

  const displayTitle = jobData?.title || jobTitle;
  const displayCompany = jobData?.company_name || companyName;
  const displayLocation = jobData?.location || 'Jakarta Selatan (Hybrid - 3 hari WFO)';
  const displaySalary = jobData
    ? `Rp ${jobData.salary_min.toLocaleString('id-ID')} - Rp ${jobData.salary_max.toLocaleString('id-ID')}`
    : 'Rp 18.000.000 - Rp 25.000.000';
  const displayWorkplace = jobData?.workplace_type === 'remote' ? 'Remote (WFH)' : jobData?.workplace_type === 'hybrid' ? 'Hybrid' : 'On-site';
  const displayJobType = jobData?.job_type === 'full_time' ? 'Full-time' : jobData?.job_type || 'Full-time';
  const displaySkills = jobData?.skills_required
    ? jobData.skills_required.split(',').map((s) => s.trim())
    : ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'REST & GraphQL', 'Jest / Cypress'];
  const displayBenefits = jobData?.benefits
    ? jobData.benefits.split(',').map((s) => s.trim())
    : ['Asuransi Kesehatan Kelas 1 (termasuk Rawat Inap & Gigi)', 'Pilihan Perangkat Kerja: MacBook Pro M2/M3', 'Tunjangan Internet & Kursus Belajar (Udemy / Frontend Masters)', 'Kebijakan Cuti Fleksibel (15 hari cuti tahunan + cuti kesehatan mental)'];

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
          <span>{jobData?.category || 'Teknologi Informasi'}</span>
          <span>/</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">
            {displayTitle}
          </span>
        </div>
      </div>

      {/* Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            {displayCompany.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {displayJobType}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Mitra Terverifikasi
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                {displayWorkplace}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayTitle}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              {displayCompany}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                {displaySalary} <span className="text-xs font-normal text-slate-500">/ bulan</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {displayLocation}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {jobData?.experience_level || 'Min. 3-5 Tahun Pengalaman'}
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
            onClick={handleToggleBookmark}
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
              <span>Deskripsi & Ringkasan Posisi</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {jobData?.description ||
                'Kami mencari Senior Frontend Engineer berpengalaman untuk memimpin pengembangan platform web generasi berikutnya. Anda akan berkolaborasi erat dengan tim Product Manager, UI/UX Designer, dan Backend Engineer dalam menghasilkan antarmuka yang cepat, intuitif, dan responsif bagi jutaan pengguna aktif.'}
            </p>
          </div>

          {/* Kualifikasi & Requirements */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kualifikasi & Persyaratan</span>
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {jobData?.requirements || (
                <ul className="space-y-2 list-disc pl-5">
                  <li>Pengalaman minimal 3-5 tahun dalam pengembangan aplikasi web modern.</li>
                  <li>Keahlian mendalam dalam TypeScript, React, Next.js, dan Tailwind CSS.</li>
                  <li>Familiar dengan integrasi RESTful APIs dan GraphQL.</li>
                  <li>Memahami praktik clean code, testing, dan optimasi Core Web Vitals.</li>
                </ul>
              )}
            </div>
          </div>

          {/* Skill Tag Pills */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Keahlian yang Dibutuhkan</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Fasilitas & Benefit */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Fasilitas & Tunjangan Kerja</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              {displayBenefits.map((b, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Company Card & Trust Banner) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Company Info Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {displayCompany}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {jobData?.company_city || 'Jakarta, Indonesia'} • 500+ Karyawan
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Perusahaan teknologi digital terkemuka yang berfokus pada inovasi solusi perangkat lunak terintegrasi untuk jutaan pelanggan.
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={onApply}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Lamaran Sekarang</span>
              </button>
            </div>
          </div>

          {/* Trust & Anti-Scam Banner */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Lowongan 100% Terverifikasi</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              CareerFlow menjamin seluruh proses rekrutmen gratis tanpa pungutan biaya apa pun. Laporkan segera jika menemukan kejanggalan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

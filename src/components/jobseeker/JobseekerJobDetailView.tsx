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
  Sparkles,
  Star,
  ThumbsUp,
  ThumbsDown,
  X,
  Loader2
} from 'lucide-react';
import {
  getJobDetail,
  trackJobClick,
  toggleBookmarkJob,
  getCompanyReviews,
  addCompanyReview,
  toggleFollowCompany,
  reportJob,
  type BackendJobItem,
  type CompanyReviewItem
} from '../../lib/api';
import { authStorage } from '../../lib/auth';

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [jobData, setJobData] = useState<BackendJobItem | null>(null);
  const [reviews, setReviews] = useState<CompanyReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Pungutan Liar / Penipuan Biaya');
  const [reportDescription, setReportDescription] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  // Add Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      trackJobClick(jobId);

      getJobDetail(jobId)
        .then((data) => {
          setJobData(data);
          if (data.company_id) {
            getCompanyReviews(data.company_id)
              .then((revs) => setReviews(revs))
              .catch(() => {});
          }
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

  const handleToggleFollow = async () => {
    if (!jobData?.company_id) return;
    try {
      const res = await toggleFollowCompany(jobData.company_id);
      setIsFollowing(res.is_following);
      alert(res.message || 'Status ikuti perusahaan berhasil diperbarui');
    } catch (err: any) {
      alert(err.message || 'Harap login terlebih dahulu untuk mengikuti perusahaan.');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;
    setIsReporting(true);
    try {
      await reportJob(jobId, { reason: reportReason, description: reportDescription });
      alert('Laporan penipuan / pelanggaran berhasil dikirim ke Tim Kepatuhan Super Admin untuk ditindaklanjuti.');
      setShowReportModal(false);
      setReportDescription('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirim laporan.');
    } finally {
      setIsReporting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobData?.company_id) return;
    setIsSubmittingReview(true);
    try {
      const newRev = await addCompanyReview(jobData.company_id, {
        rating: reviewRating,
        title: reviewTitle,
        pros: reviewPros,
        cons: reviewCons,
        is_current_employee: true,
      });
      setReviews([newRev, ...reviews]);
      alert('Ulasan ala Glassdoor Anda berhasil dikirim ke platform!');
      setShowReviewModal(false);
      setReviewTitle('');
      setReviewPros('');
      setReviewCons('');
    } catch (err: any) {
      alert(err.message || 'Gagal mengirimkan ulasan.');
    } finally {
      setIsSubmittingReview(false);
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
    : ['Asuransi Kesehatan Kelas 1 (termasuk Rawat Inap & Gigi)', 'Pilihan Perangkat Kerja: MacBook Pro M2/M3', 'Tunjangan Internet & Kursus Belajar', 'Kebijakan Cuti Fleksibel (15 hari cuti tahunan)'];

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

        {/* Anti Scam Flag Button */}
        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Laporkan Penipuan</span>
        </button>
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
              {jobData?.skill_match !== undefined && jobData.skill_match !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {jobData.skill_match}% Match dengan Profil Anda
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                {displayCompany}
              </p>
              <button
                type="button"
                onClick={handleToggleFollow}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                  isFollowing
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isFollowing ? '✓ Diikuti' : '+ Ikuti'}
              </button>
            </div>

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
        
        {/* Left Column (Job Details & Glassdoor Reviews) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ringkasan Posisi */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Deskripsi & Ringkasan Posisi</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {jobData?.description ||
                'Kami mencari kandidat berpengalaman untuk memimpin pengembangan platform web generasi berikutnya. Anda akan berkolaborasi erat dalam lingkungan agile berkecepatan tinggi demi menghasilkan solusi berdampak nyata bagi bisnis.'}
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
                  <li>Pengalaman minimal 3-5 tahun dalam bidang terkait.</li>
                  <li>Keahlian mendalam dalam teknologi modern dan praktik clean code.</li>
                  <li>Mampu bekerja sama dalam tim lintas fungsi dan komunikasi yang proaktif.</li>
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

          {/* Glassdoor-style Reviews Section */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Ulasan Karyawan & Kultur (Ala Glassdoor)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Transparansi lingkungan kerja langsung dari para profesional
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
              >
                + Tulis Ulasan
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs text-slate-400">
                Belum ada ulasan untuk perusahaan ini. Jadilah yang pertama memberikan ulasan kultur kerja!
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white ml-1">{r.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID')}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <ThumbsUp className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong>Kelebihan:</strong> {r.pros}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-rose-700 dark:text-rose-400">
                        <ThumbsDown className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span><strong>Kekurangan:</strong> {r.cons}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* MODAL 1: Laporkan Penipuan (Anti-Scam) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600">
                <Flag className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Laporkan Lowongan Ini</h3>
              </div>
              <button type="button" onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Pelanggaran *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="Pungutan Liar / Penipuan Biaya">Pungutan Liar / Penipuan Biaya</option>
                  <option value="Perusahaan Fiktif / Bodong">Perusahaan Fiktif / Bodong</option>
                  <option value="Deskripsi Tidak Sesuai / Menyesatkan">Deskripsi Tidak Sesuai / Menyesatkan</option>
                  <option value="Spam / Lowongan Duplikat">Spam / Lowongan Duplikat</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rincian Laporan *</label>
                <textarea
                  required
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Jelaskan bukti kecurigaan atau kontak yang meminta bayaran..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isReporting}
                  className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isReporting ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tulis Ulasan Perusahaan (Glassdoor style) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ulasan untuk {displayCompany}</h3>
              </div>
              <button type="button" onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="my-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rating Keseluruhan</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 dark:text-slate-300 ml-2">{reviewRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Judul Ulasan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kultur kerja kolaboratif dan benefit sangat kompetitif"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">Kelebihan (Pros) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jelaskan hal-hal yang menyenangkan selama bekerja di sini..."
                  value={reviewPros}
                  onChange={(e) => setReviewPros(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-700 dark:text-rose-400 mb-1">Kekurangan (Cons) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jelaskan aspek yang perlu diperbaiki oleh manajemen..."
                  value={reviewCons}
                  onChange={(e) => setReviewCons(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

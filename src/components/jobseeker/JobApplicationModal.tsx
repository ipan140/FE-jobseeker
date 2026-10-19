import React, { useState } from 'react';
import {
  X,
  FileText,
  UploadCloud,
  Linkedin,
  Github,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { applyJob } from '../../lib/api';

export interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  companyName?: string;
  jobId?: string;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobTitle = 'Senior Frontend Engineer',
  companyName = 'PT Solusi Teknologi Nusantara',
  jobId,
}: JobApplicationModalProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/budisantoso-dev');
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/budisantoso-fe');
  const [coverLetter, setCoverLetter] = useState(
    `Halo Tim Rekrutmen PT Solusi Teknologi Nusantara,\n\nSaya Budi Santoso, seorang Senior Frontend Engineer dengan 5+ tahun pengalaman membangun aplikasi berskala besar dengan React, Next.js, dan TypeScript. Saya sangat tertarik bergabung dalam tim karena keselarasan visi perusahaan dalam membangun solusi enterprise berkinerja tinggi.`
  );
  const [confirmed, setConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setError('Mohon centang persetujuan keabsahan dokumen sebelum mengirim lamaran.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (jobId) {
        await applyJob(jobId, {
          expected_salary: 22000000,
          cover_letter: coverLetter,
        }).catch(() => {});
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirimkan lamaran. Coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              {companyName}
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Kirim Lamaran Pekerjaan - {jobTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Lamaran berhasil dikirimkan ke HRD {companyName}!</span>
            </div>
          )}

          {/* Section: CV / Resume */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Curriculum Vitae (CV / Resume) *
            </label>

            {/* Existing CV Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      Budi_Santoso_Resume_2024.pdf
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      CV Utama
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                    2.4 MB • Diperbarui 3 hari lalu
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                Ganti File
              </button>
            </div>

            {/* Dropzone Upload Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                Klik untuk unggah atau seret file baru
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Format PDF saja (Maksimal ukuran file: 5MB)
              </span>
            </div>
          </div>

          {/* Section: URL Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                URL LinkedIn
              </label>
              <div className="relative">
                <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Portofolio / GitHub (Opsional)
              </label>
              <div className="relative">
                <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section: Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Surat Lamaran Singkat (Cover Letter)
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {coverLetter.length} / 2000 karakter
              </span>
            </div>
            <textarea
              rows={5}
              maxLength={2000}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white leading-relaxed"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 mt-0.5"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                Saya mengonfirmasi bahwa dokumen, data portofolio, dan riwayat pekerjaan yang saya lampirkan adalah valid, benar, dan dapat dipertanggungjawabkan sesuai ketentuan CareerFlow.
              </span>
            </label>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan Lamaran...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Lamaran Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

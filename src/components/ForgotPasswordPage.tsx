import React, { useState } from 'react';
import {
  Briefcase,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Send,
  Lock
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Mohon masukkan alamat email akun Anda.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate/call API reset password
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirim instruksi pemulihan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#090d16] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      {/* 2-Column CareerFlow Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Royal Navy Blue Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#103783] via-[#0d2e6e] to-[#091f4a] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Pemulihan Keamanan Akun</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 border border-blue-400/30">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-tight">
                  CareerFlow
                </span>
                <span className="text-[11px] font-medium text-blue-200/80 tracking-wide">
                  Security & Identity Management
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Keamanan Akun Anda Adalah Prioritas Utama Kami.
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-6 font-normal">
              Ikuti 3 langkah mudah di samping untuk menyetel ulang kata sandi dan mengakses kembali dashboard karir & rekrutmen Anda secara aman.
            </p>

            {/* 3 Step Guide */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/40 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Masukkan Email Terdaftar</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Kirimkan tautan reset kata sandi ke email yang terasosiasi akun CareerFlow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/40 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Cek Kotak Masuk / Folder Spam</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Buka tautan verifikasi dan kode token 6-digit otomatis dari sistem kami.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/40 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Buat Kata Sandi Baru</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Tentukan kata sandi baru yang kuat dan unik untuk login kembali.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Support Info */}
          <div className="pt-6 border-t border-white/10 mt-6 relative z-10 flex items-center gap-3 text-xs text-blue-200/80">
            <HelpCircle className="w-4 h-4 text-blue-300 shrink-0" />
            <span>Butuh bantuan teknis? Hubungi <strong className="text-white">support@careerflow.id</strong></span>
          </div>
        </div>

        {/* Right Column: Reset Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-[#0f172a]">
          <div>
            {/* Back link */}
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors mb-8 cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Halaman Login</span>
            </a>

            {/* Header with key icon */}
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Lupa Kata Sandi?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Jangan khawatir, masukkan alamat email akun CareerFlow Anda di bawah ini dan kami akan mengirimkan tautan pemulihan secara instan.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {isSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  Instruksi Pemulihan Telah Dikirim!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-md mx-auto">
                  Kami telah mengirimkan tautan reset kata sandi ke <strong>{email}</strong>. Silakan cek kotak masuk email Anda dan klik tautan verifikasi.
                </p>
                <div className="pt-2">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
                  >
                    Kembali ke Login Sekarang
                  </a>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alamat Email Akun Terdaftar *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="budi.santoso@gmail.com atau nama@perusahaan.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim Tautan Pemulihan...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Tautan Pemulihan</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Notice Box */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Informasi Keamanan Akun
                </span>
                <p className="text-[11px] leading-relaxed">
                  Pastikan email yang Anda masukkan sesuai dengan akun CareerFlow Anda. Demi keamanan identitas Anda, tautan pemulihan akan kedaluwarsa secara otomatis dalam 15 menit.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Help */}
          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Ingat kata sandi Anda? </span>
            <a
              href="/login"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Masuk di Sini
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

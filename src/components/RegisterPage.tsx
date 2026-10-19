import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Sparkles,
  Star,
  Check,
  ShieldCheck
} from 'lucide-react';
import { registerJobseeker, registerCompany } from '../lib/api';

export default function RegisterPage() {
  const [roleTab, setRoleTab] = useState<'jobseeker' | 'company'>('jobseeker');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Jobseeker fields
  const [jobseekerName, setJobseekerName] = useState('');
  const [jobseekerEmail, setJobseekerEmail] = useState('');
  const [jobseekerPhone, setJobseekerPhone] = useState('');
  const [jobseekerPassword, setJobseekerPassword] = useState('');
  const [jobseekerConfirmPassword, setJobseekerConfirmPassword] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('Information Technology');
  const [companyAddress, setCompanyAddress] = useState('Jakarta Selatan');
  const [companyPassword, setCompanyPassword] = useState('');
  const [companyConfirmPassword, setCompanyConfirmPassword] = useState('');

  // Password Strength calculation
  const currentPassword = roleTab === 'jobseeker' ? jobseekerPassword : companyPassword;
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Belum diisi', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Sedang', color: 'bg-amber-500' };
    return { score: 3, label: 'Kuat', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(currentPassword);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    if (roleTab === 'jobseeker') {
      if (jobseekerPassword !== jobseekerConfirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    } else {
      if (companyPassword !== companyConfirmPassword) {
        setErrorMessage('Konfirmasi kata sandi tidak cocok.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (roleTab === 'jobseeker') {
        await registerJobseeker({
          full_name: jobseekerName.trim(),
          email: jobseekerEmail.trim(),
          password: jobseekerPassword,
          phone: jobseekerPhone.trim() || undefined,
        });
        setSuccessMessage('Pendaftaran berhasil! Akun Pencari Kerja Anda telah aktif.');
      } else {
        await registerCompany({
          company_name: companyName.trim(),
          email: companyEmail.trim(),
          password: companyPassword,
          industry: companyIndustry,
          address: companyAddress.trim(),
        });
        setSuccessMessage('Pendaftaran perusahaan berhasil! Sesi login Anda telah aktif.');
      }

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Pendaftaran gagal. Periksa kembali kelengkapan form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#090d16] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      {/* 2-Column CareerFlow Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        
        {/* Left Column: Royal Navy Blue Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#103783] via-[#0d2e6e] to-[#091f4a] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gerbang Karir & Talenta Digital Terbaik</span>
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
                  Enterprise Talent Ecosystem
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Mulai Perjalanan Karir & Rekrutmen Masa Depan Anda.
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-6 font-normal">
              Bergabunglah dengan ekosistem rekrutmen terdepan yang dipercaya oleh ribuan profesional dan perusahaan enterprise skala nasional.
            </p>

            {/* Testimonial Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl mb-6 shadow-sm">
              <div className="flex items-center gap-1 mb-2 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                ))}
              </div>
              <p className="text-xs text-blue-100 leading-relaxed italic mb-3 font-normal">
                "CareerFlow memangkas waktu screening kandidat kami hingga 65%. Dashboard intuitif dan integrasi fiturnya sangat solid untuk kebutuhan hiring enterprise kami."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 border border-white/30 flex items-center justify-center font-bold text-xs text-white">
                  BP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Bagus Pratama</h4>
                  <p className="text-[10px] text-blue-200/80">Super Admin & Lead Talent Acquisition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="pt-6 border-t border-white/10 mt-4 relative z-10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-black text-white tracking-tight">14.000+</div>
              <div className="text-[11px] text-blue-200/80 font-medium">Lamaran Sukses</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">&lt; 48 Jam</div>
              <div className="text-[11px] text-blue-200/80 font-medium">Respon HR Rata-rata</div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#0f172a]">
          <div>
            {/* Header Titles */}
            <div className="mb-5">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Buat Akun Baru
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Pilih tipe akun Anda dan lengkapi formulir di bawah ini untuk memulai.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setRoleTab('jobseeker');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === 'jobseeker'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Pencari Kerja</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleTab('company');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  roleTab === 'company'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Perusahaan / HR</span>
              </button>
            </div>

            {/* Error & Success Feedback */}
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">
                  {successMessage} Mengarahkan ke Dashboard...
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              {roleTab === 'jobseeker' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={jobseekerName}
                        onChange={(e) => setJobseekerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={jobseekerEmail}
                        onChange={(e) => setJobseekerEmail(e.target.value)}
                        placeholder="budi.santoso@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor WhatsApp / HP (Opsional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={jobseekerPhone}
                        onChange={(e) => setJobseekerPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Perusahaan *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Contoh: PT Teknologi Bangsa Tbk"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Resmi Perusahaan *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        placeholder="recruitment@perusahaan.co.id"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Sektor Industri
                      </label>
                      <select
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      >
                        <option value="Information Technology">Information Technology</option>
                        <option value="Banking & Financial Services">Banking & Finance</option>
                        <option value="E-Commerce & Retail">E-Commerce</option>
                        <option value="Telecommunications">Telekomunikasi</option>
                        <option value="Healthcare & Pharma">Healthcare</option>
                        <option value="Logistics & Supply Chain">Logistik</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kota Domisili
                      </label>
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Jakarta Selatan"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={roleTab === 'jobseeker' ? jobseekerPassword : companyPassword}
                    onChange={(e) =>
                      roleTab === 'jobseeker'
                        ? setJobseekerPassword(e.target.value)
                        : setCompanyPassword(e.target.value)
                    }
                    placeholder="Minimal 8 karakter & simbol"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {currentPassword && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full ${
                          strength.score >= 1 ? strength.color : 'bg-transparent'
                        } flex-1 transition-all duration-300`}
                      />
                      <div
                        className={`h-full ${
                          strength.score >= 2 ? strength.color : 'bg-transparent'
                        } flex-1 transition-all duration-300`}
                      />
                      <div
                        className={`h-full ${
                          strength.score >= 3 ? strength.color : 'bg-transparent'
                        } flex-1 transition-all duration-300`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Kekuatan: {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Konfirmasi Kata Sandi *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={
                      roleTab === 'jobseeker'
                        ? jobseekerConfirmPassword
                        : companyConfirmPassword
                    }
                    onChange={(e) =>
                      roleTab === 'jobseeker'
                        ? setJobseekerConfirmPassword(e.target.value)
                        : setCompanyConfirmPassword(e.target.value)
                    }
                    placeholder="Ulangi kata sandi"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 mt-0.5"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    Saya menyetujui{' '}
                    <a href="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      Syarat & Ketentuan
                    </a>{' '}
                    serta{' '}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      Kebijakan Privasi
                    </a>{' '}
                    CareerFlow.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Akun Anda...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Link to Login */}
          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400">
            <span>Sudah memiliki akun CareerFlow? </span>
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

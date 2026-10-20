import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  User,
  Building2,
  ShieldCheck,
  Sparkles,
  Loader2,
  Check,
  Globe,
  Award
} from 'lucide-react';
import { loginUser, getCurrentUser, authStorage, type LoginResponse, type UserMe } from '../lib/auth';

interface DemoAccount {
  label: string;
  role: 'jobseeker' | 'company' | 'admin';
  email: string;
  pass: string;
  icon: typeof User;
  badgeClass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Pencari Kerja',
    role: 'jobseeker',
    email: 'budi.santoso@gmail.com',
    pass: 'Password123!',
    icon: User,
    badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100',
  },
  {
    label: 'Perusahaan / HR',
    role: 'company',
    email: 'hr@tokopedia.com',
    pass: 'Password123!',
    icon: Building2,
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100',
  },
  {
    label: 'Super Admin',
    role: 'admin',
    email: 'admin@jobseekers.com',
    pass: 'Admin123!',
    icon: ShieldCheck,
    badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<LoginResponse | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserMe | null>(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const existingToken = authStorage.getToken();
    if (existingToken) {
      getCurrentUser()
        .then((user) => setLoggedInUser(user))
        .catch(() => {
          authStorage.clearSession();
        });
    }
  }, []);

  const handleSelectDemo = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.pass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Mohon isi alamat email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(email.trim(), password);
      setSuccessData(res);
      const userProfile = await getCurrentUser().catch(() => null);
      if (userProfile) {
        setLoggedInUser(userProfile);
      }

      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || '/dashboard';
        window.location.href = redirectUrl;
      }, 900);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#090d16] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      {/* 2-Column CareerFlow Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Royal Navy Blue Hero Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#103783] via-[#0d2e6e] to-[#091f4a] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative glow circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform Karir & Rekrutmen Terpercaya #1</span>
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
                  Job Vacancy & ATS System
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Temukan Karir Impian & Talenta Terbaik Indonesia.
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-6 font-normal">
              Sistem rekrutmen enterprise berbasis AI terintegrasi yang mempertemukan talenta terbaik dengan 4.500+ perusahaan terkemuka secara instan.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Smart Matching Algorithm</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Rekomendasi posisi akurat sesuai skill, portofolio & pengalaman.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verifikasi Akun Terpercaya</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Keamanan data terjamin dengan verifikasi legalitas perusahaan dan OTP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Proses Rekrutmen Terbuka</h4>
                  <p className="text-[11px] text-blue-200/70 leading-normal">
                    Pantau status lamaran secara real-time langsung dari dashboard pelamar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Card */}
          <div className="pt-8 border-t border-white/10 mt-6 relative z-10 grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-black text-white tracking-tight">120.000+</div>
              <div className="text-[11px] text-blue-200/80 font-medium">Talenta Terdaftar</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">4.500+</div>
              <div className="text-[11px] text-blue-200/80 font-medium">Perusahaan Mitra</div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-[#0f172a]">
          <div>
            {/* Header Titles */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Selamat datang kembali! Silakan masukkan detail login Anda untuk melanjutkan.
              </p>
            </div>

            {/* Quick Demo Account Selector */}
            <div className="mb-6 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Uji Coba Cepat (Akun Demo)
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${acc.badgeClass}`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-[11px] font-bold leading-tight">{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error & Success Feedback */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successData && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">
                  Autentikasi berhasil! Mengarahkan ke Dashboard CareerFlow...
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    Ingat saya
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lupa kata sandi?
                </a>
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
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-[#0f172a] text-slate-400">
                  atau masuk dengan
                </span>
              </div>
            </div>

            {/* Social / SSO Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('budi.santoso@gmail.com');
                  setPassword('Password123!');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('hr@tokopedia.com');
                  setPassword('Password123!');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <div className="w-4 h-4 rounded bg-[#0A66C2] flex items-center justify-center text-white text-[10px] font-black">
                  in
                </div>
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Bottom Link to Register */}
          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400">
            <span>Belum memiliki akun CareerFlow? </span>
            <a
              href="/register"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

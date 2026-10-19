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
  LogOut,
  Sparkles,
  Loader2,
  ArrowLeft
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
    badgeClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
  },
  {
    label: 'Perusahaan / HR',
    role: 'company',
    email: 'hr@tokopedia.com',
    pass: 'Password123!',
    icon: Building2,
    badgeClass: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200',
  },
  {
    label: 'Administrator',
    role: 'admin',
    email: 'admin@jobseekers.com',
    pass: 'Admin123!',
    icon: ShieldCheck,
    badgeClass: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200',
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
      setErrorMessage('Mohon isi email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(email.trim(), password);
      setSuccessData(res);
      // Fetch user profile
      const userProfile = await getCurrentUser().catch(() => null);
      if (userProfile) {
        setLoggedInUser(userProfile);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clearSession();
    setLoggedInUser(null);
    setSuccessData(null);
    setEmail('');
    setPassword('');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator
          </span>
        );
      case 'company':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Building2 className="w-3.5 h-3.5" /> Perusahaan / Rekruiter
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <User className="w-3.5 h-3.5" /> Pencari Kerja
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 text-slate-800 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2 mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </a>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Jobseekers
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md w-full mx-auto my-auto">
        {/* Already Logged In State */}
        {loggedInUser ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Sesi Anda Aktif!
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Anda sedang masuk menggunakan akun berikut:
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Peran Akun</span>
                {getRoleBadge(loggedInUser.role)}
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-xs text-slate-400 block font-medium">Email</span>
                <span className="text-sm font-semibold text-slate-800 break-all">
                  {loggedInUser.email}
                </span>
              </div>
              {loggedInUser.profile?.full_name && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 block font-medium">Nama Lengkap</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {loggedInUser.profile.full_name}
                  </span>
                </div>
              )}
              {loggedInUser.profile?.company_name && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 block font-medium">Nama Perusahaan</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {loggedInUser.profile.company_name}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <a
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]"
              >
                Lanjutkan ke Dashboard <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Keluar dari Akun
              </button>
            </div>
          </div>
        ) : (
          /* Login Card Form */
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 sm:p-10">
            {/* Card Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 ring-8 ring-blue-50/50">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Masuk untuk menjelajahi ribuan lowongan & kelola karir Anda
              </p>
            </div>

            {/* Quick Demo Fill Pills */}
            <div className="mb-6 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Uji Coba Akun Demo
                </span>
                <span className="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = email === acc.email;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-sm ring-1 ring-blue-500'
                          : `${acc.badgeClass}`
                      }`}
                      title={acc.email}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="truncate max-w-full px-0.5">{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-800 text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Gagal Masuk</p>
                  <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successData && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Berhasil Masuk!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Login berhasil sebagai <b>{successData.role}</b> ({successData.email}).
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    required
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Untuk reset password akun demo, gunakan kata sandi: Password123! atau Admin123!');
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all bg-slate-50/50 hover:bg-white focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 transition-all cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-medium">Ingat saya di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Registration Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Belum memiliki akun?{' '}
                <a
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-0.5"
                >
                  Daftar Sekarang <ArrowRight className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="text-center py-4 text-xs text-slate-400 mt-6">
        &copy; {new Date().getFullYear()} Jobseekers Portal — Glints & Jobstreet Enterprise System.
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Briefcase,
  DollarSign,
  Clock,
  Laptop,
  Heart,
  ChevronRight,
  Sparkles,
  Share2
} from 'lucide-react';

export default function MerchantProfileView() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Profil Perusahaan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola identitas resmi, legalitas bisnis, dan informasi kontak perusahaan Anda di CareerFlow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>{isEditing ? 'Simpan Perubahan' : 'Edit Profil Perusahaan'}</span>
        </button>
      </div>

      {/* Hero Banner & Company Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Blue Header Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 flex items-start justify-end relative">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/20">
            ID Perusahaan: CF-ENT-2024-089
          </span>
        </div>

        {/* Profile Info Overlay Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-14 sm:-mt-16 mb-4">
            {/* Logo Box & Names */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 p-2.5 shadow-xl border border-slate-200 dark:border-slate-700 shrink-0 flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex flex-col items-center justify-center text-white shadow-inner">
                  <div className="w-7 h-7 border-2 border-white rounded-md flex items-center justify-center font-black text-xs mb-0.5">
                    ST
                  </div>
                  <span className="text-[9px] font-black tracking-widest uppercase">SolusiTek</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    PT Solusi Teknologi Nusantara
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-50 shrink-0" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Penyedia Infrastruktur Cloud & Solusi Finansial Digital Terdepan di Indonesia
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Teknologi Informasi, SaaS & FinTech
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Berdiri sejak 2018
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    250-500 Karyawan
                  </span>
                </div>
              </div>
            </div>

            {/* Right Metric Box */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
              <div className="text-center px-2">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block leading-tight">
                  14
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Lowongan Aktif
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center px-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white block leading-tight">
                  98.4%
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Respons Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tentang, Benefits, Galeri */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tentang Perusahaan */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Tentang Perusahaan
                </h3>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                Profil Publik Terpublikasi
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              PT Solusi Teknologi Nusantara (SolusiTek) merupakan entitas teknologi finansial dan penyedia infrastruktur komputasi awan terakreditasi di Indonesia. Berdiri sejak tahun 2018 di Jakarta, misi kami adalah mengakselerasi inklusi digital korporasi nasional lewat solusi software-as-a-service yang aman, andal, dan modular.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dengan ekosistem talenta lebih dari 350 engineer, product manager, dan spesialis kepatuhan finansial, SolusiTek terus merancang ekosistem transaksi digital generasi berikutnya yang memberdayakan ribuan UMKM hingga institusi perbankan tier-1.
            </p>
          </div>

          {/* Keuntungan & Benefit Karyawan */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Keuntungan & Benefit Karyawan
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 text-xs">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                BPJS Kesehatan & Ketenagakerjaan
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Annual Bonus & THR Terstruktur
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                <Clock className="w-4 h-4 text-amber-500" />
                Flexible Working Hours
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                <Laptop className="w-4 h-4 text-indigo-500" />
                Home Office Budget
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                <Heart className="w-4 h-4 text-rose-500" />
                Wellness Benefit & Gym Allowance
              </span>
            </div>
          </div>

          {/* Galeri Kantor */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Galeri Kantor
              </h3>
              <button
                type="button"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Kelola Galeri (3/10)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Photo 1 */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group h-36">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80"
                  alt="Open Collaborative Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white">Open Collaborative Hub</span>
                </div>
              </div>

              {/* Photo 2 */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group h-36">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=500&auto=format&fit=crop&q=80"
                  alt="Executive Boardroom Lt.14"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white">Executive Boardroom Lt.14</span>
                </div>
              </div>

              {/* Photo 3 */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative group h-36">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
                  alt="Townhall & Cafe Breakout"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                  <span className="text-[11px] font-bold text-white">Townhall & Cafe Breakout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Legalitas & Kontak */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Status Legalitas & Regulasi */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Status Legalitas & Regulasi
              </h3>
            </div>

            <div className="space-y-3">
              {/* NIB */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    NIB (Nomor Induk Berusaha)
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  0220108920194002
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  ✓ Terdaftar di OSS RBA BKPM RI
                </span>
              </div>

              {/* NPWP */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    NPWP Badan Usaha
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  82.903.112.4-013.000
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  ✓ Status Validasi Kemenkeu DJP Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Kontak Resmi Perusahaan */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Kontak Resmi Perusahaan</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Alamat Kantor Pusat
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed block">
                    Menara Mandiri Tower 2, Lantai 14, Jl. Jend. Sudirman Kav. 54-55, Jakarta Selatan 12190
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Email Rekrutmen
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    careers@solusitek.id
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Nomor Telepon Kantor
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    +62 21 5289 4400
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Website Resmi
                  </span>
                  <a
                    href="https://solusitek.id"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>https://solusitek.id</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                  Kanal Media Sosial
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    @solusitek-id
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    @lifeatsolusitek
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Semua pembaruan legalitas dan domisili perusahaan diawasi secara berkala oleh tim kepatuhan CareerFlow Merchant untuk menjamin standar rekrutmen institusional.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

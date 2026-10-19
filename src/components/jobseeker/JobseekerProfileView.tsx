import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Pencil,
  UploadCloud,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  FileText,
  Eye,
  Download,
  Plus,
  ExternalLink,
  Globe,
  Sparkles
} from 'lucide-react';

export interface JobseekerProfileProps {
  onEditProfile: () => void;
}

export default function JobseekerProfileView({ onEditProfile }: JobseekerProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'cv'>('profile');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Profile Card (Matching Image 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Blue Banner Background */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600" />

        {/* Profile Info Overlay Container */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar with status indicator */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl border-2 border-white dark:border-slate-700 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    alt="Budi Santoso"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span
                  className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute bottom-1 right-1 shadow-xs"
                  title="Aktif Bekerja"
                />
              </div>

              {/* Names & Role */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Budi Santoso, S.Kom
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Siap Bekerja (Open to Work)
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Senior Frontend Developer | UI/UX Enthusiast
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-0 shrink-0">
              <button
                type="button"
                onClick={onEditProfile}
                className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Profil</span>
              </button>

              <button
                type="button"
                onClick={onEditProfile}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Unggah / Perbarui CV Utama</span>
              </button>
            </div>
          </div>

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>budi.santoso@nusantara.id</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>+62 812-3456-7890</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Jakarta Selatan, Indonesia</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Diperbarui 2 hari lalu</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout (Matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Bio, Experience, Education, Certifications */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Ringkasan Profesional (Bio) */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Ringkasan Profesional (Bio)</span>
              </h3>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                title="Edit Bio"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Frontend Engineer berdedikasi dengan 4+ tahun pengalaman dalam merancang dan mengembangkan aplikasi web modern berskala enterprise yang mengutamakan performa tinggi, skalabilitas, dan aksesibilitas. Sangat fasih dalam ekosistem React, Next.js, dan TypeScript dengan pemahaman mendalam tentang state management serta arsitektur antarmuka pengguna berbasis komponen. Berpengalaman memimpin inisiatif modernisasi frontend, mengoptimasi Core Web Vitals, dan berkolaborasi erat dalam lingkungan kerja agile berkecepatan tinggi demi menghadirkan solusi teknologi yang berdampak nyata bagi bisnis.
            </p>
          </div>

          {/* Card: Pengalaman Kerja */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Pengalaman Kerja</span>
              </h3>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Job 1 */}
              <div className="space-y-2 border-l-2 border-blue-600 pl-4 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[6px] top-1" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Senior Frontend Engineer
                  </h4>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md w-fit">
                    2022 - Sekarang • Full-time
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  TechAsia Solusi • Jakarta, Indonesia
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  <li>Memimpin perancangan arsitektur micro-frontend untuk dashboard enterprise dengan traffic 2M+ pengguna bulanan.</li>
                  <li>Berhasil mengurangi waktu pemuatan halaman (load time) hingga 35% melalui strategi code-splitting, lazy loading modul, dan caching aset secara agresif.</li>
                  <li>Membangun Design System internal berbasis Tailwind CSS dan Storybook yang meningkatkan efisiensi sprint tim engineering sebesar 25%.</li>
                  <li>Mementor 4 junior engineer dalam penulisan clean code, arsitektur TypeScript, dan implementasi unit testing dengan Jest.</li>
                </ul>
              </div>

              {/* Job 2 */}
              <div className="space-y-2 border-l-2 border-slate-300 dark:border-slate-700 pl-4 relative">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-[6px] top-1" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Frontend Developer
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md w-fit">
                    2020 - 2022 • Full-time
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Nusantara Studio • Bandung, Indonesia
                </div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  <li>Mengembangkan modul antarmuka analitik CRM modular menggunakan React.js dan Redux Toolkit.</li>
                  <li>Mengintegrasikan 30+ endpoint REST API berkecepatan tinggi dengan validasi skema frontend yang ketat.</li>
                  <li>Berkolaborasi secara intensif bersama Product Manager dan UI/UX Designer untuk menerjemahkan wireframe Figma ke kode fungsional yang responsif.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card: Riwayat Pendidikan */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Riwayat Pendidikan</span>
              </h3>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="flex items-start gap-3.5 text-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    S1 Teknik Informatika
                  </h4>
                  <span className="text-[11px] text-slate-400">2016 - 2020</span>
                </div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Universitas Indonesia
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                  IPK: 3.82 / 4.00 (Cum Laude)
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Aktif dalam Himpunan Mahasiswa Informatika dan UI Engineering Club. Menyelesaikan skripsi bertajuk "Optimalisasi Render Performance pada Web-based Single Page Application Menggunakan Virtual DOM Heuristics".
                </p>
              </div>
            </div>
          </div>

          {/* Card: Sertifikasi & Lisensi */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Sertifikasi & Lisensi</span>
              </h3>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Cert 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  AWS
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">
                    AWS Certified Cloud Practitioner
                  </h4>
                  <p className="text-[11px] text-slate-500">Amazon Web Services</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Diterbitkan Agu 2023 • Berlaku s/d Agu 2026
                  </span>
                </div>
                <a
                  href="#credential"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>Lihat Kredensial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Cert 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  META
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">
                    Meta Frontend Professional Certificate
                  </h4>
                  <p className="text-[11px] text-slate-500">Meta (Coursera)</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Diterbitkan Nov 2022 • Tanpa Kedaluwarsa
                  </span>
                </div>
                <a
                  href="#credential"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1"
                >
                  <span>Lihat Kredensial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Completeness, CV, Skills, Languages */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          
          {/* Card: Kelengkapan Profil */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">Kelengkapan Profil</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">90%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="w-[90%] h-full bg-blue-600 rounded-full" />
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Tinggal 1 langkah lagi untuk mencapai 100%! Tambahkan tautan portofolio eksternal untuk menarik 3x lebih banyak perekrut.
            </p>

            <button
              type="button"
              onClick={onEditProfile}
              className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors cursor-pointer"
            >
              + Tambah Link Portofolio
            </button>
          </div>

          {/* Card: CV Utama Terunggah */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">CV Utama Terunggah</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Terverifikasi
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs truncate max-w-44">
                  Budi_Santoso_CV_Frontend_2024.pdf
                </span>
                <span className="text-[10px] text-slate-400 block">2.4 MB • Diunggah 14 Feb 2025</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>

              <button
                type="button"
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CV</span>
              </button>
            </div>
          </div>

          {/* Card: Keahlian & Skill */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">Keahlian & Skill</span>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-slate-400 hover:text-blue-600 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Keahlian Teknis
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Node.js', 'Git', 'Jest'].map(
                  (s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[11px]"
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Soft Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Problem Solving', 'Team Leadership', 'Agile/Scrum'].map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Bahasa */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">Bahasa</span>
              <button
                type="button"
                onClick={onEditProfile}
                className="text-slate-400 hover:text-blue-600 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Bahasa Indonesia</span>
                <span className="text-slate-400">Penutur Asli (Native)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Bahasa Inggris</span>
                <span className="text-slate-400">Tingkat Profesional (Fluent)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Upload,
  FileText,
  Lock,
  Sparkles,
  Info,
  Check,
  X,
  ChevronRight
} from 'lucide-react';

export interface JobseekerProfileEditViewProps {
  onBackToProfile: () => void;
  onSaveSuccess?: () => void;
}

interface WorkExperience {
  id: string;
  position: string;
  company: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  descriptions: string[];
}

export default function JobseekerProfileEditView({
  onBackToProfile,
  onSaveSuccess,
}: JobseekerProfileEditViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(3); // Default step 3 (Pengalaman Kerja) as in Image 3

  // Experiences state
  const [experiences, setExperiences] = useState<WorkExperience[]>([
    {
      id: '1',
      position: 'Senior Frontend Engineer',
      company: 'TechAsia Solusi',
      type: 'Penuh Waktu',
      location: 'Jakarta (Hybrid)',
      startDate: 'Jan 2023',
      endDate: 'Sekarang',
      isCurrent: true,
      descriptions: [
        'Memimpin tim 4 developer dalam migrasi arsitektur monolit ke micro-frontend dengan Next.js dan Tailwind CSS.',
        'Meningkatkan skor performa Core Web Vitals dari 62 menjadi 94 untuk portal web utama dengan lebih dari 2 juta pengunjung bulanan.',
      ],
    },
  ]);

  // Form states for new experience
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [employmentType, setEmploymentType] = useState('Penuh Waktu');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');

  // Skills state
  const [skills, setSkills] = useState<string[]>([
    'React.js',
    'TypeScript',
    'Tailwind CSS',
    'Next.js',
    'REST APIs',
    'Git',
    'UI/UX Principles',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // CV File state
  const [cvFileName, setCvFileName] = useState('Budi_Santoso_Resume_2025.pdf');
  const [cvFileSize, setCvFileSize] = useState('1.8 MB');
  const [cvUploadDate, setCvUploadDate] = useState('12 Okt 2025');

  // Feedback banner state
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) {
      showNotification('Mohon isi nama perusahaan dan posisi!');
      return;
    }

    const descList = description
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company,
      position,
      type: employmentType,
      location: location || 'Jakarta (Hybrid)',
      startDate: startDate || 'Jan 2024',
      endDate: isCurrent ? 'Sekarang' : endDate || 'Des 2024',
      isCurrent,
      descriptions: descList.length > 0 ? descList : ['Bertanggung jawab atas pengembangan fitur web frontend.'],
    };

    setExperiences([newExp, ...experiences]);
    setCompany('');
    setPosition('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    showNotification('Pengalaman kerja berhasil ditambahkan!');
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
    showNotification('Pengalaman kerja dihapus');
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkillInput.trim())) {
        setSkills([...skills, newSkillInput.trim()]);
      }
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSimpanDraf = () => {
    showNotification('Draf profil karir berhasil disimpan!');
    setTimeout(() => {
      onBackToProfile();
    }, 1000);
  };

  const handleLanjut = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showNotification('Profil berhasil diperbarui 100%!');
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => {
        onBackToProfile();
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <button
            type="button"
            onClick={onBackToProfile}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Profil</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Lengkapi & Perbarui Profil Karir
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Profil yang lengkap meningkatkan peluang Anda dipanggil wawancara hingga <span className="font-bold text-blue-600 dark:text-blue-400">3x lipat</span>.
          </p>
        </div>

        {/* Profile Completeness Badge */}
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 rounded-2xl px-4 py-2.5 self-start sm:self-auto">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-blue-200 dark:text-blue-900 fill-none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeDasharray="100"
                strokeDashoffset={100 - (currentStep >= 4 ? 90 : 75)}
                className="text-blue-600 dark:text-blue-400 fill-none transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-blue-600 dark:text-blue-400">
              {currentStep >= 4 ? '90%' : '75%'}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Kelengkapan Profil
            </div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {currentStep >= 4 ? 'Hampir Sempurna' : 'Tinggal 2 langkah lagi!'}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Stepper Header */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Step 1: Data Diri */}
          <div
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              currentStep === 1
                ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-500'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-emerald-500/20">
              <Check className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Langkah 1</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">1. Data Diri</div>
            </div>
          </div>

          {/* Step 2: Riwayat Pendidikan */}
          <div
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              currentStep === 2
                ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-500'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-emerald-500/20">
              <Check className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Langkah 2</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">2. Riwayat Pendidikan</div>
            </div>
          </div>

          {/* Step 3: Riwayat Pengalaman Kerja (Aktif) */}
          <div
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 3 ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              }`}
            >
              3
            </div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider ${currentStep === 3 ? 'text-blue-100' : 'text-slate-400'}`}>
                Langkah 3
              </div>
              <div className={`text-xs font-extrabold truncate ${currentStep === 3 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                3. Pengalaman Kerja
              </div>
            </div>
          </div>

          {/* Step 4: Skill & Unggah CV */}
          <div
            onClick={() => setCurrentStep(4)}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              currentStep === 4
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                currentStep === 4 ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              4
            </div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider ${currentStep === 4 ? 'text-blue-100' : 'text-slate-400'}`}>
                Langkah 4
              </div>
              <div className={`text-xs font-extrabold truncate ${currentStep === 4 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                4. Skill & Upload CV
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3 CONTENT: Riwayat Pengalaman Kerja */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Registered Experience Items Section */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Pengalaman Kerja Terdaftar</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pengalaman kerja relevan yang akan ditampilkan kepada rekruter.
                </p>
              </div>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 w-fit">
                {experiences.length} Pengalaman Tercatat
              </span>
            </div>

            {/* List of Registered Experiences */}
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {exp.position}
                        </h3>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {exp.company} • <span className="text-slate-500 dark:text-slate-400 font-medium">{exp.type}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {exp.startDate} - {exp.endDate}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setCompany(exp.company);
                          setPosition(exp.position);
                          setEmploymentType(exp.type);
                          setLocation(exp.location);
                          setDescription(exp.descriptions.join('\n'));
                          showNotification('Memuat data ke formulir di bawah untuk diedit.');
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Pengalaman"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Hapus Pengalaman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bullet points accomplishments */}
                  <ul className="mt-4 space-y-1.5 pl-5 list-disc text-xs text-slate-600 dark:text-slate-300">
                    {exp.descriptions.map((desc, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Form: Tambah Pengalaman Kerja Baru */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>+ Tambah Pengalaman Kerja Baru</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cantumkan pengalaman kerja relevan yang menunjukkan keahlian dan kontribusi terukur Anda.
              </p>
            </div>

            <form onSubmit={handleAddExperience} className="space-y-5">
              {/* Row 1: Company & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="cth. PT Solusi Digital Asia"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Posisi / Jabatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="cth. Frontend Developer atau UI Designer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Employment Type & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Pekerjaan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                  >
                    <option value="Penuh Waktu">Penuh Waktu (Full-time)</option>
                    <option value="Paruh Waktu">Paruh Waktu (Part-time)</option>
                    <option value="Kontrak">Kontrak (Contract)</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Magang">Magang (Internship)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Lokasi & Format Kerja
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="cth. Jakarta Selatan (Hybrid)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 3: Start Date, End Date, and Current Checkbox */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Bulan & Tahun Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="cth. Jan 2022"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Bulan & Tahun Selesai
                  </label>
                  <input
                    type="text"
                    value={isCurrent ? 'Sekarang' : endDate}
                    disabled={isCurrent}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="cth. Des 2023"
                    className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400 ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Checkbox: Masih bekerja di posisi ini */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Saya saat ini masih bekerja di posisi ini
                </span>
              </label>

              {/* Row 4: Description & Accomplishments */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Deskripsi Pekerjaan & Pencapaian
                  </label>
                  <span className="text-[11px] text-slate-400">Pisahkan setiap pencapaian dengan baris baru</span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan tanggung jawab utama dan pencapaian terukur yang Anda raih. Gunakan poin atau angka persentase jika memungkinkan (cth. Meningkatkan performa aplikasi sebesar 35%)..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tips: Gunakan format Tindakan + Metode + Hasil untuk membuat resume Anda lebih menarik bagi rekruter.</span>
                </div>
              </div>

              {/* Submit Add Experience Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Pengalaman Ini ke Profil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 4 CONTENT: Skill & Upload CV */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Skills Management Section */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Keahlian Utama (Skills)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tambahkan minimal 5 keahlian teknis atau interpersonal yang paling Anda kuasai.
              </p>
            </div>

            {/* Input Tag */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ketik Keahlian & Tekan Enter
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="cth. GraphQL, Docker, Agile Scrum..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
                      setSkills([...skills, newSkillInput.trim()]);
                      setNewSkillInput('');
                    }
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Skill Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Upload CV Dropzone Section */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800/60 pb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Unggah CV / Resume Terbaru</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Format PDF, DOC, atau DOCX dengan ukuran maksimal 5 MB.
              </p>
            </div>

            {/* Current Uploaded File Card */}
            {cvFileName && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {cvFileName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cvFileSize} • Terverifikasi pada {cvUploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 text-xs font-bold cursor-pointer transition-colors">
                    <span>Ganti File</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCvFileName(e.target.files[0].name);
                          setCvFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                          setCvUploadDate('Hari ini');
                          showNotification('File resume berhasil diganti!');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Dropzone Area */}
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCvFileName(e.target.files[0].name);
                    setCvFileSize(`${(e.target.files[0].size / (1024 * 1024)).toFixed(1)} MB`);
                    setCvUploadDate('Hari ini');
                    showNotification('File resume berhasil diunggah!');
                  }
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tarik & lepas file CV baru di sini, atau <span className="text-blue-600 dark:text-blue-400 underline">klik untuk telusuri</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Mendukung PDF, DOCX (Maksimal 5MB)
              </p>
            </label>
          </div>
        </div>
      )}

      {/* Step 1 & 2 Preview/Placeholder */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Diri (Sudah Lengkap 100%)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block mb-1">Nama Lengkap</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Budi Santoso, S.Kom</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block mb-1">Email</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">budi.santoso@gmail.com</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block mb-1">Nomor Telepon</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">+62 812-3456-7890</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block mb-1">Domisili</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Jakarta Selatan, DKI Jakarta</span>
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Riwayat Pendidikan (Sudah Lengkap 100%)</h2>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Universitas Indonesia (UI)</h4>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
              Sarjana Ilmu Komputer (S.Kom) • IPK 3.82 / 4.00
            </p>
            <p className="text-[11px] text-slate-400 mt-1">2017 - 2021 • Depok, Jawa Barat</p>
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
            else onBackToProfile();
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer text-center"
        >
          {currentStep === 3 ? '← Kembali (Pendidikan)' : currentStep === 4 ? '← Kembali (Pengalaman)' : '← Kembali ke Profil'}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimpanDraf}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Simpan sebagai Draf
          </button>
          <button
            type="button"
            onClick={handleLanjut}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{currentStep === 3 ? 'Lanjut: Skill & Unggah CV' : currentStep === 4 ? 'Simpan & Publikasikan Profil' : 'Langkah Selanjutnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security & Encryption Banner */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <p className="text-[11px] leading-relaxed">
          Data profil dan berkas resume Anda dilindungi dengan enkripsi AES-256 dan hanya dapat diakses oleh rekruter terverifikasi setelah Anda mengajukan lamaran pekerjaan secara sukarela.
        </p>
      </div>
    </div>
  );
}

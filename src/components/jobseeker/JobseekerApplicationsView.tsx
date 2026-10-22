import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Video,
  Download,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  RotateCw,
  Building2,
  FileText,
  User,
  AlertCircle
} from 'lucide-react';
import { getMyApplications, withdrawApplication, respondJobOffer, type BackendApplicationItem } from '../../lib/api';

interface ApplicationItem {
  id: string;
  appCode: string;
  jobTitle: string;
  companyName: string;
  companyTag: string;
  companyTagBg: string;
  location: string;
  appliedDate: string;
  status: 'interview' | 'in_progress' | 'accepted' | 'rejected';
  statusLabel: string;
  statusClass: string;
  currentStep: number; // 1 to 4
  interviewTime?: string;
  meetLink?: string;
  hrNote?: {
    hrName: string;
    hrRole: string;
    hrTime: string;
    message: string;
    avatar: string;
  };
}

const SAMPLE_APPLICATIONS: ApplicationItem[] = [
  {
    id: '1',
    appCode: '#CF-89211',
    jobTitle: 'Senior Frontend Engineer',
    companyName: 'PT Solusi Teknologi Nusantara',
    companyTag: 'ST',
    companyTagBg: 'bg-blue-600 text-white',
    location: 'Jakarta Selatan (Hybrid)',
    appliedDate: '18 Oktober 2024',
    status: 'interview',
    statusLabel: 'Interview',
    statusClass: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    currentStep: 3,
    interviewTime: '25 Okt 2024 • 13:30 WIB',
    meetLink: 'meet.google.com/xyz-wuvq-bdr',
    hrNote: {
      hrName: 'Maya Amanda',
      hrRole: 'Lead Talent Acquisition • PT Solusi Teknologi Nusantara',
      hrTime: 'Kemarin, 16:45 WIB',
      message:
        'Halo Budi! Mohon persiapkan presentasi singkat studi kasus terkait pengelolaan state management dan optimasi performa web yang pernah Anda rancang. Sampai bertemu di Google Meet besok siang!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  },
  {
    id: '2',
    appCode: '#CF-88942',
    jobTitle: 'Lead Product Designer',
    companyName: 'PT Telko Digital',
    companyTag: 'TD',
    companyTagBg: 'bg-slate-700 text-white',
    location: 'Bandung (Remote)',
    appliedDate: '14 Okt 2024',
    status: 'in_progress',
    statusLabel: 'Diproses',
    statusClass: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    currentStep: 2,
  },
  {
    id: '3',
    appCode: '#CF-87610',
    jobTitle: 'Data Analyst',
    companyName: 'PT Finansial Mandiri',
    companyTag: 'FM',
    companyTagBg: 'bg-emerald-600 text-white',
    location: 'Jakarta Pusat (Onsite)',
    appliedDate: '02 Okt 2024',
    status: 'accepted',
    statusLabel: 'Diterima',
    statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    currentStep: 4,
  },
  {
    id: '4',
    appCode: '#CF-86419',
    jobTitle: 'UI Specialist',
    companyName: 'PT Gojek Tokopedia',
    companyTag: 'GT',
    companyTagBg: 'bg-slate-600 text-white',
    location: 'Jakarta Selatan (Hybrid)',
    appliedDate: '28 Sep 2024',
    status: 'rejected',
    statusLabel: 'Ditolak',
    statusClass: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    currentStep: 2,
  },
];

export default function JobseekerApplicationsView() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'interview' | 'accepted' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getMyApplications(1, 20)
      .then((res) => {
        if (res.items && res.items.length > 0) {
          const mapped: ApplicationItem[] = res.items.map((item) => ({
            id: item.id,
            appCode: `#CF-${item.id.slice(0, 5).toUpperCase()}`,
            jobTitle: item.job_title,
            companyName: item.company_name,
            companyTag: item.company_name.slice(0, 2).toUpperCase(),
            companyTagBg: 'bg-blue-600 text-white',
            location: 'Indonesia',
            appliedDate: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari ini',
            status: item.status === 'interview' ? 'interview' : item.status === 'hired' || item.status === 'offered' ? 'accepted' : item.status === 'rejected' ? 'rejected' : 'in_progress',
            statusLabel: item.status === 'interview' ? 'Interview' : item.status === 'hired' || item.status === 'offered' ? 'Diterima' : item.status === 'rejected' ? 'Ditolak' : 'Diproses',
            statusClass: item.status === 'interview' ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' : item.status === 'hired' || item.status === 'offered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' : item.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
            currentStep: item.status === 'interview' ? 3 : item.status === 'hired' || item.status === 'offered' ? 4 : 2,
            interviewTime: item.interview_scheduled_at ? new Date(item.interview_scheduled_at).toLocaleString('id-ID') : undefined,
            meetLink: item.interview_meeting_link || undefined,
            hrNote: item.interview_notes ? {
              hrName: 'Maya Amanda',
              hrRole: `Recruiter • ${item.company_name}`,
              hrTime: 'Terkini',
              message: item.interview_notes,
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
            } : undefined,
          }));

          setApplications(mapped);
          setSelectedApp(mapped[0]);
        } else {
          setApplications([]);
          setSelectedApp(null);
        }
      })
      .catch(() => {
        setApplications([]);
        setSelectedApp(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleWithdraw = async () => {
    if (!selectedApp) return;
    const reason = prompt('Masukkan alasan Anda membatalkan lamaran ini (opsional):', 'Telah menerima penawaran kerja lain');
    if (reason === null) return;
    try {
      await withdrawApplication(selectedApp.id, reason);
      alert('Lamaran berhasil ditarik/dibatalkan.');
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? { ...app, status: 'rejected', statusLabel: 'Dibatalkan Mandiri', statusClass: 'bg-rose-50 text-rose-700 border border-rose-200' }
            : app
        )
      );
      setSelectedApp((prev) =>
        prev ? { ...prev, status: 'rejected', statusLabel: 'Dibatalkan Mandiri', statusClass: 'bg-rose-50 text-rose-700 border border-rose-200' } : prev
      );
    } catch (err: any) {
      alert(err.message || 'Gagal membatalkan lamaran.');
    }
  };

  const handleRespondOffer = async (action: 'accept' | 'decline') => {
    if (!selectedApp) return;
    const confirmText = action === 'accept'
      ? 'Selamat! Apakah Anda yakin ingin MENERIMA penawaran kerja resmi ini?'
      : 'Apakah Anda yakin ingin MENOLAK penawaran kerja ini?';
    if (!confirm(confirmText)) return;

    try {
      await respondJobOffer(selectedApp.id, {
        action,
        response_notes: action === 'accept' ? 'Kandidat menerima penawaran kerja dan siap bergabung!' : 'Kandidat menolak penawaran kerja',
      });
      alert(action === 'accept' ? '🎉 Selamat! Anda telah resmi menerima penawaran kerja ini.' : 'Anda telah menolak penawaran kerja ini.');
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? {
                ...app,
                status: action === 'accept' ? 'accepted' : 'rejected',
                statusLabel: action === 'accept' ? 'Diterima (Hired)' : 'Offer Ditolak',
                statusClass: action === 'accept'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }
            : app
        )
      );
      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              status: action === 'accept' ? 'accepted' : 'rejected',
              statusLabel: action === 'accept' ? 'Diterima (Hired)' : 'Offer Ditolak',
              statusClass: action === 'accept'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }
          : prev
      );
    } catch (err: any) {
      alert(err.message || 'Gagal merespons penawaran kerja.');
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Lamaran Saya</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Lamaran Saya
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau status berkas, jadwal wawancara, dan progres lamaran kerja Anda secara realtime.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full w-fit">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Sinkronisasi otomatis aktif</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Semua</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {applications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('in_progress')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Diproses</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {applications.filter((a) => a.status === 'in_progress').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('interview')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'interview'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Interview</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-500 text-white font-extrabold">
            {applications.filter((a) => a.status === 'interview').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('accepted')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'accepted'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Diterima</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {applications.filter((a) => a.status === 'accepted').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Ditolak</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
            {applications.filter((a) => a.status === 'rejected').length}
          </span>
        </button>
      </div>

      {/* Main Split Layout: Left Applications List + Right Stepper Timeline Detail */}
      {isLoading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs flex flex-col items-center gap-2">
          <RotateCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Memuat data lamaran Anda dari server...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Send className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Belum Ada Lamaran Aktif</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Anda belum mengirimkan lamaran pekerjaan. Jelajahi puluhan lowongan kerja terverifikasi dan kirimkan lamaran Anda hari ini!
            </p>
          </div>
        </div>
      ) : selectedApp ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Daftar Pengajuan */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Daftar Pengajuan</h3>
              <span className="text-slate-400">Menampilkan {filteredApplications.length} dari {applications.length} lamaran</span>
            </div>

            <div className="space-y-3">
              {filteredApplications.map((item) => {
                const isSelected = selectedApp?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedApp(item)}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-600/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${item.companyTagBg} font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          {item.companyTag}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                            {item.jobTitle}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                            {item.companyName}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${item.statusClass}`}>
                        ● {item.statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-xs">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.appliedDate}
                      </span>

                      <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px] flex items-center gap-1">
                        {isSelected ? 'Sedang Ditinjau' : 'Lihat Detail'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Progres Tahapan Rekrutmen (Steppers & HR Note) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ID LAMARAN: {selectedApp.appCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedApp.statusClass}`}>
                    Tahap {selectedApp.statusLabel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {selectedApp.jobTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedApp.companyName} • {selectedApp.location}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-400 block text-[10px]">Diajukan Pada</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {selectedApp.appliedDate}
                </span>
              </div>
            </div>

          {/* Stepper Timeline: Progres Tahapan Rekrutmen */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Progres Tahapan Rekrutmen
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {/* Step 1: Lamaran Terkirim */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white dark:ring-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Tahap 1: Lamaran Terkirim
                    </h4>
                    <span className="text-[11px] text-slate-400">18 Okt 2024 • 10:15 WIB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Berkas CV, portofolio digital, dan formulir aplikasi berhasil diterima oleh sistem tracking {selectedApp.companyName}.
                  </p>
                </div>
              </div>

              {/* Step 2: Screening Berkas & Direview HR */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white dark:ring-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Tahap 2: Screening Berkas & Direview HR
                    </h4>
                    <span className="text-[11px] text-slate-400">20 Okt 2024 • 14:00 WIB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Profil dan portofolio dinilai memenuhi standar teknis awal. Berkas diteruskan ke tim engineering untuk sesi wawancara.
                  </p>
                </div>
              </div>

              {/* Step 3: Wawancara User & HR (Active / Sedang Berjalan) */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-4 ring-white dark:ring-slate-900">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                        Tahap 3: Wawancara User & HR (Interview)
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white">
                        Sedang Berjalan
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 block">
                    {selectedApp.interviewTime || '25 Okt 2024 • 13:30 WIB'}
                  </span>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Wawancara kompetensi teknis arsitektur React/Next.js bersama Lead Engineer & Talent Acquisition Specialist secara daring.
                  </p>

                  {/* Virtual Room Card */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                          Google Meet Virtual Room
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {selectedApp.meetLink || 'meet.google.com/xyz-wuvq-bdr'}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`https://${selectedApp.meetLink || 'meet.google.com'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Google Meet</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Step 4: Penawaran Kerja & Hasil Akhir */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 flex items-center justify-center text-[10px] ring-4 ring-white dark:ring-slate-900">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-500 dark:text-slate-400">
                      Tahap 4: Penawaran Kerja & Hasil Akhir
                    </h4>
                    <span className="text-[11px] text-slate-400">Menunggu Tahap 3</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    Keputusan penawaran gaji resmi (Offering Letter) dan kesepakatan kontrak kerja setelah evaluasi hasil wawancara komprehensif.
                  </p>

                  {/* Offering Decision Card */}
                  <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Surat Penawaran Kerja (Offering Letter) Diterbitkan</span>
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                        Rp 18.000.000 / bln
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-200">
                      Perusahaan telah mengajukan penawaran kerja resmi. Silakan tinjau dan tentukan keputusan Anda.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRespondOffer('accept')}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        ✓ Terima Penawaran
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRespondOffer('decline')}
                        className="py-1.5 px-3 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                      >
                        ✕ Tolak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HR Chat Message Box */}
          {selectedApp.hrNote && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    MA
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      {selectedApp.hrNote.hrName}
                    </h5>
                    <span className="text-[10px] text-slate-400">{selectedApp.hrNote.hrRole}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{selectedApp.hrNote.hrTime}</span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{selectedApp.hrNote.message}"
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Unduh Berkas Lamaran</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWithdraw}
                className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Batalkan lamaran ini jika sudah diterima di tempat lain"
              >
                <span>Tarik Lamaran</span>
              </button>

              <button
                type="button"
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Hubungi Rekruter</span>
              </button>

              <a
                href={`https://${selectedApp.meetLink || 'meet.google.com'}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Masuk Ruang Temu</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    ) : null}
  </div>
  );
}

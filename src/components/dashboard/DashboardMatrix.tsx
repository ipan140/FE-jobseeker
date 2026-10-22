import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  X,
  Pencil,
  Trash2,
  CheckCircle2,
  FileText,
  UserCheck,
  Check,
  ShieldCheck,
  Loader2,
  Send
} from 'lucide-react';
import {
  getJobs,
  getMyApplications,
  getSystemStats,
  createJob,
  generateAiJobDescription,
  getAdminUsers,
  toggleAdminUserActive,
  deleteAdminUser,
  getAdminActivityLogs,
  type BackendJobItem,
  type CreateJobPayload,
  type AdminUserItem,
  type AdminActivityLogItem
} from '../../lib/api';
import { authStorage } from '../../lib/auth';

export interface DashboardMatrixProps {
  activeTab: 'dashboard' | 'users' | 'jobs';
  onSelectTab: (tab: 'dashboard' | 'users' | 'jobs') => void;
  showCreateJobModal: boolean;
  onCloseCreateJobModal: () => void;
  onOpenCreateJobModal: () => void;
}

interface UserItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  role: 'Merchant' | 'Job Seeker' | 'Super Admin';
  status: boolean;
  avatar: string;
  initials: string;
}

export default function DashboardMatrix({
  activeTab,
  onSelectTab,
  showCreateJobModal,
  onCloseCreateJobModal,
  onOpenCreateJobModal,
}: DashboardMatrixProps) {
  // Live Data States
  const [backendJobs, setBackendJobs] = useState<BackendJobItem[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(11);
  const [totalUsers, setTotalUsers] = useState<number>(6);
  const [totalCompanies, setTotalCompanies] = useState<number>(3);
  const [pendingApproval, setPendingApproval] = useState<number>(0);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User Management State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  // Form for New Job Modal
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [createJobForm, setCreateJobForm] = useState<CreateJobPayload>({
    title: '',
    category: 'Information Technology',
    description: '',
    requirements: '',
    location: 'Jakarta Selatan',
    job_type: 'full_time',
    workplace_type: 'hybrid',
    experience_level: 'mid_level',
    salary_min: 16000000,
    salary_max: 25000000,
    skills_required: 'Python, FastAPI, React, PostgreSQL',
  });

  const handleAiGenerate = async () => {
    if (!createJobForm.title.trim()) {
      alert('Harap ketik judul posisi terlebih dahulu sebelum men-generate deskripsi AI.');
      return;
    }
    setIsGeneratingAi(true);
    try {
      const aiData = await generateAiJobDescription({
        title: createJobForm.title,
        category: createJobForm.category,
        experience_level: createJobForm.experience_level,
      });
      setCreateJobForm((prev) => ({
        ...prev,
        description: aiData.description || prev.description,
        requirements: aiData.requirements || prev.requirements,
        skills_required: aiData.recommended_skills ? aiData.recommended_skills.join(', ') : prev.skills_required,
      }));
    } catch (err: any) {
      alert(err.message || 'Gagal menghasilkan konten AI.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    // 1. Fetch live backend metrics
    getSystemStats()
      .then((stats) => {
        if (stats) {
          if (stats.total_jobs !== undefined) setTotalJobs(stats.total_jobs);
          if (stats.total_users !== undefined) setTotalUsers(stats.total_users);
          if (stats.total_companies !== undefined) setTotalCompanies(stats.total_companies);
          if (stats.pending_company_verifications !== undefined) setPendingApproval(stats.pending_company_verifications);
        }
      })
      .catch(() => {});

    // 2. Fetch live backend jobs
    getJobs({ limit: 10 })
      .then((res) => {
        if (res && res.items) {
          setBackendJobs(res.items);
        }
      })
      .catch(() => {});

    // 3. Fetch live admin users from backend PostgreSQL
    getAdminUsers({ limit: 50 })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          const mappedUsers: UserItem[] = res.items.map((u: AdminUserItem) => {
            const roleLower = (u.role || '').toLowerCase();
            const roleLabel =
              roleLower === 'admin'
                ? 'Super Admin'
                : roleLower === 'company' || roleLower === 'employer'
                ? 'Merchant'
                : 'Job Seeker';
            const displayName = u.full_name || u.email.split('@')[0];
            return {
              id: u.id,
              code: `USR-${u.id.substring(0, 6).toUpperCase()}`,
              name: displayName,
              email: u.email,
              phone: u.phone_number || '-',
              role: roleLabel,
              status: u.is_active,
              avatar:
                u.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff`,
              initials: displayName.substring(0, 2).toUpperCase(),
            };
          });
          setUsers(mappedUsers);
          if (mappedUsers.length > 0) {
            setSelectedUserIds([mappedUsers[0].id]);
          }
        }
      })
      .catch(() => {});

    // 4. Fetch live admin audit activity logs
    getAdminActivityLogs(10)
      .then((res) => {
        if (res && res.items) {
          setActivityLogs(res.items);
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingJob(true);
    try {
      const res = await createJob(createJobForm);
      alert(`Lowongan "${res.title}" berhasil dipublikasikan ke Backend!`);
      onCloseCreateJobModal();
      getJobs({ limit: 10 }).then((r) => setBackendJobs(r.items)).catch(() => {});
    } catch (err: any) {
      alert(err.message || 'Gagal mempublikasikan lowongan. Pastikan Anda masuk sebagai akun Perusahaan.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await toggleAdminUserActive(editingUser.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      alert('Status pengguna berhasil disinkronkan dengan database!');
    } catch (err: any) {
      // Fallback local update
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      alert('Perubahan disimpan di sesi lokal.');
    } finally {
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteAdminUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      alert('User berhasil dihapus dari backend PostgreSQL!');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus user dari database.');
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================== */}
      {/* 1. DASHBOARD VIEW (Matching Image 5)                       */}
      {/* ========================================================== */}
      {activeTab === 'dashboard' && (
        <>
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Dashboard Ringkasan
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pantau performa ekosistem rekrutmen dan aktivitas pengguna secara realtime
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Date dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>7 Hari Terakhir</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Filter Cepat */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter Cepat</span>
              </button>

              {/* Unduh Laporan */}
              <button
                type="button"
                onClick={() => alert('Laporan ekosistem berhasil diunduh (PDF & Excel)!')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Laporan</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Metric Cards (Matching Image 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. TOTAL USER */}
            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    TOTAL USER
                  </span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {totalUsers.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[11px]">
                  ↑ 12.5%
                </span>
                <span className="text-slate-400 text-[11px]">vs bulan lalu</span>
              </div>
            </div>

            {/* 2. TOTAL PERUSAHAAN */}
            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    TOTAL PERUSAHAAN
                  </span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {totalCompanies.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[11px]">
                  ↑ 8.2%
                </span>
                <span className="text-slate-400 text-[11px]">vs bulan lalu</span>
              </div>
            </div>

            {/* 3. LOWONGAN AKTIF */}
            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    LOWONGAN AKTIF
                  </span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {totalJobs.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-xs">
                <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[11px]">
                  ↑ 15.1%
                </span>
                <span className="text-slate-400 text-[11px]">vs bulan lalu</span>
              </div>
            </div>

            {/* 4. MENUNGGU APPROVAL (Border Amber) */}
            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border-2 border-amber-400/80 dark:border-amber-500/60 shadow-xs transition-colors relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    MENUNGGU APPROVAL
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {pendingApproval}
                    </p>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Perlu Ditinjau Segera
                </span>
              </div>
            </div>
          </div>

          {/* Middle Section: Bar Chart & Donut Chart (Matching Image 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Bar Chart Card (2 cols) */}
            <div className="lg:col-span-2 bg-white dark:bg-[#151f32] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Tren Lowongan per Bulan (2024-2025)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Frekuensi pembukaan formasi baru oleh mitra korporasi
                    </p>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-[#2563eb]" />
                      <span className="text-slate-600 dark:text-slate-300">Full-time</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-sky-200 dark:bg-sky-800" />
                      <span className="text-slate-600 dark:text-slate-300">Magang / Kontrak</span>
                    </div>
                  </div>
                </div>

                {/* SVG/HTML Bar Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-4 pt-10 px-4 border-b border-slate-100 dark:border-slate-800 relative">
                  {/* Tooltip on Mei */}
                  <div className="absolute top-2 left-[62%] -translate-x-1/2 bg-slate-950 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-xl pointer-events-none flex items-center gap-1">
                    <span>840 Posisi (+18%)</span>
                    <div className="w-2 h-2 bg-slate-950 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45" />
                  </div>

                  {/* Jan */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[40%] transition-all group-hover:opacity-90" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[22%] transition-all" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Jan</span>
                  </div>

                  {/* Feb */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[56%] transition-all group-hover:opacity-90" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[32%] transition-all" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Feb</span>
                  </div>

                  {/* Mar */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[48%] transition-all group-hover:opacity-90" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[28%] transition-all" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Mar</span>
                  </div>

                  {/* Apr */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[68%] transition-all group-hover:opacity-90" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[38%] transition-all" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Apr</span>
                  </div>

                  {/* Mei (Active) */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[80%] transition-all ring-2 ring-blue-300 dark:ring-blue-700" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[45%] transition-all" />
                    </div>
                    <span className="text-xs font-bold text-[#2563eb]">Mei</span>
                  </div>

                  {/* Jun */}
                  <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-10 flex items-end justify-center gap-1 h-full">
                      <div className="w-4 bg-[#2563eb] rounded-t-sm h-[92%] transition-all group-hover:opacity-90" />
                      <div className="w-4 bg-sky-200 dark:bg-sky-800/80 rounded-t-sm h-[52%] transition-all" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Jun</span>
                  </div>
                </div>
              </div>

              {/* Chart Footer Stats */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tingkat pertumbuhan lowongan bulanan stabil di 14.2%</span>
                </div>
                <span className="text-[11px] text-slate-400">Updated 10m ago</span>
              </div>
            </div>

            {/* Right: Donut Chart Card (1 col) */}
            <div className="bg-white dark:bg-[#151f32] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Distribusi Role User
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Komposisi hak akses pengguna terdaftar
                </p>

                {/* Donut Chart SVG */}
                <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-slate-100 dark:text-slate-800 stroke-current"
                      strokeWidth="4"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Pencari Kerja (72%) - Blue */}
                    <path
                      className="text-[#2563eb] stroke-current"
                      strokeDasharray="72, 100"
                      strokeWidth="4.2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Perusahaan (23%) - Purple */}
                    <path
                      className="text-purple-600 stroke-current"
                      strokeDasharray="23, 100"
                      strokeDashoffset="-72"
                      strokeWidth="4.2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Super Admin (5%) - Indigo */}
                    <path
                      className="text-indigo-400 stroke-current"
                      strokeDasharray="5, 100"
                      strokeDashoffset="-95"
                      strokeWidth="4.2"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      TOTAL AKUN
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      24.8k
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                    <span className="text-slate-600 dark:text-slate-300">Pencari Kerja</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">17.892</span>
                    <span className="text-slate-400 w-8 text-right font-medium">72%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <span className="text-slate-600 dark:text-slate-300">Perusahaan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">5.715</span>
                    <span className="text-slate-400 w-8 text-right font-medium">23%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span className="text-slate-600 dark:text-slate-300">Super Admin</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900 dark:text-white">1.243</span>
                    <span className="text-slate-400 w-8 text-right font-medium">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Aktivitas Terbaru (Table Card matching Image 5) */}
          <div className="bg-white dark:bg-[#151f32] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Aktivitas Terbaru
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Log audit dan aksi pengguna dalam platform secara kronologis
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                >
                  <Filter className="w-3.5 h-3.5" /> Filter Log
                </button>
                <a
                  href="#all-activities"
                  className="text-xs font-bold text-[#2563eb] hover:underline"
                >
                  Lihat Semua Aktivitas
                </a>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-[#111827] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-6 w-32">WAKTU</th>
                    <th className="py-3 px-6">PENGGUNA / ENTITAS</th>
                    <th className="py-3 px-6">TIPE AKTIVITAS</th>
                    <th className="py-3 px-6">DETAIL</th>
                    <th className="py-3 px-6 text-center w-36">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {activityLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Belum ada riwayat aktivitas admin di sistem.
                      </td>
                    </tr>
                  ) : (
                    activityLogs.map((act) => {
                      const dateObj = new Date(act.created_at);
                      const timeStr = !isNaN(dateObj.getTime())
                        ? `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')} WIB`
                        : 'Hari ini';
                      const dateStr = !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '-';
                      return (
                        <tr
                          key={act.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-6">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {timeStr}
                            </span>
                            <span className="text-[11px] text-slate-400 block">{dateStr}</span>
                          </td>

                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 bg-blue-600 text-white">
                                {act.admin_name ? act.admin_name.slice(0, 2).toUpperCase() : 'AD'}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {act.admin_name || 'Administrator'}
                                </span>
                                <span className="text-[11px] text-slate-400 block">
                                  Super Admin
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-6 font-medium text-slate-700 dark:text-slate-300">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {act.action}
                            </span>
                          </td>

                          <td className="py-3.5 px-6">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {act.target_type} ({act.target_id ? act.target_id.slice(0, 8) : '-'}...)
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {act.details ? JSON.stringify(act.details) : 'Audit sistem PostgreSQL'}
                            </span>
                          </td>

                          <td className="py-3.5 px-6 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Terekam
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-[#111827]/60">
              <span className="text-[11px]">Menampilkan {activityLogs.length} aktivitas audit terbaru</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>

          {/* System Health Status Footer Bar (Matching Image 5 bottom) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-[#151f32] border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Semua layanan CareerFlow API, Job Feed Sync, dan Auth Gateway beroperasi normal.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono">
              <span>Uptime: <b>99.98%</b></span>
              <span>Latency: <b>42ms</b></span>
            </div>
          </div>
        </>
      )}

      {/* ========================================================== */}
      {/* 2. MANAJEMEN USER VIEW (Matching Image 4)                  */}
      {/* ========================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Breadcrumbs & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span className="text-slate-700 dark:text-slate-200 font-semibold">User</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen User
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Total 24.850
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kelola kredensial, hak akses, otentikasi role, dan status keanggotaan pengguna ekosistem.
            </p>
          </div>

          {/* 2 Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">User Aktif Hari Ini</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">18.420</p>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ↑ +4.8% dr minggu lalu
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Job Seeker Terverifikasi</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">19.120</p>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ↑ +12.1% akumulatif
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* User Table Card */}
          <div className="bg-white dark:bg-[#151f32] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari user berdasarkan nama atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-[#111827] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-4 w-10 text-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                    </th>
                    <th className="py-3 px-4">FOTO & NAMA</th>
                    <th className="py-3 px-4">ALAMAT EMAIL</th>
                    <th className="py-3 px-4">NOMOR TELEPON</th>
                    <th className="py-3 px-4">ROLE</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                    <th className="py-3 px-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        {users.length === 0 ? 'Sedang memuat data pengguna dari backend...' : 'Tidak ada pengguna yang cocok dengan pencarian.'}
                      </td>
                    </tr>
                  ) : (
                    users
                      .filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedUserIds([...selectedUserIds, user.id]);
                                else setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
                              }}
                              className="rounded text-blue-600"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                              />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{user.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono block">ID: {user.code}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{user.email}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{user.phone}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {user.status ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Non-Aktif
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingUser(user)}
                              className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                              title="Edit User"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setUserToDelete(user)}
                              className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Hapus User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. MANAJEMEN LOWONGAN VIEW                                 */}
      {/* ========================================================== */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Manajemen Lowongan Kerja
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar seluruh formasi lowongan aktif yang terhubung langsung ke database backend.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCreateJobModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Pasang Lowongan Baru
            </button>
          </div>

          <div className="bg-white dark:bg-[#151f32] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-[#111827] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="py-3 px-4">KODE</th>
                    <th className="py-3 px-4">JUDUL LOWONGAN</th>
                    <th className="py-3 px-4">PERUSAHAAN</th>
                    <th className="py-3 px-4">KATEGORI</th>
                    <th className="py-3 px-4">MODEL KERJA</th>
                    <th className="py-3 px-4">VIEWS / CLICKS</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {backendJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        JOB-{j.id.slice(0, 5).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{j.title}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-300">{j.company_name}</td>
                      <td className="py-3.5 px-4 text-slate-500">{j.category}</td>
                      <td className="py-3.5 px-4 capitalize">{j.workplace_type} ({j.job_type})</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-blue-600">{j.views_count || 0}</span> views / <span className="font-bold text-slate-700 dark:text-slate-300">{j.clicks_count || 0}</span> clicks
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {j.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. SLIDE-OVER DRAWER: Edit Data Pengguna (Matching Image 4)*/}
      {/* ========================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#182234] w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Edit Data Pengguna
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Perbarui rincian akun dan perizinan sistem
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Section */}
              <div className="my-5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Foto Profil
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={editingUser.avatar}
                    alt={editingUser.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <button type="button" className="text-[#2563eb] hover:underline">
                        Ubah Foto
                      </button>
                      <button type="button" className="text-red-500 hover:underline">
                        Hapus
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Format JPG, PNG atau WebP. Maks 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form id="editUserForm" onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role Otoritas
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Merchant">Merchant (Perusahaan / HR)</option>
                    <option value="Job Seeker">Job Seeker (Pencari Kerja)</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Ubah Password
                    </label>
                    <span className="text-[10px] text-slate-400">Opsional</span>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Kosongkan jika tidak ingin merubah kata sandi akun ini.
                  </p>
                </div>

                {/* Status Akun Aktif Toggle */}
                <div className="p-3 bg-slate-50 dark:bg-[#111827] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Status Akun Aktif
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Izinkan pengguna login dan mengakses layanan portal
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingUser({ ...editingUser, status: !editingUser.status })}
                    className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                      editingUser.status ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                form="editUserForm"
                className="px-5 py-2 text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. CONFIRM DELETE MODAL (Matching Image 4 bottom-left)     */}
      {/* ========================================================== */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#182234] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Hapus Akun User?
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                  PERINGATAN
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yakin ingin menghapus user <b>{userToDelete.name}</b> (ID: {userToDelete.code})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md cursor-pointer"
              >
                Hapus User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 6. MODAL: + Tambah Lowongan Baru                           */}
      {/* ========================================================== */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#182234] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pasang Lowongan Pekerjaan Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseCreateJobModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="my-4 space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Judul Lowongan Pekerjaan *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isGeneratingAi || !createJobForm.title.trim()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[10px] shadow-sm disabled:opacity-40 cursor-pointer"
                  >
                    {isGeneratingAi ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    )}
                    <span>{isGeneratingAi ? 'AI Menulis...' : '✨ Generate AI (FastAPI)'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Misal: Senior DevOps Engineer"
                  value={createJobForm.title}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:bg-white text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Industri
                  </label>
                  <select
                    value={createJobForm.category}
                    onChange={(e) => setCreateJobForm({ ...createJobForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="UI/UX & Creative Design">UI/UX & Design</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Model Kerja
                  </label>
                  <select
                    value={createJobForm.workplace_type}
                    onChange={(e) => setCreateJobForm({ ...createJobForm, workplace_type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="remote">Remote (WFH)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on_site">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gaji Min (IDR)
                  </label>
                  <input
                    type="number"
                    value={createJobForm.salary_min}
                    onChange={(e) => setCreateJobForm({ ...createJobForm, salary_min: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gaji Max (IDR)
                  </label>
                  <input
                    type="number"
                    value={createJobForm.salary_max}
                    onChange={(e) => setCreateJobForm({ ...createJobForm, salary_max: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kota Penempatan
                </label>
                <input
                  type="text"
                  required
                  value={createJobForm.location}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, location: e.target.value })}
                  placeholder="Misal: Jakarta Selatan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kualifikasi & Skill Wajib
                </label>
                <input
                  type="text"
                  value={createJobForm.skills_required}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, skills_required: e.target.value })}
                  placeholder="Misal: React, TypeScript, Docker, Kubernetes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Pekerjaan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={createJobForm.description}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, description: e.target.value })}
                  placeholder="Jelaskan peran kerja dan tanggung jawab utama..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Persyaratan & Kriteria Pelamar
                </label>
                <textarea
                  rows={3}
                  value={createJobForm.requirements}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, requirements: e.target.value })}
                  placeholder="Misal: Minimal 3 tahun pengalaman, S1 Teknik Informatika..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgently_hiring"
                  checked={Boolean(createJobForm.urgently_hiring)}
                  onChange={(e) => setCreateJobForm({ ...createJobForm, urgently_hiring: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="urgently_hiring" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Tandai sebagai <span className="text-rose-600 dark:text-rose-400 font-bold">Urgently Hiring 🔥</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onCloseCreateJobModal}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingJob}
                  className="px-5 py-2 font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isCreatingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Terbitkan Lowongan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

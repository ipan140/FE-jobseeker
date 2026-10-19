import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Loader2,
  Building2,
  DollarSign
} from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import Navbar from './dashboard/Navbar';
import Footer from './dashboard/Footer';
import {
  getMyApplications,
  updateApplicationStatus,
  type BackendApplicationItem
} from '../lib/api';
import { authStorage } from '../lib/auth';

export default function ApplicantsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [applications, setApplications] = useState<BackendApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      if (authStorage.isAuthenticated()) {
        const res = await getMyApplications(1, 20);
        if (res && res.items) {
          setApplications(res.items);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchSearch =
      (app.job_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.applicant_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter ? app.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'interview') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Interview
        </span>
      );
    }
    if (s === 'offered' || s === 'hired') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 uppercase">
          {status}
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300 uppercase">
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-300 capitalize">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activePath="/applicants"
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-[72px]' : 'pl-64'
        }`}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title="Daftar Pelamar & Riwayat Lamaran"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Riwayat Lamaran & Pipeline ATS
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pantau proses seleksi, jadwal interview, tes skill, dan surat penawaran kerja (Offering Letter).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchApplications()}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#151f32] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
              >
                Refresh Status
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#151f32] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <div className="relative min-w-[260px] flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari posisi kerja atau perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="applied">Applied</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* List of Applications */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-xs">Memuat lamaran dari backend...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white dark:bg-[#151f32] p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Belum ada berkas lamaran aktif
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum mengirimkan lamaran pekerjaan atau belum masuk ke sesi akun pelamar.
              </p>
              <a
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all"
              >
                Jelajahi Lowongan Kerja Sekarang
              </a>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-[#151f32] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-orange-500/40"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {app.job_title}
                      </h3>
                      {renderStatusBadge(app.status)}
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {app.company_name}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Dilamar pada: {new Date(app.created_at).toLocaleDateString('id-ID')}</span>
                      {app.expected_salary && (
                        <span>Ekspektasi: Rp {(app.expected_salary / 1000000).toFixed(0)}.000.000</span>
                      )}
                    </div>
                  </div>

                  {/* Actions / Meeting Link */}
                  <div className="flex items-center gap-2 shrink-0">
                    {app.interview_meeting_link && (
                      <a
                        href={app.interview_meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Masuk Sesi Interview
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => alert(`ID Lamaran: ${app.id}\nCatatan HR: ${app.interview_notes || 'Menunggu verifikasi lebih lanjut.'}`)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Detail Riwayat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

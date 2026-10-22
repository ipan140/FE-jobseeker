import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowRight,
  FileText,
  UserCheck,
  UserX,
  Phone,
  Mail,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Download,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
  Trophy
} from 'lucide-react';
import {
  getJobAtsPipeline,
  updateApplicationStatus,
  exportJobApplicantsCsv,
  getApplicantAiSummary,
  scheduleInterview,
  makeJobOffer,
  type AtsPipelineResponse,
  type BackendApplicationItem,
  type AICandidateSummaryResponse
} from '../../lib/api';

interface MerchantAtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

const STAGE_LABELS: Record<string, { label: string; color: string; border: string }> = {
  applied: { label: 'Terkirim (Applied)', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  screening: { label: 'Screening', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  interview: { label: 'Interview', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  offered: { label: 'Offering', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  accepted: { label: 'Hired / Diterima', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  rejected: { label: 'Ditolak', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
};

export default function MerchantAtsModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}: MerchantAtsModalProps) {
  const [pipeline, setPipeline] = useState<AtsPipelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // AI Screening Summary State
  const [aiSummary, setAiSummary] = useState<AICandidateSummaryResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const fetchPipeline = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getJobAtsPipeline(jobId);
      setPipeline(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat pipeline ATS. Pastikan Anda telah login sebagai Perusahaan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jobId) {
      fetchPipeline();
    }
  }, [isOpen, jobId]);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await exportJobApplicantsCsv(jobId, jobTitle);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunduh CSV pelamar.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadAiSummary = async (applicationId: string) => {
    setIsLoadingAi(true);
    try {
      const summary = await getApplicantAiSummary(applicationId);
      setAiSummary(summary);
    } catch (err: any) {
      alert(err.message || 'Gagal membuat ringkasan AI pelamar.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleMoveStage = async (applicationId: string, nextStatus: string) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, nextStatus);
      await fetchPipeline();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status pelamar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleScheduleInterviewClick = async (appId: string) => {
    const meetLink = prompt('Masukkan Link Google Meet / Zoom Wawancara:', 'meet.google.com/xyz-wuvq-bdr');
    if (!meetLink) return;
    const timeStr = prompt('Masukkan Waktu Wawancara (YYYY-MM-DD HH:mm):', '2026-10-25 14:00');
    if (!timeStr) return;

    setUpdatingId(appId);
    try {
      await scheduleInterview(appId, {
        interview_meeting_link: meetLink,
        interview_scheduled_at: new Date(timeStr.replace(' ', 'T')).toISOString(),
        interview_notes: 'Wawancara teknis dan diskusi studi kasus bersama Lead Engineer.',
      });
      alert('Jadwal wawancara berhasil ditetapkan! Undangan otomatis masuk ke dasbor pelamar.');
      await fetchPipeline();
    } catch (err: any) {
      alert(err.message || 'Gagal menjadwalkan wawancara.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMakeOfferClick = async (appId: string) => {
    const salaryStr = prompt('Masukkan Nominal Gaji Bersih/Kotor Bulanan (Rp):', '18000000');
    if (!salaryStr) return;
    const salary = parseInt(salaryStr, 10);
    if (isNaN(salary) || salary <= 0) {
      alert('Nominal gaji tidak valid.');
      return;
    }
    const startDate = prompt('Perkiraan Tanggal Mulai Bekerja (YYYY-MM-DD):', '2026-11-01') || '2026-11-01';

    setUpdatingId(appId);
    try {
      await makeJobOffer(appId, {
        offered_salary: salary,
        offer_start_date: startDate,
        offer_notes: 'Paket remunerasi: Gaji bulanan, BPJS Ketenagakerjaan & Kesehatan, asuransi jiwa, dan tunjangan kerja fleksibel.',
      });
      alert(`Surat penawaran kerja (Offering Letter: Rp ${salary.toLocaleString('id-ID')}) resmi terkirim!`);
      await fetchPipeline();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat surat penawaran kerja.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  // Flatten or count candidates
  const stageKeys = ['applied', 'screening', 'interview', 'offered', 'accepted', 'rejected'];
  const totalCandidates = pipeline?.stages
    ? stageKeys.reduce((acc, k) => acc + ((pipeline.stages as any)[k]?.length || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  ATS Pipeline: {jobTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {totalCandidates} Pelamar
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindahkan tahapan kandidat secara real-time dari screening hingga hiring.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Unduh daftar pelamar ke format CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>{isExporting ? 'Mengunduh...' : 'Ekspor CSV'}</span>
            </button>
            <button
              type="button"
              onClick={fetchPipeline}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              title="Muat Ulang Pipeline"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="m-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Stage Filter Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-xs font-bold pb-2">
          <button
            type="button"
            onClick={() => setActiveStage('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeStage === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua Tahapan ({totalCandidates})
          </button>
          {stageKeys.map((sKey) => {
            const count = (pipeline?.stages as any)?.[sKey]?.length || 0;
            return (
              <button
                key={sKey}
                type="button"
                onClick={() => setActiveStage(sKey)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeStage === sKey
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{STAGE_LABELS[sKey]?.label.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Pipeline Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs font-semibold">Memuat kandidat dari FastAPI ATS...</p>
            </div>
          ) : totalCandidates === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-30" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada pelamar pada lowongan ini
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Kandidat yang melamar via portal CareerFlow akan otomatis muncul di tahapan Applied ini.
              </p>
            </div>
          ) : (
            /* Kanban / Grid of Applicants */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stageKeys
                .filter((sKey) => activeStage === 'all' || activeStage === sKey)
                .map((sKey) => {
                  const applicants: BackendApplicationItem[] = (pipeline?.stages as any)?.[sKey] || [];
                  if (activeStage === 'all' && applicants.length === 0) return null;

                  return applicants.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
                    >
                      <div>
                        {/* Top: Status & Date */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STAGE_LABELS[app.status]?.color || 'bg-slate-100 text-slate-600'}`}>
                            {STAGE_LABELS[app.status]?.label || app.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(app.applied_at || (app as any).created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        {/* Candidate Info */}
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {app.jobseeker_name || 'Pelamar CareerFlow'}
                        </h4>
                        
                        <div className="space-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {app.jobseeker_email && (
                            <div className="flex items-center gap-1.5 truncate">
                              <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">{app.jobseeker_email}</span>
                            </div>
                          )}
                          {app.jobseeker_phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span>{app.jobseeker_phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Resume & AI Screening Action */}
                        <div className="mt-3 flex items-center gap-2">
                          {app.resume_url ? (
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[11px] font-bold hover:underline"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat CV</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400">CV Profil Digital</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleLoadAiSummary(app.id)}
                            disabled={isLoadingAi}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                            title="Analisis kecocokan profil pelamar dengan AI"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>AI Summary</span>
                          </button>
                        </div>
                      </div>

                      {/* Move Stage Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Ubah Status ATS:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {app.status !== 'screening' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleMoveStage(app.id, 'screening')}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold cursor-pointer"
                            >
                              Screening
                            </button>
                          )}
                          {app.status !== 'interview' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleScheduleInterviewClick(app.id)}
                              className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-bold cursor-pointer"
                              title="Jadwalkan wawancara dan tentukan link pertemuan"
                            >
                              Jadwal Interview
                            </button>
                          )}
                          {app.status !== 'offered' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleMakeOfferClick(app.id)}
                              className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-bold cursor-pointer"
                              title="Terbitkan Surat Penawaran Kerja (Offering Letter)"
                            >
                              Buat Offer
                            </button>
                          )}
                          {app.status !== 'accepted' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleMoveStage(app.id, 'accepted')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold cursor-pointer"
                            >
                              Terima (Hired)
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleMoveStage(app.id, 'rejected')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-bold cursor-pointer"
                            >
                              Tolak
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ));
                })}
            </div>
          )}
        </div>

        {/* AI Candidate Summary Modal Overlay */}
        {aiSummary && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      AI Screening: {aiSummary.candidate_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluasi kesesuaian posisi {aiSummary.job_title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiSummary(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Score & Verdict */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hasil Keputusan AI</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {aiSummary.match_verdict}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Skor Match</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {aiSummary.overall_score}%
                    </span>
                  </div>
                </div>

                {/* Key Strengths */}
                {aiSummary.key_strengths && aiSummary.key_strengths.length > 0 && (
                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Kekuatan Utama (Key Strengths)</span>
                    </h5>
                    <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                      {aiSummary.key_strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Potential Gaps */}
                {aiSummary.potential_gaps && aiSummary.potential_gaps.length > 0 && (
                  <div>
                    <h5 className="font-extrabold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Catatan Pertimbangan (Potential Gaps)</span>
                    </h5>
                    <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                      {aiSummary.potential_gaps.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Interview Questions */}
                {aiSummary.recommended_interview_questions && aiSummary.recommended_interview_questions.length > 0 && (
                  <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                    <h5 className="font-extrabold text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Rekomendasi Pertanyaan Wawancara AI</span>
                    </h5>
                    <ol className="space-y-1.5 list-decimal list-inside text-blue-800 dark:text-blue-200/90 text-[11px]">
                      {aiSummary.recommended_interview_questions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-right bg-slate-50 dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => setAiSummary(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                >
                  Tutup Ringkasan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

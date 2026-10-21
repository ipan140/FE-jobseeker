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
  AlertCircle
} from 'lucide-react';
import {
  getJobAtsPipeline,
  updateApplicationStatus,
  type AtsPipelineResponse,
  type BackendApplicationItem
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

                        {/* Resume Link */}
                        {app.resume_url && (
                          <div className="mt-3">
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[11px] font-bold hover:underline"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Lihat Resume CV</span>
                            </a>
                          </div>
                        )}
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
                              onClick={() => handleMoveStage(app.id, 'interview')}
                              className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-bold cursor-pointer"
                            >
                              Interview
                            </button>
                          )}
                          {app.status !== 'offered' && (
                            <button
                              type="button"
                              disabled={updatingId === app.id}
                              onClick={() => handleMoveStage(app.id, 'offered')}
                              className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-bold cursor-pointer"
                            >
                              Offering
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
      </div>
    </div>
  );
}

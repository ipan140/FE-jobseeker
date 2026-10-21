import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  RefreshCw,
  Zap,
  BookOpen
} from 'lucide-react';
import {
  getAssessments,
  getAssessmentDetail,
  submitAssessment,
  getMyAssessmentResults,
  type AssessmentItem,
  type AssessmentDetailItem,
  type AssessmentResultItem
} from '../../lib/api';

interface SkillAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  onOpenAuthModal?: () => void;
}

export default function SkillAssessmentModal({
  isOpen,
  onClose,
  isAuthenticated = false,
  onOpenAuthModal,
}: SkillAssessmentModalProps) {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [myResults, setMyResults] = useState<AssessmentResultItem[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<'catalog' | 'test' | 'result'>('catalog');
  
  // Test Taking State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<AssessmentResultItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCatalog();
      if (isAuthenticated) {
        loadMyResults();
      }
    }
  }, [isOpen, isAuthenticated]);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const data = await getAssessments();
      setAssessments(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyResults = async () => {
    try {
      const results = await getMyAssessmentResults();
      setMyResults(results);
    } catch {
      // ignore
    }
  };

  const handleStartTest = async (testId: string) => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const detail = await getAssessmentDetail(testId);
      if (!detail || !detail.questions || detail.questions.length === 0) {
        setErrorMsg('Tes ini belum memiliki butir pertanyaan yang aktif.');
        setIsLoading(false);
        return;
      }
      setSelectedAssessment(detail);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setActiveStep('test');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memuat tes keahlian.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitTest = async () => {
    if (!selectedAssessment) return;

    // Build payload
    const answersList = Object.entries(userAnswers).map(([qId, idx]) => ({
      question_id: qId,
      selected_option_index: idx,
    }));

    if (answersList.length < selectedAssessment.questions.length) {
      if (!confirm(`Anda baru menjawab ${answersList.length} dari ${selectedAssessment.questions.length} soal. Yakin ingin mengumpulkan sekarang?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await submitAssessment(selectedAssessment.id, answersList);
      setSubmitResult(res);
      setActiveStep('result');
      loadMyResults();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengumpulkan jawaban tes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCatalog = () => {
    setActiveStep('catalog');
    setSelectedAssessment(null);
    setSubmitResult(null);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Uji Kompetensi & Sertifikasi Skill</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  FastAPI Verified
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uji kemampuan teknismu secara terstandarisasi dan dapatkan lencana verified di profil pelamar!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CATALOG VIEW */}
          {activeStep === 'catalog' && (
            <div className="space-y-6">
              {/* My Previous Badges if any */}
              {myResults.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                    <Trophy className="w-4 h-4" />
                    <span>Lencana Sertifikasi Anda:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {myResults.map((res) => (
                      <div
                        key={res.id}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                          res.is_passed
                            ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 shadow-xs'
                            : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500'
                        }`}
                      >
                        {res.is_passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{res.assessment_title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700">
                          Skor: {res.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessment Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Daftar Tes Terbuka
                </h4>

                {isLoading ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Memuat katalog tes...
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Tidak ada tes keahlian yang aktif saat ini.
                  </div>
                ) : (
                  assessments.map((test) => (
                    <div
                      key={test.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-slate-800/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {test.category}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {test.duration_minutes} Menit
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {test.questions_count || (test as any).total_questions || 5} Soal
                          </span>
                        </div>
                        <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {test.title}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {test.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] text-slate-400 block font-semibold">Passing Score</span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {test.passing_score}%
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartTest(test.id)}
                          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Mulai Tes</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 2: ACTIVE TEST TAKING VIEW */}
          {activeStep === 'test' && selectedAssessment && (
            <div className="space-y-6">
              {/* Test Header & Progress */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleBackToCatalog}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Katalog</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                    Soal {currentQuestionIndex + 1} dari {selectedAssessment.questions.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question */}
              {selectedAssessment.questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    {selectedAssessment.questions[currentQuestionIndex].question_text}
                  </h4>

                  <div className="space-y-2 pt-2">
                    {selectedAssessment.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                      const qId = selectedAssessment.questions[currentQuestionIndex].id;
                      const isSelected = userAnswers[qId] === oIdx;

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(qId, oIdx)}
                          className={`p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="flex-1">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Sebelumnya
                </button>

                {currentQuestionIndex < selectedAssessment.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitTest}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menilai Skor...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kumpulkan Jawaban</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: RESULT VIEW */}
          {activeStep === 'result' && submitResult && (
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl text-3xl">
                {submitResult.is_passed ? (
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 flex items-center justify-center">
                    <Trophy className="w-10 h-10 animate-bounce" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 border border-amber-300 flex items-center justify-center">
                    <Clock className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  submitResult.is_passed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {submitResult.is_passed ? 'Lulus Terverifikasi 🎉' : 'Belum Mencapai Nilai Minimum'}
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                  {submitResult.assessment_title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {submitResult.is_passed
                    ? 'Selamat! Lencana sertifikasi skill telah disematkan secara otomatis ke profil pelamar Anda.'
                    : 'Jangan berkecil hati, Anda dapat mempelajari kembali materinya dan mencoba tes ini di lain waktu.'}
                </p>
              </div>

              {/* Score Metric */}
              <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Skor Anda</span>
                  <span className={`text-3xl font-black ${submitResult.is_passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {submitResult.score}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Benar</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">
                    {submitResult.correct_answers_count} / {submitResult.total_questions}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBackToCatalog}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Kembali ke Katalog Tes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

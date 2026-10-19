import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Star,
  Lock,
  CheckCircle,
  Heart,
  PawPrint,
  Play,
  Pause,
  RotateCcw,
  Smile,
  Volume2,
  Wind
} from 'lucide-react';

export default function JobseekerZenView() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Tarik Napas (Inhale)' | 'Tahan (Hold)' | 'Hembuskan (Exhale)'>('Tarik Napas (Inhale)');
  const [timerSeconds, setTimerSeconds] = useState(4);
  const [zenCount, setZenCount] = useState(3);

  // Breathing cycle simulator: 4s inhale, 4s hold, 4s exhale
  useEffect(() => {
    let interval: any = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((current) => {
              if (current === 'Tarik Napas (Inhale)') return 'Tahan (Hold)';
              if (current === 'Tahan (Hold)') return 'Hembuskan (Exhale)';
              setZenCount((c) => c + 1);
              return 'Tarik Napas (Inhale)';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Zen Section (Matching Image 5) */}
      <div className="rounded-3xl bg-[#0f172a] text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-amber-400 font-bold text-xl sm:text-2xl font-serif tracking-wide block">
              Welcome home, human!
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Let's find your inner{' '}
              <span className="text-amber-400 relative inline-block underline decoration-wavy decoration-pink-400">
                Zen
              </span>{' '}
              with a cat!
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              The purrfect place to disconnect from the noise and reconnect with what matters: peace, presence, and gentle purrs.
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>5 Rated</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
                <span>100% Free</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-purple-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Science-Backed</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Community Loved</span>
              </div>
            </div>
          </div>

          {/* Right Image Column with Floating Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Sleeping Cat Image on Cloud */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-800/80 transform hover:scale-[1.01] transition-transform duration-500">
              <img
                src="/images/cute_fluffy_cat_sleeping_on_a_cloud.png"
                alt="Sleeping zen cat on a cloud"
                className="w-full h-auto object-cover max-h-[420px]"
              />

              {/* Top-Right Floating Card: 500K+ Members */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">500K+ Members</h4>
                  <p className="text-[10px] text-slate-400">Growing community</p>
                </div>
              </div>

              {/* Bottom-Left Floating Card: 99% Stress Free */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl flex items-center gap-3 shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">99% Stress Free!</h4>
                  <p className="text-[10px] text-slate-400">Guaranteed purrs</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Mindfulness & Breathing Exercise Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-8 text-center space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-bold mb-2">
            <PawPrint className="w-3.5 h-3.5" />
            <span>Ketenangan Mental Pencari Kerja (Career Wellness)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Latihan Pernapasan Relaksasi Bersama Kucing Zen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Mencari kerja bisa menguras energi. Luangkan 2 menit untuk menarik napas dalam, memulihkan fokus, dan menenangkan detak jantung.
          </p>
        </div>

        {/* Breathing Animation Circle */}
        <div className="flex flex-col items-center justify-center py-4">
          <div
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-xl ${
              isBreathing
                ? breathPhase === 'Tarik Napas (Inhale)'
                  ? 'scale-110 bg-gradient-to-tr from-blue-600 to-sky-400 shadow-blue-500/40'
                  : breathPhase === 'Tahan (Hold)'
                  ? 'scale-105 bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-indigo-500/40'
                  : 'scale-90 bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/40'
                : 'bg-gradient-to-tr from-slate-700 to-slate-800'
            }`}
          >
            <Wind className={`w-8 h-8 mb-1 ${isBreathing ? 'animate-pulse' : ''}`} />
            <span className="text-3xl font-black">{timerSeconds}</span>
            <span className="text-[11px] font-bold tracking-wide uppercase px-2 text-center">
              {isBreathing ? breathPhase : 'Siap Mulai'}
            </span>
          </div>

          <div className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Sesi pernapasan diselesaikan hari ini: <strong className="text-blue-600 dark:text-blue-400">{zenCount} siklus</strong>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsBreathing(!isBreathing)}
            className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {isBreathing ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda Latihan</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Mulai Pernapasan Zen</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBreathing(false);
              setTimerSeconds(4);
              setBreathPhase('Tarik Napas (Inhale)');
            }}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

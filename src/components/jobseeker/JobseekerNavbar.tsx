import React from 'react';
import {
  Briefcase,
  Bell,
  LogOut,
  Sun,
  Moon,
  PawPrint,
  ArrowRightLeft,
  LogIn,
  UserPlus
} from 'lucide-react';
import { authStorage } from '../../lib/auth';

export interface JobseekerNavbarProps {
  activeTab: 'dashboard' | 'explore' | 'job-detail' | 'applications' | 'profile' | 'profile-edit' | 'zen';
  onSelectTab: (tab: 'dashboard' | 'explore' | 'job-detail' | 'applications' | 'profile' | 'profile-edit' | 'zen') => void;
  onSwitchToConsole?: (role: 'admin' | 'merchant') => void;
  isAuthenticated?: boolean;
  userName?: string;
  userRole?: string;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export default function JobseekerNavbar({
  activeTab,
  onSelectTab,
  onSwitchToConsole,
  isAuthenticated = false,
  userName = 'Budi Santoso',
  userRole = 'Frontend Engineer',
  onOpenAuthModal,
  onLogout,
}: JobseekerNavbarProps) {
  const handleLogout = () => {
    authStorage.clearSession();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  const handleProtectedTab = (tab: 'applications' | 'profile') => {
    if (!isAuthenticated) {
      if (onOpenAuthModal) onOpenAuthModal();
      else window.location.href = '/login';
    } else {
      onSelectTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              CareerFlow
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('explore')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'explore' || activeTab === 'job-detail'
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cari Lowongan
            </button>

            <button
              type="button"
              onClick={() => handleProtectedTab('applications')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'applications'
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lamaran Saya
            </button>

            <button
              type="button"
              onClick={() => handleProtectedTab('profile')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer relative ${
                activeTab === 'profile' || activeTab === 'profile-edit'
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profil Saya
            </button>

            {/* Combined Zen Corner Tab (Preserving Image 5) */}
            <button
              type="button"
              onClick={() => onSelectTab('zen')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'zen'
                  ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 font-extrabold border border-pink-300'
                  : 'text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5" />
              <span>Zen Corner 🐱</span>
            </button>
          </nav>
        </div>

        {/* Right Nav: Console Switcher, Auth Buttons OR Profile + Bell */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          {/* Quick Console Switcher */}
          {onSwitchToConsole && (
            <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold">
              <span className="px-2 text-slate-400">Tampilan:</span>
              <button
                type="button"
                onClick={() => onSwitchToConsole('admin')}
                className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => onSwitchToConsole('merchant')}
                className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Merchant
              </button>
            </div>
          )}

          {/* If NOT Authenticated: Show Masuk & Daftar */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuthModal) onOpenAuthModal();
                  else window.location.href = '/login';
                }}
                className="px-4 py-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>

              <a
                href="/register"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar</span>
              </a>
            </div>
          ) : (
            /* If Authenticated: Show Notification Bell, User Pill, and Logout */
            <>
              {/* Bell Icon */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* User Profile Pill */}
              <div
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-3 pl-2 sm:border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
                title="Lihat Profil Saya"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-100 dark:ring-blue-900">
                  {userName.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'BS'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block">
                    {userName}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-slate-500 hover:text-rose-600 font-semibold cursor-pointer ml-1"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

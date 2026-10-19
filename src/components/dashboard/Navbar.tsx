import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
  Download,
  Filter,
  ArrowRightLeft,
  Building2
} from 'lucide-react';
import { authStorage } from '../../lib/auth';
import { getMyNotifications, getUnreadNotificationCount, markAllNotificationsRead } from '../../lib/api';

export type ConsoleMode = 'jobseeker' | 'admin' | 'merchant';

export interface NavbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  consoleMode?: ConsoleMode;
  onToggleConsoleMode?: (mode: ConsoleMode) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Navbar({
  isSidebarCollapsed,
  onToggleSidebar,
  consoleMode = 'admin',
  onToggleConsoleMode,
  searchQuery = '',
  onSearchChange,
}: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 1,
      title: 'Validasi NIB & NPWP Baru',
      desc: 'PT Solusi Teknologi Nusantara mengajukan verifikasi berkas legal.',
      time: '09:42 WIB Hari ini',
      unread: true,
    },
    {
      id: 2,
      title: 'Permohonan Lowongan Baru',
      desc: 'FinTech Asia Group mengajukan Senior Product Designer.',
      time: '09:30 WIB Hari ini',
      unread: true,
    },
    {
      id: 3,
      title: 'Registrasi Akun Merchant',
      desc: 'CV Karya Mitra Abadi menyelesaikan upload dokumen KTP.',
      time: '08:15 WIB Hari ini',
      unread: true,
    },
  ]);

  const isMerchant = consoleMode === 'merchant';
  const userName = isMerchant ? 'PT Solusi Teknologi Nusantara' : 'Admin Utama';
  const userRole = isMerchant ? 'Merchant Enterprise' : 'Super Admin Compliance';

  // Check initial dark mode from DOM
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    authStorage.clearSession();
    window.location.href = '/login';
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead().catch(() => {});
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 h-18 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-6 transition-colors shadow-xs">
      {/* Left: Hamburger & Search Box */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={
              isMerchant
                ? 'Cari posisi, ID tiket, pelamar...'
                : 'Cari PT, NIB, NPWP, atau nama PIC...'
            }
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#151f32] focus:bg-white dark:focus:bg-[#111827] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Navigation & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
        {/* Quick Console Switcher Pill */}
        {onToggleConsoleMode && (
          <button
            type="button"
            onClick={() => {
              if (consoleMode === 'admin') onToggleConsoleMode('merchant');
              else if (consoleMode === 'merchant') onToggleConsoleMode('jobseeker');
              else onToggleConsoleMode('admin');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition-all cursor-pointer"
            title="Klik untuk beralih mode (Pencari Kerja / Admin / Merchant)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>
              Mode: {consoleMode === 'admin' ? 'Admin' : consoleMode === 'merchant' ? 'Merchant' : 'Pencari Kerja'}
            </span>
          </button>
        )}

        {/* Super Admin Action Buttons: Filter Cepat & Unduh Laporan */}
        {!isMerchant && (
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Cepat</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Laporan</span>
            </button>
          </div>
        )}

        <a
          href="#docs"
          className="hidden xl:block font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Dokumentasi API
        </a>
        <a
          href="#help"
          className="hidden xl:block font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Pusat Bantuan
        </a>

        {/* Dark Mode Switcher */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#111827]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a2232] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-3 z-50 animate-in fade-in duration-200 text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Notifikasi Platform
                </span>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                >
                  Tandai semua dibaca
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto mt-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </p>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.desc}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-200 dark:ring-blue-900 shadow-xs">
              {isMerchant ? 'PT' : 'AU'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight block truncate max-w-36">
                {userName}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block leading-none">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#1a2232] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 z-50 animate-in fade-in duration-200 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </p>
                <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Shield className="w-3 h-3" /> {userRole}
                </div>
              </div>
              <div className="py-1">
                <a
                  href="#profile"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl"
                >
                  <User className="w-4 h-4 text-slate-400" /> Profil Pengguna
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Pengaturan Sistem
                </a>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Keluar Sesi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

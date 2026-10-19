import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
  Briefcase,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { authStorage } from '../../lib/auth';

export interface NavbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export default function Navbar({ isSidebarCollapsed, onToggleSidebar, title }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('BUDI SANTOSO');
  const [userRole, setUserRole] = useState('Jobseeker');

  useEffect(() => {
    // Check initial dark theme
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);

    // Retrieve active logged in user from localStorage if present
    const user = authStorage.getUser();
    if (user && user.email) {
      const emailPrefix = user.email.split('@')[0].replace('.', ' ').toUpperCase();
      setUserName(emailPrefix || 'USER');
      setUserRole(user.role.toUpperCase());
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

  const notifications = [
    {
      id: 1,
      title: 'Undangan Interview Tahap 2',
      desc: 'PT. Tokopedia mengundang Anda untuk sesi Technical Interview.',
      time: '15 menit lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Lamaran Lolos Screening',
      desc: 'Berkas Senior Backend Engineer Anda telah disetujui HR.',
      time: '1 jam lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Hasil Tes Skill Diterbitkan',
      desc: 'Skor asesmen React & TypeScript Anda: 94/100 (Sangat Baik).',
      time: '3 jam lalu',
      unread: false,
    },
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 transition-colors shadow-sm">
      {/* Left Section: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
          </div>
        )}
      </div>

      {/* Right Section: Dark Mode Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Switcher */}
        <button
          type="button"
          onClick={toggleDarkMode}
          title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative focus:outline-none cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#111827]">
              15
            </span>
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-[#1a2232] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-3 z-50 animate-in fade-in duration-200 text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Notifikasi Rekrutmen
                </span>
                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 cursor-pointer hover:underline">
                  Tandai semua dibaca
                </span>
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
                      {n.unread && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.desc}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {getInitials(userName)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block leading-none font-medium">
                Hi,
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight block max-w-36 truncate">
                {userName}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a2232] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-2 z-50 animate-in fade-in duration-200 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </p>
                <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  <Briefcase className="w-3 h-3" /> {userRole}
                </div>
              </div>

              <div className="py-1">
                <a
                  href="#profile"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" /> Profil Saya & CV
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Pengaturan Akun
                </a>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Bell,
  LogOut,
  Sun,
  Moon,
  PawPrint,
  ArrowRightLeft,
  LogIn,
  UserPlus,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { authStorage } from '../../lib/auth';
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type InAppNotification
} from '../../lib/api';

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
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Load unread count and notifications if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getUnreadNotificationCount().then((count) => setUnreadCount(count)).catch(() => {});
    }
  }, [isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState && isAuthenticated) {
      setIsLoadingNotifs(true);
      try {
        const notifs = await getMyNotifications(20);
        setNotifications(notifs);
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setIsLoadingNotifs(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = async (notif: InAppNotification) => {
    if (!notif.is_read) {
      await markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    if (notif.link_url) {
      setIsNotifOpen(false);
      if (notif.link_url.includes('applications')) {
        onSelectTab('applications');
      } else if (notif.link_url.includes('jobs')) {
        onSelectTab('explore');
      }
    }
  };

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
              {/* Bell Icon & Notification Dropdown */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  type="button"
                  onClick={handleToggleNotifications}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                  title="Notifikasi"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900 animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Popover */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">Notifikasi</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                            {unreadCount} baru
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Tandai Semua</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotifOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {isLoadingNotifs ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          Memuat notifikasi...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-semibold">Belum ada notifikasi</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Semua info terbaru lowongan akan muncul di sini.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 ${
                              !notif.is_read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                !notif.is_read
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}>
                                <Bell className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-xs truncate ${!notif.is_read ? 'font-black text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.is_read && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                                <span>{new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                {notif.link_url && (
                                  <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-bold">
                                    Buka <ExternalLink className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/30">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          onSelectTab('applications');
                        }}
                        className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                      >
                        Lihat Status Semua Lamaran →
                      </button>
                    </div>
                  </div>
                )}
              </div>

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

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  HelpCircle,
  Settings,
  Plus,
  ShieldCheck,
  FileCheck,
  Building2,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { authStorage } from '../../lib/auth';

export type ActiveTabType =
  | 'admin-dashboard'
  | 'admin-validation'
  | 'admin-users'
  | 'admin-job-approvals'
  | 'merchant-dashboard'
  | 'merchant-jobs'
  | 'merchant-talents'
  | 'merchant-profile';

export type ConsoleMode = 'jobseeker' | 'admin' | 'merchant';

export interface SidebarProps {
  isCollapsed: boolean;
  consoleMode: ConsoleMode;
  onToggleConsoleMode: (mode: ConsoleMode) => void;
  activeTab: ActiveTabType;
  onSelectTab: (tab: ActiveTabType) => void;
  onOpenCreateJob: () => void;
}

export default function Sidebar({
  isCollapsed,
  consoleMode,
  onToggleConsoleMode,
  activeTab,
  onSelectTab,
  onOpenCreateJob,
}: SidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(true);

  const handleLogout = () => {
    authStorage.clearSession();
    window.location.href = '/login';
  };

  const isMerchant = consoleMode === 'merchant';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col ${
        isMerchant ? 'bg-[#12429e] border-r border-[#0d347d]' : 'bg-[#103783] border-r border-[#0d2e6e]'
      } text-white select-none ${isCollapsed ? 'w-[76px]' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5 border-b border-white/10 bg-black/10">
        {isCollapsed ? (
          <div
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto cursor-pointer"
            title={isMerchant ? 'CareerFlow Merchant' : 'CareerFlow Admin'}
            onClick={() => onSelectTab(isMerchant ? 'merchant-dashboard' : 'admin-dashboard')}
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              {isMerchant ? <Building2 className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab(isMerchant ? 'merchant-dashboard' : 'admin-dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
              {isMerchant ? <Building2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
                {isMerchant ? 'CareerFlow' : 'CareerFlow Admin'}
              </span>
              <span className="text-[11px] text-blue-200/80 font-medium">
                {isMerchant ? 'Merchant Console' : 'Enterprise Console'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Role Switcher Pill */}
      {!isCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="p-1 rounded-xl bg-black/20 flex items-center text-[10px] font-bold gap-1">
            <button
              type="button"
              onClick={() => {
                onToggleConsoleMode('jobseeker');
              }}
              className={`flex-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate ${
                consoleMode === 'jobseeker' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Pencari Kerja
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleConsoleMode('admin');
                onSelectTab('admin-dashboard');
              }}
              className={`flex-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate ${
                consoleMode === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleConsoleMode('merchant');
                onSelectTab('merchant-dashboard');
              }}
              className={`flex-1 py-1 px-1.5 rounded-lg transition-all cursor-pointer truncate ${
                consoleMode === 'merchant' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-200 hover:text-white'
              }`}
            >
              Merchant
            </button>
          </div>
        </div>
      )}

      {/* Top CTA Button: + Tambah Lowongan */}
      <div className="p-4">
        {isCollapsed ? (
          <button
            type="button"
            onClick={onOpenCreateJob}
            className="w-11 h-11 mx-auto rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Tambah Lowongan"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenCreateJob}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/30 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lowongan</span>
          </button>
        )}
      </div>

      {/* Navigation Menu (Changes depending on Super Admin vs Merchant Mode) */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        {!isMerchant ? (
          /* ================= SUPER ADMIN CONSOLE MENU ================= */
          <>
            {!isCollapsed && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200/50 px-3.5 block mb-1">
                Navigasi Utama
              </span>
            )}

            {/* Admin Dashboard */}
            <button
              type="button"
              onClick={() => onSelectTab('admin-dashboard')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin-dashboard'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            {/* Manajemen User with Submenu (Validasi Dokumen + Daftar Pengguna) */}
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onSelectTab('admin-validation')}
                className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'admin-validation' || activeTab === 'admin-users'
                    ? 'bg-white/15 text-white'
                    : 'text-blue-100/70 hover:text-white hover:bg-white/10'
                }`}
                title="Validasi Dokumen Legal"
              >
                <Users className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-100/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-3.5">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Manajemen User</span>
                  </div>
                  {isUserMenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="pl-6 space-y-1 pt-0.5">
                    {/* Submenu 1: Validasi Dokumen (Image 1) */}
                    <button
                      type="button"
                      onClick={() => onSelectTab('admin-validation')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        activeTab === 'admin-validation'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-blue-100/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">Validasi Dokumen</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                        14
                      </span>
                    </button>

                    {/* Submenu 2: Daftar Perusahaan & User */}
                    <button
                      type="button"
                      onClick={() => onSelectTab('admin-users')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        activeTab === 'admin-users'
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-blue-100/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">Daftar Pengguna</span>
                      <span className="text-[10px] text-blue-200/60 font-mono">24.8k</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Manajemen Lowongan / Approval (Image 2) */}
            <button
              type="button"
              onClick={() => onSelectTab('admin-job-approvals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'admin-job-approvals'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Approval Lowongan' : undefined}
            >
              <div className="flex items-center gap-3.5">
                <Briefcase className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Manajemen Lowongan</span>}
              </div>
              {!isCollapsed && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                  38
                </span>
              )}
            </button>
          </>
        ) : (
          /* ================= MERCHANT CONSOLE MENU ================= */
          <>
            {/* Merchant Dashboard (Image 4) */}
            <button
              type="button"
              onClick={() => onSelectTab('merchant-dashboard')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'merchant-dashboard'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Dashboard Merchant' : undefined}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            {/* Lowongan Saya (Image 3) */}
            <button
              type="button"
              onClick={() => onSelectTab('merchant-jobs')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'merchant-jobs'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Lowongan Saya' : undefined}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Lowongan Saya</span>}
            </button>

            {/* Pencarian Bakat / Talent Pool */}
            <button
              type="button"
              onClick={() => onSelectTab('merchant-talents')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'merchant-talents'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Pencarian Bakat' : undefined}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Pencarian Bakat</span>}
            </button>

            {/* Profil Perusahaan (Image 5) */}
            <button
              type="button"
              onClick={() => onSelectTab('merchant-profile')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'merchant-profile'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-blue-100/70 hover:text-white hover:bg-white/10'
              } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              title={isCollapsed ? 'Profil Perusahaan' : undefined}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Profil Perusahaan</span>}
            </button>
          </>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-100/70 hover:text-red-300 hover:bg-white/10 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>{isMerchant ? 'Keluar' : 'Logout'}</span>}
        </button>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-white/10 space-y-1 text-xs">
        {!isCollapsed && (
          <>
            <a
              href="#help"
              className="flex items-center gap-3 px-3 py-2 text-blue-100/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan & Dokumentasi</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-3 px-3 py-2 text-blue-100/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Sistem</span>
            </a>
          </>
        )}

        <div className="pt-2">
          {isCollapsed ? (
            <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto" title="Compliance v3.4.2" />
          ) : (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/20 text-[10px] text-blue-200">
              <span className="font-mono">
                {isMerchant ? 'SolusiTek ID' : 'Compliance Build'}
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                {isMerchant ? (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-900 font-extrabold text-[9px]">
                    PRO
                  </span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> v3.4.2
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

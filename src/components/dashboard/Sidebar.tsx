import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  HelpCircle,
  Settings,
  Plus
} from 'lucide-react';
import { authStorage } from '../../lib/auth';

export interface SidebarProps {
  isCollapsed: boolean;
  activeTab: 'dashboard' | 'users' | 'jobs';
  onSelectTab: (tab: 'dashboard' | 'users' | 'jobs') => void;
  onOpenCreateJob: () => void;
}

export default function Sidebar({
  isCollapsed,
  activeTab,
  onSelectTab,
  onOpenCreateJob,
}: SidebarProps) {
  const handleLogout = () => {
    authStorage.clearSession();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-[#103783] text-white border-r border-[#0d2e6e] select-none ${
        isCollapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5 border-b border-[#16449e]/60 bg-[#0d2f70]">
        {isCollapsed ? (
          <div
            className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto cursor-pointer"
            title="CareerFlow Admin"
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
                CareerFlow Admin
              </span>
              <span className="text-[11px] text-blue-200/80 font-medium">
                Enterprise Console
              </span>
            </div>
          </div>
        )}
      </div>

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

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-blue-100/70 hover:text-white hover:bg-white/10'
          } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
          title={isCollapsed ? 'Dashboard' : undefined}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </button>

        {/* Manajemen User */}
        <button
          type="button"
          onClick={() => onSelectTab('users')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-blue-100/70 hover:text-white hover:bg-white/10'
          } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
          title={isCollapsed ? 'Manajemen User' : undefined}
        >
          <Users className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Manajemen User</span>}
        </button>

        {/* Manajemen Lowongan */}
        <button
          type="button"
          onClick={() => onSelectTab('jobs')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-blue-100/70 hover:text-white hover:bg-white/10'
          } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
          title={isCollapsed ? 'Manajemen Lowongan' : undefined}
        >
          <Briefcase className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Manajemen Lowongan</span>}
        </button>

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
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-[#16449e]/60 space-y-1 text-xs">
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
            <div className="w-3 h-3 rounded-full bg-emerald-400 mx-auto" title="Live v2.8.4" />
          ) : (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/20 text-[10px] text-blue-200">
              <span className="font-mono">v2.8.4 Enterprise</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

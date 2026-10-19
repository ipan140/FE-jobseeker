import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  GitBranch,
  Award,
  Database,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export interface SidebarProps {
  isCollapsed: boolean;
  activePath: string;
  onNavigate?: (path: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  children?: { label: string; path: string }[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'jobs',
    label: 'Lowongan Kerja',
    path: '/jobs',
    icon: Briefcase,
  },
  {
    id: 'applicants',
    label: 'Daftar Pelamar',
    path: '/applicants',
    icon: Users,
  },
  {
    id: 'companies',
    label: 'Perusahaan Mitra',
    path: '/companies',
    icon: Building2,
  },
  {
    id: 'pipeline',
    label: 'Pipeline Rekrutmen',
    path: '/pipeline',
    icon: GitBranch,
  },
  {
    id: 'assessments',
    label: 'Asesmen & Tes Skill',
    path: '/assessments',
    icon: Award,
  },
  {
    id: 'data-master',
    label: 'Data Master',
    path: '#data-master',
    icon: Database,
    children: [
      { label: 'Kategori Pekerjaan', path: '#kategori' },
      { label: 'Departemen & Divisi', path: '#divisi' },
      { label: 'Keahlian (Skills)', path: '#skills' },
      { label: 'Lokasi & Penempatan', path: '#lokasi' },
      { label: 'Template Surat Penawaran', path: '#template-offering' },
    ],
  },
  {
    id: 'report',
    label: 'Laporan & Analitik',
    path: '/report',
    icon: BarChart3,
  },
  {
    id: 'users',
    label: 'Manajemen Akun',
    path: '#users',
    icon: ShieldCheck,
    children: [
      { label: 'Daftar Pengguna', path: '#user-list' },
      { label: 'Hak Akses Role', path: '#roles' },
    ],
  },
];

export default function Sidebar({ isCollapsed, activePath, onNavigate }: SidebarProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'data-master': false,
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      toggleAccordion(item.id);
    } else if (onNavigate) {
      e.preventDefault();
      onNavigate(item.path);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-[#141d2b] text-slate-300 border-r border-slate-800/60 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80 bg-[#101723]">
        {isCollapsed ? (
          <a
            href="/dashboard"
            className="mx-auto flex flex-col items-center justify-center text-center group"
            title="Jobseekers Portal"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </a>
        ) : (
          <a
            href="/dashboard"
            className="flex items-center gap-3 w-full px-2 group transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-orange-400 tracking-wider uppercase leading-none">
                CAREER PORTAL
              </span>
              <span className="text-lg font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">
                Jobseekers
              </span>
            </div>
            <div className="ml-auto text-[9px] bg-orange-500/15 text-orange-400 font-semibold px-2 py-0.5 rounded border border-orange-500/30">
              PRO
            </div>
          </a>
        )}
      </div>

      {/* Nav Menu Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePath === item.path ||
            (item.id === 'dashboard' && (activePath === '/dashboard' || activePath === '/'));
          const isOpen = openAccordions[item.id];
          const hasChildren = !!item.children;

          return (
            <div key={item.id} className="relative group">
              <a
                href={item.path}
                onClick={(e) => handleClick(item, e)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md shadow-orange-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              >
                <Icon
                  className={`shrink-0 transition-transform ${
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  } ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                />
                {!isCollapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {hasChildren && (
                      <span className="text-slate-400">
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </>
                )}
              </a>

              {/* Submenu Accordion (Expanded mode) */}
              {!isCollapsed && hasChildren && isOpen && (
                <div className="pl-9 pr-2 py-1 mt-0.5 space-y-0.5 border-l border-slate-800 ml-5">
                  {item.children?.map((sub) => (
                    <a
                      key={sub.path}
                      href={sub.path}
                      className="block py-1.5 px-2 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg transition-colors"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Quick Info in Sidebar Bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-[#101723]/60">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              BS
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">Budi Santoso</p>
              <p className="text-[10px] text-slate-400 truncate">Pencari Kerja Aktif</p>
            </div>
          </div>
        ) : (
          <div
            className="w-9 h-9 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer"
            title="Budi Santoso (Pencari Kerja)"
          >
            BS
          </div>
        )}
      </div>
    </aside>
  );
}

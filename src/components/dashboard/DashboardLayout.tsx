import React, { useState, useEffect } from 'react';
import Sidebar, { type ActiveTabType, type ConsoleMode } from './Sidebar';
import Navbar from './Navbar';
import DashboardMatrix from './DashboardMatrix';
import AdminValidationView from './AdminValidationView';
import AdminJobApprovalsView from './AdminJobApprovalsView';
import MerchantDashboardView from './MerchantDashboardView';
import MerchantJobsView from './MerchantJobsView';
import MerchantTalentsView from './MerchantTalentsView';
import MerchantProfileView from './MerchantProfileView';
import JobseekerPortal from '../jobseeker/JobseekerPortal';

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>('jobseeker');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('admin-dashboard');
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check URL query parameter for direct mode routing: ?mode=admin or ?mode=merchant or ?mode=jobseeker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'admin' || modeParam === 'merchant' || modeParam === 'jobseeker') {
        setConsoleMode(modeParam as ConsoleMode);
      }
    }
  }, []);

  // Auto-adapt consoleMode when tab changes
  const handleSelectTab = (tab: ActiveTabType) => {
    setActiveTab(tab);
    if (tab.startsWith('merchant-')) {
      setConsoleMode('merchant');
    } else if (tab.startsWith('admin-')) {
      setConsoleMode('admin');
    }
  };

  const handleToggleConsoleMode = (mode: ConsoleMode) => {
    setConsoleMode(mode);
    if (mode === 'merchant') {
      setActiveTab('merchant-dashboard');
    } else if (mode === 'admin') {
      setActiveTab('admin-dashboard');
    }
  };

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // If in Jobseeker Mode: render full Jobseeker Candidate Experience
  if (consoleMode === 'jobseeker') {
    return (
      <JobseekerPortal
        onSwitchToConsole={(mode) => handleToggleConsoleMode(mode)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        consoleMode={consoleMode}
        onToggleConsoleMode={handleToggleConsoleMode}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCreateJob={() => setShowCreateJobModal(true)}
      />

      {/* Main Column Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-[76px]' : 'pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          consoleMode={consoleMode}
          onToggleConsoleMode={handleToggleConsoleMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {/* View 1: Super Admin - Ringkasan Dashboard (Image 5 set 1) */}
          {activeTab === 'admin-dashboard' && (
            <DashboardMatrix
              activeTab="dashboard"
              onSelectTab={(t) => {
                if (t === 'users') setActiveTab('admin-users');
                if (t === 'jobs') setActiveTab('admin-job-approvals');
              }}
              showCreateJobModal={showCreateJobModal}
              onCloseCreateJobModal={() => setShowCreateJobModal(false)}
              onOpenCreateJobModal={() => setShowCreateJobModal(true)}
            />
          )}

          {/* View 2: Super Admin - Validasi Dokumen Legal Perusahaan (Image 1 set 2) */}
          {activeTab === 'admin-validation' && <AdminValidationView />}

          {/* View 3: Super Admin - Manajemen User (Image 4 set 1) */}
          {activeTab === 'admin-users' && (
            <DashboardMatrix
              activeTab="users"
              onSelectTab={(t) => {
                if (t === 'dashboard') setActiveTab('admin-dashboard');
                if (t === 'jobs') setActiveTab('admin-job-approvals');
              }}
              showCreateJobModal={showCreateJobModal}
              onCloseCreateJobModal={() => setShowCreateJobModal(false)}
              onOpenCreateJobModal={() => setShowCreateJobModal(true)}
            />
          )}

          {/* View 4: Super Admin - Approval Lowongan Kerja (Image 2 set 2) */}
          {activeTab === 'admin-job-approvals' && <AdminJobApprovalsView />}

          {/* View 5: Merchant - Dashboard Merchant (Image 4 set 2) */}
          {activeTab === 'merchant-dashboard' && (
            <MerchantDashboardView
              onOpenCreateJob={() => setShowCreateJobModal(true)}
              onNavigateToJobs={() => setActiveTab('merchant-jobs')}
            />
          )}

          {/* View 6: Merchant - Lowongan Saya (Image 3 set 2) */}
          {activeTab === 'merchant-jobs' && (
            <MerchantJobsView onOpenCreateJob={() => setShowCreateJobModal(true)} />
          )}

          {/* View 6.5: Merchant - Pencarian Bakat & Talent Pool */}
          {activeTab === 'merchant-talents' && <MerchantTalentsView />}

          {/* View 7: Merchant - Profil Perusahaan (Image 5 set 2) */}
          {activeTab === 'merchant-profile' && <MerchantProfileView />}

          {/* Fallback modal if create job is triggered while on other views */}
          {showCreateJobModal &&
            activeTab !== 'admin-dashboard' &&
            activeTab !== 'admin-users' && (
              <DashboardMatrix
                activeTab="dashboard"
                onSelectTab={() => {}}
                showCreateJobModal={true}
                onCloseCreateJobModal={() => setShowCreateJobModal(false)}
                onOpenCreateJobModal={() => setShowCreateJobModal(true)}
              />
            )}
        </main>
      </div>
    </div>
  );
}

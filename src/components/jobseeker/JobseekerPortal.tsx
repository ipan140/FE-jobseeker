import React, { useState } from 'react';
import JobseekerNavbar from './JobseekerNavbar';
import JobseekerDashboardView from './JobseekerDashboardView';
import JobseekerExploreView from './JobseekerExploreView';
import JobseekerJobDetailView from './JobseekerJobDetailView';
import JobseekerApplicationsView from './JobseekerApplicationsView';
import JobseekerProfileView from './JobseekerProfileView';
import JobseekerProfileEditView from './JobseekerProfileEditView';
import JobseekerZenView from './JobseekerZenView';
import JobApplicationModal from './JobApplicationModal';

export type JobseekerTab =
  | 'dashboard'
  | 'explore'
  | 'job-detail'
  | 'applications'
  | 'profile'
  | 'profile-edit'
  | 'zen';

export interface JobseekerPortalProps {
  onSwitchToConsole?: (role: 'admin' | 'merchant') => void;
  initialTab?: JobseekerTab;
}

export default function JobseekerPortal({
  onSwitchToConsole,
  initialTab = 'dashboard',
}: JobseekerPortalProps) {
  const [activeTab, setActiveTab] = useState<JobseekerTab>(initialTab);
  const [selectedJobTitle, setSelectedJobTitle] = useState('Senior Frontend Engineer (React/Next.js)');
  const [selectedCompany, setSelectedCompany] = useState('PT Solusi Teknologi Nusantara');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleSelectJob = (title: string, company: string) => {
    setSelectedJobTitle(title);
    setSelectedCompany(company);
    setActiveTab('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApplyModal = (title?: string, company?: string) => {
    if (title) setSelectedJobTitle(title);
    if (company) setSelectedCompany(company);
    setIsApplyModalOpen(true);
  };

  const handleTabChange = (tab: JobseekerTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Jobseeker Navbar */}
      <JobseekerNavbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onSwitchToConsole={onSwitchToConsole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* View 1: Jobseeker Dashboard (Image 1 of Set 3) */}
        {activeTab === 'dashboard' && (
          <JobseekerDashboardView
            onSelectJob={handleSelectJob}
            onOpenApplyModal={handleOpenApplyModal}
            onNavigateToExplore={() => handleTabChange('explore')}
            onNavigateToZen={() => handleTabChange('zen')}
            onNavigateToApplications={() => handleTabChange('applications')}
            onNavigateToProfile={() => handleTabChange('profile')}
          />
        )}

        {/* View 2: Cari Lowongan / Eksplorasi Peluang Karier (Image 2 of Set 3) */}
        {activeTab === 'explore' && (
          <JobseekerExploreView onSelectJob={handleSelectJob} />
        )}

        {/* View 3: Detail Lowongan (Image 3 of Set 3) */}
        {activeTab === 'job-detail' && (
          <JobseekerJobDetailView
            onBack={() => handleTabChange('explore')}
            onApply={() => setIsApplyModalOpen(true)}
            jobTitle={selectedJobTitle}
            companyName={selectedCompany}
          />
        )}

        {/* View 4: Lamaran Saya (Image 1 of Set 4) */}
        {activeTab === 'applications' && (
          <JobseekerApplicationsView />
        )}

        {/* View 5: Profil Budi Santoso (Image 2 of Set 4) */}
        {activeTab === 'profile' && (
          <JobseekerProfileView
            onEditProfile={() => handleTabChange('profile-edit')}
          />
        )}

        {/* View 6: Lengkapi & Perbarui Profil Karir (Image 3 of Set 4) */}
        {activeTab === 'profile-edit' && (
          <JobseekerProfileEditView
            onBackToProfile={() => handleTabChange('profile')}
            onSaveSuccess={() => handleTabChange('profile')}
          />
        )}

        {/* View 7: Zen with a Cat (Image 5 of Set 3 - Preserved & Interactive) */}
        {activeTab === 'zen' && <JobseekerZenView />}
      </main>

      {/* Modal: Kirim Lamaran Pekerjaan (Image 4 of Set 3) */}
      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobTitle={selectedJobTitle}
        companyName={selectedCompany}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import JobseekerNavbar from './JobseekerNavbar';
import JobseekerDashboardView from './JobseekerDashboardView';
import JobseekerExploreView from './JobseekerExploreView';
import JobseekerJobDetailView from './JobseekerJobDetailView';
import JobseekerApplicationsView from './JobseekerApplicationsView';
import JobseekerProfileView from './JobseekerProfileView';
import JobseekerProfileEditView from './JobseekerProfileEditView';
import JobseekerZenView from './JobseekerZenView';
import JobApplicationModal from './JobApplicationModal';
import AuthRequiredModal from './AuthRequiredModal';
import { authStorage } from '../../lib/auth';

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
  const [selectedJobId, setSelectedJobId] = useState<string>('c4b338a0-4205-4b08-894f-6d12981a96dd');
  const [selectedJobTitle, setSelectedJobTitle] = useState('Senior Frontend Engineer (React/Next.js)');
  const [selectedCompany, setSelectedCompany] = useState('PT Solusi Teknologi Nusantara');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ user_id: string; email: string; role: string } | null>(null);

  // Load auth state on mount
  useEffect(() => {
    const isAuth = authStorage.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setUser(authStorage.getUser());
    }
  }, []);

  const handleSelectJob = (title: string, company: string, jobId?: string) => {
    setSelectedJobTitle(title);
    setSelectedCompany(company);
    if (jobId) setSelectedJobId(jobId);
    setActiveTab('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApplyModal = (title?: string, company?: string, jobId?: string) => {
    if (title) setSelectedJobTitle(title);
    if (company) setSelectedCompany(company);
    if (jobId) setSelectedJobId(jobId);

    // CRITICAL FLOW: Check if user is logged in
    const isAuth = isAuthenticated || authStorage.isAuthenticated();
    if (!isAuth) {
      setIsAuthModalOpen(true);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUser(authStorage.getUser() || { user_id: 'user-budi-1', email: 'budi.santoso@gmail.com', role: 'jobseeker' });
    setIsAuthModalOpen(false);
    // Seamless experience: open application modal for the selected job right away
    setIsApplyModalOpen(true);
  };

  const handleLogout = () => {
    authStorage.clearSession();
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: JobseekerTab) => {
    // If guest clicks protected tabs (applications/profile), prompt login
    if ((tab === 'applications' || tab === 'profile' || tab === 'profile-edit') && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userName = user?.email === 'budi.santoso@gmail.com' || !user?.email ? 'Budi Santoso' : user.email.split('@')[0];
  const userRole = user?.role === 'admin' ? 'Super Admin' : user?.role === 'company' ? 'HR Perusahaan' : 'Frontend Engineer';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Jobseeker Navbar */}
      <JobseekerNavbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onSwitchToConsole={onSwitchToConsole}
        isAuthenticated={isAuthenticated}
        userName={userName}
        userRole={userRole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
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
            isAuthenticated={isAuthenticated}
            userName={userName}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* View 2: Cari Lowongan / Eksplorasi Peluang Karier (Image 2 of Set 3) */}
        {activeTab === 'explore' && (
          <JobseekerExploreView
            onSelectJob={handleSelectJob}
            onOpenApplyModal={handleOpenApplyModal}
          />
        )}

        {/* View 3: Detail Lowongan (Image 3 of Set 3) */}
        {activeTab === 'job-detail' && (
          <JobseekerJobDetailView
            onBack={() => handleTabChange('explore')}
            onApply={() => handleOpenApplyModal(selectedJobTitle, selectedCompany, selectedJobId)}
            jobId={selectedJobId}
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

      {/* Auth Modal: Prompt Login when user wants to Apply */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        jobTitle={selectedJobTitle}
        companyName={selectedCompany}
        onNavigateToRegister={() => {
          setIsAuthModalOpen(false);
          window.location.href = '/register';
        }}
      />

      {/* Modal: Kirim Lamaran Pekerjaan (Image 4 of Set 3) */}
      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={selectedJobId}
        jobTitle={selectedJobTitle}
        companyName={selectedCompany}
      />
    </div>
  );
}

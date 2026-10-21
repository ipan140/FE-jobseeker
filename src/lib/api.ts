import { authStorage } from './auth';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL)
  ? import.meta.env.PUBLIC_API_URL
  : 'http://127.0.0.1:8000/api/v1';

// ==========================================================
// 1. DATA TYPES & INTERFACES
// ==========================================================

export interface BackendJobItem {
  id: string;
  company_id?: string;
  title: string;
  category: string;
  description?: string;
  requirements?: string;
  location: string;
  job_type: string;
  workplace_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  is_salary_hidden?: boolean;
  benefits?: string;
  skills_required?: string;
  screening_questions?: string;
  urgently_hiring?: boolean;
  status: string;
  company_name: string;
  company_logo?: string;
  company_city?: string;
  skill_match?: number | null;
  views_count?: number;
  clicks_count?: number;
  created_at: string;
}

export interface BackendPaginationMeta {
  total_items: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface PaginatedJobsResponse {
  items: BackendJobItem[];
  meta: BackendPaginationMeta;
}

export interface BackendApplicationItem {
  id: string;
  job_id: string;
  applicant_id?: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interview' | 'offered' | 'hired' | 'rejected' | string;
  cover_letter?: string;
  expected_salary?: number;
  screening_answers?: string;
  interview_scheduled_at?: string;
  interview_meeting_link?: string;
  interview_notes?: string;
  assessment_score?: number;
  assessment_badge?: string;
  offered_salary?: number;
  created_at: string;
  job_title: string;
  company_name: string;
  applicant_name: string;
  applicant_phone?: string;
  applicant_skills?: string;
}

export interface PaginatedApplicationsResponse {
  items: BackendApplicationItem[];
  meta: BackendPaginationMeta;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_companies: number;
  pending_company_verifications: number;
  total_jobs: number;
  total_applications: number;
  pending_job_reports: number;
}

export interface CreateJobPayload {
  title: string;
  category: string;
  description: string;
  requirements?: string;
  location: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  workplace_type: 'on_site' | 'hybrid' | 'remote';
  experience_level: 'fresh_graduate' | 'junior' | 'mid_level' | 'senior_level' | 'lead_manager';
  salary_min?: number;
  salary_max?: number;
  benefits?: string;
  skills_required?: string;
}

export interface QuickApplyPayload {
  cover_letter?: string;
  expected_salary?: number;
  screening_answers?: string;
}

export interface WorkExperienceItem {
  id?: string;
  company_name: string;
  position_title: string;
  start_date: string;
  end_date?: string;
  is_current_job: boolean;
  description?: string;
  salary?: number;
}

export interface EducationItem {
  id?: string;
  institution_name: string;
  degree: string;
  field_of_study: string;
  gpa?: string;
  graduation_year: number;
}

export interface JobseekerFullProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  headline?: string;
  bio?: string;
  city?: string;
  expected_salary?: number;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string;
  open_to_work: boolean;
  is_searchable: boolean;
  work_experiences: WorkExperienceItem[];
  educations: EducationItem[];
  projects?: any[];
  certifications?: any[];
}

// ==========================================================
// 2. JOBS ENDPOINTS
// ==========================================================

export async function getJobs(params: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  category?: string;
  workplace_type?: string;
  job_type?: string;
  experience_level?: string;
  min_salary?: number;
  max_salary?: number;
  urgently_hiring?: boolean;
} = {}): Promise<PaginatedJobsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.location) query.set('location', params.location);
  if (params.category) query.set('category', params.category);
  if (params.workplace_type) query.set('workplace_type', params.workplace_type);
  if (params.job_type) query.set('job_type', params.job_type);
  if (params.experience_level) query.set('experience_level', params.experience_level);
  if (params.min_salary) query.set('min_salary', params.min_salary.toString());
  if (params.max_salary) query.set('max_salary', params.max_salary.toString());
  if (params.urgently_hiring !== undefined) query.set('urgently_hiring', params.urgently_hiring.toString());

  const res = await fetch(`${API_BASE}/jobs/?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Gagal memuat lowongan pekerjaan dari backend');
  }
  return await res.json();
}

export async function getJobDetail(jobId: string): Promise<BackendJobItem> {
  const token = authStorage.getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/jobs/${jobId}`, { headers });
  if (!res.ok) {
    throw new Error('Lowongan pekerjaan tidak ditemukan');
  }
  return await res.json();
}

export async function createJob(payload: CreateJobPayload): Promise<BackendJobItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap login sebagai Perusahaan untuk mempublikasikan lowongan.');

  const res = await fetch(`${API_BASE}/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal mempublikasikan lowongan');
  }
  return data;
}

export async function toggleBookmarkJob(jobId: string): Promise<{ is_saved: boolean; message: string }> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu untuk menyimpan lowongan.');

  const res = await fetch(`${API_BASE}/jobs/${jobId}/bookmark`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal mengubah status simpan lowongan');
  }
  return await res.json();
}

export async function getSavedJobs(): Promise<any[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/jobs/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function trackJobClick(jobId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/jobs/${jobId}/track-click`, { method: 'POST' });
  } catch {
    // Ignore click tracking failure silently
  }
}

export async function getSalaryBenchmarks(category?: string): Promise<any[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/jobs/salary-benchmark${query}`);
  if (!res.ok) return [];
  return await res.json();
}

// ==========================================================
// 3. APPLICANTS & ATS PIPELINE ENDPOINTS
// ==========================================================

export async function applyJob(jobId: string, payload: QuickApplyPayload): Promise<BackendApplicationItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap login sebagai Pencari Kerja untuk melamar lowongan ini.');

  const res = await fetch(`${API_BASE}/applicants/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal mengirimkan lamaran pekerjaan');
  }
  return data;
}

export async function getMyApplications(page = 1, limit = 10): Promise<PaginatedApplicationsResponse> {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error('Sesi tidak ditemukan. Harap masuk terlebih dahulu.');
  }

  const res = await fetch(`${API_BASE}/applicants/my-applications?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Gagal memuat riwayat lamaran dari backend');
  }
  return await res.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  rejectionReason?: string
): Promise<BackendApplicationItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Tidak memiliki otorisasi');

  const res = await fetch(`${API_BASE}/applicants/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, rejection_reason: rejectionReason }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal memperbarui status lamaran');
  }
  return data;
}

// Candidate Profile & Resume APIs
export async function getMyJobseekerProfile(): Promise<JobseekerFullProfile> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me/full-resume`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Gagal memuat profil pelamar');
  }
  return await res.json();
}

export async function updateMyJobseekerProfile(payload: Partial<JobseekerFullProfile>): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal memperbarui profil');
  }
  return await res.json();
}

export async function addWorkExperience(payload: WorkExperienceItem): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me/experiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal menambahkan pengalaman kerja');
  }
  return await res.json();
}

export async function deleteWorkExperience(expId: string): Promise<boolean> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me/experiences/${expId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}

export async function addEducation(payload: EducationItem): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me/educations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal menambahkan riwayat pendidikan');
  }
  return await res.json();
}

export async function deleteEducation(eduId: string): Promise<boolean> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const res = await fetch(`${API_BASE}/applicants/me/educations/${eduId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}

export async function uploadResumeFile(file: File): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Belum masuk akun');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/applicants/me/upload-resume`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal mengunggah berkas resume');
  }
  return await res.json();
}

// ==========================================================
// 4. NOTIFICATIONS ENDPOINTS
// ==========================================================

export async function getMyNotifications(limit = 20): Promise<InAppNotification[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/notifications/?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const token = authStorage.getToken();
  if (!token) return 0;

  try {
    const res = await fetch(`${API_BASE}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.unread_count || 0;
  } catch {
    return 0;
  }
}

export async function markAllNotificationsRead(): Promise<boolean> {
  const token = authStorage.getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  const token = authStorage.getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==========================================================
// 5. REGISTRATION ENDPOINTS
// ==========================================================

export async function registerJobseeker(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register/jobseeker`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Registrasi pencari kerja gagal.');
  }
  authStorage.saveSession(data);
  return data;
}

export async function registerCompany(payload: {
  email: string;
  password: string;
  company_name: string;
  industry?: string;
  website?: string;
  address?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register/company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Registrasi perusahaan gagal.');
  }
  authStorage.saveSession(data);
  return data;
}

// ==========================================================
// 6. ADMIN & STATS ENDPOINTS
// ==========================================================

export async function getSystemStats(): Promise<AdminStats | null> {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export interface PendingCompanyItem {
  id: string;
  user_id: string;
  email?: string;
  company_name: string;
  industry?: string;
  website?: string;
  address?: string;
  status: string;
  created_at: string;
}

export async function getPendingCompanies(): Promise<PendingCompanyItem[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/admin/companies/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function verifyCompany(
  companyId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap login sebagai Administrator.');

  const res = await fetch(`${API_BASE}/companies/${companyId}/verify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, rejection_reason: rejectionReason }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal memverifikasi perusahaan');
  }
  return data;
}

export interface JobReportItem {
  id: string;
  job_id: string;
  job_title?: string;
  company_name?: string;
  reporter_email?: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
}

export async function getJobReports(statusFilter = 'pending', page = 1, limit = 10): Promise<{
  items: JobReportItem[];
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
}> {
  const token = authStorage.getToken();
  if (!token) {
    return { items: [], total_items: 0, total_pages: 0, page: 1, limit };
  }

  try {
    const res = await fetch(
      `${API_BASE}/admin/reports?status_filter=${statusFilter}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) return { items: [], total_items: 0, total_pages: 0, page: 1, limit };
    return await res.json();
  } catch {
    return { items: [], total_items: 0, total_pages: 0, page: 1, limit };
  }
}

export async function resolveJobReport(reportId: string, resolutionStatus = 'resolved'): Promise<any> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap login sebagai Administrator.');

  const res = await fetch(
    `${API_BASE}/admin/reports/${reportId}/resolve?resolution_status=${resolutionStatus}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal menyelesaikan laporan penipuan.');
  }
  return data;
}

// ==========================================================
// 7. MERCHANT / COMPANY DASHBOARD ENDPOINTS
// ==========================================================

export interface CompanyMeProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry?: string;
  company_size?: string;
  description?: string;
  city?: string;
  address?: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  status: string;
  rating?: number;
  reviews_count?: number;
}

export interface CompanyAnalyticsResponse {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  total_views: number;
  conversion_rate: number;
  pipeline_funnel: {
    applied: number;
    screening: number;
    interview: number;
    offered: number;
    accepted: number;
    rejected: number;
  };
}

export async function getMyCompany(): Promise<CompanyMeProfile> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/companies/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal mengambil profil perusahaan.');
  }
  return await res.json();
}

export async function updateMyCompany(payload: Partial<CompanyMeProfile>): Promise<CompanyMeProfile> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/companies/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal memperbarui profil perusahaan.');
  }
  return await res.json();
}

export async function getMyCompanyAnalytics(): Promise<CompanyAnalyticsResponse> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/companies/me/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal memuat analitik rekrutmen perusahaan.');
  }
  return await res.json();
}

export async function getMyCompanyJobs(page = 1, limit = 10): Promise<PaginatedJobsResponse> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/jobs/my?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal memuat lowongan perusahaan.');
  }
  return await res.json();
}

export async function deleteJob(jobId: string): Promise<boolean> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.ok;
}

// ==========================================================
// 8. AI GENERATE JOB DESCRIPTION (Swagger: /jobs/generate-description)
// ==========================================================

export interface AiJobDescResponse {
  description: string;
  requirements: string;
  recommended_skills: string[];
}

export async function generateAiJobDescription(payload: {
  title: string;
  category?: string;
  experience_level?: string;
}): Promise<AiJobDescResponse> {
  const token = authStorage.getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/jobs/generate-description`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal menghasilkan deskripsi AI.');
  }
  return await res.json();
}

// ==========================================================
// 9. META MASTER DATA & DYNAMIC FILTER OPTIONS
// ==========================================================

export interface DynamicFilterOptions {
  categories: string[];
  locations: string[];
  job_types: { value: string; label: string }[];
  workplace_types: { value: string; label: string }[];
  experience_levels: { value: string; label: string }[];
  salary_range: { min: number; max: number };
}

export async function getFilterOptions(): Promise<DynamicFilterOptions | null> {
  try {
    const res = await fetch(`${API_BASE}/meta/filter-options`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getMetaCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/meta/categories`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getMetaFaqs(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/meta/faqs`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ==========================================================
// 10. REVIEWS & COMPANY DETAILS (ALA GLASSDOOR)
// ==========================================================

export interface CompanyReviewItem {
  id: string;
  company_id: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  job_title?: string;
  is_current_employee?: boolean;
  created_at: string;
}

export async function getCompanyDetail(companyId: string): Promise<CompanyMeProfile> {
  const res = await fetch(`${API_BASE}/companies/${companyId}`);
  if (!res.ok) {
    throw new Error('Perusahaan tidak ditemukan');
  }
  return await res.json();
}

export async function getCompanyReviews(companyId: string): Promise<CompanyReviewItem[]> {
  try {
    const res = await fetch(`${API_BASE}/companies/${companyId}/reviews`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addCompanyReview(
  companyId: string,
  payload: { rating: number; title: string; pros: string; cons: string; job_title?: string; is_current_employee?: boolean }
): Promise<CompanyReviewItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu untuk memberi ulasan.');

  const res = await fetch(`${API_BASE}/companies/${companyId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal mengirimkan ulasan.');
  }
  return data;
}

export async function toggleFollowCompany(companyId: string): Promise<{ is_following: boolean; message: string }> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu.');

  const res = await fetch(`${API_BASE}/companies/${companyId}/follow`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal mengubah status ikuti.');
  }
  return await res.json();
}

// ==========================================================
// 11. JOB ALERTS & ANTI-SCAM REPORTING
// ==========================================================

export interface JobAlertItem {
  id: string;
  keyword?: string;
  category?: string;
  location?: string;
  frequency: 'daily' | 'weekly';
  is_active: boolean;
}

export async function getJobAlerts(): Promise<JobAlertItem[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/jobs/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function createJobAlert(payload: {
  keyword?: string;
  category?: string;
  location?: string;
  frequency?: 'daily' | 'weekly';
}): Promise<JobAlertItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu.');

  const res = await fetch(`${API_BASE}/jobs/alerts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Gagal membuat notifikasi lowongan.');
  return data;
}

export async function reportJob(
  jobId: string,
  payload: { reason: string; description: string }
): Promise<any> {
  const token = authStorage.getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/jobs/${jobId}/report`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Gagal mengirim laporan.');
  return data;
}

// ==========================================================
// 12. ATS PIPELINE PER JOB (Khusus Perusahaan)
// ==========================================================

export interface AtsPipelineResponse {
  job_id: string;
  job_title: string;
  stages: {
    applied: BackendApplicationItem[];
    screening: BackendApplicationItem[];
    interview: BackendApplicationItem[];
    offered: BackendApplicationItem[];
    accepted: BackendApplicationItem[];
    rejected: BackendApplicationItem[];
  };
}

export async function getJobAtsPipeline(jobId: string): Promise<AtsPipelineResponse> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk sebagai Perusahaan.');

  const res = await fetch(`${API_BASE}/applicants/jobs/${jobId}/pipeline`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Gagal memuat pipeline ATS lowongan.');
  }
  return await res.json();
}

// ==========================================================
// 13. ASSESSMENTS / SKILL TEST (Swagger: /assessments)
// ==========================================================

export interface AssessmentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  badge_reward?: string;
  questions_count?: number;
}

export interface QuestionPublicItem {
  id: string;
  question_text: string;
  options: string[];
}

export interface AssessmentDetailItem extends AssessmentItem {
  questions: QuestionPublicItem[];
}

export interface AssessmentResultItem {
  id: string;
  assessment_id: string;
  assessment_title: string;
  score: number;
  is_passed: boolean;
  badge?: string;
  completed_at: string;
  total_questions: number;
  correct_answers_count: number;
}

export async function getAssessments(): Promise<AssessmentItem[]> {
  try {
    const res = await fetch(`${API_BASE}/assessments/`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getAssessmentDetail(assessmentId: string): Promise<AssessmentDetailItem | null> {
  try {
    const res = await fetch(`${API_BASE}/assessments/${assessmentId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function submitAssessment(
  assessmentId: string,
  answers: { question_id: string; selected_option_index: number }[]
): Promise<AssessmentResultItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu untuk mengikuti tes.');

  const res = await fetch(`${API_BASE}/assessments/${assessmentId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Gagal mengirimkan jawaban tes.');
  }
  return data;
}

export async function getMyAssessmentResults(): Promise<AssessmentResultItem[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/assessments/me/results`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ==========================================================
// 14. CHAT & MESSAGING (Swagger: /chat)
// ==========================================================

export interface ChatMessageItem {
  id: string;
  sender_id: string;
  sender_name?: string;
  message: string;
  created_at: string;
}

export interface ChatConversationItem {
  id: string;
  job_id?: string;
  job_title?: string;
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;
  last_message?: string;
  last_message_at?: string;
}

export async function getChatConversations(): Promise<ChatConversationItem[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getChatMessages(conversationId: string): Promise<ChatMessageItem[]> {
  const token = authStorage.getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function sendChatMessage(conversationId: string, message: string): Promise<ChatMessageItem> {
  const token = authStorage.getToken();
  if (!token) throw new Error('Harap masuk terlebih dahulu.');

  const res = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Gagal mengirim pesan.');
  return data;
}

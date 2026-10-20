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

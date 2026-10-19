import { authStorage } from './auth';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL)
  ? import.meta.env.PUBLIC_API_URL
  : 'http://127.0.0.1:8000/api/v1';

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
  status: string;
  company_name: string;
  company_logo?: string;
  company_city?: string;
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

export interface AdminStats {
  total_users: number;
  total_companies: number;
  pending_company_verifications: number;
  total_jobs: number;
  total_applications: number;
  pending_job_reports: number;
}

/**
 * Fetch public jobs with server-side pagination & filters directly from FastAPI BE
 */
export async function getJobs(params: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  category?: string;
} = {}): Promise<PaginatedJobsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.search) query.set('search', params.search);
  if (params.location) query.set('location', params.location);
  if (params.category) query.set('category', params.category);

  const res = await fetch(`${API_BASE}/jobs/?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Gagal memuat lowongan pekerjaan dari backend');
  }
  return await res.json();
}

/**
 * Fetch candidate applications from FastAPI BE
 */
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

/**
 * Fetch system stats (for Admin or overall overview)
 */
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

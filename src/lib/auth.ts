export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: 'admin' | 'company' | 'jobseeker';
  user_id: string;
  email: string;
}

export interface UserMe {
  id: string;
  email: string;
  role: 'admin' | 'company' | 'jobseeker';
  is_active: boolean;
  is_two_factor_enabled: boolean;
  created_at: string;
  profile?: Record<string, any>;
}

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_API_URL)
  ? import.meta.env.PUBLIC_API_URL
  : 'http://127.0.0.1:8000/api/v1';

export const authStorage = {
  TOKEN_KEY: 'jobseeker_access_token',
  USER_KEY: 'jobseeker_user',

  saveSession(data: LoginResponse) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, data.access_token);
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({
        user_id: data.user_id,
        email: data.email,
        role: data.role,
        token_type: data.token_type,
      })
    );
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser(): { user_id: string; email: string; role: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.detail || (Array.isArray(data) ? data[0]?.msg : 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    throw new Error(errorMsg);
  }

  authStorage.saveSession(data as LoginResponse);
  return data as LoginResponse;
}

export async function getCurrentUser(): Promise<UserMe> {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error('Belum terautentikasi');
  }

  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      authStorage.clearSession();
    }
    throw new Error(data.detail || 'Gagal memuat profil pengguna');
  }

  return data as UserMe;
}

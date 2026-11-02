# 🚀 Jobseeker Frontend Web Application

[![Astro](https://img.shields.io/badge/Framework-Astro%205-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/Library-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide%20React-F36?logo=feather&logoColor=white)](https://lucide.dev/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer%20Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

Frontend antarmuka web modern untuk portal rekrutmen **Jobseekers** yang dibangun menggunakan **Astro 5** (Islands Architecture), **React 19**, dan **Tailwind CSS v4**. 

Menyediakan pengalaman terintegrasi untuk 3 peran pengguna:
1. **Pencari Kerja (Jobseeker Portal)**: Eksplorasi lowongan interaktif, pelacakan lamaran ATS secara real-time, kuis asesmen keahlian, dan kelola profil kandidat.
2. **Perusahaan Mitra (Merchant / Recruiter Dashboard)**: Pipeline kandidat Kanban, analitik pelamar dan impresi lowongan, serta pembuat lowongan dengan bantuan Google Gemini AI.
3. **Super Admin (Admin Matrix Dashboard)**: Monitoring statistik ekosistem, verifikasi berkas legalitas perusahaan (NIB/SIUP), moderasi lowongan, audit activity logs, dan manajemen pengguna.

---

## 📁 Struktur Direktori Frontend

```
Jobseeker-frontend/
├── public/                             # Asset statis gambar publik, logo, dan favicon
├── src/
│   ├── components/                     # Komponen Antarmuka Pengguna Berbasis React
│   │   ├── chat/                       # Komponen Percakapan
│   │   │   └── ChatWidget.tsx          # Floating widget chat real-time antara kandidat & recruiter
│   │   │
│   │   ├── dashboard/                  # Panel Dashboard Khusus Merchant & Super Admin
│   │   │   ├── AdminJobApprovalsView.tsx   # Panel moderasi dan approval lowongan kerja
│   │   │   ├── AdminValidationView.tsx     # Panel verifikasi legalitas perusahaan (NIB/Kemenkumham)
│   │   │   ├── DashboardLayout.tsx         # Layout wrapper dashboard dengan sidebar dan header
│   │   │   ├── DashboardMatrix.tsx         # Dashboard utama Admin (Statistik, User Mgmt, Audit Log)
│   │   │   ├── Footer.tsx                  # Footer dashboard
│   │   │   ├── MerchantAtsModal.tsx        # Modal detail peninjauan kandidat & riwayat proses
│   │   │   ├── MerchantDashboardView.tsx   # Dashboard analitik rekrutmen & funnel pelamar mitra
│   │   │   ├── MerchantJobsView.tsx        # Tabel manajemen dan status lowongan milik perusahaan
│   │   │   ├── MerchantProfileView.tsx     # Kelola profil perusahaan, logo, dan dokumen legalitas
│   │   │   ├── MerchantTalentsView.tsx     # Alur pipeline seleksi kandidat (Kanban board ATS)
│   │   │   ├── Navbar.tsx                  # Topbar navigasi dashboard
│   │   │   └── Sidebar.tsx                 # Sidebar menu navigasi dashboard
│   │   │
│   │   ├── jobseeker/                  # Panel Antarmuka Khusus Pencari Kerja
│   │   │   ├── AuthRequiredModal.tsx       # Modal peringatan masuk akun saat melamar/bookmark
│   │   │   ├── JobApplicationModal.tsx     # Form pengiriman lamaran (upload CV & screening questions)
│   │   │   ├── JobseekerApplicationsView.tsx# Riwayat & pelacakan status lamaran (ATS tracker)
│   │   │   ├── JobseekerDashboardView.tsx  # Beranda ringkasan pencari kerja & rekomendasi lowongan
│   │   │   ├── JobseekerExploreView.tsx    # Halaman jelajah lowongan dengan multi-filter & search
│   │   │   ├── JobseekerJobDetailView.tsx  # Halaman detail lowongan, deskripsi, & profil perusahaan
│   │   │   ├── JobseekerNavbar.tsx         # Navigasi khusus pencari kerja
│   │   │   ├── JobseekerPortal.tsx         # Router sentral switch tab portal pencari kerja
│   │   │   ├── JobseekerProfileEditView.tsx# Formulir pengeditan profil, riwayat kerja & pendidikan
│   │   │   ├── JobseekerProfileView.tsx    # Tampilan profil ringkas & dokumen CV kandidat
│   │   │   └── SkillAssessmentModal.tsx    # Modal kuis asesmen keahlian interaktif dengan skor live
│   │   │
│   │   ├── AboutPage.tsx               # Halaman Tentang Kami
│   │   ├── ApplicantsPage.tsx          # Halaman Manajemen Pelamar publik
│   │   ├── ContactPage.tsx             # Halaman Kontak & Bantuan
│   │   ├── ExplorePage.tsx             # Penjelajahan lowongan umum
│   │   ├── FaqPage.tsx                 # Tanya Jawab (FAQ)
│   │   ├── ForgotPasswordPage.tsx      # Alur lupa kata sandi & input OTP reset
│   │   ├── GuidePage.tsx               # Panduan penggunaan platform
│   │   ├── HomePage.tsx                # Beranda utama Jobseekers (Hero, Kategori, Lowongan Unggulan)
│   │   ├── JobsExplorer.tsx            # Komponen pencarian lowongan kerja
│   │   ├── JoinPage.tsx                # Registrasi khusus kemitraan perusahaan
│   │   ├── LoginPage.tsx               # Form masuk akun (Email & Password + toggle peran)
│   │   ├── PrivacyPage.tsx             # Ketentuan privasi pengguna
│   │   └── RegisterPage.tsx            # Form pendaftaran akun baru
│   │
│   ├── layouts/                        # Layout Dasar Astro
│   │   └── Layout.astro                # Template dokumen HTML root, metadata SEO, font, stylesheet
│   │
│   ├── lib/                            # Integrasi API & State Manajemen
│   │   ├── api.ts                      # Client Fetch API terpusat & kontrak type TypeScript
│   │   ├── auth.ts                     # Penyimpanan token JWT, session, dan utilitas state pengguna
│   │   └── utils.ts                    # Helper format rupiah (IDR), tanggal, status badge class
│   │
│   └── pages/                          # Rute Halaman File-Based Astro
│       ├── about.astro                 # URL: /about
│       ├── applicants.astro            # URL: /applicants
│       ├── contact.astro               # URL: /contact
│       ├── dashboard.astro             # URL: /dashboard (Router otomatis Admin vs Merchant)
│       ├── explore.astro               # URL: /explore
│       ├── faq.astro                   # URL: /faq
│       ├── forgot-password.astro       # URL: /forgot-password
│       ├── guide.astro                 # URL: /guide
│       ├── index.astro                 # URL: / (Beranda publik)
│       ├── jobs.astro                  # URL: /jobs (Portal lowongan kerja)
│       ├── join.astro                  # URL: /join
│       ├── login.astro                 # URL: /login
│       ├── privacy.astro               # URL: /privacy
│       └── register.astro              # URL: /register
│
├── astro.config.mjs                    # Konfigurasi Astro, Tailwind Vite Plugin, Port Server
├── package.json                        # Script npm & daftar dependensi Node.js
├── tsconfig.json                       # Konfigurasi kompilator TypeScript
└── README.md                           # Dokumentasi Teknis Frontend (file ini)
```

---

## ⚡ Fitur Utama Frontend

- **100% Dinamis & Terhubung ke Backend**: Seluruh data lowongan, pelamar, perusahaan, pengguna, analitik grafis, dan log audit langsung ditarik dari database PostgreSQL tanpa hardcoded data.
- **Pencarian & Filter Cepat**: Filter berdasarkan kategori posisi, kota kerja, tipe kontrak (Full-time, Part-time, Internship, Contract), model kerja (Remote, Hybrid, Onsite), serta rentang gaji.
- **ATS Kanban Pipeline**: Recruiter dapat memindahkan status pelamar (`Ditinjau`, `Asesmen`, `Wawancara`, `Diterima`, `Ditolak`) secara responsif.
- **Bantuan AI Gemini**: Form pembuatan lowongan dilengkapi generator otomatis yang menghasilkan deskripsi pekerjaan, kualifikasi, dan rekomendasi keahlian hanya dengan memasukkan judul posisi.
- **Kuis Asesmen Interaktif**: Modal evaluasi skill yang menyajikan soal pilihan ganda dinamis dan mengirimkan skor akhir secara otomatis ke database.
- **Desain Modern & Responsif**: Dibangun dengan Tailwind CSS v4, mendukung tema warna profesional, transisi halus, serta tata letak responsif di ponsel, tablet, dan desktop.

---

## 🛠️ Instalasi & Menjalankan Frontend

### 1. Prasyarat
- **Node.js**: Versi 18 atau lebih baru (Node.js 20+ sangat disarankan).
- **Backend Service**: Pastikan backend FastAPI sudah berjalan di `http://127.0.0.1:8000`.

### 2. Install Dependensi
Buka terminal dan arahkan ke direktori `Jobseeker-frontend`:
```bash
cd Jobseeker-frontend
npm install
```

### 3. Konfigurasi Endpoint API (Opsional)
Secara default, frontend langsung berkomunikasi dengan `http://127.0.0.1:8000/api/v1`. Jika backend berjalan di alamat atau port berbeda, buat berkas `.env` di folder `Jobseeker-frontend`:
```env
PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 4. Menjalankan Mode Development
```bash
npm run dev
```
Aplikasi frontend akan tersedia di:
```
http://localhost:5000
```

### 5. Membangun untuk Produksi (Production Build)
```bash
npm run build
```
Hasil build statis dan assets akan tersimpan di direktori `dist/`.

Untuk menguji hasil build secara lokal:
```bash
npm run preview
```

---

## 🔄 Integrasi Modul API ([`src/lib/api.ts`](file:///d:/Jobseekers/Jobseeker-frontend/src/lib/api.ts))

Modul `api.ts` mencakup fungsi klien lengkap yang memetakan seluruh endpoint backend:
- **Autentikasi**: `login()`, `register()`, `logout()`, `getMe()`, `forgotPassword()`, `resetPassword()`
- **Lowongan Kerja**: `getJobs()`, `getJobDetail()`, `createJob()`, `updateJob()`, `deleteJob()`, `generateAiJobDescription()`
- **Pelamar & Lamaran**: `applyJob()`, `getMyApplications()`, `withdrawApplication()`, `getSavedJobs()`, `saveJob()`
- **Manajemen Perusahaan**: `getMyCompanyJobs()`, `getCompanyApplications()`, `updateApplicantStatus()`, `getCompanyAnalytics()`
- **Kuis Asesmen**: `getAssessments()`, `getAssessmentDetail()`, `submitAssessment()`
- **Super Admin**: `getSystemStats()`, `getAdminUsers()`, `toggleAdminUserActive()`, `deleteAdminUser()`, `getPendingCompanies()`, `verifyCompany()`, `rejectCompany()`, `changeAdminJobStatus()`, `getAdminActivityLogs()`

---

## 📝 Skrip NPM Tersedia

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Astro di `http://localhost:5000` |
| `npm run build` | Melakukan kompilasi aset & pembuatan rute statis ke direktori `dist/` |
| `npm run preview`| Menguji hasil build produksi secara lokal |
| `npm run format` | Menjalankan Prettier untuk memformat berkas `.astro`, `.tsx`, `.ts`, dan CSS |

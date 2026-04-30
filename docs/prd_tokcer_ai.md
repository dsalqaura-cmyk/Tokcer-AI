# 📦 Product Requirement Document (PRD) - Tokcer AI

## 1. Lingkup Produk (Product Scope)
Tokcer AI terdiri dari 3 Dashboard Utama:
1.  **Dashboard Partner**: Alat kerja bagi afiliator/partner.
2.  **Dashboard User (Seller)**: Pusat kendali optimasi bagi seller.
3.  **Dashboard Internal (Admin)**: Pusat manajemen dan monitoring sistem.

---

## 2. Fitur Utama Per Dashboard

### A. Dashboard Partner
*   **Onboarding (Daftarkan Klien)**:
    *   Input data toko (Nama, Email, WA).
    *   Upload bukti pembayaran/transfer.
    *   Pilih paket (Starter, Pro, Elite, Ultimate).
*   **Subscribers (Daftar User)**: Monitoring user yang mendaftar melalui referral partner.
*   **Leaderboard**: Peringkat partner berdasarkan jumlah user aktif dan omzet referal.
*   **Payment (Komisi)**: Riwayat pendapatan dan status pencairan komisi.
*   **Support Center**: Form pengiriman laporan bug atau permintaan fitur.
*   **Profile**: Pengaturan data bank untuk pencairan komisi.
*   **Academy**: Koleksi video edukasi cara jualan dan penggunaan Tokcer AI.

### B. Dashboard User (Seller)
*   **Overview**: Ringkasan performa toko, sisa token AI, dan status akun.
*   **Analytics**: Grafik tren penjualan harian dan per platform.
*   **AI Generator**:
    *   Naskah Video TikTok & Instagram Reels.
    *   Deskripsi Produk (Shopee, Tokopedia, TikTok Shop).
*   **Health Check**: Metrik Chat Response, Waktu Pengiriman, dan Rating Toko.
*   **Store Connection**: Integrasi otomatis dengan API Marketplace.

### C. Dashboard Internal (Admin)
*   **Approval Center**: Verifikasi pembayaran dari pendaftaran "Direct Web" atau Upgrade paket.
*   **User Manager**: Manajemen database seluruh seller (Aktif/Pending/Non-aktif).
*   **Partnership Hub**: Verifikasi pendaftaran partner baru dan monitoring performa partner.
*   **Support Ticket**: Sistem manajemen keluhan dan permintaan user/partner.
*   **AI Strategy Hub**:
    *   Konfigurasi **DeepSeek API**.
    *   Manajemen **RAG Knowledge Base** (basis pengetahuan AI).
    *   Konfigurasi **Resend API** untuk email otomatis.
*   **Supabase Monitor**: Monitoring koneksi database, storage, dan latensi API.

---

## 3. Persyaratan Teknis (Technical Requirements)
*   **Frontend**: React (Vite) dengan Vanilla CSS & TailwindCSS.
*   **Backend & Database**: Supabase (PostgreSQL, Auth, Storage).
*   **AI Engine**: DeepSeek-V3 API.
*   **Email Engine**: Resend API (SMTP/REST).
*   **Marketplace Integration**: Scraper & API Marketplace (TikTok, Shopee, Tokopedia).

---

## 4. User Persona & Story
1.  **Sebagai Seller**: Saya ingin membuat deskripsi produk yang menarik dalam hitungan detik agar saya punya lebih banyak waktu untuk packing.
2.  **Sebagai Partner**: Saya ingin tahu berapa komisi saya hari ini agar saya semakin semangat berpromosi.
3.  **Sebagai Admin**: Saya ingin memproses aktivasi akun user secara cepat dengan satu klik agar user bisa langsung memakai layanan.

---
**Dibuat Oleh**: Antigravity AI (Siti)
**Tanggal**: 30 April 2026

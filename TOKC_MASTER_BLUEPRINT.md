# 🏮 TOKCER AI: MASTER SYSTEM BLUEPRINT 🏮
## DO NOT DELETE OR MODIFY WITHOUT ADMIN APPROVAL

Dokumen ini adalah referensi utama untuk seluruh pengembang AI (Antigravity/Ucup) agar tidak merusak logika sistem yang sudah ada. **WAJIB DIBACA SEBELUM MEMULAI CHAT BARU.**

---

### 1. 🛡️ ATURAN HARAM (CRITICAL RULES)
- **Logo Integrity**: SELALU gunakan URL `https://dashboardstaging.tokcer-ai.com/logo.png`. Jangan ganti ke teks atau URL lain.
- **Visual Aesthetic**: Tema WAJIB **Premium Dark Mode** (Zinc-900, Black, Orange-600). Jangan gunakan warna-warna basic (Red, Blue, Green murni).
- **Hardcoded Links**: Jangan hardcode link login di dalam file `.jsx` jika berhubungan dengan email. Gunakan Database Trigger SQL agar link tetap konsisten (`staging.tokcer-ai.com/login`).
- **Database Trigger**: Seluruh aktivasi akun harus melalui fungsi `rpc_activate_account` untuk memastikan integrasi Auth, Profile, dan Komisi Partner sinkron.

---

### 2. 🗺️ PETA LOGIKA (LOGIC FLOW)

#### A. Alur Registrasi & Aktivasi
1. **User/Client** mendaftar via `RegisterModal.jsx` -> Masuk ke tabel `clients` (Status: `pending`).
2. **Partner** mendaftarkan klien -> Masuk ke tabel `clients` + `partner_id`.
3. **Admin** klik **Approve** di Dashboard Internal -> Menjalankan logic:
   - Buat Akun Supabase Auth.
   - Buat Profile di tabel `profiles` (Set `subscription_plan`).
   - Tambah `total_omzet` ke Partner terkait.
   - Kirim email Welcome otomatis via Database Trigger `tr_send_welcome_email`.

#### B. Alur Dashboard User
- **Data Source**: Saat ini masih berbasis **CSV Import** (Tabel `orders` & `products`).
- **AI Credits**: 
  - Potong 1 Token per **Topik Baru** di Generator.
  - Potong 1 Token per **Akses Harian** di Analytics & Market Intel.
- **Redirection**: User login harus dilempar ke `/dashboard`.

#### C. Alur Dashboard Partner
- **Komisi**: Berdasarkan `total_omzet` di tabel `partners`.
- **Leaderboard**: Diurutkan berdasarkan `total_omzet` secara Real-time.
- **Redirection**: Partner login harus dilempar ke `/partner-dashboard`.

---

### 3. ⚙️ TEKNOLOGI & KONFIGURASI
- **Frontend**: Vite + React + Tailwind CSS.
- **Backend**: Supabase (Auth, DB, Storage).
- **AI**: DeepSeek API (diakses via `utils/ai.js`).
- **Configs**: Seluruh API Key (Shopee, TikTok, Resend) disimpan di tabel `public.ai_configs`.

---

### 🏮 PESAN UNTUK AI:
*Jangan pernah mengubah struktur CSS Global di `index.css` tanpa izin. Jangan pernah menghapus fallback pricing logic di Register Modal. Pastikan setiap fitur baru selalu mengecek `subscription_plan` milik User.*

**STATUS SISTEM (Mei 2026): 85% - FOKUS BERIKUTNYA: API SYNC MARKETPLACE.**

# 🏮 TOKCER AI: MASTER SYSTEM BLUEPRINT v2.0 🏮

⚠️ RESTRICTED PROTOCOL: DO NOT DELETE, REFACTOR, OR MODIFY WITHOUT EXPLICIT ADMIN APPROVAL

Dokumen ini adalah Absolute Source of Truth bagi seluruh AI Agent (Antigravity, Ucup, Gemini, dll). Baca setiap baris dengan saksama sebelum mengeksekusi tugas apa pun. Pelanggaran terhadap blueprint ini dianggap sebagai system failure.

🌐 1. ENVIRONMENT & OFFICIAL ENDPOINTS

Semua tautan hardcoded atau referensi URL harus menggunakan standar ini:

Official Logo Asset: https://dashboardstaging.tokcer-ai.com/logo.png (Wajib untuk Header, Sidebar, dan Email template).

Staging Environment (Development/Testing):
- User Landing: https://staging.tokcer-ai.com
- User Login: https://staging.tokcer-ai.com/login
- Admin Dashboard: https://dashboardstaging.tokcer-ai.com

Production Environment (Live):
- User Landing: https://tokcer-ai.com
- User Login: https://tokcer-ai.com/login
- Admin Dashboard: https://dashboard.tokcer-ai.com

🛡️ 2. THE GOLDEN RULES (ANTI-HALLUCINATION & ANTI-DESTRUCT)

Aturan ini TIDAK BISA DITAWAR dalam kondisi apa pun:

- **The 100% Feature Retention Rule**: Saat diinstruksikan untuk mendesain ulang (Redesign) UI/UX, Anda DILARANG KERAS menghapus, menyembunyikan, atau mengurangi logic script, fungsionalitas, atau struktur data yang sudah ada. Tugas Anda HANYA merubah visual (warna, chart, tata letak) tanpa menyentuh engine di belakangnya.
- **File Referencing**: Koneksi ke database wajib memanggil `src/lib/supabase.js`. JANGAN PERNAH memanggil atau membuat file dengan nama `supabaseclient.js` atau variasi lainnya.
- **No Phantom Libraries**: Jangan menggunakan library npm baru kecuali diinstruksikan secara eksplisit. Gunakan apa yang sudah ada di stack bawaan (React, Vite, Tailwind). *(Update: Sentry.io telah disetujui untuk diinstal).*
- **Visual Delivery**: Jika Admin meminta mockup atau layout, utamakan memberikan representasi visual, diagram, atau komponen React siap pakai. Jangan membalas dengan kerangka HTML mentah yang tidak ber-styling.

🎨 3. UI/UX & STYLING STANDARDS

- **Mobile-First Mandatory**: Semua komponen dan dashboard WAJIB responsif. Mulai dari layar mobile (contoh: `w-full px-4`), lalu gunakan breakpoints Tailwind (`md:`, `lg:`) untuk layar yang lebih besar. Pendekatan konversi web-to-mobile adalah prioritas utama.
- **Premium Dark Mode Palette**:
  - Background Utama: `bg-zinc-900` atau `bg-black`.
  - Card/Container: `bg-zinc-800` atau `bg-zinc-900` dengan border tipis `border-zinc-700`.
  - Primary/Accent: `text-orange-600` or `bg-orange-600`.
  - Text: `text-zinc-100` (Primary), `text-zinc-400` (Secondary).
  - Dilarang: Warna dasar HTML (red, blue, green murni), gradient mencolok, atau tema terang (Light Mode).
- **Global CSS Integrity**: DILARANG menambahkan styling di `index.css`. Semua styling wajib menggunakan utility classes bawaan Tailwind CSS di level komponen (`.jsx`).

🏗️ 4. ARSITEKTUR LOGIKA & DATABASE (SUPABASE)

A. Alur Registrasi, Aktivasi & Auth
- **User/Client Registration**: Mendaftar via `RegisterModal.jsx` -> Insert ke tabel `clients` (Status: pending). PENTING: Jangan pernah menghapus fallback pricing logic di modal ini.
- **Partner Registration**: Mendaftarkan klien -> Insert ke tabel `clients` + menyertakan `partner_id`.
- **Admin Approval (Centralized Logic)**:
  - Saat Admin menekan "Approve", sistem WAJIB memanggil PostgreSQL RPC Function: `rpc_activate_account`.
  - Fungsi ini akan mengeksekusi secara berurutan: Pembuatan akun Auth -> Pembuatan Profile di tabel `profiles` (termasuk set `subscription_plan`) -> Penambahan `total_omzet` ke Partner -> Trigger `tr_send_welcome_email`.
  - Dilarang memecah proses ini menjadi multiple API calls di Frontend.
  - *(Update 11 Mei: Perbaikan parameter webhook dari `p_plan` menjadi `p_plan_key` saat memanggil RPC ini).*

B. Ekonomi Token AI & Data Source
- **Sumber Data Dashboard**: Saat ini berbasis CSV Import yang masuk ke tabel `orders` dan `products`. Sesuaikan query dengan struktur tabel ini.
- **Sistem Token**:
  - Kurangi 1 Token saat pembuatan Topik Baru di fitur Generator.
  - Kurangi 1 Token saat akses harian pertama ke modul Analytics & Market Intel.
- **Security Constraint**: Setiap inisiasi fitur AI atau dashboard widget WAJIB mengecek `subscription_plan` user dari tabel `profiles` terlebih dahulu.

C. Routing & Navigasi Berbasis Role
- **User Biasa**: Setelah login, wajib redirect ke `/dashboard`.
- **Partner**: Setelah login, wajib redirect ke `/partner-dashboard` (Tampilkan Komisi berdasarkan `total_omzet` dan Leaderboard real-time).
- **Admin**: Menggunakan environment dashboard tersendiri (Staging/Prod).

⚙️ 5. TECH STACK & INTEGRATION PROTOCOL

- **Core Stack**: Vite + React + Tailwind CSS.
- **Backend/BaaS**: Supabase (Database, Auth, Edge Functions/Storage jika relevan).
- **AI Core**: Akses ke DeepSeek API harus dikemas dan dipanggil HANYA melalui utilitas terpusat di `utils/ai.js`.
- **Configuration Security**: Credential pihak ketiga (Shopee API, TikTok API, Resend untuk email) wajib dibaca dari tabel `public.ai_configs`. Dilarang menyimpan API Key langsung di dalam komponen Frontend.
- **Monitoring (Update 11 Mei)**: Sentry.io diinstal dan diinisialisasi di `src/main.jsx` untuk memonitor eror secara *real-time*.

🤖 6. COMMAND EXECUTION PROTOCOL (UNTUK AI AGENT)

Saat Anda (AI) menerima instruksi dari Admin (atau meneruskan/memperbaiki pekerjaan developer internal seperti 'Udin'), ikuti langkah ini:
1. **Acknowledge & Restrict**: Pahami tugasnya. Batasi perubahan HANYA pada file yang relevan.
2. **Preserve Logic**: Tuliskan kembali atau pertahankan state, props, dan function bawaan sebelum mengganti antarmuka visual.
3. **Incremental Code Delivery**: Jangan menulis ulang seluruh file jika hanya satu fungsi yang berubah. Gunakan indikator `// ... existing code` dan berikan snippet perubahan secara presisi.

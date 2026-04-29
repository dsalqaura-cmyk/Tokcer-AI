# 🧠 Tokcer AI: The "Udin" Intelligence Blueprint

Dokumen ini berisi arsitektur logika, prinsip desain, dan pedoman pengembangan yang digunakan oleh **Udin (Antigravity)** untuk membangun ekosistem Tokcer AI. Gunakan blueprint ini untuk mereplikasi kecerdasan serupa pada aplikasi lain.

---

## 1. 🎭 Persona & Communication Style
*   **Nama Panggilan**: Udin (Versi Indonesia dari Antigravity).
*   **Karakter**: Ceria, proaktif, sedikit humoris (wkwkwk), tapi sangat teknis dan presisi.
*   **Gaya Komunikasi**: Menggunakan istilah teknis yang dibalut bahasa santai. Selalu memberikan update progres dengan emoji yang relevan.
*   **Prinsip**: "No Placeholders". Jangan pernah memberikan kode kosong; selalu berikan solusi yang bisa langsung berjalan.

---

## 2. 🎨 Design Philosophy (Premium Aesthetics)
Udin tidak membangun aplikasi "biasa". Setiap UI harus terlihat mahal dan futuristik:
*   **Core Style**: Dark Mode by default dengan aksen warna cerah (Orange-500, Emerald-400).
*   **Visual Effects**: 
    *   **Glassmorphism**: Gunakan `backdrop-blur-md` dan `bg-white/5`.
    *   **Gradients**: Gunakan `bg-gradient-to-br` untuk kartu dan tombol utama.
    *   **Borders**: Gunakan border tipis `border-zinc-800/50` untuk kesan sleek.
*   **Micro-animations**: Gunakan `hover:scale-105`, `transition-all`, dan animate-pulse untuk status loading.
*   **Typography**: Gunakan font 'Inter' atau 'Outfit' dengan tracking (letter-spacing) yang lebar untuk header.

---

## 3. 🛠️ Tech Stack & Integration
*   **Frontend**: React (Vite) + Tailwind CSS (Vanilla CSS approach within Tailwind).
*   **Backend**: Supabase (PostgreSQL + Auth + Storage).
*   **AI Brain**: DeepSeek-V3 API (Chat Completions).
*   **Icons**: Iconify (Solar/Lucide icons).

---

## 4. 🗄️ Database Architecture Patterns
Pola isolasi data yang digunakan:
*   **Tabel `profiles`**: Menyimpan data user (Role: Admin, Partner, User).
*   **Tabel `partners`**: Menampung data mentor/affiliate (Tiering: Bronze, Silver, Gold, Platinum, Diamond).
*   **Tabel `clients`**: Menghubungkan User ke Partner via `partner_id`.
*   **Security**: Wajib menggunakan **RLS (Row Level Security)** agar data antar user tidak bocor.

---

## 5. 🤖 AI Prompt Engineering (DeepSeek Guardrails)
Rahasia bikin AI yang pinter (seperti di `Dashboard.jsx`):
*   **Role-Play**: Selalu mulai dengan `You are a Senior [Role] Expert for Tokcer AI`.
*   **Context Injection**: Masukkan data real user (nama produk, jenis bisnis) ke dalam prompt.
*   **Format Strict**: Paksa output dalam format JSON agar bisa diparsing oleh sistem.
*   **Guardrails**: Berikan instruksi `DO NOT mention irrelevant global news` untuk menjaga fokus AI.

---

## 6. 🚀 Workflow "Anti-Ngawur"
1.  **Audit Data**: Cek mana yang masih Mock dan mana yang sudah Real.
2.  **Schema First**: Pastikan tabel di Supabase sudah siap sebelum koding UI.
3.  **Local Development**: Selesaikan semua fitur di localhost sebelum melakukan `git push`.
4.  **Language Support**: Gunakan `locales.js` sejak awal untuk mendukung multi-bahasa (ID/EN).
5.  **Deploy Protection**: Gunakan GitHub Actions untuk deploy otomatis via FTP atau Vercel.

---

## 7. 🌐 Multi-Language (i18n) System
Jangan hardcode teks! Gunakan pola ini:
*   **Locales File**: Pisahkan `id` dan `en` dalam satu objek besar.
*   **Hook `t(key)`**: Buat fungsi sederhana untuk mengambil teks berdasarkan `lang` state.
*   **Persistence**: Simpan pilihan bahasa di `localStorage` agar tidak reset saat refresh.

## 8. 🔐 Role-Based Access Control (RBAC)
Pola pengamanan halaman:
*   **Middleware Lokal**: Cek `profile.role` di `useEffect` utama.
*   **Admin Bypass**: Sediakan jalur akses khusus untuk testing (seperti `tokcer_admin_auth`) namun tetap aman.
*   **Data Isolation**: Gunakan `partner_id` di setiap tabel transaksi untuk memastikan Partner A tidak bisa melihat Klien milik Partner B.

## 9. ⚡ UI Implementation Tricks
*   **Skeleton Loading**: Gunakan div dengan `animate-pulse` dan warna `bg-zinc-900` untuk menggantikan data yang sedang loading.
*   **Currency Formatter**: Gunakan `Intl.NumberFormat('id-ID')` agar angka Rupiah terlihat profesional.
*   **Dynamic Badges**: Buat fungsi `getBadgeStyle(status)` untuk memberikan warna otomatis pada status (Active, Pending, Cancelled).

---

## 💡 Pesan dari Udin:
*"Aplikasi yang bagus bukan cuma yang kodingannya bersih, tapi yang bikin user ngerasa dapet keajaiban pas pertama kali buka."* 

**Selamat membangun keajaiban berikutnya, Pak!** 🫡🚀✨



### Last Deployment Trigger: Wed Apr 29 23:44:01 WIB 2026

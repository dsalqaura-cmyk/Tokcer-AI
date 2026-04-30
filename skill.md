# 🧠 Skill Map: Tokcer AI Project Expert

Dokumen ini berisi instruksi khusus dan pemahaman mendalam untuk menangani ekosistem Tokcer AI (Website, Partner Dashboard, User Dashboard, & Internal Dashboard).

---

## 1. Konteks Ekosistem
Tokcer AI adalah platform optimasi e-commerce berbasis AI.
- **Frontend**: React (Vite) + TailwindCSS.
- **Backend**: Supabase (Auth, DB, Storage).
- **AI Engine**: DeepSeek-V3 API.
- **Email Engine**: Resend API.

---

## 2. Aturan Emas Pengembangan (Golden Rules)
1. **Defensive Coding**: Selalu gunakan fallback data (misal: `data || []`) dan defensive conversion (misal: `String(user.id)`) untuk mencegah "Blank Screen" jika data null.
2. **UUID Safety**: Saat testing dengan akun `admin-bypass`, pastikan pengiriman `user_id` ke database adalah `null` agar tidak terjadi error sintaks UUID.
3. **Storage Cleanliness**: Nama file untuk upload (bukti bayar) wajib difilter menggunakan Regex agar tidak mengandung karakter spesial atau spasi yang bisa merusak link URL.
4. **Layout Aesthetics**: Tokcer AI harus terlihat **Premium**. Gunakan gradien orange-amber, efek glassmorphism (backdrop-blur), dan font 'Inter'. Navigasi menu dashboard harus selalu presisi di tengah (Centered).

---

## 3. Logika Bisnis Kritis
- **Paket Starter**: Selalu gratis (Tanpa tulisan "Selamanya").
- **Paket Ultimate**: 
  - Registrasi Website: Durasi Bulanan.
  - Registrasi via Partner: Durasi 60 Hari (Diproses otomatis saat Approval).
- **Approval Flow**: Aktivasi akun wajib memanggil `rpc_activate_account` di database dan kemudian men-trigger email via Resend.

---

## 4. Konfigurasi Kunci (Env & DB)
- **API Keys**: Disimpan di tabel `ai_configs` (key: `system_prompt`, `resend_api_key`, `rag_knowledge_base`).
- **Authorization**: Mengambil data `ai_configs` hanya bisa dilakukan oleh profil dengan role `admin`.
- **Marketplace Sync**: Logika sinkronisasi toko berada di `Dashboard.jsx` menggunakan fungsi `autoConnectStores`.

---

## 5. Troubleshooting Cepat
- **Data Tidak Muncul di Approval**: Cek relasi Foreign Key antara `clients` dan `partners`. Jika putus, jalankan SQL `ADD CONSTRAINT`.
- **Profil Blank**: Cek apakah props `user` dan `partner` terkirim dengan benar ke komponen `ProfileTab`.
- **Register Error**: Pastikan kolom `business_type`, `platforms`, dan `plan` di tabel `clients` sudah ada dan sesuai tipe datanya.

---
**Instruksi ini bersifat permanen untuk membantu Antigravity AI bekerja lebih efisien di proyek Tokcer AI.**

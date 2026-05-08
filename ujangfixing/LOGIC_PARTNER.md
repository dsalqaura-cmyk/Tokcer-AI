# Logic Document: Dashboard Partner

Dokumentasi ini menjelaskan logika bisnis, sistem komisi, dan pencatatan referral yang berjalan di Dashboard Partner Tokcer AI.

---

## 1. Logika Hak Akses & Sesi (Authentication)
*   **Pengecekan Role:** Sistem membaca tabel `profiles` dan memastikan `role` user tersebut bernilai `'partner'`.
*   **Pengecekan Status:** Sistem juga mengecek tabel `partners` untuk memastikan status akun partner tersebut adalah `'active'`. Jika berstatus `'suspended'` (diblokir), maka akses ke dashboard akan dikunci.

---

## 2. Sistem Komisi (FLAT RATE) - *Bukan Persentase!*
Mengikuti aturan baku yang tertulis di file perjanjian partner (`PartnerAgreement.jsx`):
*   **Bukan Persentase:** Komisi partner **TIDAK DIHITUNG** berdasarkan persentase (misal 20%), melainkan menggunakan **Angka Tetap (Flat Rate)**.
*   **Sumber Data:** Nominal rupiah komisi ditarik dari database pada tabel `ai_configs` (kunci: `commission_rates_v3`) berdasarkan kombinasi **Pangkat Partner** (Bronze, Silver, Gold, Platinum) dan **Paket yang dibeli user**.
*   **Akumulasi Saldo:** Setiap kali ada user referral yang aktif, nominal komisi tersebut ditambahkan ke kolom `total_omzet` di tabel `partners`. Angka inilah yang menjadi saldo berjalan partner.

---

## 3. Sistem Pelacakan Referral
*   **Link Unik:** Setiap partner memiliki pengenal unik (Bisa berupa ID atau Nama Lengkap).
*   **Pencatatan:** Saat calon pelanggan mengklik link referral dan mengisi form pendaftaran, sistem menyimpan ID Partner tersebut ke dalam kolom `partner_id` di tabel `clients`.
*   **Trigger Cair:** Komisi **BELUM CAIR** saat user baru mendaftar (status: pending). Komisi baru otomatis dihitung dan masuk ke saldo partner saat status user tersebut berubah menjadi `'active'` (setelah sukses bayar di Midtrans).

---

## 4. Sistem Penarikan Dana (Payouts)
*   Partner dapat melihat riwayat pengiriman uang komisi mereka yang ditarik dari tabel `payouts`.
*   Jika admin sudah mentransfer uang dan mengubah status transaksi di tabel `payouts` menjadi `'paid'`, maka data tersebut akan muncul sebagai "Komisi Berhasil Dicairkan" di dashboard partner.

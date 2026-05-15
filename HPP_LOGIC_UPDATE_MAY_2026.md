# 🏮 Laporan Update Logic HPP Calculator Tokcer AI
**Status:** PROD-READY (Updated: 15 Mei 2026)
**Engineer:** Tarjo (Tokcer Assistant)

---

## 🚀 Ringkasan Perubahan Utama
Update ini merombak total sistem perhitungan margin Tokcer AI untuk mematuhi regulasi marketplace terbaru (Tokopedia, TikTok Shop, dan Shopee) per **18 Mei 2026** dan persiapan aturan **1 Juni 2026**.

### 1. 🟢 Tokopedia & TikTok Shop (Synergy Update)
Fokus pada penyesuaian biaya untuk barang bernilai tinggi (High-Ticket) dan biaya non-refundable.

| Komponen Biaya | Logic Lama | **Logic Baru (Tokcer AI v1)** | Keterangan |
|---|---|---|---|
| **Batas Maks (Cap) Komisi** | Rp40.000 | **Rp650.000** | Lonjakan 15x lipat untuk barang mahal. |
| **Biaya Pemrosesan** | Rp0 | **Rp1.250** | Flat per pesanan berhasil. |
| **Komisi Dinamis** | Belum ada | **0.5% - 2% (Manual)** | Biaya tambahan per kategori. |
| **Biaya Logistik 2026** | Estimasi | **Custom + Non-Refundable** | Tetap dihitung hangus jika terjadi retur. |
| **Biaya Gagal Kirim** | Rp0 | **Rp5.000 (Prep 1 Juni)** | Antisipasi denda COD/Gagal Kirim. |

---

### 2. 🟠 Shopee (Advanced Program Update)
Fokus pada optimalisasi biaya program marketing dan status seller.

| Komponen Biaya | Logic Tokcer AI | Keterangan |
|---|---|---|
| **Program Fee Cap** | **MAX Rp10.000** | Biaya Gratis Ongkir/Promo Xtra otomatis di-cap di Rp10rb. |
| **Star/Star+ Seller** | **+1% (Adjustable)** | Tambahan potongan admin untuk status seller premium. |
| **SPayLater Fee** | **2.5% / 4%** | Opsi cicilan yang dibebankan ke seller (3bln/6bln). |
| **Processing Fee** | **Rp1.250 (July 2025)** | Sudah siap buat aturan tahun depan. |

---

### 3. 🧠 Fitur "True Net Profit" (Inovasi Tokcer AI)
Ini adalah fitur unggulan yang membedakan Tokcer AI dari kalkulator HPP biasa.

*   **Risk Adjusted Logic**: Sistem menghitung biaya-biaya yang **HANGUS** saat terjadi retur (Biaya Admin, Logistik, Dinamis, Packaging).
*   **Return Risk Cost**: `(Return Rate % / 100) * Total Biaya Hangus`.
*   **True Net Profit**: `Profit Bersih - Return Risk Cost`.
*   **Dashboard Alert**: Penambahan banner pantauan regulasi **Menteri UMKM Maman Abdurrahman** untuk transparansi kebijakan Pemerintah.

---

## 🛠️ Teknis Perubahan (File Affected)
*   `src/pages/HppCalculator.jsx`: Update total logic `useMemo`, `handleSave`, dan UI components.
*   `src/components/dashboard/Sidebar.jsx`: Penyelarasan navigasi.

---
**Catatan Engineer:** 
*Update ini sudah mengamankan margin seller dari biaya-biaya tersembunyi yang sering terlupakan di aturan marketplace 2026.* 🕵️‍♂️🔥📡

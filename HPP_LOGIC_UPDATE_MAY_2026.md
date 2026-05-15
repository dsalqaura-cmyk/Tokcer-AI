# 🏮 Laporan Update Logic HPP Calculator Tokcer AI v2.0
**Status:** PRODUCTION & STAGING LIVE (Updated: 15 Mei 2026)
**Engineer:** Tarjo (Tokcer Assistant)

---

## 🚀 Ringkasan Perubahan Utama
Update ini merombak total sistem perhitungan margin Tokcer AI untuk mematuhi regulasi marketplace terbaru (Tokopedia, TikTok Shop, dan Shopee) per **18 Mei 2026** serta mengimplementasikan **"THE PLAYBOOK" (Layer 1-8)** untuk standarisasi audit profit.

### 1. 🏗️ Arsitektur "The Playbook" (Layer 1-8)
UI Kalkulator sekarang terbagi menjadi 8 Layer sesuai standar audit operasional:
- **Layer 1:** Fixed Cost (HPP + Packaging + Ongkir Subsidi).
- **Layer 2:** Platform Commission (Otomatis per Kategori).
- **Layer 3:** Per-Order Fixed Fee (Rp1.250 flat Tokped/Shopee).
- **Layer 4:** Program Fee (Promo Xtra TikTok / Gratis Ongkir XTRA Shopee - Max Rp10rb).
- **Layer 5:** Pre-order Fee (+3% jika produk PO).
- **Layer 6:** Logistics Service Fee (TikTok 1 Mei 2026 - Berdasarkan berat & rute).
- **Layer 7:** Affiliate Commission % (Opsional).
- **Layer 8:** Ads Budget (% dari harga jual).

---

### 2. ⚡ Fitur Baru: Bulk Import CSV (Ultimate Only)
Tokcer AI sekarang memiliki "Mesin Import Masal" untuk efisiensi input data SKU.
- **Trigger:** Tombol "Bulk Import" di header (khusus paket Ultimate).
- **Format CSV:** `Nama SKU, Platform, Modal Beli, Packaging, Biaya Lain, Ongkir Subsidi`.
- **Logic:** Auto-parse & auto-save ke database Supabase secara masal.

---

### 3. 🟠 Shopee & Tokopedia Compliance 2026
Penyesuaian batas atas (Cap) untuk melindungi margin seller pada barang mahal:
| Marketplace | Komponen | Update Logic 2026 |
|---|---|---|
| **Tokopedia/TikTok** | Commission Cap | **Rp650.000** (Naik dari Rp40rb) |
| **Shopee** | Program Fee Cap | **Rp10.000** (Max per item) |
| **Keduanya** | Fixed Admin Fee | **Rp1.250** per pesanan |
| **Antisipasi 1 Juni** | Failed Delivery | **Rp5.000** (Dihitung dalam True Profit) |

---

### 4. 🎨 UI Refactoring: Minimalist & Premium
Berdasarkan arahan Pak Iman, tampilan header dibersihkan (Minimalist Mode):
- **Hidden:** Banner "Pantauan Menteri UMKM" (tetap berjalan di background logic).
- **Hidden:** Subtitle real-time optimization.
- **Focus:** Judul dominan **"HPP & MARGIN EXPLORER"** untuk kesan lebih premium dan bersih.

---

### 🛡️ True Net Profit (Advanced Risk Logic)
Kalkulator sekarang menghitung **"Untung Bersih Asli"** dengan memperhitungkan:
- Biaya yang **hangus** saat retur (Admin Fee, Logistics Fee 1 Mei).
- Estimasi kerugian berdasarkan **Return Rate (%)**.
- Biaya gagal kirim COD yang tidak tertagih.

---

## 📂 Lokasi File & Deployment
- **Core Logic:** `src/pages/HppCalculator.jsx`
- **AEO Engine:** `/aeo-engine/`
- **Deployment:** Sudah tersinkronisasi di branch `main` (Production) dan `staging`.

**Laporan ini dibuat sebagai panduan resmi pengembangan Tokcer AI sesi Mei 2026.** 🫡🔥✨

# 🏮 Dokumentasi Teknis: Upgrade HPP Calculator Tokcer AI v2.0
**Status:** FULL PRODUCTION & STAGING DEPLOYED
**Tanggal Update:** 15 Mei 2026
**Engineer:** Tarjo (Tokcer AI Core Team)

---

## 🚀 I. Pendahuluan
Dokumen ini merinci pembaruan besar pada modul **HPP & Margin Explorer** Tokcer AI. Update ini bukan sekadar perubahan UI, melainkan perombakan engine kalkulasi untuk mengantisipasi gejolak biaya marketplace (Tokopedia, TikTok Shop, Shopee) per Mei - Juni 2026.

---

## 🏗️ II. Arsitektur "THE PLAYBOOK" (Layer 1-8)
Sistem sekarang menggunakan arsitektur bertingkat (*Layered Input*) untuk memastikan tidak ada biaya "siluman" yang terlewat oleh seller.

### Layer 1: Fixed Cost (HPP Dasar)
- **Komponen:** Harga beli barang, biaya packaging (bubble wrap, box), dan subsidi ongkir yang ditanggung seller.
- **Logic:** `Layer 1 = Modal + Packaging + Ongkir Subsidi + Biaya Lain`.

### Layer 2: Platform Fee (Core Commission)
- **Tokopedia/TikTok:** Otomatis mengikuti kategori produk. Update 18 Mei menerapkan **CAP Rp650.000** per item (PENTING untuk barang High-Ticket).
- **Shopee:** Mengikuti kategori A-E.

### Layer 3: Per-Order Fixed Fee
- **Logic:** Biaya flat **Rp1.250** yang dipotong otomatis oleh sistem marketplace per pesanan berhasil. Berlaku universal di semua platform utama 2026.

### Layer 4: Program Fee (Dynamic Marketing)
- **TikTok Shop:** Komisi Dinamis (Dynamic Commission) jika seller mengikuti promo Xtra.
- **Shopee:** Biaya program Gratis Ongkir XTRA & Promo XTRA.
- **Safety Logic:** Shopee Program Fee otomatis di-**CAP di angka Rp10.000** per produk untuk menjaga margin seller.

### Layer 5: Pre-Order Fee
- **Logic:** Tambahan biaya administrasi sebesar **+3%** jika produk diset sebagai Pre-Order (PO).

### Layer 6: Logistics Service Fee (1 Mei 2026)
- **Khusus TikTok:** Biaya layanan logistik baru yang dihitung manual berdasarkan berat dan rute. Sifat biaya ini adalah **NON-REFUNDABLE** (tidak kembali jika terjadi retur).

### Layer 7 & 8: Affiliate & Ads
- **Layer 7:** Komisi yang dibayarkan ke konten kreator/affiliator.
- **Layer 8:** Budget pemasaran internal (internal ads) yang dihitung dari persentase harga jual.

---

## 📉 III. Engine "True Net Profit" (Risk-Adjusted)
Ini adalah fitur inovasi terbaru Tokcer AI. Sistem tidak lagi hanya menghitung untung di atas kertas, tapi menghitung risiko di lapangan.

**Rumus Profit Bersih Standar:**
> `Profit = Harga Jual - HPP - Platform Fee - Diskon`

**Rumus TRUE NET PROFIT (Tokcer AI Exclusive):**
> `True Net Profit = Profit - (Return Rate % * Lost per Return)`

**Lost per Return mencakup:**
- Biaya Admin & Logistik yang hangus (Non-refundable).
- Biaya pengemasan yang sudah terpakai.
- **Biaya Gagal Kirim (Antisipasi 1 Juni):** Estimasi Rp5.000 per paket gagal.

---

## ⚡ IV. Fitur Bulk Import & Database
Untuk pengguna paket **ULTIMATE**, sistem kini mendukung penginputan masal.

### Skema Database (`sku_calculations`):
| Field | Tipe Data | Deskripsi |
|---|---|---|
| `sku_name` | String | Nama identitas produk |
| `modal_beli` | Numeric | Harga beli unit |
| `platform` | Enum | Tokopedia, Shopee, TikTok, Website |
| `komisi_dinamis` | Numeric | Persentase Layer 4 |
| `is_preorder` | Boolean | Flag Layer 5 |
| `return_rate_persen`| Numeric | Variabel risiko retur |

### Mekanisme CSV Import:
Mesin pembaca file CSV menggunakan `FileReader API` di sisi klien untuk memproses data secara asinkron sebelum dikirim ke Supabase via `insert()`. Hal ini mencegah *server-timeout* saat mengunggah ribuan baris data sekaligus.

---

## 🎨 V. Filosofi Desain: Minimalist & Focused
UI Refactoring dilakukan untuk menghilangkan *cognitive load* pada user:
1. **Minimalist Header:** Menghilangkan banner regulasi agar user fokus pada data angka.
2. **Contextual Section:** Field Shopee hanya muncul jika platform Shopee dipilih.
3. **Real-time Memoization:** Menggunakan React `useMemo` untuk memastikan setiap perubahan angka (bahkan saat mengetik) langsung meng-update profit tanpa *re-render* yang berat.

---

## 📅 VI. Road Map & Maintenance
- **18 Mei 2026:** Validasi otomatis kenaikan CAP Tokopedia ke Rp650.000.
- **1 Juni 2026:** Aktivasi field "Biaya Gagal Kirim" secara default jika regulasi resmi diberlakukan.

**Dokumen ini adalah aset intelektual Tokcer AI.** 🫡🔥✨

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
TOKCER AI - INFINITE CONTENT GENERATOR (Gemini 1.5 Flash & Local Engine)
=============================================================================
Fungsi: Mengisi kembali bank template konten secara otomatis. Mendukung dual-mode:
       menggunakan API Gemini 1.5 Flash (Rp 0,-) jika kunci API disematkan, atau
       menggunakan Mesin Aturan Lokal Offline (100% gratis, tanpa API Key).
Biaya Operasional: Rp 0,- (Google AI Studio Free Tier / Local Engine)
Author: Tarjo (Developer) & Udin (Analyst)
=============================================================================
"""

import os
import sys
import time
import json
import requests

# Import tema resmi Tokcer AI
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from tokcer_themes import TEMA_365, get_tema
except ImportError:
    from ujangfixing.tokcer_themes import TEMA_365, get_tema

# =============================================================================
# 1. LOAD CONFIGURATIONS FROM ENV
# =============================================================================
def load_env():
    env_vars = {}
    paths = [".env", ".env.staging", "../.env", "../.env.staging"]
    for path in paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        env_vars[k.strip()] = v.strip().replace('"', '').replace("'", "")
            break
    return env_vars

ENV = load_env()
SUPABASE_URL = ENV.get("VITE_SUPABASE_URL", "https://gejccutabxtyxsveczvd.supabase.co")
SUPABASE_ANON_KEY = ENV.get("VITE_SUPABASE_ANON_KEY", "")
GEMINI_API_KEY = ENV.get("VITE_GEMINI_API_KEY") or ENV.get("GEMINI_API_KEY")

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json"
}

# =============================================================================
# 2. SUPABASE HELPER FUNCTIONS
# =============================================================================
def get_unused_content_count():
    url = f"{SUPABASE_URL}/rest/v1/viral_templates?used=eq.false&select=id"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            return len(res.json())
        else:
            print(f"[Warning] Gagal mengambil unused count. Status: {res.status_code}")
    except Exception as e:
        print(f"[Warning] Exception get_unused_content_count: {e}")
    return 0

def get_total_content_count():
    url = f"{SUPABASE_URL}/rest/v1/viral_templates?select=id"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            return len(res.json())
        else:
            print(f"[Warning] Gagal mengambil total count. Status: {res.status_code}")
    except Exception as e:
        print(f"[Warning] Exception get_total_content_count: {e}")
    return 0

# =============================================================================
# 3. 100% OFFLINE LOCAL EXPANSION ENGINE (0-COST, NO API KEY)
# =============================================================================
PILAR_TEMPLATES = {
    "Pilar 1 — Pain Point & Awareness": [
        (
            "Banyak online seller tidak sadar keuntungan mereka habis dimakan ongkos operasional harian.",
            "Lakukan pencatatan rapi dan hilangkan segala pengeluaran yang tidak perlu sekarang."
        ),
        (
            "Kebocoran profit kecil jika dibiarkan terus-menerus bisa membuat toko kamu bangkrut.",
            "Mulai amati cost structure toko online kamu secara jeli dan teliti."
        ),
        (
            "Persaingan harga murah sering kali mematikan margin keuntungan seller secara perlahan.",
            "Fokuslah meningkatkan nilai tambah produk daripada terjebak perang harga."
        )
    ],
    "Pilar 2 — Edukasi HPP & Margin": [
        (
            "Perhitungan Harga Pokok Penjualan yang akurat adalah fondasi dari bisnis yang menguntungkan.",
            "Masukkan komponen komisi marketplace, biaya packing, dan promosi ke dalam kalkulasi."
        ),
        (
            "Banyak seller pemula mengira margin kotor sama dengan keuntungan bersih yang bisa diambil.",
            "Selalu pisahkan kas pribadi dengan keuntungan bersih toko secara disiplin."
        ),
        (
            "Kenaikan biaya bahan baku atau komisi platform bisa menggerus margin kamu secara drastis.",
            "Lakukan audit HPP berkala minimal satu bulan sekali agar harga jual tetap aman."
        )
    ],
    "Pilar 3 — Otomasi & AI for Seller": [
        (
            "Mengurus operasional toko secara manual sangat menyita waktu dan rawan terjadi kesalahan.",
            "Implementasikan teknologi otomasi pintar untuk menghemat waktu kerja harian kamu."
        ),
        (
            "Otomasi stok dan penulisan deskripsi produk membantu toko beroperasi non-stop.",
            "Manfaatkan kecerdasan buatan untuk mengoptimalkan kinerja promosi bisnis."
        ),
        (
            "Seller modern yang memanfaatkan AI akan berkembang jauh lebih cepat dibanding yang manual.",
            "Delegasikan tugas repetitif harian ke sistem cerdas agar kamu bisa fokus scale-up."
        )
    ],
    "Pilar 4 — Tokcer AI Product Showcase": [
        (
            "Tokcer AI menyediakan dashboard pantau profit real-time dan kalkulator HPP otomatis.",
            "Kelola seluruh data penjualan berbagai marketplace dengan mudah dari satu layar terpadu."
        ),
        (
            "Aplikasi Tokcer AI dirancang khusus membantu seller UMKM mengendalikan margin produk.",
            "Hindari boncos dengan analisis stok mati dan laporan keuangan otomatis yang super praktis."
        ),
        (
            "Lacak performa penjualan produk kamu dan dapatkan analisis rekomendasi cerdas.",
            "Bergabunglah dengan ribuan seller Indonesia yang sudah menertibkan keuangan bisnis mereka."
        )
    ],
    "Pilar 5 — Strategi Scale-Up Marketplace": [
        (
            "Untuk mendongkrak penjualan, seller wajib memiliki strategi manajemen stok yang lincah.",
            "Gunakan analisis pareto untuk fokus mempromosikan produk yang paling mendatangkan untung."
        ),
        (
            "Meningkatkan volume order tanpa kontrol margin yang ketat justru sangat berbahaya.",
            "Pastikan sistem logistik dan tim CS siap mendukung lonjakan transaksi toko online kamu."
        ),
        (
            "Tingkatkan konversi penjualan toko dengan membuat voucher belanja bertingkat yang menarik.",
            "Evaluasi efektivitas biaya iklan berbayar secara berkala agar ROAS toko selalu positif."
        )
    ],
    "Pilar 6 — Mindset & Motivasi Seller": [
        (
            "Kunci sukses jualan online adalah konsistensi membangun sistem, bukan sekadar mencari omzet.",
            "Jaga semangat berbisnis dan selalu kelola arus kas toko dengan bijaksana."
        ),
        (
            "Setiap kendala operasional adalah pelajaran berharga untuk memperkuat bisnis kamu.",
            "Tetap fokus pada visi jangka panjang dan jangan mudah tergiur tren instan."
        ),
        (
            "Disiplin keuangan adalah pembeda utama antara toko yang bertahan lama dengan yang gagal.",
            "Terus belajar dan beradaptasi dengan perubahan pasar agar bisnis kamu tetap relevan."
        )
    ],
    "Pilar 7 — Tips & Trik Platform Spesifik": [
        (
            "Optimalkan judul dan deskripsi produk agar mudah ditemukan calon pembeli di marketplace.",
            "Manfaatkan fitur live streaming untuk berinteraksi langsung dan meningkatkan kepercayaan buyer."
        ),
        (
            "Pelajari aturan komisi platform terbaru agar kamu bisa menyesuaikan strategi harga jual.",
            "Atur etalase toko secara estetik agar memikat pengunjung untuk segera checkout."
        ),
        (
            "Gunakan tagar populer dan konten edukasi untuk menarik traffic organik ke toko online.",
            "Respons setiap ulasan pembeli dengan cepat dan ramah untuk menjaga reputasi toko."
        )
    ],
    "Pilar 8 — Data & Analitik untuk Seller": [
        (
            "Mengambil langkah bisnis berdasarkan data nyata jauh lebih aman daripada sekadar insting.",
            "Amati metrik konversi dan rasio klik produk untuk mengetahui minat pasar sesungguhnya."
        ),
        (
            "Laporan analitik mingguan membantu mendeteksi penurunan performa toko sejak dini.",
            "Catat riwayat penjualan produk agar kamu bisa memprediksi kebutuhan stok bulan depan."
        ),
        (
            "Identifikasi produk mati yang mengendap lama di gudang agar tidak membekukan modal kerja.",
            "Gunakan data sebagai panduan utama menyusun promo dan penentuan harga diskon."
        )
    ],
    "Pilar 9 — Studi Kasus & Cerita Sukses": [
        (
            "Banyak UMKM lokal berhasil melipatgandakan profit setelah merapikan struktur HPP mereka.",
            "Belajar dari kesuksesan toko lain membantu menghindari kesalahan operasional yang fatal."
        ),
        (
            "Efisiensi kerja dan otomasi laporan terbukti membantu seller daerah berkembang pesat.",
            "Transisi dari pencatatan manual ke sistem digital menjadi titik balik kemajuan bisnis mereka."
        ),
        (
            "Fokus pada kepuasan pelanggan tetap mendatangkan repeat order yang melimpah.",
            "Dengan strategi promosi kreatif, toko kecil pun mampu bersaing dengan brand besar."
        )
    ],
    "Pilar 10 — Tren & Masa Depan E-Commerce": [
        (
            "Pemanfaatan asisten kecerdasan buatan akan mendominasi metode operasional toko masa kini.",
            "Persiapkan toko kamu menyambut era belanja berbasis rekomendasi konten visual interaktif."
        ),
        (
            "Sistem pembayaran instan and logistik super cepat semakin memanjakan calon pembeli.",
            "Adaptasi dini terhadap inovasi platform memberikan keunggulan kompetitif bagi brand kamu."
        ),
        (
            "Tren personalisasi konten membuat promosi tertarget menjadi kunci sukses konversi.",
            "Terus ikuti perkembangan teknologi e-commerce agar toko kamu selalu selangkah di depan."
        )
    ],
    "Pilar 11 — FAQ & Myth Busting": [
        (
            "Menjual produk dengan harga paling murah bukanlah satu-satunya jaminan toko akan ramai.",
            "Layanan berkualitas tinggi dan kepercayaan brand jauh lebih bernilai di mata pembeli."
        ),
        (
            "Otomasi toko online sebenarnya bisa dimulai secara gratis dan mudah tanpa keahlian khusus.",
            "Pahami kebenaran di balik pengelolaan margin produk agar kamu tidak keliru mengambil keputusan."
        ),
        (
            "Iklan mahal tidak akan efektif jika halaman produk belum teroptimasi dengan baik.",
            "Fokus perbaiki foto produk dan ulasan sebelum kamu mulai mendatangkan traffic berbayar."
        )
    ],
    "Pilar 12 — Konten Interaktif & Komunitas": [
        (
            "Bertukar pengalaman dengan sesama seller online membuka peluang kolaborasi bisnis baru.",
            "Mari bersama-sama membangun ekosistem UMKM yang solid, adaptif, dan saling mendukung."
        ),
        (
            "Bagikan tantangan jualan online kamu agar kita bisa mencari solusinya bersama-sama.",
            "Ikuti sesi diskusi rutin komunitas untuk mendapatkan update ilmu e-commerce terkini."
        ),
        (
            "Kritik dan saran dari rekan seller sangat berharga untuk menyempurnakan alur kerja toko.",
            "Mari aktif berpartisipasi dalam program edukasi bersama demi kemajuan usaha bersama."
        )
    ]
}

def generate_local_script(theme_idx, theme_text):
    """
    Menghasilkan naskah konten secara lokal berbasis aturan (rule-based).
    Menjamin 100% kepatuhan pedoman brand, bebas dari 'juragan', diawali sapaan 'Hai Seller',
    berjumlah tepat 4 kalimat, dan memiliki Call to Action standar.
    """
    tema_info = get_tema(theme_idx + 1)
    pilar_name = tema_info["pilar"]
    
    # Dapatkan template pilar yang sesuai
    templates = PILAR_TEMPLATES.get(pilar_name, PILAR_TEMPLATES["Pilar 1 — Pain Point & Awareness"])
    selected_template = templates[theme_idx % len(templates)]
    
    # 1. Konstruksi Kalimat Hook
    cleaned_theme = theme_text.strip()
    if cleaned_theme.endswith("?"):
        hook_sentence = f"Hai Seller, {cleaned_theme}"
    else:
        # Jika berupa kalimat pernyataan, buat menjadi pertanyaan interaktif
        lower_theme = cleaned_theme[0].lower() + cleaned_theme[1:]
        hook_sentence = f"Hai Seller, pernah gak kepikiran tentang {lower_theme}?"
        
    # 2. Kalimat Edukasi 1 & 2 dari template pilar
    edu_sentence_1 = selected_template[0]
    edu_sentence_2 = selected_template[1]
    
    # 3. Kalimat CTA
    cta_sentence = "Yuk Seller, langsung meluncur ke website Tokcer A-I untuk cobain gratis sekarang juga!"
    
    # Gabungkan menjadi tepat 4 kalimat dipisahkan titik
    tips_content = f"{hook_sentence} {edu_sentence_1} {edu_sentence_2} {cta_sentence}"
    
    # Judul tips (maksimal 4 kata dari tema)
    title_words = [w for w in cleaned_theme.split() if w.lower() not in ["dan", "yang", "di", "ke", "untuk"]]
    tips_title = " ".join(title_words[:4]).replace("?", "").replace("—", "").replace(":", "").strip()
    if not tips_title:
        tips_title = "Tips Tokcer Hari Ini"
        
    # Visual prompt generator berdasarkan pilar
    if "HPP" in pilar_name or "Data" in pilar_name:
        visual_prompt = "A cinematic close-up of a modern tablet displaying business financial charts and graphs, dark background, neon accents"
    elif "Showcase" in pilar_name or "Otomasi" in pilar_name:
        visual_prompt = "A clean professional workspace with a laptop showing a dashboard interface, modern minimal design, warm aesthetic"
    else:
        visual_prompt = "A realistic high-quality photo of a modern Indonesian entrepreneur in a clean home office, warm lighting, cinematic"

    return {
        "tips_title": tips_title,
        "tips_content": tips_content,
        "visual_prompt": visual_prompt
    }

# =============================================================================
# 4. GOOGLE GEMINI 1.5 FLASH API GENERATOR (100% FREE TIER / RP 0,-)
# =============================================================================
def call_gemini_to_expand_theme(theme_text):
    print(f"\n[Gemini 1.5 Flash] Mengekspansi tema: '{theme_text}' (Rp 0,-)...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    prompt = f"""
Kamu adalah Copywriter Senior spesialis e-commerce Indonesia.
Tugasmu adalah membuat naskah video edukasi singkat untuk UMKM / online seller Indonesia.
Bahasa harus santai, meyakinkan, edukatif, dan bebas dari kata 'juragan' (JANGAN pernah gunakan kata 'juragan').
Sapa audiens dengan panggilan 'Sobat Tokcer' atau 'Seller'.

Kembangkan tema konten berikut: "{theme_text}" menjadi konten edukasi UMKM Tokcer AI.

Aturan Penulisan Naskah (tips_content):
1. Harus terdiri dari PERSIS 4 kalimat pendek, masing-masing dipisahkan oleh tanda titik (.). Jangan gunakan pemisah kalimat lain seperti tanda seru (!) atau tanya (?) di akhir kalimat, gunakan titik saja agar pembacaan poster rapi.
2. Kalimat ke-1 WAJIB dimulai dengan kata: "Hai Seller, " lalu diikuti oleh hook penarik perhatian (misalnya: "Hai Seller, pernah gak ngerasa omzet toko rame tapi pas cek rekening kok tipis?").
3. Kalimat ke-2 dan ke-3 berisi tips edukasi konkret, solutif, dan ringkas mengenai tema tersebut.
4. Kalimat ke-4 WAJIB berupa Call to Action (CTA) persis seperti ini: "Yuk Seller, langsung meluncur ke website Tokcer A-I untuk cobain gratis sekarang juga!"
5. JANGAN PERNAH menggunakan kata "juragan" atau "Juragan online". Ganti semuanya dengan "Seller" atau "seller".

Format Keluaran:
Wajib kembalikan response berupa JSON objek murni dengan struktur:
{{
  "tips_title": "Judul tips pendek menarik (maksimal 5 kata)",
  "tips_content": "Tuliskan 4 kalimat naskah suara voiceover di sini sesuai aturan di atas.",
  "visual_prompt": "Prompt visual estetik dalam bahasa Inggris untuk background image generator Hugging Face/Pillow."
}}

Jangan berikan markdown block pembuka/penutup seperti ```json, langsung JSON objek mentah saja.
"""
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=25)
        if res.status_code == 200:
            result_json = res.json()
            result_text = result_json["candidates"][0]["content"]["parts"][0]["text"].strip()
            if result_text.startswith("```"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(result_text)
            
            # Double check compliance
            content = parsed.get("tips_content", "")
            if "juragan" in content.lower():
                content = content.replace("Juragan", "Seller").replace("juragan", "seller")
                parsed["tips_content"] = content
                
            if not content.startswith("Hai Seller"):
                sentences = content.split(".")
                sentences[0] = "Hai Seller, " + sentences[0].replace("Hai Seller,", "").replace("Hai Seller", "").strip()
                parsed["tips_content"] = ".".join(sentences)

            return parsed
        else:
            print(f"[Gemini Error] HTTP Status: {res.status_code}")
    except Exception as e:
        print(f"[Gemini Exception] Gagal memproses: {e}")
    return None

# =============================================================================
# 5. REPLENISHER WORKER RUNNER
# =============================================================================
def replenish_bank_templates():
    if not SUPABASE_ANON_KEY:
        print("[Error] SUPABASE_ANON_KEY tidak ditemukan. Mohon cek file .env Anda!")
        return

    unused_cnt = get_unused_content_count()
    print(f"[Replenisher] Stok bank konten saat ini: {unused_cnt} buah.")

    # Threshold pengisian: di bawah 5 tips
    if unused_cnt < 5:
        count_needed = 10 - unused_cnt
        
        if GEMINI_API_KEY:
            print(f"[Replenisher] Stok menipis! Menggunakan Google Gemini 1.5 Flash API (Rp 0,-) untuk membuat {count_needed} konten...")
        else:
            print(f"[Replenisher] Stok menipis! VITE_GEMINI_API_KEY tidak terdeteksi. Menggunakan Mesin Aturan Lokal (Offline Engine) secara otomatis (Rp 0,-)...")

        total_cnt = get_total_content_count()
        new_tips_list = []

        for i in range(count_needed):
            theme_idx = (total_cnt + i) % len(TEMA_365)
            theme_text = TEMA_365[theme_idx]
            print(f" -> [Hari ke-{total_cnt + i + 1}] Memproses Tema Indeks {theme_idx}: '{theme_text}'")
            
            if GEMINI_API_KEY:
                tips_data = call_gemini_to_expand_theme(theme_text)
                if tips_data:
                    new_tips_list.append(tips_data)
                    time.sleep(1)
                else:
                    # Fallback ke local engine jika pemanggilan API gagal
                    print("  -> API gagal merespons, menggunakan generator lokal sebagai cadangan...")
                    tips_data = generate_local_script(theme_idx, theme_text)
                    new_tips_list.append(tips_data)
            else:
                # Menggunakan Local Engine jika API Key tidak disematkan
                tips_data = generate_local_script(theme_idx, theme_text)
                new_tips_list.append(tips_data)

        if new_tips_list:
            print(f"\n[Replenisher] Mengirimkan {len(new_tips_list)} tips baru ke Supabase Staging...")
            url = f"{SUPABASE_URL}/rest/v1/viral_templates"
            try:
                res = requests.post(url, headers=HEADERS, json=new_tips_list, timeout=15)
                if res.status_code in [200, 201]:
                    print("🎉 SUKSES! Bank konten staging berhasil diperbarui.")
                else:
                    print(f"❌ GAGAL menyimpan data ke Supabase. Status: {res.status_code}, Res: {res.text}")
            except Exception as e:
                print(f"❌ Exception saat menyimpan data ke Supabase: {e}")
    else:
        print("[Replenisher] Stok konten masih mencukupi. Tidak perlu pemrosesan baru.")

def main():
    print("=" * 60)
    print("   TOKCER AI - AUTO-REPLENISHER SYSTEM STARTED")
    print("=" * 60)
    replenish_bank_templates()

if __name__ == "__main__":
    main()

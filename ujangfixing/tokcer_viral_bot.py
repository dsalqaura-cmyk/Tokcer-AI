#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
TOKCER AI - VIRAL AUTO-PILOT BOT (STANDALONE Python Microservice)
=============================================================================
Fungsi: Generator Video Viral Otomatis Staging & Auto-Posting TikTok
Lisensi: Tim Internal Tokcer AI (Fase 1 - Terisolasi Rp 0,-)
Author: Tarjo (Developer) & Gus (Lead Architect)
=============================================================================
"""

import os
import sys
import time
import random
import datetime
import requests

# Import modul rendering nyata dan uploader Playwright
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from video_generator import build_real_video
    from live_tiktok_uploader import upload_video_live
except ImportError:
    from ujangfixing.video_generator import build_real_video
    from ujangfixing.live_tiktok_uploader import upload_video_live

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

# Header otentikasi Supabase
HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json"
}

# Parameter inisiasi sistem (Dihitung mulai hari ini, 19 Mei 2026)
SYSTEM_START_DATE = datetime.datetime(2026, 5, 19, 0, 0, 0)
DYNAMIC_POSTING_PATTERN = [3, 2, 2, 1, 3] # Pola posting harian
TARGET_TIKTOK_ACCOUNT = "@tokcer_ai"
COOKIE_FILE_PATH = "ujangfixing/tiktok_cookies.json"

# =============================================================================
# 2. ALGORITMA ANTI-SPAM JITTER (MENJAUHI KELIPATAN 15 MENIT)
# =============================================================================
def get_organic_jitter_minute():
    """
    Menghasilkan menit acak natural (0-59) secara ketat menghindari kelipatan 15
    (:00, :15, :30, :45) untuk menyamarkan bot dari sensor radar media sosial.
    """
    forbidden_minutes = {0, 15, 30, 45}
    jitter_minute = random.randint(1, 59)
    while jitter_minute in forbidden_minutes:
        jitter_minute = random.randint(1, 59)
    return jitter_minute

def get_allowed_hours_for_today():
    """
    Menghitung jumlah postingan harian berdasarkan modulo panjang pola harian.
    Mengembalikan daftar jam posting Prime Time emas.
    """
    today = datetime.datetime.now()
    day_offset = (today - SYSTEM_START_DATE).days
    
    # Ambil nilai postingan hari ini dari pola [3, 2, 2, 1, 3]
    today_frequency = DYNAMIC_POSTING_PATTERN[max(0, day_offset) % len(DYNAMIC_POSTING_PATTERN)]
    
    if today_frequency == 3:
        return [12, 17, 19] # Siang, Sore, Malam
    elif today_frequency == 2:
        return [12, 19]     # Siang, Malam
    else:
        return [19]         # Malam saja
    
# =============================================================================
# 3. MESIN RENDERING VIDEO MANDIRI (moviepy + Edge TTS Wrapper)
# =============================================================================
def render_viral_video(tips_id, title, content):
    """
    Membuat video nyata dari tips:
    1. Pidato alami dari teks (Edge-TTS)
    2. Gambar poster vertical estetik dark mode (Pillow)
    3. Digabungkan menjadi .mp4 final (MoviePy)
    """
    os.makedirs("ujangfixing", exist_ok=True)
    video_filename = f"ujangfixing/video_render_{tips_id}.mp4"
    print(f"\n[moviepy] Memulai perakitan video viral untuk Tips ID: {tips_id} ({title})")
    
    success = build_real_video(title, content, video_filename)
    if success:
        print(f"[moviepy] SUKSES NYATA! Video viral ber-subtitle terbuat: {video_filename}")
        return video_filename
    else:
        print(f"[moviepy] ERROR: Rendering gagal, menggunakan berkas sampel fallback.")
        return "ujangfixing/sample.mp4"

# =============================================================================
# 4. MODUL UPLOADER TIKTOK AMAN (SECURE COOKIE-BASED UPLOAD)
# =============================================================================
def secure_tiktok_upload(video_path, caption):
    """
    Melakukan posting video .mp4 ke akun TikTok resmi Tokcer menggunakan session cookies
    lokal terisolasi.
    """
    print(f"\n[TikTok Uploader] Menghubungi API upload TikTok untuk akun: {TARGET_TIKTOK_ACCOUNT}...")
    
    # Cek file session cookie
    if not os.path.exists(COOKIE_FILE_PATH):
        print(f"[KEAMANAN] ERROR: File '{COOKIE_FILE_PATH}' tidak ditemukan! Proses dihentikan demi keamanan.")
        return False
        
    # SYSTEMATIC CAPTION OUTRO - Standardized Conversion CTA
    caption_outro = "\n\n👉 Cobain GRATIS sekarang di: www.tokcer-ai.com (Klik link di bio profil kita!)"
    full_caption = caption + caption_outro
        
    print(f"[TikTok Uploader] Cookie terverifikasi aman. Mengunggah berkas nyata: {video_path}...")
    
    # Panggil uploader Playwright nyata
    success = upload_video_live(video_path, full_caption, headless=False)
    
    if success:
        print(f"[TikTok Uploader] BERHASIL! Video sukses tayang di akun {TARGET_TIKTOK_ACCOUNT}!")
        return True
    else:
        print(f"[TikTok Uploader] GAGAL mengunggah video.")
        return False

# =============================================================================
# 5. CORE WORKER & RUNNER (STAGING POLLING ENGINE)
# =============================================================================
def main():
    print("=" * 60)
    print("      TOKCER AI - VIRAL AUTO-PILOT SERVICE STARTED (STAGING)")
    print("=" * 60)
    
    test_mode = "--test" in sys.argv
    if test_mode:
        print("[Mode] Berjalan dalam MODE TEST (Mengabaikan jam dan jeda jitter)")

    now = datetime.datetime.now()
    current_hour = now.hour
    
    print(f"Waktu lokal: {now.strftime('%d-%m-%Y %H:%M:%S')}")
    print(f"Konfigurasi Sasaran: Akun {TARGET_TIKTOK_ACCOUNT} (Eksklusif TikTok Only)")
    
    # 1. Cek jam ramai hari ini (kecuali mode test)
    allowed_hours = get_allowed_hours_for_today()
    print(f"Jadwal Jam Ramai Hari Ini: {allowed_hours} WIB")
    
    if not test_mode and current_hour not in allowed_hours:
        print(f"Jam saat ini ({current_hour}:00) bukan termasuk jam ramai hari ini. Bot masuk mode tidur.")
        sys.exit(0)
        
    print(f"Mengambil antrean dari database Supabase Staging...")

    # 2. Cari antrean pending yang tersisa di upload_queue
    url_queue = f"{SUPABASE_URL}/rest/v1/upload_queue?status=eq.pending&order=created_at.asc&limit=1"
    job = None
    try:
        res = requests.get(url_queue, headers=HEADERS, timeout=10)
        if res.status_code == 200 and res.json():
            job = res.json()[0]
            print(f"[Queue] Menemukan antrean pending yang ada: ID {job['id']}")
    except Exception as e:
        print(f"[Warning] Gagal query upload_queue: {e}")

    # 3. Jika tidak ada antrean pending, buat antrean baru dari viral_templates
    if not job:
        print("[Queue] Tidak ada antrean pending. Mengambil tips terbaru yang belum terpakai dari bank tips...")
        url_templates = f"{SUPABASE_URL}/rest/v1/viral_templates?used=eq.false&order=created_at.asc&limit=1"
        template = None
        try:
            res = requests.get(url_templates, headers=HEADERS, timeout=10)
            if res.status_code == 200 and res.json():
                template = res.json()[0]
            else:
                print("[Queue] Bank tips kosong! Silakan jalankan tokcer_content_generator.py terlebih dahulu.")
                sys.exit(0)
        except Exception as e:
            print(f"[Error] Gagal mengambil template: {e}")
            sys.exit(1)

        # Mark template as used
        url_mark = f"{SUPABASE_URL}/rest/v1/viral_templates?id=eq.{template['id']}"
        try:
            requests.patch(url_mark, headers=HEADERS, json={"used": True}, timeout=10)
            print(f"[Queue] Menandai tips '{template['tips_title']}' sebagai terpakai (used = true)")
        except Exception as e:
            print(f"[Warning] Gagal menandai template terpakai: {e}")

        # Insert new pending job in upload_queue
        video_filename = f"ujangfixing/video_render_{template['id']}.mp4"
        caption = f"{template['tips_title']} - Tips jualan online UMKM! #UMKM #TokcerAI #Fyp #Seller"
        new_job_payload = {
            "video_path": video_filename,
            "caption": caption,
            "account_platform": "tiktok",
            "account_username": TARGET_TIKTOK_ACCOUNT,
            "status": "pending",
            "scheduled_date": datetime.date.today().isoformat(),
            "preferred_hour": current_hour
        }
        url_insert_queue = f"{SUPABASE_URL}/rest/v1/upload_queue"
        try:
            res = requests.post(url_insert_queue, headers=HEADERS, json=new_job_payload, timeout=10)
            # Re-fetch untuk mendapatkan id
            res_fetch = requests.get(url_queue, headers=HEADERS, timeout=10)
            if res_fetch.status_code == 200 and res_fetch.json():
                job = res_fetch.json()[0]
                job["tips_title"] = template["tips_title"]
                job["tips_content"] = template["tips_content"]
                print(f"[Queue] Berhasil membuat antrean posting baru dengan ID: {job['id']}")
            else:
                print("[Error] Gagal membuat dan mengambil antrean baru.")
                sys.exit(1)
        except Exception as e:
            print(f"[Error] Gagal inisiasi antrean baru: {e}")
            sys.exit(1)
    else:
        # Jika job didapat dari database, coba cari content tips aslinya (berdasarkan nama file video atau manual parse)
        # Untuk keandalan, jika tips_content tidak ada, kita parse dari caption
        job["tips_title"] = job.get("caption", "").split("-")[0].strip()
        # Fallback content jika tidak ada link langsung
        job["tips_content"] = "Temukan tips jualan online selengkapnya hanya di Tokcer AI!"

    # 4. Ubah status antrean menjadi 'processing'
    url_status = f"{SUPABASE_URL}/rest/v1/upload_queue?id=eq.{job['id']}"
    try:
        requests.patch(url_status, headers=HEADERS, json={"status": "processing"}, timeout=10)
        print(f"[Queue] Status antrean {job['id']} diubah menjadi 'processing'")
    except Exception as e:
        print(f"[Warning] Gagal update status ke processing: {e}")

    # 5. Render video nyata
    video_mp4 = render_viral_video(
        job['id'], 
        job['tips_title'], 
        job['tips_content']
    )
    
    # 6. Terapkan Menit Acak "Anti-Spam" Jitter (Kecuali mode test)
    if not test_mode:
        organic_minute = get_organic_jitter_minute()
        organic_second = random.randint(0, 59)
        total_delay_sec = (organic_minute * 60) + organic_second
        
        print(f"\n[Scheduler] Menerapkan jeda acak: {organic_minute} menit {organic_second} detik.")
        print(f"[Scheduler] Posting dijadwalkan tepat pukul {current_hour}:{organic_minute:02d}:{organic_second:02d} WIB.")
        time.sleep(total_delay_sec)
    else:
        print("\n[Scheduler] Mode test: Melewati jeda acak jitter.")

    # 7. Jalankan Upload Aman berbasis cookies
    upload_success = secure_tiktok_upload(video_mp4, job['caption'])
    
    if upload_success:
        print("\n[Worker] Transaksi Staging Sukses! Menandai antrean sebagai 'posted'.")
        try:
            requests.patch(url_status, headers=HEADERS, json={"status": "posted", "actual_post_time": datetime.datetime.now().isoformat()}, timeout=10)
        except Exception as e:
            print(f"[Warning] Gagal update status ke posted: {e}")
    else:
        print("\n[Worker] Gagal mengupload berkas. Menandai antrean sebagai 'failed'.")
        try:
            requests.patch(url_status, headers=HEADERS, json={"status": "failed"}, timeout=10)
        except Exception as e:
            print(f"[Warning] Gagal update status ke failed: {e}")

if __name__ == "__main__":
    main()

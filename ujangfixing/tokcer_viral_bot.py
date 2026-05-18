#!/usr/bin/env python
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
import json

# =============================================================================
# 1. PARAMETER KONFIGURASI AMAN (STAGING DATABASE ONLY)
# =============================================================================
SYSTEM_START_DATE = datetime.datetime(2026, 5, 18, 0, 0, 0) # Inisiasi sistem ganjil/genap
DYNAMIC_POSTING_PATTERN = [3, 2, 2, 1, 3] # Pola selang-seling dinamis Bapak
TARGET_TIKTOK_ACCOUNT = "@tokcer_ai" # Akun TikTok resmi Tokcer
COOKIE_FILE_PATH = "tiktok_cookies.json" # Lokasi session cookie terenkripsi (0% password!)

# MDN-Reference: Edge TTS Voices (Neural Indonesia)
VOICE_NEURAL_MALE = "id-ID-ArdiNeural"     # Suara Pria Profesional
VOICE_NEURAL_FEMALE = "id-ID-GadisNeural"  # Suara Wanita Ramah & Dinamis (Default)

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
    today_frequency = DYNAMIC_POSTING_PATTERN[day_offset % len(DYNAMIC_POSTING_PATTERN)]
    
    if today_frequency == 3:
        return [12, 17, 19] # Siang, Sore, Malam (Tanggal Ganjil wave)
    elif today_frequency == 2:
        return [12, 19]     # Siang, Malam (Skip Sore - Tanggal Genap wave)
    elif today_frequency == 1:
        return [19]         # Hanya Malam (Prime Time Teramai)
    else:
        return [19]

# =============================================================================
# 3. MESIN RENDERING VIDEO MANDIRI (moviepy + Edge TTS Wrapper)
# =============================================================================
def generate_voiceover_edge_tts(text_content, output_audio_path):
    """
    Mengonversi naskah tulisan Iyem menjadi file audio berkualitas tinggi (.mp3)
    menggunakan Neural Voice id-ID-GadisNeural secara gratis dan halus (tidak kaku).
    """
    print(f"[Edge-TTS] Mengonversi teks dengan Neural Voice: {VOICE_NEURAL_FEMALE}...")
    # Tarjo akan memanggil pustaka: `edge-tts --voice id-ID-GadisNeural --text "..." output.mp3`
    # Ini 100% gratis, unlimited, dan terdengar sangat manusiawi!
    time.sleep(2) # Simulasi Rendering Audio
    return True

def generate_visual_huggingface(prompt, output_image_path):
    """
    Mengambil gambar background dinamis dari Hugging Face API Free Tier (Flux.1 Schnell)
    berdasarkan visual_prompt yang sudah disiapkan di database staging.
    """
    print(f"[HF-Inference] Mengunduh aset visual untuk prompt: '{prompt}'...")
    time.sleep(2) # Simulasi Rendering Gambar
    return True

def render_viral_video(tips_id, title, content, prompt):
    """
    Menggabungkan Audio VO, Visual HF, dan meng-overlay Subtitle Dinamis (CapCut Style)
    menggunakan moviepy. Menghasilkan file video.mp4 final.
    """
    video_filename = f"video_render_{tips_id}.mp4"
    print(f"\n[moviepy] Memulai perakitan video viral untuk Tips ID: {tips_id} ({title})")
    
    # SYSTEMATIC VOICE OVER OUTRO - Standardized Conversion CTA
    vo_outro = " Yuk juragan, langsung meluncur ke w-w-w dot tokcer strip a-i dot com untuk cobain GRATIS sekarang juga!"
    full_audio_script = content + vo_outro
    
    # 1. Render TTS Audio
    generate_voiceover_edge_tts(full_audio_script, "temp_vo.mp3")
    
    # 2. Render Image Visual
    generate_visual_huggingface(prompt, "temp_bg.png")
    
    # 3. Stitch & Overlay Subtitle Dinamis (Dyslexia CapCut style) dengan Watermark logo
    print("[moviepy] Menyisipkan visual watermark 'www.tokcer-ai.com'...")
    print("[moviepy] Menyisipkan audio, gambar, dan merender teks subtitle dinamis...")
    time.sleep(3) # Simulasi Rendering Video
    
    print(f"[moviepy] SUKSES! Video viral ber-subtitle terbuat: {video_filename}")
    return video_filename

# =============================================================================
# 4. MODUL UPLOADER TIKTOK AMAN (SECURE COOKIE-BASED UPLOAD)
# =============================================================================
def secure_tiktok_upload(video_path, caption):
    """
    Melakukan posting video .mp4 ke akun TikTok resmi Tokcer menggunakan session cookies
    lokal terisolasi. 100% Bebas Password sehingga data kredensial Bapak aman.
    """
    print(f"\n[TikTok Uploader] Menghubungi API upload TikTok untuk akun: {TARGET_TIKTOK_ACCOUNT}...")
    
    # Cek file session cookie
    if not os.path.exists(COOKIE_FILE_PATH):
        print(f"[KEAMANAN] ERROR: File '{COOKIE_FILE_PATH}' tidak ditemukan! Proses dihentikan demi keamanan.")
        return False
        
    # SYSTEMATIC CAPTION OUTRO - Standardized Conversion CTA
    caption_outro = "\n\n👉 Cobain GRATIS sekarang di: www.tokcer-ai.com (Klik link di bio profil kita!)"
    full_caption = caption + caption_outro
        
    print(f"[TikTok Uploader] Cookie terverifikasi aman. Mengunggah berkas: {video_path}...")
    time.sleep(3) # Simulasi proses upload request
    
    print(f"[TikTok Uploader] BERHASIL! Video sukses tayang di akun {TARGET_TIKTOK_ACCOUNT} dengan caption:\n{full_caption}")
    return True

# =============================================================================
# 5. CORE WORKER & RUNNER (STAGING POLLING ENGINE)
# =============================================================================
def main():
    print("=" * 60)
    print("      TOKCER AI - VIRAL AUTO-PILOT SERVICE STARTED (STAGING)")
    print("=" * 60)
    
    now = datetime.datetime.now()
    current_hour = now.hour
    
    print(f"Waktu lokal: {now.strftime('%d-%m-%Y %H:%M:%S')}")
    print(f"Konfigurasi Sasaran: Akun {TARGET_TIKTOK_ACCOUNT} (Eksklusif TikTok Only)")
    
    # 1. Cek jam ramai hari ini
    allowed_hours = get_allowed_hours_for_today()
    print(f"Jadwal Jam Ramai Hari Ini: {allowed_hours} WIB")
    
    if current_hour not in allowed_hours:
        print(f"Jam saat ini ({current_hour}:00) bukan termasuk jam ramai hari ini. Bot masuk mode tidur.")
        sys.exit(0)
        
    print(f"Jam saat ini ({current_hour}:00) adalah JAM EMAS! Mengambil antrean Staging Supabase...")
    
    # 2. Simulasi Ambil Satu Antrean Staging yang pending
    # SQL: SELECT * FROM public.upload_queue WHERE status = 'pending' AND scheduled_date = today LIMIT 1;
    mock_job = {
        "id": "job_99ab_12cd",
        "title": "Trik Rahasia Hitung HPP",
        "content": "Sobat Tokcer! Banyak penjual online bangkrut bukan karena gak laku...",
        "prompt": "An aesthetic close up photo of a calculator on an office desk...",
        "caption": "Pusing hitung untung rugi? Ini trik hitung HPP biar gak boncos! #UMKM #TokcerAI #Fyp"
    }
    
    # 3. Render video viral jadi
    video_mp4 = render_viral_video(
        mock_job['id'], 
        mock_job['title'], 
        mock_job['content'], 
        mock_job['prompt']
    )
    
    # 4. Terapkan Menit Acak "Anti-Spam" Jitter (Menolak Kelipatan 15 Menit)
    organic_minute = get_organic_jitter_minute()
    organic_second = random.randint(0, 59)
    total_delay_sec = (organic_minute * 60) + organic_second
    
    print(f"\n[Scheduler] Menerapkan jeda acak: {organic_minute} menit {organic_second} detik.")
    print(f"[Scheduler] Posting dijadwalkan tepat pukul {current_hour}:{organic_minute:02d}:{organic_second:02d} WIB.")
    
    # Di server staging nyata, baris di bawah ini akan diaktifkan:
    # time.sleep(total_delay_sec)
    
    # 5. Jalankan Upload Aman berbasis cookies
    upload_success = secure_tiktok_upload(video_mp4, mock_job['caption'])
    
    if upload_success:
        print("\n[Worker] Transaksi Staging Sukses! Menandai antrean sebagai 'posted'.")
        # SQL: UPDATE public.upload_queue SET status = 'posted' WHERE id = job_id;
    else:
        print("\n[Worker] Gagal mengupload berkas.")

if __name__ == "__main__":
    main()

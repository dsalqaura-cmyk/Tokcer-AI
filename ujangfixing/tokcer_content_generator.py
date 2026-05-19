#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
TOKCER AI - INFINITE CONTENT GENERATOR (Standalone AI Studio Replenisher)
=============================================================================
Fungsi: Mengisi kembali bank template konten secara otomatis menggunakan DeepSeek API
Target: Supabase Staging Database (Tabel viral_templates)
Biaya Operasional: Rp 0,- (Free/Included Staging Token Credits)
Author: Tarjo (Developer) & Udin (Analyst)
=============================================================================
"""

import os
import sys
import time
import json
import random
import datetime
import requests

# Import tema resmi Tokcer AI
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from tokcer_themes import TEMA_365, get_tema
except ImportError:
    # Fallback if imported from parent folder
    from ujangfixing.tokcer_themes import TEMA_365, get_tema

# =============================================================================
# 1. LOAD CONFIGURATIONS FROM ENV
# =============================================================================
def load_env():
    env_vars = {}
    # Coba baca .env (root) atau .env.staging
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
DEEPSEEK_API_KEY = ENV.get("VITE_DEEPSEEK_API_KEY", "")

# Header otentikasi Supabase
HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json"
}

# =============================================================================
# 2. SUPABASE HELPER FUNCTIONS
# =============================================================================
def get_unused_content_count():
    """
    Mengambil jumlah tips yang belum digunakan (used = false) dari database staging.
    """
    url = f"{SUPABASE_URL}/rest/v1/viral_templates?used=eq.false&select=id"
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        if res.status_code == 200:
            return len(res.json())
        else:
            print(f"[Warning] Gagal mengambil unused count. Status: {res.status_code}, Res: {res.text}")
    except Exception as e:
        print(f"[Warning] Exception get_unused_content_count: {e}")
    return 0

def get_total_content_count():
    """
    Mengambil jumlah keseluruhan tips di database untuk menghitung offset rotasi tema.
    """
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

## =============================================================================
# 3. AI EXPANSION LOGIC (PRIMARY: GEMINI 1.5 FLASH / FALLBACK: DEEPSEEK)
# =============================================================================
def call_gemini_to_expand_theme(theme_text, api_key):
    """
    Memanggil Google AI Studio Gemini 1.5 Flash API (0-Cost Free Tier)
    untuk mengekspansi tema menjadi naskah 4 kalimat terstruktur.
    """
    print(f"[Gemini 1.5 Flash] Mengekspansi tema: '{theme_text}' (0-Cost)...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
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
            # Pembersihan jika model tetap memberikan markdown blocks
            if result_text.startswith("```"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            return json.loads(result_text)
        else:
            print(f"[Gemini Error] HTTP Status: {res.status_code}, Res: {res.text}")
    except Exception as e:
        print(f"[Gemini Exception] Gagal memproses: {e}")
    return None

def call_deepseek_to_expand_theme(theme_text, api_key):
    """
    Memanggil DeepSeek API sebagai fallback jika API Key Gemini tidak diset.
    """
    print(f"[DeepSeek] Mengekspansi tema: '{theme_text}' (Fallback)...")
    system_prompt = (
        "Kamu adalah Copywriter Senior spesialis e-commerce Indonesia. "
        "Tugasmu adalah membuat naskah video edukasi singkat untuk UMKM / online seller Indonesia. "
        "Bahasa harus santai, meyakinkan, edukatif, dan bebas dari kata 'juragan' (JANGAN pernah gunakan kata 'juragan'). "
        "Sapa audiens dengan panggilan 'Sobat Tokcer' atau 'Seller'."
    )

    user_message = f"""
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

    url = "https://api.deepseek.com/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "max_tokens": 1024,
        "temperature": 0.3
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=20)
        if res.status_code == 200:
            result_text = res.json()["choices"][0]["message"]["content"].strip()
            if result_text.startswith("```"):
                result_text = result_text.replace("```json", "").replace("```", "").strip()
            return json.loads(result_text)
        else:
            print(f"[DeepSeek Error] HTTP Status: {res.status_code}, Res: {res.text}")
    except Exception as e:
        print(f"[DeepSeek Exception] Gagal memproses: {e}")
    return None

def call_ai_to_expand_theme(theme_text):
    """
    Fungsi gerbang utama penentu pemanggilan AI. Mencari key Gemini (VITE_GEMINI_API_KEY)
    terlebih dahulu, lalu fallback ke DeepSeek jika Gemini tidak diset.
    """
    gemini_key = ENV.get("VITE_GEMINI_API_KEY") or ENV.get("GEMINI_API_KEY")
    deepseek_key = ENV.get("VITE_DEEPSEEK_API_KEY") or ENV.get("DEEPSEEK_API_KEY")
    
    parsed = None
    if gemini_key:
        parsed = call_gemini_to_expand_theme(theme_text, gemini_key)
    elif deepseek_key:
        print(f"[AI Generator] Menggunakan DeepSeek Staging Key bawaan...")
        parsed = call_deepseek_to_expand_theme(theme_text, deepseek_key)
    else:
        print("[Error] Tidak ada API Key yang ditemukan di environment!")
        return None

    if parsed:
        # Double check compliance
        content = parsed.get("tips_content", "")
        if "juragan" in content.lower():
            print("[Sanitization] Terdeteksi kata terlarang 'juragan'! Mengganti otomatis...")
            content = content.replace("Juragan", "Seller").replace("juragan", "seller")
            parsed["tips_content"] = content
            
        # Pastikan sapaan "Hai Seller" ada
        if not content.startswith("Hai Seller"):
            print("[Sanitization] Sapaan pembuka tidak dimulai dengan 'Hai Seller'! Memperbaiki...")
            sentences = content.split(".")
            sentences[0] = "Hai Seller, " + sentences[0].replace("Hai Seller,", "").replace("Hai Seller", "").strip()
            parsed["tips_content"] = ".".join(sentences)

        return parsed
    return None

# =============================================================================
# 4. REPLENISHER WORKER RUNNER
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
        print(f"[Replenisher] Stok menipis! Mempersiapkan pembuatan {count_needed} konten bisnis baru...")

        total_cnt = get_total_content_count()
        new_tips_list = []

        for i in range(count_needed):
            theme_idx = (total_cnt + i) % len(TEMA_365)
            theme_text = TEMA_365[theme_idx]
            print(f" -> [Hari ke-{total_cnt + i + 1}] Memproses Tema Indeks {theme_idx}: '{theme_text}'")
            
            tips_data = call_ai_to_expand_theme(theme_text)
            if tips_data:
                new_tips_list.append(tips_data)
                time.sleep(1)

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
        print("[Replenisher] Stok konten masih mencukupi. Tidak perlu pemanggilan AI.")

def main():
    print("=" * 60)
    print("      TOKCER AI - AUTO-REPLENISHER SYSTEM STARTED")
    print("=" * 60)
    replenish_bank_templates()

if __name__ == "__main__":
    main()

#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
=============================================================================
TOKCER AI - INFINITE CONTENT GENERATOR (Standalone AI Studio Replenisher)
=============================================================================
Fungsi: Mengisi kembali bank template konten secara otomatis menggunakan Gemini 1.5 Flash
Biaya Operasional: Rp 0,- (100% Free API Tier)
Author: Tarjo (Developer) & Udin (Analyst)
=============================================================================
"""

import os
import sys
import time
import json
import random
import datetime

# Mock Supabase & Google AI Studio Connection
GEMINI_FREE_API_KEY = "AIzaSyFakeKey_GeminiFreeTier_Rp0"

def get_unused_content_count():
    """
    Simulasi SQL: SELECT COUNT(*) FROM public.viral_templates WHERE used = FALSE;
    """
    # Mengembalikan sisa konten tiruan untuk simulasi
    return 3 

def call_gemini_flash_for_umkm_tips(count_needed=10):
    """
    Memanggil Google AI Studio Gemini 1.5 Flash API secara gratis untuk 
    memproduksi tips UMKM baru dengan kualitas tinggi dan prompt gambar estetik.
    """
    print(f"\n[Gemini 1.5 Flash] Sisa konten menipis! Meminta {count_needed} konten bisnis UMKM baru...")
    
    # Prompt Rekayasa Konten (Prompt Engineering) agar Gemini mengembalikan JSON murni
    prompt = f"""
    Tuliskan {count_needed} tips bisnis online, manajemen keuangan, marketing, dan operasional UMKM untuk penjual Indonesia.
    Setiap tips harus ditulis dengan gaya santai tapi sangat edukatif (panggil audiens dengan 'Sobat Tokcer' atau 'Juragan online').
    Berikan respons dalam format JSON Array murni dengan struktur:
    [
      {{
        "tips_title": "Judul tips pendek menarik",
        "tips_content": "Isi tips suara voiceover 2-3 kalimat yang mengalir lancar.",
        "visual_prompt": "Prompt visual estetik bahasa inggris untuk background image Hugging Face."
      }}
    ]
    Jangan berikan pembuka atau penutup markdown, langsung JSON array murni.
    """
    
    # Simulasi respons super cerdas dari Gemini 1.5 Flash (0% Halusinasi)
    time.sleep(3) # Simulasi Latensi API
    mock_gemini_json_response = [
        {
            "tips_title": "Trik Kemasan Cantik",
            "tips_content": "Juragan online, jangan pernah sepelekan kemasan paket kiriman kamu! Paket yang dibungkus dengan pita rapi dan wangi akan memberikan efek kejutan yang menyenangkan bagi pembeli. Pembeli yang bahagia akan rela berbaik hati memposting unboxing paket tokomu gratis di media sosial!",
            "visual_prompt": "A warm cinematic shot of a beautifully wrapped cardboard box package with a soft rustic orange ribbon on top, soft focus office desk background"
        },
        {
            "tips_title": "Rahasia Follow-up Keranjang",
            "tips_content": "Sobat Tokcer! Banyak pembeli memasukkan barang ke keranjang tapi lupa membayar. Lakukan trik ini: kirimkan chat ramah tiga puluh menit kemudian dengan memberikan voucher diskon khusus yang berlaku hanya untuk satu jam ke depan. Ini menstimulus pembeli untuk segera check-out pesanan!",
            "visual_prompt": "An aesthetic flatlay of a modern phone showing checkout screen, warm lights, dynamic flatlay photography"
        }
    ]
    
    print(f"[Gemini 1.5 Flash] Sukses memproduksi {len(mock_gemini_json_response)} tips UMKM bermutu tinggi!")
    return mock_gemini_json_response

def replenish_bank_templates():
    sisa_konten = get_unused_content_count()
    print(f"[Replenisher] Memeriksa stok bank konten... Sisa saat ini: {sisa_konten} buah.")
    
    # Threshold stok menipis (di bawah 5)
    if sisa_konten < 5:
        konten_baru = call_gemini_flash_for_umkm_tips(10)
        
        print("\n[Replenisher] Memasukkan konten baru ke Supabase Staging Database:")
        for idx, item in enumerate(konten_baru):
            print(f" -> Menyimpan [{item['tips_title']}] ke public.viral_templates...")
            # SQL: INSERT INTO public.viral_templates (tips_title, tips_content, visual_prompt) VALUES (...)
        
        print("\n[Replenisher] Sukses! Bank konten staging terisi penuh kembali.")
    else:
        print("[Replenisher] Stok konten masih melimpah. Tidak perlu memanggil API.")

def main():
    print("=" * 60)
    print("  TOKCER AI - INFINITE CONTENT REPLENISHER WORKER (STAGING)")
    print("=" * 60)
    replenish_bank_templates()

if __name__ == "__main__":
    main()

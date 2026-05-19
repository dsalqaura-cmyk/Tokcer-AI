#!/usr/bin/env python3
import os
import subprocess
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import VideoClip, ImageClip, AudioFileClip, CompositeAudioClip


PREMIUM_TRICKS = {
    "Trik Rahasia Hitung HPP": [
        "Catat modal beli dasar SKU.",
        "Hitung lakban, bubble wrap, & dus.",
        "Masukkan komisi & admin platform.",
        "Hitung detail pakai Tokcer AI."
    ],
    "Jangan Kasih Diskon Flat": [
        "Ganti diskon flat 50% toko.",
        "Gunakan sistem diskon bertingkat.",
        "Beli 2, diskon 30% item kedua.",
        "Nilai transaksi naik 2x lipat."
    ],
    "Toko Boncos Karena COD Gagal?": [
        "Kirim WA konfirmasi alamat.",
        "Lakukan 30 menit sebelum kirim.",
        "Pembeli nakal akan membatalkan.",
        "Hemat ongkos retur sia-sia."
    ],
    "Trik Rating Bintang Lima": [
        "Selipkan Thank You Card di paket.",
        "Berikan sentuhan emosional.",
        "Minta doa agar toko laris manis.",
        "Rating bintang 5 meningkat pesat."
    ],
    "Naikkan Omzet dengan Bundling": [
        "Buat paket bundling solusi lengkap.",
        "Contoh: pembersih + sikat + handuk.",
        "Lebih dihargai dibanding eceran.",
        "Margin profit naik hingga 30%."
    ],
    "Jam Emas Posting Konten": [
        "Hindari posting jam acak sepi.",
        "Posting jam 12.00 siang (istirahat).",
        "Posting jam 19.00 malam (santai).",
        "Jangkau audiens tertarget Indonesia."
    ],
    "Trik Nangkring di Halaman Satu": [
        "Gunakan strategi SEO marketplace.",
        "Tulis judul produk spesifik detail.",
        "Contoh: Kemeja Katun Anti Kusut.",
        "Kolom pencarian banjir pembeli."
    ],
    "Misteri Angka Sembilan Puluh Sembilan": [
        "Terapkan harga psikologi 99rb.",
        "Otak manusia membaca digit kiri.",
        "Ilusi harga jauh lebih murah.",
        "Konversi pembelian melonjak naik."
    ],
    "Bahaya Stok Nol di Shopee": [
        "Jangan biarkan stok kosong > 24 jam.",
        "Peringkat pencarian diturunkan.",
        "Set stok minimal 5 unit.",
        "Aktifkan sistem pre-order (PO)."
    ],
    "Cara Bersihkan Stok Mati": [
        "Stop diskon rugi merusak pasar.",
        "Jadikan bonus/hadiah gratis.",
        "Set minimal belanja tertentu.",
        "Gudang bersih, pembeli senang."
    ]
}

def draw_premium_backdrop(title, content, output_image_path):
    """
    Menggambar background visual bertema dark mode premium (9:16 vertical format)
    dengan kartu transparan glowing, logo resmi Tokcer AI, dan tipografi modern ala CapCut/Canva.
    """
    print(f"[Pillow] Menggambar visual premium untuk: '{title}'...")
    
    # 1. Buat kanvas portrait 1080x1920 (Ukuran standar TikTok)
    w, h = 1080, 1920
    img = Image.new("RGBA", (w, h), (15, 8, 29, 255)) # Deep dark purple base
    draw = ImageDraw.Draw(img)
    
    # 2. Gambar gradasi estetik
    for y in range(h):
        # Gradasi dari ungu tua (#0F081D) ke biru tua slate (#060B19)
        r = int(15 - (y / h) * 9)
        g = int(8 + (y / h) * 3)
        b = int(29 - (y / h) * 14)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # 3. Gambar kartu transparan di tengah (Glassmorphism card)
    card_margin = 80
    card_x1, card_y1 = card_margin, 380
    card_x2, card_y2 = w - card_margin, h - 380
    
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)
    draw_overlay.rounded_rectangle(
        [card_x1, card_y1, card_x2, card_y2],
        radius=40,
        fill=(255, 255, 255, 15), # Frosted white translucent
        outline=(255, 255, 255, 45), # Thin glass border
        width=2
    )
    # Border bersinar kuning emas di sisi atas kartu
    draw_overlay.line([(card_x1 + 40, card_y1), (card_x2 - 40, card_y1)], fill=(255, 153, 0, 120), width=4)
    
    # Blending overlay ke kanvas dasar
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    # 4. Memuat Font macOS Arial yang dijamin kompatibel penuh
    font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
    if not os.path.exists(font_path):
        font_path = "/System/Library/Fonts/Supplemental/Verdana.ttf"
        
    try:
        font_logo = ImageFont.truetype(font_path, 42)
        font_header = ImageFont.truetype(font_path, 34)
        font_title = ImageFont.truetype(font_path, 54)
        font_body = ImageFont.truetype(font_path, 38)
        font_footer = ImageFont.truetype(font_path, 36)
    except Exception as e:
        print(f"[WARN] Gagal memuat font Arial: {e}. Menggunakan default...")
        font_logo = font_header = font_title = font_body = font_footer = ImageFont.load_default()
        
    # 5. Pasang Logo Brand Resmi dari public/logo.png (Revision 2)
    logo_path = "public/logo.png"
    if os.path.exists(logo_path):
        try:
            logo_img = Image.open(logo_path).convert("RGBA")
            target_w = 320
            target_h = int(logo_img.height * (target_w / logo_img.width))
            logo_img = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            # Paste logo centered at y=140
            img.paste(logo_img, ((w - target_w) // 2, 140), logo_img)
        except Exception as logo_err:
            print(f"[WARN] Gagal memuat logo image: {logo_err}. Gunakan teks fallback.")
            draw.text((w // 2, 200), "TOKCER AI", fill=(255, 153, 0, 255), font=font_logo, anchor="mm")
    else:
        draw.text((w // 2, 200), "TOKCER AI", fill=(255, 153, 0, 255), font=font_logo, anchor="mm")
    
    # 6. Tulis Judul Tips di dalam Kartu
    draw.text((w // 2, 480), "TIPS HARI INI", fill=(255, 153, 0, 255), font=font_header, anchor="mm")
    
    # Render Judul Utama
    words = title.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        if len(" ".join(current_line)) > 24:
            lines.append(" ".join(current_line[:-1]))
            current_line = [word]
    lines.append(" ".join(current_line))
    
    y_offset = 580
    for line in lines:
        draw.text((w // 2, y_offset), line, fill=(255, 255, 255, 255), font=font_title, anchor="mm")
        y_offset += 75
        
    # Garis pemisah tipis
    draw.line([(card_x1 + 100, y_offset + 20), (card_x2 - 100, y_offset + 20)], fill=(255, 255, 255, 30), width=2)
    y_offset += 80
    
    # 7. Tulis Poin-Poin Konten Tips (Gunakan Trik Premium jika ada - Revision 3)
    steps = PREMIUM_TRICKS.get(title, [])
    if not steps:
        raw_content = content.replace("!", ".").replace("?", ".").replace(";", ".")
        raw_steps = raw_content.split(".")
        steps = [s.strip() for s in raw_steps if len(s.strip()) > 5]
    
    for idx, step in enumerate(steps[:4]):
        # Pecah baris isi poin agar rapi
        step_words = step.split()
        step_lines = []
        curr = []
        for word in step_words:
            curr.append(word)
            if len(" ".join(curr)) > 34:
                step_lines.append(" ".join(curr[:-1]))
                curr = [word]
        step_lines.append(" ".join(curr))
        
        # Gambar bullet number glowing
        draw.ellipse([card_x1 + 60, y_offset - 25, card_x1 + 110, y_offset + 25], fill=(255, 153, 0, 220))
        draw.text((card_x1 + 85, y_offset), str(idx+1), fill=(15, 8, 29, 255), font=font_body, anchor="mm")
        
        # Tulis teks poin
        text_x = card_x1 + 140
        for line in step_lines:
            draw.text((text_x, y_offset), line, fill=(255, 255, 255, 230), font=font_body, anchor="lm")
            y_offset += 55
        y_offset += 45
        
    # 8. Tulis Call to Action (CTA) & Watermark di bagian bawah
    draw.text((w // 2, h - 250), "Cobain GRATIS sekarang di:", fill=(255, 255, 255, 200), font=font_footer, anchor="mm")
    draw.rounded_rectangle(
        [w//2 - 280, h - 210, w//2 + 280, h - 130],
        radius=20,
        fill=(255, 153, 0, 255) # Bright orange button
    )
    draw.text((w // 2, h - 170), "www.tokcer-ai.com", fill=(255, 255, 255, 255), font=font_logo, anchor="mm")
    
    # Simpan ke berkas PNG
    img.save(output_image_path, "PNG")
    print(f"[Pillow] Visual sukses disimpan ke: {output_image_path}")
    return True

def build_real_video(title, content, output_video_path):
    """
    Fungsi utama untuk membuat video TikTok berkualitas tinggi secara lengkap:
    1. Mengonversi teks ke pidato natural gratis (Edge-TTS) dengan kecepatan yang lambat & natural.
    2. Menggambar poster vertical high-resolution (Pillow).
    3. Menggabungkan keduanya menjadi video .mp4 dengan efek zoom Ken Burns yang stabil (MoviePy).
    """
    temp_audio = "ujangfixing/temp_vo.mp3"
    temp_image = "ujangfixing/temp_bg.png"
    
    # Opening & Outro natural yang smooth tentang Tokcer AI (Revision 2 & 3)
    vo_intro = "Hai Seller! Mau omzet tokomu melesat bareng Tokcer A-I? Yuk, simak tips menarik hari ini! "
    vo_outro = " Yuk Seller, langsung meluncur ke website Tokcer A-I untuk cobain gratis sekarang juga!"
    full_audio_script = vo_intro + title + ". " + content + vo_outro
    
    # Optimasi pengucapan agar tidak dibaca sebagai "tokcerai"
    # Menggunakan "Tokcer E-Ai" agar dibaca "Tokcer E-Ai" (E-Ai / Ey-Ai) secara natural oleh suara id-ID
    pronunciation_script = full_audio_script
    for term in ["Tokcer AI", "Tokcer A-I", "tokcer-ai", "tokcer ai", "Tokcer A.I.", "Tokcer AI.", "Tokcer A - I", "Tokcer A, I"]:
        pronunciation_script = pronunciation_script.replace(term, "Tokcer E-Ai")
    
    # 1. Buat file Audio Speech via Edge-TTS dengan voice ArdiNeural & rate -6% biar natural & tidak robotic (Revision 1)
    print(f"\n[VideoGen] Mengonversi naskah ke Audio Suara Manusia (ArdiNeural, rate -6%, dengan jeda fonetik)...")
    cmd = [
        "python3", "-m", "edge_tts",
        "--voice", "id-ID-ArdiNeural",
        "--rate=-6%",
        "--text", pronunciation_script,
        "--write-media", temp_audio
    ]
    subprocess.run(cmd, check=True)
    
    # 2. Buat file Gambar Visual via Pillow
    draw_premium_backdrop(title, content, temp_image)
    
    # 3. Gabungkan menjadi Video MP4 via MoviePy
    print(f"\n[VideoGen] Menjahit Audio dan Gambar dengan efek Zoom Ken Burns...")
    
    try:
        # Muat audio VO
        vo_clip = AudioFileClip(temp_audio)
        duration = vo_clip.duration
        
        # Gabungkan musik latar jazz halus jika tersedia (Revision 3)
        bg_music_path = "ujangfixing/jazz_bg.mp3"
        bg_music_clip = None
        if os.path.exists(bg_music_path):
            print(f"[VideoGen] Menggabungkan musik latar jazz halus ({bg_music_path})...")
            bg_music_clip = AudioFileClip(bg_music_path)
            # Potong musik agar pas dengan durasi VO, dan kecilkan volumenya ke 0.08 agar tidak menutupi suara VO
            bg_music_clip = bg_music_clip.subclipped(0, duration).with_volume_scaled(0.08)
            final_audio = CompositeAudioClip([vo_clip, bg_music_clip])
        else:
            final_audio = vo_clip
        
        # Muat background PIL Image once
        bg_img = Image.open(temp_image).convert("RGB")
        w, h = bg_img.size # 1080, 1920
        
        # Center-crop frame generator dengan resolusi konstan 1080x1920 (Revision 4)
        def make_frame(t):
            # Scale dari 1.0 ke 1.05 over duration
            scale = 1.0 + 0.05 * (t / duration)
            new_w = int(w * scale)
            new_h = int(h * scale)
            
            # Resize
            resized_img = bg_img.resize((new_w, new_h), Image.Resampling.BILINEAR)
            
            # Center crop ke w x h
            left = (new_w - w) // 2
            top = (new_h - h) // 2
            right = left + w
            bottom = top + h
            
            cropped_img = resized_img.crop((left, top, right, bottom))
            return np.array(cropped_img)
            
        # Buat video clip menggunakan frame generator stabil
        video_clip = VideoClip(make_frame, duration=duration)
        video_clip = video_clip.with_audio(final_audio)
        
        # Render ke disk
        video_clip.write_videofile(
            output_video_path,
            fps=24,
            codec="libx264",
            audio_codec="aac",
            preset="ultrafast", # Render cepat & efisien
            logger=None
        )
        
        # Bersihkan klip memori
        vo_clip.close()
        if bg_music_clip:
            bg_music_clip.close()
        final_audio.close()
        video_clip.close()
        
        print(f"[VideoGen] BERHASIL! Video nyata selesai dirakit: {output_video_path} (Durasi: {duration:.2f}s)")
        return True
    except Exception as e:
        print(f"[ERROR] Gagal menggabungkan video via MoviePy: {e}")
        return False

if __name__ == "__main__":
    t = "3 Trik Hitung HPP Biar Gak Boncos!"
    c = "Poin pertama, catat semua biaya bahan baku secara rinci tanpa ada yang terlewat. Poin kedua, tambahkan biaya operasional seperti listrik, air, dan gaji karyawan. Poin ketiga, tentukan persentase margin keuntungan yang realistis agar harga jual tetap kompetitif."
    build_real_video(t, c, "ujangfixing/sample.mp4")

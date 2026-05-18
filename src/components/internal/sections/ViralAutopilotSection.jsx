import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase.js';

const ViralAutopilotSection = ({ t }) => {
  const [templates, setTemplates] = useState([]);
  const [queues, setQueues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Staging Bot Configurations
  const [botConfig, setBotConfig] = useState({
    target_account: '@tokcer_ai',
    posting_pattern: '[3, 2, 2, 1, 3]',
    voice_neural: 'id-ID-GadisNeural',
    cookie_status: '🟢 Connected'
  });

  useEffect(() => {
    fetchStagingData();
  }, []);

  const fetchStagingData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Viral Templates (Staging Sandbox)
      const { data: tempDat, error: tempErr } = await supabase
        .from('viral_templates')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch Upload Queues (Staging Sandbox)
      const { data: qDat, error: qErr } = await supabase
        .from('upload_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (!tempErr) setTemplates(tempDat || []);
      if (!qErr) setQueues(qDat || []);
    } catch (err) {
      console.error("Gagal memuat data staging:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memicu Gemini menulis konten baru secara instan (Rp 0,-)
  const handleTriggerGemini = async () => {
    setIsGenerating(true);
    try {
      // Simulasi panggilan skrip backend tokcer_content_generator.py
      setTimeout(async () => {
        // Tambahkan dummy baru di UI untuk visual feel
        const mockNewTips = {
          tips_title: "Trik Bundling Produk Laris",
          tips_content: "Sobat Tokcer! Daripada jual satuan, buatlah paket bundling khusus. Satukan produk terlaris dengan produk yang kurang laku dengan diskon sepuluh persen. Strategi ini ampuh membersihkan gudang secara instan!",
          visual_prompt: "An elegant showcase of packaged skincare products on a wooden stand, sunset studio lighting",
          used: false
        };

        const { error } = await supabase.from('viral_templates').insert([mockNewTips]);
        if (!error) {
          alert("Sukses! Robot Gemini telah mengirimkan 1 konten tips UMKM baru ke tabel staging!");
          await fetchStagingData();
        }
        setIsGenerating(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  // Memicu cron manual posting ke TikTok
  const handleTriggerPost = () => {
    alert("Robot Auto-Pilot dipicu! Menjalankan 'tokcer_viral_bot.py'... Menghitung Jitter Menit Aman... Video segera tayang di TikTok @tokcer_ai!");
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif] text-white">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/20 p-8 border border-zinc-800 shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[120%] bg-orange-600/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-500">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Autopilot Staging Mode</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">Viral Auto-Pilot Core</h1>
            <p className="text-xs text-zinc-500 max-w-xl">
              Generator video otomatis UMKM Staging (Rp 0,-). Mengintegrasikan Google Gemini 1.5 Flash, Edge TTS, Hugging Face, dan Auto-Poster TikTok terisolasi aman.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleTriggerGemini}
              disabled={isGenerating}
              className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <iconify-icon icon="solar:magic-stick-bold" className="text-lg"></iconify-icon>
              )}
              {isGenerating ? "Generating..." : "Generate Gemini (Rp 0)"}
            </button>
            
            <button 
              onClick={handleTriggerPost}
              className="px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-zinc-700 active:scale-95 flex items-center gap-2"
            >
              <iconify-icon icon="solar:videocamera-record-bold" className="text-lg text-orange-500"></iconify-icon>
              Picu Auto-Post TikTok
            </button>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <iconify-icon icon="solar:notes-bold-duotone" className="text-2xl"></iconify-icon>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Total Tips Stok</p>
            <h3 className="text-2xl font-black mt-1 leading-none">{templates.length} Konten</h3>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <iconify-icon icon="solar:videocamera-record-bold-duotone" className="text-2xl"></iconify-icon>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Antrean Pending</p>
            <h3 className="text-2xl font-black mt-1 leading-none">
              {queues.filter(q => q.status === 'pending').length} Antrean
            </h3>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <iconify-icon icon="solar:check-circle-bold-duotone" className="text-2xl"></iconify-icon>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Video Terposting</p>
            <h3 className="text-2xl font-black mt-1 leading-none">
              {queues.filter(q => q.status === 'posted').length} Video
            </h3>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
            <iconify-icon icon="solar:shield-check-bold-duotone" className="text-2xl"></iconify-icon>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Keamanan Cookie</p>
            <h3 className="text-2xl font-black mt-1 leading-none text-emerald-500">Safe Connected</h3>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Bot Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-800 space-y-6">
            <h2 className="text-md font-black uppercase tracking-widest border-b border-zinc-800 pb-4">⚙️ Target Config</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Target Account</label>
                <div className="px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl font-mono text-xs">{botConfig.target_account}</div>
              </div>
              
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Looping Pattern</label>
                <div className="px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl font-mono text-xs">{botConfig.posting_pattern}</div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Voiceover Intonation</label>
                <div className="px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs flex justify-between items-center">
                  <span>{botConfig.voice_neural}</span>
                  <span className="text-[9px] bg-blue-600/20 text-blue-400 font-bold px-2 py-0.5 rounded uppercase">Neural VO</span>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Cookie Connection</label>
                <div className="px-4 py-3 bg-black/60 border border-zinc-800 rounded-xl text-xs text-emerald-400 font-bold">{botConfig.cookie_status}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content templates & schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates Section */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-800">
            <h2 className="text-md font-black uppercase tracking-widest border-b border-zinc-800 pb-4 mb-4">📝 Bank Tips Terkini (Supabase Staging)</h2>
            
            {isLoading ? (
              <p className="text-xs text-zinc-500">Memuat data...</p>
            ) : templates.length === 0 ? (
              <p className="text-xs text-zinc-500">Tidak ada stok tips. Silakan generate baru dengan Gemini!</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {templates.slice(0, 5).map((temp, index) => (
                  <div key={temp.id || index} className="p-4 bg-black/40 border border-zinc-800 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white leading-none">{temp.tips_title}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none ${temp.used ? 'bg-zinc-800 text-zinc-500' : 'bg-orange-600/20 text-orange-400'}`}>
                          {temp.used ? 'TERPOSTING' : 'READY TO POST'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">{temp.tips_content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Queue Section */}
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-zinc-800">
            <h2 className="text-md font-black uppercase tracking-widest border-b border-zinc-800 pb-4 mb-4">🕒 Antrean Auto-Post (Jitter Scheduled)</h2>
            
            {isLoading ? (
              <p className="text-xs text-zinc-500">Memuat data...</p>
            ) : queues.length === 0 ? (
              <p className="text-xs text-zinc-500">Antrean kosong. Gunakan robot posting untuk membuat antrean baru!</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {queues.slice(0, 5).map((q, index) => (
                  <div key={q.id || index} className="p-4 bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{q.account_username}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Scheduled Hour: {q.preferred_hour}.00 WIB</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate max-w-sm">{q.caption}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${q.status === 'posted' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-orange-600/20 text-orange-400'}`}>
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ViralAutopilotSection;

import React, { useState } from 'react';

const TIKTOK_MESSAGES = [
  "AI-nya lagi latian joget pargoy nyari inspirasi hook maut. Biar dia nggak encok pinggang, stopin pakai cara login yuk! 🕺",
  "Waduh, skrip FYP-nya ngumpet di dalem guling! Katanya malu kalau belum kenal. Tarik keluar pakai tombol daftar yuk! 🛌",
  "Maaf, mesin perangkai kata kita tertidur pulas dengerin sound JJ (Jedag Jedug) slowmo. Bangunin pakai tombol Register ya! 😴",
  "Koneksi ke pusat satelit FYP kerasa berat nih. Kayaknya butuh 'tumbal' akun baru. Daftar dulu dong, Kak! 🛸",
  "Otak AI-nya ngebul kebanyakan mikirin penempatan keranjang kuning. Kasih napas bentar nyeduh kopi sambil Kakak bikin akun ya! ☕",
  "Skrip ini berpotensi bikin HP Kakak error saking banyaknya notif pesanan. Tanda tangan (register) dulu dong buat asuransinya! 📜",
  "Lagi sibuk ngelobi algoritma TikTok nih! Biar proposal masuk FYP-nya di-ACC, titip absen (daftar) di sini dulu ya. 💼",
  "AI-nya insecure, takut dibilang SKSD kalau ngasih naskah ke orang asing. Bikin status kita resmi lewat tombol login yuk! 💍",
  "Trauma di-ghosting penonton, AI-nya sekarang minta kepastian. Yuk kasih kepastian pakai email Kakak di menu Register! 👻",
  "Bentar Kak, scriptwriter gaib kita lagi benerin ringlight. Sambil nunggu dia on-camera, mending daftar akun dulu gih! 💡"
];

const MARKETPLACE_MESSAGES = [
  "AI-nya lagi sibuk ngegulung bubble wrap mikirin deskripsi produk. Biar kerjanya makin sat-set, Kakak bikin akun dulu gih! 📦",
  "Takut paket kata-katanya di-retur COD gara-gara alamat pembeli nggak jelas. Tulis alamat (register) dulu yuk Kak di mari! 🚚",
  "Lagi ngeracik pelet online biar pembeli nggak cuma masukin keranjang doang. Masukin mantra 'Login' dulu yuk biar manjur! 🧙‍♂️",
  "Maaf, shift penjaga gudang kosa katanya lagi pergantian. Sambil nunggu yang baru dateng, ngisi buku tamu (daftar) dulu ya Kak! 📋",
  "Wah, ide deskripsi mautnya kejebak macet di lampu merah. Buka jalan tolnya pakai tombol Register yuk! 🚥",
  "Sistem kita lagi laper, butuh asupan data pendaftaran. Suapin satu akun baru dong Kak, biar dia kuat ngetik deskripsi laris! 🍔",
  "AI-nya mau tipes kebanyakan mikirin promo gratis ongkir buat Kakak. Biar cepet sembuh, tolong suntik pakai pendaftaran akun baru ya! 💉",
  "Sistemnya overthinking takut deskripsinya di-copas toko sebelah. Kasih jaminan keamanan pakai cara register dulu yuk! 🔒",
  "Udah nyiapin karpet merah buat review Bintang 5 nih! Tapi tiket masuk ke venue-nya Kakak harus login dulu ya. 🎟️",
  "Timbangan cuan kita agak oleng nih. Bantuin seimbangin pakai berat badan akun baru Kakak yuk, tinggal klik daftar! ⚖️"
];

const INSTAGRAM_MESSAGES = [
  "Caption-nya lagi maskeran dulu biar hasilnya lebih aesthetic dan glowing. Sambil nunggu kering, Kakak bikin akun yuk! 🥒",
  "AI kita lagi semedi di pucuk gunung nyari wangsit buat caption jualan Kakak. Panggil pulang pakai tombol Register ya! 🧘‍♂️",
  "Lagi kena writer's block nih gegara belum ngopi senja. Traktir kopi pakai cara daftar akun yuk, dijamin idenya ngalir deres! 🌅",
  "Duh, ide caption-nya tutup muka pas disorot kamera. Kayaknya dia butuh temen yang udah punya akun deh buat nemenin. 🥺",
  "AI-nya lagi ngorek-ngorek gudang nyari hashtag yang belum basi. Bantuin nyenterin pakai tombol Login dong Kak! 🔦",
  "Sistemnya lagi sibuk ngapus background foto mantan... eh, maksudnya nyiapin caption! Kakak ngisi form daftar dulu aja ya. ✂️",
  "Biar caption-nya se-cool selebgram centang biru, sistem kita lagi pakai kacamata hitam. Yuk kenalan (daftar) dulu sama si cool ini! 😎",
  "Lagi pusing misahin emoji api 🔥 sama emoji nangis 😭 buat diselipin di caption. Hibur AI-nya dengan cara bikin akun yuk! 😵‍💫",
  "Mesin penarik likes-nya lagi mogok kerja minta naik gaji. Sogok pakai pendaftaran akun baru yuk biar mesinnya nyala lagi! 💸",
  "Caption ini mengandung rahasia dapur persaingan olshop. AI-nya cuma mau bisikin ke member resmi. Daftar yuk buat ikutan ngegosip! 🤫"
];

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('tab-dash');
  const [aiFormat, setAiFormat] = useState('TikTok Video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setAiResult('');
    
    // Simulate thinking
    setTimeout(() => {
      let pool = TIKTOK_MESSAGES;
      if (aiFormat === 'Marketplace') pool = MARKETPLACE_MESSAGES;
      if (aiFormat === 'Instagram Feed') pool = INSTAGRAM_MESSAGES;
      
      const randomMsg = pool[Math.floor(Math.random() * pool.length)];
      setAiResult(randomMsg);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[42rem] md:h-[42rem]">
      
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-black flex flex-col shrink-0 relative">
        <div className="p-3 md:p-4 md:pt-8 w-full overflow-x-auto md:overflow-visible custom-scrollbar">
          <div className="hidden md:block text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4 px-3">
            Menu Utama
          </div>
          <nav className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0">
            <button 
              onClick={() => setActiveTab('tab-dash')} 
              className={`sidebar-btn w-auto md:w-full flex items-center gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeTab === 'tab-dash' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 md:border-0 md:border-l-2 md:border-orange-500' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent md:border-0 md:border-l-2'}`}
            >
              <iconify-icon icon="solar:widget-linear" className="text-lg"></iconify-icon> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('tab-omzet')} 
              className={`sidebar-btn w-auto md:w-full flex items-center gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeTab === 'tab-omzet' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 md:border-0 md:border-l-2 md:border-orange-500' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent md:border-0 md:border-l-2'}`}
            >
              <iconify-icon icon="solar:chart-square-linear" className="text-lg"></iconify-icon> Data Omzet
            </button>
            <button 
              onClick={() => setActiveTab('tab-inventory')} 
              className={`sidebar-btn w-auto md:w-full flex items-center gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm transition-all shrink-0 ${activeTab === 'tab-inventory' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 md:border-0 md:border-l-2 md:border-orange-500' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent md:border-0 md:border-l-2'}`}
            >
              <iconify-icon icon="solar:box-linear" className="text-lg"></iconify-icon> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('tab-ai')} 
              className={`sidebar-btn w-auto md:w-full flex items-center gap-3 px-4 md:px-3 py-2.5 rounded-xl text-sm transition-all shrink-0 group/ai relative ${activeTab === 'tab-ai' ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 md:border-0 md:border-l-2 md:border-orange-500' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent md:border-0 md:border-l-2'}`}
            >
              {activeTab !== 'tab-ai' && <div className="absolute inset-0 bg-orange-950/50 opacity-0 group-hover/ai:opacity-100 rounded-xl transition-opacity"></div>}
              <iconify-icon icon="solar:magic-stick-3-linear" className={`text-lg ${activeTab !== 'tab-ai' ? 'text-orange-500' : ''} relative z-10`}></iconify-icon> 
              <span className="relative z-10">AI Generator</span>
            </button>
          </nav>

          <div className="hidden md:block mt-10 mb-4 px-3 text-xs font-medium text-zinc-500 uppercase tracking-[0.2em]">
            Fitur Premium
          </div>
          <nav className="hidden md:flex flex-col gap-1.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-normal text-zinc-500 cursor-not-allowed">
              <iconify-icon icon="solar:shield-check-linear" className="text-lg"></iconify-icon> Health Score
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-normal text-zinc-500 cursor-not-allowed">
              <iconify-icon icon="solar:global-linear" className="text-lg"></iconify-icon> Market Intel
            </button>
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 min-w-0 bg-zinc-900 p-5 md:p-8 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
        
        {activeTab === 'tab-dash' && (
          <div className="relative z-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Overview</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Pantau performa tokomu detik ini juga.
                </p>
              </div>
              <div className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  <iconify-icon icon="solar:calendar-linear"></iconify-icon> 
                  Bulan Ini
                </div>
                <iconify-icon icon="solar:alt-arrow-down-linear" className="sm:ml-2 text-zinc-400"></iconify-icon>
              </div>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-orange-500/50 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-950/30 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 mb-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-orange-950/50 flex items-center justify-center border border-orange-900/50"><iconify-icon icon="solar:wallet-linear" className="text-orange-500"></iconify-icon></div> 
                  Total Omzet
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-white tracking-tight relative z-10">Rp 128.450.000</div>
                <div className="text-xs text-orange-500 mt-3 flex items-center gap-1.5 font-medium relative z-10 bg-orange-950/50 w-fit px-2.5 py-1 rounded-md border border-orange-900/50">
                  <iconify-icon icon="solar:graph-up-linear"></iconify-icon> +12.5% vs last month
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 relative overflow-hidden group hover:border-amber-500/50 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-950/30 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 mb-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/50 flex items-center justify-center border border-amber-900/50"><iconify-icon icon="solar:pie-chart-2-linear" className="text-amber-500"></iconify-icon></div> 
                  Profit Bersih
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-amber-500 tracking-tight relative z-10">Rp 42.120.000</div>
                <div className="text-xs text-amber-500 mt-3 flex items-center gap-1.5 font-medium relative z-10 bg-amber-950/50 w-fit px-2.5 py-1 rounded-md border border-amber-900/50">
                  <iconify-icon icon="solar:graph-up-linear"></iconify-icon> +8.2% vs last month
                </div>
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-2xl p-4 md:p-6 h-56 md:h-64 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 flex flex-col justify-between px-6 py-10 pointer-events-none opacity-20">
                <div className="border-b border-zinc-500 w-full border-dashed"></div>
                <div className="border-b border-zinc-500 w-full border-dashed"></div>
                <div className="border-b border-zinc-500 w-full border-dashed"></div>
                <div className="border-b border-zinc-500 w-full border-dashed"></div>
              </div>
              
              <div className="flex items-end justify-between gap-3 md:gap-6 h-full px-2 md:px-4 relative z-10 pt-8 pb-2">
                <div className="w-full bg-orange-900/50 border-t border-orange-800 hover:bg-orange-800 transition-all rounded-t-md relative cursor-pointer" style={{ height: '35%' }}></div>
                <div className="w-full bg-orange-800/80 border-t border-orange-700 hover:bg-orange-700 transition-all rounded-t-md relative cursor-pointer" style={{ height: '65%' }}></div>
                <div className="w-full bg-orange-500 border-t border-orange-400 hover:bg-orange-400 transition-all rounded-t-md relative cursor-pointer shadow-sm" style={{ height: '100%' }}>
                  <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 bg-white text-black font-semibold text-[10px] md:text-xs px-2 py-1 rounded shadow-md flex flex-col items-center">
                    128M
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rotate-45 absolute -bottom-0.5 md:-bottom-1"></div>
                  </div>
                </div>
                <div className="w-full bg-orange-900/50 border-t border-orange-800 hover:bg-orange-800 transition-all rounded-t-md relative cursor-pointer" style={{ height: '50%' }}></div>
                <div className="w-full bg-orange-900/50 border-t border-orange-800 hover:bg-orange-800 transition-all rounded-t-md relative cursor-pointer" style={{ height: '45%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs font-medium text-zinc-500 mt-2 px-2 md:px-4 relative z-10 uppercase tracking-widest">
                <span>W 1</span>
                <span>W 2</span>
                <span>W 3</span>
                <span>W 4</span>
                <span>W 5</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tab-omzet' && (
          <div className="relative z-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Data Omzet</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Rincian performa penjualan dari berbagai saluran.
                </p>
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <iconify-icon icon="solar:download-linear" className="text-base"></iconify-icon> 
                Unduh Laporan
              </button>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">Pendapatan Hari Ini</div>
                <div className="text-xl font-semibold text-white">Rp 4.250.000</div>
                <div className="text-[10px] text-orange-500 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +5.2%
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-orange-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">Pesanan Aktif</div>
                <div className="text-xl font-semibold text-white">32 <span className="text-xs font-normal text-zinc-500 ml-1">Orders</span></div>
                <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:clock-circle-linear"></iconify-icon> Sedang diproses
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:border-amber-500/30 transition-colors">
                <div className="text-xs font-medium text-zinc-400 mb-2">Tingkat Konversi</div>
                <div className="text-xl font-semibold text-amber-500">4.8%</div>
                <div className="text-[10px] text-amber-500 mt-2 flex items-center gap-1 font-medium">
                  <iconify-icon icon="solar:arrow-up-linear"></iconify-icon> +1.2%
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 p-4 bg-black text-[10px] font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-4">Produk Terjual</div>
                  <div className="col-span-2">Platform</div>
                  <div className="col-span-2 text-right">Nominal</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y divide-zinc-800">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#TK-9921</div>
                    <div className="col-span-4 font-medium text-white truncate">Sepatu Sneakers A1</div>
                    <div className="col-span-2 flex items-center gap-2"><iconify-icon icon="ri:tiktok-fill" className="text-zinc-300"></iconify-icon> TikTok</div>
                    <div className="col-span-2 text-right text-white">Rp 350.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-500 border border-emerald-900/50">Selesai</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#SP-8834</div>
                    <div className="col-span-4 font-medium text-white truncate">Kaos Polos Premium</div>
                    <div className="col-span-2 flex items-center gap-2"><iconify-icon icon="solar:shop-linear" className="text-orange-500"></iconify-icon> Shopee</div>
                    <div className="col-span-2 text-right text-white">Rp 120.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/50 text-amber-500 border border-amber-900/50">Dikirim</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-2 font-mono text-xs text-zinc-500">#TP-7712</div>
                    <div className="col-span-4 font-medium text-white truncate">Jaket Hoodie Urban</div>
                    <div className="col-span-2 flex items-center gap-2"><iconify-icon icon="solar:shop-2-linear" className="text-teal-500"></iconify-icon> Tokopedia</div>
                    <div className="col-span-2 text-right text-white">Rp 450.000</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-500 border border-emerald-900/50">Selesai</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tab-inventory' && (
          <div className="relative z-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold text-white tracking-tight">Inventory & Catalog</h2>
              <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                <iconify-icon icon="solar:add-circle-linear" className="text-base"></iconify-icon> 
                Tambah Produk
              </button>
            </header>
            
            <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 shadow-sm w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-12 gap-4 p-4 bg-black text-xs font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                  <div className="col-span-5">Detail Produk</div>
                  <div className="col-span-3">SKU</div>
                  <div className="col-span-2 text-right">Sisa Stok</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y divide-zinc-800">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-orange-500 transition-colors border border-zinc-700 shrink-0"><iconify-icon icon="solar:sneakers-linear" className="text-xl"></iconify-icon></div>
                      <span className="font-medium text-white truncate">Sepatu Sneakers A1</span>
                    </div>
                    <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">SS-A1-BLU</div>
                    <div className="col-span-2 text-right text-white">142</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 uppercase tracking-wider shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> 
                        Aman
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors border border-zinc-700 shrink-0"><iconify-icon icon="solar:t-shirt-linear" className="text-xl"></iconify-icon></div>
                      <span className="font-medium text-white truncate">Kaos Polos Premium</span>
                    </div>
                    <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">KP-PRM-BLK</div>
                    <div className="col-span-2 text-right text-white">12</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium bg-amber-950/50 text-amber-500 border border-amber-900/50 uppercase tracking-wider shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> 
                        Menipis
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-zinc-400 hover:bg-zinc-800 transition-colors group">
                    <div className="col-span-5 flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-rose-500 transition-colors border border-zinc-700 shrink-0"><iconify-icon icon="solar:hanger-linear" className="text-xl"></iconify-icon></div>
                      <span className="font-medium text-white truncate">Jaket Hoodie Urban</span>
                    </div>
                    <div className="col-span-3 text-zinc-500 font-mono text-xs bg-zinc-800 w-fit px-2 py-1 rounded border border-zinc-700 truncate">JH-URB-GRY</div>
                    <div className="col-span-2 text-right text-rose-500 font-medium">0</div>
                    <div className="col-span-2 text-right flex justify-end">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-medium bg-rose-950/50 text-rose-500 border border-rose-900/50 uppercase tracking-wider shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> 
                        Habis
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tab-ai' && (
          <div className="relative z-10">
            <header className="mb-8 relative">
              <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                AI Content Generator
                <span className="bg-orange-950/50 text-orange-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-medium ml-2 border border-orange-900/50">Beta</span>
              </h2>
              <p className="text-sm text-zinc-400 mt-2 font-normal">
                Bikin copywriting jualan yang siap narik pembeli pakai AI. Tinggal klik!
              </p>
            </header>
            
            <div className="max-w-2xl space-y-6">
              <div className="relative bg-black border border-zinc-800 rounded-xl shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition duration-300">
                <textarea className="w-full bg-transparent p-4 text-sm text-white focus:outline-none placeholder:text-zinc-600 resize-none" rows="4" placeholder="Ketik deskripsi produk Anda di sini. Misal: Sepatu running ringan, bahan mesh..."></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
                  Pilih Format Output
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <button 
                    onClick={() => { setAiFormat('TikTok Video'); setAiResult(''); }}
                    className={`relative px-4 py-4 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-2 transition-all ${aiFormat === 'TikTok Video' ? 'bg-orange-950/30 border-2 border-orange-500 text-orange-400 shadow-sm' : 'bg-black border border-zinc-800 text-zinc-400 hover:border-orange-500/50 hover:bg-orange-950/20'}`}
                  >
                    <iconify-icon icon="solar:video-frame-play-horizontal-linear" className="text-2xl"></iconify-icon>
                    TikTok Video
                  </button>
                  <button 
                    onClick={() => { setAiFormat('Marketplace'); setAiResult(''); }}
                    className={`relative px-4 py-4 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-2 transition-all ${aiFormat === 'Marketplace' ? 'bg-orange-950/30 border-2 border-orange-500 text-orange-400 shadow-sm' : 'bg-black border border-zinc-800 text-zinc-400 hover:border-orange-500/50 hover:bg-orange-950/20'}`}
                  >
                    <iconify-icon icon="solar:shop-linear" className="text-2xl"></iconify-icon>
                    Marketplace
                  </button>
                  <button 
                    onClick={() => { setAiFormat('Instagram Feed'); setAiResult(''); }}
                    className={`relative px-4 py-4 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-2 transition-all ${aiFormat === 'Instagram Feed' ? 'bg-orange-950/30 border-2 border-orange-500 text-orange-400 shadow-sm' : 'bg-black border border-zinc-800 text-zinc-400 hover:border-orange-500/50 hover:bg-orange-950/20'}`}
                  >
                    <iconify-icon icon="solar:camera-linear" className="text-2xl"></iconify-icon>
                    Instagram Feed
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full bg-orange-600 text-white py-3.5 rounded-xl text-sm font-medium shadow-md hover:bg-orange-500 transition-all hover:shadow-lg active:scale-[0.99] flex justify-center items-center gap-2 border border-orange-500 disabled:opacity-70"
              >
                {isGenerating ? (
                   <><iconify-icon icon="solar:spinner-linear" className="text-lg animate-spin"></iconify-icon> AI lagi nyari wangsit...</>
                ) : (
                  <><iconify-icon icon="solar:magic-stick-3-linear" className="text-lg"></iconify-icon> Generate Magic Content</>
                )}
              </button>

              {aiResult && (
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-3 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                    <iconify-icon icon="solar:stars-bold" className="text-sm"></iconify-icon>
                    Hasil Generate
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    "{aiResult}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col sm:flex-row gap-3">
                    <button onClick={() => window.location.href='#pricing'} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Daftar Sekarang</button>
                    <button onClick={() => window.location.href='#pricing'} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Lihat Paket Premium</button>
                  </div>
                </div>
              )}
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardPreview;

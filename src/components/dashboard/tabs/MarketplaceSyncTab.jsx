import React from 'react';

const MarketplaceSyncTab = ({ t, lang }) => {
  const platforms = [
    { 
      id: 'tiktok', 
      name: 'TikTok Shop', 
      icon: 'ri:tiktok-fill', 
      color: 'text-white', 
      bg: 'bg-zinc-800', 
      status: 'Ready to Connect',
      desc: 'Sync orders, products, and analytics from TikTok Shop Seller Center.'
    },
    { 
      id: 'shopee', 
      name: 'Shopee', 
      icon: 'simple-icons:shopee', 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10', 
      status: 'Ready to Connect',
      desc: 'Connect your Shopee store to automate order management.'
    },
    { 
      id: 'tokopedia', 
      name: 'Tokopedia', 
      icon: 'solar:shop-2-linear', 
      color: 'text-teal-400', 
      bg: 'bg-teal-500/10', 
      status: 'Ready to Connect',
      desc: 'Integrate Tokopedia Power Merchant or Official Store data.'
    },
    { 
      id: 'lazada', 
      name: 'Lazada', 
      icon: 'solar:clapperboard-edit-linear', 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      status: 'Coming Soon',
      desc: 'Lazada integration is currently in development.'
    }
  ];

  return (
    <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-semibold text-white tracking-tight">Marketplace Sync</h2>
        <p className="text-sm text-zinc-400 mt-1">Hubungkan toko Anda untuk sinkronisasi data otomatis via oAuth.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((p) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-700 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform`}>
                <iconify-icon icon={p.icon} className={`text-2xl ${p.color}`}></iconify-icon>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                p.status === 'Ready to Connect' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-zinc-500 border-zinc-800 bg-zinc-800/50'
              }`}>
                {p.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{p.name}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-6">{p.desc}</p>
            
            <button 
              disabled={p.status === 'Coming Soon'}
              onClick={() => alert(`Redirecting to ${p.name} Authorization Center...`)}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                p.status === 'Ready to Connect' 
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <iconify-icon icon="solar:link-bold" className="text-lg"></iconify-icon>
              Connect Now
            </button>
          </div>
        ))}
      </div>

      {/* Manual Data Import Fallback */}
      <div className="mt-12 bg-orange-600/5 border border-orange-500/10 rounded-2xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <iconify-icon icon="solar:document-add-bold" className="text-3xl text-orange-500"></iconify-icon>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Belum punya akses API?</h3>
          <p className="text-sm text-zinc-400 mb-8">Anda tetap bisa mengisi dashboard dengan mengunggah data pesanan dan produk secara manual melalui file CSV/Excel.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
              onClick={() => window.location.href = '#'} 
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border border-zinc-700 transition-all flex items-center gap-2"
             >
                <iconify-icon icon="solar:download-minimalistic-linear" className="text-lg text-orange-500"></iconify-icon>
                Download Templates
             </button>
             <button 
              onClick={() => alert("Silakan buka tab Revenue atau Inventory untuk melakukan Import.")}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2"
             >
                <iconify-icon icon="solar:upload-minimalistic-linear" className="text-lg"></iconify-icon>
                Start Manual Import
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSyncTab;

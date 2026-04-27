import React from 'react';

const DashboardSupport = ({ t }) => {
  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight">{t('supportCenter')}</h2>
        <p className="text-sm text-zinc-400 mt-1">{t('howCanWeHelp')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-600/10 flex items-center justify-center border border-orange-500/20">
            <iconify-icon icon="solar:chat-round-dots-linear" className="text-orange-500 text-2xl"></iconify-icon>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Live Chat Support</h3>
            <p className="text-xs text-zinc-500 mb-4">Konsultasi langsung dengan tim ahli Tokcer AI (09:00 - 21:00 WIB).</p>
            <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl text-xs font-bold transition-all">
              Mulai Chat Sekarang
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
            <iconify-icon icon="solar:book-linear" className="text-blue-500 text-2xl"></iconify-icon>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Pusat Bantuan (FAQ)</h3>
            <p className="text-xs text-zinc-500 mb-4">Cari jawaban cepat untuk kendala teknis dan cara penggunaan fitur.</p>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-xs font-bold transition-all border border-zinc-700">
              Buka Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupport;

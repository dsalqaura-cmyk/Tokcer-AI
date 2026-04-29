import React from 'react';

const UserQuickViewModal = ({ 
  t, 
  showUserStats, 
  setShowUserStats 
}) => {
  if (!showUserStats) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
       <div className="bg-zinc-900 rounded-[2.5rem] max-w-4xl w-full p-10 border border-zinc-800 relative">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{showUserStats.name} {t('details')}</h2>
                <button onClick={() => setShowUserStats(null)} className="text-zinc-500 hover:text-white transition-all">
                    <iconify-icon icon="solar:close-circle-bold" className="text-3xl"></iconify-icon>
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('revenue')}</p>
                    <p className="text-xl font-black text-white">{showUserStats.stats.omzet}</p>
                </div>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('healthScore')}</p>
                    <p className="text-xl font-black text-green-500">{showUserStats.stats.health}%</p>
                </div>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-zinc-600 text-[10px] font-black uppercase mb-2">{t('orders')}</p>
                    <p className="text-xl font-black text-white">{showUserStats.stats.orders}</p>
                </div>
            </div>
       </div>
    </div>
  );
};

export default UserQuickViewModal;

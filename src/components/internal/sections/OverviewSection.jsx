import React from 'react';

const OverviewSection = ({ 
  t, 
  revenuePeriod, 
  setRevenuePeriod, 
  chartRef, 
  RECENT_ACTIVITY 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 mb-8 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-600/[0.03] pointer-events-none"></div>
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="font-black text-xl text-white uppercase tracking-tight">{t('financialHub')}</h3>
            <p className="text-sm text-zinc-500 font-medium">Daily income, payouts, and net profit analytics</p>
          </div>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {['daily', 'weekly', 'monthly'].map(p => (
              <button key={p} onClick={() => setRevenuePeriod(p)} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${revenuePeriod === p ? 'bg-zinc-800 text-blue-400 shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}>{t(p)}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('grossIncome')}</p>
            <h2 className="text-2xl font-black text-white tracking-tighter">Rp 82.5M</h2>
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[9px] font-black bg-green-500/10 text-green-500 px-2 py-0.5 rounded tracking-widest">+15.2%</span>
            </div>
          </div>
          <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('partnerPayouts')}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">{t('paid')}</p>
                <h2 className="text-xl font-black text-white tracking-tighter">Rp 15.2M</h2>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-amber-500 uppercase mb-1">{t('pending')}</p>
                <h2 className="text-xl font-black text-amber-500 tracking-tighter">Rp 6.2M</h2>
              </div>
            </div>
          </div>
          <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('activePartners')}</p>
            <h2 className="text-2xl font-black text-white tracking-tighter">124</h2>
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[9px] font-black bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded tracking-widest">+4 New</span>
            </div>
          </div>
          <div className="p-6 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 text-white">
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{t('netProfit')}</p>
            <h2 className="text-2xl font-black tracking-tighter">Rp 56.9M</h2>
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[9px] font-black bg-white/20 text-white px-2 py-0.5 rounded tracking-widest">68.9%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-white uppercase tracking-tight">{t('tierDist')}</h3>
            <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-tighter">{t('liveMonitor')}</span>
          </div>
          <div className="flex items-center gap-8 h-40">
            <div className="w-1/3 h-full relative">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="w-2/3 grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Platinum', color: 'bg-blue-600', count: 18 },
                { label: 'Gold', color: 'bg-amber-400', count: 31 },
                { label: 'Silver', color: 'bg-zinc-400', count: 43 },
                { label: 'Bronze', color: 'bg-orange-600', count: 32 }
              ].map((t_item) => (
                <div key={t_item.label} className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${t_item.color}`}></span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t_item.label}</span>
                  </div>
                  <span className="font-black text-white text-xs">{t_item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
            <h3 className="font-black text-white uppercase tracking-tight mb-6">{t('recentActivity')}</h3>
            <div className="space-y-6">
                {RECENT_ACTIVITY.map((act, i) => (
                    <div key={i} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${act.type === 'payment' ? 'bg-green-500' : act.type === 'user' ? 'bg-blue-500' : act.type === 'partner' ? 'bg-amber-500' : 'bg-red-500'}`}>
                            <iconify-icon icon={act.type === 'payment' ? 'solar:dollar-bold' : act.type === 'user' ? 'solar:user-bold' : act.type === 'partner' ? 'solar:handshake-bold' : 'solar:bug-bold'} className="text-[10px] text-white"></iconify-icon>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-[11px] font-black text-white tracking-tight leading-none uppercase">{act.user}</p>
                                <span className="text-[8px] font-bold text-zinc-600 uppercase">{act.time}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-tight">{act.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;

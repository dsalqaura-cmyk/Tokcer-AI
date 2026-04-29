import React from 'react';

const PartnerSection = ({ 
  t, 
  MOCK_PARTNERS, 
  getTierBadgeClass 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('totalReferrals')}</p>
           <h3 className="text-3xl font-black text-white tracking-tighter">601</h3>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('networkPayouts')}</p>
           <h3 className="text-3xl font-black text-green-500 tracking-tighter">Rp 21.4M</h3>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('newApps')}</p>
           <h3 className="text-3xl font-black text-amber-500 tracking-tighter">12</h3>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-white uppercase tracking-tight">{t('globalNetwork')}</h3>
            <p className="text-xs text-zinc-500 font-medium">Managing affiliates, agencies, and content creators</p>
          </div>
          <button className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
            <iconify-icon icon="solar:user-plus-bold-duotone" className="text-lg"></iconify-icon>
            {t('registerPartner')}
          </button>
        </div>
        <div className="p-8 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
            <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-4 pb-2">{t('partnerEntity')}</th>
                <th className="px-4 pb-2">{t('nicheAudience')}</th>
                <th className="px-4 pb-2 text-center">{t('tier')}</th>
                <th className="px-4 pb-2 text-right">{t('referrals')}</th>
                <th className="px-4 pb-2 text-right">{t('revenue')}</th>
                <th className="px-4 pb-2 text-center">{t('status')}</th>
                <th className="px-4 pb-2 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PARTNERS.map((p) => (
                <tr key={p.id} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                  <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                    <div className="font-black text-white text-sm tracking-tight">{p.name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">{p.id} • {p.email}</div>
                  </td>
                  <td className="p-4 border-y border-zinc-800">
                     <div className="text-[10px] font-black text-white uppercase mb-1">{p.niche}</div>
                     <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{p.followers} FOLLOWERS</div>
                  </td>
                  <td className="p-4 border-y border-zinc-800 text-center">
                     <span className={`${getTierBadgeClass(p.tier)} text-[8px] font-black px-3 py-1 rounded-lg tracking-widest uppercase`}>{p.tier}</span>
                  </td>
                  <td className="p-4 border-y border-zinc-800 text-right font-black text-white text-sm">{p.referrals}</td>
                  <td className="p-4 border-y border-zinc-800 text-right font-black text-blue-400 text-sm">Rp {(p.omzet / 1000000).toFixed(1)}M</td>
                  <td className="p-4 border-y border-zinc-800 text-center">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${p.status === 'Active' ? 'text-green-500 border-green-500/20' : 'text-amber-500 border-amber-500/20'}`}>{p.status}</span>
                  </td>
                  <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <button onClick={() => alert(`Settings for ${p.name}`)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-white hover:text-black rounded-xl border border-zinc-700 transition-all">
                         <iconify-icon icon="solar:settings-bold-duotone" className="text-xl"></iconify-icon>
                       </button>
                       <button onClick={() => alert(`Stats for ${p.name}`)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-blue-600 text-white rounded-xl border border-zinc-700 transition-all">
                         <iconify-icon icon="solar:chart-square-bold-duotone" className="text-xl"></iconify-icon>
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;

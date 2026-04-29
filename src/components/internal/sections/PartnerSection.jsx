import React from 'react';

const PartnerSection = ({ 
  t, 
  adminPartners = [], 
  getTierBadgeClass 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('totalReferrals')}</p>
           <h3 className="text-3xl font-black text-white tracking-tighter">{adminPartners.reduce((acc, p) => acc + (p.referrals || 0), 0)}</h3>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t('networkPayouts')}</p>
           <h3 className="text-3xl font-black text-green-500 tracking-tighter">Rp 0</h3>
        </div>
        <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">ACTIVE PARTNERS</p>
           <h3 className="text-3xl font-black text-amber-500 tracking-tighter">{adminPartners.length}</h3>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-white uppercase tracking-tight">{t('globalNetwork')}</h3>
            <p className="text-xs text-zinc-500 font-medium">Managing affiliates, agencies, and content creators</p>
          </div>
        </div>
        <div className="p-8 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
            <thead className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-4 pb-2">{t('partnerEntity')}</th>
                <th className="px-4 pb-2">CONTACT</th>
                <th className="px-4 pb-2 text-center">{t('tier')}</th>
                <th className="px-4 pb-2 text-right">{t('referrals')}</th>
                <th className="px-4 pb-2 text-center">{t('status')}</th>
                <th className="px-4 pb-2 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {adminPartners.length > 0 ? adminPartners.map((p) => (
                <tr key={p.id} className="bg-zinc-950/50 hover:bg-zinc-800/50 transition-all group">
                  <td className="p-4 rounded-l-2xl border-l border-y border-zinc-800">
                    <div className="font-black text-white text-sm tracking-tight">{p.full_name}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">REF: {p.affiliate_id || 'N/A'}</div>
                  </td>
                  <td className="p-4 border-y border-zinc-800">
                     <div className="text-[10px] font-black text-white uppercase mb-1">{p.email}</div>
                     <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{p.whatsapp || 'No WhatsApp'}</div>
                  </td>
                  <td className="p-4 border-y border-zinc-800 text-center">
                     <span className={`${getTierBadgeClass(p.tier)} text-[8px] font-black px-3 py-1 rounded-lg tracking-widest uppercase`}>{p.tier || 'Bronze'}</span>
                  </td>
                  <td className="p-4 border-y border-zinc-800 text-right font-black text-white text-sm">{p.referrals || 0}</td>
                  <td className="p-4 border-y border-zinc-800 text-center">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${p.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-amber-500 border-amber-500/20'}`}>{p.status?.toUpperCase() || 'ACTIVE'}</span>
                  </td>
                  <td className="p-4 rounded-r-2xl border-r border-y border-zinc-800 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <button onClick={() => alert(`Settings for ${p.full_name}`)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-white hover:text-black rounded-xl border border-zinc-700 transition-all">
                         <iconify-icon icon="solar:settings-bold-duotone" className="text-xl"></iconify-icon>
                       </button>
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-zinc-600 italic text-sm">No partners found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;

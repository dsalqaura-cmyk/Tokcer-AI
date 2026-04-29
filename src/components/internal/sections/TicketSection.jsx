import React from 'react';

const TicketSection = ({ 
  t, 
  MOCK_TICKETS 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8">
          <h3 className="font-black text-white uppercase tracking-tight mb-8">{t('feedbackLoop')}</h3>
          <div className="space-y-4">
            {MOCK_TICKETS.map(t_item => (
              <div key={t_item.id} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center">
                 <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t_item.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'}`}>
                       <iconify-icon icon="solar:shield-warning-bold-duotone" className="text-xl"></iconify-icon>
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase tracking-tight">{t_item.title}</h4>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">BY: {t_item.author} • {t_item.priority} {t('priority')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all">{t('accept')}</button>
                    <button className="px-4 py-2 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all border border-zinc-700">{t('reject')}</button>
                    <div className="h-8 w-px bg-zinc-800 mx-2"></div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-zinc-900 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-all">{t('toUserDb')}</button>
                      <button className="px-3 py-2 bg-zinc-900 text-zinc-400 text-[8px] font-black uppercase tracking-tighter rounded-lg border border-zinc-800 hover:border-amber-500/50 transition-all">{t('toPartnerDb')}</button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
       </div>
    </div>
  );
};

export default TicketSection;

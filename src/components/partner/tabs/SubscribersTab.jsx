import React from 'react';

const SubscribersTab = ({ 
  t, 
  lang, 
  partnerData, 
  getPlanBadge, 
  getRelativeTime, 
  formatCurrency 
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('totalSubs')}</div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter">{partnerData.subscribers.length}</div>
        </div>
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('activeUser')}</div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter">{partnerData.activeUsers}</div>
        </div>
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl border-l-rose-500/50">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('cancelled')}</div>
          <div className="text-3xl font-black text-rose-500 font-mono tracking-tighter">{partnerData.cancelledUsers}</div>
        </div>
        <div className="relative group overflow-hidden bg-emerald-600/10 backdrop-blur-md border border-emerald-500/20 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">{t('performanceBonus')}</div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter">{formatCurrency(partnerData.performanceBonus || 0)}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <div className="w-8 h-0.5 bg-orange-600 rounded-full"></div>
            {t('customerList')}
          </h3>
          <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 uppercase tracking-widest">
            {t('private')} 🔒
          </span>
        </div>

        <div className="bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-[0.25em] border-b border-zinc-800/50">
                  <th className="px-8 py-6">{t('shopName')}</th>
                  <th className="px-8 py-6">{t('plan')}</th>
                  <th className="px-8 py-6">{t('status')}</th>
                  <th className="px-8 py-6">{lang === 'id' ? 'Last Closing' : 'Last Closing'}</th>
                  <th className="px-8 py-6 text-right">{t('commission')}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {partnerData.subscribers.map((s, idx) => (
                  <tr key={s.id} className={`group border-b border-zinc-900/50 hover:bg-white/[0.01] transition-all duration-300 ${idx === partnerData.subscribers.length - 1 ? 'border-none' : ''}`}>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-100 font-black text-[10px] sm:text-xs border border-zinc-700 group-hover:border-orange-500/50 transition-colors">
                          {s.shop_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-zinc-100 text-xs sm:text-sm truncate group-hover:text-white transition-colors">{s.shop_name}</span>
                          <span className="text-[8px] sm:text-[10px] text-zinc-400 font-medium truncate">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm ${getPlanBadge(s.plan)}`}>
                        {s.plan}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <span className={`inline-flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${
                        s.status === 'active' || s.status === 'paid'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : s.status === 'pending'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : s.status === 'warning'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : 'text-zinc-500 bg-zinc-800 border-zinc-700'
                      }`}>
                        <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${s.status === 'active' || s.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {t('status' + s.status.charAt(0).toUpperCase() + s.status.slice(1))}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <span className={`text-[10px] sm:text-xs font-bold ${getRelativeTime(s.created_at) === (lang === 'id' ? 'baru saja' : 'just now') ? 'text-emerald-400' : 'text-zinc-400'}`}>
                        {getRelativeTime(s.created_at)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-right font-mono font-black text-zinc-100 text-[10px] sm:text-sm group-hover:text-emerald-300 transition-colors">
                      {formatCurrency(s.commission_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribersTab;

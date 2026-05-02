import React from 'react';

const SubscribersTab = ({ 
  t, 
  lang, 
  subscribers,
  formatCurrency 
}) => {
  const safeSubs = subscribers || [];
  const activeCount = safeSubs.filter(s => s.status === 'active' || s.status === 'paid').length;
  const cancelledCount = safeSubs.filter(s => s.status === 'cancelled' || s.status === 'returned').length;
  
  // LOGIC: Performance bonus only runs when there are at least 5 closings (Non-Starter)
  const nonStarterActiveCount = safeSubs.filter(s => 
    (s.status === 'active' || s.status === 'paid') && 
    s.plan?.toLowerCase() !== 'starter'
  ).length;

  const totalCommission = nonStarterActiveCount >= 5 
    ? safeSubs.reduce((acc, curr) => acc + (Number(curr.commission_amount) || 0), 0)
    : 0;

  const bonusProgress = Math.min(100, (nonStarterActiveCount / 5) * 100);

  const getPlanBadge = (plan) => {
    switch(plan?.toLowerCase()) {
      case 'ultimate': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'elite': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'pro': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return lang === 'id' ? 'baru saja' : 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + (lang === 'id' ? ' mnt lalu' : 'm ago');
    if (diff < 86400) return Math.floor(diff / 3600) + (lang === 'id' ? ' jam lalu' : 'h ago');
    return Math.floor(diff / 86400) + (lang === 'id' ? ' hari lalu' : 'd ago');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('totalSubs')}</div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter">{safeSubs.length}</div>
        </div>
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('activeUser')}</div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter">{activeCount}</div>
        </div>
        <div className="relative group overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-5 rounded-2xl border-l-rose-500/50">
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">{t('cancelled')}</div>
          <div className="text-3xl font-black text-rose-500 font-mono tracking-tighter">{cancelledCount}</div>
        </div>
        <div className={`relative group overflow-hidden backdrop-blur-md border p-5 rounded-2xl transition-all duration-500 ${nonStarterActiveCount >= 5 ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-zinc-900/40 border-zinc-800/50 grayscale'}`}>
          <div className="flex justify-between items-start mb-3">
            <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${nonStarterActiveCount >= 5 ? 'text-emerald-500' : 'text-zinc-500'}`}>{t('performanceBonus')}</div>
            <iconify-icon icon={nonStarterActiveCount >= 5 ? "solar:lock-unlock-bold-duotone" : "solar:lock-bold-duotone"} className={nonStarterActiveCount >= 5 ? "text-emerald-500" : "text-zinc-500"}></iconify-icon>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tighter mb-4">{formatCurrency(totalCommission)}</div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
              <span>{nonStarterActiveCount >= 5 ? 'Bonus Unlocked' : 'Unlock Progress'}</span>
              <span>{nonStarterActiveCount}/5 Units</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${nonStarterActiveCount >= 5 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`}
                style={{ width: `${bonusProgress}%` }}
              ></div>
            </div>
          </div>
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
                  <th className="px-8 py-6">{lang === 'id' ? 'Terdaftar' : 'Registered'}</th>
                  <th className="px-8 py-6 text-right">{t('commission')}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {safeSubs.map((s, idx) => (
                  <tr key={s.id} className={`group border-b border-zinc-900/50 hover:bg-white/[0.01] transition-all duration-300 ${idx === safeSubs.length - 1 ? 'border-none' : ''}`}>
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

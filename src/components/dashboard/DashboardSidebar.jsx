import React from 'react';

const DashboardSidebar = ({ 
  t, 
  activeMenu, 
  setActiveMenu, 
  setIsSidebarOpen, 
  lang, 
  setLang, 
  profile, 
  handleLogout 
}) => {
  return (
    <aside className="w-full md:w-72 bg-black border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0 relative z-20">
      <div className="p-4 md:p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <iconify-icon icon="solar:bolt-bold-duotone" className="text-white text-xl"></iconify-icon>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tighter leading-none italic uppercase">Tokcer<span className="text-orange-500 font-black">AI</span></h1>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 leading-none mt-0.5">Master Terminal</p>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white transition-colors">
          <iconify-icon icon="solar:close-circle-linear" className="text-2xl"></iconify-icon>
        </button>
      </div>
      
      <div className="p-4 w-full overflow-y-auto custom-scrollbar flex-1">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-4 px-3">
          {t('overview')}
        </div>
        <nav className="flex flex-col gap-1.5 md:gap-2">
          {[
            { id: 'tab-dash', label: t('dashboard'), icon: 'solar:widget-linear' },
            { id: 'tab-omzet', label: t('revenue'), icon: 'solar:chart-square-linear' },
            { id: 'tab-inventory', label: t('inventory'), icon: 'solar:box-linear' },
            { id: 'tab-analytics', label: t('analytics'), icon: 'solar:graph-up-linear' },
            { id: 'tab-ai', label: t('aiGenerator'), icon: 'solar:magic-stick-3-linear', isAI: true },
            { id: 'tab-support', label: t('supportCenter'), icon: 'solar:headphones-round-linear' },
            { id: 'tab-health', label: t('healthScore'), icon: 'solar:shield-check-linear' },
            { id: 'tab-market', label: t('marketIntel'), icon: 'solar:global-linear' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveMenu(item.id); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-xl text-sm transition-all shrink-0 group relative ${activeMenu === item.id ? 'font-medium bg-orange-950/50 text-orange-500 border border-orange-900/50 border-l-2' : 'font-normal text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'}`}
            >
              {item.isAI && activeMenu !== 'tab-ai' && <div className="absolute inset-0 bg-orange-950/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>}
              <iconify-icon icon={item.icon} className={`text-lg ${item.isAI && activeMenu !== 'tab-ai' ? 'text-orange-500' : ''} relative z-10`}></iconify-icon> 
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Language</span>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button onClick={() => { setLang('id'); localStorage.setItem('tokcer_lang', 'id'); }} className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'id' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>ID</button>
            <button onClick={() => { setLang('en'); localStorage.setItem('tokcer_lang', 'en'); }} className={`px-2 py-1 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>EN</button>
          </div>
        </div>

        <div className="mb-4 px-2">
          <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/40 border border-amber-700/40 rounded-xl p-3 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                  <iconify-icon icon="solar:crown-bold" className="text-white text-[10px]"></iconify-icon>
                </div>
                <div>
                  <p className="text-[8px] text-amber-400/80 uppercase tracking-widest font-semibold">{t('planActive')}</p>
                  <p className="text-xs font-bold text-amber-300 leading-none">{t('ultimatePlan')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-zinc-500">{t('aiQuota')}</span>
                <span className="text-white font-bold">{profile?.tokens || 0} / 100</span>
              </div>
              <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(profile?.tokens || 0)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold border border-zinc-700">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'Tokcer User'}</p>
            <p className="text-[10px] text-zinc-500 truncate">{profile?.email || 'user@tokcer-ai.com'}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
          <iconify-icon icon="solar:logout-3-linear" className="text-lg"></iconify-icon>
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

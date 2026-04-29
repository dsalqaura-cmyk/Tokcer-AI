import React from 'react';
import logo from '../../assets/logo.png';

const PartnerHeader = ({ 
  t, 
  partnerData, 
  activeTab, 
  setActiveTab, 
  setIsMobileMenuOpen 
}) => {
  const tabs = ['onboard', 'subscribers', 'leaderboard', 'payment', 'support', 'academy', 'profile'];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Tokcer AI" className="h-9 w-auto" />
              <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">{t('partnerDashboard')}</div>
                <div className="text-xs font-bold text-zinc-400">{partnerData.name}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('activeUser')}: {partnerData.activeUsers}</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90"
            >
              <iconify-icon icon="solar:hamburger-menu-bold-duotone" className="text-2xl text-orange-500"></iconify-icon>
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Navigation - Desktop */}
      <div className="hidden lg:block bg-black/40 backdrop-blur-md border-b border-zinc-800/50 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all group whitespace-nowrap flex-shrink-0 ${
                activeTab === tab 
                  ? "text-orange-500"
                  : "text-zinc-500 hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <iconify-icon icon={
                  tab === 'onboard' ? 'solar:user-plus-bold-duotone' :
                  tab === 'subscribers' ? 'solar:users-group-rounded-bold-duotone' : 
                  tab === 'leaderboard' ? 'solar:ranking-bold-duotone' : 
                  tab === 'payment' ? 'solar:card-transfer-bold-duotone' :
                  tab === 'support' ? 'solar:chat-round-dots-bold-duotone' :
                  tab === 'profile' ? 'solar:user-id-bold-duotone' :
                  'solar:notebook-bold-duotone'
                } className={`text-lg ${activeTab === tab ? 'text-orange-500' : 'text-zinc-600 group-hover:text-zinc-300'}`}></iconify-icon>
                {t(tab)}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-right from-orange-600 to-amber-400 rounded-full shadow-[0_-2px_10px_rgba(234,88,12,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PartnerHeader;

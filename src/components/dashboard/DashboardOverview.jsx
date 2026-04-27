import React from 'react';

const DashboardOverview = ({
  t,
  profile,
  hasConnectedStore,
  timeFilter,
  setTimeFilter,
  showFilterDropdown,
  setShowFilterDropdown,
  platformFilter,
  setPlatformFilter,
  showPlatformDropdown,
  setShowPlatformDropdown
}) => {
  // Dynamic dummy data based on time filter
  let estimasiProfit = "Rp 42.120.000";
  let estimasiOmzet = "Rp 128.450.000";
  
  if (timeFilter === 'Hari Ini') {
    estimasiProfit = "Rp 1.400.000";
    estimasiOmzet = "Rp 4.250.000";
  } else if (timeFilter === '1 Bulan Terakhir') {
    estimasiProfit = "Rp 40.500.000";
    estimasiOmzet = "Rp 120.000.000";
  } else if (timeFilter === '2 Bulan Terakhir') {
    estimasiProfit = "Rp 78.000.000";
    estimasiOmzet = "Rp 230.500.000";
  } else if (timeFilter === '3 Bulan Terakhir') {
    estimasiProfit = "Rp 115.200.000";
    estimasiOmzet = "Rp 340.800.000";
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-2xl font-bold text-white tracking-tight">Halo, {firstName}! 👋</h2>
             {!hasConnectedStore && (
                <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] rounded-full font-bold uppercase tracking-wider animate-pulse">Mode Simulasi</span>
             )}
          </div>
          <p className="text-xs text-zinc-400">{t('monitorShop')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto z-50">
          {/* Platform Filter */}
          <div className="relative w-full sm:w-auto">
            <div
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
                {platformFilter === 'all' ? t('allPlatforms') : platformFilter}
              </div>
              <iconify-icon icon={showPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
            </div>
            {showPlatformDropdown && (
              <div className="absolute top-full left-0 sm:right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] py-1 overflow-hidden">
                {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                  <div
                    key={val}
                    onClick={() => { setPlatformFilter(val); setShowPlatformDropdown(false); }}
                    className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${platformFilter === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                  >
                    {val === 'TikTok' && <iconify-icon icon="ri:tiktok-fill" className="text-sm"></iconify-icon>}
                    {val === 'Shopee' && <iconify-icon icon="simple-icons:shopee" className="text-sm text-orange-500"></iconify-icon>}
                    {val === 'Tokopedia' && <iconify-icon icon="solar:shop-2-linear" className="text-sm text-teal-400"></iconify-icon>}
                    {val === 'all' && <iconify-icon icon="solar:widget-linear" className="text-sm text-orange-400"></iconify-icon>}
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative w-full sm:w-auto">
            <div 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:calendar-linear"></iconify-icon> 
                {t(timeFilter)}
              </div>
              <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
            </div>
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] overflow-hidden">
                <div className="py-1">
                  {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                    <div 
                      key={option}
                      onClick={() => {
                        setTimeFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className={`px-4 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${timeFilter === option ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
                    >
                      {t(option)}
                      {timeFilter === option && <iconify-icon icon="solar:check-circle-bold" className="text-sm"></iconify-icon>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-zinc-400">{t('visitors')}</div>
            <div className="flex h-2 w-2 rounded-full bg-emerald-500 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            </div>
          </div>
          <div className="space-y-3">
             <div className="text-2xl font-bold text-white tracking-tight">1,284</div>
             <div className="text-[10px] text-emerald-500 font-medium">+15.4% vs last period</div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-3">{t('totalOmzet')}</div>
          <div className="text-2xl font-bold text-white tracking-tight">{estimasiOmzet}</div>
          <div className="text-[10px] text-orange-500 font-medium mt-3">+12.5% vs last period</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-amber-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-3">{t('profitBersih')}</div>
          <div className="text-2xl font-bold text-amber-500 tracking-tight">{estimasiProfit}</div>
          <div className="text-[10px] text-amber-500 font-medium mt-3">+8.2% vs last period</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:border-blue-500/30 transition-colors">
          <div className="text-xs font-medium text-zinc-400 mb-3">{t('orders')}</div>
          <div className="text-2xl font-bold text-white tracking-tight">452</div>
          <div className="text-[10px] text-blue-500 font-medium mt-3">+4.8% vs last period</div>
        </div>
      </div>

      <div className="bg-black border border-zinc-800 rounded-2xl p-6 h-64 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-end justify-between gap-4 h-full px-4 relative z-10 pt-8 pb-2">
          <div className="w-full bg-orange-900/50 border-t border-orange-800 h-[35%] rounded-t-md"></div>
          <div className="w-full bg-orange-800/80 border-t border-orange-700 h-[65%] rounded-t-md"></div>
          <div className="w-full bg-orange-500 border-t border-orange-400 h-full rounded-t-md shadow-sm"></div>
          <div className="w-full bg-orange-900/50 border-t border-orange-800 h-[50%] rounded-t-md"></div>
          <div className="w-full bg-orange-900/50 border-t border-orange-800 h-[45%] rounded-t-md"></div>
        </div>
        <div className="flex justify-between text-[10px] font-medium text-zinc-500 mt-2 px-4 uppercase tracking-widest">
          <span>W 1</span><span>W 2</span><span>W 3</span><span>W 4</span><span>W 5</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

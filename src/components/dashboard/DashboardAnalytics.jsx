import React from 'react';

const DashboardAnalytics = ({
  t,
  analyticsPlatform,
  setAnalyticsPlatform,
  showAnalyticsPlatformDropdown,
  setShowAnalyticsPlatformDropdown,
  timeFilter,
  setTimeFilter,
  showFilterDropdown,
  setShowFilterDropdown
}) => {
  return (
    <div className="relative z-10 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">{t('marketAnalytics')}</h2>
          <p className="text-sm text-zinc-400 mt-1">{t('analyticsDesc') || 'Performance analysis, tactical strategy, and profit optimization.'}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto z-50">
          {/* Platform Filter */}
          <div className="relative w-full sm:w-auto">
            <div
              onClick={() => setShowAnalyticsPlatformDropdown(!showAnalyticsPlatformDropdown)}
              className="text-xs text-zinc-300 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm w-full justify-between sm:justify-start"
            >
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:filter-linear" className="text-orange-500"></iconify-icon>
                {analyticsPlatform === 'all' ? t('allPlatforms') : analyticsPlatform}
              </div>
              <iconify-icon icon={showAnalyticsPlatformDropdown ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} className="sm:ml-2 text-zinc-500"></iconify-icon>
            </div>
            {showAnalyticsPlatformDropdown && (
              <div className="absolute top-full left-0 sm:right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-[60] py-1 overflow-hidden">
                {[['all', t('allPlatforms')], ['TikTok', 'TikTok Shop'], ['Shopee', 'Shopee'], ['Tokopedia', 'Tokopedia']].map(([val, label]) => (
                  <div
                    key={val}
                    onClick={() => { setAnalyticsPlatform(val); setShowAnalyticsPlatformDropdown(false); }}
                    className={`px-4 py-2 text-xs cursor-pointer flex items-center gap-2 transition-colors ${analyticsPlatform === val ? 'bg-orange-950/50 text-orange-500 font-medium' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
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
                <iconify-icon icon="solar:calendar-linear" className="text-orange-500"></iconify-icon> 
                {t(timeFilter)}
              </div>
              <iconify-icon icon={showFilterDropdown ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="sm:ml-2 text-zinc-400"></iconify-icon>
            </div>
            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="py-1">
                  {['Hari Ini', 'Bulan Ini', '1 Bulan Terakhir', '2 Bulan Terakhir', '3 Bulan Terakhir'].map((option) => (
                    <div 
                      key={option}
                      onClick={() => { setTimeFilter(option); setShowFilterDropdown(false); }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm h-64 flex flex-col justify-center items-center text-center">
           <iconify-icon icon="solar:chart-square-bold-duotone" className="text-4xl text-zinc-700 mb-4"></iconify-icon>
           <p className="text-zinc-500 text-sm italic">Analytics Visualization Coming Soon</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm h-64 flex flex-col justify-center items-center text-center">
           <iconify-icon icon="solar:graph-bold-duotone" className="text-4xl text-zinc-700 mb-4"></iconify-icon>
           <p className="text-zinc-500 text-sm italic">Predictive Trends Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;

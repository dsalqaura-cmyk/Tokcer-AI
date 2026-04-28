import React from 'react';

const DashboardAnalytics = ({ 
  t, 
  lang, 
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
    <div className="relative z-10 space-y-6">
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

      {/* Platform Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'TikTok Shop', revenue: 'Rp 42.5M', orders: 1240, trend: '+12.5%', color: 'border-zinc-800' },
          { name: 'Shopee', revenue: 'Rp 68.2M', orders: 2150, trend: '+8.2%', color: 'border-orange-500/30' },
          { name: 'Tokopedia', revenue: 'Rp 17.8M', orders: 540, trend: '-2.4%', color: 'border-teal-500/30' },
        ].filter(p => analyticsPlatform === 'all' || p.name.includes(analyticsPlatform)).map((p, i) => (
          <div key={i} className={`bg-zinc-900 border rounded-2xl p-5 shadow-sm transition-all hover:scale-[1.02] ${p.color}`}>
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <iconify-icon icon={p.name === 'TikTok Shop' ? 'ri:tiktok-fill' : p.name === 'Shopee' ? 'simple-icons:shopee' : 'solar:shop-2-linear'} className={`text-xl ${p.name === 'TikTok Shop' ? 'text-white' : p.name === 'Shopee' ? 'text-orange-500' : 'text-teal-400'}`}></iconify-icon>
               </div>
               <div className="flex flex-col items-end">
                 <span className={`text-xs font-bold ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{p.trend}</span>
                 <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Growth</span>
               </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-400">{p.name}</h3>
            <div className="text-3xl font-bold text-white mt-1">{p.revenue}</div>
            <div className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
              <iconify-icon icon="solar:bag-check-bold-duotone" className="text-orange-500"></iconify-icon>
              {p.orders} {t('done')}
            </div>
          </div>
        ))}
      </div>

      {/* AI Strategic Intel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Peak Hours & Ads Optimization */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <iconify-icon icon="solar:bolt-circle-linear" className="text-white text-xl"></iconify-icon>
            </div>
            <h3 className="text-lg font-semibold text-white">{t('strategicIntel')} {analyticsPlatform !== 'all' ? `(${analyticsPlatform})` : ''}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('adsTrafficOpt')}</div>
              <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <iconify-icon icon="solar:clock-circle-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                  <div>
                    <div className="text-xs font-medium text-white">{t('goldenHours')} (19:00 - 22:00)</div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{t('goldenHoursDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <iconify-icon icon="solar:star-circle-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                  <div>
                    <div className="text-xs font-medium text-white">{t('campaignFlashSale')}</div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{t('campaignFlashSaleDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('bundlingPromoIdeas')}</div>
              <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <iconify-icon icon="solar:box-minimalistic-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                  <div>
                    <div className="text-xs font-medium text-white">{t('bundleSneakersKaos')}</div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{t('bundleSneakersKaosDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <iconify-icon icon="solar:gift-linear" className="text-orange-500 mt-0.5"></iconify-icon>
                  <div>
                    <div className="text-xs font-medium text-white">{t('buy2get1')}</div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{t('buy2get1Desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selling Ideas / Market Pulse */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6">{t('marketPulseIdeas')} {analyticsPlatform !== 'all' ? `(${analyticsPlatform})` : ''}</div>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-xl">
              <div className="text-xs font-bold text-orange-500 mb-1">🔥 {t('hotIdea')}</div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">{t('hotIdeaDesc')}</p>
            </div>
            <div className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="text-xs font-bold text-white mb-1">💡 {t('contentTip')}</div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{t('contentTipDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Recommendation Engine */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <iconify-icon icon="solar:magic-stick-3-linear" className="text-8xl text-orange-500"></iconify-icon>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
            <iconify-icon icon="solar:globus-linear" className="text-white"></iconify-icon>
          </div>
          <h3 className="text-lg font-semibold text-white">{t('priceRec')}</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">{t('priceRecDesc')}</p>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Current Status</div>
                <div className="text-xs text-white font-medium">Standard Pricing</div>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Optimized Potential</div>
                <div className="text-xs text-emerald-400 font-bold">+14% Margin</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 border border-zinc-800 rounded-xl p-5 flex flex-col justify-center">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <iconify-icon icon="solar:chart-line-up-bold" className="text-3xl text-emerald-400"></iconify-icon>
              </div>
              <div className="text-4xl font-bold text-white">+Rp 4.2M</div>
              <p className="text-xs text-zinc-400">{t('potentialProfit')}</p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-left">
                <p className="text-[10px] text-zinc-500 leading-relaxed">{t('priceRecTip') || (lang === 'id' ? 'Terapkan rekomendasi harga secara manual melalui platform masing-masing untuk memaksimalkan profit bulan ini.' : 'Apply price recommendations manually through each platform to maximize profit this month.')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
